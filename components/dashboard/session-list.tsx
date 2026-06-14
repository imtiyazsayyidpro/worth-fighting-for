import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import type { SessionStatus } from "@/lib/generated/prisma/enums";
import { formatRelativeDay, formatTime } from "@/lib/utils";

export type DashboardSession = {
  id: string;
  status: SessionStatus;
  createdAt: Date;
};

type SessionListProps = {
  sessions: DashboardSession[];
};

function StatusPill({ status }: { status: SessionStatus }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-soft px-3 py-1.5 text-xs font-bold text-blushd">
        <span className="animate-glow size-1.5 rounded-full bg-blushd" />
        In progress
      </span>
    );
  }
  if (status === "PAUSED") {
    return (
      <span className="rounded-full border border-border bg-panel2 px-3 py-1.5 text-xs font-bold text-muted-foreground">
        Paused
      </span>
    );
  }
  return (
    <span className="rounded-full bg-sage-soft px-3 py-1.5 text-xs font-bold text-sage">
      Resolved
    </span>
  );
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-0.5">
        <h3 className="font-heading text-[18px]">Your conversations</h3>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-line2 bg-card px-6 py-[38px] text-center">
          <div className="mx-auto mb-3.5 grid size-10 place-items-center rounded-full bg-bg2">
            <BrandMark size={18} color="var(--sage)" />
          </div>
          <p className="mx-auto max-w-[330px] text-[15px] leading-relaxed text-muted-foreground">
            No sessions yet. When something feels worth talking through — or you
            just want to feel close — start your first together.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="flex items-center gap-3.5 rounded-[16px] border border-border bg-card px-[18px] py-4 transition-colors hover:border-line2"
            >
              <div className="flex-1">
                <div className="text-[15px] font-bold">
                  {formatRelativeDay(session.createdAt)}{" "}
                  <span className="font-medium text-faint">
                    · {formatTime(session.createdAt)}
                  </span>
                </div>
              </div>
              <StatusPill status={session.status} />
              <span className="text-[18px] text-faint">›</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
