"use client";

import { useSyncExternalStore } from "react";

const getMatches = (query: string) => {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
};

const subscribe = (query: string, callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(query);
  const handler = () => callback();

  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }

  if (typeof mql.addListener === "function") {
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }

  return () => {};
};

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => getMatches(query),
    () => false,
  );
}
