import type { AuditEventWithActor } from "@elevateflow/types";
import { StatusBadge } from "./status-badge";

interface AuditTimelineProps {
  events: AuditEventWithActor[];
}

export function AuditTimeline({ events }: AuditTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[#71717a] font-mono bg-[#18181b] rounded-lg border border-[#27272a]">
        No audit events recorded for this document.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-mono text-xs uppercase tracking-wider text-[#a1a1aa] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
        Immutable Audit Trail
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#27272a]">
        {events.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline connector node */}
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#18181b] border-2 border-[#f59e0b] group-hover:scale-110 transition-transform" />

            {/* Event box */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 space-y-2 hover:border-[#3f3f46] transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#fafafa]">
                    {event.actor.name}
                  </span>
                  <span className="text-xs text-[#71717a] font-mono">
                    ({event.actor.email})
                  </span>
                </div>
                <time className="font-mono text-[11px] text-[#71717a]">
                  {new Date(event.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#27272a] text-[#fafafa]">
                  {event.action}
                </span>

                {event.prevStatus && event.newStatus && (
                  <div className="flex items-center gap-1 text-xs text-[#a1a1aa]">
                    <StatusBadge status={event.prevStatus} />
                    <span>→</span>
                    <StatusBadge status={event.newStatus} />
                  </div>
                )}
              </div>

              {event.comment && (
                <div className="mt-2 p-3 bg-[#1f1f23] border border-[#27272a] rounded text-xs text-[#fafafa] space-y-1">
                  <div className="font-mono text-[10px] uppercase text-[#f59e0b]">
                    Rejection Comment
                  </div>
                  <p className="whitespace-pre-wrap">{event.comment}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
