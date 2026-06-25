"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/app/components/PageShell";
import Navbar from "@/app/components/Navbar";

const QUESTIONS = [
  {
    question: "What's the key difference between investment grade and high yield debt?",
    options: [
      "IG has lower risk, tighter spreads and stronger balance sheets; HY has higher leverage and higher yields",
      "IG companies pay higher coupons; HY companies have lower default risk",
      "IG bonds are only issued by governments; HY bonds are issued by banks",
      "There is no meaningful difference in risk between the two",
    ],
    correct: 0,
    explanation: "Investment grade issuers have stronger balance sheets, lower default probability and tighter credit spreads. High yield issuers carry higher leverage, pay higher coupons and are more sensitive to economic cycles.",
  },
  {
    question: "What typically causes a company to become financially distressed?",
    options: [
      "Excessive cash reserves and strong free cash flow",
      "Being upgraded from high yield to investment grade",
      "High leverage, rising rates, weak earnings, liquidity shortages or maturity walls",
      "Having too many equity investors on the register",
    ],
    correct: 2,
    explanation: "Financial distress is triggered by a combination of factors: debt load exceeding earnings capacity, rising floating rate costs, declining EBITDA, insufficient cash to meet obligations, or a concentration of debt maturities coming due simultaneously.",
  },
  {
    question: "What does it mean when a bond trades below ~80 cents on the dollar?",
    options: [
      "The bond is performing well and is in high demand",
      "The bond is in investment grade territory",
      "The bond has just been issued at a discount",
      "The bond is in distressed territory — restructuring or default risk is elevated",
    ],
    correct: 3,
    explanation: "Bonds trading below ~80¢ on the dollar are considered distressed. At this level, specialist buyers (hedge funds, distressed investors) take over and pricing is driven by recovery value rather than yield.",
  },
  {
    question: "Who sits at the top of the capital structure waterfall and gets paid first?",
    options: [
      "Equity holders",
      "Senior Unsecured bondholders",
      "Super Senior lenders (e.g. the RCF)",
      "Subordinated / PIK debt holders",
    ],
    correct: 2,
    explanation: "The capital structure waterfall runs: Super Senior → Senior Secured 1st Lien → Senior Secured 2nd Lien → Senior Unsecured → Subordinated/PIK → Equity. Super Senior (typically the revolving credit facility) has the highest priority claim.",
  },
  {
    question: "What is usually wiped out first in a restructuring?",
    options: [
      "Senior Secured lenders",
      "Super Senior lenders",
      "Equity",
      "Senior Unsecured bondholders",
    ],
    correct: 2,
    explanation: "Equity is last in the waterfall — it only receives value after all debt claims are satisfied. In most restructurings, existing equity holders are fully wiped out as creditors convert their debt into new equity.",
  },
  {
    question: "What does the term 'fallen angel' refer to?",
    options: [
      "A distressed company that successfully completes a restructuring",
      "An investment grade issuer that is downgraded into high yield or distressed territory",
      "A high yield issuer that is upgraded to investment grade",
      "A company that files for Chapter 11 bankruptcy protection",
    ],
    correct: 1,
    explanation: "A fallen angel is an investment grade issuer whose credit rating is downgraded into high yield (or further into distressed). This forces many institutional IG investors to sell the bonds, often causing sharp price dislocations.",
  },
  {
    question: "Why is debt generally cheaper than equity as a source of funding for companies?",
    options: [
      "Debt requires no repayment and carries no risk for lenders",
      "Equity investors always demand lower returns than debt holders",
      "Debt interest is tax deductible and debt holders have priority claims over equity",
      "Debt has no covenants or restrictions attached",
    ],
    correct: 2,
    explanation: "Debt is cheaper for two reasons: interest payments are tax deductible (reducing the effective cost) and debt holders have priority claims over equity, meaning they take on less risk and therefore accept a lower required return.",
  },
  {
    question: "What is the purpose of an RCF (Revolving Credit Facility)?",
    options: [
      "To issue long-term fixed-rate bonds to public capital markets",
      "To convert existing debt into equity during a restructuring",
      "To provide flexible liquidity that can be drawn and repaid as needed",
      "To fund a specific one-time acquisition",
    ],
    correct: 2,
    explanation: "An RCF is a flexible credit facility — companies can draw down and repay it repeatedly up to an agreed limit. It sits at the top of the capital structure and is primarily used to manage day-to-day liquidity needs.",
  },
  {
    question: "What is the primary goal of a corporate restructuring?",
    options: [
      "To liquidate all company assets and distribute proceeds to shareholders",
      "To increase total debt levels and improve leverage ratios",
      "To improve liquidity, reduce leverage and preserve enterprise value — avoiding formal insolvency",
      "To reward equity holders at the expense of creditors",
    ],
    correct: 2,
    explanation: "The goal of restructuring is to address financial stress before reaching formal insolvency — by extending maturities, swapping debt for equity, injecting new money, or restructuring liabilities — while preserving the underlying business value.",
  },
  {
    question: "What is the key difference between secured and unsecured debt?",
    options: [
      "Secured debt always pays a higher coupon than unsecured debt",
      "Unsecured debt always ranks ahead of secured debt in a restructuring",
      "There is no practical difference in how they are treated in insolvency",
      "Secured debt is backed by specific company assets; unsecured debt has no collateral",
    ],
    correct: 3,
    explanation: "Secured debt is backed by collateral — specific company assets that lenders can claim in a default. Unsecured debt has no such backing and depends entirely on enterprise value. This is why secured lenders recover more in a restructuring.",
  },
];

type Phase = "start" | "question" | "complete";

interface Answer {
  selected: number;
  correct: boolean;
}

export default function GeneralLearningQuiz() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const score = answers.filter((a) => a.correct).length;
  const total = QUESTIONS.length;
  const current = QUESTIONS[currentIndex];

  function handleAnswer(optionIndex: number) {
    if (selectedAnswer !== null) return;
    const correct = optionIndex === current.correct;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
    setAnswers((prev) => [...prev, { selected: optionIndex, correct }]);
  }

  function handleNext() {
    if (currentIndex + 1 >= total) {
      setPhase("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }

  function handleRestart() {
    setPhase("start");
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowExplanation(false);
  }

  return (
    <PageShell>
      <Navbar subtitle="General Learning · Quiz" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          {phase === "start" && (
            <div className="w-full max-w-lg text-center">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
                style={{
                  borderColor: "rgba(30, 144, 255, 0.35)",
                  backgroundColor: "rgba(30, 144, 255, 0.07)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1E90FF" }} />
                <span
                  className="text-xs tracking-[0.18em] uppercase"
                  style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
                >
                  Credit Markets 101
                </span>
              </div>

              <h1
                className="text-4xl font-bold tracking-tight mb-4"
                style={{ fontFamily: "var(--font-inter)", color: "white" }}
              >
                Test Your Knowledge
              </h1>
              <p
                className="text-base leading-relaxed mb-10"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
              >
                {total} multiple choice questions based on the Credit Markets 101 presentation.
                Each question includes an explanation so you can learn as you go.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setPhase("question")}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    backgroundColor: "#1E90FF",
                    color: "white",
                    boxShadow: "0 0 36px rgba(30,144,255,0.35)",
                  }}
                >
                  Begin Quiz
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
                <Link
                  href="/general-learning/presentation"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:opacity-80"
                  style={{
                    fontFamily: "var(--font-inter)",
                    color: "#1E90FF",
                    border: "1px solid rgba(30,144,255,0.35)",
                  }}
                >
                  Review Presentation First
                </Link>
              </div>
            </div>
          )}

          {phase === "question" && (
            <div className="w-full max-w-2xl">
              {/* Progress row */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}
                >
                  Question {currentIndex + 1} of {total}
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}
                >
                  {score} correct
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="w-full h-1 rounded-full mb-8 overflow-hidden"
                style={{ backgroundColor: "rgba(30,144,255,0.1)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentIndex + (selectedAnswer !== null ? 1 : 0)) / total) * 100}%`,
                    backgroundColor: "#1E90FF",
                  }}
                />
              </div>

              {/* Question card */}
              <div
                className="rounded-xl p-6 mb-5"
                style={{
                  background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                  border: "1px solid rgba(30,144,255,0.25)",
                }}
              >
                <p
                  className="text-lg font-semibold leading-snug"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {current.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {current.options.map((option, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === current.correct;
                  const answered = selectedAnswer !== null;

                  let bg = "rgba(30,144,255,0.06)";
                  let border = "rgba(30,144,255,0.2)";
                  let color = "rgba(204,204,204,0.85)";
                  let opacity = "1";

                  if (answered) {
                    if (isCorrect) {
                      bg = "rgba(34,197,94,0.1)";
                      border = "rgba(34,197,94,0.5)";
                      color = "#22c55e";
                    } else if (isSelected) {
                      bg = "rgba(239,68,68,0.1)";
                      border = "rgba(239,68,68,0.5)";
                      color = "#ef4444";
                    } else {
                      opacity = "0.35";
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={answered}
                      className="w-full text-left rounded-xl px-5 py-3.5 text-sm transition-all duration-150 disabled:cursor-default"
                      style={{
                        fontFamily: "var(--font-inter)",
                        backgroundColor: bg,
                        border: `1px solid ${border}`,
                        color,
                        opacity,
                      }}
                    >
                      <span
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold mr-3 flex-shrink-0"
                        style={{
                          backgroundColor: answered && isCorrect ? "rgba(34,197,94,0.2)" : answered && isSelected ? "rgba(239,68,68,0.2)" : "rgba(30,144,255,0.15)",
                          border: `1px solid ${answered && isCorrect ? "rgba(34,197,94,0.4)" : answered && isSelected ? "rgba(239,68,68,0.4)" : "rgba(30,144,255,0.3)"}`,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div
                  className="rounded-lg px-5 py-4 mb-5"
                  style={{
                    backgroundColor: selectedAnswer === current.correct ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
                    border: `1px solid ${selectedAnswer === current.correct ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-1.5"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      color: selectedAnswer === current.correct ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {selectedAnswer === current.correct ? "Correct!" : `Not quite — the answer was ${String.fromCharCode(65 + current.correct)}`}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.75)" }}
                  >
                    {current.explanation}
                  </p>
                </div>
              )}

              {selectedAnswer !== null && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
                    style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white" }}
                  >
                    {currentIndex + 1 >= total ? "See Results" : "Next"}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === "complete" && (
            <CompleteScreen
              answers={answers}
              score={score}
              total={total}
              onRestart={handleRestart}
            />
          )}
        </div>
    </PageShell>
  );
}

function CompleteScreen({
  answers,
  score,
  total,
  onRestart,
}: {
  answers: Answer[];
  score: number;
  total: number;
  onRestart: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const message =
    pct === 100 ? "Perfect — you have a strong grasp of the fundamentals." :
    pct >= 80 ? "Great result — solid foundation across the credit markets." :
    pct >= 60 ? "Good effort — review the explanations below and try again." :
    "Keep at it — read back through the presentation and retry.";

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
          Quiz Complete
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
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white" }}
          >
            Try Again
          </button>
          <Link
            href="/general-learning/presentation"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-80"
            style={{
              fontFamily: "var(--font-inter)",
              color: "#1E90FF",
              border: "1px solid rgba(30,144,255,0.35)",
            }}
          >
            Review Presentation
          </Link>
        </div>
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
                  className="text-sm font-medium mb-1.5 leading-snug"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.85)" }}
                >
                  {QUESTIONS[i].question}
                </p>
                <div className="flex flex-wrap gap-2">
                  {!a.correct && (
                    <span
                      className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                      style={{ fontFamily: "var(--font-space-mono)", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      You: {String.fromCharCode(65 + a.selected)}
                    </span>
                  )}
                  <span
                    className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                    style={{ fontFamily: "var(--font-space-mono)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                  >
                    {a.correct ? "Correct" : `Correct: ${String.fromCharCode(65 + QUESTIONS[i].correct)}`}
                  </span>
                </div>
                {!a.correct && (
                  <p
                    className="text-xs mt-2 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}
                  >
                    {QUESTIONS[i].explanation}
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
