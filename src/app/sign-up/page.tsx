"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell from "@/components/auth/auth-shell";
import { authClient } from "@/lib/auth-client";
import {
  FieldErrors,
  SignUpValues,
  UserRole,
  validateSignUp,
} from "@/lib/validators";

const ROLES: { value: UserRole; label: string; hint: string }[] = [
  { value: "student", label: "Student", hint: "Find tutors" },
  { value: "tutor", label: "Tutor", hint: "Post tuitions" },
];

export default function SignUpPage() {
  const router = useRouter();
  const [values, setValues] = useState<SignUpValues>({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [errors, setErrors] = useState<FieldErrors<SignUpValues>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof SignUpValues, value: string): void => {
    setValues((prev: SignUpValues) => ({ ...prev, [field]: value }));
    setErrors((prev: FieldErrors<SignUpValues>) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const validationErrors: FieldErrors<SignUpValues> = validateSignUp(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      role: values.role,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Sign up failed. Please try again.");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/");
    router.refresh();
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join MentorLagbe as a student or a tutor"
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerHref="/sign-in"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>I am a</Label>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => handleChange("role", role.value)}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  values.role === role.value
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {role.label}
                </span>
                <span className="block text-xs">{role.hint}</span>
              </button>
            ))}
          </div>
          {errors.role && <p className="text-xs text-red-600">{errors.role}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </AuthShell>
  );
}
