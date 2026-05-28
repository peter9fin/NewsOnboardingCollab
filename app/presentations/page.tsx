import Link from "next/link";
import { presentations } from "./data";
import CompletionFooter from "@/app/components/CompletionFooter";

export default function PresentationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ team?: string }>;
}) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-x-hidden"
      style={{ backgroundColor: "#0A1628" }}
    >
      {/* Background: subtle dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(30, 144, 255, 0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Background: blue radial glow */}
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
            backgroundColor: "#0A1628",
            borderColor: "rgba(30, 144, 255, 0.2)",
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
            Onboarding Portal
          </span>
        </nav>

        {/* Header */}
        <section className="px-6 pt-16 pb-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs mb-8 transition-opacity hover:opacity-100 opacity-60"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "#1E90FF",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
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
            Back to Portal
          </Link>

          <h1
            className="font-bold tracking-tight leading-none mb-4"
            style={{
              fontFamily: "var(--font-inter)",
              color: "white",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Presentations
          </h1>
          <p
            className="text-base max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", color: "#CCCCCC" }}
          >
            Structured training decks to walk you through how we work.
          </p>
        </section>

        {/* Grid */}
        <section className="flex-1 px-6 pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {presentations.map((deck) => (
              <PresentationCard key={deck.slug} deck={deck} />
            ))}
          </div>
        </section>

        <CompletionFooter
          searchParams={searchParams}
          step="presentations"
          nextStep="training"
          nextStepLabel="Training"
        />

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

function PresentationCard({
  deck,
}: {
  deck: (typeof presentations)[number];
}) {
  const available = deck.embedUrl !== null;

  const inner = (
    <div
      className={[
        "group flex flex-col rounded-xl p-7 h-full transition-[transform,box-shadow,border-color] duration-300",
        available
          ? "hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(30,144,255,0.22)] cursor-pointer border border-[rgba(30,144,255,0.28)] hover:border-[rgba(30,144,255,0.55)]"
          : "cursor-default border border-[rgba(30,144,255,0.12)] opacity-60",
      ].join(" ")}
      style={{
        background: available
          ? "linear-gradient(160deg, #0e2345 0%, #091830 100%)"
          : "linear-gradient(160deg, #0b1b35 0%, #081528 100%)",
      }}
    >
      {/* Tag */}
      <div className="flex items-center justify-between mb-6">
        <span
          className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: available ? "#1E90FF" : "rgba(204,204,204,0.4)",
            backgroundColor: available
              ? "rgba(30,144,255,0.1)"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${available ? "rgba(30,144,255,0.2)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          {deck.tag}
        </span>
        {!available && (
          <span
            className="text-[10px] tracking-[0.15em] uppercase"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "rgba(204,204,204,0.3)",
            }}
          >
            Coming soon
          </span>
        )}
      </div>

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-[rgba(30,144,255,0.18)]"
        style={{
          backgroundColor: available
            ? "rgba(30, 144, 255, 0.1)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${available ? "rgba(30,144,255,0.2)" : "rgba(255,255,255,0.06)"}`,
          color: available ? "#1E90FF" : "rgba(204,204,204,0.3)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>

      <h2
        className="text-base font-semibold mb-2.5 tracking-tight"
        style={{
          fontFamily: "var(--font-inter)",
          color: available ? "white" : "rgba(255,255,255,0.45)",
        }}
      >
        {deck.title}
      </h2>

      <p
        className="text-sm leading-relaxed flex-1"
        style={{
          fontFamily: "var(--font-inter)",
          color: available ? "rgba(204,204,204,0.85)" : "rgba(204,204,204,0.35)",
        }}
      >
        {deck.description}
      </p>

      {available && (
        <div
          className="mt-7 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: "#1E90FF",
          }}
        >
          View Presentation
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      )}
    </div>
  );

  if (!available) return <div className="h-full">{inner}</div>;

  return (
    <Link href={`/presentations/${deck.slug}`} className="h-full block">
      {inner}
    </Link>
  );
}
