import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
  Wallet,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import ApplyPanel from "@/components/tuitions/apply-panel";
import BookmarkButton from "@/components/saved/bookmark-button";
import ReviewForm from "@/components/reviews/review-form";
import ReviewsSection from "@/components/reviews/reviews-section";
import StarRating from "@/components/reviews/star-rating";
import { formatFee, getReviews, getTuitionById } from "@/lib/tuitions";
import { ReviewsResponse, Tuition } from "@/types";

interface TuitionDetailsPageProps {
  params: Promise<{ id: string }>;
}

interface InfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default async function TuitionDetailsPage({
  params,
}: TuitionDetailsPageProps) {
  const { id } = await params;
  const tuition: Tuition | null = await getTuitionById(id);

  if (!tuition) {
    notFound();
  }

  const reviewData: ReviewsResponse = await getReviews(id);

  const info: InfoItem[] = [
    { icon: BookOpen, label: "Subject", value: tuition.subject },
    { icon: GraduationCap, label: "Class Level", value: tuition.classLevel },
    {
      icon: CalendarDays,
      label: "Schedule",
      value: `${tuition.daysPerWeek} days per week`,
    },
    {
      icon: MapPin,
      label: `${tuition.mode} Location`,
      value: tuition.location,
    },
    {
      icon: Wallet,
      label: "Monthly Fee",
      value: formatFee(tuition.monthlyFee),
    },
  ];

  const tutorInitial: string = tuition.tutorName.charAt(0).toUpperCase();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/tuitions"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse Tuitions
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-96">
            <Image
              src={tuition.bannerImage}
              alt={tuition.title}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                tuition.mode === "Online"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {tuition.mode}
            </span>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {tuition.subject}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {tuition.title}
          </h1>

          {reviewData.count > 0 && (
            <a href="#reviews" className="mt-3 inline-flex items-center gap-2">
              <StarRating rating={reviewData.average} />
              <span className="text-sm font-medium text-slate-700">
                {reviewData.average.toFixed(1)} ({reviewData.count} review
                {reviewData.count > 1 ? "s" : ""})
              </span>
            </a>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {info.map((item: InfoItem) => {
              const Icon: LucideIcon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900">
              About this Tuition
            </h2>
            <p className="mt-3 leading-7 whitespace-pre-line text-slate-600">
              {tuition.description}
            </p>
          </div>

          <div id="reviews" className="scroll-mt-24">
            <ReviewForm tuitionId={tuition._id} />
            <ReviewsSection data={reviewData} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Monthly Fee</p>
            <p className="text-3xl font-bold text-indigo-600">
              {formatFee(tuition.monthlyFee)}
              <span className="text-sm font-normal text-slate-500">
                {" "}
                / month
              </span>
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
                {tutorInitial}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Tutor</p>
                <p className="truncate font-semibold text-slate-900">
                  {tuition.tutorName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {tuition.tutorEmail}
                </p>
              </div>
            </div>
          </div>

          <BookmarkButton tuitionId={tuition._id} variant="full" />
          <ApplyPanel tuitionId={tuition._id} />
        </aside>
      </div>
    </section>
  );
}
