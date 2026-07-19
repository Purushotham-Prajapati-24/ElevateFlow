import type { AuditEventWithActor } from "@elevateflow/types";
import { StatusBadge } from "./status-badge";

interface AuditTimelineProps {
  events: AuditEventWithActor[];
}

export function AuditTimeline({ events }: AuditTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center text-ink-subtle bg-surface-1 rounded-[10px] border border-hairline">
        <p className="eyebrow">No audit events recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section eyebrow */}
      <h3 className="eyebrow text-ink-muted flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        Immutable audit trail
      </h3>

      {/* Timeline */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-[9px] before:top-3 before:bottom-3 before:w-px before:bg-hairline">
        {events.map((event) => (
          <div key={event.id} className="relative group">
            {/* Connector node */}
            <div className="absolute -left-6 top-1.5 w-[10px] h-[10px] rounded-full bg-surface-1 border-2 border-primary group-hover:scale-110 transition-transform" />

            {/* Event card */}
            <div className="bg-surface-1 border border-hairline rounded-lg p-4 space-y-2 hover:border-hairline-strong transition-theme">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-ink">
                    {event.actor.name}
                  </span>
                  <span className="font-mono text-[11px] text-ink-subtle">
                    {event.actor.email}
                  </span>
                </div>
                <time className="font-mono text-[10px] text-ink-subtle">
                  {new Date(event.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow px-2 py-0.5 rounded-md bg-surface-3 text-ink">
                  {event.action}
                </span>

                {event.prevStatus && event.newStatus && (
                  <div className="flex items-center gap-1.5 text-[12px] text-ink-muted">
                    <StatusBadge status={event.prevStatus} />
                    <span className="text-ink-subtle">→</span>
                    <StatusBadge status={event.newStatus} />
                  </div>
                )}
              </div>

              {event.comment && (
                <div className="mt-2 p-3 bg-surface-2 border border-hairline rounded-lg space-y-1">
                  <div className="eyebrow text-[10px] text-state-rejected">
                    Rejection comment
                  </div>
                  <p className="text-[13px] text-ink whitespace-pre-wrap">
                    {event.comment}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
