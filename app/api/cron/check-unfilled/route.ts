import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendSMS, formatPhone, smsUnfilledAdvisor } from "@/lib/twilio";
import { sendUnfilledEmail } from "@/lib/email";

/**
 * Cron job — runs every hour via Vercel Cron.
 * Finds jobs that have been in "broadcast" status for 24+ hours
 * and notifies the advisor.
 *
 * Set up in vercel.json:
 * { "crons": [{ "path": "/api/cron/check-unfilled", "schedule": "0 * * * *" }] }
 */
export async function GET(request: Request) {
  // Protect with a secret token
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || request.headers.get("authorization");

  if (token !== `Bearer ${process.env.CRON_SECRET}` && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceClient();

  // Find broadcast jobs that are 24+ hours old and haven't been notified yet
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: unfilledJobs } = await admin
    .from("job_requests")
    .select("*, advisor:advisor_profiles(name, email, phone)")
    .eq("status", "broadcast")
    .lt("broadcast_at", cutoff)
    .is("unfilled_notified_at", null);

  if (!unfilledJobs || unfilledJobs.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;

  for (const job of unfilledJobs) {
    const advisor = job.advisor as any;
    if (!advisor) continue;

    // Send SMS if advisor has a phone number
    if (advisor.phone) {
      await sendSMS(formatPhone(advisor.phone), smsUnfilledAdvisor());
    }

    // Send email
    await sendUnfilledEmail({
      advisorName:  advisor.name,
      advisorEmail: advisor.email,
      jobDetails: {
        age:      job.patient_age,
        gender:   job.patient_gender,
        zip:      job.patient_zip,
        examType: job.exam_type,
        jobId:    job.id,
      },
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    // Mark job as unfilled and record notification time
    await admin
      .from("job_requests")
      .update({
        status:               "unfilled",
        unfilled_notified_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    processed++;
  }

  return NextResponse.json({ processed });
}
