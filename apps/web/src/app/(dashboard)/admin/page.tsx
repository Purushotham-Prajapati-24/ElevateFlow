import { getCurrentUser } from "@/lib/session";
import { db, documents, users } from "@elevateflow/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { redirect } from "next/navigation";

export default async function AdminConsolePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role !== "admin") {
    return (
      <div className="p-12 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-3">
        <div className="text-3xl">🔒</div>
        <h2 className="text-base font-semibold text-[#fafafa]">Admin Console Access Restricted</h2>
        <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
          The Admin Console is restricted to administrators only.
        </p>
      </div>
    );
  }

  // Fetch ALL documents across all statuses
  const allDocs = await db
    .select({
      id: documents.id,
      title: documents.title,
      body: documents.body,
      status: documents.status,
      authorId: documents.authorId,
      version: documents.version,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(documents)
    .innerJoin(users, eq(documents.authorId, users.id))
    .orderBy(desc(documents.updatedAt));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#27272a] pb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#fafafa]">
            Admin Console
          </h1>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#451a03] text-[#f59e0b] border border-[#78350f]">
            SYSTEM OVERVIEW
          </span>
        </div>
        <p className="text-xs text-[#a1a1aa] mt-1 font-mono">
          Full system audit and administration across all {allDocs.length} documents.
        </p>
      </div>

      <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1f1f23] border-b border-[#27272a] text-[#a1a1aa] font-mono uppercase tracking-wider">
              <tr>
                <th className="p-4">Document Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Author</th>
                <th className="p-4">Version</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/60">
              {allDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#1f1f23]/60 transition-colors">
                  <td className="p-4 font-medium text-[#fafafa]">
                    <Link
                      href={`/documents/${doc.id}` as any}
                      className="hover:text-[#f59e0b] transition-colors"
                    >
                      {doc.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={doc.status as any} />
                  </td>
                  <td className="p-4 font-mono text-[#a1a1aa]">
                    {doc.authorName}
                  </td>
                  <td className="p-4 font-mono text-[#f59e0b]">
                    v{doc.version}
                  </td>
                  <td className="p-4 font-mono text-[#71717a]">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right font-mono">
                    <Link
                      href={`/documents/${doc.id}` as any}
                      className="text-[#f59e0b] hover:underline"
                    >
                      Inspect & Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
