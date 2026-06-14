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
      subtitle="Create a private space for the two of you."
      quote="We were together. I forget the rest."
      quoteAuthor="Walt Whitman"
      footer={
        <>
          Already have an account?{" "}
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            href="/login"
          >
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-sm font-medium">
            Your name
          </Label>
          <Input
            id="displayName"
            name="displayName"
            autoComplete="name"
            placeholder="Alex"
            className="h-12 rounded-xl px-4 text-base md:text-base"
            required
          />
        </div>

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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
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
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
