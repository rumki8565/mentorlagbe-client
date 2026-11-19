import { ReactNode } from "react";

interface TableShellProps {
  headers: string[];
  children: ReactNode;
}

export default function TableShell({ headers, children }: TableShellProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <tr>
              {headers.map((header: string) => (
                <th key={header} className="px-5 py-3 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
