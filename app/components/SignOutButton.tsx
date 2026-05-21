"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs transition-opacity hover:opacity-100 opacity-60"
      style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.7)" }}
    >
      Sign out
    </button>
  );
}
