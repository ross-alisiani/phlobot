"use client";

import { useState } from "react";
import Link from "next/link";
import { lookupZip, getServedMarket, ZipInfo } from "@/lib/served-areas";

type Step = "zip-check" | "form" | "waitlist" | "done" | "waitlist-done";

export default function ExaminerSignupPage() {
  const [step, setStep] = useState<Step>("zip-check");

  // ZIP check state
  const [zipInput, setZipInput] = useState("");
  const [zipInfo, setZipInfo] = useState<ZipInfo | null>(null);
  const [servedMarket, setServedMarket] = useState<string | null>(null);
  const [zipError, setZipError] = useState("");
  const [zipLoading, setZipLoading] = useState(false);

  // Main form state
  const [form, setForm] = useState({
    name: "", email: "", phone: "", zip: "", radius: "25",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistError, setWaitlistError] = useState("");
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // ── Step 1: Check ZIP ──────────────────────────────────────
  async function handleZipCheck(e: React.FormEvent) {
    e.preventDefault();
    setZipError("");

    if (!/^\d{5}$/.test(zipInput.trim())) {
      setZipError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    setZipLoading(true);
    const info = await lookupZip(zipInput.trim());
    setZipLoading(false);

    if (!info) {
      setZipError("We couldn't find that ZIP code. Please double-check it.");
      return;
    }

    setZipInfo(info);
    const market = getServedMarket(info);
    setServedMarket(market);

    if (market) {
      // Pre-fill ZIP and go to main form
      setForm(prev => ({ ...prev, zip: zipInput.trim() }));
      setStep("form");
    } else {
      setStep("waitlist");
    }
  }

  // ── Step 2a: Main signup form ─────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    const res = await fetch("/api/examiners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        zip_code: form.zip,
        radius_miles: parseInt(form.radius),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || "Something went wrong.");
      setFormLoading(false);
      return;
    }

    setStep("done");
  }

  // ── Step 2b: Waitlist form ────────────────────────────────
  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setWaitlistError("");
    setWaitlistLoading(true);

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: waitlistEmail,
        city: zipInfo?.city,
        state: zipInfo?.stateAbbr,
        zip_code: zipInput.trim(),
        type: "examiner",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setWaitlistError(data.error || "Something went wrong. Please try again.");
      setWaitlistLoading(false);
      return;
    }

    setStep("waitlist-done");
  }

  // ── Render ────────────────────────────────────────────────

  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold mb-3">You&apos;re in!</h1>
          <p className="text-gray-500 mb-2">
            We&apos;ve added you to the Phlobot examiner network.
          </p>
          <p className="text-gray-500 mb-8">
            When an exam comes up near you, you&apos;ll get a text. Reply <strong>YES</strong> to claim it or <strong>NO</strong> to pass. That&apos;s it.
          </p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (step === "waitlist-done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📬</div>
          <h1 className="text-2xl font-bold mb-3">You&apos;re on the list!</h1>
          <p className="text-gray-500 mb-2">
            We&apos;ll email you the moment Phlobot launches in{" "}
            <strong>{zipInfo?.city}, {zipInfo?.stateAbbr}</strong>.
          </p>
          <p className="text-gray-500 mb-8">
            Your request helps us prioritize which cities we expand to next — thank you!
          </p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-700">🩺 Phlobot</Link>
          <h1 className="text-2xl font-bold mt-4">Join as an Examiner</h1>
          <p className="text-gray-500 mt-2">
            Get texts when exam jobs are available near you. Free to join.
          </p>
        </div>

        {/* ── ZIP CHECK STEP ── */}
        {step === "zip-check" && (
          <>
            <div className="card">
              <h2 className="text-lg font-semibold mb-1">First, let&apos;s check your area</h2>
              <p className="text-sm text-gray-500 mb-4">
                Enter your ZIP code to see if Phlobot is available near you.
              </p>
              <form onSubmit={handleZipCheck} className="space-y-4">
                <div>
                  <label className="label">Your ZIP code *</label>
                  <input
                    type="text"
                    className="input"
                    value={zipInput}
                    onChange={e => setZipInput(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    required
                    maxLength={5}
                    placeholder="80202"
                    autoFocus
                  />
                </div>
                {zipError && (
                  <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {zipError}
                  </div>
                )}
                <button type="submit" className="btn-primary w-full" disabled={zipLoading}>
                  {zipLoading ? "Checking…" : "Check My Area →"}
                </button>
              </form>
            </div>

            {/* How it works teaser */}
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mt-4">
              <h3 className="font-semibold text-brand-900 mb-2">How it works</h3>
              <ul className="text-sm text-brand-800 space-y-1.5">
                <li>📱 You get a text when a job is available near you</li>
                <li>✅ Reply <strong>YES</strong> to claim it — first to respond wins</li>
                <li>❌ Reply <strong>NO</strong> to pass</li>
                <li>📧 We connect you directly with the advisor by email</li>
                <li>💰 Free to join — no fees, no subscriptions</li>
              </ul>
            </div>
          </>
        )}

        {/* ── WAITLIST STEP ── */}
        {step === "waitlist" && zipInfo && (
          <>
            <div className="card">
              <div className="text-center mb-5">
                <div className="text-4xl mb-3">📍</div>
                <h2 className="text-lg font-semibold">
                  Phlobot isn&apos;t in {zipInfo.city}, {zipInfo.stateAbbr} yet
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  We&apos;re expanding fast! Drop your email and we&apos;ll notify you
                  the moment we launch in your area. Your request also helps us
                  decide where to go next.
                </p>
              </div>

              <form onSubmit={handleWaitlist} className="space-y-4">
                <div>
                  <label className="label">Your email *</label>
                  <input
                    type="email"
                    className="input"
                    value={waitlistEmail}
                    onChange={e => setWaitlistEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    autoFocus
                  />
                </div>

                {/* Read-only location confirmation */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
                  📍 Requesting: <strong>{zipInfo.city}, {zipInfo.stateAbbr} {zipInput}</strong>
                </div>

                {waitlistError && (
                  <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {waitlistError}
                  </div>
                )}

                <button type="submit" className="btn-primary w-full" disabled={waitlistLoading}>
                  {waitlistLoading ? "Saving…" : "Notify Me When You Launch Here 🔔"}
                </button>
              </form>

              <button
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3"
                onClick={() => { setStep("zip-check"); setZipInput(""); setZipInfo(null); setServedMarket(null); }}
              >
                ← Try a different ZIP
              </button>
            </div>
          </>
        )}

        {/* ── MAIN SIGNUP FORM ── */}
        {step === "form" && (
          <>
            {/* Area confirmed banner */}
            {zipInfo && servedMarket && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm text-green-800">
                <span>✅</span>
                <span>
                  Phlobot is available in <strong>{servedMarket}</strong>!
                </span>
                <button
                  className="ml-auto text-green-600 hover:underline text-xs"
                  onClick={() => { setStep("zip-check"); setZipInput(""); setZipInfo(null); setServedMarket(null); }}
                >
                  Change
                </button>
              </div>
            )}

            {/* How it works */}
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-brand-900 mb-2">How it works</h3>
              <ul className="text-sm text-brand-800 space-y-1.5">
                <li>📱 You get a text when a job is available near you</li>
                <li>✅ Reply <strong>YES</strong> to claim it — first to respond wins</li>
                <li>❌ Reply <strong>NO</strong> to pass</li>
                <li>📧 We connect you directly with the advisor by email</li>
                <li>💰 Free to join — no fees, no subscriptions</li>
              </ul>
            </div>

            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Full name *</label>
                  <input type="text" className="input" value={form.name}
                    onChange={e => updateForm("name", e.target.value)} required placeholder="Jane Smith" />
                </div>

                <div>
                  <label className="label">Email address *</label>
                  <input type="email" className="input" value={form.email}
                    onChange={e => updateForm("email", e.target.value)} required placeholder="jane@example.com" />
                  <p className="text-xs text-gray-400 mt-1">
                    Used for the advisor connection email after you win a job.
                  </p>
                </div>

                <div>
                  <label className="label">Cell phone (receives texts) *</label>
                  <input type="tel" className="input" value={form.phone}
                    onChange={e => updateForm("phone", e.target.value)} required placeholder="(720) 555-0100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Your ZIP code *</label>
                    <input type="text" className="input" value={form.zip}
                      onChange={e => updateForm("zip", e.target.value)} required maxLength={5}
                      pattern="\d{5}" placeholder="80202" />
                  </div>
                  <div>
                    <label className="label">Travel radius *</label>
                    <select className="input" value={form.radius}
                      onChange={e => updateForm("radius", e.target.value)}>
                      <option value="10">10 miles</option>
                      <option value="15">15 miles</option>
                      <option value="25">25 miles</option>
                      <option value="35">35 miles</option>
                      <option value="50">50 miles</option>
                    </select>
                  </div>
                </div>

                {formError && (
                  <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {formError}
                  </div>
                )}

                <button type="submit" className="btn-primary w-full" disabled={formLoading}>
                  {formLoading ? "Signing up…" : "Sign Me Up →"}
                </button>
              </form>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              By signing up, you agree to receive SMS messages from Phlobot.
              Reply STOP at any time to unsubscribe.
            </p>
          </>
        )}

      </div>
    </div>
  );
}
