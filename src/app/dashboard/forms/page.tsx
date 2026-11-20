import type { Metadata } from "next";
import { FormsPage } from "@/features/forms/forms-page";

export const metadata: Metadata = {
  title: "Forms | DealSync",
  description: "Create and manage your DealSync lead capture forms.",
};

export default async function FormsRoute({
  searchParams,
}: {
  searchParams: Promise<{ create?: string | string[] }>;
}) {
  const params = await searchParams;
  const create = Array.isArray(params.create)
    ? params.create[0]
    : params.create;

  return <FormsPage openCreateOnLoad={create === "1"} />;
}
