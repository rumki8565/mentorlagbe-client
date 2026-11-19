"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import StatusBadge from "@/components/dashboard/status-badge";
import EmptyState from "@/components/dashboard/empty-state";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useApiData } from "@/lib/use-api-data";
import { Application, ApplicationStatus } from "@/types";

export default function ApplicantsPage() {
  const { data, error, loading, update } = useApiData<Application[]>(
    "/api/applications/received",
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleStatus = async (
    application: Application,
    status: Exclude<ApplicationStatus, "pending">,
  ): Promise<void> => {
    setBusyId(application._id);
    try {
      await apiFetch<{ message: string }>(
        `/api/applications/${application._id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );
      update((current: Application[]) =>
        current.map((item: Application) =>
          item._id === application._id ? { ...item, status } : item,
        ),
      );
      toast.success(`Application ${status}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not update application",
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <DashboardSkeleton rows={5} />;
  }
  if (error || !data) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  const renderActions = (application: Application) => (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        disabled={
          busyId === application._id || application.status === "accepted"
        }
        onClick={() => handleStatus(application, "accepted")}
        className="bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Check className="mr-1 h-4 w-4" />
        Accept
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={
          busyId === application._id || application.status === "rejected"
        }
        onClick={() => handleStatus(application, "rejected")}
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <X className="mr-1 h-4 w-4" />
        Reject
      </Button>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Applicants"
        subtitle="Students who applied to your tuitions. Accept or reject each application."
      />

      {data.length === 0 ? (
        <EmptyState
          title="No applicants yet"
          text="When students apply to your approved tuitions, they will show up here."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Phone</th>
                    <th className="px-5 py-3">Schedule</th>
                    <th className="px-5 py-3">Note</th>
                    <th className="px-5 py-3">Tuition</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((application: Application) => (
                    <tr key={application._id} className="align-top">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {application.studentName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {application.studentEmail}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(application.appliedAt)}
                        </p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-700">
                        {application.studentPhone}
                      </td>
                      <td className="max-w-[160px] px-5 py-4 text-slate-700">
                        {application.preferredSchedule}
                      </td>
                      <td className="max-w-[220px] px-5 py-4 text-slate-600">
                        <p
                          className="line-clamp-3"
                          title={application.studentNote}
                        >
                          {application.studentNote}
                        </p>
                      </td>
                      <td className="max-w-[180px] px-5 py-4 text-slate-700">
                        <p className="line-clamp-2">
                          {application.tuitionTitle}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-5 py-4">
                        {renderActions(application)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards for smaller screens */}
          <div className="grid gap-4 md:grid-cols-2 xl:hidden">
            {data.map((application: Application) => (
              <div
                key={application._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {application.studentName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {application.studentEmail}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Tuition</dt>
                    <dd className="text-right font-medium text-slate-800">
                      {application.tuitionTitle}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="text-slate-800">
                      {application.studentPhone}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Schedule</dt>
                    <dd className="text-right text-slate-800">
                      {application.preferredSchedule}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Applied</dt>
                    <dd className="text-slate-800">
                      {formatDate(application.appliedAt)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  {application.studentNote}
                </p>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  {renderActions(application)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
