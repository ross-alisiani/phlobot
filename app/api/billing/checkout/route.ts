import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/billing";

/**
 * POST /api/billing/checkout
 *
 * Creates a Stripe Checkout session for the requested plan tier.
 * The form on the upgrade page POSTs here with body { tier: string }.
 *
 * Stripe is currently SCAFFOLDED — the code is commented out until
 * the bank account is connected and Stripe keys are added to .env.
 * Until then, advisors see a "coming soon" message on the upgrade page.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const formData = await request.formData();
    const tier = formData.get("tier") as string;

    const plan = PLANS[tier as keyof typeof PLANS];
    if (!plan || !plan.stripePriceId) {
      // Stripe not configured yet — redirect to upgrade page with error
      return NextResponse.redirect(
        new URL("/dashboard/upgrade?error=stripe_not_configured", request.url)
      );
    }

    // ── Stripe Checkout (scaffolded — uncomment when bank account is ready) ──

    /*
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-04-10",
    });

    const { data: profile } = await supabase
      .from("advisor_profiles")
      .select("stripe_customer_id, email, name")
      .eq("user_id", user.id)
      .single();

    // Reuse existing Stripe customer if available
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email,
        name: profile?.name,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("advisor_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade`,
      metadata: { tier, supabase_user_id: user.id },
    });

    return NextResponse.redirect(session.url!, 303);
    */

    // ── Temporary: Stripe not configured yet ─────────────────────────────────
    return NextResponse.redirect(
      new URL("/dashboard/upgrade?error=stripe_not_configured", request.url)
    );
  } catch (err) {
    console.error("[billing/checkout] error:", err);
    return NextResponse.redirect(
      new URL("/dashboard/upgrade?error=server_error", request.url)
    );
  }
}
