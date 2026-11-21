"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-2 h-5 w-5">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
    />
  </svg>
);

export default function GoogleButton() {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async (): Promise<void> => {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/auth/welcome`,
      errorCallbackURL: `${window.location.origin}/sign-in`,
    });

    // On success the browser is redirected to Google, so we only get here on failure
    if (error) {
      toast.error(error.message ?? "Could not start Google sign in");
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative mb-6 flex items-center">
        <div className="flex-1 border-t border-slate-200" />
        <span className="px-3 text-xs font-medium text-slate-400 uppercase">
          or
        </span>
        <div className="flex-1 border-t border-slate-200" />
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={loading}
        onClick={handleClick}
        className="w-full"
      >
        <GoogleIcon />
        {loading ? "Redirecting to Google..." : "Continue with Google"}
      </Button>
    </div>
  );
}
