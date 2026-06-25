import Link from "next/link";
import PageShell from "@/app/components/PageShell";
import Navbar from "@/app/components/Navbar";

const drills = [
  {
    id: "9news",
    label: "9news Triage",
    description:
      "Unlimited practice triaging real news headlines — the same format as the 9news training, drawing from the full question pool. Decide whether each article should be published, published as a results event, published as a calendar event, or marked irrelevant.",
    href: "/additional-learning/9news",
    pool: 199,
    accent: "#1E90FF",
    accentAlpha: "rgba(30,144,255,",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
        <path d="M16 2v4H8V2" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" />
      </svg>
    ),
  },
  {
    id: "ratings",
    label: "Ratings Triage",
    description:
      "Unlimited practice triaging real #ratings-news-events Slack alerts. 200 live examples — auto-published exchange links and no-company-found messages. Shuffles continuously so no two sessions feel the same.",
    href: "/additional-learning/ratings",
    pool: 200,
    accent: "#a855f7",
    accentAlpha: "rgba(168,85,247,",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export default function AdditionalLearningPage() {
  return (
    <PageShell>
      <Navbar subtitle="Additional Learning" showSignOut />

        {/* Header */}
        <section className="px-6 pt-20 pb-12 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
            style={{
              borderColor: "rgba(168,85,247,0.4)",
              backgroundColor: "rgba(168,85,247,0.08)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#a855f7" }} />
            <span
              className="text-xs tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-space-mono)", color: "#a855f7" }}
            >
              Additional Learning
            </span>
          </div>

          <h1
            className="font-bold tracking-tight leading-none mb-5"
            style={{
              fontFamily: "var(--font-inter)",
              color: "white",
              fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
            }}
          >
            Practice Drills
          </h1>
          <p
            className="max-w-xl mx-auto text-base leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.6)" }}
          >
            Unlimited repetition on real workflows. Drills run continuously — no fixed end — so you can keep practising until it&apos;s second nature.
          </p>
        </section>

        {/* Drill cards */}
        <section className="px-6 pb-28">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {drills.map((drill) => (
              <Link
                key={drill.id}
                href={drill.href}
                className="group flex flex-col rounded-xl p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 cursor-pointer border"
                style={{
                  background: "linear-gradient(160deg, #0e1a2e 0%, #070f1f 100%)",
                  borderColor: `${drill.accentAlpha}0.28)`,
                  boxShadow: "none",
                }}
                onMouseEnter={undefined}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"
                  style={{
                    backgroundColor: `${drill.accentAlpha}0.1)`,
                    border: `1px solid ${drill.accentAlpha}0.25)`,
                    color: drill.accent,
                  }}
                >
                  {drill.icon}
                </div>

                <h2
                  className="text-lg font-bold mb-2 tracking-tight"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {drill.label}
                </h2>

                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.65)" }}
                >
                  {drill.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      color: drill.accent,
                      backgroundColor: `${drill.accentAlpha}0.1)`,
                      border: `1px solid ${drill.accentAlpha}0.2)`,
                    }}
                  >
                    {drill.pool} questions
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3"
                    style={{ fontFamily: "var(--font-space-mono)", color: drill.accent }}
                  >
                    Start drilling
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

    </PageShell>
  );
}
