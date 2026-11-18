import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/geist";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealSync",
  description:
    "Turn every form submission into an opportunity with DealSync's lead capture and pipeline platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
