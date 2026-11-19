"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

interface ApplyPanelProps {
  tuitionId: string;
}

interface ApplyValues {
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
}

type ApplyErrors = Partial<Record<keyof ApplyValues, string>>;

interface CheckResponse {
  applied: boolean;
  status: string | null;
}

const PHONE_PATTERN: RegExp = /^[+\d][\d\s-]{6,}$/;

const validate = (values: ApplyValues): ApplyErrors => {
  const errors: ApplyErrors = {};
  if (!PHONE_PATTERN.test(values.studentPhone.trim())) {
    errors.studentPhone = "Enter a valid phone number";
  }
  if (values.preferredSchedule.trim().length < 3) {
    errors.preferredSchedule = "Preferred schedule is required";
  }
  if (values.studentNote.trim().length < 10) {
    errors.studentNote = "Write at least 10 characters";
  }
  return errors;
};

export default function ApplyPanel({ tuitionId }: ApplyPanelProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // null = still checking, true/false = result from the server
  const [alreadyApplied, setAlreadyApplied] = useState<boolean | null>(null);
  const [values, setValues] = useState<ApplyValues>({
    studentPhone: "",
    preferredSchedule: "",
    studentNote: "",
  });
  const [errors, setErrors] = useState<ApplyErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const isStudent: boolean = user?.role === "student";
  const checking: boolean = isStudent && alreadyApplied === null;

  useEffect(() => {
    if (!isStudent) {
      return;
    }
    let cancelled: boolean = false;
    apiFetch<CheckResponse>(`/api/applications/check/${tuitionId}`)
      .then((data: CheckResponse) => {
        if (!cancelled) setAlreadyApplied(data.applied);
      })
      .catch(() => {
        if (!cancelled) setAlreadyApplied(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isStudent, tuitionId]);

  const handleChange = (field: keyof ApplyValues, value: string): void => {
    setValues((prev: ApplyValues) => ({ ...prev, [field]: value }));
    setErrors((prev: ApplyErrors) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const validationErrors: ApplyErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch<{ insertedId: string }>("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          tuitionId,
          studentPhone: values.studentPhone.trim(),
          preferredSchedule: values.preferredSchedule.trim(),
          studentNote: values.studentNote.trim(),
        }),
      });
      toast.success("Application submitted successfully!");
      setAlreadyApplied(true);
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : "Could not submit application";
      toast.error(message);
      if (message.toLowerCase().includes("already applied")) {
        setAlreadyApplied(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const cardStyle: string =
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

  if (isPending) {
    return <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (!user) {
    return (
      <div className={cardStyle}>
        <h3 className="text-lg font-semibold text-slate-900">
          Apply for this Tuition
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Please sign in as a student to apply for this tuition.
        </p>
        <Button
          asChild
          className="mt-5 w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link href="/sign-in">Sign In to Apply</Link>
        </Button>
      </div>
    );
  }

  if (!isStudent) {
    return (
      <div className={cardStyle}>
        <h3 className="text-lg font-semibold text-slate-900">
          Apply for this Tuition
        </h3>
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Only students can apply for tuitions. You are signed in as a{" "}
          {user.role}.
        </p>
        <Button disabled className="mt-5 w-full">
          Apply Now
        </Button>
      </div>
    );
  }

  if (checking) {
    return <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />;
  }

  if (alreadyApplied) {
    return (
      <div className={cardStyle}>
        <h3 className="text-lg font-semibold text-slate-900">
          Application Sent
        </h3>
        <p className="mt-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
          You have already applied for this tuition. Track its status in your
          dashboard.
        </p>
        <Button asChild variant="outline" className="mt-5 w-full">
          <Link href="/dashboard/student/my-applications">
            View My Applications
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cardStyle}>
      <h3 className="text-lg font-semibold text-slate-900">
        Apply for this Tuition
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Applying as {user.name} ({user.email})
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="studentPhone">Phone</Label>
          <Input
            id="studentPhone"
            placeholder="01XXXXXXXXX"
            value={values.studentPhone}
            onChange={(e) => handleChange("studentPhone", e.target.value)}
          />
          {errors.studentPhone && (
            <p className="text-xs text-red-600">{errors.studentPhone}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="preferredSchedule">Preferred Schedule</Label>
          <Input
            id="preferredSchedule"
            placeholder="e.g. Sat, Mon, Wed evenings"
            value={values.preferredSchedule}
            onChange={(e) => handleChange("preferredSchedule", e.target.value)}
          />
          {errors.preferredSchedule && (
            <p className="text-xs text-red-600">{errors.preferredSchedule}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="studentNote">Learning Note</Label>
          <Textarea
            id="studentNote"
            rows={4}
            placeholder="Tell the tutor what you want to learn"
            value={values.studentNote}
            onChange={(e) => handleChange("studentNote", e.target.value)}
          />
          {errors.studentNote && (
            <p className="text-xs text-red-600">{errors.studentNote}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {submitting ? "Submitting..." : "Apply Now"}
        </Button>
      </form>
    </div>
  );
}
