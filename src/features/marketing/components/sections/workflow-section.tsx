import { MonitorSmartphone, Palette, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps: {
  number: string;
  title: string;
  description: string;
  note: string;
  icon: LucideIcon;
  tone: "purple" | "blue" | "mint";
}[] = [
  {
    number: "01",
    title: "Design your form",
    description:
      "Choose inputs, set required fields, configure conditional logic, and apply your brand directly in the visual canvas.",
    note: "Automatic CSS theme match",
    icon: Palette,
    tone: "purple",
  },
  {
    number: "02",
    title: "Embed anywhere",
    description:
      "Copy a responsive iframe snippet, add a React component, or share a standalone hosted URL with prospective clients.",
    note: "Responsive across devices",
    icon: MonitorSmartphone,
    tone: "blue",
  },
  {
    number: "03",
    title: "Manage & convert",
    description:
      "Qualified leads sync into your pipeline with alerts, automatic status updates, and integrations for your sales tools.",
    note: "50+ CRM and automation integrations",
    icon: RefreshCw,
    tone: "mint",
  },
];

export function WorkflowSection() {
  return (
    <section className="workflow-section section-pad" id="workflow" aria-labelledby="workflow-title">
      <div className="content-width">
        <SectionHeading
          align="center"
          className="workflow-heading"
          description="Go from a blank page to a converting enterprise pipeline in three intuitive steps."
          eyebrow="Effortless workflow"
          id="workflow-title"
          title="How modern revenue teams run on DealSync."
        />
        <ol className="workflow-grid">
          {steps.map(({ number, title, description, note, icon: Icon, tone }) => (
            <li className="workflow-card" key={number}>
              <span className="workflow-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="workflow-note">
                <Icon className={`note-icon ${tone}`} aria-hidden="true" size={17} />
                <span>{note}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
