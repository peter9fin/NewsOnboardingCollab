"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { TrainingItem } from "@/app/api/training/items/route";

const SESSION_SIZE = 10;

const TRIAGE_OPTIONS = [
  { value: "Publish", label: "Publish" },
  { value: "Publish Silently", label: "Publish Silently" },
  { value: "Edit & Publish", label: "Edit & Publish" },
  { value: "Publish as Calendar Event", label: "Calendar Event" },
  { value: "Publish as Results Event", label: "Results Event" },
  { value: "Irrelevant Content", label: "Irrelevant Content" },
  { value: "Duplicate", label: "Duplicate" },
  { value: "Incorrect Entity Match", label: "Incorrect Entity" },
];

type Phase = "start" | "question" | "complete";

interface Answer {
  item: TrainingItem;
  selected: string;
  correct: boolean;
}

export default function NineNewsTraining() {
  const [phase, setPhase] = useState<Phase>("start");
  const [items, setItems] = useState<TrainingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);

  const startSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/training/items?count=${SESSION_SIZE}`);
      const data = await res.json();
      setItems(data.items);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setAnswers([]);
      setPhase("question");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnswer = useCallback(
    (option: string) => {
      if (selectedAnswer !== null) return;
      const correct = option === items[currentIndex].correctAnswer;
      setSelectedAnswer(option);
      setAnswers((prev) => [
        ...prev,
        { item: items[currentIndex], selected: option, correct },
      ]);
    },
    [selectedAnswer, items, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= items.length) {
      setPhase("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  }, [currentIndex, items.length]);

  const score = answers.filter((a) => a.correct).length;

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "#0A1628", overflowX: "clip" }}
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

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b"
          style={{
            backgroundColor: "rgba(10, 22, 40, 0.75)",
            borderColor: "rgba(30, 144, 255, 0.2)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/9fin-logo.png`}
              alt="9fin"
              width={80}
              height={32}
              className="object-contain rounded-lg"
              style={{ height: "auto" }}
            />
          </Link>
          <span
            className="text-xs tracking-[0.2em] uppercase hidden sm:block"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "rgba(204,204,204,0.55)",
            }}
          >
            9news · Training
          </span>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          {phase === "start" && (
            <StartScreen loading={loading} onStart={startSession} />
          )}
          {phase === "question" && items.length > 0 && (
            <QuestionScreen
              item={items[currentIndex]}
              index={currentIndex}
              total={items.length}
              selectedAnswer={selectedAnswer}
              score={score}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          )}
          {phase === "complete" && (
            <CompleteScreen
              answers={answers}
              score={score}
              total={items.length}
              onRetry={startSession}
              loading={loading}
            />
          )}
        </div>

        <footer
          className="text-center py-6 text-xs border-t"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: "rgba(204,204,204,0.4)",
            borderColor: "rgba(30,144,255,0.1)",
          }}
        >
          9fin Onboarding © 2026
        </footer>
      </div>
    </div>
  );
}

// ─── Start Screen ─────────────────────────────────────────────────────────────

function StartScreen({
  loading,
  onStart,
}: {
  loading: boolean;
  onStart: () => void;
}) {
  return (
    <div className="w-full max-w-lg text-center">
      <div
        className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
        style={{
          borderColor: "rgba(30, 144, 255, 0.35)",
          backgroundColor: "rgba(30, 144, 255, 0.07)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#1E90FF" }}
        />
        <span
          className="text-xs tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
        >
          9news · Triage Training
        </span>
      </div>

      <h1
        className="text-4xl font-bold tracking-tight mb-4"
        style={{ fontFamily: "var(--font-inter)", color: "white" }}
      >
        Triage Assessment
      </h1>
      <p
        className="text-base leading-relaxed mb-10"
        style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
      >
        You&apos;ll be shown {SESSION_SIZE} real news headlines from the 9news
        feed. For each one, decide how it should be triaged. Your answers will
        be compared against actual editorial decisions.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-10 text-left">
        {[
          ["Publish", "Article is relevant and ready to go"],
          ["Publish Silently", "Relevant but no notification needed"],
          ["Edit & Publish", "Needs editing before publishing"],
          ["Calendar Event", "Relevant scheduled event"],
          ["Results Event", "Relevant earnings/results item"],
          ["Irrelevant Content", "Not relevant to 9fin coverage"],
          ["Duplicate", "Already covered by another article"],
          ["Incorrect Entity", "Wrong company/entity matched"],
        ].map(([label, desc]) => (
          <div
            key={label}
            className="rounded-lg px-3.5 py-3"
            style={{
              background: "rgba(30,144,255,0.05)",
              border: "1px solid rgba(30,144,255,0.12)",
            }}
          >
            <p
              className="text-xs font-semibold mb-0.5"
              style={{ fontFamily: "var(--font-inter)", color: "white" }}
            >
              {label}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={loading}
        className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03] disabled:opacity-50"
        style={{
          fontFamily: "var(--font-inter)",
          backgroundColor: "#1E90FF",
          color: "white",
          boxShadow: "0 0 36px rgba(30,144,255,0.35)",
        }}
      >
        {loading ? "Loading…" : "Begin Session"}
        {!loading && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ─── Question Screen ──────────────────────────────────────────────────────────

function QuestionScreen({
  item,
  index,
  total,
  selectedAnswer,
  score,
  onAnswer,
  onNext,
}: {
  item: TrainingItem;
  index: number;
  total: number;
  selectedAnswer: string | null;
  score: number;
  onAnswer: (option: string) => void;
  onNext: () => void;
}) {
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === item.correctAnswer;
  const isLast = index + 1 === total;

  return (
    <div className="w-full max-w-2xl">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}
        >
          Question {index + 1} of {total}
        </span>
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}
        >
          {score} correct
        </span>
      </div>
      <div
        className="w-full h-1 rounded-full mb-8 overflow-hidden"
        style={{ backgroundColor: "rgba(30,144,255,0.1)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((index + (answered ? 1 : 0)) / total) * 100}%`,
            backgroundColor: "#1E90FF",
          }}
        />
      </div>

      {/* Article card */}
      <div
        className="rounded-xl p-6 mb-6"
        style={{
          background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
          border: "1px solid rgba(30,144,255,0.25)",
        }}
      >
        <span
          className="inline-block text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-4"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: "#1E90FF",
            backgroundColor: "rgba(30,144,255,0.1)",
            border: "1px solid rgba(30,144,255,0.2)",
          }}
        >
          {item.source}
        </span>
        <p
          className="text-lg font-semibold leading-snug"
          style={{ fontFamily: "var(--font-inter)", color: "white" }}
        >
          {item.title}
        </p>
      </div>

      {/* Feedback banner */}
      {answered && (
        <div
          className="rounded-lg px-4 py-3 mb-5 flex items-center gap-3"
          style={{
            backgroundColor: isCorrect
              ? "rgba(34,197,94,0.1)"
              : "rgba(239,68,68,0.1)",
            border: `1px solid ${isCorrect ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}
        >
          <span style={{ fontSize: "18px" }}>{isCorrect ? "✓" : "✗"}</span>
          <div>
            <p
              className="text-sm font-semibold"
              style={{
                fontFamily: "var(--font-inter)",
                color: isCorrect ? "#22c55e" : "#ef4444",
              }}
            >
              {isCorrect ? "Correct!" : "Not quite"}
            </p>
            {!isCorrect && (
              <p
                className="text-xs mt-0.5"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
              >
                The correct answer was{" "}
                <span style={{ color: "white", fontWeight: 600 }}>
                  {item.correctAnswer}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {TRIAGE_OPTIONS.map((opt) => {
          const isSelected = selectedAnswer === opt.value;
          const isCorrectOption = opt.value === item.correctAnswer;

          let borderColor = "rgba(30,144,255,0.2)";
          let bg = "rgba(30,144,255,0.05)";
          let textColor = "rgba(204,204,204,0.85)";
          let opacity = "1";

          if (answered) {
            if (isCorrectOption) {
              borderColor = "rgba(34,197,94,0.5)";
              bg = "rgba(34,197,94,0.1)";
              textColor = "#22c55e";
            } else if (isSelected) {
              borderColor = "rgba(239,68,68,0.5)";
              bg = "rgba(239,68,68,0.1)";
              textColor = "#ef4444";
            } else {
              opacity = "0.35";
            }
          }

          return (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              disabled={answered}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default"
              style={{
                fontFamily: "var(--font-inter)",
                backgroundColor: bg,
                border: `1px solid ${borderColor}`,
                color: textColor,
                opacity,
              }}
              onMouseEnter={(e) => {
                if (!answered)
                  e.currentTarget.style.borderColor = "rgba(30,144,255,0.5)";
              }}
              onMouseLeave={(e) => {
                if (!answered)
                  e.currentTarget.style.borderColor = "rgba(30,144,255,0.2)";
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {answered && (
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{
              fontFamily: "var(--font-inter)",
              backgroundColor: "#1E90FF",
              color: "white",
            }}
          >
            {isLast ? "See Results" : "Next"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Complete Screen ──────────────────────────────────────────────────────────

function CompleteScreen({
  answers,
  score,
  total,
  onRetry,
  loading,
}: {
  answers: Answer[];
  score: number;
  total: number;
  onRetry: () => void;
  loading: boolean;
}) {
  const pct = Math.round((score / total) * 100);

  const message =
    pct === 100
      ? "Perfect score — outstanding triage instincts."
      : pct >= 80
      ? "Strong result — you have a solid grasp of the workflow."
      : pct >= 60
      ? "Good effort — review the missed items below and try again."
      : "Keep practising — focus on the patterns in the missed items below.";

  return (
    <div className="w-full max-w-2xl">
      {/* Score card */}
      <div
        className="rounded-2xl p-8 mb-8 text-center"
        style={{
          background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
          border: "1px solid rgba(30,144,255,0.25)",
        }}
      >
        <p
          className="text-xs tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}
        >
          Session Complete
        </p>
        <p
          className="font-bold mb-2"
          style={{
            fontFamily: "var(--font-inter)",
            color: pct >= 80 ? "#22c55e" : pct >= 60 ? "#1E90FF" : "#ef4444",
            fontSize: "clamp(3rem, 10vw, 5rem)",
            lineHeight: 1,
          }}
        >
          {score}/{total}
        </p>
        <p
          className="text-sm mb-6"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
        >
          {message}
        </p>
        <button
          onClick={onRetry}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-50"
          style={{
            fontFamily: "var(--font-inter)",
            backgroundColor: "#1E90FF",
            color: "white",
          }}
        >
          {loading ? "Loading…" : "Try Again"}
        </button>
      </div>

      {/* Answer breakdown */}
      <p
        className="text-xs tracking-[0.2em] uppercase mb-4"
        style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}
      >
        Breakdown
      </p>
      <div className="space-y-3">
        {answers.map((a, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{
              background: a.correct
                ? "rgba(34,197,94,0.05)"
                : "rgba(239,68,68,0.05)",
              border: `1px solid ${a.correct ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="text-sm mt-0.5 flex-shrink-0"
                style={{ color: a.correct ? "#22c55e" : "#ef4444" }}
              >
                {a.correct ? "✓" : "✗"}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-snug mb-2"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.85)" }}
                >
                  {a.item.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      color: "rgba(204,204,204,0.5)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {a.item.source}
                  </span>
                  {!a.correct && (
                    <>
                      <span
                        className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: "var(--font-space-mono)",
                          color: "#ef4444",
                          backgroundColor: "rgba(239,68,68,0.08)",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                      >
                        You: {a.selected}
                      </span>
                      <span
                        className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: "var(--font-space-mono)",
                          color: "#22c55e",
                          backgroundColor: "rgba(34,197,94,0.08)",
                          border: "1px solid rgba(34,197,94,0.2)",
                        }}
                      >
                        Correct: {a.item.correctAnswer}
                      </span>
                    </>
                  )}
                  {a.correct && (
                    <span
                      className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        color: "#22c55e",
                        backgroundColor: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.2)",
                      }}
                    >
                      {a.item.correctAnswer}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-xs transition-opacity hover:opacity-100 opacity-60"
          style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
        >
          ← Back to Portal
        </Link>
      </div>
    </div>
  );
}
