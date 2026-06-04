"use client";

import Link from "next/link";
import { useState } from "react";

const EMBED_URL =
  "https://view.officeapps.live.com/op/embed.aspx?src=https://news-onboarding.vercel.app/credit-markets-101.pptx";
const DOWNLOAD_URL = "/credit-markets-101.pptx";

export default function PresentationViewerPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "#0A1628", overflowX: "clip" }}
    >
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(30, 144, 255, 0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
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
          <div className="flex items-center gap-4">
            <a
              href={DOWNLOAD_URL}
              download
              className="inline-flex items-center gap-1.5 text-xs transition-opacity hover:opacity-100 opacity-60"
              style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </a>
            <span
              className="text-xs tracking-[0.2em] uppercase hidden sm:block"
              style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.55)" }}
            >
              General Learning
            </span>
          </div>
        </nav>

        {/* Header */}
        <section className="px-6 pt-10 pb-6">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/general-learning"
              className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-100 opacity-60"
              style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </Link>
            <h1
              className="text-2xl font-bold tracking-tight mb-1"
              style={{ fontFamily: "var(--font-inter)", color: "white" }}
            >
              Restructuring & Credit Markets 101
            </h1>
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.55)" }}
            >
              A beginner&apos;s guide to investment grade, high yield and distressed debt
            </p>
          </div>
        </section>

        {/* Embed */}
        <section className="flex-1 px-6 pb-10">
          <div className="max-w-6xl mx-auto">
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                border: "1px solid rgba(30,144,255,0.2)",
                backgroundColor: "rgba(10,22,40,0.8)",
                aspectRatio: "16/9",
              }}
            >
              {!loaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "rgba(30,144,255,0.4)", borderTopColor: "transparent" }}
                  />
                  <p
                    className="text-xs"
                    style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}
                  >
                    Loading presentation…
                  </p>
                </div>
              )}
              <iframe
                src={EMBED_URL}
                className="w-full h-full"
                style={{ border: "none", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
                onLoad={() => setLoaded(true)}
                title="Restructuring & Credit Markets 101"
                allowFullScreen
              />
            </div>

            {/* Next step nudge */}
            <div
              className="mt-6 rounded-xl p-5 flex items-center justify-between gap-4"
              style={{
                background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                border: "1px solid rgba(30,144,255,0.2)",
              }}
            >
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
              >
                Done with the presentation? Test what you&apos;ve learned.
              </p>
              <Link
                href="/general-learning/quiz"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold transition-all hover:brightness-110 flex-shrink-0"
                style={{ fontFamily: "var(--font-inter)", backgroundColor: "#1E90FF", color: "white" }}
              >
                Take the Quiz →
              </Link>
            </div>
          </div>
        </section>

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
