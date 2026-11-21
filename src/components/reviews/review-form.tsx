"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StarInput from "@/components/reviews/star-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { MyReview } from "@/types";

interface ReviewFormProps {
  tuitionId: string;
}

export default function ReviewForm({ tuitionId }: ReviewFormProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const isStudent: boolean = session?.user.role === "student";

  const [mine, setMine] = useState<MyReview | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!isStudent) {
      return;
    }
    let cancelled: boolean = false;
    apiFetch<MyReview>(`/api/reviews/${tuitionId}/mine`)
      .then((data: MyReview) => {
        if (!cancelled) {
          setMine(data);
          setRating(data.rating ?? 0);
          setFeedback(data.feedback ?? "");
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isStudent, tuitionId]);

  // Tutors, admins and signed-out visitors do not see the review form
  if (isPending || !isStudent) {
    return null;
  }
  if (!mine) {
    return <div className="mt-8 h-40 animate-pulse rounded-2xl bg-slate-100" />;
  }
  if (!mine.eligible) {
    return (
      <p className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        You can leave a review once a tutor accepts your application for this
        tuition.
      </p>
    );
  }

  const hasReview: boolean = mine.rating !== null;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (rating < 1) {
      toast.error("Please choose a star rating");
      return;
    }
    if (feedback.trim().length < 10) {
      toast.error("Please write at least 10 characters of feedback");
      return;
    }

    setSaving(true);
    try {
      await apiFetch<{ message: string }>(`/api/reviews/${tuitionId}`, {
        method: "POST",
        body: JSON.stringify({ rating, feedback: feedback.trim() }),
      });
      toast.success(hasReview ? "Review updated" : "Thanks for your review!");
      setMine({ eligible: true, rating, feedback: feedback.trim() });
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Could not save your review",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6"
    >
      <h3 className="text-lg font-semibold text-slate-900">
        {hasReview ? "Update your review" : "Rate this tuition"}
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Your application was accepted. Share your experience with other
        students.
      </p>

      <div className="mt-4">
        <StarInput value={rating} onChange={setRating} />
      </div>

      <Textarea
        rows={4}
        maxLength={500}
        placeholder="What did you like about this tuition?"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="mt-4 bg-white"
      />
      <p className="mt-1 text-right text-xs text-slate-400">
        {feedback.length}/500
      </p>

      <Button
        type="submit"
        disabled={saving}
        className="mt-3 bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {saving ? "Saving..." : hasReview ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
}
