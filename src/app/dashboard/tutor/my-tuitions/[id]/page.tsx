"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import TuitionForm, {
  TuitionFormValues,
} from "@/components/dashboard/tuition-form";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ErrorState from "@/components/dashboard/error-state";
import { apiFetch } from "@/lib/api";
import { useApiData } from "@/lib/use-api-data";
import { Tuition, TuitionPayload } from "@/types";

export default function EditTuitionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id: string = params.id;

  const { data, error, loading } = useApiData<Tuition[]>("/api/tuitions/mine");

  const handleSubmit = async (payload: TuitionPayload): Promise<void> => {
    try {
      await apiFetch<{ message: string }>(`/api/tuitions/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      toast.success("Tuition updated and sent for approval");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not update tuition",
      );
    }
  };

  if (loading) {
    return <DashboardSkeleton rows={5} />;
  }
  if (error || !data) {
    return <ErrorState message={error ?? "No data returned"} />;
  }

  const tuition: Tuition | undefined = data.find(
    (item: Tuition) => item._id === id,
  );
  if (!tuition) {
    return <ErrorState message="Tuition not found" />;
  }

  const initialValues: TuitionFormValues = {
    title: tuition.title,
    subject: tuition.subject,
    classLevel: tuition.classLevel,
    mode: tuition.mode,
    location: tuition.location,
    monthlyFee: String(tuition.monthlyFee),
    daysPerWeek: String(tuition.daysPerWeek),
    bannerImage: tuition.bannerImage,
    description: tuition.description,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/tutor/my-tuitions"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Tuitions
      </Link>
      <PageHeader
        title="Edit Tuition"
        subtitle="After saving, your tuition goes back to admin for approval."
      />
      <TuitionForm
        initialValues={initialValues}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
