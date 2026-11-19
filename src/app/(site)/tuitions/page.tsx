import SectionHeading from "@/components/shared/section-heading";
import TuitionCard from "@/components/tuitions/tuition-card";
import TuitionFilters from "@/components/tuitions/tuition-filters";
import Pagination from "@/components/tuitions/pagination";
import { getTuitionFilters, getTuitions } from "@/lib/tuitions";
import {
  BrowseParams,
  Tuition,
  TuitionFilterOptions,
  TuitionsResponse,
} from "@/types";

type SearchParams = Record<string, string | string[] | undefined>;

interface BrowsePageProps {
  searchParams: Promise<SearchParams>;
}

const readParam = (value: string | string[] | undefined): string => {
  return typeof value === "string" ? value : "";
};

export default async function BrowseTuitionsPage({
  searchParams,
}: BrowsePageProps) {
  const raw: SearchParams = await searchParams;

  const params: BrowseParams = {
    q: readParam(raw.q),
    subject: readParam(raw.subject),
    classLevel: readParam(raw.classLevel),
    mode: readParam(raw.mode),
    page: Math.max(1, parseInt(readParam(raw.page), 10) || 1),
  };

  const [data, filters]: [TuitionsResponse, TuitionFilterOptions] =
    await Promise.all([getTuitions(params), getTuitionFilters()]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Browse Tuitions"
        title="Find the Right Tuition for You"
        subtitle="Search and filter approved tuitions by subject, class level and mode."
      />

      <TuitionFilters
        current={params}
        subjects={filters.subjects}
        classLevels={filters.classLevels}
      />

      <p className="mt-6 mb-4 text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold text-slate-900">
          {data.tuitions.length}
        </span>{" "}
        of <span className="font-semibold text-slate-900">{data.total}</span>{" "}
        tuitions
      </p>

      {data.tuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center">
          <p className="text-lg font-semibold text-slate-800">
            No tuitions found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different search or clear your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.tuitions.map((tuition: Tuition) => (
            <TuitionCard key={tuition._id} tuition={tuition} />
          ))}
        </div>
      )}

      <Pagination
        current={params}
        page={data.page}
        totalPages={data.totalPages}
      />
    </section>
  );
}
