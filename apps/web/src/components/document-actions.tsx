"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RejectModal } from "./reject-modal";
import type { DocumentStatus } from "@elevateflow/types";
import type { CurrentUser } from "@/lib/session";

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

  const handleAction = async (endpoint: string, payload: Record<string, unknown> = {}) => {
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

  const isAuthor = currentUser.role === "author" && authorId === currentUser.id;
  const isReviewerNotAuthor = currentUser.role === "reviewer" && authorId !== currentUser.id;
  const isAdmin = currentUser.role === "admin";

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-2 text-xs bg-[#450a0a] border border-[#7f1d1d] text-[#fca5a5] rounded text-right">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Author Actions */}
        {isAuthor && (status === "draft" || status === "rejected") && (
          <Link
            href={`/documents/${documentId}/edit` as any}
            className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-medium rounded transition-colors"
          >
            ✏️ Edit
          </Link>
        )}

        {isAuthor && status === "draft" && (
          <button
            onClick={() => handleAction("submit")}
            disabled={isLoading}
            className="px-3 py-1.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-medium rounded transition-colors shadow-sm"
          >
            {isLoading ? "Submitting..." : "Submit for Review"}
          </button>
        )}

        {isAuthor && status === "rejected" && (
          <button
            onClick={() => handleAction("reopen")}
            disabled={isLoading}
            className="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#fbbf24] text-[#09090b] text-xs font-medium rounded transition-colors"
          >
            {isLoading ? "Reopening..." : "Reopen as Draft"}
          </button>
        )}

        {/* Reviewer Actions (Must NOT be own document) */}
        {isReviewerNotAuthor && status === "submitted" && (
          <>
            <button
              onClick={() => handleAction("approve")}
              disabled={isLoading}
              className="px-3 py-1.5 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-medium rounded transition-colors"
            >
              {isLoading ? "Approving..." : "Approve Proposal"}
            </button>
            <button
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-[#f43f5e] hover:bg-[#e11d48] text-white text-xs font-medium rounded transition-colors"
            >
              Reject Proposal
            </button>
          </>
        )}

        {(isReviewerNotAuthor || isAdmin) && status === "approved" && (
          <button
            onClick={() => handleAction("publish")}
            disabled={isLoading}
            className="px-3 py-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-medium rounded transition-colors"
          >
            {isLoading ? "Publishing..." : "Publish to Library"}
          </button>
        )}

        {/* Admin Actions */}
        {isAdmin && status !== "archived" && (
          <button
            onClick={() => handleAction("archive")}
            disabled={isLoading}
            className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-[#71717a] hover:text-[#f43f5e] text-xs font-mono rounded transition-colors"
          >
            Archive
          </button>
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
