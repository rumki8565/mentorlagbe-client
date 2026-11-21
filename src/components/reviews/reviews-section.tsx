import StarRating from "@/components/reviews/star-rating";
import { formatDate } from "@/lib/format";
import { Review, ReviewsResponse } from "@/types";

interface ReviewsSectionProps {
  data: ReviewsResponse;
}

export default function ReviewsSection({ data }: ReviewsSectionProps) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-slate-900">
          Student Reviews
        </h2>
        {data.count > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={data.average} />
            <span className="text-sm font-medium text-slate-700">
              {data.average.toFixed(1)} ({data.count} review
              {data.count > 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {data.count === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 py-8 text-center text-sm text-slate-500">
          No reviews yet. Accepted students can be the first to leave one.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {data.reviews.map((review: Review) => (
            <article
              key={review._id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {review.studentName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {review.studentName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(review.reviewedAt)}
                  </p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {review.feedback}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
