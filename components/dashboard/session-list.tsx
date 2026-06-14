import Link from "next/link";
import { ChevronRight, MessageCircleHeart } from "lucide-react";

import type { SessionStatus } from "@/lib/generated/prisma/enums";
import { cn, formatRelativeDay, formatTime } from "@/lib/utils";

export type DashboardSession = {
  id: string;
  status: SessionStatus;
  createdAt: Date;
};

type SessionListProps = {
  sessions: DashboardSession[];
};

const statusConfig: Record<
  SessionStatus,
  { label: string; dot: string; text: string }
> = {
  ACTIVE: {
    label: "In progress",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
  },
  PAUSED: {
    label: "Paused",
    dot: "bg-amber-500",
    text: "text-amber-600",
  },
  COMPLETED: {
    label: "Resolved",
    dot: "bg-primary",
    text: "text-primary",
  },
};

export function SessionList({ sessions }: SessionListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Your conversations
        </h2>
        {sessions.length > 0 ? (
          <span className="text-sm text-muted-foreground">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </span>
        ) : null}
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border/70 bg-card/60 px-6 py-14 text-center backdrop-blur-sm">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-secondary/25 text-primary">
            <MessageCircleHeart className="size-6" aria-hidden />
          </span>
          <p className="font-heading text-lg font-medium text-foreground">
            No conversations yet
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">
            When you&rsquo;re ready, start a session and your mediator will help
            you talk it through — together.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sessions.map((session) => {
            const status = statusConfig[session.status];
            return (
              <li key={session.id}>
                <Link
                  href={`/sessions/${session.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-romantic backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-secondary/25 text-primary">
                    <MessageCircleHeart className="size-5" aria-hidden />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base font-medium text-foreground">
                      {formatRelativeDay(session.createdAt)}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatTime(session.createdAt)}</span>
                      <span aria-hidden>·</span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 font-medium",
                          status.text,
                        )}
                      >
                        <span
                          className={cn("size-1.5 rounded-full", status.dot)}
                        />
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    className="size-5 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
