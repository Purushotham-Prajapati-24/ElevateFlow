import { getCurrentUser } from "@/lib/session";
import { db, documents, users } from "@elevateflow/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { redirect } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

export default async function AdminConsolePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role !== "admin") {
    return (
      <div className="p-12 text-center bg-surface-1 border border-hairline rounded-[10px] space-y-3">
        <Lock className="w-8 h-8 text-ink-subtle mx-auto" />
        <h2 className="text-[15px] font-medium text-ink">
          Admin console access restricted
        </h2>
        <p className="text-[13px] text-ink-muted max-w-sm mx-auto">
          The admin console is restricted to administrators only.
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
      <div className="border-b border-hairline pb-5">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">
            Admin console
          </h1>
          <span className="eyebrow px-2 py-0.5 rounded bg-primary-muted/30 text-primary border border-primary/20">
            System Overview
          </span>
        </div>
        <p className="text-[13px] text-ink-muted mt-1">
          Full system audit and administration across all {allDocs.length} documents.
        </p>
      </div>

      {/* Table container */}
      <div className="bg-surface-1 border border-hairline rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            {/* Signature xAI Mono Caps Header */}
            <thead className="bg-surface-2 border-b border-hairline text-ink-subtle eyebrow">
              <tr>
                <th className="p-3.5 pl-4">Document Title</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Author</th>
                <th className="p-3.5">Version</th>
                <th className="p-3.5">Updated</th>
                <th className="p-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {allDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-surface-2/60 transition-theme"
                >
                  <td className="p-3.5 pl-4 font-medium text-ink">
                    <Link
                      href={`/documents/${doc.id}` as any}
                      className="hover:text-primary transition-theme"
                    >
                      {doc.title}
                    </Link>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={doc.status as any} />
                  </td>
                  <td className="p-3.5 font-mono text-[12px] text-ink-muted">
                    {doc.authorName}
                  </td>
                  <td className="p-3.5 font-mono text-[12px] text-primary">
                    v{doc.version}
                  </td>
                  <td className="p-3.5 font-mono text-[12px] text-ink-subtle">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 pr-4 text-right font-mono text-[12px]">
                    <Link
                      href={`/documents/${doc.id}` as any}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Inspect & manage
                      <ArrowRight className="w-3 h-3" />
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
