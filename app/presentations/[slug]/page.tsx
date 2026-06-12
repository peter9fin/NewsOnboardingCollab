import Link from "next/link";
import { notFound } from "next/navigation";
import { presentations } from "../data";

export function generateStaticParams() {
  return presentations
    .filter((p) => p.embedUrl !== null)
    .map((p) => ({ slug: p.slug }));
}

export default async function PresentationViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deck = presentations.find((p) => p.slug === slug);

  if (!deck || !deck.embedUrl) notFound();

  const teamLabels: Record<string, string> = {
    "9news": "9news",
    "ratings": "Ratings",
    "newsapp": "NewsApp",
  };
  const backHref = deck.team ? `/${deck.team}` : "/";
  const backLabel = deck.team ? (teamLabels[deck.team] ?? deck.team) : "Portal";

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

        {/* Breadcrumb + title */}
        <div className="px-6 pt-10 pb-6 max-w-6xl mx-auto w-full">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-6">
            <Link
              href={backHref}
              className="text-xs transition-opacity hover:opacity-100 opacity-60 inline-flex items-center gap-1.5"
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "#1E90FF",
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
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {backLabel}
            </Link>
            <span
              className="text-xs"
              style={{ color: "rgba(204,204,204,0.3)" }}
            >
              /
            </span>
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-space-mono)",
                color: "rgba(204,204,204,0.6)",
              }}
            >
              {deck.title}
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
              {deck.tag}
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
            {deck.title}
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.7)" }}
          >
            {deck.description}
          </p>
        </div>

        {/* Iframe viewer */}
        <div className="flex-1 px-6 pb-24 max-w-6xl mx-auto w-full">
          <div
            className="w-full rounded-xl overflow-hidden"
            style={{
              border: "1px solid rgba(30, 144, 255, 0.2)",
              boxShadow: "0 0 64px rgba(30,144,255,0.1)",
              aspectRatio: "16 / 9",
            }}
          >
            <iframe
              src={deck.embedUrl}
              className="w-full h-full"
              allowFullScreen
              title={deck.title}
            />
          </div>
        </div>

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
