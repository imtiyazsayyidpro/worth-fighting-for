import { Brain, Clock, Heart } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { InvitePartnerForm } from "@/components/dashboard/invite-partner-form";
import { PendingInviteCard } from "@/components/dashboard/pending-invite-card";
import { SessionList } from "@/components/dashboard/session-list";
import { StartSessionButton } from "@/components/dashboard/start-session-button";
import { VerificationBanner } from "@/components/dashboard/verification-banner";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";
import { BrandMark } from "@/components/layout/brand-mark";
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

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const partnership = await getCurrentPartnershipStatus(user.id);
  const acceptedPartnership =
    partnership.status === "connected"
      ? await getAcceptedPartnershipForUser(user.id)
      : null;
  const sessions = acceptedPartnership
    ? await prisma.session.findMany({
        where: {
          partnershipId: acceptedPartnership.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
        },
      })
    : [];

  return (
    <main className="min-h-screen px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="font-heading text-lg font-semibold leading-tight">
                Worth Fighting For
              </p>
              <p className="text-sm text-muted-foreground">
                {user.displayName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/memory"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Brain className="size-4" aria-hidden />
              Memory
            </Link>
            <LogoutButton />
          </div>
        </header>

        <section className="space-y-1">
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            Hello, {user.displayName.split(/\s+/)[0]}
          </h1>
          <p className="text-base text-muted-foreground">
            A quiet space for the two of you, whenever you need it.
          </p>
        </section>

        {!user.emailVerified ? (
          <Suspense>
            <VerificationBanner email={user.email} />
          </Suspense>
        ) : null}

        {partnership.status === "none" ? <InvitePartnerForm /> : null}

        {partnership.status === "pending_sent" ? (
          <section className="flex items-start gap-4 rounded-3xl border border-border/60 bg-card/70 p-6 shadow-romantic backdrop-blur-sm">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-secondary/30 to-primary/15 text-primary">
              <Clock className="size-5" aria-hidden />
            </span>
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-semibold">
                Invitation on its way
              </h2>
              <p className="text-sm text-muted-foreground">
                We&rsquo;ve let {partnership.partner.email} know. You can begin
                once they accept.
              </p>
            </div>
          </section>
        ) : null}

        {partnership.status === "pending_received" ? (
          <PendingInviteCard
            partnershipId={partnership.partnershipId}
            partner={partnership.partner}
          />
        ) : null}

        {partnership.status === "connected" ? (
          <>
            <section className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-border/60 bg-linear-to-br from-primary/10 via-card/70 to-secondary/15 p-6 shadow-romantic backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary font-heading text-lg font-semibold text-primary-foreground shadow-romantic">
                  {initials(partnership.partner.displayName)}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                    <Heart className="size-3.5 fill-current" aria-hidden />
                    Connected
                  </p>
                  <h2 className="font-heading text-xl font-semibold">
                    You &amp; {partnership.partner.displayName}
                  </h2>
                </div>
              </div>

              <StartSessionButton />
            </section>

            <SessionList sessions={sessions} />
          </>
        ) : null}

        <DisclaimerBanner variant="short" className="pb-2" />
      </div>
    </main>
  );
}
