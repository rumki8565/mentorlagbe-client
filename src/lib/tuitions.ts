import { Tuition } from "@/types";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? "";

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

export const formatFee = (fee: number): string => {
  return `৳${fee.toLocaleString("en-US")}`;
};
