import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Gauge,
  GitBranch,
  LayoutGrid,
  Network,
  SlidersHorizontal,
  Video,
  Zap,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const customerTeams = [
  { name: "Vercel", icon: GitBranch },
  { name: "Retool", icon: LayoutGrid },
  { name: "Ramp", icon: CreditCard },
  { name: "Loom", icon: Video },
  { name: "Lattice", icon: Network },
  { name: "Linear", icon: SlidersHorizontal },
];

function TrustMarks() {
  return (
    <div className="trust-marks">
      <p>Trusted by over 3,500+ revenue and growth teams worldwide</p>
      <ul aria-label="Teams using DealSync">
        {customerTeams.map(({ name, icon: Icon }) => (
          <li key={name}>
            <Icon aria-hidden="true" size={19} strokeWidth={2.4} />
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PreviewField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="preview-field">
      <span>{label}</span>
      <div className="preview-input">
        {value}
        <span aria-hidden="true">⌄</span>
      </div>
    </div>
  );
}

function LeadFormPreview() {
  return (
    <div className="preview-panel form-preview">
      <div className="preview-panel-heading">
        <div className="preview-heading-title">
          <span className="preview-icon preview-icon-purple">
            <LayoutGrid aria-hidden="true" size={16} />
          </span>
          <h2>Enterprise Inbound Form <span>(Step 2 of 3)</span></h2>
        </div>
        <span className="autosave-pill">Auto-save 12s ago</span>
      </div>

      <div className="preview-field email-field">
        <div className="preview-label-row">
          <span>Work Email Address</span>
          <span className="required-label">Required</span>
        </div>
        <div className="preview-input">
          elena.vance@aurora-cloud.io
          <BadgeCheck aria-hidden="true" size={17} />
        </div>
      </div>

      <div className="preview-fields-row">
        <PreviewField label="Company Size" value="250 - 1,000 employees" />
        <PreviewField label="Current CRM" value="Salesforce Enterprise" />
      </div>

      <div className="budget-field">
        <span className="preview-icon preview-icon-purple">
          <SlidersHorizontal aria-hidden="true" size={16} />
        </span>
        <span>Annual Software Budget Estimate</span>
        <span className="budget-tag">Currency picker</span>
      </div>

      <div className="webhook-status">
        <Zap aria-hidden="true" size={16} />
        <span>Instant webhook triggered to 3 destinations</span>
        <strong>142ms latency</strong>
      </div>

      <div className="new-lead-alert">
        <span className="lead-check">
          <CheckCircle2 aria-hidden="true" size={20} />
        </span>
        <span>
          <strong>New lead captured: Elena Vance</strong>
          <small>VP Product @ Aurora Cloud · Intent score: 98/100</small>
        </span>
        <small>Just now</small>
      </div>
    </div>
  );
}

const pipelineItems = [
  {
    label: "Enterprise hot",
    company: "Aurora Cloud Systems",
    amount: "$92,000",
    detail: "Routing to: Sarah Chen (Strategic Accounts)",
    tone: "mint",
  },
  {
    label: "Qualified demo",
    company: "Kite AI Robotics",
    amount: "$48,000",
    detail: "Routing to: Marcus Reed (Growth Mid-Market)",
    tone: "blue",
  },
  {
    label: "Trial conversion",
    company: "Synthetix Labs",
    amount: "$18,500",
    detail: "Automated welcome sequence triggered",
    tone: "lavender",
  },
];

function PipelinePreview() {
  return (
    <aside className="preview-panel pipeline-preview" aria-label="Pipeline example">
      <div className="pipeline-heading">
        <div>
          <h2>Pipeline ingestion</h2>
          <span className="active-pill">Active</span>
        </div>
        <strong className="pipeline-total">$324,500</strong>
      </div>

      <ul className="pipeline-list">
        {pipelineItems.map((item) => (
          <li className="pipeline-item" key={item.company}>
            <div className="pipeline-item-top">
              <span className={`lead-status ${item.tone}`}>{item.label}</span>
              <strong>{item.amount}</strong>
            </div>
            <h3>{item.company}</h3>
            <p>{item.detail}</p>
          </li>
        ))}
      </ul>

      <div className="route-velocity">
        <span>Avg. route velocity</span>
        <strong><Gauge aria-hidden="true" size={16} /> 1.4 seconds</strong>
      </div>
    </aside>
  );
}

function ProductPreview() {
  return (
    <figure className="product-preview">
      <figcaption className="sr-only">
        DealSync lead capture form and pipeline dashboard preview
      </figcaption>
      <div className="preview-browser-bar">
        <div className="browser-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="preview-address">app.dealsync.io/workspaces/acme-growth/pipeline</span>
        <span className="sync-pill"><i /> Live sync active</span>
      </div>
      <div className="preview-workspace">
        <LeadFormPreview />
        <PipelinePreview />
      </div>
    </figure>
  );
}

export function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-copy content-width">
        <p className="hero-kicker"><span /> Enterprise Pipeline Infrastructure</p>
        <h1 id="hero-title">
          Turn Every Form Submission Into an <span>Opportunity.</span>
        </h1>
        <p className="hero-description">
          Create high-converting, customizable lead capture forms in minutes.
          Embed them effortlessly into any website, sync submissions in real
          time, and convert incoming leads with an enterprise pipeline built for
          modern teams.
        </p>
        <div className="hero-actions">
          <ButtonLink href="#pricing" size="lg">
            Get Started Free <ArrowRight aria-hidden="true" size={19} />
          </ButtonLink>
          <ButtonLink href="#contact" variant="secondary" size="lg">
            <CalendarDays aria-hidden="true" size={19} /> Book a Demo
          </ButtonLink>
        </div>
        <ul className="trial-assurances">
          <li><CheckCircle2 aria-hidden="true" size={16} /> No credit card required</li>
          <li>14-day free trial</li>
          <li>Full API &amp; webhook access</li>
        </ul>
        <TrustMarks />
      </div>
      <div className="hero-preview-wrap content-width">
        <ProductPreview />
      </div>
    </section>
  );
}
