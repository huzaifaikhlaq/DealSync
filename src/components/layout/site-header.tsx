"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers3, Menu, X } from "lucide-react";
import {
  Button,
  ButtonLink,
  type PopoverTriggerAttributes,
} from "@/components/ui/button";

const navigation = [
  { label: "Product", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Docs", href: "#workflow" },
];

export function SiteHeader() {
  const [isWide, setIsWide] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const inner = innerRef.current;
    const menu = menuRef.current;
    if (!header || !inner || !menu) return;

    let lastWidth = 0;
    let isMeasuring = false;

    const updateLayout = () => {
      const availableWidth = inner.clientWidth;
      const wasWide = header.classList.contains("is-wide");

      if (isMeasuring || (!wasWide && availableWidth <= lastWidth)) return;
      isMeasuring = true;
      lastWidth = availableWidth;

      const menuWasOpen = menu.matches(":popover-open");
      header.classList.add("is-measuring");
      menu.removeAttribute("popover");
      const fits = inner.scrollWidth <= inner.clientWidth;

      if (fits) {
        menu.removeAttribute("popover");
        setIsWide(true);
      } else {
        menu.setAttribute("popover", "auto");
        setIsWide(false);
        if (menuWasOpen) menu.showPopover();
      }

      header.classList.remove("is-measuring");
      isMeasuring = false;
    };

    const observer = new ResizeObserver(updateLayout);
    observer.observe(inner);
    observer.observe(menu);
    updateLayout();
    document.fonts?.ready.then(updateLayout);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="announcement-bar">
        <span className="announcement-pill">New</span>
        <a href="#features" className="announcement-link">
          DealSync 2.0 is live — seamless webhook &amp; CRM sync with 50+
          integrations
          <ArrowRight aria-hidden="true" size={17} />
        </a>
      </div>
      <header className={`site-header${isWide ? " is-wide" : ""}`} ref={headerRef}>
        <div className="site-header-inner" ref={innerRef}>
          <Link
            className="brand"
            href="#top"
            aria-label="DealSync home"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-mark" aria-hidden="true">
              <Layers3 size={19} strokeWidth={2.5} />
            </span>
            <span>DealSync</span>
          </Link>

          <nav className="primary-navigation" aria-label="Primary navigation">
            <Button
              aria-controls="primary-navigation-links"
              aria-expanded={menuOpen}
              className="mobile-menu-toggle"
              {...({
                popovertarget: "primary-navigation-links",
                popovertargetaction: "toggle",
              } as PopoverTriggerAttributes)}
              variant="quiet"
              size="sm"
            >
              {menuOpen ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
              <span className="sr-only">Menu</span>
            </Button>
            <ul
              className="primary-navigation-links"
              id="primary-navigation-links"
              onToggle={(event) => {
                setMenuOpen(event.currentTarget.matches(":popover-open"));
              }}
              popover={isWide ? undefined : "auto"}
              ref={menuRef}
            >
              {navigation.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={() => {
                      const menu = menuRef.current;
                      if (menu?.matches(":popover-open")) menu.hidePopover();
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <a className="sign-in-link" href="#footer">
              Sign in
            </a>
            <ButtonLink href="#pricing" size="sm">
              <span className="desktop-cta-label">Start Free Trial</span>
              <span className="mobile-cta-label">Try free</span>
            </ButtonLink>
            <span className="header-avatar" aria-hidden="true">
              DS
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
