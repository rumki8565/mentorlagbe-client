"use client";

import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import TableShell from "@/components/dashboard/table-shell";
import StatusBadge from "@/components/dashboard/status-badge";
import EmptyState from "@/components/dashboard/empty-state";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { AppRole, isAppRole } from "@/lib/roles";
import { useApiData } from "@/lib/use-api-data";
import { AdminUser } from "@/types";

const ROLES: AppRole[] = ["student", "tutor", "admin"];

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const { data, error, loading, update } =
    useApiData<AdminUser[]>("/api/admin/users");
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleRoleChange = async (
    user: AdminUser,
    value: string,
  ): Promise<void> => {
    if (!isAppRole(value) || value === user.role) {
      return;
    }
    setBusyId(user._id);
    try {
      await apiFetch<{ message: string }>(`/api/admin/users/${user._id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: value }),
      });
      update((current: AdminUser[]) =>
        current.map((item: AdminUser) =>
          item._id === user._id ? { ...item, role: value } : item,
        ),
      );
      toast.success(`${user.name} is now ${value}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not update role");
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

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="View all registered users and change their roles."
      />

      {data.length === 0 ? (
        <EmptyState
          title="No users yet"
          text="Registered users will appear here."
        />
      ) : (
        <TableShell headers={["Name", "Email", "Plan", "Joined", "Role"]}>
          {data.map((user: AdminUser) => {
            const isSelf: boolean = user.email === session?.user.email;
            return (
              <tr key={user._id}>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {user.name}
                  {isSelf && (
                    <span className="ml-2 text-xs text-slate-400">(you)</span>
                  )}
                </td>
                <td className="px-5 py-4 text-slate-600">{user.email}</td>
                <td className="px-5 py-4">
                  <StatusBadge
                    status={user.plan === "pro" ? "approved" : "closed"}
                  />
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <select
                    aria-label={`Role for ${user.name}`}
                    value={user.role}
                    disabled={isSelf || busyId === user._id}
                    onChange={(e) => handleRoleChange(user, e.target.value)}
                    className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm capitalize text-slate-700 outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {ROLES.map((role: AppRole) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </TableShell>
      )}
    </div>
  );
}
