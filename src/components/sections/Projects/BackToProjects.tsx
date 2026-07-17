"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { clearReturnPoint, consumeReturnPoint, morphTo } from "./openProject";

type Props = {
  slug: string;
  label: string;
  isDark: boolean;
};

/**
 * Back out of a project story and land on the exact card you clicked.
 *
 * If the visitor arrived by clicking a card we stored the y they left from, so
 * we go back and replay it. If they arrived cold (a shared link, a search
 * result) there is nothing to return to, so we send them to the projects page
 * instead of trapping them in browser history.
 */
export default function BackToProjects({ slug, label, isDark }: Props) {
  const router = useRouter();

  // Warm the destination so the morph doesn't wait on a fetch.
  useEffect(() => {
    router.prefetch("/projects");
  }, [router]);

  const goBack = () => {
    const y = consumeReturnPoint(slug);
    if (y === null) {
      morphTo(() => router.push("/projects"));
      return;
    }
    clearReturnPoint();
    morphTo(() => router.back());
    // The router restores its own scroll, but the recorded y is the one the
    // card was actually at; re-apply it once the previous page has painted.
    const restore = () => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    requestAnimationFrame(() => setTimeout(restore, 60));
    setTimeout(restore, 300);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      data-cursor="pointer"
      className="back-to-projects glass-tile inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-transform hover:-translate-x-0.5 self-start"
      style={{ cursor: "none", color: isDark ? "rgba(226,232,240,0.92)" : "rgba(15,23,42,0.85)" }}
    >
      <ArrowLeft size={14} aria-hidden />
      {label}
    </button>
  );
}
