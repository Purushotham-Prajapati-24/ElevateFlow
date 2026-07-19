"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewDocumentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Failed to create document.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/documents/${data.data.id}` as any);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink transition-theme mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to documents
          </Link>
          <h1 className="font-display text-[20px] font-semibold tracking-tight text-ink">
            Create new draft
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-3 text-[12px] bg-error-bg border border-error/20 text-error rounded-lg font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card-highlight bg-surface-1 border border-hairline rounded-[10px] p-6 space-y-5"
      >
        <div>
          <label className="eyebrow text-ink-muted mb-1.5 block">
            Document title <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 System Architecture & Zero-Trust Guidelines"
            className="w-full px-3 py-2.5 bg-surface-2 border border-hairline focus:border-hairline-focus focus:outline-none rounded-lg text-[14px] text-ink placeholder-ink-disabled transition-theme"
          />
        </div>

        <div>
          <label className="eyebrow text-ink-muted mb-1.5 block">
            Document content <span className="text-primary">*</span>
          </label>
          <textarea
            required
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your document content here in detail…"
            className="w-full p-4 bg-surface-2 border border-hairline focus:border-hairline-focus focus:outline-none rounded-lg text-[14px] text-ink placeholder-ink-disabled transition-theme resize-y leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-hairline">
          <Link
            href="/documents"
            className="px-4 py-2 bg-surface-3 hover:bg-surface-4 text-ink text-[13px] font-medium rounded-lg transition-theme"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-on-primary text-[13px] font-semibold rounded-lg transition-theme flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Creating…
              </>
            ) : (
              "Save initial draft"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
