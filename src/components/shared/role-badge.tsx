interface RoleBadgeProps {
  role: string;
}

const BADGE_STYLES: Record<string, string> = {
  student: "bg-sky-100 text-sky-700",
  tutor: "bg-emerald-100 text-emerald-700",
  admin: "bg-amber-100 text-amber-700",
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  const style: string = BADGE_STYLES[role] ?? "bg-slate-100 text-slate-700";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${style}`}
    >
      {role}
    </span>
  );
}
