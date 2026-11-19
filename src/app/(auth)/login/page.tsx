
import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { safeDashboardPath } from "@/lib/security/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in | DealSync",
};

interface LoginPageProps {
  searchParams: Promise<{
    next?: string | string[];
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;
  const next = safeDashboardPath(params.next);

  return <AuthForm mode="login" next={next} />;
}
