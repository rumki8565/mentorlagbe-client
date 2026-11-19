import { LucideIcon } from "lucide-react";

type Tone = "indigo" | "emerald" | "amber" | "sky";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
}

const TONES: Record<Tone, string> = {
  indigo: "bg-indigo-100 text-indigo-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  sky: "bg-sky-100 text-sky-600",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "indigo",
}: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
