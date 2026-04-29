import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendSMS, formatPhone, smsJobWon, smsJobLost } from "@/lib/twilio";
import { sendConnectionEmail } from "@/lib/email";
import { formatSchedulingSummary } from "@/lib/scheduling";

/**
 * Twilio SMS Webhook
 *
 * Twilio calls this endpoint when an examiner replies to a job offer SMS.
 * We parse the reply (YES or NO), determine the job, and handle the logic:
 *   - First YES  → win, assign, notify both parties, send connection email
 *   - Later YES  → "too late" message with position + time difference
 *   - NO         → "thanks, passing" and mark offer declined
 *   - STOP       → mark examiner inactive in DB (opt-out)
 *   - START      → re-activate examiner (opt back in)
 *   - HELP       → send CTIA-required support info
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fromRaw  = formData.get("From") as string; // examiner's phone
    const body     = (formData.get("Body") as string || "").trim().toUpperCase();

    if (!fromRaw) {
      return twilioResponse(""); // Twilio requires a TwiML response
    }

    const from = formatPhone(fromRaw);
    const admin = createServiceClient();

    // Find the examiner by phone number
    const { data: examiner } = await admin
      .from("examiners")
      .select("*")
      .eq("phone", from)
      .maybeSingle();

    if (!examiner) {
      // Unknown number — send a generic response
      return twilioResponse("You don't appear to be registered with Phlobot. Questions? Email help@phlobot.com");
    }

    // Handle STOP/UNSUBSCRIBE — mark examiner inactive in DB
    if (body === "STOP" || body === "UNSUBSCRIBE" || body === "CANCEL" || body === "QUIT") {
      await admin.from("examiners").update({ active: false }).eq("id", examiner.id);
      return twilioResponse("You've been unsubscribed from Phlobot job alerts. No further messages will be sent. Reply START to resubscribe.");
    }

    // Handle START/UNSTOP — re-activate examiner
    if (body === "START" || body === "UNSTOP") {
      await admin.from("examiners").update({ active: true }).eq("id", examiner.id);
      return twilioResponse("You've been resubscribed to Phlobot job alerts. You'll receive texts when exam jobs are available near you.");
    }

    // Handle HELP — send CTIA-required support info
    if (body === "HELP") {
      return twilioResponse(
        "Phlobot Examiner Alerts: Job notifications for medical examiners. " +
        "Msg freq varies. Msg&data rates may apply. " +
        "Reply STOP to unsubscribe. For support: help@phlobot.com or phlobot.com"
      );
    }

    // Find this examiner's most recent pending offer
    const { data: offer } = await admin
      .from("job_offers")
      .select("*, job_request:job_requests(*)")
      .eq("examiner_id", examiner.id)
      .eq("response", "pending")
      .order("sms_sent_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!offer) {
      return twilioResponse("No active job offer found for your number. Stay tuned for the next one!");
    }

    const job = offer.job_request as any;

    // Handle NO response
    if (body === "NO" || body === "N") {
      await admin
        .from("job_offers")
        .update({ response: "no", responded_at: new Date().toISOString() })
        .eq("id", offer.id);

      return twilioResponse("Got it — passing on this one. We'll text you when the next job comes up!");
    }

    // Handle YES response
    if (body === "YES" || body === "Y") {
      // Check if job is still open
      if (job.status !== "broadcast") {
        // Job already taken — find position
        const { data: winnerOffer } = await admin
          .from("job_offers")
          .select("responded_at")
          .eq("job_request_id", job.id)
          .eq("response", "yes")
          .order("responded_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        // Count how many YES responses came before this one
        const { count } = await admin
          .from("job_offers")
          .select("*", { count: "exact", head: true })
          .eq("job_request_id", job.id)
          .eq("response", "yes");

        const position = (count || 0) + 1;
        let minutesLate: number | undefined;

        if (winnerOffer?.responded_at) {
          const winTime  = new Date(winnerOffer.responded_at).getTime();
          const nowTime  = Date.now();
          minutesLate = Math.round((nowTime - winTime) / 60000);
        }

        // Record this response
        await admin
          .from("job_offers")
          .update({
            response: "yes",
            responded_at: new Date().toISOString(),
            response_position: position,
            minutes_after_winner: minutesLate,
          })
          .eq("id", offer.id);

        const msg = smsJobLost(position, minutesLate);
        return twilioResponse(msg);
      }

      // JOB IS STILL OPEN — this examiner wins!
      const now = new Date().toISOString();

      // Update the offer as winner (position 1)
      await admin
        .from("job_offers")
        .update({
          response: "yes",
          responded_at: now,
          response_position: 1,
          minutes_after_winner: 0,
        })
        .eq("id", offer.id);

      // Assign the job
      await admin
        .from("job_requests")
        .update({
          status: "assigned",
          assigned_examiner_id: examiner.id,
          assigned_at: now,
        })
        .eq("id", job.id);

      // Get advisor profile for email
      const { data: advisor } = await admin
        .from("advisor_profiles")
        .select("*")
        .eq("id", job.advisor_id)
        .single();

      const schedulingSummary = formatSchedulingSummary(
        job.scheduling_type,
        job.scheduling_options
      );

      const jobDetails = {
        age:               job.patient_age,
        gender:            job.patient_gender,
        zip:               job.patient_zip,
        examType:          job.exam_type,
        schedulingSummary,
        jobId:             job.id,
      };

      // Send confirmation text to winning examiner
      await sendSMS(examiner.phone, smsJobWon(jobDetails));

      // Send connection email to both advisor and examiner
      if (advisor) {
        await sendConnectionEmail({
          advisorName:   advisor.name,
          advisorEmail:  advisor.email,
          examinerName:  examiner.name,
          examinerEmail: examiner.email,
          jobDetails,
        });
      }

      // Respond to Twilio (examiner already got a separate SMS above)
      return twilioResponse("");
    }

    // Unrecognized reply
    return twilioResponse("Reply YES to claim the job or NO to pass. Reply HELP for support or STOP to unsubscribe.");
  } catch (err) {
    console.error("[sms/webhook] unexpected error:", err);
    return twilioResponse("Something went wrong on our end. Please try again.");
  }
}

function twilioResponse(message: string): NextResponse {
  const xml = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}
