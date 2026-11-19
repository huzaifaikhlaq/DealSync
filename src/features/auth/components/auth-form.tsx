
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers3, Loader2 } from "lucide-react";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  next?: string;
}

interface AuthApiResponse {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export function AuthForm({
  mode,
  next = "/dashboard",
}: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (pending) return;

    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);

    try {
      const endpoint = isRegister
        ? "/api/auth/register"
        : "/api/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });

      const result =
        (await response.json()) as AuthApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message ??
          "Authentication failed",
        );
      }

      router.replace(next);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f46e5] text-white">
            <Layers3 size={22} />
          </span>
          <span className="text-2xl font-bold tracking-tight text-[#131b2e]">
            DealSync
          </span>
        </Link>

        <section className="rounded-2xl border border-[#e8e6f2] bg-white p-7 shadow-sm sm:p-9">
          <h1 className="text-2xl font-semibold text-[#131b2e]">
            {isRegister
              ? "Create your account"
              : "Welcome back"}
          </h1>

          <p className="mt-2 text-sm text-[#55586c]">
            {isRegister
              ? "Start collecting leads without building a backend."
              : "Sign in to manage your forms and leads."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            {isRegister && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="w-full rounded-lg border border-[#d9d6e7] bg-white px-4 py-3 text-sm outline-none focus:border-[#4f46e5]"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className="w-full rounded-lg border border-[#d9d6e7] bg-white px-4 py-3 text-sm outline-none focus:border-[#4f46e5]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={
                  isRegister
                    ? "new-password"
                    : "current-password"
                }
                required
                minLength={isRegister ? 12 : 1}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full rounded-lg border border-[#d9d6e7] bg-white px-4 py-3 text-sm outline-none focus:border-[#4f46e5]"
                placeholder="Enter your password"
              />
              {isRegister && (
                <p className="mt-1 text-xs text-[#55586c]">
                  Use at least 12 characters.
                </p>
              )}
            </div>

            {isRegister && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className="w-full rounded-lg border border-[#d9d6e7] bg-white px-4 py-3 text-sm outline-none focus:border-[#4f46e5]"
                  placeholder="Repeat your password"
                />
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-3 font-semibold text-white transition hover:bg-[#3d34d7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}
              {pending
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#55586c]">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <Link
              href={
                isRegister
                  ? "/login"
                  : `/register`
              }
              className="font-semibold text-[#4f46e5] hover:underline"
            >
              {isRegister ? "Sign in" : "Create account"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
