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
  const [iframeLoaded, setIframeLoaded] = useState(false);
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
          {/* Section divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,144,255,0.12)" }} />
            <p
              className="text-xs tracking-[0.25em] uppercase whitespace-nowrap"
              style={{ fontFamily: "var(--font-space-mono)", color: "rgba(204,204,204,0.4)" }}
            >
              Staging Apps
            </p>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(30,144,255,0.12)" }} />
          </div>

          {/* App cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stagingApps.map((app) => (
              <button
                key={app.title}
                onClick={() => { setActiveApp(app); setIframeLoaded(false); }}
                className="group text-left flex flex-col rounded-xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(30,144,255,0.2)]"
                style={{
                  background: "linear-gradient(160deg, #0e2345 0%, #091830 100%)",
                  border: "1px solid rgba(30, 144, 255, 0.28)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(30, 144, 255, 0.1)",
                    border: "1px solid rgba(30, 144, 255, 0.2)",
                    color: "#1E90FF",
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <polyline points="8 21 12 17 16 21" />
                  </svg>
                </div>

                <h2
                  className="text-sm font-semibold mb-2 tracking-tight"
                  style={{ fontFamily: "var(--font-inter)", color: "white" }}
                >
                  {app.title}
                </h2>

                <p
                  className="text-xs leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-inter)", color: "#CCCCCC" }}
                >
                  {app.description}
                </p>

                <div
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200 group-hover:gap-2.5"
                  style={{ fontFamily: "var(--font-space-mono)", color: "#1E90FF" }}
                >
                  Open App
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
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

            {/* Auth hint banner — hidden once iframe loads */}
            {!iframeLoaded && <div
              className="flex items-center justify-between px-4 py-2 flex-shrink-0 text-xs"
              style={{
                backgroundColor: "rgba(30, 144, 255, 0.07)",
                borderBottom: "1px solid rgba(30, 144, 255, 0.12)",
                fontFamily: "var(--font-space-mono)",
                color: "rgba(204,204,204,0.5)",
              }}
            >
              <span>First time? Use the ↗ button above to sign in, then reload this panel.</span>
              <button
                onClick={() => {
                  const iframe = document.querySelector(`iframe[title="${activeApp.title}"]`) as HTMLIFrameElement;
                  if (iframe) iframe.src = iframe.src;
                }}
                className="ml-4 flex-shrink-0 transition-colors hover:text-white"
                style={{ color: "rgba(30,144,255,0.7)" }}
              >
                Reload
              </button>
            </div>}

            {/* iframe */}
            <iframe
              src={activeApp.href}
              className="flex-1 w-full border-0"
              title={activeApp.title}
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      )}
    </>
  );
}
