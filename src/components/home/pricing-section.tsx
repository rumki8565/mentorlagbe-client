"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/shared/section-heading";
import Reveal from "@/components/shared/reveal";
import { PLANS, PlanAudience, PlanDetails } from "@/lib/plans";

const AUDIENCES: { value: PlanAudience; label: string }[] = [
  { value: "tutor", label: "For Tutors" },
  { value: "student", label: "For Students" },
];

export default function PricingSection() {
  const [audience, setAudience] = useState<PlanAudience>("tutor");

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple Plans for Everyone"
          subtitle="Start free, upgrade to Pro whenever you are ready."
        />

        <div className="mx-auto mb-10 flex w-fit rounded-full border border-slate-200 bg-white p-1">
          {AUDIENCES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setAudience(item.value)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                audience === item.value
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PLANS[audience].map((plan: PlanDetails, index: number) => (
            <Reveal key={plan.id} delay={index * 100} className="h-full">
              <div
                className={`flex h-full flex-col rounded-2xl border bg-white p-8 ${
                  plan.highlighted
                    ? "border-indigo-600 shadow-lg ring-1 ring-indigo-600"
                    : "border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {plan.name}
                  </h3>
                  {plan.highlighted && (
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {plan.description}
                </p>
                <p className="mt-6 text-4xl font-bold text-slate-900">
                  ${plan.price}
                  <span className="text-base font-normal text-slate-500">
                    {plan.price === 0 ? " forever" : " / one-time"}
                  </span>
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature: string) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.price === 0 ? (
                  <Button asChild variant="outline" className="mt-8 w-full">
                    <Link href="/sign-up">Get Started Free</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="mt-8 w-full bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Link href="/pricing">Subscribe with Stripe</Link>
                  </Button>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
