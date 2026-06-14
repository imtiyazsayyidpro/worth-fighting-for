import { cn } from "@/lib/utils";

type DisclaimerBannerProps = {
  variant?: "full" | "short";
  className?: string;
};

export function DisclaimerBanner({
  variant = "full",
  className,
}: DisclaimerBannerProps) {
  return (
    <p
      className={cn(
        "text-center text-xs leading-relaxed text-muted-foreground/60",
        className,
      )}
    >
      {variant === "full" ? (
        <>
          This is a supportive space, not a substitute for professional therapy.
          If you&rsquo;re in crisis, please reach out to a licensed professional
          or local crisis service.
        </>
      ) : (
        <>
          Not a substitute for professional therapy.{" "}
          <span className="whitespace-nowrap">
            Seek help if you&rsquo;re in crisis.
          </span>
        </>
      )}
    </p>
  );
}
