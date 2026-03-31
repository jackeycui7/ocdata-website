import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
}

export default function StatCard({ label, value, icon: Icon, className = "", children }: StatCardProps) {
  return (
    <div className={`bg-bg-surface border border-border rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-muted text-sm">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-text-dim" />}
      </div>
      <div className="font-mono text-2xl font-bold gradient-text">{value}</div>
      {children}
    </div>
  );
}
