import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendSMS, formatPhone, smsJobWon, smsJobLost } from "@/lib/twilio";
import { sendConnectionEmail } from "@/lib/email";
import { formatSchedulingSummary } from "@/lib/scheduling";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fromRaw  = formData.get("From") as string;
    const body     = (formData.get("Body") as string || "").trim().toUpperCase();
    if (!fromRaw) return twilioResponse("");
    const from = formatPhone(fromRaw);
    const admin = createServiceClient();
    const { data: examiner } = await admin.from("examiners").select("*").eq("phone", from).maybeSingle();
    if (!examiner) return twilioResponse("You don't appear to be registered with Phlobot.");
    if (body === "STOP" || body === "UNSUBSCRIBE") {
      await admin.from("examiners").update({ active: false }).eq("id", examiner.id);
      return twilioResponse("You've been unsubscribed from Phlobot job alerts.");
    }
    const { data: offer } = await admin.from("job_offers")
      .select("*, job_request:job_requests(*)")
      .eq("examiner_id", examiner.id).eq("response", "pending")
      .order("sms_sent_at", { ascending: false }).limit(1).maybeSingle();
    if (!offer) return twilioResponse("No active job offer found. Stay tuned!");
    const job = offer.job_request as any;
    if (body === "NO" || body === "N") {
      await admin.from("job_offers").update({ response: "no", responded_at: new Date().toISOString() }).eq("id", offer.id);
      return twilioResponse("Got it — passing on this one. We'll text you next time!");
    }
    if (body === "YES" || body === "Y") {
      if (job.status !== "broadcast") {
        const { count } = await admin.from("job_offers").select("*", { count: "exact", head: true }).eq("job_request_id", job.id).eq("response", "yes");
        const position = (count || 0) + 1;
        await admin.from("job_offers").update({ response: "yes", responded_at: new Date().toISOString(), response_position: position }).eq("id", offer.id);
        return twilioResponse(smsJobLost(position));
      }
      const now = new Date().toISOString();
      await admin.from("job_offers").update({ response: "yes", responded_at: now, response_position: 1, minutes_after_winner: 0 }).eq("id", offer.id);
      await admin.from("job_requests").update({ status: "assigned", assigned_examiner_id: examiner.id, assigned_at: now }).eq("id", job.id);
      const { data: advisor } = await admin.from("advisor_profiles").select("*").eq("id", job.advisor_id).single();
      const schedulingSummary = formatSchedulingSummary(job.scheduling_type, job.scheduling_options);
      const jobDetails = { age: job.patient_age, gender: job.patient_gender, zip: job.patient_zip, examType: job.exam_type, schedulingSummary, jobId: job.id };
      await sendSMS(examiner.phone, smsJobWon(jobDetails));
      if (advisor) await sendConnectionEmail({ advisorName: advisor.name, advisorEmail: advisor.email, examinerName: examiner.name, examinerEmail: examiner.email, jobDetails });
      return twilioResponse("");
    }
    return twilioResponse("Reply YES to claim the job or NO to pass. Thanks!");
  } catch (err) {
    console.error("[sms/webhook]", err);
    return twilioResponse("Something went wrong. Please try again.");
  }
}

function twilioResponse(message: string): NextResponse {
  const xml = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
  return new NextResponse(xml, { headers: { "Content-Type": "text/xml" } });
}
