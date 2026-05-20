import Link from "next/link";

const guides = [
  {
    title: "9News",
    description: "Core reference for the 9News product and workflows.",
    href: "https://www.notion.so/9fin/9News-32522837308b80a29f33f0c40daf4d10",
  },
  {
    title: "News App",
    description: "Everything you need to know about the News App.",
    href: "https://www.notion.so/9fin/News-App-32822837308b80ada422da99baba5141",
  },
  {
    title: "Sponsor News",
    description: "Guide to sponsor news coverage and processes.",
    href: "https://www.notion.so/9fin/Sponsor-News-32722837308b8000a1dfee355aa8d9ee",
  },
  {
    title: "Ratings",
    description: "Reference guide for ratings content and methodology.",
    href: "https://www.notion.so/9fin/Ratings-32722837308b8077a40fe6d64a09b35e",
  },
  {
    title: "Adhoc Tasks",
    description: "DataOps News Channel adhoc task processes and guidelines.",
    href: "https://www.notion.so/9fin/DataOps-News-Channel-Adhoc-32822837308b801a9329eb05950942f1",
  },
  {
    title: "Jessie",
    description: "Guide to the Jessie email channel and how to use it.",
    href: "https://www.notion.so/9fin/Jessie-32722837308b80c69131d0cb8b8b86e3",
  },
  {
    title: "Company Profile Building",
    description: "Standards and process for building company profiles.",
    href: "https://www.notion.so/9fin/Company-Profile-Building-32722837308b808a9b5dd38db2be65dd",
  },
  {
    title: "Results Team Channel",
    description: "Guidelines and workflows for the Results Team.",
    href: "https://www.notion.so/9fin/Results-Team-Channel-32822837308b800a9d36f2a8c60bd93f",
  },
  {
    title: "News QA",
    description: "News Quality Assurance standards and review processes.",
    href: "https://www.notion.so/9fin/News-Quality-Assurance-32722837308b806daa32d0526e4aece1",
  },
  {
    title: "Crawlers",
    description: "9News sources, crawlers setup and maintenance.",
    href: "https://www.notion.so/9fin/Crawlers-9news-Sources-32522837308b802c943fceb89026f80c",
  },
];

export default function NotionGuides() {
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
              style={{ width: "80px", height: "auto" }}
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

        {/* Page header */}
        <section className="px-6 pt-20 pb-14 text-center">
          <Link
            href="/"
            className="flex justify-center items-center gap-1.5 text-xs mb-10 transition-opacity hover:opacity-75"
            style={{
              fontFamily: "var(--font-space-mono)",
              color: "rgba(204,204,204,0.45)",
            }}
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
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Portal
          </Link>

          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
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
              Reference Docs
            </span>
          </div>

          <h1
            className="font-bold tracking-tight leading-none mb-5"
            style={{
              fontFamily: "var(--font-inter)",
              color: "white",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            }}
          >
            Notion Guides
          </h1>

          <p
            className="text-base md:text-lg max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-inter)", color: "#CCCCCC" }}
          >
            Deep-dive reference docs for every part of the job. Open any guide
            directly in Notion.
          </p>
        </section>

        {/* Guide grid */}
        <section className="flex-1 px-6 pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <a
                key={guide.title}
                href={guide.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(30,144,255,0.2)]"
                style={{
                  background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                  border: "1px solid rgba(30, 144, 255, 0.28)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(30, 144, 255, 0.1)",
                    border: "1px solid rgba(30, 144, 255, 0.2)",
                    color: "#1E90FF",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                </div>

                <h2
                  className="text-sm font-semibold mb-2 tracking-tight"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {guide.title}
                </h2>

                <p
                  className="text-xs leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-inter)", color: "#CCCCCC" }}
                >
                  {guide.description}
                </p>

                <div
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-2.5"
                  style={{
                    fontFamily: "var(--font-space-mono)",
                    color: "#1E90FF",
                  }}
                >
                  Open in Notion
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          className="text-center py-6 text-xs border-t"
          style={{
            fontFamily: "var(--font-space-mono)",
            color: "rgba(204,204,204,0.4)",
            borderColor: "rgba(30,144,255,0.1)",
          }}
        >
          9fin Onboarding © 2025
        </footer>
      </div>
    </div>
  );
}
