export type TuitionMode = "Online" | "Offline";

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

export interface TuitionsResponse {
  tuitions: Tuition[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TuitionFilterOptions {
  subjects: string[];
  classLevels: string[];
}

export interface BrowseParams {
  q: string;
  subject: string;
  classLevel: string;
  mode: string;
  page: number;
}
