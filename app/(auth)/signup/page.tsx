"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { lookupZip, getServedMarket, ZipInfo } from "@/lib/served-areas";

type Step = "zip-check" | "form" | "waitlist" | "waitlist-done";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("zip-check");

  // ZIP check state
  const [zipInput, setZipInput] = useState("");
  const [zipInfo, setZipInfo] = useState<ZipInfo | null>(null);
  const [servedMarket, setServedMarket] = useState<string | null>(null);
  const [zipError, setZipError] = useState("");
  const [zipLoading, setZipLoading] = useState(false);

  // Main form state
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", password: "", confirmPassword: "",
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
      setStep("form");
    } else {
      setStep("waitlist");
    }
  }

  // ── Step 2a: Account creation ──────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    setFormLoading(true);
    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setFormError(authError.message);
      setFormLoading(false);
      return;
    }

    if (!authData.user) {
      setFormError("Something went wrong. Please try again.");
      setFormLoading(false);
      return;
    }

    const res = await fetch("/api/advisors/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: authData.user.id,
        name: form.name,
        company_name: form.company,
        email: form.email,
        phone: form.phone,
      }),
    });

    if (!res.ok) {
      setFormError("Account created but profile setup failed. Please contact support.");
      setFormLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  // ── Step 2b: Waitlist ──────────────────────────────────────
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
        type: "advisor",
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

  // ── Render ─────────────────────────────────────────────────

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
            Your request helps us prioritize where we expand next — thank you!
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
          <h1 className="text-2xl font-bold mt-4 text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Free to start — no credit card needed</p>
        </div>

        {/* ── ZIP CHECK STEP ── */}
        {step === "zip-check" && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-1">First, let&apos;s check your area</h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter your business ZIP code to confirm Phlobot is available in your market.
            </p>
            <form onSubmit={handleZipCheck} className="space-y-4">
              <div>
                <label className="label">Business ZIP code *</label>
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
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-600 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* ── WAITLIST STEP ── */}
        {step === "waitlist" && zipInfo && (
          <div className="card">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">📍</div>
              <h2 className="text-lg font-semibold">
                Phlobot isn&apos;t in {zipInfo.city}, {zipInfo.stateAbbr} yet
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                We&apos;re expanding fast! Drop your email and we&apos;ll notify you
                the moment we launch in your area.
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

            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="label">Full name *</label>
                    <input type="text" className="input" value={form.name}
                      onChange={e => updateForm("name", e.target.value)} required placeholder="Jane Smith" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="label">Company / office</label>
                    <input type="text" className="input" value={form.company}
                      onChange={e => updateForm("company", e.target.value)} placeholder="Smith Insurance" />
                  </div>
                </div>

                <div>
                  <label className="label">Email address *</label>
                  <input type="email" className="input" value={form.email}
                    onChange={e => updateForm("email", e.target.value)} required placeholder="you@example.com" />
                </div>

                <div>
                  <label className="label">Cell phone</label>
                  <input type="tel" className="input" value={form.phone}
                    onChange={e => updateForm("phone", e.target.value)} placeholder="(720) 555-0100" />
                </div>

                <div>
                  <label className="label">Password *</label>
                  <input type="password" className="input" value={form.password}
                    onChange={e => updateForm("password", e.target.value)} required placeholder="Min. 8 characters" />
                </div>

                <div>
                  <label className="label">Confirm password *</label>
                  <input type="password" className="input" value={form.confirmPassword}
                    onChange={e => updateForm("confirmPassword", e.target.value)} required placeholder="••••••••" />
                </div>

                {formError && (
                  <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {formError}
                  </div>
                )}

                <button type="submit" className="btn-primary w-full" disabled={formLoading}>
                  {formLoading ? "Creating account…" : "Create Free Account"}
                </button>
              </form>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-600 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
