import { ListChecks, Search, Send, UserPlus } from "lucide-react";
import { LucideIcon } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";
import Reveal from "@/components/shared/reveal";

interface StepItem {
  icon: LucideIcon;
  title: string;
  text: string;
}

const STEPS: StepItem[] = [
  {
    icon: UserPlus,
    title: "Create an Account",
    text: "Sign up as a student or a tutor in under a minute.",
  },
  {
    icon: Search,
    title: "Find or Post Tuitions",
    text: "Students search and filter. Tutors post their batches for review.",
  },
  {
    icon: Send,
    title: "Apply and Connect",
    text: "Students apply with their schedule and a short learning note.",
  },
  {
    icon: ListChecks,
    title: "Track and Manage",
    text: "Tutors accept or reject applicants while students track status live.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
    >
      <SectionHeading
        eyebrow="How It Works"
        title="From Sign Up to First Class in 4 Steps"
        subtitle="A simple workflow for students looking for guidance and tutors building batches."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step: StepItem, index: number) => {
          const Icon: LucideIcon = step.icon;
          return (
            <Reveal key={step.title} delay={index * 100} className="h-full">
              <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="absolute top-4 right-5 text-4xl font-bold text-slate-100">
                  {index + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
