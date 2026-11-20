
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/components/auth-form";
import {
  getRoleLandingPath,
  safeDashboardPath,
} from "@/lib/security/safe-redirect";
import { getAuthenticatedUser } from "@/features/auth/server/auth.session";
import { accountRequestRepository } from "@/features/account-requests/account-request.repository";

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
  const user = await getAuthenticatedUser();

  if (user) {
    if (user.role === "SUPER_ADMIN") {
      redirect(getRoleLandingPath(user.role, false));
    }

    const request = await accountRequestRepository.findMine(user.id);
    redirect(getRoleLandingPath(user.role, request?.status === "APPROVED"));
  }

  return <AuthForm mode="login" next={next} />;
}
