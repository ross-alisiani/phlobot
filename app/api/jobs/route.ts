import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { findExaminersForZip } from "@/lib/matching";
import { sendSMS, formatPhone, smsJobOffer } from "@/lib/twilio";
import { formatSchedulingSummary } from "@/lib/scheduling";

export async function POST(request: Request) {
  try {
    // Authenticate advisor
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get advisor profile
    const { data: profile } = await supabase
      .from("advisor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Advisor profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      patient_age,
      patient_gender,
      patient_zip,
      exam_type,
      scheduling_type,
      scheduling_options,
      notes,
    } = body;

    // Validate required fields
    if (!patient_zip || !scheduling_type || !scheduling_options?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const admin = createServiceClient();

    // Create the job request
    const { data: job, error: jobError } = await admin
      .from("job_requests")
      .insert({
        advisor_id: profile.id,
        patient_age,
        patient_gender,
        patient_zip,
        exam_type,
        scheduling_type,
        scheduling_options,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (jobError || !job) {
      console.error("[jobs/create] DB error:", jobError);
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }

    // Increment advisor's monthly count
    await admin
      .from("advisor_profiles")
      .update({ jobs_this_month: profile.jobs_this_month + 1 })
      .eq("id", profile.id);

    // Find matching examiners
    const matches = await findExaminersForZip(patient_zip);

    if (matches.length === 0) {
      // No examiners found — mark as needing attention
      await admin
        .from("job_requests")
        .update({ status: "broadcast", broadcast_at: new Date().toISOString() })
        .eq("id", job.id);

      return NextResponse.json({
        job,
        warning: "No examiners found in this area. We'll notify you.",
      });
    }

    // Build scheduling summary for SMS
    const schedulingSummary = formatSchedulingSummary(scheduling_type, scheduling_options);

    // Send SMS to all matching examiners and record offers
    const smsBody = smsJobOffer(job.id, {
      age: patient_age,
      gender: patient_gender,
      zip: patient_zip,
      examType: exam_type,
      schedulingSummary,
    });

    const offerInserts = [];
    for (const { examiner } of matches) {
      const sent = await sendSMS(formatPhone(examiner.phone), smsBody);
      if (sent) {
        offerInserts.push({
          job_request_id: job.id,
          examiner_id: examiner.id,
        });
      }
    }

    if (offerInserts.length > 0) {
      await admin.from("job_offers").insert(offerInserts);
    }

    // Update job status to broadcast
    await admin
      .from("job_requests")
      .update({ status: "broadcast", broadcast_at: new Date().toISOString() })
      .eq("id", job.id);

    return NextResponse.json({
      job: { ...job, status: "broadcast" },
      examiners_notified: offerInserts.length,
    });
  } catch (err) {
    console.error("[jobs/create] unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET — list jobs for authenticated advisor
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: jobs } = await supabase
    .from("job_requests")
    .select("*")
    .eq("advisor_id", profile.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ jobs: jobs || [] });
}
