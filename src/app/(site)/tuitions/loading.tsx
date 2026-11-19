export default function TuitionsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 h-24 max-w-2xl animate-pulse rounded-xl bg-slate-100" />
      <div className="h-36 animate-pulse rounded-2xl bg-slate-100" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index: number) => (
          <div
            key={index}
            className="h-[420px] animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </section>
  );
}
