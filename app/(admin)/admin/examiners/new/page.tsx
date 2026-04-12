"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddExaminerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "", radius: "25", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        name: form.name,
        email: form.email,
        phone: form.phone,
        zip_code: form.zip,
        radius_miles: parseInt(form.radius),
        notes: form.notes,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/admin/examiners");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/admin/examiners" className="text-gray-400 hover:text-gray-600">← Examiners</Link>
          <span className="text-xl font-bold text-brand-700">🩺 Phlobot Admin</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-8">Add Examiner</h1>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name *</label>
              <input type="text" className="input" value={form.name}
                onChange={e => update("name", e.target.value)} required placeholder="Jane Smith" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" className="input" value={form.email}
                onChange={e => update("email", e.target.value)} required placeholder="jane@example.com" />
            </div>
            <div>
              <label className="label">Cell phone (for SMS alerts) *</label>
              <input type="tel" className="input" value={form.phone}
                onChange={e => update("phone", e.target.value)} required placeholder="(720) 555-0100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">ZIP code *</label>
                <input type="text" className="input" value={form.zip}
                  onChange={e => update("zip", e.target.value)} required maxLength={5} placeholder="80202" />
              </div>
              <div>
                <label className="label">Travel radius *</label>
                <select className="input" value={form.radius} onChange={e => update("radius", e.target.value)}>
                  <option value="10">10 miles</option>
                  <option value="15">15 miles</option>
                  <option value="25">25 miles</option>
                  <option value="35">35 miles</option>
                  <option value="50">50 miles</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Notes (internal only)</label>
              <textarea className="input" rows={2} value={form.notes}
                onChange={e => update("notes", e.target.value)} placeholder="Certifications, availability notes, etc." />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
            )}

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? "Adding…" : "Add Examiner"}
              </button>
              <Link href="/admin/examiners" className="btn-secondary px-6">Cancel</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
