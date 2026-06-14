import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { InvitePartnerForm } from "@/components/dashboard/invite-partner-form";
import { PendingInviteCard } from "@/components/dashboard/pending-invite-card";
import { SessionList } from "@/components/dashboard/session-list";
import { StartSessionButton } from "@/components/dashboard/start-session-button";
import { VerificationBanner } from "@/components/dashboard/verification-banner";
import { BrandMark, Orb, Wordmark } from "@/components/layout/brand-mark";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getCurrentPartnershipStatus } from "@/lib/partnership/status";
import { prisma } from "@/lib/prisma";
import { getAcceptedPartnershipForUser } from "@/lib/sessions/partnership";

import { LogoutButton } from "./logout-button";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const firstName = user.displayName.split(/\s+/)[0];
  const partnership = await getCurrentPartnershipStatus(user.id);
  const acceptedPartnership =
    partnership.status === "connected"
      ? await getAcceptedPartnershipForUser(user.id)
      : null;
  const sessions = acceptedPartnership
    ? await prisma.session.findMany({
        where: { partnershipId: acceptedPartnership.id },
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, createdAt: true },
      })
    : [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4 sm:px-10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <BrandMark size={24} />
          <Wordmark size={14} className="hidden sm:inline" />
        </Link>
        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/memory"
            className="text-sm font-semibold transition-colors hover:text-blushd"
          >
            Memory
          </Link>
          <div className="hidden items-center gap-2.5 border-l border-border pl-5 sm:flex">
            <span className="grid size-[30px] place-items-center rounded-full bg-blush-soft text-[13px] font-bold text-blushd">
              {initials(user.displayName)}
            </span>
            <span className="text-sm font-semibold">{firstName}</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[600px] px-[22px] pb-10 pt-[30px]">
        <div className="mb-[26px]">
          <h1 className="font-heading text-[33px] leading-[1.12]">
            {greeting()}, {firstName}.
          </h1>
          <p className="mt-1.5 text-[15.5px] text-muted-foreground">
            We&rsquo;re glad you&rsquo;re here. Take it at your own pace.
          </p>
        </div>

        {!user.emailVerified ? (
          <Suspense>
            <VerificationBanner email={user.email} />
          </Suspense>
        ) : null}

        {partnership.status === "none" ? <InvitePartnerForm /> : null}

        {partnership.status === "pending_sent" ? (
          <div className="animate-fade rounded-[22px] border border-border bg-card px-[30px] py-[38px] text-center shadow-[0_20px_50px_-38px_var(--shadow)]">
            <Orb size={74} className="mx-auto mb-[22px]" />
            <h2 className="font-heading text-[25px]">
              Your invitation is on its way
            </h2>
            <p className="mx-auto mt-2.5 max-w-[380px] text-[15px] leading-relaxed text-muted-foreground">
              We&rsquo;ve emailed{" "}
              <strong className="font-semibold text-foreground">
                {partnership.partner.email}
              </strong>
              . The moment they accept, the two of you can begin your first
              session together.
            </p>
            <div className="mt-[18px] inline-flex items-center gap-2 rounded-full bg-sage-soft px-4 py-2.5 text-[13.5px] font-semibold text-sage">
              <span className="animate-glow size-[7px] rounded-full bg-sage" />
              Waiting for {partnership.partner.displayName} to join
            </div>
          </div>
        ) : null}

        {partnership.status === "pending_received" ? (
          <PendingInviteCard
            partnershipId={partnership.partnershipId}
            partner={partnership.partner}
          />
        ) : null}

        {partnership.status === "connected" ? (
          <>
            <section
              className="relative mb-6 overflow-hidden rounded-[22px] p-[30px]"
              style={{
                background:
                  "linear-gradient(160deg, var(--blush-soft), var(--sage-soft))",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 80% 20%, var(--orb-glow), transparent 55%)",
                }}
              />
              <div className="relative">
                <div className="mb-3.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-sage">
                  <span className="size-[7px] rounded-full bg-sage shadow-[0_0_0_3px_var(--sage-soft)]" />
                  Connected
                </div>
                <div className="mb-[18px] flex items-center gap-3.5">
                  <div className="flex items-center">
                    <span
                      className="size-[46px] rounded-full border-2"
                      style={{
                        background:
                          "radial-gradient(circle at 36% 30%, var(--orb1), var(--orb2) 72%)",
                        borderColor: "var(--bg)",
                      }}
                    />
                    <span
                      className="-ml-3.5 size-[46px] rounded-full border-2"
                      style={{
                        background:
                          "radial-gradient(circle at 36% 30%, var(--sage), #7d9180 80%)",
                        borderColor: "var(--bg)",
                      }}
                    />
                  </div>
                  <h2 className="font-heading text-[27px]">
                    You &amp; {partnership.partner.displayName}
                  </h2>
                </div>
                <p className="mb-[22px] max-w-[400px] text-[14.5px] leading-snug text-foreground/80">
                  Whenever something needs care, or you simply want to feel close
                  again — this is where you begin.
                </p>
                <StartSessionButton />
              </div>
            </section>

            <SessionList sessions={sessions} />
          </>
        ) : null}

        <p className="mx-auto mt-[30px] max-w-[420px] text-center text-[11.5px] leading-relaxed text-faint">
          A supportive space, not a substitute for professional care. In a
          crisis, please reach out to a professional or local emergency
          services.
        </p>
      </div>
    </main>
  );
}
