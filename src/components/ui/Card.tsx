import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`bg-bg-surface border border-border rounded-2xl p-6 ${
        hover ? "card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
