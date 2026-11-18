import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function FinalCtaSection() {
  return (
    <section className="final-cta-section section-pad" id="contact" aria-labelledby="final-cta-title">
      <div className="final-cta-card">
        <div className="cta-orb" aria-hidden="true" />
        <SectionHeading
          align="center"
          className="final-cta-copy"
          description="Start your 14-day free trial today. Cancel anytime. Zero operational lock-in."
          eyebrow="Get started today"
          id="final-cta-title"
          title="Ready to accelerate your lead capture pipeline?"
        />
        <div className="final-cta-actions">
          <ButtonLink href="/register" size="lg">
            Get Started Now <ArrowRight aria-hidden="true" size={18} />
          </ButtonLink>
          <ButtonLink href="mailto:hello@dealsync.io" size="lg" variant="secondary">
            Talk to an Architect
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
