import Link from "next/link";

import { BrandMark, Orb, Wordmark } from "@/components/layout/brand-mark";

type AuthCardProps = {
  title: string;
  subtitle: string;
  panelQuote: string;
  panelSub: string;
  panelFootnote: string;
  /** Left-panel gradient; defaults to the blush→sage wash. */
  panelGradient?: string;
  glowAt?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

/** Shared field styling for the auth forms. */
export const authFieldClass =
  "w-full rounded-[14px] border border-line2 bg-field px-4 py-3.5 text-[15px] outline-none transition-shadow placeholder:text-faint focus:border-blush focus:shadow-[0_0_0_3px_var(--blush-soft)]";

export function AuthCard({
  title,
  subtitle,
  panelQuote,
  panelSub,
  panelFootnote,
  panelGradient = "linear-gradient(165deg, var(--blush-soft), var(--sage-soft))",
  glowAt = "60% 38%",
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      {/* desktop brand panel */}
      <aside
        className="relative hidden w-[46%] flex-none flex-col overflow-hidden p-12 lg:flex"
        style={{ background: panelGradient }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${glowAt}, var(--orb-glow), transparent 58%)`,
          }}
        />
        <Link href="/" className="relative flex items-center gap-2.5">
          <BrandMark size={24} />
          <Wordmark size={14} />
        </Link>

        <div className="relative my-auto">
          <Orb size={96} className="mb-7" />
          <p className="max-w-[380px] font-heading text-[34px] leading-[1.28]">
            {panelQuote}
          </p>
          <p className="mt-[18px] max-w-[340px] text-base leading-relaxed text-muted-foreground">
            {panelSub}
          </p>
        </div>

        <p className="relative text-[13px] tracking-wide text-faint">
          {panelFootnote}
        </p>
      </aside>

      {/* form side */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[392px]">
          <Link
            href="/"
            className="mb-9 flex items-center gap-2.5 lg:hidden"
            aria-label="Worth Fighting For home"
          >
            <BrandMark size={22} />
            <Wordmark size={12.5} />
          </Link>

          <h1 className="font-heading text-[34px] leading-[1.1]">{title}</h1>
          <p className="mt-2.5 text-[15.5px] leading-snug text-muted-foreground">
            {subtitle}
          </p>

          <div className="mt-6">{children}</div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {footer}
          </p>
          <p className="mx-auto mt-6 max-w-[330px] text-center text-[11.5px] leading-snug text-faint">
            A supportive space, not a substitute for professional care.
          </p>
        </div>
      </div>
    </main>
  );
}

/** The blush error banner used across auth + invite forms. */
export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-rise mb-[18px] flex items-start gap-2.5 rounded-[14px] border border-blush bg-blush-soft px-4 py-3">
      <span className="mt-px grid size-[18px] flex-none place-items-center rounded-full border-[1.5px] border-blushd text-xs font-bold text-blushd">
        !
      </span>
      <span className="text-[13.5px] leading-snug text-foreground">
        {children}
      </span>
    </div>
  );
}

/** A small spinner for submitting states (matches the design's wf-spin). */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={`animate-wf-spin inline-block size-4 rounded-full border-2 border-white/35 border-t-white ${className ?? ""}`}
      aria-hidden
    />
  );
}
