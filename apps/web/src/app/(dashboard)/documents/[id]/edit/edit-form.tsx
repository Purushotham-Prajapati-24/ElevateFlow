"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import type { Document } from "@elevateflow/types";

interface EditFormProps {
  initialDoc: Document;
}

export function EditForm({ initialDoc }: EditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialDoc.title);
  const [body, setBody] = useState(initialDoc.body);
  const [error, setError] = useState<string | null>(null);
  const [isConflict, setIsConflict] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsConflict(false);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/documents/${initialDoc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          version: initialDoc.version,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setIsConflict(true);
        setError(
          "Conflict: Document has been updated by another user or session. Please refresh to load the latest version."
        );
        setIsSubmitting(false);
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Failed to update document.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/documents/${initialDoc.id}` as any);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <Link
            href={`/documents/${initialDoc.id}` as any}
            className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink transition-theme mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to document detail
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[20px] font-semibold tracking-tight text-ink">
              Edit document
            </h1>
            <span className="eyebrow px-2 py-0.5 rounded-md bg-surface-2 border border-hairline text-primary">
              v{initialDoc.version}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-bg border border-error/20 text-error rounded-lg text-[13px] space-y-2 font-medium">
          <p>{error}</p>
          {isConflict && (
            <button
              onClick={() => router.refresh()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-error/20 hover:bg-error/30 text-error rounded-md text-[12px] font-mono transition-theme"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh to load latest version
            </button>
          )}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card-highlight bg-surface-1 border border-hairline rounded-[10px] p-6 space-y-5"
      >
        <div>
          <label className="eyebrow text-ink-muted mb-1.5 block">
            Document title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 bg-surface-2 border border-hairline focus:border-hairline-focus focus:outline-none rounded-lg text-[14px] text-ink transition-theme"
          />
        </div>

        <div>
          <label className="eyebrow text-ink-muted mb-1.5 block">
            Document content
          </label>
          <textarea
            required
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-4 bg-surface-2 border border-hairline focus:border-hairline-focus focus:outline-none rounded-lg text-[14px] text-ink transition-theme resize-y leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-hairline">
          <Link
            href={`/documents/${initialDoc.id}` as any}
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
                Saving…
              </>
            ) : (
              "Save modifications"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
