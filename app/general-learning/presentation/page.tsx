"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/app/components/PageShell";
import Navbar from "@/app/components/Navbar";

const EMBED_URL =
  "https://docs.google.com/presentation/d/e/2PACX-1vS1WLX66T0ZtvTEWkfSPwTgJqN2aUeKo6O-t2UoLF1jYCThTYh4d-JR_o1JOS6345JzwuIklXoHEa-n/pubembed?start=false&loop=false&delayms=3000";

export default function PresentationViewerPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  return (
    <PageShell>
      {/* Quiz prompt modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
              border: "1px solid rgba(30,144,255,0.35)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(30,144,255,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              style={{ color: "rgba(204,204,204,0.4)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                backgroundColor: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#22c55e",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>

            <h2
              className="text-2xl font-bold tracking-tight mb-2"
              style={{ fontFamily: "var(--font-inter)", color: "white" }}
            >
              Presentation complete!
            </h2>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.65)" }}
            >
              Ready to put your knowledge to the test? Take the 10-question quiz on credit markets and restructuring.
            </p>

            <button
              onClick={() => router.push("/general-learning/quiz")}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] mb-3"
              style={{
                fontFamily: "var(--font-inter)",
                backgroundColor: "#1E90FF",
                color: "white",
                boxShadow: "0 0 32px rgba(30,144,255,0.3)",
              }}
            >
              Take the Quiz Now
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full text-xs transition-opacity hover:opacity-100 opacity-50 py-2"
              style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
            >
              I&apos;ll do it later
            </button>
          </div>
        </div>
      )}

      <Navbar subtitle="General Learning" />

        {/* Breadcrumb + title */}
        <div className="px-6 pt-10 pb-6 max-w-6xl mx-auto w-full">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-6">
            <Link
              href="/general-learning"
              className="text-xs transition-opacity hover:opacity-100 opacity-60 inline-flex items-center gap-1.5"
              style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              General Learning
            </Link>
            <span className="text-xs" style={{ color: "rgba(204,204,204,0.3)" }}>/</span>
            <span
              className="text-xs"
              style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.6)" }}
            >
              Restructuring & Credit Markets 101
            </span>
          </nav>

          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "#1E90FF",
                backgroundColor: "rgba(30,144,255,0.1)",
                border: "1px solid rgba(30,144,255,0.2)",
              }}
            >
              Finance
            </span>
          </div>

          <h1
            className="font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-inter)",
              color: "white",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            }}
          >
            Restructuring & Credit Markets 101
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
          >
            A beginner&apos;s guide to investment grade, high yield and distressed debt.
          </p>
        </div>

        {/* Iframe viewer */}
        <div className="flex-1 px-6 pb-28 max-w-6xl mx-auto w-full">
          <div
            className="w-full rounded-xl overflow-hidden"
            style={{
              border: "1px solid rgba(30, 144, 255, 0.2)",
              boxShadow: "0 0 64px rgba(30,144,255,0.1)",
              aspectRatio: "16 / 9",
            }}
          >
            <iframe
              src={EMBED_URL}
              className="w-full h-full"
              allowFullScreen
              title="Restructuring & Credit Markets 101"
            />
          </div>
        </div>

      {/* Sticky completion bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-6 py-4 border-t"
        style={{
          backgroundColor: "rgba(10, 22, 40, 0.95)",
          borderColor: "rgba(30,144,255,0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
          >
            Finished the presentation? Test your knowledge next.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold transition-all hover:brightness-110 flex-shrink-0"
            style={{
              fontFamily: "var(--font-inter)",
              backgroundColor: "#22c55e",
              color: "white",
            }}
          >
            I&apos;ve finished ✓
          </button>
        </div>
      </div>
    </PageShell>
  );
}
