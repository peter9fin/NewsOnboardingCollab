"use client";

import { useEffect, useState } from "react";

interface Props {
  show: boolean;
  label: string;        // e.g. "Next Step: Presentations"
  href: string;         // where clicking takes you
  onDismiss: () => void;
}

export default function NextStepToast({ show, label, href, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Small delay so the animation is visible
      const t = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [show]);

  // Auto-dismiss after 10s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onDismiss(), 10000);
    return () => clearTimeout(t);
  }, [visible, onDismiss]);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-xl px-4 py-3.5 shadow-2xl transition-all duration-500"
      style={{
        background: "linear-gradient(135deg, #0e2345 0%, #091830 100%)",
        border: "1px solid rgba(30,144,255,0.4)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,144,255,0.1)",
        transform: visible ? "translateY(0)" : "translateY(24px)",
        opacity: visible ? 1 : 0,
        maxWidth: "320px",
      }}
    >
      {/* Pulse dot */}
      <span
        className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
        style={{ backgroundColor: "#22c55e" }}
      />

      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold"
          style={{ fontFamily: "var(--font-inter)", color: "white" }}
        >
          Step complete!
        </p>
        <p
          className="text-xs mt-0.5 truncate"
          style={{ fontFamily: "var(--font-inter)", color: "rgba(204,204,204,0.65)" }}
        >
          {label}
        </p>
      </div>

      <a
        href={href}
        className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:brightness-110"
        style={{
          fontFamily: "var(--font-inter)",
          backgroundColor: "#1E90FF",
          color: "white",
        }}
      >
        Continue
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </a>

      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-1 rounded transition-colors hover:bg-[rgba(255,255,255,0.06)]"
        style={{ color: "rgba(204,204,204,0.4)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
