"use client";

import Link from "next/link";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import StatusBadge from "@/components/dashboard/status-badge";
import EmptyState from "@/components/dashboard/empty-state";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import CancelApplicationButton from "@/components/dashboard/cancel-application-button";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { formatFee } from "@/lib/tuitions";
import { useApiData } from "@/lib/use-api-data";
import { Application } from "@/types";

export default function MyApplicationsPage() {
  const { data, error, loading, update } = useApiData<Application[]>(
    "/api/applications/mine",
  );

  const handleCancel = async (application: Application): Promise<void> => {
    try {
      await apiFetch<{ message: string }>(
        `/api/applications/${application._id}`,
        {
          method: "DELETE",
        },
      );
      update((current: Application[]) =>
        current.filter((item: Application) => item._id !== application._id),
      );
      toast.success("Application cancelled");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel application",
      );
    }
  };

  if (loading) {
    return <DashboardSkeleton rows={5} />;
  }
  if (error || !data) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  return (
    <div>
      <PageHeader
        title="My Applications"
        subtitle="Track every tuition you have applied for. You can cancel while an application is pending."
      />

      {data.length === 0 ? (
        <EmptyState
          title="No applications yet"
          text="Browse tuitions and apply to start learning."
          actionLabel="Browse Tuitions"
          actionHref="/tuitions"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <tr>
                    <th className="px-5 py-3">Tuition</th>
                    <th className="px-5 py-3">Tutor</th>
                    <th className="px-5 py-3">Monthly Fee</th>
                    <th className="px-5 py-3">Applied</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((application: Application) => (
                    <tr key={application._id}>
                      <td className="max-w-[240px] px-5 py-4">
                        <Link
                          href={`/tuitions/${application.tuitionId}`}
                          className="line-clamp-2 font-medium text-slate-900 hover:text-indigo-600"
                        >
                          {application.tuitionTitle}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {application.subject}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {application.tutorName ?? application.tutorEmail}
                        </p>
                        <p className="text-xs text-slate-500">
                          {application.tutorEmail}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {formatFee(application.monthlyFee)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                        {formatDate(application.appliedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {application.status === "pending" ? (
                          <CancelApplicationButton
                            tuitionTitle={application.tuitionTitle}
                            onConfirm={() => handleCancel(application)}
                          />
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-4 md:hidden">
            {data.map((application: Application) => (
              <div
                key={application._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/tuitions/${application.tuitionId}`}
                    className="font-semibold text-slate-900 hover:text-indigo-600"
                  >
                    {application.tuitionTitle}
                  </Link>
                  <StatusBadge status={application.status} />
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Tutor</dt>
                    <dd className="text-right font-medium text-slate-800">
                      {application.tutorName ?? application.tutorEmail}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="truncate text-right text-slate-700">
                      {application.tutorEmail}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Monthly Fee</dt>
                    <dd className="font-semibold text-slate-800">
                      {formatFee(application.monthlyFee)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Applied</dt>
                    <dd className="text-slate-700">
                      {formatDate(application.appliedAt)}
                    </dd>
                  </div>
                </dl>
                {application.status === "pending" && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <CancelApplicationButton
                      tuitionTitle={application.tuitionTitle}
                      onConfirm={() => handleCancel(application)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
