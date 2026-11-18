import Link from "next/link";
import {
  Atom,
  Calculator,
  Code,
  Languages,
  LucideIcon,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";
import Reveal from "@/components/shared/reveal";

interface SubjectItem {
  name: string;
  icon: LucideIcon;
}

interface StatItem {
  value: string;
  label: string;
}

const SUBJECTS: SubjectItem[] = [
  { name: "Math", icon: Calculator },
  { name: "Physics", icon: Atom },
  { name: "Programming", icon: Code },
  { name: "IELTS", icon: Languages },
  { name: "Chemistry", icon: FlaskConical },
  { name: "English", icon: BookOpen },
];

const STATS: StatItem[] = [
  { value: "1,200+", label: "Verified Tutors" },
  { value: "8,500+", label: "Happy Students" },
  { value: "3,000+", label: "Tuition Batches" },
  { value: "50+", label: "Subjects Covered" },
];

export default function SubjectsStats() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Top Subjects"
          title="Popular Subjects on MentorLagbe"
          subtitle="Jump straight into the subjects students search for the most."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SUBJECTS.map((subject: SubjectItem, index: number) => {
            const Icon: LucideIcon = subject.icon;
            return (
              <Reveal key={subject.name} delay={index * 60} className="h-full">
                <Link
                  href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
                  className="flex h-full flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {subject.name}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-6 rounded-2xl bg-indigo-600 p-8 text-center text-white lg:grid-cols-4">
          {STATS.map((stat: StatItem) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-indigo-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
