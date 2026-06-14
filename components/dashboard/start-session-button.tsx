"use client";

import { MessageCircleHeart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function StartSessionButton() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartSession() {
    setIsStarting(true);
    setError(null);

    const response = await fetch("/api/sessions", {
      method: "POST",
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not start a session");
      setIsStarting(false);
      return;
    }

    const body = await response.json();
    router.push(`/sessions/${body.session.id}`);
  }

  return (
    <div className="space-y-2">
      <Button
        className="h-12 gap-2 rounded-xl px-6 text-base shadow-romantic"
        disabled={isStarting}
        onClick={handleStartSession}
        type="button"
      >
        <MessageCircleHeart className="size-5" aria-hidden />
        {isStarting ? "Opening…" : "Start a session"}
      </Button>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
