"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import StatusBadge from "@/components/dashboard/status-badge";
import EmptyState from "@/components/dashboard/empty-state";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import ConfirmActionButton from "@/components/dashboard/confirm-action-button";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { formatFee } from "@/lib/tuitions";
import { useApiData } from "@/lib/use-api-data";
import { Tuition } from "@/types";

export default function MyTuitionsPage() {
  const { data, error, loading, update } =
    useApiData<Tuition[]>("/api/tuitions/mine");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (tuition: Tuition): Promise<void> => {
    setTogglingId(tuition._id);
    try {
      const result = await apiFetch<{ isActive: boolean }>(
        `/api/tuitions/${tuition._id}/toggle`,
        { method: "PATCH" },
      );
      update((current: Tuition[]) =>
        current.map((item: Tuition) =>
          item._id === tuition._id
            ? { ...item, isActive: result.isActive }
            : item,
        ),
      );
      toast.success(
        result.isActive ? "Tuition is now active" : "Tuition closed",
      );
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not update status",
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (tuition: Tuition): Promise<void> => {
    try {
      await apiFetch<{ message: string }>(`/api/tuitions/${tuition._id}`, {
        method: "DELETE",
      });
      update((current: Tuition[]) =>
        current.filter((item: Tuition) => item._id !== tuition._id),
      );
      toast.success("Tuition deleted");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not delete tuition",
      );
    }
  };

  if (loading) {
    return <DashboardSkeleton rows={5} />;
  }
  if (error || !data) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  const renderActions = (tuition: Tuition) => (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={togglingId === tuition._id}
        onClick={() => handleToggle(tuition)}
      >
        {tuition.isActive ? "Close" : "Reopen"}
      </Button>
      <Button asChild variant="outline" size="sm">
        <Link href={`/dashboard/tutor/my-tuitions/${tuition._id}`}>
          <Pencil className="mr-1 h-4 w-4" />
          Edit
        </Link>
      </Button>
      <ConfirmActionButton
        label="Delete"
        title="Delete this tuition?"
        description={`"${tuition.title}" and all its applications will be permanently removed.`}
        confirmLabel="Yes, Delete"
        onConfirm={() => handleDelete(tuition)}
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="My Tuitions"
        subtitle="Manage your posts. Editing a tuition sends it back to admin for approval."
        action={
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/dashboard/tutor/post-tuition">Post a Tuition</Link>
          </Button>
        }
      />

      {data.length === 0 ? (
        <EmptyState
          title="You have not posted any tuition yet"
          text="Create your first tuition and start receiving applications."
          actionLabel="Post a Tuition"
          actionHref="/dashboard/tutor/post-tuition"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-3">Tuition</th>
                    <th className="px-5 py-3">Fee</th>
                    <th className="px-5 py-3">Approval</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Posted</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((tuition: Tuition) => (
                    <tr key={tuition._id}>
                      <td className="max-w-[260px] px-5 py-4">
                        <p className="line-clamp-2 font-medium text-slate-900">
                          {tuition.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {tuition.subject} · {tuition.classLevel} ·{" "}
                          {tuition.mode}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {formatFee(tuition.monthlyFee)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={tuition.approvalStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={tuition.isActive ? "active" : "closed"}
                        />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                        {formatDate(tuition.createdAt)}
                      </td>
                      <td className="px-5 py-4">{renderActions(tuition)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile and tablet cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {data.map((tuition: Tuition) => (
              <div
                key={tuition._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{tuition.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {tuition.subject} · {tuition.classLevel} · {tuition.mode}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={tuition.approvalStatus} />
                  <StatusBadge
                    status={tuition.isActive ? "active" : "closed"}
                  />
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="font-semibold text-indigo-600">
                    {formatFee(tuition.monthlyFee)}/mo
                  </span>
                  <span className="text-slate-500">
                    {formatDate(tuition.createdAt)}
                  </span>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {renderActions(tuition)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
