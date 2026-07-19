"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => Promise<void>;
  documentTitle: string;
}

export function RejectModal({
  isOpen,
  onClose,
  onConfirm,
  documentTitle,
}: RejectModalProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError(
        "Rejection comment is required. Please explain why this document is rejected."
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onConfirm(comment.trim());
      setComment("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Rejection failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface-1 border border-hairline rounded-xl max-w-lg w-full p-6 space-y-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="border-b border-hairline pb-3">
          <h3 className="text-[16px] font-semibold text-ink">
            Reject document
          </h3>
          <p className="text-[13px] text-ink-muted mt-1 truncate">
            {documentTitle}
          </p>
        </div>

        {error && (
          <div className="p-3 text-[12px] bg-error-bg border border-error/20 text-error rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="eyebrow text-ink-muted mb-1.5 block">
              Rejection comment{" "}
              <span className="text-state-rejected">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide actionable feedback on why this document is being rejected…"
              className="w-full p-3 bg-surface-2 border border-hairline focus:border-state-rejected focus:outline-none rounded-lg text-[14px] text-ink placeholder-ink-disabled transition-theme resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-surface-3 hover:bg-surface-4 text-ink text-[13px] font-medium rounded-lg transition-theme"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-state-rejected hover:bg-state-rejected/80 text-white text-[13px] font-medium rounded-lg transition-theme flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Rejecting…
                </>
              ) : (
                "Confirm rejection"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
