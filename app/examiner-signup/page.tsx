"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExaminerSignupPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", zip: "", radius: "25",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/examiners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, email: form.email, phone: form.phone,
        zip_code: form.zip, radius_miles: parseInt(form.radius),
      }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error || "Something went wrong."); setLoading(false); return; }
    setSubmitted(true);
  }

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold mb-3">You&apos;re in!</h1>
        <p className="text-gray-500 mb-8">When an exam comes up near you, you'll get a text. Reply YES to claim it or NO to pass.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-700">🩺 Phlobot</Link>
          <h1 className="text-2xl font-bold mt-4">Join as an Examiner</h1>
          <p className="text-gray-500 mt-2">Get texts when exam jobs are available near you. Free to join.</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" className="input" value={form.name} onChange={e => update("name", e.target.value)} required placeholder="Full name" />
            <input type="email" className="input" value={form.email} onChange={e => update("email", e.target.value)} required placeholder="Email address" />
            <input type="tel" className="input" value={form.phone} onChange={e => update("phone", e.target.value)} required placeholder="Cell phone" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" className="input" value={form.zip} onChange={e => update("zip", e.target.value)} required maxLength={5} placeholder="Your ZIP" />
              <select className="input" value={form.radius} onChange={e => update("radius", e.target.value)}>
                <option value="10">10 miles</option>
                <option value="15">15 miles</option>
                <option value="25">25 miles</option>
                <option value="35">35 miles</option>
                <option value="50">50 miles</option>
              </select>
            </div>
            {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign Me Up >"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          By signing up, you agree to receive SMS messages from Phlobot. Reply STOP at any time to unsubscribe.
        </p>
      </div>
    </div>
  );
}
