import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Examiner } from "@/lib/types";

export default async function ExaminersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createServiceClient();
  const { data: examiners } = await admin
    .from("examiners")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-gray-600">← Admin</Link>
          <span className="text-xl font-bold text-brand-700">🩺 Phlobot</span>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">ADMIN</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Examiners</h1>
          <Link href="/admin/examiners/new" className="btn-primary text-sm py-2 px-4">
            + Add Examiner
          </Link>
        </div>

        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ZIP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Radius</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(examiners || []).map((ex: Examiner) => (
                <tr key={ex.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{ex.name}</td>
                  <td className="px-4 py-3 text-gray-600">{ex.phone}</td>
                  <td className="px-4 py-3 text-gray-600">{ex.email}</td>
                  <td className="px-4 py-3 text-gray-600">{ex.zip_code}</td>
                  <td className="px-4 py-3 text-gray-600">{ex.radius_miles} mi</td>
                  <td className="px-4 py-3">
                    {ex.active
                      ? <span className="badge-assigned">Active</span>
                      : <span className="badge-canceled">Inactive</span>}
                  </td>
                  <td className="px-4 py-3">
                    <ToggleActiveButton examinerId={ex.id} active={ex.active} />
                  </td>
                </tr>
              ))}
              {(examiners || []).length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No examiners yet.{" "}
                    <Link href="/admin/examiners/new" className="text-brand-600 hover:underline">
                      Add the first one →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function ToggleActiveButton({ examinerId, active }: { examinerId: string; active: boolean }) {
  async function toggle() {
    "use server";
    const admin = createServiceClient();
    await admin.from("examiners").update({ active: !active }).eq("id", examinerId);
    redirect("/admin/examiners");
  }
  return (
    <form action={toggle}>
      <button type="submit"
        className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${
          active
            ? "border-red-200 text-red-600 hover:bg-red-50"
            : "border-green-200 text-green-600 hover:bg-green-50"
        }`}>
        {active ? "Deactivate" : "Activate"}
      </button>
    </form>
  );
}
