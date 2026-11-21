export type PlanAudience = "tutor" | "student";

export interface PlanDetails {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted: boolean;
}

export const PLANS: Record<PlanAudience, PlanDetails[]> = {
  tutor: [
    {
      id: "tutor-free",
      name: "Free Tutor",
      price: 0,
      description: "Get started and reach your first students.",
      features: [
        "Up to 2 tuition posts",
        "Receive student applications",
        "Manage applicants in your dashboard",
        "Standard listing",
      ],
      highlighted: false,
    },
    {
      id: "tutor-pro",
      name: "Pro Tutor",
      price: 15,
      description: "Grow your batches with no limits.",
      features: [
        "Unlimited tuition posts",
        "Verified Pro badge on your profile",
        "Receive student applications",
        "Manage applicants in your dashboard",
      ],
      highlighted: true,
    },
  ],
  student: [
    {
      id: "student-free",
      name: "Free Student",
      price: 0,
      description: "Find and apply to tutors at no cost.",
      features: [
        "Browse all approved tuitions",
        "Apply to tuitions",
        "Track application status",
        "Save up to 5 tuitions",
      ],
      highlighted: false,
    },
    {
      id: "student-pro",
      name: "Pro Student",
      price: 10,
      description: "Stand out and get booked faster.",
      features: [
        "Priority booking with tutors",
        "Verified Pro badge on your profile",
        "Unlimited saved tuitions",
        "Track application status",
      ],
      highlighted: true,
    },
  ],
};
