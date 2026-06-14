"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      body: JSON.stringify({
        email: formData.get("email"),
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setSubmitState({
        status: "error",
        message: body?.error ?? "Could not send invite",
      });
      return;
    }

    router.refresh();
  }

  const isSubmitting = submitState.status === "submitting";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Invite your partner</CardTitle>
        <CardDescription>
          Send an invite to the email they used for their account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="partner-email">Partner email</Label>
            <Input
              id="partner-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="partner@example.com"
              className="h-11 rounded-xl px-4 text-base md:text-base"
              required
            />
          </div>

          {submitState.message ? (
            <p className="text-sm text-destructive">{submitState.message}</p>
          ) : null}

          <Button
            className="h-11 rounded-xl px-4"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Sending invite..." : "Send invite"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
