import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// POST — save a waitlist signup from an unsupported area
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, city, state, zip_code, type } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const admin = createServiceClient();

    // Upsert — if they already signed up for this type, update their location info
    const { error } = await admin
      .from("waitlist_signups")
      .upsert(
        {
          email: email.trim().toLowerCase(),
          city: city?.trim() || null,
          state: state?.trim().toUpperCase() || null,
          zip_code: zip_code?.trim() || null,
          type: type || "examiner",
        },
        { onConflict: "email,type" }
      );

    if (error) {
      console.error("[waitlist] insert error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[waitlist] unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET — list all waitlist signups (admin only, protected by middleware)
export async function GET() {
  const admin = createServiceClient();
  const { data: signups } = await admin
    .from("waitlist_signups")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ signups: signups || [] });
}
