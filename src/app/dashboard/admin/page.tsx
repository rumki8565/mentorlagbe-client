"use client";

import {
  CheckCircle2,
  Clock,
  DollarSign,
  GraduationCap,
  Users,
} from "lucide-react";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { useApiData } from "@/lib/use-api-data";
import { AdminStats } from "@/types";

export default function AdminOverviewPage() {
  const {
    data: stats,
    error,
    loading,
  } = useApiData<AdminStats>("/api/admin/stats");

  if (loading) {
    return <DashboardSkeleton cards={5} rows={2} />;
  }
  if (error || !stats) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        subtitle="Live statistics across users, tuitions and revenue."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          tone="indigo"
        />
        <StatCard
          label="Total Tutors"
          value={stats.totalTutors}
          icon={GraduationCap}
          tone="sky"
        />
        <StatCard
          label="Pending Tuitions"
          value={stats.pendingTuitions}
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Approved Tuitions"
          value={stats.approvedTuitions}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Total Stripe Revenue"
          value={`$${stats.revenue.toLocaleString("en-US")}`}
          icon={DollarSign}
          tone="emerald"
        />
      </div>
    </div>
  );
}
