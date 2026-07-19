"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { BookOpen, Search, ArrowRight } from "lucide-react";

export interface PublishedDocItem {
  id: string;
  title: string;
  body: string;
  status: string;
  authorId: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  authorName: string;
}

export interface PublishedLibraryFilterProps {
  docs: PublishedDocItem[];
}

export function PublishedLibraryFilter({ docs }: PublishedLibraryFilterProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredDocs = docs.filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.body.toLowerCase().includes(q) ||
      doc.authorName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-1 p-3 rounded-xl border border-hairline shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search published documents by title, content, or author..."
            className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-hairline focus:border-primary focus:outline-none rounded-lg text-[13px] text-ink placeholder-ink-subtle transition-theme"
          />
        </div>
        <div className="text-[12px] font-mono text-ink-subtle px-1 shrink-0">
          Showing <span className="font-semibold text-ink">{filteredDocs.length}</span> of {docs.length} docs
        </div>
      </div>

      {/* Published Docs Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-surface-1 border border-hairline rounded-[10px] space-y-3">
          <BookOpen className="w-8 h-8 text-ink-subtle mx-auto" />
          <h3 className="text-[14px] font-medium text-ink">
            No matching published documents
          </h3>
          <p className="text-[13px] text-ink-muted max-w-sm mx-auto font-mono">
            {searchQuery.trim()
              ? `No published documents found matching "${searchQuery}". Try a different keyword.`
              : "Documents will appear here once approved and published."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}` as any}
              className="group bg-surface-1 hover:bg-surface-2 border border-hairline hover:border-state-published/40 rounded-[10px] p-5 transition-theme space-y-3 block"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-ink group-hover:text-state-published transition-theme">
                  {doc.title}
                </h3>
                <StatusBadge status={doc.status as any} />
              </div>

              <p className="text-[13px] text-ink-muted line-clamp-2 leading-relaxed">
                {doc.body}
              </p>

              <div className="flex items-center justify-between font-mono text-[11px] text-ink-subtle border-t border-hairline/60 pt-3">
                <span>Author: {doc.authorName}</span>
                <span className="text-state-published font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read document
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
