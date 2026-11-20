interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  active: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-200 text-slate-600",
  pro: "bg-amber-100 text-amber-700",
  free: "bg-slate-100 text-slate-600",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style: string = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${style}`}
    >
      {status}
    </span>
  );
}
