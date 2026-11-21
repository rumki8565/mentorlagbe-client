"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function StarInput({ value, onChange }: StarInputProps) {
  const [hover, setHover] = useState<number>(0);
  const active: number = hover || value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star: number) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(star)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`h-8 w-8 transition ${
              star <= active
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
