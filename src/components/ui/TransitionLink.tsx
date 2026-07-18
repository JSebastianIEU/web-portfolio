"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type TransitionLinkProps = ComponentProps<typeof Link>;

/**
 * A next/link that navigates inside a View Transition when the browser
 * supports it: the old page zooms away and the new one settles in (see the
 * ::view-transition rules in globals.css). Falls back to a normal client
 * navigation everywhere else, and steps aside for modified clicks and
 * new-tab gestures.
 */
export default function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    const url = typeof href === "string" ? href : href.pathname ?? "";
    if (!url.startsWith("/")) return; // external: let the browser handle it

    // In-page anchors scroll, they don't morph. They also must NOT go through
    // the router: pushing "/#about" while already on "/" makes App Router
    // re-run its own scroll handling and it lands hundreds of pixels past the
    // section ("halfway"). A native scrollIntoView honours scroll-margin-top
    // and scroll-behavior, and lands exactly.
    if (url.includes("#")) {
      const [rawPath, hash] = url.split("#");
      const path = rawPath.replace(/\/$/, "") || "/";
      const here = window.location.pathname.replace(/\/$/, "") || "/";
      if (path !== here) return; // cross-route anchor: let <Link> do its thing

      const target = hash && document.getElementById(hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView();
      // Keep the URL (and Back) in sync without triggering a navigation.
      window.history.pushState(null, "", `#${hash}`);
      return;
    }

    const doc = document as Document & {
      startViewTransition?: (cb: () => Promise<void> | void) => void;
    };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // plain client-side navigation via <Link>
    }

    event.preventDefault();
    doc.startViewTransition(() => {
      router.push(url);
      // Give the route change a beat to commit before the "new" snapshot.
      return new Promise<void>((resolve) => setTimeout(resolve, 260));
    });
  };

  return (
    <Link href={href} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
}
