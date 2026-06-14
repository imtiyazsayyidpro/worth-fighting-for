import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  quote: string;
  quoteAuthor: string;
};

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  quote,
  quoteAuthor,
}: AuthCardProps) {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      {/* Quote / brand panel */}
      <aside
        className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.13 358), oklch(0.53 0.12 330) 55%, oklch(0.5 0.1 300))",
        }}
      >
        {/* soft glows */}
        <div className="pointer-events-none absolute -left-16 -top-16 size-72 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 size-80 rounded-full bg-white/10 blur-3xl" />
        {/* faint heart watermark */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-6 size-72 text-white/10"
          fill="currentColor"
        >
          <path d="M12 20.5S3.5 15.4 3.5 9.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8.5 1.8c0 6-8.5 11.1-8.5 11.1Z" />
        </svg>

        <Link
          href="/"
          className="relative flex items-center gap-3 text-white"
          aria-label="Worth Fighting For home"
        >
          <BrandMark className="bg-white/20 shadow-none backdrop-blur-sm" />
          <span className="font-heading text-xl font-semibold tracking-tight">
            Worth Fighting For
          </span>
        </Link>

        <figure className="relative max-w-md">
          <span
            aria-hidden
            className="font-heading text-7xl leading-none text-white/30 select-none"
          >
            &ldquo;
          </span>
          <blockquote className="-mt-6 font-heading text-3xl font-medium italic leading-snug text-white">
            {quote}
          </blockquote>
          <figcaption className="mt-5 text-sm font-medium tracking-wide text-white/70 uppercase">
            {quoteAuthor}
          </figcaption>
        </figure>

        <p className="relative text-sm text-white/60">
          Made for the two of you.
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-9 text-center lg:hidden">
            <Link href="/" aria-label="Worth Fighting For home">
              <BrandMark className="mx-auto size-12 rounded-2xl" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {children}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {footer}
          </p>
        </div>
      </div>
    </main>
  );
}
