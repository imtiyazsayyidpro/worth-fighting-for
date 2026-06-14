"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      subtitle="Step back into your shared space."
      quote="The best thing to hold onto in life is each other."
      quoteAuthor="Audrey Hepburn"
      footer={
        <>
          New here?{" "}
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            href="/register"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 rounded-xl px-4 text-base md:text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-12 rounded-xl px-4 text-base md:text-base"
            required
          />
        </div>

        {submitState.message ? (
          <p
            className={`text-sm ${
              submitState.status === "error"
                ? "text-destructive"
                : "text-primary"
            }`}
          >
            {submitState.message}
          </p>
        ) : null}

        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-base shadow-romantic"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </AuthCard>
  );
}
