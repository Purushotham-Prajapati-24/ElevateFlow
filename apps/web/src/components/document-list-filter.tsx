"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { PillNav, PillNavItem } from "@/components/ui/pill-nav";
import { FileText, Search } from "lucide-react";

export interface DocItem {
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

export interface DocumentListFilterProps {
  docs: DocItem[];
}

export function DocumentListFilter({ docs }: DocumentListFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const counts = {
    all: docs.length,
    draft: docs.filter((d) => d.status === "draft").length,
    submitted: docs.filter((d) => d.status === "submitted").length,
    approved: docs.filter((d) => d.status === "approved").length,
    published: docs.filter((d) => d.status === "published").length,
    rejected: docs.filter((d) => d.status === "rejected").length,
  };

  const navItems: PillNavItem[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "draft", label: "Draft", count: counts.draft },
    { id: "submitted", label: "Submitted", count: counts.submitted },
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "published", label: "Published", count: counts.published },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  const filteredDocs = docs.filter((doc) => {
    const matchesCategory =
      activeCategory === "all" || doc.status === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Category Pill Navbar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-1 p-2.5 rounded-xl border border-hairline shadow-xs">
        <PillNav
          items={navItems}
          activeId={activeCategory}
          onSelect={(id) => setActiveCategory(id)}
          baseColor="var(--color-surface-2)"
          pillColor="var(--color-surface-3)"
          pillTextColor="var(--color-ink)"
          activePillBg="#e5a100"
          activePillText="#08090a"
          hoveredPillTextColor="var(--color-ink)"
        />

        {/* Quick Search */}
        <div className="relative shrink-0 w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category docs..."
            className="w-full pl-8 pr-3 py-1.5 bg-surface-2 border border-hairline focus:border-primary focus:outline-none rounded-full text-[12px] text-ink placeholder-ink-subtle transition-theme"
          />
        </div>
      </div>

      {/* Filtered Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-surface-1 border border-hairline rounded-[10px] space-y-3">
          <FileText className="w-8 h-8 text-ink-subtle mx-auto" />
          <h3 className="text-[14px] font-medium text-ink">
            No {activeCategory !== "all" ? activeCategory : ""} documents found
          </h3>
          <p className="text-[13px] text-ink-muted max-w-sm mx-auto">
            {activeCategory === "all"
              ? "No documents exist matching your criteria."
              : `There are currently no documents in "${activeCategory}" status.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}` as any}
              className="group bg-surface-1 hover:bg-surface-2 border border-hairline hover:border-hairline-strong rounded-[10px] p-5 transition-theme space-y-3 block"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-ink group-hover:text-primary transition-theme">
                  {doc.title}
                </h3>
                <StatusBadge status={doc.status as any} />
              </div>

              <p className="text-[13px] text-ink-muted line-clamp-2 leading-relaxed">
                {doc.body}
              </p>

              <div className="flex items-center justify-between font-mono text-[11px] text-ink-subtle border-t border-hairline/60 pt-3">
                <div className="flex items-center gap-2">
                  <span>Author: {doc.authorName}</span>
                  <span className="text-hairline-strong">·</span>
                  <span>v{doc.version}</span>
                </div>
                <time>
                  {new Date(doc.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
