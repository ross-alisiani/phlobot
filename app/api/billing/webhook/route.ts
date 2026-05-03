import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * POST /api/billing/webhook
 *
 * Receives Stripe webhook events and updates the advisor's billing status.
 * All event handling is SCAFFOLDED — commented out until Stripe is activated.
 *
 * To activate:
 * 1. npm install stripe
 * 2. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env.local
 * 3. Uncomment the event handlers below
 * 4. Register this URL in Stripe Dashboard → Webhooks
 */
export async function POST(request: Request) {
  // ── Stripe webhook verification (scaffolded) ──────────────────────────────
  /*
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-04-10",
  });

  const body = await request.text();
  const sig  = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[billing/webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createServiceClient();

  switch (event.type) {

    // ── Subscription created / renewed ──────────────────────────────────────
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      // Determine tier from price ID
      const priceId = sub.items.data[0]?.price.id;
      const tier = Object.entries(PLANS).find(
        ([, plan]) => plan.stripePriceId === priceId
      )?.[0] ?? "free";

      await admin
        .from("advisor_profiles")
        .update({
          plan_tier: tier,
          billing_status: sub.status === "active" ? "active" : "past_due",
          stripe_subscription_id: sub.id,
          jobs_this_month: 0,
          billing_cycle_start: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);
      break;
    }

    // ── Subscription cancelled ───────────────────────────────────────────────
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await admin
        .from("advisor_profiles")
        .update({
          plan_tier: "free",
          billing_status: "cancelled",
          stripe_subscription_id: null,
          jobs_this_month: 0,
        })
        .eq("stripe_customer_id", sub.customer as string);
      break;
    }

    // ── Payment failed ───────────────────────────────────────────────────────
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      await admin
        .from("advisor_profiles")
        .update({ billing_status: "past_due" })
        .eq("stripe_customer_id", inv.customer as string);
      break;
    }

    // ── Payment succeeded ────────────────────────────────────────────────────
    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      await admin
        .from("advisor_profiles")
        .update({
          billing_status: "active",
          jobs_this_month: 0,
          billing_cycle_start: new Date().toISOString(),
        })
        .eq("stripe_customer_id", inv.customer as string);
      break;
    }

    default:
      break;
  }
  */
  // ── Stripe not configured yet — accept but ignore all events ─────────────
  return NextResponse.json({ received: true });
}
