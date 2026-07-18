import { getCurrentUser } from "@/lib/session";
import { db, documents, users } from "@elevateflow/db";
import { eq, or, and, ne, desc } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";

export default async function DocumentsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  // Authors see their own documents in any state + published documents from others
  const filterCondition =
    user.role === "admin"
      ? undefined
      : and(
          ne(documents.status, "archived"),
          or(eq(documents.authorId, user.id), eq(documents.status, "published")),
        );

  const docsQuery = db
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
    })
    .from(documents)
    .innerJoin(users, eq(documents.authorId, users.id))
    .orderBy(desc(documents.createdAt));

  const docs = filterCondition ? await docsQuery.where(filterCondition) : await docsQuery;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#fafafa]">
            My Documents
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1 font-mono">
            Manage your draft proposals, review status, and published workflow articles.
          </p>
        </div>

        {user.role === "author" && (
          <Link
            href="/documents/new"
            className="px-4 py-2 bg-[#f59e0b] hover:bg-[#fbbf24] text-[#09090b] font-medium text-xs rounded-md transition-colors shadow-md shadow-[#f59e0b]/10 inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>+</span> Create Document
          </Link>
        )}
      </div>

      {/* Document List Grid */}
      {docs.length === 0 ? (
        <div className="p-12 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-3">
          <div className="text-3xl">📄</div>
          <h3 className="text-sm font-semibold text-[#fafafa]">
            No documents found
          </h3>
          <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
            You haven&apos;t created any documents yet. Click the button above to draft your first workflow proposal.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="group bg-[#18181b] hover:bg-[#1f1f23] border border-[#27272a] hover:border-[#3f3f46] rounded-xl p-5 transition-all space-y-3 block"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-[#fafafa] group-hover:text-[#f59e0b] transition-colors">
                  {doc.title}
                </h3>
                <StatusBadge status={doc.status} />
              </div>

              <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                {doc.body}
              </p>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a] border-t border-[#27272a]/60 pt-3">
                <div className="flex items-center gap-2">
                  <span>Author: {doc.authorName}</span>
                  <span>•</span>
                  <span>v{doc.version}</span>
                </div>
                <time>
                  {new Date(doc.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
