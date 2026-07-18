import { getCurrentUser } from "@/lib/session";
import { db, documents, auditEvents, users } from "@elevateflow/db";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { AuditTimeline } from "@/components/audit-timeline";
import { DocumentActions } from "@/components/document-actions";
import type { AuditEventWithActor, DocumentStatus } from "@elevateflow/types";

interface DocumentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DocumentDetailPage({
  params,
}: DocumentDetailPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) return null;

  // Load document
  const [doc] = await db
    .select({
      id: documents.id,
      title: documents.title,
      body: documents.body,
      status: documents.status,
      authorId: documents.authorId,
      version: documents.version,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(documents)
    .innerJoin(users, eq(documents.authorId, users.id))
    .where(eq(documents.id, id))
    .limit(1);

  if (!doc) {
    notFound();
  }

  // Authorization check for viewing
  let canView = false;
  switch (user.role) {
    case "author":
      canView = doc.authorId === user.id || doc.status === "published";
      break;
    case "reviewer":
      canView = doc.status === "submitted" || doc.status === "published";
      break;
    case "viewer":
      canView = doc.status === "published";
      break;
    case "admin":
      canView = true;
      break;
    default:
      canView = doc.status === "published";
      break;
  }

  if (!canView) {
    return (
      <div className="p-12 text-center bg-[#18181b] border border-[#27272a] rounded-xl space-y-3">
        <div className="text-3xl">🔒</div>
        <h2 className="text-base font-semibold text-[#fafafa]">Access Restricted</h2>
        <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
          You do not have permission to view this document in its current status (&apos;{doc.status}&apos;).
        </p>
        <Link
          href="/documents"
          className="inline-block px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-medium rounded-md mt-2"
        >
          Return to Documents
        </Link>
      </div>
    );
  }

  // Load Audit Events
  const eventsData = await db
    .select({
      id: auditEvents.id,
      documentId: auditEvents.documentId,
      actorId: auditEvents.actorId,
      action: auditEvents.action,
      prevStatus: auditEvents.prevStatus,
      newStatus: auditEvents.newStatus,
      comment: auditEvents.comment,
      metadata: auditEvents.metadata,
      createdAt: auditEvents.createdAt,
      actor: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(auditEvents)
    .innerJoin(users, eq(auditEvents.actorId, users.id))
    .where(eq(auditEvents.documentId, id))
    .orderBy(asc(auditEvents.createdAt));

  const events: AuditEventWithActor[] = eventsData.map((e) => ({
    ...e,
    action: e.action as any,
    prevStatus: e.prevStatus as DocumentStatus | null,
    newStatus: e.newStatus as DocumentStatus | null,
  }));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header breadcrumb & Actions */}
      <div className="space-y-4 border-b border-[#27272a] pb-6">
        <Link
          href={"/documents" as any}
          className="text-xs font-mono text-[#a1a1aa] hover:text-[#fafafa] transition-colors inline-block"
        >
          ← Back to Documents
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#fafafa]">{doc.title}</h1>
              <StatusBadge status={doc.status as DocumentStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#a1a1aa]">
              <span>Author: <strong className="text-[#fafafa]">{doc.author.name}</strong></span>
              <span>•</span>
              <span>Version: <strong className="text-[#f59e0b]">v{doc.version}</strong></span>
              <span>•</span>
              <time>Created: {new Date(doc.createdAt).toLocaleDateString()}</time>
            </div>
          </div>

          {/* Interactive Role Actions Toolbar */}
          <DocumentActions
            documentId={doc.id}
            version={doc.version}
            status={doc.status as DocumentStatus}
            authorId={doc.authorId}
            currentUser={user}
            title={doc.title}
          />
        </div>
      </div>

      {/* Document Content Box */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className="font-mono text-xs uppercase tracking-wider text-[#a1a1aa] border-b border-[#27272a] pb-2">
          DOCUMENT BODY CONTENT
        </div>
        <div className="text-sm text-[#fafafa] leading-relaxed whitespace-pre-wrap font-mono">
          {doc.body}
        </div>
      </div>

      {/* Audit History Timeline */}
      <div className="border-t border-[#27272a] pt-8">
        <AuditTimeline events={events} />
      </div>
    </div>
  );
}
