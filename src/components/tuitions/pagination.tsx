import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildBrowseQuery } from "@/lib/tuitions";
import { BrowseParams } from "@/types";

interface PaginationProps {
  current: BrowseParams;
  page: number;
  totalPages: number;
}

type PageItem = number | "gap-start" | "gap-end";

const getPageItems = (page: number, totalPages: number): PageItem[] => {
  const items: PageItem[] = [];
  for (let n = 1; n <= totalPages; n += 1) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) {
      items.push(n);
    } else if (n < page && items[items.length - 1] !== "gap-start") {
      items.push("gap-start");
    } else if (n > page && items[items.length - 1] !== "gap-end") {
      items.push("gap-end");
    }
  }
  return items;
};

export default function Pagination({
  current,
  page,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (target: number): string => {
    const query: string = buildBrowseQuery(current, { page: target });
    return query ? `/tuitions?${query}` : "/tuitions";
  };

  const baseStyle: string =
    "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition";
  const idleStyle: string =
    "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600";
  const disabledStyle: string =
    "pointer-events-none border-slate-100 bg-slate-50 text-slate-300";

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page <= 1}
        className={`${baseStyle} ${page <= 1 ? disabledStyle : idleStyle}`}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Previous
      </Link>

      {getPageItems(page, totalPages).map((item: PageItem) =>
        typeof item === "number" ? (
          <Link
            key={item}
            href={hrefFor(item)}
            className={`${baseStyle} ${
              item === page
                ? "border-indigo-600 bg-indigo-600 text-white"
                : idleStyle
            }`}
          >
            {item}
          </Link>
        ) : (
          <span key={item} className="px-1 text-slate-400">
            ...
          </span>
        ),
      )}

      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages}
        className={`${baseStyle} ${page >= totalPages ? disabledStyle : idleStyle}`}
      >
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </nav>
  );
}
