import Link from "next/link";
import StagingApps from "./components/StagingApps";
import SignOutButton from "./components/SignOutButton";

type ContentSection = {
  type: "presentations" | "notion" | "training";
  title: string;
  description: string;
  href: string;
  available: boolean;
};

type Team = {
  id: string;
  label: string;
  description: string;
  sections: ContentSection[];
};

const teams: Team[] = [
  {
    id: "9news",
    label: "9news",
    description: "Editorial news workflow — triage, tagging, and production.",
    sections: [
      {
        type: "presentations",
        title: "Presentations",
        description: "Training decks covering 9news editorial workflows.",
        href: "/presentations",
        available: true,
      },
      {
        type: "notion",
        title: "Notion Docs",
        description: "Deep-dive reference guides for 9news processes.",
        href: "/notion-guides",
        available: true,
      },
      {
        type: "training",
        title: "Training",
        description: "Guided exercises to test your 9news knowledge.",
        href: "#",
        available: false,
      },
    ],
  },
  {
    id: "newsapp",
    label: "NewsApp",
    description: "News application — development, QA, and maintenance.",
    sections: [
      {
        type: "presentations",
        title: "Presentations",
        description: "Training decks for the NewsApp product and stack.",
        href: "/presentations",
        available: true,
      },
      {
        type: "notion",
        title: "Notion Docs",
        description: "Reference docs for NewsApp workflows and tooling.",
        href: "/notion-guides",
        available: true,
      },
      {
        type: "training",
        title: "Training",
        description: "Exercises and quizzes for the NewsApp team.",
        href: "#",
        available: false,
      },
    ],
  },
  {
    id: "ratings",
    label: "Ratings",
    description: "Credit ratings coverage, methodology, and processes.",
    sections: [
      {
        type: "presentations",
        title: "Presentations",
        description: "Training decks on ratings methodology and workflow.",
        href: "/presentations",
        available: true,
      },
      {
        type: "notion",
        title: "Notion Docs",
        description: "Reference guides for ratings coverage and tools.",
        href: "/notion-guides",
        available: true,
      },
      {
        type: "training",
        title: "Training",
        description: "Exercises to test your ratings knowledge.",
        href: "#",
        available: false,
      },
    ],
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
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "rgba(204,204,204,0.55)",
              }}
            >
              Onboarding Portal
            </span>
            <SignOutButton />
          </div>
        </nav>

        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-24">
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

        {/* General Learning — placeholder */}
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto">
            <SectionDivider label="General Learning" />
            <div
              className="mt-8 rounded-xl border flex items-center justify-center"
              style={{
                height: "120px",
                borderColor: "rgba(30, 144, 255, 0.12)",
                background: "rgba(30, 144, 255, 0.03)",
              }}
            >
              <span
                className="text-xs tracking-[0.2em] uppercase"
                style={{
                  fontFamily: "var(--font-space-mono)",
                  color: "rgba(204,204,204,0.25)",
                }}
              >
                Coming soon
              </span>
            </div>
          </div>
        </section>

        {/* Team Workflow Sections */}
        <section className="px-6 pb-28">
          <div className="max-w-5xl mx-auto space-y-20">
            <SectionDivider label="Team Workflows" />
            {teams.map((team) => (
              <TeamSection key={team.id} team={team} />
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

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-5 w-full">
      <div
        className="flex-1 h-px"
        style={{ backgroundColor: "rgba(30,144,255,0.18)" }}
      />
      <p
        className="text-sm tracking-[0.22em] uppercase whitespace-nowrap font-semibold"
        style={{
          fontFamily: "var(--font-space-mono)",
          color: "rgba(255,255,255,0.75)",
        }}
      >
        {label}
      </p>
      <div
        className="flex-1 h-px"
        style={{ backgroundColor: "rgba(30,144,255,0.18)" }}
      />
    </div>
  );
}

function TeamSection({ team }: { team: Team }) {
  return (
    <div>
      {/* Team header */}
      <div className="mb-7">
        <h2
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "var(--font-inter)", color: "white" }}
        >
          {team.label}
        </h2>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
        >
          {team.description}
        </p>
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {team.sections.map((section) => (
          <ContentCard key={section.type} section={section} />
        ))}
      </div>
    </div>
  );
}

function ContentCard({ section }: { section: ContentSection }) {
  const inner = (
    <div
      className={[
        "group flex flex-col rounded-xl p-7 h-full transition-[transform,box-shadow,border-color] duration-300",
        section.available
          ? "hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(30,144,255,0.22)] cursor-pointer border border-[rgba(30,144,255,0.28)] hover:border-[rgba(30,144,255,0.55)]"
          : "cursor-default border border-[rgba(30,144,255,0.1)] opacity-50",
      ].join(" ")}
      style={{
        background: section.available
          ? "linear-gradient(160deg, #0e2345 0%, #091830 100%)"
          : "linear-gradient(160deg, #0b1b35 0%, #081528 100%)",
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-[rgba(30,144,255,0.18)]"
        style={{
          backgroundColor: section.available
            ? "rgba(30, 144, 255, 0.1)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${section.available ? "rgba(30,144,255,0.2)" : "rgba(255,255,255,0.06)"}`,
          color: section.available ? "#1E90FF" : "rgba(204,204,204,0.3)",
        }}
      >
        <SectionIcon type={section.type} />
      </div>

      <h2
        className="text-base font-semibold mb-2.5 tracking-tight"
        style={{
          fontFamily: "var(--font-inter)",
          color: section.available ? "white" : "rgba(255,255,255,0.45)",
        }}
      >
        {section.title}
      </h2>

      <p
        className="text-sm leading-relaxed flex-1"
        style={{
          fontFamily: "var(--font-inter)",
          color: section.available
            ? "rgba(204,204,204,0.85)"
            : "rgba(204,204,204,0.35)",
        }}
      >
        {section.description}
      </p>

      {section.available ? (
        <div
          className="mt-7 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3"
          style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
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
      ) : (
        <div
          className="mt-7 text-xs"
          style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.3)" }}
        >
          Coming soon
        </div>
      )}
    </div>
  );

  if (!section.available) return <div className="h-full">{inner}</div>;

  return (
    <Link href={section.href} className="h-full block">
      {inner}
    </Link>
  );
}

function SectionIcon({ type }: { type: ContentSection["type"] }) {
  if (type === "presentations") {
    return (
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
    );
  }

  if (type === "notion") {
    return (
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
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }

  return (
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
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
