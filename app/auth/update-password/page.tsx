"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, Field, SubmitButton, ErrorMessage } from "@/app/login/page";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

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
        New password
      </h1>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
      >
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="New password" type="password" value={password} onChange={setPassword} />
        <Field label="Confirm password" type="password" value={confirm} onChange={setConfirm} />

        {error && <ErrorMessage message={error} />}

        <SubmitButton loading={loading}>Update password</SubmitButton>
      </form>
    </AuthShell>
  );
}
