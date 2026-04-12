import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { createServiceClient } = await import("@/lib/supabase/server");
  const admin = createServiceClient();

  const [jobsResult, examinersResult, advisorsResult] = await Promise.all([
    admin.from("job_requests").select("status"),
    admin.from("examiners").select("active"),
    admin.from("advisor_profiles").select("id"),
  ]);

  const jobs = jobsResult.data || [];
  const examiners = examinersResult.data || [];

  const stats = {
    totalJobs: jobs.length,
    openJobs: jobs.filter((j: any) => ["pending","broadcast"].includes(j.status)).length,
    assignedJobs: jobs.filter((j: any) => j.status === "assigned").length,
    unfilledJobs: jobs.filter((j: any) => j.status === "unfilled").length,
    activeExaminers: examiners.filter((e: any) => e.active).length,
    totalAdvisors: (advisorsResult.data || []).length,
  };

  const { data: recentJobs } = await admin
    .from("job_requests")
    .select("*, advisor:advisor_profiles(name, company_name), assigned_examiner:examiners(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-brand-700">🩺 Phlobot</span>
          <form action={signOut}>
            <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">Sign out</button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-gray-500">Stats and recent jobs go here.</p>
      </main>
    </div>
  );
}
