import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { safeRedirect } from "@/lib/security/safe-redirect";

export const metadata: Metadata = {
  title: "Sign in | DealSync",
  description: "Sign in to your DealSync workspace.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const next = Array.isArray(query.next) ? query.next[0] : query.next;
  const errorCode = Array.isArray(query.error) ? query.error[0] : query.error;
  const initialError =
    errorCode === "invalid"
      ? "Email or password is incorrect."
      : errorCode === "rate-limited"
        ? "Too many attempts. Wait a little and try again."
        : undefined;

  return (
    <AuthForm
      initialError={initialError}
      mode="login"
      redirectTo={safeRedirect(next)}
    />
  );
}
