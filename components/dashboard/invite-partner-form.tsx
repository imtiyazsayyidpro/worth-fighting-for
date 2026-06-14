"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  authFieldClass,
  FormError,
  Spinner,
} from "@/components/auth/auth-card";
import { BrandMark } from "@/components/layout/brand-mark";

type SubmitState = {
  status: "idle" | "submitting" | "error";
  message?: string;
};

export function InvitePartnerForm() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/partnership/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setSubmitState({
        status: "error",
        message:
          body?.error ??
          "We couldn't send that invite. Double-check the email and try again.",
      });
      return;
    }

    router.refresh();
  }

  const isSubmitting = submitState.status === "submitting";

  return (
    <div className="rounded-[22px] border border-border bg-card p-[30px] shadow-[0_20px_50px_-38px_var(--shadow)]">
      <div className="mb-1.5 flex items-center gap-2.5">
        <BrandMark size={22} color="var(--blush)" />
        <h2 className="font-heading text-2xl">Invite your partner</h2>
      </div>
      <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
        Worth Fighting For is just for the two of you. Send an invitation and you
        can begin the moment they join.
      </p>

      {submitState.status === "error" ? (
        <FormError>{submitState.message}</FormError>
      ) : null}

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Their email address"
          disabled={isSubmitting}
          className={authFieldClass}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2.5 rounded-full bg-foreground py-[15px] text-[15px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            "Send invite"
          )}
        </button>
      </form>
    </div>
  );
}
