import Image from "next/image";
import Link from "next/link";
import { BookOpen, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFee } from "@/lib/tuitions";
import { Tuition } from "@/types";

interface TuitionCardProps {
  tuition: Tuition;
}

export default function TuitionCard({ tuition }: TuitionCardProps) {
  const isOnline: boolean = tuition.mode === "Online";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-44 w-full shrink-0 bg-slate-100">
        <Image
          src={tuition.bannerImage}
          alt={tuition.title}
          fill
          unoptimized
          className="object-cover"
        />
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold ${
            isOnline
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {tuition.mode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-slate-900">
          {tuition.title}
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            {tuition.subject}
          </li>
          <li className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-600" />
            {tuition.classLevel}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-600" />
            <span className="truncate">{tuition.location}</span>
          </li>
        </ul>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Tutor</p>
            <p className="max-w-[140px] truncate text-sm font-medium text-slate-800">
              {tuition.tutorName}
            </p>
          </div>
          <p className="text-lg font-bold text-indigo-600">
            {formatFee(tuition.monthlyFee)}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </p>
        </div>

        <Button
          asChild
          className="mt-5 w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link href={`/tuitions/${tuition._id}`}>View Details</Link>
        </Button>
      </div>
    </article>
  );
}
