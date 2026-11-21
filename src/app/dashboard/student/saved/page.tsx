"use client";

import Link from "next/link";
import PageHeader from "@/components/dashboard/page-header";
import EmptyState from "@/components/dashboard/empty-state";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { useSaved } from "@/components/saved/saved-provider";
import TuitionCard from "@/components/tuitions/tuition-card";
import { authClient } from "@/lib/auth-client";
import { useApiData } from "@/lib/use-api-data";
import { Tuition } from "@/types";

const FREE_SAVE_LIMIT: number = 5;

export default function SavedTuitionsPage() {
  const { data: session } = authClient.useSession();
  const { data, error, loading } = useApiData<Tuition[]>("/api/saved");
  const { ready, isSaved } = useSaved();

  if (loading || !ready) {
    return <DashboardSkeleton rows={4} />;
  }
  if (error || !data) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  const isPro: boolean = session?.user.plan === "pro";
  // Cards disappear as soon as you remove the bookmark
  const visible: Tuition[] = data.filter((item: Tuition) => isSaved(item._id));

  return (
    <div>
      <PageHeader
        title="Saved Tuitions"
        subtitle="Tuitions you bookmarked to look at again later."
      />

      {!isPro && (
        <p className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-800">
          <span>
            Free plan: {visible.length} of {FREE_SAVE_LIMIT} saved tuitions
            used.
          </span>
          <Link href="/pricing" className="font-semibold underline">
            Upgrade for unlimited saves
          </Link>
        </p>
      )}

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
