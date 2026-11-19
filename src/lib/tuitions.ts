import {
  BrowseParams,
  Tuition,
  TuitionFilterOptions,
  TuitionsResponse,
} from "@/types";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "";

export const PAGE_SIZE: number = 9;

export const formatFee = (fee: number): string => {
  return `৳${fee.toLocaleString("en-US")}`;
};

export const getLatestTuitions = async (): Promise<Tuition[]> => {
  try {
    const res: Response = await fetch(`${API_URL}/api/tuitions/latest`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return [];
    }
    return (await res.json()) as Tuition[];
  } catch {
    return [];
  }
};

// Builds a query string like "q=math&mode=Online&page=2" (empty values are skipped)
export const buildBrowseQuery = (
  params: BrowseParams,
  overrides: Partial<BrowseParams> = {},
): string => {
  const merged: BrowseParams = { ...params, ...overrides };
  const search = new URLSearchParams();

  if (merged.q) search.set("q", merged.q);
  if (merged.subject) search.set("subject", merged.subject);
  if (merged.classLevel) search.set("classLevel", merged.classLevel);
  if (merged.mode) search.set("mode", merged.mode);
  if (merged.page > 1) search.set("page", String(merged.page));

  return search.toString();
};

export const getTuitions = async (
  params: BrowseParams,
): Promise<TuitionsResponse> => {
  const empty: TuitionsResponse = {
    tuitions: [],
    total: 0,
    page: 1,
    totalPages: 1,
  };
  try {
    const query: string = buildBrowseQuery(params);
    const separator: string = query ? "&" : "";
    const res: Response = await fetch(
      `${API_URL}/api/tuitions?${query}${separator}limit=${PAGE_SIZE}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      return empty;
    }
    return (await res.json()) as TuitionsResponse;
  } catch {
    return empty;
  }
};

export const getTuitionFilters = async (): Promise<TuitionFilterOptions> => {
  const empty: TuitionFilterOptions = { subjects: [], classLevels: [] };
  try {
    const res: Response = await fetch(`${API_URL}/api/tuitions/filters`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return empty;
    }
    return (await res.json()) as TuitionFilterOptions;
  } catch {
    return empty;
  }
};

export const getTuitionById = async (id: string): Promise<Tuition | null> => {
  try {
    const res: Response = await fetch(`${API_URL}/api/tuitions/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as Tuition;
  } catch {
    return null;
  }
};
