"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Create advisor profile via API route (uses service role to bypass RLS)
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
      setError("Account created but profile setup failed. Please contact support.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-brand-700">🩺 Phlobot</Link>
          <h1 className="text-2xl font-bold mt-4 text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Free to start — co no credit card needed</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="label">Full name *</label>
                <input type="text" className="input" value={form.name} onChange={e => update("name", e.target.value)} required placeholder="Jane Smith" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="label">Company / office</label>
                <input type="text" className="input" value={form.company} onChange={e => update("company", e.target.value)} placeholder="Smith Insurance" />
              </div>
            </div>
            <input type="email" className="input" value={form.email} onChange={e => update("email", e.target.value)} required placeholder="you@example.com" />
            <input type="tel" className="input" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="(720) 555-0100" />
            <input type="password" className="input" value={form.password} onChange={e => update("password", e.target.value)} required placeholder="Min. 8 characters" />
            <input type="password" className="input" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} required placeholder="••••" />
            {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Free Account"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
