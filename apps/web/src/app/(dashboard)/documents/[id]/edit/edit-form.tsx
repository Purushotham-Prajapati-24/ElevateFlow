"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
        setError("Conflict: Document has been updated by another user or session. Please refresh to load the latest version.");
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
      <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
        <div>
          <Link
            href={`/documents/${initialDoc.id}` as any}
            className="text-xs font-mono text-[#a1a1aa] hover:text-[#fafafa] transition-colors mb-1 inline-block"
          >
            ← Back to Document Detail
          </Link>
          <h1 className="text-xl font-bold text-[#fafafa]">
            Edit Document (v{initialDoc.version})
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#450a0a] border border-[#7f1d1d] text-[#fca5a5] rounded-md text-xs space-y-2">
          <p className="font-semibold">{error}</p>
          {isConflict && (
            <button
              onClick={() => router.refresh()}
              className="px-3 py-1.5 bg-[#7f1d1d] hover:bg-[#991b1b] text-white font-mono rounded transition-colors text-[11px]"
            >
              🔄 Refresh Page to Reload Latest Version
            </button>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-6 shadow-2xl"
      >
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-2">
            Document Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#09090b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-md text-sm text-[#fafafa] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-2">
            Document Content
          </label>
          <textarea
            required
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-4 bg-[#09090b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-md text-sm text-[#fafafa] transition-colors resize-y leading-relaxed font-mono"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#27272a]">
          <Link
            href={`/documents/${initialDoc.id}` as any}
            className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-medium rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#f59e0b] hover:bg-[#fbbf24] disabled:opacity-50 text-[#09090b] text-xs font-semibold rounded-md transition-colors shadow-md shadow-[#f59e0b]/10"
          >
            {isSubmitting ? "Saving Changes..." : "Save Modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
