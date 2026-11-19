interface DashboardSkeletonProps {
  cards?: number;
  rows?: number;
}

export default function DashboardSkeleton({
  cards = 0,
  rows = 4,
}: DashboardSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
      {cards > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: cards }).map((_, index: number) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index: number) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-xl bg-slate-200"
          />
        ))}
      </div>
    </div>
  );
}
