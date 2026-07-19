import { getCurrentUser } from "@/lib/session";
import { db, documents, auditEvents, users } from "@elevateflow/db";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { AuditTimeline } from "@/components/audit-timeline";
import { DocumentActions } from "@/components/document-actions";
import { ArrowLeft } from "lucide-react";
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
      <div className="p-12 text-center bg-surface-1 border border-hairline rounded-[10px] space-y-3">
        <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center mx-auto text-ink-subtle">
          🔒
        </div>
        <h2 className="text-[15px] font-medium text-ink">Access restricted</h2>
        <p className="text-[13px] text-ink-muted max-w-md mx-auto">
          You do not have permission to view this document in its current status
          (&apos;{doc.status}&apos;).
        </p>
        <Link
          href="/documents"
          className="inline-block px-4 py-2 bg-surface-3 hover:bg-surface-4 text-ink text-[13px] font-medium rounded-lg mt-2 transition-theme"
        >
          Return to documents
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
      {/* Header + Actions */}
      <div className="space-y-4 border-b border-hairline pb-6">
        <Link
          href={"/documents" as any}
          className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink transition-theme"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to documents
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">
                {doc.title}
              </h1>
              <StatusBadge status={doc.status as DocumentStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-ink-muted">
              <span>
                Author:{" "}
                <strong className="text-ink font-medium">
                  {doc.author.name}
                </strong>
              </span>
              <span className="text-hairline-strong">·</span>
              <span>
                Version:{" "}
                <strong className="text-primary font-medium">
                  v{doc.version}
                </strong>
              </span>
              <span className="text-hairline-strong">·</span>
              <time>
                Created: {new Date(doc.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>

          {/* Actions */}
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

      {/* Document body */}
      <div className="bg-surface-1 border border-hairline rounded-[10px] p-6 md:p-8 space-y-4">
        <div className="eyebrow text-ink-muted border-b border-hairline pb-2">
          Document content
        </div>
        <div className="text-[15px] text-ink leading-[1.65] whitespace-pre-wrap">
          {doc.body}
        </div>
      </div>

      {/* Audit trail */}
      <div className="border-t border-hairline pt-8">
        <AuditTimeline events={events} />
      </div>
    </div>
  );
}
