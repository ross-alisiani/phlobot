import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { JobRequest } from "@/lib/types";
import { getPlan, isAtLimit, isAtEnterpriseLimit } from "@/lib/billing";

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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { upgraded?: string };
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

  const plan = getPlan(profile.plan_tier);
  const atLimit = isAtLimit(profile.plan_tier, profile.jobs_this_month);
  const atEnterpriseLimit = isAtEnterpriseLimit(profile.plan_tier, profile.jobs_this_month);
  const isFree = profile.plan_tier === "free";

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-brand-700">🩺 Phlobot</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {profile.name}
              {profile.company_name ? ` · ${profile.company_name}` : ""}
            </span>
            <form action={signOut}>
              <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Upgrade success banner ── */}
        {searchParams.upgraded && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <p className="font-semibold text-green-800">You&apos;re subscribed!</p>
              <p className="text-sm text-green-700">Welcome to the {plan.name} plan. Your monthly exam limit has been updated.</p>
            </div>
          </div>
        )}

        {/* ── Billing banner ── */}
        {isFree && !atLimit && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-blue-700">
              <strong>Free trial:</strong> {profile.jobs_this_month} of 3 accepted exams used.
              After 3, you&apos;ll need a subscription to continue.
            </p>
            <Link href="/dashboard/upgrade" className="text-sm font-medium text-blue-700 underline whitespace-nowrap">
              View plans
            </Link>
          </div>
        )}

        {isFree && atLimit && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 mb-6">
            <p className="font-semibold text-amber-800 mb-1">Free trial complete 🎉</p>
            <p className="text-sm text-amber-700 mb-3">
              You&apos;ve used all 3 of your free accepted exams. Subscribe to keep matching examiners with your clients.
            </p>
            <Link href="/dashboard/upgrade" className="inline-block bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
              Choose a plan →
            </Link>
          </div>
        )}

        {!isFree && atEnterpriseLimit && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
            <p className="font-semibold text-red-800 mb-1">Monthly limit reached</p>
            <p className="text-sm text-red-700 mb-3">
              You&apos;ve hit the 50-exam Pro limit this month. Need more volume? Contact us for enterprise pricing.
            </p>
            <a
              href="mailto:help@phlobot.com?subject=Enterprise Pricing"
              className="inline-block bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Contact us →
            </a>
          </div>
        )}

        {!isFree && atLimit && !atEnterpriseLimit && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 mb-6">
            <p className="font-semibold text-amber-800 mb-1">Monthly limit reached</p>
            <p className="text-sm text-amber-700 mb-3">
              You&apos;ve used all {plan.limit} accepted exams on your {plan.name} plan this month.
              Upgrade to accept more.
            </p>
            <Link href="/dashboard/upgrade" className="inline-block bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
              Upgrade plan →
            </Link>
          </div>
        )}

        {!isFree && !atLimit && (
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              <strong>{plan.name}</strong> · {profile.jobs_this_month} / {plan.limit} accepted exams this month
            </p>
            <Link href="/dashboard/upgrade" className="text-sm text-gray-400 hover:text-gray-600 whitespace-nowrap">
              Manage plan
            </Link>
          </div>
        )}

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Accepted this month", value: profile.jobs_this_month },
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

        {/* ── New job CTA ── */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Your Exam Requests</h2>
          {atLimit ? (
            <Link
              href="/dashboard/upgrade"
              className="text-sm py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
            >
              Upgrade to add requests
            </Link>
          ) : (
            <Link href="/dashboard/new-job" className="btn-primary text-sm py-2 px-4">
              + New Request
            </Link>
          )}
        </div>

        {/* ── Job list ── */}
        {activeJobs.length === 0 && pastJobs.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
            <p className="text-gray-500 mb-6">
              Submit your first exam request and we&apos;ll find an examiner fast.
            </p>
            {!atLimit && (
              <Link href="/dashboard/new-job" className="btn-primary">
                Submit First Request
              </Link>
            )}
          </div>
        )}

        {activeJobs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Active</h3>
            <div className="space-y-3">
              {activeJobs.map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {pastJobs.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past</h3>
            <div className="space-y-3">
              {pastJobs.map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function JobCard({ job }: { job: any }) {
  const ref = job.id.slice(-6).toUpperCase();
  const created = new Date(job.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-xs text-gray-400">#{ref}</span>
          <StatusBadge status={job.status} />
        </div>
        <div className="text-sm text-gray-700">
          Age {job.patient_age} · {job.patient_gender} · ZIP {job.patient_zip} · {job.exam_type}
        </div>
        {job.assigned_examiner && (
          <div className="text-sm text-green-700 mt-1">
            ✓ Examiner: {job.assigned_examiner.name}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">Submitted {created}</div>
      </div>
      {job.status === "unfilled" && (
        <Link
          href={`/dashboard/new-job?retry=${job.id}`}
          className="btn-secondary text-sm py-1.5 px-4 whitespace-nowrap"
        >
          Resubmit
        </Link>
      )}
    </div>
  );
}
