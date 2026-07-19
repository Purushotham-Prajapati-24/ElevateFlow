import { getCurrentUser } from "@/lib/session";
import { db, documents, users } from "@elevateflow/db";
import { eq, or, and, ne, desc } from "drizzle-orm";
import Link from "next/link";
import { DocumentListFilter } from "@/components/document-list-filter";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  // Authors see their own documents in any state + published documents from others
  const filterCondition =
    user.role === "admin"
      ? undefined
      : and(
          ne(documents.status, "archived"),
          or(eq(documents.authorId, user.id), eq(documents.status, "published"))
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

  const docs = filterCondition
    ? await docsQuery.where(filterCondition)
    : await docsQuery;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-5">
        <div>
          <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">
            My documents
          </h1>
          <p className="text-[13px] text-ink-muted mt-1">
            Manage drafts, track review status, and access published articles.
          </p>
        </div>

        {user.role === "author" && (
          <Link
            href={"/documents/new" as any}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary text-[13px] font-medium rounded-lg transition-theme self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Create document
          </Link>
        )}
      </div>

      {/* Document filter navbar & grid */}
      <DocumentListFilter docs={docs as any} />
    </div>
  );
}
