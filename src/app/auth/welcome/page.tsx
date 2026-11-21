"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, UserRound } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/shared/logo";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/roles";

const NEW_ACCOUNT_WINDOW_MS: number = 15 * 60 * 1000;

type ChosenRole = "student" | "tutor";

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [now] = useState<number>(() => Date.now());
  const [saving, setSaving] = useState<boolean>(false);

  const user = session?.user;
  const isNewAccount: boolean = user
    ? !user.onboarded &&
      now - new Date(user.createdAt).getTime() < NEW_ACCOUNT_WINDOW_MS
    : false;

  let target: string | null = null;
  if (!isPending) {
    if (!user) {
      target = "/sign-in";
    } else if (!isNewAccount) {
      target = getDashboardPath(user.role);
    }
  }

  useEffect(() => {
    if (target) {
      router.replace(target);
    }
  }, [target, router]);

  if (isPending || target || !user) {
    return <Spinner />;
  }

  const handleChoose = async (role: ChosenRole): Promise<void> => {
    setSaving(true);
    try {
      await apiFetch<{ role: string }>("/api/users/onboarding-role", {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      window.location.assign(getDashboardPath(role));
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Could not save your choice",
      );
      setSaving(false);
    }
  };

  const options: {
    role: ChosenRole;
    title: string;
    text: string;
    icon: typeof UserRound;
  }[] = [
    {
      role: "student",
      title: "I'm a Student",
      text: "Find tutors and apply for tuitions",
      icon: UserRound,
    },
    {
      role: "tutor",
      title: "I'm a Tutor",
      text: "Post batches and manage applicants",
      icon: GraduationCap,
    },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-2xl font-semibold text-slate-900">
          Welcome, {user.name}!
        </h1>
        <p className="mt-1 mb-6 text-center text-sm text-slate-500">
          How would you like to use MentorLagbe?
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.role}
                type="button"
                disabled={saving}
                onClick={() => handleChoose(option.role)}
                className="flex flex-col items-center rounded-xl border border-slate-200 p-6 text-center transition hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-60"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-3 font-semibold text-slate-900">
                  {option.title}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
