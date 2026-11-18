import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FeatureSection } from "./sections/feature-section";
import { FinalCtaSection } from "./sections/final-cta-section";
import { HeroSection } from "./sections/hero-section";
import { MetricsSection } from "./sections/metrics-section";
import { PricingSection } from "./sections/pricing-section";
import { WorkflowSection } from "./sections/workflow-section";

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <MetricsSection />
        <FeatureSection />
        <WorkflowSection />
        <PricingSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
