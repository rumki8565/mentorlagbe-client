"use client";

import PageHeader from "@/components/dashboard/page-header";
import EmptyState from "@/components/dashboard/empty-state";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { useSaved } from "@/components/saved/saved-provider";
import TuitionCard from "@/components/tuitions/tuition-card";
import { useApiData } from "@/lib/use-api-data";
import { Tuition } from "@/types";

export default function SavedTuitionsPage() {
  const { data, error, loading } = useApiData<Tuition[]>("/api/saved");
  const { ready, isSaved } = useSaved();

  if (loading || !ready) {
    return <DashboardSkeleton rows={4} />;
  }
  if (error || !data) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  // Cards disappear as soon as you remove the bookmark
  const visible: Tuition[] = data.filter((item: Tuition) => isSaved(item._id));

  return (
    <div>
      <PageHeader
        title="Saved Tuitions"
        subtitle="Tuitions you bookmarked to look at again later."
      />

      {visible.length === 0 ? (
        <EmptyState
          title="No saved tuitions yet"
          text="Tap the bookmark icon on any tuition to save it here."
          actionLabel="Browse Tuitions"
          actionHref="/tuitions"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((tuition: Tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      )}
    </div>
  );
}
