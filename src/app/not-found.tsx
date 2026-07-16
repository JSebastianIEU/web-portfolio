"use client";

import Link from "next/link";
import SectionShell from "@/components/layout/SectionShell";
import SiteChrome from "@/components/layout/SiteChrome";
import { useTheme } from "@/components/providers/theme-provider";
import { CustomCursorDot, useCustomCursor } from "@/components/ui/CustomCursor";

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { enableCustomCursor, cursorVariant } = useCustomCursor();

  return (
    <>
      <SiteChrome showSpotlight={enableCustomCursor} mainClassName="relative z-[10]">
        <SectionShell className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
              Page not found
            </h1>
            <p style={{ color: isDark ? "rgba(226,232,240,0.8)" : "rgba(15,23,42,0.7)" }}>
              The page you are looking for does not exist.
            </p>
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-semibold"
              data-cursor="pointer"
              style={{
                border: isDark ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(15,23,42,0.2)",
                color: isDark ? "rgba(248,250,252,0.92)" : "rgba(15,23,42,0.9)",
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
              }}
            >
              Go home
            </Link>
          </div>
        </SectionShell>
      </SiteChrome>

      {enableCustomCursor && <CustomCursorDot variant={cursorVariant} isDark={isDark} />}
    </>
  );
}
