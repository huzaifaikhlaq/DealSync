"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { ArrowRight, Eye, EyeOff, Layers3, LockKeyhole } from "lucide-react";
import type {
  AuthFieldErrors,
  AuthFieldName,
  AuthMode,
} from "../types/auth.types";
import styles from "./auth.module.css";

type AuthFormProps = {
  mode: AuthMode;
  redirectTo: string;
  initialError?: string;
};

type ApiErrorPayload = {
  error?: {
    message?: unknown;
    details?: unknown;
  };
};

const fieldNames: AuthFieldName[] = [
  "name",
  "email",
  "password",
  "confirmPassword",
];

function getFieldErrors(details: unknown): AuthFieldErrors {
  if (typeof details !== "object" || details === null) return {};

  const errors: AuthFieldErrors = {};
  for (const field of fieldNames) {
    const messages = (details as Record<string, unknown>)[field];
    if (
      Array.isArray(messages) &&
      messages.every((message) => typeof message === "string")
    ) {
      errors[field] = messages;
    }
  }
  return errors;
}

export function AuthForm({
  mode,
  redirectTo,
  initialError,
}: AuthFormProps) {
  const router = useRouter();
  const headingId = useId();
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const passwordHintId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(initialError ?? "");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const isRegister = mode === "register";

  useEffect(() => {
    if (fieldErrors.name) nameRef.current?.focus();
    else if (fieldErrors.email) emailRef.current?.focus();
    else if (fieldErrors.password) passwordRef.current?.focus();
    else if (fieldErrors.confirmPassword) confirmPasswordRef.current?.focus();
  }, [fieldErrors]);

  function clearFieldError(field: AuthFieldName) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});
    setPending(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/auth/" + mode, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const payload = (await response.json().catch(() => null)) as
        | ApiErrorPayload
        | null;
      if (!response.ok) {
        setMessage(
          typeof payload?.error?.message === "string"
            ? payload.error.message
            : "We couldn't sign you in. Try again.",
        );
        setFieldErrors(getFieldErrors(payload?.error?.details));
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setMessage("Connection problem. Check your internet and try again.");
    } finally {
      setPending(false);
    }
  }

  const modeLabel = isRegister ? "Create account" : "Sign in";
  const switchHref =
    (isRegister ? "/login" : "/register") +
    "?next=" +
    encodeURIComponent(redirectTo);

  return (
    <main className={styles.screen}>
      <section className={styles.card}>
        <aside className={styles.brandPanel} aria-label="About DealSync">
          <Link className={styles.brand} href="/">
            <span className={styles.brandMark} aria-hidden="true">
              <Layers3 size={20} strokeWidth={2.5} />
            </span>
            <span>DealSync</span>
          </Link>

          <div className={styles.brandCopy}>
            <p className={styles.eyebrow}>Your revenue workspace</p>
            <h2>Every lead has a next step.</h2>
            <p>
              Keep forms, conversations, and pipeline activity in sync from the
              first click to the close.
            </p>
          </div>

          <div className={styles.preview} aria-label="Workspace preview">
            <div className={styles.previewHeader}>
              <span className={styles.previewDots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>Pipeline overview</span>
              <span className={styles.liveBadge}>
                <i aria-hidden="true" />
                Live
              </span>
            </div>
            <div className={styles.previewMetric}>
              <div>
                <span>New opportunities</span>
                <strong>128</strong>
              </div>
              <span className={styles.metricTrend}>+18.4%</span>
            </div>
            <div className={styles.previewBars} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.previewFooter}>
              <span>
                <i className={styles.dotBlue} aria-hidden="true" />
                Captured
              </span>
              <span>
                <i className={styles.dotMint} aria-hidden="true" />
                Qualified
              </span>
              <span>Last 30 days</span>
            </div>
          </div>

          <p className={styles.securityNote}>
            <LockKeyhole size={15} aria-hidden="true" />
            Your workspace stays private and protected.
          </p>
          <span className={styles.orbOne} aria-hidden="true" />
          <span className={styles.orbTwo} aria-hidden="true" />
        </aside>

        <div className={styles.formPanel}>
          <Link className={styles.mobileBrand} href="/">
            <span className={styles.brandMark} aria-hidden="true">
              <Layers3 size={19} strokeWidth={2.5} />
            </span>
            <span>DealSync</span>
          </Link>

          <div className={styles.formContent}>
            <p className={styles.formEyebrow}>
              <span className={styles.formEyebrowIcon} aria-hidden="true">
                <LockKeyhole size={14} />
              </span>
              Secure workspace access
            </p>
            <h1 id={headingId}>
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>
            <p className={styles.formIntro}>
              {isRegister
                ? "Start bringing every lead into focus."
                : "Sign in to pick up right where your team left off."}
            </p>

            <form
              action={"/api/auth/" + mode}
              aria-labelledby={headingId}
              className={styles.form}
              method="post"
              onSubmit={handleSubmit}
            >
              <input name="redirectTo" type="hidden" value={redirectTo} />

              {message ? (
                <p className={styles.notice} role="status" aria-live="polite">
                  {message}
                </p>
              ) : null}

              {isRegister ? (
                <div className={styles.field}>
                  <label htmlFor={nameId}>Full name</label>
                  <input
                    autoComplete="name"
                    className={fieldErrors.name ? styles.invalidInput : ""}
                    id={nameId}
                    maxLength={100}
                    minLength={2}
                    name="name"
                    onChange={() => clearFieldError("name")}
                    ref={nameRef}
                    required
                    type="text"
                    aria-describedby={fieldErrors.name ? nameId + "-error" : undefined}
                    aria-invalid={Boolean(fieldErrors.name)}
                  />
                  {fieldErrors.name ? (
                    <span className={styles.fieldError} id={nameId + "-error"}>
                      {fieldErrors.name[0]}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className={styles.field}>
                <label htmlFor={emailId}>Work email</label>
                <input
                  autoComplete="username"
                  autoCapitalize="none"
                  className={fieldErrors.email ? styles.invalidInput : ""}
                  id={emailId}
                  maxLength={254}
                  name="email"
                  onChange={() => clearFieldError("email")}
                  ref={emailRef}
                  required
                  spellCheck={false}
                  type="email"
                  aria-describedby={fieldErrors.email ? emailId + "-error" : undefined}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email ? (
                  <span className={styles.fieldError} id={emailId + "-error"}>
                    {fieldErrors.email[0]}
                  </span>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor={passwordId}>Password</label>
                {isRegister ? (
                  <p className={styles.fieldHint} id={passwordHintId}>
                    Use at least 12 characters.
                  </p>
                ) : null}
                <div className={styles.passwordField}>
                  <input
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    className={fieldErrors.password ? styles.invalidInput : ""}
                    id={passwordId}
                    maxLength={128}
                    minLength={isRegister ? 12 : undefined}
                    name="password"
                    onChange={() => clearFieldError("password")}
                    ref={passwordRef}
                    required
                    type={showPassword ? "text" : "password"}
                    aria-describedby={
                      (isRegister ? passwordHintId : "") +
                      (fieldErrors.password ? " " + passwordId + "-error" : "")
                    }
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" size={18} />
                    ) : (
                      <Eye aria-hidden="true" size={18} />
                    )}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <span className={styles.fieldError} id={passwordId + "-error"}>
                    {fieldErrors.password[0]}
                  </span>
                ) : null}
              </div>

              {isRegister ? (
                <div className={styles.field}>
                  <label htmlFor={confirmPasswordId}>Confirm password</label>
                  <input
                    autoComplete="new-password"
                    className={
                      fieldErrors.confirmPassword ? styles.invalidInput : ""
                    }
                    id={confirmPasswordId}
                    maxLength={128}
                    minLength={12}
                    name="confirmPassword"
                    onChange={() => clearFieldError("confirmPassword")}
                    ref={confirmPasswordRef}
                    required
                    type={showPassword ? "text" : "password"}
                    aria-describedby={
                      fieldErrors.confirmPassword
                        ? confirmPasswordId + "-error"
                        : undefined
                    }
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  />
                  {fieldErrors.confirmPassword ? (
                    <span
                      className={styles.fieldError}
                      id={confirmPasswordId + "-error"}
                    >
                      {fieldErrors.confirmPassword[0]}
                    </span>
                  ) : null}
                </div>
              ) : null}

              <button
                className={styles.submitButton}
                disabled={pending}
                type="submit"
              >
                <span>{pending ? "Please wait…" : modeLabel}</span>
                <ArrowRight aria-hidden="true" size={17} />
              </button>
            </form>

            <p className={styles.switchPrompt}>
              {isRegister ? "Already have an account?" : "New to DealSync?"}{" "}
              <Link href={switchHref}>
                {isRegister ? "Sign in" : "Create an account"}
              </Link>
            </p>
            <p className={styles.formFootnote}>
              By continuing, you agree to keep your workspace credentials
              confidential.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
