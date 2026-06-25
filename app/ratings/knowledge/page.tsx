"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import PageShell from "@/app/components/PageShell";
import Navbar from "@/app/components/Navbar";
import { markStepComplete } from "@/lib/progress";

// ─── Quiz data from Ross Murray's "Ratings 101 Follow up Questions" ─────────

const QUESTIONS = [
  {
    question: "A credit rating is best described as:",
    options: [
      { value: "A", label: "A guarantee that the issuer will not default" },
      { value: "B", label: "A recommendation to buy or sell a bond" },
      { value: "C", label: "An opinion on the issuer's creditworthiness" },
    ],
    correctAnswer: "C",
  },
  {
    question: "Which of the following best describes what credit ratings measure?",
    options: [
      { value: "A", label: "Probability of default and loss severity if default occurs" },
      { value: "B", label: "Only the probability that an issuer will default" },
      { value: "C", label: "The issuer's overall financial performance and stock price outlook" },
    ],
    correctAnswer: "A",
  },
  {
    question: "Which agency's methodology emphasises expected loss (probability × severity) rather than focusing primarily on probability of default?",
    options: [
      { value: "A", label: "Fitch" },
      { value: "B", label: "Moody's" },
      { value: "C", label: "S&P Global" },
    ],
    correctAnswer: "B",
  },
  {
    question: "Which of the following is the lowest investment grade rating?",
    options: [
      { value: "A", label: "BBB+ / Baa1" },
      { value: "B", label: "BB+ / Ba1" },
      { value: "C", label: "BBB− / Baa3" },
    ],
    correctAnswer: "C",
  },
  {
    question: 'A "fallen angel" refers to:',
    options: [
      { value: "A", label: "An issuer downgraded from investment grade into high yield" },
      { value: "B", label: "An issuer that has missed an interest payment for the first time" },
      { value: "C", label: "An issuer whose rating has been withdrawn by the agency" },
    ],
    correctAnswer: "A",
  },
  {
    question: "The key difference between an Outlook and a Watch / Under Review is:",
    options: [
      { value: "A", label: "Outlooks are only issued by Moody's; Watches are only issued by S&P and Fitch" },
      { value: "B", label: "Outlooks apply to instruments; Watches apply to issuers" },
      { value: "C", label: "Outlooks reflect a longer 12–24 month view, while Watches signal likely action within ~90 days tied to a specific catalyst" },
    ],
    correctAnswer: "C",
  },
  {
    question: "On a 9fin company profile, the Corporate Family Rating (CFR) refers to:",
    options: [
      { value: "A", label: "An average of all instrument ratings outstanding for the issuer" },
      { value: "B", label: "The issuer-level rating reflecting the agency's view of the whole company" },
      { value: "C", label: "The rating on the company's most recently issued bond" },
    ],
    correctAnswer: "B",
  },
  {
    question: "Why is the 15-minute publication SLA important for ratings on 9fin?",
    options: [
      { value: "A", label: "Because clients are making real-time decisions on price-moving information" },
      { value: "B", label: "Because rating agencies require it" },
      { value: "C", label: "Because ratings expire if not republished within 15 minutes" },
    ],
    correctAnswer: "A",
  },
];

type Phase = "start" | "question" | "complete";

interface Answer {
  questionIndex: number;
  selected: string;
  correct: boolean;
}

export default function RatingsKnowledgeQuiz() {
  const [phase, setPhase] = useState<Phase>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const startSession = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setPhase("question");
  }, []);

  const handleAnswer = useCallback(
    (option: string) => {
      if (selectedAnswer !== null) return;
      const correct = option === QUESTIONS[currentIndex].correctAnswer;
      setSelectedAnswer(option);
      setAnswers((prev) => [...prev, { questionIndex: currentIndex, selected: option, correct }]);
    },
    [selectedAnswer, currentIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= QUESTIONS.length) {
      setPhase("complete");
      markStepComplete("ratings", "knowledge");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  }, [currentIndex]);

  const score = answers.filter((a) => a.correct).length;

  return (
    <PageShell>
      <Navbar subtitle="Ratings · Knowledge Check" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {phase === "start" && (
            <div className="w-full max-w-lg text-center">
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8" style={{ borderColor: "rgba(30,144,255,0.35)", backgroundColor: "rgba(30,144,255,0.07)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1E90FF" }} />
                <span className="text-xs tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}>
                  Ratings 101 · Knowledge Check
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-inter)", color: "white" }}>
                Test Your Knowledge
              </h1>
              <p className="text-base leading-relaxed mb-8" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}>
                8 questions covering the Ratings 101 presentation — credit ratings methodology, the scale, agencies, outlooks, CFR vs instrument, and why ratings matter on 9fin.
              </p>

              <button
                onClick={startSession}
                className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
                style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white", boxShadow: "0 0 36px rgba(30,144,255,0.35)" }}
              >
                Begin Quiz
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}

          {phase === "question" && (
            <div className="w-full max-w-2xl">
              {/* Progress */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}>
                  Question {currentIndex + 1} of {QUESTIONS.length}
                </span>
                <span className="text-xs" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}>
                  {score} correct
                </span>
              </div>
              <div className="w-full h-1 rounded-full mb-8 overflow-hidden" style={{ backgroundColor: "rgba(30,144,255,0.1)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((currentIndex + (selectedAnswer !== null ? 1 : 0)) / QUESTIONS.length) * 100}%`, backgroundColor: "#1E90FF" }} />
              </div>

              {/* Question */}
              <div className="rounded-xl p-6 mb-6" style={{ background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)", border: "1px solid rgba(30,144,255,0.25)" }}>
                <p className="text-lg font-semibold leading-snug" style={{ fontFamily: "var(--font-inter)", color: "white" }}>
                  {QUESTIONS[currentIndex].question}
                </p>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2.5 mb-6">
                {QUESTIONS[currentIndex].options.map((opt) => {
                  const answered = selectedAnswer !== null;
                  const isSelected = selectedAnswer === opt.value;
                  const isCorrectOpt = opt.value === QUESTIONS[currentIndex].correctAnswer;

                  let bg = "rgba(30,144,255,0.06)";
                  let border = "rgba(30,144,255,0.18)";
                  let color = "rgba(204,204,204,0.85)";
                  let opacity = "1";

                  if (answered) {
                    if (isCorrectOpt) { bg = "rgba(34,197,94,0.14)"; border = "rgba(34,197,94,0.55)"; color = "#22c55e"; }
                    else if (isSelected && !isCorrectOpt) { bg = "rgba(239,68,68,0.14)"; border = "rgba(239,68,68,0.55)"; color = "#ef4444"; }
                    else { opacity = "0.25"; }
                  }

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      disabled={answered}
                      className="rounded-xl px-5 py-3.5 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default"
                      style={{ fontFamily: "var(--font-inter)", backgroundColor: bg, border: `1px solid ${border}`, color, opacity }}
                    >
                      <span className="font-bold mr-2" style={{ fontFamily: "var(--font-space-mono)" }}>{opt.value}.</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {selectedAnswer !== null && (
                <>
                  <div
                    className="rounded-xl px-5 py-4 mb-6"
                    style={{
                      backgroundColor: selectedAnswer === QUESTIONS[currentIndex].correctAnswer ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
                      border: `1px solid ${selectedAnswer === QUESTIONS[currentIndex].correctAnswer ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: selectedAnswer === QUESTIONS[currentIndex].correctAnswer ? "#22c55e" : "#ef4444" }}>
                      {selectedAnswer === QUESTIONS[currentIndex].correctAnswer ? "Correct" : `Not quite — the answer is ${QUESTIONS[currentIndex].correctAnswer}`}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
                      style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white" }}
                    >
                      {currentIndex + 1 >= QUESTIONS.length ? "See Results" : "Next"}
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {phase === "complete" && (
            <div className="w-full max-w-2xl">
              <div className="rounded-2xl p-8 mb-8 text-center" style={{ background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)", border: "1px solid rgba(30,144,255,0.25)" }}>
                <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.45)" }}>
                  Quiz Complete
                </p>
                <p className="font-bold mb-2" style={{ fontFamily: "var(--font-inter)", color: score === QUESTIONS.length ? "#22c55e" : score >= 6 ? "#1E90FF" : "#ef4444", fontSize: "clamp(3rem,10vw,5rem)", lineHeight: 1 }}>
                  {score}/{QUESTIONS.length}
                </p>
                <p className="text-sm mb-6" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}>
                  {score === QUESTIONS.length ? "Perfect — you've nailed the Ratings 101 fundamentals." :
                   score >= 6 ? "Strong result — solid grasp of the material." :
                   score >= 4 ? "Good effort — revisit the presentation and try again." :
                   "Keep studying — review the Ratings 101 deck and retry."}
                </p>
                <button
                  onClick={startSession}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110"
                  style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white" }}
                >
                  Try Again
                </button>
              </div>

              {/* Breakdown */}
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}>
                Breakdown
              </p>
              <div className="space-y-3">
                {answers.map((a, i) => {
                  const q = QUESTIONS[a.questionIndex];
                  return (
                    <div key={i} className="rounded-xl p-4" style={{ background: a.correct ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)", border: `1px solid ${a.correct ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)"}` }}>
                      <div className="flex items-start gap-3">
                        <span className="text-sm mt-0.5 flex-shrink-0" style={{ color: a.correct ? "#22c55e" : "#ef4444" }}>{a.correct ? "✓" : "✗"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm leading-snug mb-2" style={{ fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.85)" }}>{q.question}</p>
                          <div className="flex flex-wrap gap-2">
                            {!a.correct && (
                              <>
                                <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-space-mono)", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                  You: {a.selected}
                                </span>
                                <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-space-mono)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                                  Correct: {q.correctAnswer}
                                </span>
                              </>
                            )}
                            {a.correct && (
                              <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-space-mono)", color: "#22c55e", backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                                {q.correctAnswer}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <Link href="/ratings" className="text-xs transition-opacity hover:opacity-100 opacity-60" style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}>
                  ← Back to Ratings
                </Link>
              </div>
            </div>
          )}
        </div>
    </PageShell>
  );
}
