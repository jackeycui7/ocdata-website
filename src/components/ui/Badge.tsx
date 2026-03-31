import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warn" | "danger" | "accent" | "cyan";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-border text-text-muted",
  success: "bg-success/15 text-success",
  warn: "bg-warn/15 text-warn",
  danger: "bg-danger/15 text-danger",
  accent: "bg-accent/15 text-accent-light",
  cyan: "bg-cyan/15 text-cyan",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
