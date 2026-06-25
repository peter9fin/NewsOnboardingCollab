import Link from "next/link";
import StagingApps from "./components/StagingApps";
import PageShell from "./components/PageShell";
import Navbar from "./components/Navbar";

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
    <PageShell>
      <Navbar isHome showSignOut />

        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-12">
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

        </section>

        {/* Introduction & Onboarding Path */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Welcome copy */}
            <div
              className="lg:col-span-3 rounded-2xl p-8 flex flex-col justify-between"
              style={{
                background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                border: "1px solid rgba(30,144,255,0.22)",
              }}
            >
              <div>
                <span
                  className="inline-block text-[10px] tracking-[0.22em] uppercase px-2.5 py-1 rounded-full mb-6"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "#1E90FF",
                    backgroundColor: "rgba(30,144,255,0.1)",
                    border: "1px solid rgba(30,144,255,0.2)",
                  }}
                >
                  Getting Started
                </span>
                <h2
                  className="text-2xl font-bold tracking-tight mb-4 leading-snug"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  You&apos;re now part of the 9fin News team.
                </h2>
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
                >
                  9fin is the leading data and intelligence platform for leveraged finance.
                  This portal is your structured guide to getting up to speed — the markets
                  you&apos;ll track, the tools you&apos;ll use, and the workflows
                  you&apos;ll follow every day.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
                >
                  Everything is laid out in a deliberate order. Work through each section
                  from top to bottom and you&apos;ll have a solid foundation before your
                  first week is out.
                </p>
              </div>
              <div
                className="mt-8 pt-6 flex items-center gap-2"
                style={{ borderTop: "1px solid rgba(30,144,255,0.12)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                <p
                  className="text-xs"
                  style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}
                >
                  Complete each step in order to unlock the next
                </p>
              </div>
            </div>

            {/* Onboarding path steps */}
            <div
              className="lg:col-span-2 rounded-2xl p-7 flex flex-col"
              style={{
                background: "linear-gradient(160deg, #0a1e3d 0%, #070f1f 100%)",
                border: "1px solid rgba(30,144,255,0.15)",
              }}
            >
              <p
                className="text-[10px] tracking-[0.22em] uppercase mb-6"
                style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}
              >
                Your Onboarding Path
              </p>

              <div className="flex flex-col gap-0 flex-1">
                {[
                  {
                    n: "01",
                    title: "General Learning",
                    desc: "Start here. Watch the Credit Markets 101 presentation and complete the knowledge quiz to build your financial foundation.",
                    color: "#1E90FF",
                  },
                  {
                    n: "02",
                    title: "Team Workflows",
                    desc: "Work through all three team sections below — 9news, NewsApp, and Ratings. In each, complete the Best Practice Guide, Presentations, and Training in order.",
                    color: "#1E90FF",
                  },
                  {
                    n: "03",
                    title: "You're ready",
                    desc: "Once all steps are marked complete, you have everything you need to hit the ground running.",
                    color: "#22c55e",
                  },
                ].map((step, i, arr) => (
                  <div key={step.n} className="flex gap-4">
                    {/* Line + number */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{
                          backgroundColor: `${step.color}18`,
                          border: `1px solid ${step.color}40`,
                          color: step.color,
                          fontFamily: "var(--font-space-mono)",
                        }}
                      >
                        {step.n}
                      </div>
                      {i < arr.length - 1 && (
                        <div
                          className="w-px flex-1 my-1"
                          style={{ backgroundColor: "rgba(30,144,255,0.12)", minHeight: "20px" }}
                        />
                      )}
                    </div>
                    {/* Text */}
                    <div className="pb-6">
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ fontFamily: "var(--font-inter)", color: "white" }}
                      >
                        {step.title}
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.5)" }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* General Learning */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 pl-4" style={{ borderLeft: "2px solid #1E90FF" }}>
              <h2
                className="text-xl font-bold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-inter)", color: "white" }}
              >
                General Learning
              </h2>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.55)" }}
              >
                Start here. Build your financial foundation before moving into team-specific content.
              </p>
            </div>
            <div className="flex justify-center">
              <Link
                href="/general-learning"
                className="group flex flex-col rounded-xl p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(30,144,255,0.22)] cursor-pointer border border-[rgba(30,144,255,0.28)] hover:border-[rgba(30,144,255,0.55)] w-full md:w-1/3"
                style={{ background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-7 transition-colors duration-300 group-hover:bg-[rgba(30,144,255,0.18)]"
                  style={{
                    backgroundColor: "rgba(30,144,255,0.1)",
                    border: "1px solid rgba(30,144,255,0.2)",
                    color: "#1E90FF",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>

                <h2
                  className="text-xl font-bold mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  Financial Markets Fundamentals
                </h2>

                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.75)" }}
                >
                  Credit Markets 101 presentation and a 10-question quiz to build your financial foundation.
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
            </div>
          </div>
        </section>

        {/* Team boxes */}
        <section className="px-6 pb-28">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 pl-4" style={{ borderLeft: "2px solid #1E90FF" }}>
              <h2
                className="text-xl font-bold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-inter)", color: "white" }}
              >
                Workflows
              </h2>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.55)" }}
              >
                Work through all three team sections. Each follows the same path — best practice guides, presentations, then training.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </div>
        </section>

        {/* Additional Learning */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 pl-4" style={{ borderLeft: "2px solid #a855f7" }}>
              <h2
                className="text-xl font-bold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-inter)", color: "white" }}
              >
                Additional Learning
              </h2>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.55)" }}
              >
                Unlimited practice drills on real workflow scenarios. No fixed end — keep going until it&apos;s second nature.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
              {[
                {
                  label: "9news Triage",
                  desc: "Unlimited practice triaging real news headlines using the full question pool.",
                  href: "/additional-learning/9news",
                  accent: "#a855f7",
                  border: "rgba(168,85,247,0.28)",
                  shadow: "rgba(168,85,247,0.2)",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
                      <path d="M16 2v4H8V2" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" />
                    </svg>
                  ),
                },
                {
                  label: "Ratings Triage",
                  desc: "Unlimited practice triaging real #ratings-news-events Slack alerts from the full 200-question pool.",
                  href: "/additional-learning/ratings",
                  accent: "#a855f7",
                  border: "rgba(168,85,247,0.28)",
                  shadow: "rgba(168,85,247,0.2)",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  ),
                },
              ].map((drill) => (
                <Link
                  key={drill.href}
                  href={drill.href}
                  className="group flex flex-col rounded-xl p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 cursor-pointer border"
                  style={{
                    background: "linear-gradient(160deg, #0e1a2e 0%, #070f1f 100%)",
                    borderColor: drill.border,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      backgroundColor: `${drill.accent}1a`,
                      border: `1px solid ${drill.accent}40`,
                      color: drill.accent,
                    }}
                  >
                    {drill.icon}
                  </div>
                  <h3
                    className="text-lg font-bold mb-2 tracking-tight"
                    style={{ fontFamily: "var(--font-inter)", color: "white" }}
                  >
                    {drill.label}
                  </h3>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
                  >
                    {drill.desc}
                  </p>
                  <div
                    className="mt-7 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3"
                    style={{ fontFamily: "var(--font-space-mono)", color: drill.accent }}
                  >
                    Start drilling
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <StagingApps />
    </PageShell>
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
