export type AppRole = "student" | "tutor" | "admin";

export const isAppRole = (value: unknown): value is AppRole => {
  return value === "student" || value === "tutor" || value === "admin";
};

export const getDashboardPath = (role: unknown): string => {
  return isAppRole(role) ? `/dashboard/${role}` : "/dashboard/student";
};
