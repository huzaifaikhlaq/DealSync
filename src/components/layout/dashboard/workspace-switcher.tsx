import { ChevronDown, ShieldCheck } from "lucide-react";

export function WorkspaceSwitcher() {
  return (
    <button className="workspace-switch" type="button">
      <span className="workspace-mark">AC</span>
      <span className="workspace-copy">
        <strong>Acme Cloud Systems</strong>
        <small>
          <ShieldCheck size={14} /> Enterprise Tier
        </small>
      </span>
      <ChevronDown size={16} />
    </button>
  );
}
