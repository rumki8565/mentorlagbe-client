"use client";

import { FormEvent, useEffect, useState } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell from "@/components/auth/auth-shell";
import { authClient } from "@/lib/auth-client";
import { FieldErrors, SignInValues, validateSignIn } from "@/lib/validators";
import { getToken } from "@/lib/api";
import { getDashboardPath } from "@/lib/roles";
import GoogleButton from "@/components/auth/google-button";

export default function SignInPage() {
  const [values, setValues] = useState<SignInValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors<SignInValues>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const error: string | null = new URLSearchParams(
      window.location.search,
    ).get("error");
    if (error === "account_not_linked") {
      toast.error(
        "This email is already registered with a password. Please sign in with your email and password.",
      );
    } else if (error) {
      toast.error("Google sign in failed. Please try again.");
    }
  }, []);

  const handleChange = (field: keyof SignInValues, value: string): void => {
    setValues((prev: SignInValues) => ({ ...prev, [field]: value }));
    setErrors((prev: FieldErrors<SignInValues>) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const validationErrors: FieldErrors<SignInValues> = validateSignIn(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);
    const { data, error } = await authClient.signIn.email({
      email: values.email.trim(),
      password: values.password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Invalid email or password");
      return;
    }
    await getToken(true);
    toast.success("Welcome back!");
    window.location.assign(getDashboardPath(data?.user.role));
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to MentorLagbe"
      footerText="New to MentorLagbe?"
      footerLinkText="Create an account"
      footerHref="/sign-up"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            placeholder="Your password"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <GoogleButton />
    </AuthShell>
  );
}
