"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RejectModal } from "./reject-modal";
import type { DocumentStatus } from "@elevateflow/types";
import type { CurrentUser } from "@/lib/session";
import {
  Pencil,
  Send,
  RotateCcw,
  Check,
  XCircle,
  Globe,
  Archive,
  Loader2,
} from "lucide-react";

interface DocumentActionsProps {
  documentId: string;
  version: number;
  status: DocumentStatus;
  authorId: string;
  currentUser: CurrentUser;
  title: string;
}

export function DocumentActions({
  documentId,
  version,
  status,
  authorId,
  currentUser,
  title,
}: DocumentActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleAction = async (
    endpoint: string,
    payload: Record<string, unknown> = {}
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/documents/${documentId}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version, ...payload }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Action failed.");
        setIsLoading(false);
        return;
      }

      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReject = async (comment: string) => {
    await handleAction("reject", { comment });
  };

  const isAuthor =
    currentUser.role === "author" && authorId === currentUser.id;
  const isReviewerNotAuthor =
    currentUser.role === "reviewer" && authorId !== currentUser.id;
  const isAdmin = currentUser.role === "admin";

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-2 text-[12px] bg-error-bg border border-error/20 text-error rounded-lg text-right">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Author: Edit */}
        {isAuthor && (status === "draft" || status === "rejected") && (
          <Link
            href={`/documents/${documentId}/edit` as any}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-3 hover:bg-surface-4 text-ink text-[13px] font-medium rounded-lg transition-theme"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Link>
        )}

        {/* Author: Submit */}
        {isAuthor && status === "draft" && (
          <ActionButton
            onClick={() => handleAction("submit")}
            isLoading={isLoading}
            icon={Send}
            label="Submit for review"
            loadingLabel="Submitting…"
            className="bg-state-submitted hover:bg-state-submitted/80 text-white"
          />
        )}

        {/* Author: Reopen from rejected */}
        {isAuthor && status === "rejected" && (
          <ActionButton
            onClick={() => handleAction("reopen")}
            isLoading={isLoading}
            icon={RotateCcw}
            label="Reopen as draft"
            loadingLabel="Reopening…"
            className="bg-primary hover:bg-primary-hover text-on-primary"
          />
        )}

        {/* Reviewer: Approve */}
        {isReviewerNotAuthor && status === "submitted" && (
          <>
            <ActionButton
              onClick={() => handleAction("approve")}
              isLoading={isLoading}
              icon={Check}
              label="Approve"
              loadingLabel="Approving…"
              className="bg-state-approved hover:bg-state-approved/80 text-white"
            />
            <ActionButton
              onClick={() => setIsRejectModalOpen(true)}
              isLoading={isLoading}
              icon={XCircle}
              label="Reject"
              loadingLabel="Reject"
              className="bg-state-rejected hover:bg-state-rejected/80 text-white"
            />
          </>
        )}

        {/* Reviewer/Admin: Publish */}
        {(isReviewerNotAuthor || isAdmin) && status === "approved" && (
          <ActionButton
            onClick={() => handleAction("publish")}
            isLoading={isLoading}
            icon={Globe}
            label="Publish"
            loadingLabel="Publishing…"
            className="bg-state-published hover:bg-state-published/80 text-white"
          />
        )}

        {/* Admin: Archive */}
        {isAdmin && status !== "archived" && (
          <ActionButton
            onClick={() => handleAction("archive")}
            isLoading={isLoading}
            icon={Archive}
            label="Archive"
            loadingLabel="Archiving…"
            className="bg-surface-3 hover:bg-surface-4 text-ink-subtle hover:text-state-rejected"
          />
        )}
      </div>

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        documentTitle={title}
      />
    </div>
  );
}

function ActionButton({
  onClick,
  isLoading,
  icon: Icon,
  label,
  loadingLabel,
  className,
}: {
  onClick: () => void;
  isLoading: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  loadingLabel: string;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-theme disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Icon className="w-3.5 h-3.5" />
      )}
      {isLoading ? loadingLabel : label}
    </button>
  );
}
