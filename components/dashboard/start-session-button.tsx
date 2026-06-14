"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Spinner } from "@/components/auth/auth-card";

export function StartSessionButton() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartSession() {
    setIsStarting(true);
    setError(null);

    const response = await fetch("/api/sessions", { method: "POST" });

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
    <div>
      <button
        type="button"
        onClick={handleStartSession}
        disabled={isStarting}
        className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-[30px] py-[15px] text-[15.5px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {isStarting ? (
          <>
            <Spinner />
            Opening…
          </>
        ) : (
          <>
            Start a session <span className="text-[17px]">→</span>
          </>
        )}
      </button>
      {error ? <p className="mt-2 text-sm text-blushd">{error}</p> : null}
    </div>
  );
}
