"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TuitionMode, TuitionPayload } from "@/types";

export interface TuitionFormValues {
  title: string;
  subject: string;
  classLevel: string;
  mode: TuitionMode;
  location: string;
  monthlyFee: string;
  daysPerWeek: string;
  bannerImage: string;
  description: string;
}

type FormErrors = Partial<Record<keyof TuitionFormValues, string>>;

interface TuitionFormProps {
  initialValues?: TuitionFormValues;
  submitLabel: string;
  onSubmit: (payload: TuitionPayload) => Promise<void>;
}

export const EMPTY_TUITION_VALUES: TuitionFormValues = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Online",
  location: "",
  monthlyFee: "",
  daysPerWeek: "",
  bannerImage: "",
  description: "",
};

const CLASS_LEVELS: string[] = [
  "Class 1-5",
  "Class 6-8",
  "SSC",
  "HSC",
  "Admission",
  "University",
  "Professional",
];

const SUBJECT_SUGGESTIONS: string[] = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Programming",
  "IELTS",
];

const SELECT_STYLE: string =
  "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const validate = (values: TuitionFormValues): FormErrors => {
  const errors: FormErrors = {};
  const fee: number = Number(values.monthlyFee);
  const days: number = Number(values.daysPerWeek);

  if (values.title.trim().length < 5)
    errors.title = "Title must be at least 5 characters";
  if (!values.subject.trim()) errors.subject = "Subject is required";
  if (!values.classLevel) errors.classLevel = "Class level is required";
  if (!values.location.trim()) errors.location = "Location is required";
  if (!Number.isFinite(fee) || fee <= 0)
    errors.monthlyFee = "Enter a fee greater than 0";
  if (!Number.isInteger(days) || days < 1 || days > 7) {
    errors.daysPerWeek = "Days per week must be between 1 and 7";
  }
  if (!values.bannerImage.trim().startsWith("http")) {
    errors.bannerImage = "Enter a valid image URL starting with http";
  }
  if (values.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters";
  }
  return errors;
};

export default function TuitionForm({
  initialValues,
  submitLabel,
  onSubmit,
}: TuitionFormProps) {
  const [values, setValues] = useState<TuitionFormValues>(
    initialValues ?? EMPTY_TUITION_VALUES,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const levels: string[] =
    values.classLevel && !CLASS_LEVELS.includes(values.classLevel)
      ? [...CLASS_LEVELS, values.classLevel]
      : CLASS_LEVELS;

  const handleChange = (
    field: keyof TuitionFormValues,
    value: string,
  ): void => {
    setValues((prev: TuitionFormValues) => ({ ...prev, [field]: value }));
    setErrors((prev: FormErrors) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const validationErrors: FormErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    const payload: TuitionPayload = {
      title: values.title.trim(),
      subject: values.subject.trim(),
      classLevel: values.classLevel,
      mode: values.mode,
      location: values.location.trim(),
      monthlyFee: Number(values.monthlyFee),
      daysPerWeek: Number(values.daysPerWeek),
      bannerImage: values.bannerImage.trim(),
      description: values.description.trim(),
    };

    setSubmitting(true);
    await onSubmit(payload);
    setSubmitting(false);
  };

  const errorText = (field: keyof TuitionFormValues) =>
    errors[field] ? (
      <p className="text-xs text-red-600">{errors[field]}</p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="e.g. HSC Physics Concept Batch"
          value={values.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errorText("title")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            list="subject-suggestions"
            placeholder="e.g. Physics"
            value={values.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
          />
          <datalist id="subject-suggestions">
            {SUBJECT_SUGGESTIONS.map((item: string) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          {errorText("subject")}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="classLevel">Class Level</Label>
          <select
            id="classLevel"
            value={values.classLevel}
            onChange={(e) => handleChange("classLevel", e.target.value)}
            className={SELECT_STYLE}
          >
            <option value="">Select class level</option>
            {levels.map((item: string) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errorText("classLevel")}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mode">Mode</Label>
          <select
            id="mode"
            value={values.mode}
            onChange={(e) => handleChange("mode", e.target.value)}
            className={SELECT_STYLE}
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Chittagong or Zoom"
            value={values.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
          {errorText("location")}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="monthlyFee">Monthly Fee (BDT)</Label>
          <Input
            id="monthlyFee"
            type="number"
            min={1}
            placeholder="e.g. 2500"
            value={values.monthlyFee}
            onChange={(e) => handleChange("monthlyFee", e.target.value)}
          />
          {errorText("monthlyFee")}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="daysPerWeek">Days per Week</Label>
          <Input
            id="daysPerWeek"
            type="number"
            min={1}
            max={7}
            placeholder="1 to 7"
            value={values.daysPerWeek}
            onChange={(e) => handleChange("daysPerWeek", e.target.value)}
          />
          {errorText("daysPerWeek")}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bannerImage">Banner Image URL</Label>
        <Input
          id="bannerImage"
          placeholder="https://..."
          value={values.bannerImage}
          onChange={(e) => handleChange("bannerImage", e.target.value)}
        />
        {errorText("bannerImage")}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Describe the syllabus, teaching style and who this batch is for"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        {errorText("description")}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto"
      >
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
