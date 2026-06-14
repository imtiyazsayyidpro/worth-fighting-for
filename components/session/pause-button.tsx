"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

type PauseButtonProps = {
  sessionId: string;
  isPaused: boolean;
  onToggle: (isPaused: boolean) => void;
};

export function PauseButton({ sessionId, isPaused, onToggle }: PauseButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const response = await fetch(`/api/sessions/${sessionId}/pause`, {
      method: "POST",
    });
    setLoading(false);

    if (response.ok) {
      const body = await response.json();
      onToggle(body.status === "PAUSED");
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 text-muted-foreground"
      onClick={handleClick}
      disabled={loading}
      aria-label={isPaused ? "Resume session" : "Pause session"}
    >
      {isPaused ? (
        <Play className="size-3.5" aria-hidden />
      ) : (
        <Pause className="size-3.5" aria-hidden />
      )}
      {isPaused ? "Resume" : "Pause"}
    </Button>
  );
}
