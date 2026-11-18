import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const plans = [
  {
    name: "Starter",
    summary: "For small growth teams and solo builders.",
    price: "$29",
    cadence: "/month",
    features: [
      "Up to 2,500 submissions per month",
      "5 active forms",
      "Instant webhook forwarding",
    ],
    action: "Start Starter Trial",
    href: "/register",
  },
  {
    name: "Growth Pro",
    summary: "For scaling startups and revenue teams.",
    price: "$99",
    cadence: "/month",
    features: [
      "Up to 25,000 submissions per month",
      "Unlimited embeddable forms",
      "Multi-company pipeline CRM",
      "Advanced conditional routing",
    ],
    action: "Start 14-Day Free Trial",
    href: "/register",
    popular: true,
  },
  {
    name: "Enterprise",
    summary: "For high-throughput organizations with strict compliance needs.",
    price: "Custom",
    cadence: "",
    features: [
      "Unlimited submissions",
      "SOC 2 Type II and HIPAA BAA",
      "Dedicated solutions engineer",
    ],
    action: "Contact Enterprise Sales",
    href: "#contact",
  },
];

export function PricingSection() {
  return (
    <section className="pricing-section section-pad" id="pricing" aria-labelledby="pricing-title">
      <div className="content-width">
        <SectionHeading
          align="center"
          className="pricing-heading"
          eyebrow="Transparent economics"
          id="pricing-title"
          title="Scales as your lead volume grows."
        />
        <div className="pricing-grid" id="enterprise">
          {plans.map(({ name, summary, price, cadence, features, action, href, popular }) => (
            <article className={`pricing-card${popular ? " is-popular" : ""}`} key={name}>
              {popular ? <span className="popular-badge">Most popular</span> : null}
              <div>
                <h3>{name}</h3>
                <p className="plan-summary">{summary}</p>
                <p className="plan-price">
                  <strong>{price}</strong>
                  {cadence ? <span>{cadence}</span> : null}
                </p>
                <ul className="plan-features">
                  {features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ButtonLink
                className="plan-action"
                href={href}
                variant={popular ? "primary" : "secondary"}
              >
                {action}
              </ButtonLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
