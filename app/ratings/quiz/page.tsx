"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { RatingsTrainingItem } from "@/app/api/ratings-training/items/route";
import { markStepComplete } from "@/lib/progress";

const SESSION_SIZE = 10;

// ─── Options by question type ────────────────────────────────────────────────

const EXCHANGE_OPTIONS = [
  { value: "cfr", label: "✅  React — company correct, update CFR on profile", color: "green" as const },
  { value: "instruments", label: "✅  React — company correct, update CFR + instrument ratings", color: "blue" as const },
  { value: "remove", label: "⛔  React — wrong company / irrelevant, remove from profile", color: "red" as const },
];

const COVERAGE_OPTIONS = [
  { value: "publish", label: "✅  React — in coverage, publish to 9fin profile", color: "green" as const },
  { value: "ignore", label: "⛔  React — outside coverage (CLO, municipal, bank, etc.)", color: "red" as const },
];

const COLOR = {
  green: { idle: { bg: "rgba(34,197,94,0.07)", border: "rgba(34,197,94,0.22)", text: "rgba(134,239,172,0.9)" }, active: { bg: "rgba(34,197,94,0.14)", border: "rgba(34,197,94,0.55)", text: "#22c55e" } },
  blue:  { idle: { bg: "rgba(30,144,255,0.07)", border: "rgba(30,144,255,0.22)", text: "rgba(147,197,253,0.9)" }, active: { bg: "rgba(30,144,255,0.14)", border: "rgba(30,144,255,0.55)", text: "#1E90FF" } },
  red:   { idle: { bg: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.22)", text: "rgba(252,165,165,0.9)" }, active: { bg: "rgba(239,68,68,0.14)", border: "rgba(239,68,68,0.55)", text: "#ef4444" } },
};

type Phase = "start" | "question" | "complete";

interface Answer {
  item: RatingsTrainingItem;
  selected: string;
  correct: boolean;
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function RatingsQuiz() {
  const [phase, setPhase] = useState<Phase>("start");
  const [items, setItems] = useState<RatingsTrainingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const startSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ratings-training/items?count=${SESSION_SIZE}`);
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
      setAnswers((prev) => [...prev, { item: items[currentIndex], selected: option, correct }]);
    },
    [selectedAnswer, items, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= items.length) {
      setPhase("complete");
      markStepComplete("ratings", "training");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  }, [currentIndex, items]);

  const score = answers.filter((a) => a.correct).length;

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "#0A1628", overflowX: "clip" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(rgba(30,144,255,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 120% 55% at 50% -5%, rgba(15,60,180,0.5) 0%, transparent 65%)" }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b" style={{ backgroundColor: "rgba(10,22,40,0.75)", borderColor: "rgba(30,144,255,0.2)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/9fin-logo.png`} alt="9fin" width={80} height={32} className="object-contain rounded-lg" style={{ height: "auto" }} />
          </Link>
          <span className="text-xs tracking-[0.2em] uppercase hidden sm:block" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.55)" }}>
            Ratings · Training
          </span>
          <button
            onClick={() => setHelpOpen(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-opacity-60"
            style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.55)", borderColor: "rgba(30,144,255,0.2)", backgroundColor: "rgba(30,144,255,0.05)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Decision guide
          </button>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          {phase === "start" && <StartScreen loading={loading} onStart={startSession} onHelp={() => setHelpOpen(true)} />}
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
            <CompleteScreen answers={answers} score={score} total={items.length} onRetry={startSession} loading={loading} />
          )}
        </div>

        <footer className="text-center py-6 text-xs border-t" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)", borderColor: "rgba(30,144,255,0.1)" }}>
          9fin Onboarding © 2026
        </footer>
      </div>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

// ─── Start screen ─────────────────────────────────────────────────────────────

function StartScreen({ loading, onStart, onHelp }: { loading: boolean; onStart: () => void; onHelp: () => void }) {
  return (
    <div className="w-full max-w-lg text-center">
      <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8" style={{ borderColor: "rgba(30,144,255,0.35)", backgroundColor: "rgba(30,144,255,0.07)" }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1E90FF" }} />
        <span className="text-xs tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}>
          Ratings · Workflow Training
        </span>
      </div>

      <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-inter)", color: "white" }}>
        #ratings-news-events
      </h1>
      <p className="text-base leading-relaxed mb-8" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}>
        You&apos;ll be shown {SESSION_SIZE} real messages from the ratings feed — exactly as they appear in Slack.
        For each one, decide what action is required.
      </p>

      <div className="mb-8 text-left space-y-3">
        <div className="rounded-lg px-4 py-3" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
          <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(134,239,172,0.8)" }}>1 new exchange link detected</p>
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}>Article auto-published — verify company, check if CFR and/or instrument ratings need updating</p>
        </div>
        <div className="rounded-lg px-4 py-3" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <p className="text-xs font-semibold mb-1" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(252,165,165,0.8)" }}>No company found via entity linker</p>
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}>No match — decide whether to publish manually or ignore</p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onStart}
          disabled={loading}
          className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03] disabled:opacity-50"
          style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white", boxShadow: "0 0 36px rgba(30,144,255,0.35)" }}
        >
          {loading ? "Loading…" : "Begin Session"}
          {!loading && (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </button>
        <button
          onClick={onHelp}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-80"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)", border: "1px solid rgba(30,144,255,0.2)", backgroundColor: "rgba(30,144,255,0.05)" }}
        >
          Decision guide
        </button>
      </div>
    </div>
  );
}

// ─── Question screen ──────────────────────────────────────────────────────────

function QuestionScreen({ item, index, total, selectedAnswer, score, onAnswer, onNext }: {
  item: RatingsTrainingItem; index: number; total: number;
  selectedAnswer: string | null; score: number;
  onAnswer: (v: string) => void; onNext: () => void;
}) {
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === item.correctAnswer;
  const isLast = index + 1 === total;
  const options = item.slackType === "exchange-link" ? EXCHANGE_OPTIONS : COVERAGE_OPTIONS;

  return (
    <div className="w-full max-w-2xl">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}>
          Question {index + 1} of {total}
        </span>
        <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}>
          {score} correct
        </span>
      </div>
      <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ backgroundColor: "rgba(30,144,255,0.1)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%`, backgroundColor: "#1E90FF" }} />
      </div>

      {/* Slack message card */}
      <SlackMessage item={item} />

      {/* Question */}
      <p className="text-sm font-medium mb-4 mt-6" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.75)" }}>
        {item.slackType === "exchange-link"
          ? "This article has been auto-published. What action is required?"
          : "The system couldn't find a company match. What should you do?"}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-6">
        {options.map((opt) => {
          const isSelected = selectedAnswer === opt.value;
          const isCorrectOpt = opt.value === item.correctAnswer;
          const scheme = COLOR[opt.color];
          let bg = scheme.idle.bg;
          let border = scheme.idle.border;
          let color = scheme.idle.text;
          let opacity = "1";

          if (answered) {
            if (isCorrectOpt) { bg = scheme.active.bg; border = scheme.active.border; color = scheme.active.text; }
            else if (isSelected && !isCorrectOpt) { bg = COLOR.red.active.bg; border = COLOR.red.active.border; color = COLOR.red.active.text; }
            else { opacity = "0.25"; }
          }

          return (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              disabled={answered}
              className="rounded-xl px-5 py-3.5 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default"
              style={{ fontFamily: "var(--font-inter)", backgroundColor: bg, border: `1px solid ${border}`, color, opacity }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div
          className="rounded-xl px-5 py-4 mb-6"
          style={{
            backgroundColor: isCorrect ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
            border: `1px solid ${isCorrect ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-inter)", color: isCorrect ? "#22c55e" : "#ef4444" }}>
            {isCorrect ? "Correct" : "Not quite — see below"}
          </p>
          <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.65)" }}>
            {item.explanation}
          </p>
        </div>
      )}

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

// ─── Slack message mockup ─────────────────────────────────────────────────────

function SlackMessage({ item }: { item: RatingsTrainingItem }) {
  const isExchange = item.slackType === "exchange-link";

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Channel header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}
      >
        <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.35)" }}>
          #ratings-news-events
        </span>
      </div>

      {/* Message body */}
      <div className="flex gap-3 px-4 py-4">
        {/* Bot avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-base" style={{ backgroundColor: "rgba(30,144,255,0.12)", border: "1px solid rgba(30,144,255,0.2)" }}>
          🤖
        </div>

        <div className="flex-1 min-w-0">
          {/* Sender + time */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-bold" style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.85)" }}>
              ratings-bot
            </span>
            <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.3)" }}>
              Today at 2:18 PM
            </span>
          </div>

          {/* Message text */}
          {isExchange ? (
            <div>
              <p className="text-sm mb-1" style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)" }}>
                1 new exchange link detected
              </p>
              <p className="text-sm" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(147,197,253,0.85)" }}>
                <span className="font-bold">*{item.agency}*</span>
                {" "}
                <span style={{ color: "rgba(204,204,204,0.5)" }}>(*{item.articleId}*)</span>
              </p>
              {/* Article preview */}
              <div
                className="mt-3 pl-3 border-l-2"
                style={{ borderColor: "rgba(30,144,255,0.35)" }}
              >
                <p className="text-xs mb-0.5" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.35)" }}>
                  Article · published to {item.company}
                </p>
                <p className="text-sm leading-snug" style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.75)" }}>
                  {item.title}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-snug" style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.8)" }}>
                No company found via entity linker for:{" "}
                <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 500 }}>{item.title}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Complete screen ──────────────────────────────────────────────────────────

function answerLabel(answer: string): string {
  switch (answer) {
    case "cfr": return "✅ CFR update";
    case "instruments": return "✅ CFR + instruments";
    case "remove": return "⛔ Remove";
    case "publish": return "✅ Publish";
    case "ignore": return "⛔ Ignore";
    default: return answer;
  }
}

function CompleteScreen({ answers, score, total, onRetry, loading }: {
  answers: Answer[]; score: number; total: number; onRetry: () => void; loading: boolean;
}) {
  const pct = Math.round((score / total) * 100);
  const message =
    pct === 100 ? "Perfect — you know exactly how to action the ratings feed." :
    pct >= 80   ? "Strong result — solid workflow instincts." :
    pct >= 60   ? "Good effort — review the missed items and try again." :
                  "Keep practising — focus on each message type's decision path.";

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-2xl p-8 mb-8 text-center" style={{ background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)", border: "1px solid rgba(30,144,255,0.25)" }}>
        <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}>
          Session Complete
        </p>
        <p className="font-bold mb-2" style={{ fontFamily: "var(--font-inter)", color: pct >= 80 ? "#22c55e" : pct >= 60 ? "#1E90FF" : "#ef4444", fontSize: "clamp(3rem,10vw,5rem)", lineHeight: 1 }}>
          {score}/{total}
        </p>
        <p className="text-sm mb-6" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}>{message}</p>
        <button
          onClick={onRetry}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-50"
          style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white" }}
        >
          {loading ? "Loading…" : "Try Again"}
        </button>
      </div>

      <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}>
        Breakdown
      </p>
      <div className="space-y-3">
        {answers.map((a, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: a.correct ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)", border: `1px solid ${a.correct ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)"}` }}>
            <div className="flex items-start gap-3">
              <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: a.correct ? "#22c55e" : "#ef4444" }}>{a.correct ? "✓" : "✗"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs mb-1" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.35)" }}>
                  {a.item.slackType === "exchange-link" ? `exchange-link · ${a.item.agency} · *${a.item.articleId}*` : "no-company-found"}
                </p>
                <p className="text-sm leading-snug mb-2" style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.85)" }}>{a.item.title}</p>
                <div className="flex flex-wrap gap-2">
                  {!a.correct && (
                    <>
                      <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-space-mono)", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>You: {answerLabel(a.selected)}</span>
                      <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-space-mono)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>Correct: {answerLabel(a.item.correctAnswer)}</span>
                    </>
                  )}
                  {a.correct && (
                    <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-space-mono)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                      {answerLabel(a.item.correctAnswer)}{a.item.company ? ` · ${a.item.company}` : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-xs transition-opacity hover:opacity-100 opacity-60" style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}>
          ← Back to Portal
        </Link>
      </div>
    </div>
  );
}

// ─── Help modal with GREEN/RED flowcharts ─────────────────────────────────────

function HelpModal({ onClose }: { onClose: () => void }) {
  const [branch, setBranch] = useState<"green" | "red">("green");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden" style={{ backgroundColor: "#0d1f3c", border: "1px solid rgba(30,144,255,0.25)", maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(30,144,255,0.15)" }}>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-0.5" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}>Decision guide</p>
            <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-inter)", color: "white" }}>Ratings workflow</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: "rgba(204,204,204,0.45)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Branch tabs */}
        <div className="flex gap-2 px-5 pt-4 flex-shrink-0">
          {(["green", "red"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBranch(b)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                fontFamily: "var(--font-space-mono)",
                borderColor: branch === b ? (b === "green" ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)") : "rgba(255,255,255,0.1)",
                backgroundColor: branch === b ? (b === "green" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)") : "transparent",
                color: branch === b ? (b === "green" ? "#4ade80" : "#f87171") : "rgba(204,204,204,0.45)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch === b ? (b === "green" ? "#4ade80" : "#f87171") : "rgba(204,204,204,0.3)" }} />
              {b === "green" ? "Auto-published" : "Not auto-published"}
            </button>
          ))}
        </div>
        <p className="px-5 pt-2 pb-1 text-xs flex-shrink-0" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.4)" }}>
          {branch === "green" ? "Auto-published articles — follow top to bottom" : "Not auto-published articles — follow top to bottom"}
        </p>

        {/* Flowchart */}
        <div className="overflow-y-auto px-5 py-4">
          {branch === "green" ? <GreenFlowchart /> : <RedFlowchart />}
        </div>
      </div>
    </div>
  );
}

// ─── Green SVG flowchart ──────────────────────────────────────────────────────

function GreenFlowchart() {
  const SVG_W = 430;
  const dCX = 115; const dX = 15; const dW = 200; const dRX = 10;
  const oX = 240; const oW = 176; const oRX = 8; const oH = 58;
  const startY = 8; const startH = 36;
  const d1Y = 72; const d1H = 56;
  const d2Y = 178; const d2H = 56;
  const d3Y = 284; const d3H = 56;
  const actY = 384; const actH = 62;
  const d1CY = d1Y + d1H / 2;
  const d2CY = d2Y + d2H / 2;
  const d3CY = d3Y + d3H / 2;
  const SVG_H = actY + actH + 14;

  const spine = "rgba(30,144,255,0.35)";
  const dFill = "rgba(30,144,255,0.08)"; const dStroke = "rgba(30,144,255,0.28)"; const dText = "rgba(255,255,255,0.9)";
  const flFill = "rgba(249,115,22,0.12)"; const flStk = "rgba(249,115,22,0.5)"; const flTxt = "#fb923c";
  const acFill = "rgba(34,197,94,0.13)"; const acStk = "rgba(34,197,94,0.45)"; const acTxt = "#4ade80";
  const dnFill = "rgba(30,144,255,0.1)"; const dnStk = "rgba(30,144,255,0.4)"; const dnTxt = "#60a5fa";
  const yesClr = "#4ade80"; const noClr = "#f87171";
  const mono = "ui-monospace, monospace"; const sans = "ui-sans-serif, system-ui, sans-serif";

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" aria-label="Green branch decision flowchart">
      <defs>
        <marker id="arr-g" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill={spine} />
        </marker>
      </defs>

      <rect x={dX} y={startY} width={dW} height={startH} rx={startH / 2} fill={acFill} stroke={acStk} strokeWidth="1.5" />
      <text x={dCX} y={startY + 14} textAnchor="middle" fill={acTxt} fontSize="9.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">AUTO-PUBLISHED ARTICLE</text>
      <text x={dCX} y={startY + 27} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9.5" fontFamily={sans}>1 new exchange link detected</text>

      <line x1={dCX} y1={startY + startH} x2={dCX} y2={d1Y - 2} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-g)" />

      <rect x={dX} y={d1Y} width={dW} height={d1H} rx={dRX} fill={dFill} stroke={dStroke} strokeWidth="1.5" />
      <text x={dCX} y={d1Y + 22} textAnchor="middle" fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>Crawled to the</text>
      <text x={dCX} y={d1Y + 39} textAnchor="middle" fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>correct company?</text>

      <line x1={dX + dW} y1={d1CY} x2={oX - 3} y2={d1CY} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-g)" />
      <text x={dX + dW + 9} y={d1CY - 6} fill={noClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">NO</text>
      <rect x={oX} y={d1CY - oH / 2} width={oW} height={oH} rx={oRX} fill={flFill} stroke={flStk} strokeWidth="1.5" />
      <text x={oX + oW / 2} y={d1CY - 15} textAnchor="middle" fill={flTxt} fontSize="10" fontWeight="700" fontFamily={sans}>Remove article</text>
      <text x={oX + oW / 2} y={d1CY + 1} textAnchor="middle" fill={flTxt} fontSize="10" fontWeight="700" fontFamily={sans}>from profile</text>
      <text x={oX + oW / 2} y={d1CY + 18} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily={mono}>⛔ React in Slack</text>

      <line x1={dCX} y1={d1Y + d1H} x2={dCX} y2={d2Y - 2} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-g)" />
      <text x={dCX + 8} y={d1Y + d1H + 30} fill={yesClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">YES</text>

      <rect x={dX} y={d2Y} width={dW} height={d2H} rx={dRX} fill={dFill} stroke={dStroke} strokeWidth="1.5" />
      <text x={dCX} y={d2Y + 22} textAnchor="middle" fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>Debt instrument ratings</text>
      <text x={dCX} y={d2Y + 39} textAnchor="middle" fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>mentioned?</text>

      <line x1={dX + dW} y1={d2CY} x2={oX - 3} y2={d2CY} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-g)" />
      <text x={dX + dW + 9} y={d2CY - 6} fill={noClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">NO</text>
      <rect x={oX} y={d2CY - oH / 2} width={oW} height={oH} rx={oRX} fill={acFill} stroke={acStk} strokeWidth="1.5" />
      <text x={oX + oW / 2} y={d2CY - 15} textAnchor="middle" fill={acTxt} fontSize="10" fontWeight="700" fontFamily={sans}>Check CFR rating —</text>
      <text x={oX + oW / 2} y={d2CY + 1} textAnchor="middle" fill={acTxt} fontSize="10" fontWeight="700" fontFamily={sans}>update where necessary</text>
      <text x={oX + oW / 2} y={d2CY + 18} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily={mono}>✅ React in Slack</text>

      <line x1={dCX} y1={d2Y + d2H} x2={dCX} y2={d3Y - 2} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-g)" />
      <text x={dCX + 8} y={d2Y + d2H + 30} fill={yesClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">YES</text>

      <rect x={dX} y={d3Y} width={dW} height={d3H} rx={dRX} fill={dFill} stroke={dStroke} strokeWidth="1.5" />
      <text x={dCX} y={d3Y + 22} textAnchor="middle" fill={dText} fontSize="11.5" fontWeight="600" fontFamily={sans}>Check 9fin profile for</text>
      <text x={dCX} y={d3Y + 39} textAnchor="middle" fill={dText} fontSize="11.5" fontWeight="600" fontFamily={sans}>{`"in-market" instruments`}</text>

      <line x1={dX + dW} y1={d3CY} x2={oX - 3} y2={d3CY} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-g)" />
      <text x={dX + dW + 9} y={d3CY - 6} fill={noClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">NO</text>
      <rect x={oX} y={d3CY - oH / 2} width={oW} height={oH} rx={oRX} fill={dnFill} stroke={dnStk} strokeWidth="1.5" />
      <text x={oX + oW / 2} y={d3CY - 15} textAnchor="middle" fill={dnTxt} fontSize="10" fontWeight="700" fontFamily={sans}>All priced —</text>
      <text x={oX + oW / 2} y={d3CY + 1} textAnchor="middle" fill={dnTxt} fontSize="10" fontWeight="700" fontFamily={sans}>no action needed ✓</text>
      <text x={oX + oW / 2} y={d3CY + 18} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily={mono}>✅ React in Slack</text>

      <line x1={dCX} y1={d3Y + d3H} x2={dCX} y2={actY - 2} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-g)" />
      <text x={dCX + 8} y={d3Y + d3H + 30} fill={yesClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">YES</text>

      <rect x={dX} y={actY} width={dW} height={actH} rx={dRX} fill={acFill} stroke={acStk} strokeWidth="1.5" />
      <text x={dCX} y={actY + 16} textAnchor="middle" fill={acTxt} fontSize="12" fontWeight="700" fontFamily={sans}>✓ Update in-market</text>
      <text x={dCX} y={actY + 33} textAnchor="middle" fill={acTxt} fontSize="12" fontWeight="700" fontFamily={sans}>instrument ratings</text>
      <text x={dCX} y={actY + 51} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily={mono}>✅ React in Slack</text>
    </svg>
  );
}

// ─── Red SVG flowchart ────────────────────────────────────────────────────────

function RedFlowchart() {
  const SVG_W = 430;
  const dCX = 115; const dX = 15; const dW = 200; const dRX = 10;
  const oX = 240; const oW = 176; const oRX = 8;
  const startY = 8; const startH = 36;
  const d1Y = 72; const d1H = 90;
  const d1CY = d1Y + d1H / 2;
  const yesY = d1Y; const yesH = 108;
  const noBoxY = d1Y + d1H + 28; const noBoxH = 58;
  const SVG_H = noBoxY + noBoxH + 14;

  const spine = "rgba(30,144,255,0.35)";
  const dFill = "rgba(30,144,255,0.08)"; const dStroke = "rgba(30,144,255,0.28)"; const dText = "rgba(255,255,255,0.9)";
  const flFill = "rgba(249,115,22,0.12)"; const flStk = "rgba(249,115,22,0.5)"; const flTxt = "#fb923c";
  const acFill = "rgba(34,197,94,0.13)"; const acStk = "rgba(34,197,94,0.45)"; const acTxt = "#4ade80";
  const yesClr = "#4ade80"; const noClr = "#f87171";
  const mono = "ui-monospace, monospace"; const sans = "ui-sans-serif, system-ui, sans-serif";

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" aria-label="Red branch decision flowchart">
      <defs>
        <marker id="arr-r" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill={spine} />
        </marker>
      </defs>

      <rect x={dX} y={startY} width={dW} height={startH} rx={startH / 2} fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.45)" strokeWidth="1.5" />
      <text x={dCX} y={startY + 14} textAnchor="middle" fill="#f87171" fontSize="9.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">NOT AUTO-PUBLISHED</text>
      <text x={dCX} y={startY + 27} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9.5" fontFamily={sans}>No company found via entity linker</text>

      <line x1={dCX} y1={startY + startH} x2={dCX} y2={d1Y - 2} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-r)" />

      <rect x={dX} y={d1Y} width={dW} height={d1H} rx={dRX} fill={dFill} stroke={dStroke} strokeWidth="1.5" />
      <text x={dCX} y={d1Y + 24} textAnchor="middle" fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>Company in</text>
      <text x={dCX} y={d1Y + 40} textAnchor="middle" fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>9fin universe?</text>
      <line x1={dX + 16} y1={d1Y + 52} x2={dX + dW - 16} y2={d1Y + 52} stroke="rgba(30,144,255,0.18)" strokeWidth="1" />
      <text x={dCX} y={d1Y + 66} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily={sans}>Search all aliases in article</text>
      <text x={dCX} y={d1Y + 79} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9" fontFamily={sans}>on 9fin</text>

      <line x1={dX + dW} y1={d1CY} x2={oX - 3} y2={d1CY} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-r)" />
      <text x={dX + dW + 9} y={d1CY - 6} fill={yesClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">YES</text>

      <rect x={oX} y={yesY} width={oW} height={yesH} rx={oRX} fill={acFill} stroke={acStk} strokeWidth="1.5" />
      <text x={oX + oW / 2} y={yesY + 18} textAnchor="middle" fill={acTxt} fontSize="10" fontWeight="700" fontFamily={sans}>Post article to profile</text>
      <text x={oX + oW / 2} y={yesY + 34} textAnchor="middle" fill={acTxt} fontSize="10" fontWeight="700" fontFamily={sans}>Update rating on profile</text>
      <text x={oX + oW / 2} y={yesY + 50} textAnchor="middle" fill={acTxt} fontSize="10" fontWeight="700" fontFamily={sans}>Add alias on 9admin</text>
      <line x1={oX + 10} y1={yesY + 62} x2={oX + oW - 10} y2={yesY + 62} stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
      <text x={oX + oW / 2} y={yesY + 80} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily={mono}>✅ React in Slack</text>

      <line x1={dCX} y1={d1Y + d1H} x2={dCX} y2={noBoxY - 2} stroke={spine} strokeWidth="1.5" markerEnd="url(#arr-r)" />
      <text x={dCX + 8} y={d1Y + d1H + 18} fill={noClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">NO</text>

      <rect x={dX} y={noBoxY} width={dW} height={noBoxH} rx={dRX} fill={flFill} stroke={flStk} strokeWidth="1.5" />
      <text x={dCX} y={noBoxY + 22} textAnchor="middle" fill={flTxt} fontSize="12" fontWeight="700" fontFamily={sans}>Disregard</text>
      <text x={dCX} y={noBoxY + 40} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily={mono}>⛔ React in Slack</text>
    </svg>
  );
}
