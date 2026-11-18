import Hero from "@/components/home/hero";
import FeaturedTuitions from "@/components/home/featured-tuitions";
import PricingSection from "@/components/home/pricing-section";
import HowItWorks from "@/components/home/how-it-works";
import SubjectsStats from "@/components/home/subjects-stats";
import Testimonials from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedTuitions />
      <HowItWorks />
      <SubjectsStats />
      <PricingSection />
      <Testimonials />
    </>
  );
}
