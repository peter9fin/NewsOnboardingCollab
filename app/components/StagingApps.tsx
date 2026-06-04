"use client";

import { useState, useRef, useEffect } from "react";

const stagingApps = [
  {
    title: "9news Staging",
    description: "9news staging environment for testing and QA.",
    href: "https://9news.staging.9fin.net/triage",
  },
  {
    title: "9admin Staging",
    description: "9admin staging environment for admin workflows.",
    href: "https://9admin.staging.9fin.net/",
  },
  {
    title: "NewsApp Staging",
    description: "NewsApp staging environment for testing and QA.",
    href: "https://news.staging.9fin.net/",
  },
];

export default function StagingApps() {
  const [activeApp, setActiveApp] = useState<(typeof stagingApps)[0] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const closeApp = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    setActiveApp(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <section className="px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 pl-4" style={{ borderLeft: "2px solid #1E90FF" }}>
            <h2
              className="text-xl font-bold tracking-tight mb-1"
              style={{ fontFamily: "var(--font-inter)", color: "white" }}
            >
              Staging Apps
            </h2>
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.55)" }}
            >
              Live staging environments for hands-on practice. Open in a new tab to sign in first, then launch embedded below.
            </p>
          </div>

          {/* App cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stagingApps.map((app) => (
              <button
                key={app.title}
                onClick={() => setActiveApp(app)}
                className="group text-left flex flex-col rounded-xl p-8 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(30,144,255,0.22)] border border-[rgba(30,144,255,0.28)] hover:border-[rgba(30,144,255,0.55)]"
                style={{
                  background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-7 transition-colors duration-300 group-hover:bg-[rgba(30,144,255,0.18)]"
                  style={{
                    backgroundColor: "rgba(30, 144, 255, 0.1)",
                    border: "1px solid rgba(30, 144, 255, 0.2)",
                    color: "#1E90FF",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <polyline points="8 21 12 17 16 21" />
                  </svg>
                </div>

                <h2
                  className="text-xl font-bold mb-3 tracking-tight"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {app.title}
                </h2>

                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.75)" }}
                >
                  {app.description}
                </p>

                <div
                  className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-3"
                  style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
                >
                  Open App
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal overlay */}
      {activeApp && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
          onClick={closeApp}
        >
          <div
            ref={modalRef}
            className="flex flex-col w-full max-w-6xl rounded-xl overflow-hidden"
            style={{
              height: "88vh",
              background: "#0A1628",
              border: "1px solid rgba(30, 144, 255, 0.3)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
              style={{
                borderColor: "rgba(30, 144, 255, 0.2)",
                backgroundColor: "rgba(10, 22, 40, 0.98)",
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#1E90FF" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {activeApp.title}
                </span>
                <span
                  className="text-xs truncate hidden sm:block"
                  style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.35)" }}
                >
                  {activeApp.href}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {/* Open in new tab */}
                <a
                  href={activeApp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded transition-colors hover:bg-[rgba(30,144,255,0.12)] flex items-center"
                  style={{ color: "rgba(204,204,204,0.55)" }}
                  title="Open in new tab (sign in here first if needed)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>

                {/* Fullscreen toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded transition-colors hover:bg-[rgba(30,144,255,0.12)]"
                  style={{ color: "rgba(204,204,204,0.55)" }}
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20" />
                      <polyline points="20 10 14 10 14 4" />
                      <line x1="10" y1="14" x2="3" y2="21" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  )}
                </button>

                {/* Close button */}
                <button
                  onClick={closeApp}
                  className="p-1.5 rounded transition-colors hover:bg-[rgba(255,60,60,0.12)]"
                  style={{ color: "rgba(204,204,204,0.55)" }}
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* iframe */}
            <iframe
              src={activeApp.href}
              className="flex-1 w-full border-0"
              title={activeApp.title}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
