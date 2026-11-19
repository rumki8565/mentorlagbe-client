"use client";

import PageHeader from "@/components/dashboard/page-header";
import TableShell from "@/components/dashboard/table-shell";
import EmptyState from "@/components/dashboard/empty-state";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import RoleBadge from "@/components/shared/role-badge";
import { formatDate } from "@/lib/format";
import { useApiData } from "@/lib/use-api-data";
import { PaymentRecord } from "@/types";

export default function AdminTransactionsPage() {
  const { data, error, loading } = useApiData<PaymentRecord[]>(
    "/api/admin/transactions",
  );

  if (loading) {
    return <DashboardSkeleton rows={6} />;
  }
  if (error || !data) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="All Pro subscription payments made through Stripe."
      />

      {data.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          text="Payments will appear here after users upgrade to Pro."
        />
      ) : (
        <TableShell
          headers={[
            "User",
            "Email",
            "Role",
            "Plan",
            "Amount",
            "Transaction ID",
            "Date",
          ]}
        >
          {data.map((payment: PaymentRecord) => (
            <tr key={payment._id}>
              <td className="px-5 py-4 font-medium text-slate-900">
                {payment.userName}
              </td>
              <td className="px-5 py-4 text-slate-600">{payment.userEmail}</td>
              <td className="px-5 py-4">
                <RoleBadge role={payment.userRole} />
              </td>
              <td className="px-5 py-4 text-slate-700">{payment.planName}</td>
              <td className="px-5 py-4 font-semibold whitespace-nowrap text-slate-900">
                ${payment.amount.toLocaleString("en-US")}{" "}
                {payment.currency.toUpperCase()}
              </td>
              <td className="max-w-[200px] px-5 py-4 font-mono text-xs break-all text-slate-500">
                {payment.transactionId}
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                {formatDate(payment.paidAt)}
              </td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  );
}
