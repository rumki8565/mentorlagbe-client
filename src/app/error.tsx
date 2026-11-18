"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-6xl font-bold text-red-500">Oops!</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-slate-600">
        An unexpected error occurred. You can try again or go back to the home
        page.
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
