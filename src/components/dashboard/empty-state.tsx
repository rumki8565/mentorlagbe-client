import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  text: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  text,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
      {actionLabel && actionHref && (
        <Button
          asChild
          className="mt-5 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
