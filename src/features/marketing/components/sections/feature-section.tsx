import {
  Activity,
  AtSign,
  BarChart3,
  Code2,
  Grip,
  Phone,
  Route,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { SectionHeading } from "@/components/ui/section-heading";

function FeatureIcon({
  icon: Icon,
  tone,
}: {
  icon: LucideIcon;
  tone: "purple" | "mint" | "blue" | "violet";
}) {
  return (
    <span className={`feature-icon ${tone}`}>
      <Icon aria-hidden="true" size={22} strokeWidth={2.1} />
    </span>
  );
}

function FormBuilderPreview() {
  const fields = [
    { label: "Input text", icon: Type },
    { label: "Email check", icon: AtSign },
    { label: "Phone regex", icon: Phone },
  ];
  return (
    <div className="feature-demo demo-fields">
      <div className="demo-heading">
        <span>Canvas component palette</span>
        <span className="demo-action">+ Add field</span>
      </div>
      <ul>
        {fields.map(({ label, icon: Icon }) => (
          <li key={label}>
            <Icon aria-hidden="true" size={18} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoutingPreview() {
  return (
    <div className="feature-demo demo-routing">
      <div className="demo-heading">
        <span>Automated routing engine</span>
        <span className="demo-status">Active rules (4)</span>
      </div>
      <div className="routing-rule">
        <Route aria-hidden="true" size={16} />
        <span>Company size &gt; 500 → Enterprise SDRs</span>
        <small>Round-robin</small>
      </div>
      <div className="routing-rule">
        <Route aria-hidden="true" size={16} />
        <span>Region = EMEA → London desk</span>
        <small>Instant notify</small>
      </div>
    </div>
  );
}

function EmbedPreview() {
  return (
    <div className="feature-demo demo-code">
      <div className="demo-heading">
        <span>One-line snippet</span>
        <span className="demo-action">Copy code</span>
      </div>
      <pre aria-label="Example DealSync embed snippet" tabIndex={0}>
        <code>{'<script src="cdn.dealsync.io/embed.js" />'}</code>
      </pre>
    </div>
  );
}

function AnalyticsPreview() {
  const funnel = [
    { step: "Visited", rate: "95%" },
    { step: "Started", rate: "82%" },
    { step: "Qualified", rate: "71%" },
    { step: "Submitted", rate: "64%" },
  ];
  return (
    <div className="feature-demo demo-analytics">
      <div className="demo-heading">
        <span>Completion funnel analytics</span>
        <span className="demo-status">+34.8% conv.</span>
      </div>
      <div className="funnel-bars" role="img" aria-label="Completion rates: 95, 82, 71, and 64 percent">
        {funnel.map(({ step, rate }, index) => (
          <div className={`funnel-bar bar-${index + 1}`} key={step}>
            <span>{rate}</span>
          </div>
        ))}
      </div>
      <div className="funnel-labels" aria-hidden="true">
        {funnel.map(({ step }) => <span key={step}>{step}</span>)}
      </div>
    </div>
  );
}

const features: {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "purple" | "mint" | "blue" | "violet";
  preview: ComponentType;
}[] = [
  {
    title: "Drag & Drop Form Builder",
    description:
      "Build multi-step, responsive lead forms with live field validation, custom styling, conditional branching logic, and zero code required.",
    icon: Grip,
    tone: "purple",
    preview: FormBuilderPreview,
  },
  {
    title: "Multi-Company Lead CRM",
    description:
      "Route submissions directly into organized pipelines with automatic status tracking, buyer intent scoring, assignment rules, and collaborative notes.",
    icon: Activity,
    tone: "mint",
    preview: RoutingPreview,
  },
  {
    title: "Instant Embed & Share",
    description:
      "Drop a lightweight iframe or script into Webflow, Framer, React, or WordPress with automatic styling and layout adaptation.",
    icon: Code2,
    tone: "blue",
    preview: EmbedPreview,
  },
  {
    title: "Real-time Analytics & Conversion",
    description:
      "Track impressions, completion rates, drop-off fields, and revenue attribution across every form to optimize your acquisition funnel.",
    icon: BarChart3,
    tone: "violet",
    preview: AnalyticsPreview,
  },
];

export function FeatureSection() {
  return (
    <section className="feature-section section-pad" id="features" aria-labelledby="features-title">
      <div className="content-width">
        <SectionHeading
          className="feature-heading"
          description="DealSync combines rapid visual form creation with an integrated CRM pipeline that handles millions of records effortlessly."
          eyebrow="Engineered for growth ops"
          id="features-title"
          title="Everything required to capture, qualify, and convert at high scale."
        />

        <div className="feature-grid">
          {features.map(({ title, description, icon, tone, preview: Preview }) => (
            <article className="feature-card" key={title}>
              <div>
                <FeatureIcon icon={icon} tone={tone} />
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <Preview />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
