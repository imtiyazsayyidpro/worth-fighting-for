import { cn } from "@/lib/utils";

/** Two interlocking hearts — the app's emblem. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-romantic",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-5"
        aria-hidden
      >
        <path
          d="M12 20.5S3.5 15.4 3.5 9.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8.5 1.8c0 6-8.5 11.1-8.5 11.1Z"
          fill="currentColor"
          fillOpacity="0.95"
        />
        <path
          d="M12 7.6a4.4 4.4 0 0 1 8.5 1.8c0 6-8.5 11.1-8.5 11.1"
          stroke="oklch(1 0 0 / 0.55)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
