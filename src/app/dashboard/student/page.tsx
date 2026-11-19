"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Crown, Send } from "lucide-react";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useApiData } from "@/lib/use-api-data";
import { StudentStats } from "@/types";

export default function StudentOverviewPage() {
  const { data: session } = authClient.useSession();
  const {
    data: stats,
    error,
    loading,
  } = useApiData<StudentStats>("/api/applications/stats");

  if (loading) {
    return <DashboardSkeleton cards={4} rows={2} />;
  }
  if (error || !stats) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  const plan: string =
    typeof session?.user.plan === "string" ? session.user.plan : "free";
  const isPro: boolean = plan === "pro";

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${session?.user.name ?? "Student"}`}
        subtitle="Here is a quick look at your tuition applications."
        action={
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/tuitions">Browse Tuitions</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Applied Tuitions"
          value={stats.total}
          icon={Send}
          tone="indigo"
        />
        <StatCard
          label="Accepted Applications"
          value={stats.accepted}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Pending Applications"
          value={stats.pending}
          icon={Clock}
          tone="amber"
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
              Upgrade to Pro Student
            </p>
            <p className="text-sm text-indigo-700">
              Get priority booking and a verified Pro badge for $10.
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
    </div>
  );
}
