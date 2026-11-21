import { Zap } from "lucide-react";

export default function PriorityBadge() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
      <Zap className="h-3 w-3" />
      Priority
    </span>
  );
}
