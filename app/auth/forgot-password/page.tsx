"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, Field, SubmitButton, ErrorMessage } from "@/app/login/page";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <AuthShell>
        <div className="text-center py-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{
              backgroundColor: "rgba(30,144,255,0.1)",
              border: "1px solid rgba(30,144,255,0.25)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1E90FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2
            className="text-lg font-bold mb-2"
            style={{ fontFamily: "var(--font-inter)", color: "white" }}
          >
            Reset link sent
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.65)" }}
          >
            If an account exists for{" "}
            <span style={{ color: "white" }}>{email}</span>, you&apos;ll
            receive a password reset link shortly.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1
        className="text-2xl font-bold tracking-tight mb-1"
        style={{ fontFamily: "var(--font-inter)", color: "white" }}
      >
        Reset password
      </h1>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
      >
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />

        {error && <ErrorMessage message={error} />}

        <SubmitButton loading={loading}>Send reset link</SubmitButton>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/login"
          className="text-xs transition-opacity hover:opacity-100 opacity-70"
          style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
        >
          ← Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
