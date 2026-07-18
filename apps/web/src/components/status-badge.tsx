import type { DocumentStatus } from "@elevateflow/types";

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  draft: {
    label: "DRAFT",
    bg: "bg-[#1e293b]",
    text: "text-[#94a3b8]",
    border: "border-[#334155]",
  },
  submitted: {
    label: "SUBMITTED",
    bg: "bg-[#1e3a5f]",
    text: "text-[#3b82f6]",
    border: "border-[#1d4ed8]",
  },
  approved: {
    label: "APPROVED",
    bg: "bg-[#064e3b]",
    text: "text-[#10b981]",
    border: "border-[#047857]",
  },
  rejected: {
    label: "REJECTED",
    bg: "bg-[#4c0519]",
    text: "text-[#f43f5e]",
    border: "border-[#be123c]",
  },
  published: {
    label: "PUBLISHED",
    bg: "bg-[#2e1065]",
    text: "text-[#8b5cf6]",
    border: "border-[#6d28d9]",
  },
  archived: {
    label: "ARCHIVED",
    bg: "bg-[#27272a]",
    text: "text-[#71717a]",
    border: "border-[#3f3f46]",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium tracking-wider border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {config.label}
    </span>
  );
}
