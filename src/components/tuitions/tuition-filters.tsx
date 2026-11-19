"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildBrowseQuery } from "@/lib/tuitions";
import { BrowseParams } from "@/types";

interface TuitionFiltersProps {
  current: BrowseParams;
  subjects: string[];
  classLevels: string[];
}

const withCurrent = (options: string[], value: string): string[] => {
  return value && !options.includes(value) ? [...options, value] : options;
};

const SELECT_STYLE: string =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export default function TuitionFilters({
  current,
  subjects,
  classLevels,
}: TuitionFiltersProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>(current.q);

  const navigate = (overrides: Partial<BrowseParams>): void => {
    // Any filter change goes back to page 1
    const queryString: string = buildBrowseQuery(current, {
      ...overrides,
      page: 1,
    });
    router.push(queryString ? `/tuitions?${queryString}` : "/tuitions");
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    navigate({ q: query.trim() });
  };

  const handleReset = (): void => {
    setQuery("");
    router.push("/tuitions");
  };

  const hasFilters: boolean = Boolean(
    current.q || current.subject || current.classLevel || current.mode,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or subject"
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <Button
          type="submit"
          className="bg-indigo-600 px-6 text-white hover:bg-indigo-700"
        >
          Search
        </Button>
      </form>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          aria-label="Subject"
          value={current.subject}
          onChange={(e) => navigate({ subject: e.target.value })}
          className={SELECT_STYLE}
        >
          <option value="">All Subjects</option>
          {withCurrent(subjects, current.subject).map((item: string) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Class level"
          value={current.classLevel}
          onChange={(e) => navigate({ classLevel: e.target.value })}
          className={SELECT_STYLE}
        >
          <option value="">All Class Levels</option>
          {withCurrent(classLevels, current.classLevel).map((item: string) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Mode"
          value={current.mode}
          onChange={(e) => navigate({ mode: e.target.value })}
          className={SELECT_STYLE}
        >
          <option value="">Online and Offline</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={!hasFilters}
          className="h-10"
        >
          <X className="mr-1 h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
