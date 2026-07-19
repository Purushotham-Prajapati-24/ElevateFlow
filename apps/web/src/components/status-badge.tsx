import type { DocumentStatus } from "@elevateflow/types";

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "DRAFT",
    className: "bg-[#ff5530] text-white border border-[#ff5530]/80 shadow-xs",
  },
  submitted: {
    label: "SUBMITTED",
    className: "bg-[#1456f0] text-white border border-[#1456f0]/80 shadow-xs",
  },
  approved: {
    label: "APPROVED",
    className: "bg-[#10b981] text-white border border-[#10b981]/80 shadow-xs",
  },
  rejected: {
    label: "REJECTED",
    className: "bg-[#f43f5e] text-white border border-[#f43f5e]/80 shadow-xs",
  },
  published: {
    label: "PUBLISHED",
    className: "bg-[#a855f7] text-white border border-[#a855f7]/80 shadow-xs",
  },
  archived: {
    label: "ARCHIVED",
    className: "bg-slate-700 text-white border border-slate-600 shadow-xs",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold tracking-wider ${config.className} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90" />
      {config.label}
    </span>
  );
}
