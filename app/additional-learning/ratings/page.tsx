"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import allRatingsItems from "@/data/ratings-items.json";
import PageShell from "@/app/components/PageShell";
import Navbar from "@/app/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RatingsItem {
  slackType: "exchange-link" | "no-company-found";
  agency: string;
  articleId: string;
  title: string;
  correctAnswer: string;
  company: string;
  explanation: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXCHANGE_OPTIONS = [
  { value: "cfr", label: "✅  React — company correct, update CFR on profile", color: "green" },
  { value: "instruments", label: "✅  React — company correct, update CFR + instrument ratings", color: "blue" },
  { value: "remove", label: "⛔  React — wrong company / irrelevant, remove from profile", color: "red" },
];

const COVERAGE_OPTIONS = [
  { value: "publish", label: "✅  React — in coverage, publish to 9fin profile", color: "green" },
  { value: "ignore", label: "⛔  React — outside coverage (CLO, municipal, bank, etc.)", color: "red" },
];

const AGENCY_NAMES: Record<string, string> = {
  moodys: "Moody's",
  "s&p": "S&P",
  fitch: "Fitch",
};

const OPTION_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  green: {
    border: "rgba(34,197,94,0.35)",
    bg: "rgba(34,197,94,0.08)",
    text: "#4ade80",
  },
  blue: {
    border: "rgba(30,144,255,0.35)",
    bg: "rgba(30,144,255,0.08)",
    text: "#60a5fa",
  },
  red: {
    border: "rgba(239,68,68,0.35)",
    bg: "rgba(239,68,68,0.08)",
    text: "#f87171",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SlackMessage({ item }: { item: RatingsItem }) {
  const mono = "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace";
  const sans = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";

  if (item.slackType === "exchange-link") {
    const agencyLabel = AGENCY_NAMES[item.agency.toLowerCase()] ?? item.agency;
    return (
      <div
        className="rounded-xl p-5 text-sm"
        style={{
          backgroundColor: "rgba(74,144,226,0.06)",
          border: "1px solid rgba(74,144,226,0.2)",
          fontFamily: sans,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-lg"
            style={{ backgroundColor: "rgba(74,144,226,0.12)", border: "1px solid rgba(74,144,226,0.2)" }}
          >
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-bold text-white text-sm">RatingsBot</span>
              <span className="text-xs" style={{ color: "rgba(204,204,204,0.4)" }}>Today</span>
            </div>
            <p style={{ color: "rgba(204,204,204,0.75)" }} className="mb-3">
              🔗 <span className="font-medium text-white">1 new exchange link detected</span>
            </p>
            <div
              className="rounded-lg p-3 text-xs"
              style={{
                backgroundColor: "rgba(10,22,40,0.6)",
                border: "1px solid rgba(255,255,255,0.07)",
                fontFamily: mono,
              }}
            >
              <div style={{ color: "#60a5fa" }} className="font-semibold mb-1">
                {agencyLabel} ({item.articleId})
              </div>
              <div style={{ color: "rgba(204,204,204,0.55)" }} className="text-[11px] leading-relaxed">
                {item.title}
              </div>
              {item.company && (
                <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(204,204,204,0.4)" }}>
                  published to{" "}
                  <span style={{ color: "#93c5fd" }}>{item.company}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // no-company-found
  return (
    <div
      className="rounded-xl p-5 text-sm"
      style={{
        backgroundColor: "rgba(239,68,68,0.05)",
        border: "1px solid rgba(239,68,68,0.18)",
        fontFamily: sans,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-lg"
          style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.18)" }}
        >
          🤖
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-bold text-white text-sm">RatingsBot</span>
            <span className="text-xs" style={{ color: "rgba(204,204,204,0.4)" }}>Today</span>
          </div>
          <p style={{ color: "rgba(204,204,204,0.75)" }}>
            ⚠️ <span className="font-medium" style={{ color: "#fca5a5" }}>No company found via entity linker for:</span>
          </p>
          <p
            className="mt-2 text-xs leading-relaxed font-medium"
            style={{ color: "rgba(204,204,204,0.65)", fontFamily: mono }}
          >
            {item.title}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Phase = "loading" | "question" | "feedback";

export default function RatingsDrillPage() {
  const [pool, setPool] = useState<RatingsItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [roundNum, setRoundNum] = useState(1);

  // Load entire pool on mount
  useEffect(() => {
    setPool(shuffle(allRatingsItems as RatingsItem[]));
    setPhase("question");
  }, []);

  const currentItem = pool[idx] ?? null;
  const options = currentItem?.slackType === "exchange-link" ? EXCHANGE_OPTIONS : COVERAGE_OPTIONS;

  const handleSelect = useCallback(
    (value: string) => {
      if (phase !== "question" || !currentItem) return;
      setSelected(value);
      setSessionTotal((t) => t + 1);
      if (value === currentItem.correctAnswer) {
        setSessionCorrect((c) => c + 1);
      }
      setPhase("feedback");
    },
    [phase, currentItem]
  );

  const handleNext = useCallback(() => {
    const nextIdx = idx + 1;
    if (nextIdx >= pool.length) {
      // Reshuffle and start a new round
      setPool((prev) => shuffle([...prev]));
      setIdx(0);
      setRoundNum((r) => r + 1);
    } else {
      setIdx(nextIdx);
    }
    setSelected(null);
    setPhase("question");
  }, [idx, pool.length]);

  const pct = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : null;
  const isCorrect = selected !== null && currentItem !== null && selected === currentItem.correctAnswer;

  const sans = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";
  const mono = "var(--font-space-mono), ui-monospace, monospace";

  return (
    <PageShell>
      <Navbar subtitle="Ratings &middot; Drill" />

        {/* Drill toolbar */}
        <div
          className="sticky top-[57px] z-40 flex items-center justify-between px-6 py-2.5 border-b"
          style={{
            backgroundColor: "rgba(10,22,40,0.85)",
            borderColor: "rgba(30,144,255,0.1)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/additional-learning"
              className="flex items-center gap-2 text-xs transition-colors duration-150"
              style={{ fontFamily: mono, color: "rgba(204,204,204,0.5)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Drills
            </Link>
            <span style={{ color: "rgba(168,85,247,0.3)" }}>/</span>
            <span className="text-xs" style={{ fontFamily: mono, color: "rgba(204,204,204,0.7)" }}>
              Ratings Triage
            </span>
          </div>

          {/* Live session stats */}
          {sessionTotal > 0 && (
            <div className="flex items-center gap-3">
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
              </div>
              <div
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  fontFamily: mono,
                  color: "rgba(168,85,247,0.7)",
                  backgroundColor: "rgba(168,85,247,0.08)",
                  border: "1px solid rgba(168,85,247,0.15)",
                }}
              >
                Round {roundNum}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
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
                  <span
                    className="text-xs"
                    style={{ fontFamily: mono, color: "rgba(204,204,204,0.4)" }}
                  >
                    Question {idx + 1} of {pool.length}
                  </span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      fontFamily: mono,
                      color: currentItem.slackType === "exchange-link" ? "#60a5fa" : "#f87171",
                      backgroundColor: currentItem.slackType === "exchange-link"
                        ? "rgba(30,144,255,0.1)" : "rgba(239,68,68,0.1)",
                      border: `1px solid ${currentItem.slackType === "exchange-link" ? "rgba(30,144,255,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}
                  >
                    {currentItem.slackType === "exchange-link" ? "Auto-published" : "Not auto-published"}
                  </span>
                </div>

                {/* Slack message */}
                <SlackMessage item={currentItem} />

                {/* 9fin search hint */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://9fin.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors duration-150"
                    style={{
                      fontFamily: mono,
                      color: "#60a5fa",
                      backgroundColor: "rgba(30,144,255,0.08)",
                      border: "1px solid rgba(30,144,255,0.2)",
                    }}
                  >
                    Search on 9fin ↗
                  </a>
                  {currentItem.company && (
                    <span className="text-xs" style={{ fontFamily: mono, color: "rgba(204,204,204,0.4)" }}>
                      search:{" "}
                      <span style={{ color: "rgba(204,204,204,0.7)" }}>{currentItem.company}</span>
                    </span>
                  )}
                </div>

                {/* Question */}
                <p
                  className="text-base font-semibold leading-snug"
                  style={{ fontFamily: sans, color: "rgba(255,255,255,0.9)" }}
                >
                  {currentItem.slackType === "exchange-link"
                    ? "This article has been auto-published. What do you do?"
                    : "The bot couldn't find this company. Should you publish or ignore?"}
                </p>

                {/* Options */}
                <div className="flex flex-col gap-3">
                  {options.map((opt) => {
                    const style = OPTION_STYLES[opt.color];
                    const isSelected = selected === opt.value;
                    const isCorrectOpt = currentItem.correctAnswer === opt.value;
                    const showResult = phase === "feedback";

                    let borderColor = "rgba(255,255,255,0.08)";
                    let bgColor = "rgba(255,255,255,0.02)";
                    let textColor = "rgba(204,204,204,0.75)";

                    if (showResult) {
                      if (isCorrectOpt) {
                        borderColor = "rgba(34,197,94,0.5)";
                        bgColor = "rgba(34,197,94,0.1)";
                        textColor = "#4ade80";
                      } else if (isSelected && !isCorrectOpt) {
                        borderColor = "rgba(239,68,68,0.5)";
                        bgColor = "rgba(239,68,68,0.1)";
                        textColor = "#f87171";
                      }
                    } else if (isSelected) {
                      borderColor = style.border;
                      bgColor = style.bg;
                      textColor = style.text;
                    }

                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        disabled={phase === "feedback"}
                        className="text-left rounded-xl px-5 py-4 text-sm font-medium transition-all duration-150"
                        style={{
                          fontFamily: sans,
                          border: `1px solid ${borderColor}`,
                          backgroundColor: bgColor,
                          color: textColor,
                          cursor: phase === "feedback" ? "default" : "pointer",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{opt.label}</span>
                          {showResult && isCorrectOpt && (
                            <span className="flex-shrink-0 text-xs font-bold" style={{ color: "#4ade80" }}>✓ Correct</span>
                          )}
                          {showResult && isSelected && !isCorrectOpt && (
                            <span className="flex-shrink-0 text-xs font-bold" style={{ color: "#f87171" }}>✗ Wrong</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback panel */}
                {phase === "feedback" && (
                  <div
                    className="rounded-xl p-5"
                    style={{
                      backgroundColor: isCorrect ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
                      border: `1px solid ${isCorrect ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                    }}
                  >
                    <p
                      className="text-sm font-bold mb-1"
                      style={{ fontFamily: sans, color: isCorrect ? "#4ade80" : "#f87171" }}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: sans, color: "rgba(204,204,204,0.75)" }}
                    >
                      {currentItem.explanation}
                    </p>
                  </div>
                )}

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

            {/* Empty pool fallback */}
            {phase !== "loading" && !currentItem && (
              <div className="text-center py-24">
                <p style={{ fontFamily: sans, color: "rgba(204,204,204,0.5)", fontSize: "14px" }}>
                  No questions found. Check the data file.
                </p>
              </div>
            )}
          </div>
        </main>

    </PageShell>
  );
}
