"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  {
    question: "A credit rating is best described as:",
    options: [
      "A guarantee that the issuer will not default",
      "A recommendation to buy or sell a bond",
      "An opinion on the issuer's creditworthiness",
      "A measure of a company's overall financial performance",
    ],
    correct: 2,
    explanation:
      "A credit rating is an opinion on creditworthiness — not a recommendation, price, or guarantee. Agencies assess how likely an issuer is to meet its debt obligations, but they are not liable if a default occurs.",
  },
  {
    question: "Which of the following best describes what credit ratings measure?",
    options: [
      "Probability of default and loss severity if default occurs",
      "Only the probability that an issuer will default",
      "The issuer's overall financial performance and stock price outlook",
      "The total debt outstanding on a company's balance sheet",
    ],
    correct: 0,
    explanation:
      "Ratings capture two dimensions: the probability that an issuer defaults, and the likely recovery (loss severity) if it does. Moody's explicitly weights both; S&P and Fitch focus more heavily on default probability.",
  },
  {
    question: "Which agency's methodology emphasises expected loss (probability × severity) rather than focusing primarily on probability of default?",
    options: [
      "Fitch",
      "Moody's",
      "S&P Global",
      "All three agencies use the same methodology",
    ],
    correct: 1,
    explanation:
      "Moody's methodology is built around expected loss — the product of default probability and loss given default. S&P and Fitch focus more on probability of default, which is why the same issuer can carry different ratings across agencies.",
  },
  {
    question: "Which of the following is the lowest investment grade rating?",
    options: [
      "BBB+ / Baa1",
      "BB+ / Ba1",
      "BBB− / Baa3",
      "B+ / B1",
    ],
    correct: 2,
    explanation:
      "BBB− (S&P/Fitch) and Baa3 (Moody's) are the lowest investment grade notches. One step below — BB+ / Ba1 — is the top of high yield. The BBB− / Baa3 line is the most consequential boundary in credit markets.",
  },
  {
    question: "A 'fallen angel' refers to:",
    options: [
      "An issuer downgraded from investment grade into high yield",
      "An issuer that has missed an interest payment for the first time",
      "An issuer whose rating has been withdrawn by the agency",
      "A high yield issuer upgraded back to investment grade",
    ],
    correct: 0,
    explanation:
      "A fallen angel is an investment grade issuer downgraded into high yield. Many institutional funds are mandated to hold only IG paper, so a downgrade forces selling regardless of fundamentals — often causing sharp price dislocations. The reverse (HY upgraded to IG) is called a rising star.",
  },
  {
    question: "The key difference between an Outlook and a Watch / Under Review is:",
    options: [
      "Outlooks are only issued by Moody's; Watches are only issued by S&P and Fitch",
      "Outlooks apply to instruments; Watches apply to issuers",
      "Outlooks reflect a longer 12–24 month view, while Watches signal likely action within ~90 days tied to a specific catalyst",
      "They are different names for the same thing across agencies",
    ],
    correct: 2,
    explanation:
      "An Outlook (Stable, Positive, Negative, Developing) signals the likely direction of a rating over 12–24 months. A Watch / Under Review (S&P: CreditWatch, Moody's: Under Review, Fitch: Rating Watch) signals imminent action — typically within 90 days — tied to a specific event such as an M&A deal or earnings miss.",
  },
  {
    question: "On a 9fin company profile, the Corporate Family Rating (CFR) refers to:",
    options: [
      "An average of all instrument ratings outstanding for the issuer",
      "The issuer-level rating reflecting the agency's view of the whole company",
      "The rating on the company's most recently issued bond",
      "A composite rating combining all three agency opinions",
    ],
    correct: 1,
    explanation:
      "The CFR is the issuer-level rating — the agency's view of the company as a whole. It sits above individual instrument ratings on a 9fin profile. A senior secured bond can rate above the CFR; a subordinated note can rate below it — same company, different tier.",
  },
  {
    question: "Why is the 15-minute publication SLA important for ratings on 9fin?",
    options: [
      "Because clients are making real-time decisions on price-moving information",
      "Because rating agencies require it contractually",
      "Because ratings expire if not republished within 15 minutes",
      "Because it is a regulatory requirement under MiFID II",
    ],
    correct: 0,
    explanation:
      "A new rating action is price-moving information. Distressed-debt analysts, HY portfolio managers, and credit research teams use 9fin as a single source of truth and make real-time decisions on rating moves. A stale or delayed rating on a profile means clients can't price risk accurately.",
  },
];

type Phase = "start" | "quiz" | "complete";

export default function RatingsQuizPage() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ correct: boolean; selected: number }[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);

  const question = QUESTIONS[currentIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === question?.correct;
  const score = answers.filter((a) => a.correct).length;

  const handleSelect = (i: number) => {
    if (isAnswered) return;
    setSelected(i);
  };

  const handleNext = () => {
    if (selected === null) return;
    const updated = [...answers, { correct: selected === question.correct, selected }];
    setAnswers(updated);

    if (currentIndex + 1 >= QUESTIONS.length) {
      setPhase("complete");
    } else {
      setCurrentIndex((c) => c + 1);
      setSelected(null);
    }
  };

  const handleRetry = () => {
    setPhase("start");
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-x-hidden"
      style={{ backgroundColor: "#0A1628" }}
    >
      {/* Background: dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(30, 144, 255, 0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Background: blue glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 120% 55% at 50% -5%, rgba(15, 60, 180, 0.5) 0%, transparent 65%)",
        }}
      />

      {/* Decision guide modal */}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b"
          style={{ backgroundColor: "#0A1628", borderColor: "rgba(30, 144, 255, 0.2)" }}
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
            style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.55)" }}
          >
            Onboarding Portal
          </span>
        </nav>

        <div className="flex-1 flex flex-col px-6 py-10 max-w-2xl mx-auto w-full">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-8">
            <Link
              href="/ratings"
              className="text-xs transition-opacity hover:opacity-100 opacity-60 inline-flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Ratings
            </Link>
            <span className="text-xs" style={{ color: "rgba(204,204,204,0.3)" }}>/</span>
            <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.6)" }}>
              Test Your Knowledge
            </span>
          </nav>

          {/* START */}
          {phase === "start" && (
            <div className="flex-1 flex flex-col justify-center">
              <div
                className="rounded-2xl p-10 text-center"
                style={{
                  background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                  border: "1px solid rgba(30,144,255,0.28)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    backgroundColor: "rgba(30,144,255,0.1)",
                    border: "1px solid rgba(30,144,255,0.2)",
                    color: "#1E90FF",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <span
                  className="inline-block text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full mb-4"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "#1E90FF",
                    backgroundColor: "rgba(30,144,255,0.1)",
                    border: "1px solid rgba(30,144,255,0.2)",
                  }}
                >
                  Ratings
                </span>
                <h1
                  className="text-2xl font-bold tracking-tight mb-3"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  Test Your Knowledge
                </h1>
                <p
                  className="text-sm leading-relaxed mb-8 max-w-sm mx-auto"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.65)" }}
                >
                  8 questions covering credit ratings, agency methodology, the rating scale, outlooks, and how ratings appear on 9fin.
                </p>
                <button
                  onClick={() => setPhase("quiz")}
                  className="inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    backgroundColor: "#1E90FF",
                    color: "white",
                    boxShadow: "0 0 32px rgba(30,144,255,0.3)",
                  }}
                >
                  Start Quiz
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {phase === "quiz" && (
            <div className="flex-1 flex flex-col">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}>
                    Question {currentIndex + 1} of {QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}>
                      {answers.filter((a) => a.correct).length} correct
                    </span>
                    <button
                      onClick={() => setHelpOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors hover:bg-[rgba(30,144,255,0.12)]"
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        color: "#1E90FF",
                        border: "1px solid rgba(30,144,255,0.25)",
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Decision Guide
                    </button>
                  </div>
                </div>
                <div className="w-full rounded-full h-1" style={{ backgroundColor: "rgba(30,144,255,0.12)" }}>
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ width: `${((currentIndex) / QUESTIONS.length) * 100}%`, backgroundColor: "#1E90FF" }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div
                className="rounded-2xl p-8 mb-5 flex-shrink-0"
                style={{
                  background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                  border: "1px solid rgba(30,144,255,0.22)",
                }}
              >
                <p
                  className="text-base font-semibold leading-snug"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {question.question}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3 mb-6">
                {question.options.map((opt, i) => {
                  let borderColor = "rgba(30,144,255,0.18)";
                  let bg = "rgba(14,35,69,0.6)";
                  let textColor = "rgba(204,204,204,0.85)";
                  let indicator = null;

                  if (isAnswered) {
                    if (i === question.correct) {
                      borderColor = "rgba(34,197,94,0.6)";
                      bg = "rgba(34,197,94,0.08)";
                      textColor = "#22c55e";
                      indicator = (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      );
                    } else if (i === selected) {
                      borderColor = "rgba(239,68,68,0.6)";
                      bg = "rgba(239,68,68,0.08)";
                      textColor = "#ef4444";
                      indicator = (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      );
                    } else {
                      borderColor = "rgba(30,144,255,0.1)";
                      bg = "rgba(14,35,69,0.3)";
                      textColor = "rgba(204,204,204,0.35)";
                    }
                  } else if (selected === i) {
                    borderColor = "rgba(30,144,255,0.6)";
                    bg = "rgba(30,144,255,0.1)";
                    textColor = "white";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={isAnswered}
                      className="w-full text-left rounded-xl px-5 py-4 flex items-center justify-between gap-3 transition-all duration-200"
                      style={{
                        border: `1px solid ${borderColor}`,
                        backgroundColor: bg,
                        cursor: isAnswered ? "default" : "pointer",
                      }}
                    >
                      <span className="text-sm leading-snug" style={{ fontFamily: "var(--font-inter)", color: textColor }}>
                        {opt}
                      </span>
                      {indicator}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isAnswered && (
                <div
                  className="rounded-xl px-5 py-4 mb-6"
                  style={{
                    backgroundColor: isCorrect ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
                    border: `1px solid ${isCorrect ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ fontFamily: "var(--font-inter)", color: isCorrect ? "#22c55e" : "#ef4444" }}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.75)" }}>
                    {question.explanation}
                  </p>
                </div>
              )}

              {/* Next button */}
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="self-end inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110"
                  style={{
                    fontFamily: "var(--font-inter)",
                    backgroundColor: "#1E90FF",
                    color: "white",
                    boxShadow: "0 0 24px rgba(30,144,255,0.25)",
                  }}
                >
                  {currentIndex + 1 >= QUESTIONS.length ? "See Results" : "Next Question"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* COMPLETE */}
          {phase === "complete" && (
            <div className="flex-1 flex flex-col justify-center">
              <div
                className="rounded-2xl p-10 text-center mb-6"
                style={{
                  background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                  border: "1px solid rgba(30,144,255,0.28)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    backgroundColor: score >= 6 ? "rgba(34,197,94,0.1)" : "rgba(30,144,255,0.1)",
                    border: `1px solid ${score >= 6 ? "rgba(34,197,94,0.25)" : "rgba(30,144,255,0.2)"}`,
                    color: score >= 6 ? "#22c55e" : "#1E90FF",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <h2
                  className="text-2xl font-bold tracking-tight mb-2"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {score >= 6 ? "Well done!" : "Keep practising"}
                </h2>
                <p className="text-sm mb-2" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}>
                  You scored
                </p>
                <p
                  className="text-5xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-inter)", color: score >= 6 ? "#22c55e" : "#1E90FF" }}
                >
                  {score}/{QUESTIONS.length}
                </p>
                <p className="text-xs mb-8" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}>
                  {Math.round((score / QUESTIONS.length) * 100)}% correct
                </p>

                {/* Per-question breakdown */}
                <div className="flex justify-center gap-2 flex-wrap mb-8">
                  {answers.map((a, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: a.correct ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                        border: `1px solid ${a.correct ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                        color: a.correct ? "#22c55e" : "#ef4444",
                        fontFamily: "var(--font-space-mono)",
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/presentations/ratings-101"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110"
                    style={{ fontFamily: "var(--font-inter)", backgroundColor: "rgba(30,144,255,0.12)", color: "#1E90FF", border: "1px solid rgba(30,144,255,0.25)" }}
                  >
                    Review Presentation
                  </Link>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110"
                    style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white", boxShadow: "0 0 24px rgba(30,144,255,0.25)" }}
                  >
                    Try Again
                  </button>
                </div>
              </div>

              <Link
                href="/ratings"
                className="text-center text-xs transition-opacity hover:opacity-100 opacity-50 py-2"
                style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
              >
                ← Back to Ratings
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
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

// ─── Help Modal ───────────────────────────────────────────────────────────────

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
          border: "1px solid rgba(30,144,255,0.25)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: "rgba(30,144,255,0.15)" }}
        >
          <div>
            <h2 className="text-base font-bold" style={{ fontFamily: "var(--font-inter)", color: "white" }}>
              Article Decision Guide
            </h2>
            <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}>
              Auto-published articles — follow top to bottom
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] tracking-wide px-2 py-1 rounded-full"
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
              GREEN
            </span>
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
        </div>

        {/* Flowchart */}
        <div className="overflow-y-auto px-5 py-6">
          <DecisionFlowchart />
        </div>
      </div>
    </div>
  );
}

// ─── SVG Flowchart ────────────────────────────────────────────────────────────

function DecisionFlowchart() {
  // ── Layout constants ──────────────────────────────────────────────────────
  const SVG_W = 430;

  // Decision boxes (left column, centered at cx=115)
  const dCX = 115;
  const dX = 15;
  const dW = 200;
  const dRX = 10;

  // Outcome boxes (right column)
  const oX = 240;
  const oW = 176;
  const oRX = 8;
  const oH = 40;

  // Row Y positions
  const startY = 8;  const startH = 36;
  const d1Y    = 72; const d1H   = 56;
  const d2Y    = 178; const d2H  = 56;
  const d3Y    = 284; const d3H  = 56;
  const actY   = 384; const actH = 48;

  const d1CY = d1Y + d1H / 2;   // 100
  const d2CY = d2Y + d2H / 2;   // 206
  const d3CY = d3Y + d3H / 2;   // 312

  const SVG_H = actY + actH + 14;  // 446

  // ── Colours ───────────────────────────────────────────────────────────────
  const spine   = "rgba(30,144,255,0.35)";
  const dFill   = "rgba(30,144,255,0.08)";
  const dStroke = "rgba(30,144,255,0.28)";
  const dText   = "rgba(255,255,255,0.9)";

  // Outcome: flag (orange)
  const flFill  = "rgba(249,115,22,0.12)";
  const flStk   = "rgba(249,115,22,0.5)";
  const flTxt   = "#fb923c";

  // Outcome: done (blue)
  const dnFill  = "rgba(30,144,255,0.1)";
  const dnStk   = "rgba(30,144,255,0.4)";
  const dnTxt   = "#60a5fa";

  // Outcome: action (green)
  const acFill  = "rgba(34,197,94,0.13)";
  const acStk   = "rgba(34,197,94,0.45)";
  const acTxt   = "#4ade80";

  // YES / NO label colours
  const yesClr  = "#4ade80";
  const noClr   = "#f87171";

  // Shared text props
  const mono = "ui-monospace, monospace";
  const sans = "ui-sans-serif, system-ui, sans-serif";

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width="100%"
      aria-label="Ratings article decision flowchart"
    >
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill={spine} />
        </marker>
      </defs>

      {/* ── START bubble ─────────────────────────────────────────────── */}
      <rect x={dX} y={startY} width={dW} height={startH} rx={startH / 2}
        fill={acFill} stroke={acStk} strokeWidth="1.5" />
      <text x={dCX} y={startY + 14} textAnchor="middle"
        fill={acTxt} fontSize="9.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">
        AUTO-PUBLISHED ARTICLE
      </text>
      <text x={dCX} y={startY + 27} textAnchor="middle"
        fill="rgba(255,255,255,0.45)" fontSize="9.5" fontFamily={sans}>
        received in Slack feed
      </text>

      {/* start → D1 */}
      <line x1={dCX} y1={startY + startH} x2={dCX} y2={d1Y - 2}
        stroke={spine} strokeWidth="1.5" markerEnd="url(#arr)" />

      {/* ── DECISION 1 ───────────────────────────────────────────────── */}
      <rect x={dX} y={d1Y} width={dW} height={d1H} rx={dRX}
        fill={dFill} stroke={dStroke} strokeWidth="1.5" />
      <text x={dCX} y={d1Y + 22} textAnchor="middle"
        fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>
        Crawled to the
      </text>
      <text x={dCX} y={d1Y + 39} textAnchor="middle"
        fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>
        correct company?
      </text>

      {/* D1 NO → flag outcome */}
      <line x1={dX + dW} y1={d1CY} x2={oX - 3} y2={d1CY}
        stroke={spine} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x={dX + dW + 9} y={d1CY - 6}
        fill={noClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">
        NO
      </text>
      {/* flag box */}
      <rect x={oX} y={d1CY - oH / 2} width={oW} height={oH} rx={oRX}
        fill={flFill} stroke={flStk} strokeWidth="1.5" />
      <text x={oX + oW / 2} y={d1CY - 7} textAnchor="middle"
        fill={flTxt} fontSize="10" fontWeight="700" fontFamily={sans}>
        Remove article
      </text>
      <text x={oX + oW / 2} y={d1CY + 9} textAnchor="middle"
        fill={flTxt} fontSize="10" fontWeight="700" fontFamily={sans}>
        from profile
      </text>

      {/* D1 YES → D2 */}
      <line x1={dCX} y1={d1Y + d1H} x2={dCX} y2={d2Y - 2}
        stroke={spine} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x={dCX + 8} y={d1Y + d1H + 30}
        fill={yesClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">
        YES
      </text>

      {/* ── DECISION 2 ───────────────────────────────────────────────── */}
      <rect x={dX} y={d2Y} width={dW} height={d2H} rx={dRX}
        fill={dFill} stroke={dStroke} strokeWidth="1.5" />
      <text x={dCX} y={d2Y + 22} textAnchor="middle"
        fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>
        Debt instrument ratings
      </text>
      <text x={dCX} y={d2Y + 39} textAnchor="middle"
        fill={dText} fontSize="12" fontWeight="600" fontFamily={sans}>
        mentioned?
      </text>

      {/* D2 NO → done outcome */}
      <line x1={dX + dW} y1={d2CY} x2={oX - 3} y2={d2CY}
        stroke={spine} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x={dX + dW + 9} y={d2CY - 6}
        fill={noClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">
        NO
      </text>
      {/* check CFR box */}
      <rect x={oX} y={d2CY - oH / 2} width={oW} height={oH} rx={oRX}
        fill={acFill} stroke={acStk} strokeWidth="1.5" />
      <text x={oX + oW / 2} y={d2CY - 7} textAnchor="middle"
        fill={acTxt} fontSize="10" fontWeight="700" fontFamily={sans}>
        Check CFR rating —
      </text>
      <text x={oX + oW / 2} y={d2CY + 9} textAnchor="middle"
        fill={acTxt} fontSize="10" fontWeight="700" fontFamily={sans}>
        update where necessary
      </text>

      {/* D2 YES → D3 */}
      <line x1={dCX} y1={d2Y + d2H} x2={dCX} y2={d3Y - 2}
        stroke={spine} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x={dCX + 8} y={d2Y + d2H + 30}
        fill={yesClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">
        YES
      </text>

      {/* ── DECISION 3 ───────────────────────────────────────────────── */}
      <rect x={dX} y={d3Y} width={dW} height={d3H} rx={dRX}
        fill={dFill} stroke={dStroke} strokeWidth="1.5" />
      <text x={dCX} y={d3Y + 22} textAnchor="middle"
        fill={dText} fontSize="11.5" fontWeight="600" fontFamily={sans}>
        Check 9fin profile for
      </text>
      <text x={dCX} y={d3Y + 39} textAnchor="middle"
        fill={dText} fontSize="11.5" fontWeight="600" fontFamily={sans}>
        {`"in-market" instruments`}
      </text>

      {/* D3 NO → done outcome */}
      <line x1={dX + dW} y1={d3CY} x2={oX - 3} y2={d3CY}
        stroke={spine} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x={dX + dW + 9} y={d3CY - 6}
        fill={noClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">
        NO
      </text>
      {/* done box */}
      <rect x={oX} y={d3CY - oH / 2} width={oW} height={oH} rx={oRX}
        fill={dnFill} stroke={dnStk} strokeWidth="1.5" />
      <text x={oX + oW / 2} y={d3CY - 7} textAnchor="middle"
        fill={dnTxt} fontSize="10" fontWeight="700" fontFamily={sans}>
        All priced —
      </text>
      <text x={oX + oW / 2} y={d3CY + 9} textAnchor="middle"
        fill={dnTxt} fontSize="10" fontWeight="700" fontFamily={sans}>
        no action needed ✓
      </text>

      {/* D3 YES → action */}
      <line x1={dCX} y1={d3Y + d3H} x2={dCX} y2={actY - 2}
        stroke={spine} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x={dCX + 8} y={d3Y + d3H + 30}
        fill={yesClr} fontSize="8.5" fontWeight="700" fontFamily={mono} letterSpacing="0.12em">
        YES
      </text>

      {/* ── ACTION outcome ────────────────────────────────────────────── */}
      <rect x={dX} y={actY} width={dW} height={actH} rx={dRX}
        fill={acFill} stroke={acStk} strokeWidth="1.5" />
      <text x={dCX} y={actY + 18} textAnchor="middle"
        fill={acTxt} fontSize="12" fontWeight="700" fontFamily={sans}>
        ✓ Update in-market
      </text>
      <text x={dCX} y={actY + 35} textAnchor="middle"
        fill={acTxt} fontSize="12" fontWeight="700" fontFamily={sans}>
        instrument ratings
      </text>
    </svg>
  );
}
