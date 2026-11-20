"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import ImageUploader from "@/components/shared/image-uploader";
import RoleBadge from "@/components/shared/role-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

interface ProfileUser {
  name: string;
  email: string;
  image: string;
  phone: string;
  bio: string;
  role: string;
  plan: string;
}

interface ProfileValues {
  name: string;
  phone: string;
  bio: string;
  image: string;
}

type ProfileErrors = Partial<Record<keyof ProfileValues, string>>;

const PHONE_PATTERN: RegExp = /^[+\d][\d\s-]{6,}$/;
const BIO_LIMIT: number = 300;

const validate = (values: ProfileValues): ProfileErrors => {
  const errors: ProfileErrors = {};
  if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  if (values.phone.trim() && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }
  if (values.bio.length > BIO_LIMIT) {
    errors.bio = `Bio must be ${BIO_LIMIT} characters or fewer`;
  }
  return errors;
};

function ProfileForm({ user }: { user: ProfileUser }) {
  const [values, setValues] = useState<ProfileValues>({
    name: user.name,
    phone: user.phone,
    bio: user.bio,
    image: user.image,
  });
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState<boolean>(false);

  const handleChange = (field: keyof ProfileValues, value: string): void => {
    setValues((prev: ProfileValues) => ({ ...prev, [field]: value }));
    setErrors((prev: ProfileErrors) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const validationErrors: ProfileErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    const { error } = await authClient.updateUser({
      name: values.name.trim(),
      phone: values.phone.trim(),
      bio: values.bio.trim(),
      ...(values.image ? { image: values.image } : {}),
    });
    setSaving(false);

    if (error) {
      toast.error(error.message ?? "Could not update profile");
      return;
    }
    toast.success("Profile updated successfully");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Update Profile"
        subtitle="Keep your details up to date so tutors and students know who you are."
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <RoleBadge role={user.role} />
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              user.plan === "pro"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
          </span>
        </div>

        <div className="space-y-1.5">
          <Label>Profile Picture</Label>
          <ImageUploader
            shape="avatar"
            value={values.image}
            onChange={(url: string) => handleChange("image", url)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled readOnly />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="01XXXXXXXXX"
              value={values.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder="Tell others a little about yourself"
            value={values.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
          <div className="flex justify-between text-xs">
            <span className="text-red-600">{errors.bio}</span>
            <span className="text-slate-400">
              {values.bio.length}/{BIO_LIMIT}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) {
    return <DashboardSkeleton rows={5} />;
  }

  const user: ProfileUser = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? "",
    phone: session.user.phone ?? "",
    bio: session.user.bio ?? "",
    role: session.user.role,
    plan: typeof session.user.plan === "string" ? session.user.plan : "free",
  };

  return <ProfileForm user={user} />;
}
