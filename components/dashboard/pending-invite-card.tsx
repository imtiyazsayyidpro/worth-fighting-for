"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [pendingAction, setPendingAction] = useState<"accept" | "decline" | null>(
    null,
  );
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pending invite</CardTitle>
        <CardDescription>
          {partner.displayName} invited you to connect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{partner.email}</p>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button
            className="h-10 rounded-xl px-4"
            disabled={pendingAction !== null}
            onClick={() => respond("accept")}
            type="button"
          >
            {pendingAction === "accept" ? "Accepting..." : "Accept"}
          </Button>
          <Button
            className="h-10 rounded-xl px-4"
            disabled={pendingAction !== null}
            onClick={() => respond("decline")}
            type="button"
            variant="outline"
          >
            {pendingAction === "decline" ? "Declining..." : "Decline"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
