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
    <div className="lead-modal-backdrop" onMouseDown={closeOnBackdrop}>
      <section
        className="lead-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        aria-describedby={`${id}-description`}
      >
        <header>
          <div>
            <h2 id={id}>{title}</h2>
            <p id={`${id}-description`}>{description}</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X size={19} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
