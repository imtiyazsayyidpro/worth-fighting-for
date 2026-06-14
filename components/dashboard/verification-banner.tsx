"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Mail, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type State = "idle" | "sending" | "sent" | "error";

type VerificationBannerProps = {
  email: string;
};

export function VerificationBanner({ email }: VerificationBannerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Read one-shot query param feedback on mount, then clear the param from the URL
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (searchParams.get("verified") === "1") {
      // Should not normally reach here (user is now verified), but guard anyway
      setFeedbackMessage("Your email has been verified.");
    } else if (searchParams.get("verify_error") === "1") {
      setFeedbackMessage(
        "That verification link is invalid or has expired. Request a new one below.",
      );
    }

    // Strip the params from the URL without a navigation
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
      setFeedbackMessage(`Verification email sent to ${email}.`);
    } else {
      setState("error");
      const body = await response.json().catch(() => null);
      setFeedbackMessage(body?.error ?? "Could not send email. Try again later.");
    }
  }

  return (
    <section
      role="alert"
      className="flex items-start gap-4 rounded-3xl border border-amber-200/60 bg-amber-50/60 p-6 backdrop-blur-sm dark:border-amber-800/40 dark:bg-amber-950/20"
    >
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
        <Mail className="size-5" aria-hidden />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="space-y-1">
          <h2 className="font-heading text-base font-semibold text-foreground">
            Please verify your email
          </h2>
          <p className="text-sm text-muted-foreground">
            We sent a link to <span className="font-medium">{email}</span>.
            Check your inbox (and spam folder) and click the link to verify
            your account.
          </p>
        </div>

        {feedbackMessage ? (
          <div className="flex items-start gap-2 text-sm">
            {state === "sent" ? (
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
            ) : (
              <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
            )}
            <span
              className={
                state === "sent" ? "text-emerald-700" : "text-destructive"
              }
            >
              {feedbackMessage}
            </span>
          </div>
        ) : null}

        <div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={state === "sending" || state === "sent"}
            onClick={handleResend}
          >
            {state === "sending"
              ? "Sending…"
              : state === "sent"
                ? "Email sent"
                : "Resend verification email"}
          </Button>
        </div>
      </div>
    </section>
  );
}
