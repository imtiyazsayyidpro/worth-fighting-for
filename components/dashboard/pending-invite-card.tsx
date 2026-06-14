"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Spinner } from "@/components/auth/auth-card";

type Partner = {
  email: string;
  displayName: string;
};

type PendingInviteCardProps = {
  partnershipId: string;
  partner: Partner;
};

export function PendingInviteCard({
  partnershipId,
  partner,
}: PendingInviteCardProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<
    "accept" | "decline" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  async function respond(action: "accept" | "decline") {
    setPendingAction(action);
    setError(null);

    const response = await fetch("/api/partnership/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnershipId, action }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not respond to invite");
      setPendingAction(null);
      return;
    }

    router.refresh();
  }

  const initial = partner.displayName.charAt(0).toUpperCase();

  return (
    <div className="animate-fade rounded-[22px] border border-border bg-card px-[30px] py-8 shadow-[0_20px_50px_-38px_var(--shadow)]">
      <div className="mb-[18px] flex items-center gap-3.5">
        <span className="grid size-[50px] flex-none place-items-center rounded-full bg-blush-soft font-heading text-xl text-blushd">
          {initial}
        </span>
        <div>
          <h2 className="font-heading text-[23px] leading-tight">
            {partner.displayName} invited you
          </h2>
          <p className="text-[13.5px] text-muted-foreground">
            {partner.email} wants to begin, with you.
          </p>
        </div>
      </div>
      <p className="mb-[22px] text-[14.5px] leading-relaxed text-muted-foreground">
        If you accept, the two of you will be connected — privately, just the two
        of you — and can start whenever you&rsquo;re ready.
      </p>

      {error ? <p className="mb-4 text-sm text-blushd">{error}</p> : null}

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => respond("accept")}
          disabled={pendingAction !== null}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-foreground py-3.5 text-[15px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {pendingAction === "accept" ? (
            <>
              <Spinner />
              Connecting…
            </>
          ) : (
            "Accept"
          )}
        </button>
        <button
          type="button"
          onClick={() => respond("decline")}
          disabled={pendingAction !== null}
          className="rounded-full border border-line2 px-[22px] py-3.5 text-[15px] font-semibold transition-colors hover:bg-panel2 disabled:opacity-60"
        >
          {pendingAction === "decline" ? "Declining…" : "Decline"}
        </button>
      </div>
    </div>
  );
}
