"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
        <div>
          <Link
            href="/documents"
            className="text-xs font-mono text-[#a1a1aa] hover:text-[#fafafa] transition-colors mb-1 inline-block"
          >
            ← Back to Documents
          </Link>
          <h1 className="text-xl font-bold text-[#fafafa]">Create New Draft</h1>
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs bg-[#450a0a] border border-[#7f1d1d] text-[#fca5a5] rounded-md font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 space-y-6 shadow-2xl"
      >
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-2">
            Document Title <span className="text-[#f59e0b]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 System Architecture & Zero-Trust Guidelines"
            className="w-full px-4 py-2.5 bg-[#09090b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-md text-sm text-[#fafafa] placeholder-[#52525b] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-2">
            Document Content <span className="text-[#f59e0b]">*</span>
          </label>
          <textarea
            required
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your document content here in detail..."
            className="w-full p-4 bg-[#09090b] border border-[#27272a] focus:border-[#f59e0b] focus:outline-none rounded-md text-sm text-[#fafafa] placeholder-[#52525b] transition-colors resize-y leading-relaxed font-mono"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#27272a]">
          <Link
            href="/documents"
            className="px-4 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] text-xs font-medium rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#f59e0b] hover:bg-[#fbbf24] disabled:opacity-50 text-[#09090b] text-xs font-semibold rounded-md transition-colors shadow-md shadow-[#f59e0b]/10"
          >
            {isSubmitting ? "Creating Draft..." : "Save Initial Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
