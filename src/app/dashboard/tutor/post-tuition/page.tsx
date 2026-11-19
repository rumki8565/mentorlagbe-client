"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import TuitionForm from "@/components/dashboard/tuition-form";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useApiData } from "@/lib/use-api-data";
import { TuitionPayload, TutorStats } from "@/types";

export default function PostTuitionPage() {
  const router = useRouter();
  const {
    data: stats,
    error,
    loading,
  } = useApiData<TutorStats>("/api/tuitions/mine/stats");

  const handleSubmit = async (payload: TuitionPayload): Promise<void> => {
    try {
      await apiFetch<{ insertedId: string }>("/api/tuitions", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast.success("Tuition submitted for admin approval");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not post tuition",
      );
    }
  };

  if (loading) {
    return <DashboardSkeleton rows={5} />;
  }
  if (error || !stats) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  const limitReached: boolean =
    stats.plan === "free" && stats.total >= stats.freeLimit;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Post a Tuition"
        subtitle="New posts are reviewed by an admin before they appear publicly."
      />

      {limitReached ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-lg font-semibold text-amber-900">
            Free plan limit reached
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Free tutors can create up to {stats.freeLimit} tuition posts.
            Upgrade to Pro for unlimited posts.
          </p>
          <Button
            asChild
            className="mt-5 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/pricing">Upgrade to Pro</Link>
          </Button>
        </div>
      ) : (
        <>
          {stats.plan === "free" && (
            <p className="mb-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-800">
              Free plan: {stats.total} of {stats.freeLimit} posts used.
            </p>
          )}
          <TuitionForm
            submitLabel="Submit for Approval"
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}
