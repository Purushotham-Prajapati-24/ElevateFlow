import { getCurrentUser } from "@/lib/session";
import { db, documents, users } from "@elevateflow/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { redirect } from "next/navigation";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";

export default async function ReviewQueuePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role !== "reviewer" && user.role !== "admin") {
    return (
      <div className="p-12 text-center bg-surface-1 border border-hairline rounded-[10px] space-y-3">
        <Lock className="w-8 h-8 text-ink-subtle mx-auto" />
        <h2 className="text-[15px] font-medium text-ink">
          Reviewer access required
        </h2>
        <p className="text-[13px] text-ink-muted max-w-sm mx-auto">
          The review queue is restricted to reviewers and administrators.
        </p>
      </div>
    );
  }

  // Fetch all SUBMITTED documents
  const submittedDocs = await db
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
    .where(eq(documents.status, "submitted"))
    .orderBy(desc(documents.updatedAt));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-hairline pb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">
          Review queue
        </h1>
        <p className="text-[13px] text-ink-muted mt-1">
          Pending proposals awaiting evaluation ({submittedDocs.length} pending).
        </p>
      </div>

      {submittedDocs.length === 0 ? (
        <div className="p-12 text-center bg-surface-1 border border-hairline rounded-[10px] space-y-3">
          <CheckCircle2 className="w-8 h-8 text-state-approved mx-auto" />
          <h3 className="text-[14px] font-medium text-ink">
            Review queue clean!
          </h3>
          <p className="text-[13px] text-ink-muted max-w-sm mx-auto font-mono">
            No submitted documents require your review right now.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {submittedDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}` as any}
              className="group bg-surface-1 hover:bg-surface-2 border border-hairline hover:border-state-submitted/40 rounded-[10px] p-5 transition-theme space-y-3 block"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-[15px] font-medium text-ink group-hover:text-state-submitted transition-theme">
                    {doc.title}
                  </h3>
                  <div className="text-[12px] text-ink-muted">
                    Submitted by{" "}
                    <strong className="text-ink font-medium">
                      {doc.authorName}
                    </strong>{" "}
                    ({doc.authorEmail})
                  </div>
                </div>
                <StatusBadge status={doc.status as any} />
              </div>

              <p className="text-[13px] text-ink-muted line-clamp-2 leading-relaxed">
                {doc.body}
              </p>

              <div className="flex items-center justify-between font-mono text-[11px] text-ink-subtle border-t border-hairline/60 pt-3">
                <span>Version v{doc.version}</span>
                <span className="text-state-submitted font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Evaluate & review
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
