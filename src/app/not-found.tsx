import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-7xl font-bold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-slate-600">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Button
        asChild
        className="mt-6 bg-indigo-600 text-white hover:bg-indigo-700"
      >
        <Link href="/">Back to Home</Link>
      </Button>
    </main>
  );
}
