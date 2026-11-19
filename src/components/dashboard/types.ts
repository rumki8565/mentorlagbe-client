import { AppRole } from "@/lib/roles";

export interface DashboardUser {
  name: string;
  email: string;
  image: string | null;
  role: AppRole;
  plan: string;
}
