"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  type Team,
  type Step,
  getTeamProgress,
  markStepComplete,
} from "@/lib/progress";
import NextStepToast from "./NextStepToast";
import PageShell from "./PageShell";
import Navbar from "./Navbar";

interface StepConfig {
  id: Step;
  title: string;
  description: string;
  href: string;
  available: boolean;
}

interface TeamHubProps {
  team: Team;
  label: string;
  description: string;
  steps: StepConfig[];
}

const STEP_ORDER: Step[] = ["guides", "presentations", "knowledge", "training"];

const ICONS: Record<Step, React.ReactNode> = {
  guides: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  presentations: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  knowledge: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  training: (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
};

export default function TeamHub({ team, label, description, steps }: TeamHubProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [progress, setProgress] = useState<Record<Step, boolean>>({
    guides: false,
    presentations: false,
    knowledge: false,
    training: false,
  });

  const [toast, setToast] = useState<{ show: boolean; label: string; href: string }>({
    show: false,
    label: "",
    href: "",
  });

  // Fetch progress from Supabase on mount
  useEffect(() => {
    getTeamProgress(team).then(setProgress);
  }, [team]);

  // Handle ?step_done= param — show toast, clean up URL
  useEffect(() => {
    const stepDone = searchParams.get("step_done") as Step | null;
    if (!stepDone) return;

    const doneIndex = STEP_ORDER.indexOf(stepDone);
    const nextStep = steps[doneIndex + 1];

    if (nextStep && nextStep.available) {
      setToast({
        show: true,
        label: `Next Step: ${nextStep.title}`,
        href: nextStep.href,
      });
    } else if (!nextStep) {
      setToast({
        show: true,
        label: `You've completed all ${label} steps!`,
        href: "/",
      });
    }

    // Remove the query param without a page reload
    router.replace(`/${team}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkComplete = useCallback(
    async (step: StepConfig, stepIndex: number) => {
      await markStepComplete(team, step.id);
      setProgress((prev) => ({ ...prev, [step.id]: true }));

      const nextStep = steps[stepIndex + 1];
      if (nextStep && nextStep.available) {
        setToast({
          show: true,
          label: `Next Step: ${nextStep.title}`,
          href: nextStep.href,
        });
      } else if (!nextStep) {
        setToast({
          show: true,
          label: `You've completed all ${label} steps!`,
          href: "/",
        });
      }
    },
    [team, steps, label]
  );

  return (
    <>
      <PageShell>
        <Navbar />

          {/* Header */}
          <section className="px-6 pt-16 pb-12">
            <div className="max-w-5xl mx-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs mb-8 transition-opacity hover:opacity-100 opacity-60"
                style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                All Teams
              </Link>

              <h1
                className="text-4xl font-bold tracking-tight mb-3"
                style={{ fontFamily: "var(--font-inter)", color: "white" }}
              >
                {label}
              </h1>
              <p
                className="text-base"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.65)" }}
              >
                {description}
              </p>

              {/* Progress indicator */}
              <div className="flex items-center gap-3 mt-6">
                {STEP_ORDER.map((stepId, i) => (
                  <div key={stepId} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        backgroundColor: progress[stepId]
                          ? "rgba(34,197,94,0.2)"
                          : "rgba(30,144,255,0.1)",
                        border: `1px solid ${progress[stepId] ? "rgba(34,197,94,0.4)" : "rgba(30,144,255,0.2)"}`,
                        color: progress[stepId] ? "#22c55e" : "rgba(204,204,204,0.4)",
                      }}
                    >
                      {progress[stepId] ? "✓" : i + 1}
                    </div>
                    {i < STEP_ORDER.length - 1 && (
                      <div
                        className="w-8 h-px"
                        style={{
                          backgroundColor: progress[stepId]
                            ? "rgba(34,197,94,0.3)"
                            : "rgba(30,144,255,0.12)",
                        }}
                      />
                    )}
                  </div>
                ))}
                <span
                  className="text-xs ml-1"
                  style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.35)" }}
                >
                  {Object.values(progress).filter(Boolean).length}/{STEP_ORDER.length} complete
                </span>
              </div>
            </div>
          </section>

          {/* Step cards */}
          <section className="flex-1 px-6 pb-28">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
              {steps.map((step, i) => {
                const isComplete = progress[step.id];
                const prevStep = i > 0 ? steps[i - 1] : null;
                const isLocked = prevStep ? !progress[prevStep.id] : false;
                const stepNum = i + 1;

                return (
                  <StepCard
                    key={step.id}
                    step={step}
                    stepNum={stepNum}
                    isComplete={isComplete}
                    isLocked={isLocked}
                    prevStepTitle={prevStep?.title}
                    onMarkComplete={() => handleMarkComplete(step, i)}
                  />
                );
              })}
            </div>
          </section>

      </PageShell>

      <NextStepToast
        show={toast.show}
        label={toast.label}
        href={toast.href}
        onDismiss={() => setToast((t) => ({ ...t, show: false }))}
      />
    </>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({
  step,
  stepNum,
  isComplete,
  isLocked,
  prevStepTitle,
  onMarkComplete,
}: {
  step: StepConfig;
  stepNum: number;
  isComplete: boolean;
  isLocked: boolean;
  prevStepTitle?: string;
  onMarkComplete: () => void;
}) {
  const icon = ICONS[step.id];

  if (isLocked) {
    return (
      <div
        className="flex flex-col rounded-xl p-7 select-none"
        style={{
          background: "linear-gradient(160deg, #0b1b35 0%, #081528 100%)",
          border: "1px solid rgba(30,144,255,0.1)",
          opacity: 0.55,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(204,204,204,0.3)",
            }}
          >
            {icon}
          </div>
          {/* Lock icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(204,204,204,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <span
          className="text-[10px] tracking-[0.18em] uppercase mb-3"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.25)" }}
        >
          Step {stepNum}
        </span>

        <h2
          className="text-base font-semibold mb-2.5 tracking-tight"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.35)" }}
        >
          {step.title}
        </h2>

        <p
          className="text-sm leading-relaxed flex-1"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.3)" }}
        >
          {step.description}
        </p>

        <p
          className="mt-6 text-xs"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.3)" }}
        >
          Complete {prevStepTitle ?? "the previous step"} to unlock
        </p>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div
        className="flex flex-col rounded-xl p-7"
        style={{
          background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
          border: "1px solid rgba(34,197,94,0.25)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#22c55e",
            }}
          >
            {icon}
          </div>
          <span
            className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            Completed
          </span>
        </div>

        <span
          className="text-[10px] tracking-[0.18em] uppercase mb-3"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(34,197,94,0.6)" }}
        >
          Step {stepNum}
        </span>

        <h2
          className="text-base font-semibold mb-2.5 tracking-tight"
          style={{ fontFamily: "var(--font-inter)", color: "white" }}
        >
          {step.title}
        </h2>

        <p
          className="text-sm leading-relaxed flex-1"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
        >
          {step.description}
        </p>

        {step.available && (
          <Link
            href={step.href}
            className="mt-7 inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ fontFamily: "var(--font-space-mono)", color: "rgba(34,197,94,0.7)" }}
          >
            Revisit
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        )}
      </div>
    );
  }

  // Unlocked and not yet complete
  return (
    <div
      className="flex flex-col rounded-xl p-7 border border-[rgba(30,144,255,0.28)] hover:border-[rgba(30,144,255,0.45)] transition-[border-color] duration-300"
      style={{ background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: "rgba(30, 144, 255, 0.1)",
            border: "1px solid rgba(30, 144, 255, 0.2)",
            color: "#1E90FF",
          }}
        >
          {icon}
        </div>
        <span
          className="text-[10px] tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
        >
          Step {stepNum}
        </span>
      </div>

      <h2
        className="text-base font-semibold mb-2.5 tracking-tight"
        style={{ fontFamily: "var(--font-inter)", color: "white" }}
      >
        {step.title}
      </h2>

      <p
        className="text-sm leading-relaxed flex-1"
        style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.85)" }}
      >
        {step.description}
      </p>

      <div className="mt-7 flex flex-col gap-2">
        {step.available ? (
          <>
            <Link
              href={step.href}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all hover:brightness-110"
              style={{
                fontFamily: "var(--font-inter)",
                backgroundColor: "#1E90FF",
                color: "white",
              }}
            >
              Open
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <button
              onClick={onMarkComplete}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all hover:bg-[rgba(34,197,94,0.12)]"
              style={{
                fontFamily: "var(--font-inter)",
                color: "rgba(34,197,94,0.7)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              Mark as Complete
            </button>
          </>
        ) : (
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.3)" }}
          >
            Coming soon
          </span>
        )}
      </div>
    </div>
  );
}
