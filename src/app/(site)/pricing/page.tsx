import type { Metadata } from "next";
import PricingSection from "@/components/home/pricing-section";

export const metadata: Metadata = {
  title: "Pricing | MentorLagbe",
  description: "Free and Pro plans for tutors and students on MentorLagbe.",
};

export default function PricingPage() {
  return <PricingSection />;
}
