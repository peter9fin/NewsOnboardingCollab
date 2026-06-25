"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import PageShell from "@/app/components/PageShell";
import Navbar from "@/app/components/Navbar";
import { saveTrainingAttempt, markStepComplete } from "@/lib/progress";
import allTrainingItems from "@/data/training-items.json";

interface TrainingItem {
  title: string;
  source: string;
  correctAnswer: string;
  triageOutcome: string;
  reasoning: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SESSION_SIZE = 10;

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

const OPTIONS = [
  { value: "Publish", label: "Publish", type: "publish" as const, desc: "Relevant and ready to go live" },
  { value: "Publish as Results Event", label: "Publish as Results Event", type: "publish" as const, desc: "Relevant earnings or results item" },
  { value: "Publish as Calendar Event", label: "Publish as Calendar Event", type: "publish" as const, desc: "Relevant scheduled financial event" },
  { value: "Irrelevant", label: "Irrelevant", type: "reject" as const, desc: "Not relevant to 9fin's coverage" },
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
  const [helpOpen, setHelpOpen] = useState(false);

  const startSession = useCallback(() => {
    const selected = shuffle(allTrainingItems as TrainingItem[]).slice(0, SESSION_SIZE);
    setItems(selected);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setPhase("question");
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
      const finalScore = answers.filter((a) => a.correct).length;
      saveTrainingAttempt(
        "9news",
        finalScore,
        items.length,
        answers.map((a) => ({
          articleTitle: a.item.title,
          source: a.item.source,
          userAnswer: a.selected,
          correctAnswer: a.item.correctAnswer,
          isCorrect: a.correct,
        }))
      );
      markStepComplete("9news", "training");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  }, [currentIndex, items, answers]);

  const score = answers.filter((a) => a.correct).length;

  return (
    <PageShell>
      <Navbar subtitle="9news · Training" />

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

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
            onHelp={() => setHelpOpen(true)}
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
    </PageShell>
  );
}

// ─── Help Modal ───────────────────────────────────────────────────────────────

function HelpModal({ onClose }: { onClose: () => void }) {
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
            <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-inter)", color: "white" }}>
              Triage Decision Flow
            </h2>
            <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}>
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
                    style={{ backgroundColor: "rgba(30,144,255,0.15)", border: "1px solid rgba(30,144,255,0.3)", color: "#1E90FF" }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-snug" style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.85)" }}>
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
                          fontFamily: "var(--font-space-mono)",
                          color: exitOnYes ? "#22c55e" : "#ef4444",
                          backgroundColor: exitOnYes ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        }}
                      >
                        {exitOnYes ? "YES" : "NO"}
                      </span>
                      <div
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                        style={{
                          fontFamily: "var(--font-inter)",
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
                          fontFamily: "var(--font-space-mono)",
                          color: exitOnYes ? "#ef4444" : "#22c55e",
                          backgroundColor: exitOnYes ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                        }}
                      >
                        {exitOnYes ? "NO" : "YES"}
                      </span>
                      <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.4)" }}>
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
              style={{ fontFamily: "var(--font-inter)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}
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

// ─── Start Screen ─────────────────────────────────────────────────────────────

function StartScreen({ loading, onStart }: { loading: boolean; onStart: () => void }) {
  return (
    <div className="w-full max-w-lg text-center">
      <div
        className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
        style={{ borderColor: "rgba(30, 144, 255, 0.35)", backgroundColor: "rgba(30, 144, 255, 0.07)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1E90FF" }} />
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
        You&apos;ll be shown {SESSION_SIZE} real news headlines. For each one,
        decide how it should be triaged. Your answers will be compared against
        actual editorial decisions.
      </p>

      <div className="mb-10 text-left space-y-2">
        {OPTIONS.map((opt) => (
          <div
            key={opt.value}
            className="rounded-lg px-4 py-3 flex items-center gap-3"
            style={{
              background: opt.type === "publish" ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
              border: `1px solid ${opt.type === "publish" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: opt.type === "publish" ? "#22c55e" : "#ef4444" }}
            />
            <div>
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-inter)", color: opt.type === "publish" ? "rgba(134,239,172,0.9)" : "rgba(252,165,165,0.9)" }}
              >
                {opt.label}
              </p>
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.45)" }}
              >
                {opt.desc}
              </p>
            </div>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
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
  onHelp,
}: {
  item: TrainingItem;
  index: number;
  total: number;
  selectedAnswer: string | null;
  score: number;
  onAnswer: (option: string) => void;
  onNext: () => void;
  onHelp: () => void;
}) {
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === item.correctAnswer;
  const isLast = index + 1 === total;

  return (
    <div className="w-full max-w-2xl">
      {/* Progress row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}
        >
          Question {index + 1} of {total}
        </span>
        <div className="flex items-center gap-3">
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}
          >
            {score} correct
          </span>
          <button
            onClick={onHelp}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors hover:bg-[rgba(30,144,255,0.12)]"
            style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF", border: "1px solid rgba(30,144,255,0.25)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Decision Guide
          </button>
        </div>
      </div>

      {/* Progress bar */}
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
        className="rounded-xl p-6 mb-5"
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
          className="rounded-xl px-5 py-4 mb-5"
          style={{
            backgroundColor: isCorrect ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${isCorrect ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <span style={{ fontSize: "16px" }}>{isCorrect ? "✓" : "✗"}</span>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-inter)", color: isCorrect ? "#22c55e" : "#ef4444" }}
              >
                {isCorrect ? "Correct!" : "Not quite"}
              </p>
              {!isCorrect && (
                <p
                  className="text-xs mt-0.5"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
                >
                  The correct answer was{" "}
                  <span style={{ color: "white", fontWeight: 600 }}>{item.correctAnswer}</span>
                </p>
              )}
            </div>
          </div>
          {item.reasoning && (
            <p
              className="text-xs leading-relaxed pt-2"
              style={{
                fontFamily: "var(--font-inter)",
                color: "rgba(204,204,204,0.65)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {item.reasoning}
            </p>
          )}
        </div>
      )}

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {OPTIONS.map((opt) => (
          <AnswerButton
            key={opt.value}
            opt={opt}
            answered={answered}
            selectedAnswer={selectedAnswer}
            correctAnswer={item.correctAnswer}
            onAnswer={onAnswer}
          />
        ))}
      </div>

      {/* Next button */}
      {answered && (
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white" }}
          >
            {isLast ? "See Results" : "Next"}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Answer Button ────────────────────────────────────────────────────────────

function AnswerButton({
  opt,
  answered,
  selectedAnswer,
  correctAnswer,
  onAnswer,
}: {
  opt: { value: string; label: string; type: "publish" | "reject" };
  answered: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
  onAnswer: (v: string) => void;
}) {
  const isSelected = selectedAnswer === opt.value;
  const isCorrectOpt = opt.value === correctAnswer;

  const defaultBg = opt.type === "publish" ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)";
  const defaultBorder = opt.type === "publish" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)";
  const defaultColor = opt.type === "publish" ? "rgba(134,239,172,0.85)" : "rgba(252,165,165,0.85)";

  let bg = defaultBg;
  let border = defaultBorder;
  let color = defaultColor;
  let opacity = "1";

  if (answered) {
    if (isCorrectOpt) {
      bg = "rgba(34,197,94,0.12)";
      border = "rgba(34,197,94,0.5)";
      color = "#22c55e";
    } else if (isSelected) {
      bg = "rgba(239,68,68,0.12)";
      border = "rgba(239,68,68,0.5)";
      color = "#ef4444";
    } else {
      opacity = "0.3";
    }
  }

  return (
    <button
      onClick={() => onAnswer(opt.value)}
      disabled={answered}
      className="rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default"
      style={{ fontFamily: "var(--font-inter)", backgroundColor: bg, border: `1px solid ${border}`, color, opacity }}
      onMouseEnter={(e) => {
        if (!answered) e.currentTarget.style.borderColor = opt.type === "publish" ? "rgba(34,197,94,0.45)" : "rgba(239,68,68,0.45)";
      }}
      onMouseLeave={(e) => {
        if (!answered) e.currentTarget.style.borderColor = defaultBorder;
      }}
    >
      {opt.label}
    </button>
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
    pct === 100 ? "Perfect score — outstanding triage instincts." :
    pct >= 80 ? "Strong result — you have a solid grasp of the workflow." :
    pct >= 60 ? "Good effort — review the missed items below and try again." :
    "Keep practising — focus on the patterns in the missed items below.";

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
          style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white" }}
        >
          {loading ? "Loading…" : "Try Again"}
        </button>
      </div>

      {/* Breakdown */}
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
              background: a.correct ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
              border: `1px solid ${a.correct ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: a.correct ? "#22c55e" : "#ef4444" }}>
                {a.correct ? "✓" : "✗"}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-snug mb-2"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.85)" }}
                >
                  {a.item.title}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                    style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.5)", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {a.item.source}
                  </span>
                  {!a.correct && (
                    <>
                      <span
                        className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                        style={{ fontFamily: "var(--font-space-mono)", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                      >
                        You: {a.selected}
                      </span>
                      <span
                        className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                        style={{ fontFamily: "var(--font-space-mono)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                      >
                        Correct: {a.item.correctAnswer}
                      </span>
                    </>
                  )}
                  {a.correct && (
                    <span
                      className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                      style={{ fontFamily: "var(--font-space-mono)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                    >
                      {a.item.correctAnswer}
                    </span>
                  )}
                </div>
                {a.item.reasoning && (
                  <p
                    className="text-xs leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}
                  >
                    {a.item.reasoning}
                  </p>
                )}
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
