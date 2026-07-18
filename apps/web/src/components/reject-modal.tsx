"use client";

import { useState } from "react";

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
      setError("Rejection comment is required. Please explain why this document is rejected.");
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
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="border-b border-[#27272a] pb-3">
          <h3 className="text-lg font-semibold text-[#fafafa]">
            Reject Document
          </h3>
          <p className="text-xs text-[#a1a1aa] mt-1 truncate">
            {documentTitle}
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-[#450a0a] border border-[#7f1d1d] text-[#fca5a5] rounded-md font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-1">
              Rejection Comment <span className="text-[#f43f5e]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide actionable feedback on why this document is being rejected back to draft..."
              className="w-full p-3 bg-[#09090b] border border-[#27272a] focus:border-[#f43f5e] focus:outline-none rounded-md text-sm text-[#fafafa] placeholder-[#52525b] transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-medium rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#f43f5e] hover:bg-[#e11d48] text-white text-xs font-medium rounded-md transition-colors shadow-md shadow-[#f43f5e]/20"
            >
              {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
