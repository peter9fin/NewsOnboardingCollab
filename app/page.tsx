import Link from "next/link";
import StagingApps from "./components/StagingApps";
import SignOutButton from "./components/SignOutButton";

const teams = [
  {
    id: "9news",
    label: "9news",
    description: "Editorial news workflow — triage, tagging, and production.",
    href: "/9news",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
        <path d="M16 2v4H8V2" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" />
      </svg>
    ),
  },
  {
    id: "newsapp",
    label: "NewsApp",
    description: "News application — development, QA, and maintenance.",
    href: "/newsapp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "ratings",
    label: "Ratings",
    description: "Credit ratings coverage, methodology, and processes.",
    href: "/ratings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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
          backgroundImage: "radial-gradient(rgba(30, 144, 255, 0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Background: blue radial glow from top */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 120% 55% at 50% -5%, rgba(15, 60, 180, 0.5) 0%, transparent 65%)",
        }}
      />

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
          <div className="flex items-center gap-6">
            <span
              className="text-xs tracking-[0.2em] uppercase hidden sm:block"
              style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.55)" }}
            >
              Onboarding Portal
            </span>
            <SignOutButton />
          </div>
        </nav>

        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-10"
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
              Employee Onboarding
            </span>
          </div>

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

          <p
            className="text-lg md:text-xl max-w-lg leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", color: "#CCCCCC" }}
          >
            Everything you need to get up to speed — structured, searchable,
            and all in one place.
          </p>
        </section>

        {/* General Learning */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8 w-full">
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,144,255,0.18)" }} />
              <p
                className="text-sm tracking-[0.22em] uppercase whitespace-nowrap font-semibold"
                style={{ fontFamily: "var(--font-space-mono)", color: "rgba(255,255,255,0.75)" }}
              >
                General Learning
              </p>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,144,255,0.18)" }} />
            </div>
            <Link
              href="/general-learning"
              className="group flex items-center justify-between rounded-xl border px-8 py-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(30,144,255,0.18)] border-[rgba(30,144,255,0.22)] hover:border-[rgba(30,144,255,0.5)]"
              style={{ background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)" }}
            >
              <div className="flex items-center gap-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(30,144,255,0.1)",
                    border: "1px solid rgba(30,144,255,0.2)",
                    color: "#1E90FF",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5" style={{ fontFamily: "var(--font-inter)", color: "white" }}>
                    Financial Markets Fundamentals
                  </p>
                  <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}>
                    Credit Markets 101 presentation + 10-question quiz
                  </p>
                </div>
              </div>
              <div
                className="inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3 flex-shrink-0"
                style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
              >
                Enter
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          </div>
        </section>

        {/* Team boxes */}
        <section className="px-6 pb-28">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-12 w-full">
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,144,255,0.18)" }} />
              <p
                className="text-sm tracking-[0.22em] uppercase whitespace-nowrap font-semibold"
                style={{ fontFamily: "var(--font-space-mono)", color: "rgba(255,255,255,0.75)" }}
              >
                Workflows
              </p>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,144,255,0.18)" }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
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

function TeamCard({
  team,
}: {
  team: { id: string; label: string; description: string; href: string; icon: React.ReactNode };
}) {
  return (
    <Link
      href={team.href}
      className="group flex flex-col rounded-xl p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(30,144,255,0.22)] cursor-pointer border border-[rgba(30,144,255,0.28)] hover:border-[rgba(30,144,255,0.55)]"
      style={{ background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-7 transition-colors duration-300 group-hover:bg-[rgba(30,144,255,0.18)]"
        style={{
          backgroundColor: "rgba(30, 144, 255, 0.1)",
          border: "1px solid rgba(30, 144, 255, 0.2)",
          color: "#1E90FF",
        }}
      >
        {team.icon}
      </div>

      <h2
        className="text-xl font-bold mb-3 tracking-tight"
        style={{ fontFamily: "var(--font-inter)", color: "white" }}
      >
        {team.label}
      </h2>

      <p
        className="text-sm leading-relaxed flex-1"
        style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.75)" }}
      >
        {team.description}
      </p>

      <div
        className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3"
        style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
      >
        Enter
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </Link>
  );
}
