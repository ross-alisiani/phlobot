import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PLANS, PLAN_ORDER, getPlan } from "@/lib/billing";

export const metadata = { title: "Upgrade | Phlobot" };

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  const currentPlan = getPlan(profile.plan_tier);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-brand-700">🩺 Phlobot</Link>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Error banners */}
        {searchParams.error === "stripe_not_configured" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 mb-8 text-center">
            <p className="font-semibold text-yellow-800 mb-1">Payments coming soon</p>
            <p className="text-sm text-yellow-700">
              Our payment system is being set up. Email{" "}
              <a href="mailto:help@phlobot.com" className="underline">help@phlobot.com</a>{" "}
              to get set up manually in the meantime.
            </p>
          </div>
        )}

        {searchParams.error === "server_error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-8 text-center">
            <p className="text-sm text-red-700">Something went wrong. Please try again or email help@phlobot.com.</p>
          </div>
        )}

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Plan</h1>
          {profile.plan_tier === "free" ? (
            <p className="text-gray-500 max-w-lg mx-auto">
              You&apos;ve used your 3 free accepted exams. Subscribe to keep matching examiners with your clients.
            </p>
          ) : (
            <p className="text-gray-500 max-w-lg mx-auto">
              You&apos;re on the <strong>{currentPlan.name}</strong> plan
              ({profile.jobs_this_month} / {currentPlan.limit} accepted exams used this month).
            </p>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {PLAN_ORDER.filter(t => t !== "free").map((tier) => {
            const plan = PLANS[tier];
            const isCurrent = profile.plan_tier === tier;
            const isPopular = tier === "growth";

            return (
              <div
                key={tier}
                className={`bg-white rounded-2xl border-2 p-6 flex flex-col ${
                  isPopular
                    ? "border-brand-500 shadow-lg"
                    : isCurrent
                    ? "border-green-400"
                    : "border-gray-200"
                }`}
              >
                {isPopular && (
                  <div className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
                    Current Plan
                  </div>
                )}

                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500 mt-1 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>

                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="text-center text-sm text-green-600 font-medium py-2">
                    ✓ Your current plan
                  </div>
                ) : (
                  <form action="/api/billing/checkout" method="POST">
                    <input type="hidden" name="tier" value={tier} />
                    <button
                      type="submit"
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors ${
                        isPopular
                          ? "bg-brand-600 text-white hover:bg-brand-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {profile.plan_tier === "free" ? "Subscribe —" : "Switch to"} {plan.name}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>

        {/* Enterprise callout */}
        <div className="bg-gray-100 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-1">Need more than 50 exams/month?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Our Pro plan covers up to 50 accepted exams per month. If you&apos;re coordinating
            across multiple advisors or need higher volume, reach out and we&apos;ll set you
            up with enterprise pricing.
          </p>
          <a
            href="mailto:help@phlobot.com?subject=Enterprise Pricing"
            className="inline-block bg-white border border-gray-300 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Contact us for enterprise pricing →
          </a>
        </div>

        {/* Fine print */}
        <p className="text-center text-xs text-gray-400 mt-8">
          All plans billed monthly. Cancel anytime. Accepted exam counts reset at the start
          of each billing cycle. Payments processed securely by Stripe.
        </p>
      </main>
    </div>
  );
}
