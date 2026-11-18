import Link from "next/link";
import { Layers3 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="site-footer-inner">
        <Link className="footer-brand" href="#top" aria-label="DealSync home">
          <span className="brand-mark" aria-hidden="true">
            <Layers3 size={17} strokeWidth={2.5} />
          </span>
          <span>DealSync Inc.</span>
        </Link>
        <p>© 2026 DealSync Enterprise SaaS. All operational systems protected.</p>
        <nav className="footer-links" aria-label="Legal navigation">
          <a href="#security">Security</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms</a>
        </nav>
      </div>
    </footer>
  );
}
