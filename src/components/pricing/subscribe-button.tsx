"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { PlanAudience } from "@/lib/plans";

interface SubscribeButtonProps {
  audience: PlanAudience;
}

export default function SubscribeButton({ audience }: SubscribeButtonProps) {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const user = session?.user;
  const baseStyle: string = "mt-8 w-full";

  const handleSubscribe = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await apiFetch<{ url: string | null }>(
        "/api/payments/create-checkout-session",
        { method: "POST" },
      );
      if (!result.url) {
        throw new Error("Stripe did not return a checkout link");
      }
      window.location.assign(result.url);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Could not start checkout",
      );
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <Button disabled className={baseStyle}>
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button
        asChild
        className={`${baseStyle} bg-indigo-600 text-white hover:bg-indigo-700`}
      >
        <Link href="/sign-in">Sign In to Subscribe</Link>
      </Button>
    );
  }

  if (user.role !== audience) {
    return (
      <Button disabled className={baseStyle}>
        {audience === "tutor" ? "For tutors only" : "For students only"}
      </Button>
    );
  }

  if (user.plan === "pro") {
    return (
      <Button disabled className={baseStyle}>
        Current Plan: Pro
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      className={`${baseStyle} bg-indigo-600 text-white hover:bg-indigo-700`}
    >
      {loading ? "Redirecting to Stripe..." : "Subscribe with Stripe"}
    </Button>
  );
}
