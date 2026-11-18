import Link from "next/link";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/shared/section-heading";
import Reveal from "@/components/shared/reveal";
import TuitionCard from "@/components/tuitions/tuition-card";
import { getLatestTuitions } from "@/lib/tuitions";
import { Tuition } from "@/types";

export default async function FeaturedTuitions() {
  const tuitions: Tuition[] = await getLatestTuitions();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Featured Tuitions"
        title="Latest Approved Tuitions"
        subtitle="Hand-checked listings from tutors across subjects and class levels."
      />

      {tuitions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          No tuitions available right now. Please check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tuitions.map((tuition: Tuition, index: number) => (
            <Reveal key={tuition._id} delay={index * 80} className="h-full">
              <TuitionCard tuition={tuition} />
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/tuitions">View All Tuitions</Link>
        </Button>
      </div>
    </section>
  );
}
