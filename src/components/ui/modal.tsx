"use client";

import { useEffect, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  id: string;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({
  id,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  function closeOnBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#14182c]/45 p-4 backdrop-blur-[3px] sm:p-6" onMouseDown={closeOnBackdrop}>
      <section
        className="max-h-[min(90dvh,720px)] w-full max-w-[490px] overflow-y-auto rounded-2xl border border-[#e9e9f2] bg-white shadow-[0_24px_80px_rgb(20_24_48_/_24%)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        aria-describedby={`${id}-description`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#eff0f6] px-6 py-5">
          <div className="min-w-0">
            <h2 className="m-0 text-lg font-semibold tracking-[-0.02em] text-foreground" id={id}>{title}</h2>
            <p className="mt-1 mb-0 text-sm leading-6 text-text-muted" id={`${id}-description`}>{description}</p>
          </div>
          <button className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-text-muted hover:bg-surface-low" type="button" aria-label="Close" onClick={onClose}>
            <X size={19} />
          </button>
        </header>
        <div className="px-6 py-5 [&>form]:grid [&>form]:grid-cols-2 [&>form]:gap-[13px] [&>form>label]:grid [&>form>label]:gap-1.5 [&>form>label]:text-[11px] [&>form>label]:font-medium [&>form>label]:text-[#41475b] [&_input]:h-[38px] [&_input]:w-full [&_input]:rounded-[7px] [&_input]:border [&_input]:border-[#e5e6ef] [&_input]:px-[10px] [&_input]:text-xs [&_input]:text-[#171e31] [&_input]:outline-none [&_input:focus]:border-[#8178f0] [&_input:focus]:shadow-[0_0_0_3px_rgb(81_69_232_/_11%)] max-[650px]:[&>form]:grid-cols-1">
          {children}
        </div>
      </section>
    </div>
  );
}
