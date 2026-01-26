"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  // Hydration-safe: always start with a deterministic value (false)
  // and compute the real match after mount to avoid SSR/client mismatches.
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches("matches" in event ? event.matches : event.matches);
    };
    // Set initial value after mount
    handler(mql);
    if (mql.addEventListener) {
      mql.addEventListener("change", handler as EventListener);
    } else {
      // @ts-ignore older Safari
      mql.addListener(handler);
    }
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handler as EventListener);
      } else {
        // @ts-ignore older Safari
        mql.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}
