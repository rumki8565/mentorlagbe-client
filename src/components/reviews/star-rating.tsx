import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export default function StarRating({
  rating,
  className = "h-4 w-4",
}: StarRatingProps) {
  const filled: number = Math.round(rating);

  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index: number) => (
        <Star
          key={index}
          className={`${className} ${
            index < filled ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}
