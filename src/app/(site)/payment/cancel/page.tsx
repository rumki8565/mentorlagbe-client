import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <XCircle className="h-16 w-16 text-amber-500" />
      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        Payment Cancelled
      </h1>
      <p className="mt-3 text-slate-600">
        No money was taken. You can upgrade to Pro whenever you are ready.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link href="/pricing">Back to Pricing</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </section>
  );
}
