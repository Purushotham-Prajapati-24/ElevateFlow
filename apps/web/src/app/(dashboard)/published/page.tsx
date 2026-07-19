import { getCurrentUser } from "@/lib/session";
import { db, documents, users } from "@elevateflow/db";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { PublishedLibraryFilter } from "@/components/published-library-filter";

export const dynamic = "force-dynamic";

export default async function PublishedLibraryPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  // Fetch all PUBLISHED documents
  const publishedDocs = await db
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
    .where(eq(documents.status, "published"))
    .orderBy(desc(documents.updatedAt));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-hairline pb-5">
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">
          Published library
        </h1>
        <p className="text-[13px] text-ink-muted mt-1">
          Official, immutable documents approved and published ({publishedDocs.length} published).
        </p>
      </div>

      {/* Filterable Published Documents List */}
      <PublishedLibraryFilter docs={publishedDocs as any} />
    </div>
  );
}
