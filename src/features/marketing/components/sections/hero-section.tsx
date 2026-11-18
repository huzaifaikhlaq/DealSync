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
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_34rem_23rem_at_50%_8%,rgb(215_211_255_/_58%),transparent_72%),radial-gradient(ellipse_38rem_28rem_at_88%_48%,rgb(218_229_255_/_54%),transparent_70%),var(--background)] py-16 md:pt-16 md:pb-20" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute top-4 left-1/2 z-0 aspect-square w-[min(50rem,90vw)] -translate-x-1/2 rounded-full bg-[#e8e5ff]/40 blur-[90px]" aria-hidden="true" />
      <div className="relative z-[1] mx-auto flex w-[min(100%-2.5rem,78rem)] flex-col items-center text-center">
        <p className="mb-6 inline-flex items-center gap-[0.55rem] rounded-full border border-[#3525cd]/[0.07] bg-white/[0.68] px-[0.85rem] py-2 text-[0.8rem] font-medium text-[#464555]"><span className="size-[0.52rem] rounded-full bg-[#08744f] shadow-[0_0_0_3px_rgb(8_116_79_/_9%)]" /> Enterprise Pipeline Infrastructure</p>
        <h1 className="m-0 max-w-[67rem] text-[clamp(2.5rem,4.2vw,3.6rem)] leading-[1.12] font-semibold tracking-[-0.055em]" id="hero-title">
          Turn Every Form Submission Into an <span className="text-primary-container">Opportunity.</span>
        </h1>
        <p className="mt-[1.3rem] max-w-[53rem] text-[clamp(1rem,1.45vw,1.2rem)] leading-[1.7] text-text-muted">
          Create high-converting, customizable lead capture forms in minutes.
          Embed them effortlessly into any website, sync submissions in real
          time, and convert incoming leads with an enterprise pipeline built for
          modern teams.
        </p>
        <div className="mt-[2.3rem] flex items-center justify-center gap-[0.8rem]">
          <ButtonLink href="#pricing" size="lg">
            Get Started Free <ArrowRight aria-hidden="true" size={19} />
          </ButtonLink>
          <ButtonLink href="#contact" variant="secondary" size="lg">
            <CalendarDays aria-hidden="true" size={19} /> Book a Demo
          </ButtonLink>
        </div>
        <ul className="mt-[1.15rem] mb-0 flex list-none flex-wrap justify-center gap-x-[1.15rem] gap-y-[0.7rem] p-0 text-[0.8rem] font-medium text-[#5b5c6d]">
          <li><CheckCircle2 aria-hidden="true" size={16} /> No credit card required</li>
          <li>14-day free trial</li>
          <li>Full API &amp; webhook access</li>
        </ul>
        <TrustMarks />
      </div>
      <div className="relative z-[1] mx-auto mt-[4.3rem] w-[min(100%-2.5rem,78rem)]">
        <ProductPreview />
      </div>
    </section>
  );
}
