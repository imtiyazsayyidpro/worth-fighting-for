"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type State = "idle" | "sending" | "sent" | "error";

type VerificationBannerProps = {
  email: string;
};

export function VerificationBanner({ email }: VerificationBannerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (searchParams.get("verify_error") === "1") {
      setFeedbackMessage(
        "That verification link is invalid or has expired. Request a new one below.",
      );
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("verified");
    params.delete("verify_error");
    const clean = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/dashboard${clean}`, { scroll: false });
  }, [router, searchParams]);

  async function handleResend() {
    setState("sending");
    setFeedbackMessage(null);

    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
    });

    if (response.ok) {
      setState("sent");
      setFeedbackMessage(null);
    } else {
      setState("error");
      const body = await response.json().catch(() => null);
      setFeedbackMessage(
        body?.error ?? "Could not send email. Try again later.",
      );
    }
  }

  return (
    <div
      role="alert"
      className="animate-rise mb-[18px] flex items-start gap-3.5 rounded-[18px] border border-line2 bg-card p-5"
    >
      <span className="grid size-[38px] flex-none place-items-center rounded-full bg-sage-soft">
        <span className="size-[15px] rounded-[3px] border-[1.5px] border-sage" />
      </span>
      <div className="flex-1">
        <div className="mb-1 text-[15px] font-bold">
          Please confirm your email
        </div>
        <p className="mb-3 text-[13.5px] leading-snug text-muted-foreground">
          We&rsquo;ve sent a verification link to{" "}
          <strong className="text-foreground">{email}</strong>. Confirming keeps
          your account — and your conversations — safe.
        </p>

        {state === "sent" ? (
          <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-sage">
            <span className="size-1.5 rounded-full bg-sage" />
            Sent — check your inbox.
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={state === "sending"}
            className="rounded-full border border-line2 px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-panel2 disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Resend verification email"}
          </button>
        )}

        {feedbackMessage ? (
          <p className="mt-2 text-[13px] text-blushd">{feedbackMessage}</p>
        ) : null}
      </div>
    </div>
  );
}
