"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <AuthShell>
      <h1
        className="text-2xl font-bold tracking-tight mb-1"
        style={{ fontFamily: "var(--font-inter)", color: "white" }}
      >
        Sign in
      </h1>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
      >
        Welcome back to the 9fin Onboarding Portal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />

        {error && <ErrorMessage message={error} />}

        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-xs transition-opacity hover:opacity-100 opacity-70"
          style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
        >
          Forgot your password?
        </Link>
        <p
          className="text-xs"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}
        >
          No account?{" "}
          <Link
            href="/signup"
            className="transition-opacity hover:opacity-100 opacity-80"
            style={{ color: "#1E90FF" }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

// ─── Signup ──────────────────────────────────────────────────────────────────

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative"
      style={{ backgroundColor: "#0A1628" }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(30, 144, 255, 0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 55% at 50% -5%, rgba(15, 60, 180, 0.5) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/9fin-logo.png`}
            alt="9fin"
            width={72}
            height={28}
            className="object-contain rounded-lg"
            style={{ height: "auto" }}
          />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
            border: "1px solid rgba(30, 144, 255, 0.25)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        className="block text-xs mb-1.5 tracking-wide"
        style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.6)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        suppressHydrationWarning
        className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
        style={{
          fontFamily: "var(--font-inter)",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(30,144,255,0.2)",
          color: "white",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "rgba(30,144,255,0.6)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "rgba(30,144,255,0.2)")
        }
      />
    </div>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      style={{
        fontFamily: "var(--font-inter)",
        backgroundColor: "#1E90FF",
        color: "white",
        boxShadow: "0 0 24px rgba(30,144,255,0.35)",
      }}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      className="text-xs px-3 py-2 rounded-lg"
      style={{
        fontFamily: "var(--font-inter)",
        color: "#ff6b6b",
        backgroundColor: "rgba(255,60,60,0.08)",
        border: "1px solid rgba(255,60,60,0.2)",
      }}
    >
      {message}
    </p>
  );
}
