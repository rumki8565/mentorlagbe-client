"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import TableShell from "@/components/dashboard/table-shell";
import StatusBadge from "@/components/dashboard/status-badge";
import EmptyState from "@/components/dashboard/empty-state";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { formatFee } from "@/lib/tuitions";
import { useApiData } from "@/lib/use-api-data";
import { Tuition } from "@/types";

type Filter = "all" | "pending" | "approved" | "rejected";

const FILTERS: Filter[] = ["all", "pending", "approved", "rejected"];

export default function AdminTuitionsPage() {
  const { data, error, loading, update } = useApiData<Tuition[]>(
    "/api/admin/tuitions",
  );
  const [filter, setFilter] = useState<Filter>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleStatus = async (
    tuition: Tuition,
    status: "approved" | "rejected",
  ): Promise<void> => {
    setBusyId(tuition._id);
    try {
      await apiFetch<{ message: string }>(
        `/api/admin/tuitions/${tuition._id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      update((current: Tuition[]) =>
        current.map((item: Tuition) =>
          item._id === tuition._id ? { ...item, approvalStatus: status } : item,
        ),
      );
      toast.success(`Tuition ${status}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not update tuition",
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <DashboardSkeleton rows={6} />;
  }
  if (error || !data) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  const visible: Tuition[] =
    filter === "all"
      ? data
      : data.filter((item: Tuition) => item.approvalStatus === filter);

  return (
    <div>
      <PageHeader
        title="Tuition Approval"
        subtitle="Review tutor submissions. Only approved and active tuitions appear publicly."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((item: Filter) => {
          const count: number =
            item === "all"
              ? data.length
              : data.filter(
                  (tuition: Tuition) => tuition.approvalStatus === item,
                ).length;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${
                filter === item
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
              }`}
            >
              {item} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="Nothing here"
          text="No tuitions match this filter."
        />
      ) : (
        <TableShell
          headers={["Tuition", "Tutor", "Fee", "Posted", "Status", "Actions"]}
        >
          {visible.map((tuition: Tuition) => (
            <tr key={tuition._id} className="align-top">
              <td className="max-w-[260px] px-5 py-4">
                <p className="line-clamp-2 font-medium text-slate-900">
                  {tuition.title}
                </p>
                <p className="text-xs text-slate-500">
                  {tuition.subject} · {tuition.classLevel} · {tuition.mode}
                </p>
              </td>
              <td className="px-5 py-4">
                <p className="font-medium text-slate-800">
                  {tuition.tutorName}
                </p>
                <p className="text-xs text-slate-500">{tuition.tutorEmail}</p>
              </td>
              <td className="px-5 py-4 font-semibold whitespace-nowrap text-slate-800">
                {formatFee(tuition.monthlyFee)}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                {formatDate(tuition.createdAt)}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={tuition.approvalStatus} />
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={
                      busyId === tuition._id ||
                      tuition.approvalStatus === "approved"
                    }
                    onClick={() => handleStatus(tuition, "approved")}
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={
                      busyId === tuition._id ||
                      tuition.approvalStatus === "rejected"
                    }
                    onClick={() => handleStatus(tuition, "rejected")}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  );
}
