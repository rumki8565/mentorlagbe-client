import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
