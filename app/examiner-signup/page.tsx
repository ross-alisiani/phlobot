"use client";

import { useState } from "react";
import Link from "next/link";

/** Format digits into (XXX) XXX-XXXX as the user types */
function formatPhoneDisplay(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function ExaminerSignupPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", zip: "", radius: "25",
  });
  const [smsConsent, setSmsConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    update("phone", formatPhoneDisplay(e.target.value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side: require exactly 10 digits
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a complete 10-digit US phone number.");
      return;
    }

    if (!smsConsent) {
      setError("You must agree to receive SMS notifications to sign up.");
      return;
    }

    setLoading(true);

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
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-700">🩺 Phlobot</Link>
          <h1 className="text-2xl font-bold mt-4">Join as an Examiner</h1>
          <p className="text-gray-500 mt-2">
            Get texts when exam jobs are available near you. Free to join.
          </p>
        </div>

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
                onChange={e => update("name", e.target.value)} required placeholder="Jane Smith" />
            </div>

            <div>
              <label className="label">Email address *</label>
              <input type="email" className="input" value={form.email}
                onChange={e => update("email", e.target.value)} required placeholder="jane@example.com" />
              <p className="text-xs text-gray-400 mt-1">
                Used for the advisor connection email after you win a job.
              </p>
            </div>

            <div>
              <label className="label">Cell phone (receives texts) *</label>
              <input
                type="tel"
                className="input"
                value={form.phone}
                onChange={handlePhoneChange}
                required
                placeholder="(720) 555-0100"
                inputMode="numeric"
              />
              <p className="text-xs text-gray-400 mt-1">
                US numbers only. Standard messaging rates apply.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Your ZIP code *</label>
                <input type="text" className="input" value={form.zip}
                  onChange={e => update("zip", e.target.value)} required maxLength={5}
                  pattern="\d{5}" placeholder="80202" />
              </div>
              <div>
                <label className="label">Travel radius *</label>
                <select className="input" value={form.radius}
                  onChange={e => update("radius", e.target.value)}>
                  <option value="10">10 miles</option>
                  <option value="15">15 miles</option>
                  <option value="25">25 miles</option>
                  <option value="35">35 miles</option>
                  <option value="50">50 miles</option>
                </select>
              </div>
            </div>

            {/* SMS Opt-in Consent — required for A2P compliance */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 flex-shrink-0"
                  checked={smsConsent}
                  onChange={e => setSmsConsent(e.target.checked)}
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to receive recurring automated SMS job notifications from Phlobot at the phone number provided. Message frequency varies based on job availability in my area. Message and data rates may apply. Reply <strong>STOP</strong> to unsubscribe at any time, or <strong>HELP</strong> for help. View our{" "}
                  <Link href="/privacy" className="text-brand-600 underline">Privacy Policy</Link>{" "}
                  and{" "}
                  <Link href="/terms" className="text-brand-600 underline">Terms and Conditions</Link>.
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading || !smsConsent}>
              {loading ? "Signing up…" : "Sign Me Up →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
