import { getCurrentUser } from "@/lib/session";
import { db, documents, users } from "@elevateflow/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { redirect } from "next/navigation";

export default async function ReviewQueuePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role !== "reviewer" && user.role !== "admin") {
    return (
      <div className="p-12 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-3">
        <div className="text-3xl">🔒</div>
        <h2 className="text-base font-semibold text-[#fafafa]">Reviewer Access Required</h2>
        <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
          The Review Queue is restricted to reviewers and administrators.
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
      <div className="border-b border-[#27272a] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#fafafa]">
          Review Queue
        </h1>
        <p className="text-xs text-[#a1a1aa] mt-1 font-mono">
          Pending proposals awaiting evaluation and approval ({submittedDocs.length} pending).
        </p>
      </div>

      {submittedDocs.length === 0 ? (
        <div className="p-12 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-3">
          <div className="text-3xl">🎉</div>
          <h3 className="text-sm font-semibold text-[#fafafa]">
            Review Queue Clean!
          </h3>
          <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto font-mono">
            No submitted documents require your review right now.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submittedDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}` as any}
              className="group bg-[#18181b] hover:bg-[#1f1f23] border border-[#27272a] hover:border-[#3b82f6]/40 rounded-xl p-5 transition-all space-y-3 block shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-[#fafafa] group-hover:text-[#3b82f6] transition-colors">
                    {doc.title}
                  </h3>
                  <div className="text-xs text-[#a1a1aa] font-mono">
                    Submitted by <strong className="text-[#fafafa]">{doc.authorName}</strong> ({doc.authorEmail})
                  </div>
                </div>
                <StatusBadge status={doc.status as any} />
              </div>

              <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed font-mono">
                {doc.body}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a] border-t border-[#27272a]/60 pt-3">
                <span>Version v{doc.version}</span>
                <span className="text-[#3b82f6] font-medium group-hover:underline">
                  Evaluate & Review →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
