import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  variant?: "full" | "compact";
}

export function Wordmark({ className, variant = "full" }: WordmarkProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center leading-none select-none",
        className,
      )}
      aria-label="Vasconcelos Fragrances"
    >
      <div className="flex items-baseline gap-[0.04em] font-display">
        <span className="text-[1.6em] text-gold tracking-tight">V</span>
        <span className="text-[1.6em] text-ink tracking-tight italic">S</span>
      </div>
      {variant === "full" && (
        <>
          <div className="mt-1 text-[0.62em] tracking-wordmark font-wordmark uppercase text-ink">
            Vasconcelos
          </div>
          <div className="mt-[0.4em] flex items-center gap-2">
            <span className="h-px w-5 bg-gold/70" />
            <span className="block h-[5px] w-[5px] rotate-45 bg-gold/80" />
            <span className="h-px w-5 bg-gold/70" />
          </div>
          <div className="mt-[0.4em] text-[0.5em] tracking-[0.4em] uppercase text-gold">
            Fragrances
          </div>
        </>
      )}
    </div>
  );
}
