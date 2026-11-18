import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { safeRedirect } from "@/lib/security/safe-redirect";

export const metadata: Metadata = {
  title: "Create account | DealSync",
  description: "Create your DealSync workspace account.",
};

type RegisterPageProps = {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const query = await searchParams;
  const next = Array.isArray(query.next) ? query.next[0] : query.next;
  const errorCode = Array.isArray(query.error) ? query.error[0] : query.error;
  const initialError =
    errorCode === "exists"
      ? "An account already uses that email. Sign in instead."
      : errorCode === "rate-limited"
        ? "Too many attempts. Wait a little and try again."
        : undefined;

  return (
    <AuthForm
      initialError={initialError}
      mode="register"
      redirectTo={safeRedirect(next)}
    />
  );
}
