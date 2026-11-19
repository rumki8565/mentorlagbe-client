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

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorEmail: string;
  tutorName?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface StudentStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export interface TutorStats {
  total: number;
  approved: number;
  pending: number;
  applicants: number;
  plan: string;
  freeLimit: number;
}

export interface TuitionPayload {
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
}
