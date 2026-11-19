"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

export const useSignOut = (): (() => Promise<void>) => {
  const router = useRouter();

  return async (): Promise<void> => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message ?? "Could not sign out");
      return;
    }
    clearToken();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };
};
