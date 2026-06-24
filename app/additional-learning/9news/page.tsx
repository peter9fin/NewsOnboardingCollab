"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { TrainingItem } from "@/app/api/training/items/route";

// ─── Constants ────────────────────────────────────────────────────────────────

const OPTIONS = [
  { value: "Publish", label: "Publish", type: "publish" as const, desc: "Relevant and ready to go live" },
  { value: "Publish as Results Event", label: "Publish as Results Event", type: "publish" as const, desc: "Relevant earnings or results item" },
  { value: "Publish as Calendar Event", label: "Publish as Calendar Event", type: "publish" as const, desc: "Relevant scheduled financial event" },
  { value: "Irrelevant", label: "Irrelevant", type: "reject" as const, desc: "Not relevant to 9fin's coverage" },
];

const FLOW_STEPS = [
  {
    question: "Is the article relevant to 9fin's debt/credit market coverage?",
    noOutcome: { label: "Irrelevant", type: "reject" as const },
  },
  {
    question: "Is it an earnings or results release?",
    yesOutcome: { label: "Publish as Results Event", type: "publish" as const },
  },
  {
    question: "Is it a financial calendar event (e.g. AGM, bond maturity, coupon date)?",
    yesOutcome: { label: "Publish as Calendar Event", type: "publish" as const },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Phase = "loading" | "question" | "feedback";

export default function NineNewsDrillPage() {
  const [pool, setPool] = useState<TrainingItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [roundNum, setRoundNum] = useState(1);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    fetch("/api/training/items?count=all")
      .then((r) => r.json())
      .then(({ items }: { items: TrainingItem[] }) => {
        setPool(shuffle(items));
        setPhase("question");
      })
      .catch(() => setPhase("question"));
  }, []);

  const currentItem = pool[idx] ?? null;
  const isCorrect = selected !== null && currentItem !== null && selected === currentItem.correctAnswer;
  const pct = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : null;

  const handleSelect = useCallback(
    (value: string) => {
      if (phase !== "question" || !currentItem) return;
      setSelected(value);
      setSessionTotal((t) => t + 1);
      if (value === currentItem.correctAnswer) setSessionCorrect((c) => c + 1);
      setPhase("feedback");
    },
    [phase, currentItem]
  );

  const handleNext = useCallback(() => {
    const next = idx + 1;
    if (next >= pool.length) {
      setPool((prev) => shuffle([...prev]));
      setIdx(0);
      setRoundNum((r) => r + 1);
    } else {
      setIdx(next);
    }
    setSelected(null);
    setPhase("question");
  }, [idx, pool.length]);

  const sans = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";
  const mono = "var(--font-space-mono), ui-monospace, monospace";

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "#0A1628", overflowX: "clip" }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(30,144,255,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 120% 55% at 50% -5%, rgba(15,60,180,0.45) 0%, transparent 65%)",
        }}
      />

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b"
          style={{
            backgroundColor: "rgba(10,22,40,0.85)",
            borderColor: "rgba(30,144,255,0.15)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/additional-learning"
              className="flex items-center gap-2 text-xs"
              style={{ fontFamily: mono, color: "rgba(204,204,204,0.5)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Drills
            </Link>
            <span style={{ color: "rgba(168,85,247,0.3)" }}>/</span>
            <span className="text-xs" style={{ fontFamily: mono, color: "rgba(204,204,204,0.7)" }}>
              9news Triage
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHelpOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full transition-colors hover:bg-[rgba(30,144,255,0.12)]"
              style={{ fontFamily: mono, color: "#1E90FF", border: "1px solid rgba(30,144,255,0.25)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Decision Guide
            </button>

            {sessionTotal > 0 && (
              <div
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
                style={{
                  fontFamily: mono,
                  backgroundColor: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  color: "#4ade80",
                }}
              >
                <span className="font-bold">{sessionCorrect}/{sessionTotal}</span>
                <span style={{ color: "rgba(34,197,94,0.6)" }}>correct</span>
                {pct !== null && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: pct >= 80 ? "rgba(34,197,94,0.2)" : pct >= 60 ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)",
                      color: pct >= 80 ? "#4ade80" : pct >= 60 ? "#facc15" : "#f87171",
                    }}
                  >
                    {pct}%
                  </span>
                )}
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    color: "rgba(168,85,247,0.7)",
                    backgroundColor: "rgba(168,85,247,0.08)",
                    border: "1px solid rgba(168,85,247,0.15)",
                  }}
                >
                  R{roundNum}
                </span>
              </div>
            )}
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center px-4 py-10">
          <div className="w-full max-w-2xl flex flex-col gap-6">

            {phase === "loading" && (
              <div className="text-center py-24" style={{ color: "rgba(204,204,204,0.4)", fontFamily: mono, fontSize: "13px" }}>
                Loading question pool…
              </div>
            )}

            {(phase === "question" || phase === "feedback") && currentItem && (
              <>
                {/* Progress indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ fontFamily: mono, color: "rgba(204,204,204,0.4)" }}>
                    Question {idx + 1} of {pool.length}
                  </span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      fontFamily: mono,
                      color: "#60a5fa",
                      backgroundColor: "rgba(30,144,255,0.1)",
                      border: "1px solid rgba(30,144,255,0.2)",
                    }}
                  >
                    {currentItem.source}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(30,144,255,0.1)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${((idx + (phase === "feedback" ? 1 : 0)) / pool.length) * 100}%`, backgroundColor: "#1E90FF" }}
                  />
                </div>

                {/* Article card */}
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                    border: "1px solid rgba(30,144,255,0.25)",
                  }}
                >
                  <span
                    className="inline-block text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-4"
                    style={{
                      fontFamily: mono,
                      color: "#1E90FF",
                      backgroundColor: "rgba(30,144,255,0.1)",
                      border: "1px solid rgba(30,144,255,0.2)",
                    }}
                  >
                    {currentItem.source}
                  </span>
                  <p
                    className="text-lg font-semibold leading-snug"
                    style={{ fontFamily: sans, color: "white" }}
                  >
                    {currentItem.title}
                  </p>
                </div>

                {/* Feedback banner */}
                {phase === "feedback" && (
                  <div
                    className="rounded-xl px-5 py-4"
                    style={{
                      backgroundColor: isCorrect ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                      border: `1px solid ${isCorrect ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                    }}
                  >
                    <p
                      className="text-sm font-bold mb-1"
                      style={{ fontFamily: sans, color: isCorrect ? "#22c55e" : "#ef4444" }}
                    >
                      {isCorrect ? "✓ Correct" : `✗ Incorrect — correct answer: ${currentItem.correctAnswer}`}
                    </p>
                    {currentItem.reasoning && (
                      <p
                        className="text-xs leading-relaxed pt-2"
                        style={{
                          fontFamily: sans,
                          color: "rgba(204,204,204,0.65)",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {currentItem.reasoning}
                      </p>
                    )}
                  </div>
                )}

                {/* Answer options */}
                <div className="grid grid-cols-2 gap-3">
                  {OPTIONS.map((opt) => {
                    const isSelected = selected === opt.value;
                    const isCorrectOpt = currentItem.correctAnswer === opt.value;
                    const showResult = phase === "feedback";

                    const defaultBg = opt.type === "publish" ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)";
                    const defaultBorder = opt.type === "publish" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)";
                    const defaultColor = opt.type === "publish" ? "rgba(134,239,172,0.85)" : "rgba(252,165,165,0.85)";

                    let bg = defaultBg;
                    let border = defaultBorder;
                    let color = defaultColor;
                    let opacity = "1";

                    if (showResult) {
                      if (isCorrectOpt) { bg = "rgba(34,197,94,0.12)"; border = "rgba(34,197,94,0.5)"; color = "#22c55e"; }
                      else if (isSelected) { bg = "rgba(239,68,68,0.12)"; border = "rgba(239,68,68,0.5)"; color = "#ef4444"; }
                      else { opacity = "0.3"; }
                    }

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        disabled={phase === "feedback"}
                        className="rounded-xl px-4 py-4 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default"
                        style={{ fontFamily: sans, backgroundColor: bg, border: `1px solid ${border}`, color, opacity }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{opt.label}</span>
                          {showResult && isCorrectOpt && <span className="text-xs font-bold flex-shrink-0" style={{ color: "#22c55e" }}>✓</span>}
                          {showResult && isSelected && !isCorrectOpt && <span className="text-xs font-bold flex-shrink-0" style={{ color: "#ef4444" }}>✗</span>}
                        </div>
                        <p className="text-[11px] mt-1 leading-snug" style={{ color: "rgba(204,204,204,0.4)" }}>{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                {phase === "feedback" && (
                  <button
                    onClick={handleNext}
                    className="self-end inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5"
                    style={{
                      fontFamily: sans,
                      backgroundColor: "rgba(168,85,247,0.15)",
                      border: "1px solid rgba(168,85,247,0.4)",
                      color: "#c084fc",
                    }}
                  >
                    Next question
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                )}
              </>
            )}

            {phase !== "loading" && !currentItem && (
              <div className="text-center py-24">
                <p style={{ fontFamily: sans, color: "rgba(204,204,204,0.5)", fontSize: "14px" }}>
                  No questions found. Check the data file.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer
          className="text-center py-4 text-xs border-t"
          style={{
            fontFamily: mono,
            color: "rgba(204,204,204,0.3)",
            borderColor: "rgba(30,144,255,0.1)",
          }}
        >
          9fin Onboarding © 2026
        </footer>
      </div>
    </div>
  );
}

// ─── Help Modal ───────────────────────────────────────────────────────────────

function HelpModal({ onClose }: { onClose: () => void }) {
  const sans = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";
  const mono = "var(--font-space-mono), ui-monospace, monospace";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
          border: "1px solid rgba(30,144,255,0.25)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: "rgba(30,144,255,0.15)" }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ fontFamily: sans, color: "white" }}>
              Triage Decision Flow
            </h2>
            <p className="text-xs mt-0.5" style={{ fontFamily: sans, color: "rgba(204,204,204,0.5)" }}>
              Follow this logic top to bottom for each article
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.06)]"
            style={{ color: "rgba(204,204,204,0.5)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-1">
          {FLOW_STEPS.map((step, i) => {
            const exitOnYes = "yesOutcome" in step;
            const outcome = exitOnYes ? step.yesOutcome : step.noOutcome;
            return (
              <div key={i}>
                <div
                  className="rounded-xl px-4 py-3.5 flex items-start gap-3"
                  style={{ backgroundColor: "rgba(30,144,255,0.07)", border: "1px solid rgba(30,144,255,0.18)" }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(30,144,255,0.15)", border: "1px solid rgba(30,144,255,0.3)", color: "#1E90FF", fontFamily: mono }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-snug" style={{ fontFamily: sans, color: "rgba(255,255,255,0.85)" }}>
                    {step.question}
                  </p>
                </div>
                <div className="flex items-stretch gap-2 mt-1 ml-4">
                  <div className="w-px self-stretch" style={{ backgroundColor: "rgba(30,144,255,0.15)", marginLeft: "6px" }} />
                  <div className="flex-1 flex flex-col gap-1 py-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          fontFamily: mono,
                          color: exitOnYes ? "#22c55e" : "#ef4444",
                          backgroundColor: exitOnYes ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        }}
                      >
                        {exitOnYes ? "YES" : "NO"}
                      </span>
                      <div
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                        style={{
                          fontFamily: sans,
                          color: outcome!.type === "publish" ? "#22c55e" : "#f97316",
                          backgroundColor: outcome!.type === "publish" ? "rgba(34,197,94,0.1)" : "rgba(249,115,22,0.1)",
                          border: `1px solid ${outcome!.type === "publish" ? "rgba(34,197,94,0.25)" : "rgba(249,115,22,0.25)"}`,
                        }}
                      >
                        → {outcome!.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          fontFamily: mono,
                          color: exitOnYes ? "#ef4444" : "#22c55e",
                          backgroundColor: exitOnYes ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                        }}
                      >
                        {exitOnYes ? "NO" : "YES"}
                      </span>
                      <span className="text-xs" style={{ fontFamily: sans, color: "rgba(204,204,204,0.4)" }}>
                        Continue ↓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-3 mt-2 pl-4">
            <div className="w-px h-6 flex-shrink-0" style={{ backgroundColor: "rgba(30,144,255,0.15)", marginLeft: "6px" }} />
            <div
              className="rounded-lg px-4 py-2 text-sm font-bold"
              style={{ fontFamily: sans, color: "#22c55e", backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}
            >
              → Publish
            </div>
          </div>
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
