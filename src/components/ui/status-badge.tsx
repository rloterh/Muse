import { cn } from "@/lib/utils/cn";

const badgeVariants = {
  neutral:
    "border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]",
  accent: "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
  success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/25 bg-amber-500/10 text-amber-200",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof badgeVariants;
  className?: string;
}

export function StatusBadge({ children, variant = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em]",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
