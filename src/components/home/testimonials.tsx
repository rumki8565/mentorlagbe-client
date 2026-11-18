import { Star } from "lucide-react";
import SectionHeading from "@/components/shared/section-heading";
import Reveal from "@/components/shared/reveal";

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: "Nusrat Jahan",
    role: "HSC Student",
    text: "I found a physics batch that fit my budget in one evening. Applying and tracking the status was so easy.",
  },
  {
    name: "Tanvir Hasan",
    role: "Programming Tutor",
    text: "Posting my batch took minutes, and I started receiving applications from serious students right away.",
  },
  {
    name: "Farhana Akter",
    role: "Parent",
    text: "Filtering by class level and online or offline mode saved us so much time. Highly recommended.",
  },
];

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2);
};

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Testimonials"
        title="Loved by Students and Tutors"
        subtitle="Real feedback from people learning and teaching on MentorLagbe."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((item: TestimonialItem, index: number) => (
          <Reveal key={item.name} delay={index * 100} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, starIndex: number) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                &ldquo;{item.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {getInitials(item.name)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {item.name}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
