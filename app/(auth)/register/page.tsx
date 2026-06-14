"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  AuthCard,
  authFieldClass,
  FormError,
  Spinner,
} from "@/components/auth/auth-card";

type SubmitState = {
  status: "idle" | "submitting" | "error";
  message?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setSubmitState({
        status: "error",
        message: body?.error ?? "Registration failed",
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const isSubmitting = submitState.status === "submitting";

  return (
    <AuthCard
      title="Begin together"
      subtitle="Create your account, then invite the one you're here for."
      panelQuote="Fight for each other, not with each other."
      panelSub="It takes courage to begin. By being here, the two of you are choosing to try."
      panelFootnote="Private · just the two of you · free to start"
      footer={
        <>
          Already have an account?{" "}
          <Link
            className="font-bold text-blushd hover:underline"
            href="/login"
          >
            Log in
          </Link>
        </>
      }
    >
      {submitState.status === "error" ? (
        <FormError>{submitState.message}</FormError>
      ) : null}

      <form className="flex flex-col gap-[15px]" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-[7px] block text-[13px] font-semibold">
            Your name
          </span>
          <input
            name="displayName"
            type="text"
            autoComplete="name"
            placeholder="Maya"
            disabled={isSubmitting}
            className={authFieldClass}
            required
          />
        </label>
        <label className="block">
          <span className="mb-[7px] block text-[13px] font-semibold">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            className={authFieldClass}
            required
          />
        </label>
        <label className="block">
          <span className="mb-[7px] block text-[13px] font-semibold">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            disabled={isSubmitting}
            className={authFieldClass}
            required
          />
          <span className="mt-[7px] block text-xs text-faint">
            At least 8 characters.
          </span>
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1.5 flex items-center justify-center gap-2.5 rounded-full bg-foreground py-[15px] text-[15.5px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Spinner />
              Creating your account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
