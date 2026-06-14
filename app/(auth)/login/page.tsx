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

export default function LoginPage() {
  const router = useRouter();
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "submitting" });

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setSubmitState({
        status: "error",
        message: body?.error ?? "Login failed",
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const isSubmitting = submitState.status === "submitting";

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to return to the two of you."
      panelQuote="Welcome back. Take a breath — you're here."
      panelSub="Whatever brought you back tonight, you don't have to carry it alone."
      panelFootnote="Private · just the two of you"
      panelGradient="linear-gradient(165deg, var(--sage-soft), var(--blush-soft))"
      glowAt="40% 40%"
      footer={
        <>
          New here?{" "}
          <Link
            className="font-bold text-blushd hover:underline"
            href="/register"
          >
            Create an account
          </Link>
        </>
      }
    >
      {submitState.status === "error" ? (
        <FormError>{submitState.message}</FormError>
      ) : null}

      <form className="flex flex-col gap-[15px]" onSubmit={handleSubmit}>
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
          <span className="mb-[7px] flex justify-between text-[13px] font-semibold">
            Password
            <span className="font-medium text-faint">Forgot?</span>
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isSubmitting}
            className={authFieldClass}
            required
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1.5 flex items-center justify-center gap-2.5 rounded-full bg-foreground py-[15px] text-[15.5px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Spinner />
              Logging in…
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
