"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markStepComplete, type Team, type Step } from "@/lib/progress";
import NextStepToast from "./NextStepToast";

interface Props {
  searchParams?: Promise<{ team?: string }>;
  step: Step;
  nextStep: Step;
  nextStepLabel: string;
}

export default function CompletionFooter({
  searchParams,
  step,
  nextStep,
  nextStepLabel,
}: Props) {
  const params = searchParams ? use(searchParams) : {};
  const team = (params as { team?: string }).team as Team | undefined;
  const router = useRouter();
  const [toast, setToast] = useState(false);
  const [done, setDone] = useState(false);

  // Only render if we have a team context
  if (!team) return null;

  const teamHref = `/${team}`;
  const nextHref = `/${team}?step_done=${step}`;

  async function handleComplete() {
    if (!team) return;
    await markStepComplete(team, step);
    setDone(true);
    setToast(true);
  }

  return (
    <>
      {/* Sticky completion bar */}
      <div
        className="sticky bottom-0 z-40 px-6 py-4 border-t"
        style={{
          backgroundColor: "rgba(10, 22, 40, 0.95)",
          borderColor: "rgba(30,144,255,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
          >
            {done
              ? `Step complete! Head back to continue.`
              : `Done reading? Mark this step as complete to unlock the next one.`}
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href={teamHref}
              className="text-xs transition-opacity hover:opacity-100 opacity-60"
              style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
            >
              ← Back
            </Link>
            {!done ? (
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all hover:brightness-110"
                style={{
                  fontFamily: "var(--font-inter)",
                  backgroundColor: "#22c55e",
                  color: "white",
                }}
              >
                Mark as Complete ✓
              </button>
            ) : (
              <button
                onClick={() => router.push(nextHref)}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all hover:brightness-110"
                style={{
                  fontFamily: "var(--font-inter)",
                  backgroundColor: "#1E90FF",
                  color: "white",
                }}
              >
                Continue to {nextStepLabel} →
              </button>
            )}
          </div>
        </div>
      </div>

      <NextStepToast
        show={toast}
        label={`Next Step: ${nextStepLabel}`}
        href={nextHref}
        onDismiss={() => setToast(false)}
      />
    </>
  );
}
