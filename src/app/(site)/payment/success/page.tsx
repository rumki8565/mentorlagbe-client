import { Suspense } from "react";
import PaymentSuccess from "@/components/payment/payment-success";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-slate-500">Loading...</div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}
