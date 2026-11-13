"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * True while the element is on screen. Every Boletapp widget uses it to pause
 * its loop off screen (perf rule: nothing animates where nobody is looking).
 * With `once`, it latches true on first entry (for one-shot reveals).
 */
export function useInView(ref: RefObject<Element | null>, once = false): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setInView(entry.isIntersecting);
      if (once && entry.isIntersecting) io.disconnect();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once]);
  return inView;
}

/** Widgets swap motion for a static end state when this is set. */
export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** Desktop browser chrome: three dots and a URL pill. */
export function BrowserFrame({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bp-browser ${className ?? ""}`}>
      <div className="bp-browser-bar" aria-hidden>
        <span className="bp-dot" />
        <span className="bp-dot" />
        <span className="bp-dot" />
        <span className="bp-url">{url}</span>
      </div>
      <div className="bp-browser-body">{children}</div>
    </div>
  );
}

/** An iPhone body with the dynamic island; the screen is 390:844. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bp-phone ${className ?? ""}`}>
      <div className="bp-phone-screen">
        {children}
        <span className="bp-phone-island" aria-hidden />
      </div>
    </div>
  );
}

type ClipVideoProps = {
  src: string;
  poster?: string;
  label: string;
  /** Full video with native controls (no autoplay, sound allowed). */
  controls?: boolean;
  className?: string;
};

/**
 * A muted looping product clip that only plays while on screen. If the clip
 * is missing it falls back to the poster, and if that is missing too, to a
 * neutral dark panel: an absent asset never breaks the page.
 */
export function ClipVideo({ src, poster, label, controls, className }: ClipVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef);
  const reduced = usePrefersReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  // The SSR'd <video> starts loading before hydration, so a 404 can fire its
  // error event before React listens. Check the element's state on mount too.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const fail = () => setVideoFailed(true);
    if (v.error) queueMicrotask(fail);
    v.addEventListener("error", fail);
    return () => v.removeEventListener("error", fail);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || controls || videoFailed) return;
    if (inView && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduced, controls, videoFailed]);

  return (
    <div ref={boxRef} className={`bp-clip ${className ?? ""}`}>
      {!videoFailed ? (
        <video
          ref={ref}
          src={src}
          poster={posterFailed ? undefined : poster}
          aria-label={label}
          muted={!controls}
          loop={!controls}
          playsInline
          controls={controls || reduced}
          preload={controls ? "metadata" : "none"}
        />
      ) : poster && !posterFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt={label} loading="lazy" onError={() => setPosterFailed(true)} />
      ) : (
        <div className="bp-clip-empty" role="img" aria-label={label} />
      )}
    </div>
  );
}
