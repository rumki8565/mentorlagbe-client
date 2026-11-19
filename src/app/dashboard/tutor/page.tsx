"use client";

import Link from "next/link";
import { BookOpenCheck, CheckCircle2, Crown, Users } from "lucide-react";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useApiData } from "@/lib/use-api-data";
import { TutorStats } from "@/types";

export default function TutorOverviewPage() {
  const { data: session } = authClient.useSession();
  const {
    data: stats,
    error,
    loading,
  } = useApiData<TutorStats>("/api/tuitions/mine/stats");

  if (loading) {
    return <DashboardSkeleton cards={4} rows={2} />;
  }
  if (error || !stats) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  const isPro: boolean = stats.plan === "pro";

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${session?.user.name ?? "Tutor"}`}
        subtitle="Here is how your tuitions are performing."
        action={
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/dashboard/tutor/post-tuition">Post a Tuition</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tuitions Posted"
          value={stats.total}
          icon={BookOpenCheck}
          tone="indigo"
        />
        <StatCard
          label="Active / Approved Tuitions"
          value={stats.approved}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Total Applicants Received"
          value={stats.applicants}
          icon={Users}
          tone="sky"
        />
        <StatCard
          label="Current Plan"
          value={isPro ? "Pro" : "Free"}
          icon={Crown}
          tone={isPro ? "amber" : "sky"}
        />
      </div>

      {!isPro && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <div>
            <p className="font-semibold text-indigo-900">
              {stats.total} of {stats.freeLimit} free posts used
            </p>
            <p className="text-sm text-indigo-700">
              Upgrade to Pro Tutor for unlimited posts and a verified badge for
              $15.
            </p>
          </div>
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/pricing">View Plans</Link>
          </Button>
        </div>
      )}

      {stats.pending > 0 && (
        <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          {stats.pending} tuition{stats.pending > 1 ? "s are" : " is"} waiting
          for admin approval.
        </p>
      )}
    </div>
  );
}
