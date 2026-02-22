"use client";

import React from "react";

export function LoaderOne() {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      {/* Outer spinning ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, #6B7A45 360deg)",
          animation: "spin 1.2s linear infinite",
          WebkitMask:
            "radial-gradient(circle, transparent 56%, black 57%)",
          mask: "radial-gradient(circle, transparent 56%, black 57%)",
        }}
      />
      {/* Inner pulsing dot */}
      <div className="h-4 w-4 rounded-full bg-[#6B7A45] animate-pulse" />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Full-screen overlay that renders LoaderOne centered on the viewport.
 * Rendered on top of everything via a fixed portal-like div.
 */
export function LoaderOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm">
      <LoaderOne />
      {message && (
        <p className="mt-6 text-sm font-medium text-[#a3a3a3] tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}
