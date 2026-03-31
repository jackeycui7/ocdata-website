import { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const base =
  "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer rounded-lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white hover:opacity-90 active:opacity-80",
  outline:
    "border border-border text-text bg-transparent hover:border-accent",
  ghost: "text-text-muted hover:text-text bg-transparent",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  onClick,
  disabled,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
