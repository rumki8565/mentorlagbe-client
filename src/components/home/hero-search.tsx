"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed: string = query.trim();
    router.push(
      trimmed ? `/tuitions?q=${encodeURIComponent(trimmed)}` : "/tuitions",
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row"
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <Search className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by subject or title, e.g. Physics"
          className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
      <Button
        type="submit"
        className="bg-indigo-600 px-6 text-white hover:bg-indigo-700"
      >
        Find Tuitions
      </Button>
    </form>
  );
}
