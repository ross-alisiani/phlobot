import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { JobRequest } from "@/lib/types";

function StatusBadge({ status }: { status: string }) {
  const classes: Record<string, string> = {
    pending:   "badge-pending",
    broadcast: "badge-broadcast",
    assigned:  "badge-assigned",
    completed: "badge-completed",
    unfilled:  "badge-unfilled",
    canceled:  "badge-canceled",
  };
  const labels: Record<string, string> = {
    pending:   "Pending",
    broadcast: "Finding Examiner…",
    assigned:  "Examiner Assigned",
    completed: "Completed",
    unfilled:  "No Examiner Found",
    canceled:  "Canceled",
  };
  return (
    <span className={classes[status] || "badge-pending"}>
      {labels[status] || status}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("advisor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  const { data: jobs } = await supabase
    .from("job_requests")
    .select("*, assigned_examiner:examiners(name, email, phone)")
    .eq("advisor_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const activeJobs = (jobs || []).filter(
    (j: JobRequest) => !["completed", "canceled"].includes(j.status)
  );
  const pastJobs = (jobs || []).filter(
    (j: JobRequest) => ["completed", "canceled"].includes(j.status)
  );

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-brand-700">🩺 Phlobot</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {profile.name}
              {profile.company_name ? ` · ${profile.company_name}` : ""}
            </span>
            <form action={signOut}>
              <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Jobs this month", value: profile.jobs_this_month },
            { label: "Active requests", value: activeJobs.length },
            { label: "Assigned", value: activeJobs.filter((j: JobRequest) => j.status === "assigned").length },
            { label: "Completed", value: pastJobs.filter((j: JobRequest) => j.status === "completed").length },
          ].map(stat => (
            <div key={stat.label} className="card text-center">
              <div className="text-3xl font-bold text-brand-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Your Exam Requests</h2>
          <Link href="/dashboard/new-job" className="btn-primary text-sm py-2 px-4">
            + New Request
          </Link>
        </div>

        {activeJobs.length === 0 && pastJobs.length === 0 && (
          <div className="card text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
            <p className="text-gray-500 mb-6">Submit your first exam request and we'll find an examiner fast.</p>
            <Link href="/dashboard/new-job" className="btn-primary">Submit First Request</Link>
          </div>
        )}

        {activeJobs.length > 0 && (
          <div className="space-y-3 mb-8">
            {activeJobs.map((job: any) => (
              <div key={job.id} className="card">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-gray-400">#{job.id.slice(-6).toUpperCase()}</span>
                  <StatusBadge status={job.status} />
                </div>
                <div className="text-sm text-gray-700">
                  Age {job.patient_age} · {job.patient_gender} · {job.patient_zip} · {job.exam_type}
                </div>
                {job.assigned_examiner && (
                  <div className="text-sm text-green-700 mt-1">
✓ Examiner: {job.assigned_examiner.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {pastJobs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past</h3>
            <div className="space-y-3">
              {pastJobs.map((job: any) => (
                <div key={job.id} className="card opacity-70">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs text-gray-400">#{job.id.slice(-6).toUpperCase()}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="text-sm text-gray-500">
                    Age {job.patient_age} · {job.patient_gender} · {job.patient_zip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
