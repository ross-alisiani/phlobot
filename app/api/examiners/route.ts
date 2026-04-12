import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { zipToLatLng } from "@/lib/geocoding";
import { formatPhone } from "@/lib/twilio";

// POST — add a new examiner (public signup or admin entry)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, zip_code, radius_miles, notes } = body;

    if (!name || !email || !phone || !zip_code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Geocode the zip
    const coords = await zipToLatLng(zip_code);

    const admin = createServiceClient();

    // Check for duplicate phone
    const { data: existing } = await admin
      .from("examiners")
      .select("id")
      .eq("phone", formatPhone(phone))
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "An examiner with this phone number already exists." },
        { status: 409 }
      );
    }

    const { data, error } = await admin
      .from("examiners")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: formatPhone(phone),
        zip_code: zip_code.trim(),
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        radius_miles: radius_miles || 25,
        notes: notes || null,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("[examiners/create]", error);
      return NextResponse.json({ error: "Failed to create examiner" }, { status: 500 });
    }

    if (!coords) {
      return NextResponse.json({
        examiner: data,
        warning: "Could not geocode ZIP code — examiner won't receive jobs until ZIP is fixed.",
      });
    }

    return NextResponse.json({ examiner: data });
  } catch (err) {
    console.error("[examiners/create] unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET — list all examiners (admin only, protected by middleware)
export async function GET() {
  const admin = createServiceClient();
  const { data: examiners } = await admin
    .from("examiners")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ examiners: examiners || [] });
}
