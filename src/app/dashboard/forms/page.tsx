import type { Metadata } from "next";
import { FormsPage } from "@/features/forms/forms-page";

export const metadata: Metadata = {
  title: "Forms | DealSync",
  description: "Create and manage your DealSync lead capture forms.",
};

export default function FormsRoute() {
  return <FormsPage />;
}
