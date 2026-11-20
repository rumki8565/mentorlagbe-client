"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { PaymentRecord } from "@/types";

interface VerifyResponse {
  plan: string;
  payment: PaymentRecord | null;
}

export default function PaymentSuccess() {
  const sessionId: string = useSearchParams().get("session_id") ?? "";

  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    let cancelled: boolean = false;
    apiFetch<VerifyResponse>("/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    })
      .then((data: VerifyResponse) => {
        if (!cancelled) setResult(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not verify payment",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const failure: string | null = !sessionId
    ? "Missing payment session."
    : error;

  if (failure) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <XCircle className="h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          We could not confirm your payment
        </h1>
        <p className="mt-3 text-slate-600">{failure}</p>
        <Button
          asChild
          className="mt-8 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Link href="/pricing">Back to Pricing</Link>
        </Button>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-6 text-slate-600">Confirming your payment...</p>
      </section>
    );
  }

  const payment: PaymentRecord | null = result.payment;

  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <CheckCircle2 className="h-16 w-16 text-emerald-500" />
      <h1 className="mt-6 text-3xl font-bold text-slate-900">
        Payment Successful
      </h1>
      <p className="mt-3 text-slate-600">
        Your account is now on the Pro plan. Thank you for upgrading!
      </p>

      {payment && (
        <dl className="mt-8 w-full space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-left text-sm shadow-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Plan</dt>
            <dd className="font-medium text-slate-900">{payment.planName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Amount</dt>
            <dd className="font-medium text-slate-900">
              ${payment.amount} {payment.currency.toUpperCase()}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Transaction ID</dt>
            <dd className="max-w-[220px] font-mono text-xs break-all text-slate-700">
              {payment.transactionId}
            </dd>
          </div>
        </dl>
      )}

      {/* A normal link (full page load) so the session reloads with plan: pro */}
      <Button
        asChild
        className="mt-8 bg-indigo-600 text-white hover:bg-indigo-700"
      >
        <a href="/dashboard">Go to Dashboard</a>
      </Button>
    </section>
  );
}
