import Link from "next/link";
import StagingApps from "./components/StagingApps";

const cards = [
  {
    title: "Presentations",
    description:
      "Structured training decks to walk you through how we work.",
    href: "/presentations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Notion Guides",
    description: "Deep-dive reference docs for every part of the job.",
    href: "/notion-guides",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "Training Questions",
    description: "Test your knowledge with guided exercises.",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "#0A1628", overflowX: "clip" }}
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

      {/* Background: blue radial glow from top */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 55% at 50% -5%, rgba(15, 60, 180, 0.5) 0%, transparent 65%)",
        }}
      />

      {/* All content sits above backgrounds */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Sticky Navbar */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b"
          style={{
            backgroundColor: "rgba(10, 22, 40, 0.75)",
            borderColor: "rgba(30, 144, 255, 0.2)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/9fin-logo.png`}
            alt="9fin"
            width={80}
            height={32}
            className="object-contain rounded-lg"
            style={{ height: "auto" }}
          />

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

        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-32">
          {/* Pill eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-10"
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
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "#1E90FF",
              }}
            >
              Employee Onboarding
            </span>
          </div>

          {/* Main heading — Inter Bold, large & tight */}
          <h1
            className="font-bold tracking-tight leading-none mb-7"
            style={{
              fontFamily: "var(--font-inter)",
              color: "white",
              fontSize: "clamp(3.25rem, 8vw, 6.5rem)",
            }}
          >
            Welcome to 9fin.
          </h1>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl max-w-lg leading-relaxed mb-11"
            style={{ fontFamily: "var(--font-inter)", color: "#CCCCCC" }}
          >
            Everything you need to get up to speed — structured, searchable,
            and all in one place.
          </p>

          {/* Primary CTA */}
          <a
            href="#"
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.03]"
            style={{
              fontFamily: "var(--font-inter)",
              backgroundColor: "#1E90FF",
              color: "white",
              boxShadow:
                "0 0 36px rgba(30, 144, 255, 0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            Explore Portal
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
          </a>
        </section>

        {/* Section divider with label */}
        <div className="flex items-center gap-4 max-w-5xl mx-auto px-6 mb-12 w-full">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "rgba(30,144,255,0.12)" }}
          />
          <p
            className="text-xs tracking-[0.25em] uppercase whitespace-nowrap"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "rgba(204,204,204,0.4)",
            }}
          >
            Your Onboarding Path
          </p>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "rgba(30,144,255,0.12)" }}
          />
        </div>

        {/* Cards */}
        <section className="flex-1 px-6 pb-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card) => (
              <Card key={card.title} card={card} />
            ))}
          </div>
        </section>

        <StagingApps />

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

function Card({
  card,
}: {
  card: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
  };
}) {
  return (
    <Link
      href={card.href}
      className="group flex flex-col rounded-xl p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(30,144,255,0.22)] cursor-pointer border border-[rgba(30,144,255,0.28)] hover:border-[rgba(30,144,255,0.55)]"
      style={{
        background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
        touchAction: "manipulation",
      }}
      aria-label={`Get started with ${card.title}`}
    >
      {/* Icon container */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-[rgba(30,144,255,0.18)]"
        style={{
          backgroundColor: "rgba(30, 144, 255, 0.1)",
          border: "1px solid rgba(30, 144, 255, 0.2)",
          color: "#1E90FF",
        }}
      >
        {card.icon}
      </div>

      <h2
        className="text-base font-semibold mb-2.5 tracking-tight"
        style={{ fontFamily: "var(--font-inter)", color: "white" }}
      >
        {card.title}
      </h2>

      <p
        className="text-sm leading-relaxed flex-1"
        style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.85)" }}
      >
        {card.description}
      </p>

      <div
        className="mt-7 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3"
        style={{
          fontFamily: "var(--font-space-mono)",
          color: "#1E90FF",
        }}
      >
        Get Started
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
    </Link>
  );
}
