import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { parseAndValidatePhone } from "@/lib/twilio";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, name, company_name, email, phone } = body;

    if (!user_id || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Normalize phone to E.164 if provided; store null if absent or unrecognized
    const normalizedPhone = phone ? (parseAndValidatePhone(phone) ?? phone) : null;

    const supabase = createServiceClient();
    const { error } = await supabase.from("advisor_profiles").insert({
      user_id,
      name,
      company_name: company_name || null,
      email,
      phone: normalizedPhone,
    });

    if (error) {
      console.error("[advisors/create]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[advisors/create] unexpected error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
