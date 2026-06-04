import Link from "next/link";

const items = [
  {
    id: "presentation",
    title: "Restructuring & Credit Markets 101",
    description:
      "A beginner's guide to investment grade, high yield and distressed debt — capital structures, financial distress, and the restructuring process.",
    href: "/general-learning/presentation",
    tag: "Presentation · 10 slides",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    cta: "View Presentation",
    available: true,
  },
  {
    id: "quiz",
    title: "Test Your Knowledge",
    description:
      "10 questions covering the core concepts from the Credit Markets 101 presentation. Work through them to check your understanding.",
    href: "/general-learning/quiz",
    tag: "Quiz · 10 questions",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    cta: "Start Quiz",
    available: true,
  },
];

export default function GeneralLearningPage() {
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
      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 120% 55% at 50% -5%, rgba(15, 60, 180, 0.5) 0%, transparent 65%)",
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
          <span
            className="text-xs tracking-[0.2em] uppercase hidden sm:block"
            style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.55)" }}
          >
            Onboarding Portal
          </span>
        </nav>

        {/* Header */}
        <section className="px-6 pt-16 pb-12">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs mb-8 transition-opacity hover:opacity-100 opacity-60"
              style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Portal
            </Link>

            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-6"
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
                General Learning
              </span>
            </div>

            <h1
              className="text-4xl font-bold tracking-tight mb-3"
              style={{ fontFamily: "var(--font-inter)", color: "white" }}
            >
              Financial Markets Fundamentals
            </h1>
            <p
              className="text-base max-w-xl"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.65)" }}
            >
              Start here before diving into your team workflow. These materials
              cover the core financial concepts you&apos;ll encounter every day at 9fin.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="flex-1 px-6 pb-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group flex flex-col rounded-xl p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(30,144,255,0.22)] border border-[rgba(30,144,255,0.28)] hover:border-[rgba(30,144,255,0.55)]"
                style={{ background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)" }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-[rgba(30,144,255,0.18)]"
                    style={{
                      backgroundColor: "rgba(30, 144, 255, 0.1)",
                      border: "1px solid rgba(30, 144, 255, 0.2)",
                      color: "#1E90FF",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                    style={{
                      fontFamily: "var(--font-space-mono)",
                      color: "#1E90FF",
                      backgroundColor: "rgba(30,144,255,0.1)",
                      border: "1px solid rgba(30,144,255,0.2)",
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                <h2
                  className="text-xl font-bold mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {item.title}
                </h2>

                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.75)" }}
                >
                  {item.description}
                </p>

                <div
                  className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3"
                  style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
                >
                  {item.cta}
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            ))}
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
