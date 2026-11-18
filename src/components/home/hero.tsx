import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSearch from "@/components/home/hero-search";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            <BadgeCheck className="h-4 w-4" />
            Verified tutors and mentors
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Find Your Ideal Tutor or Mentorship Batch Today
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Search tuitions by subject, class level and mode. Apply in minutes
            and track every application, or post your own batches as a tutor.
          </p>

          <HeroSearch />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Link href="/tuitions">Browse Tuitions</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">Become a Tutor</Link>
            </Button>
          </div>
        </div>

        <div className="relative h-72 w-full overflow-hidden rounded-3xl shadow-lg sm:h-96 lg:h-[460px]">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
            alt="Students studying together"
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
