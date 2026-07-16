"use client";

import type { ReactNode } from "react";
import BackgroundGridSpotlight from "@/components/layout/BackgroundGridSpotlight";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SocialRail from "@/components/layout/SocialRail";
import SpotlightOverlay from "@/components/layout/SpotlightOverlay";

type SiteChromeProps = {
  children: ReactNode;
  showSpotlight?: boolean;
  onEnterLink?: () => void;
  onLeaveLink?: () => void;
  mainClassName?: string;
};

export default function SiteChrome({
  children,
  showSpotlight = false,
  onEnterLink,
  onLeaveLink,
  mainClassName,
}: SiteChromeProps) {
  return (
    <>
      <BackgroundGridSpotlight />
      <Header enterLink={onEnterLink} leaveLink={onLeaveLink} />
      <SocialRail onEnter={onEnterLink} onLeave={onLeaveLink} />

      {showSpotlight && <SpotlightOverlay />}

      <main className={mainClassName ?? "relative z-[10]"} style={{ cursor: "none" }}>
        {children}
      </main>

      <Footer />
    </>
  );
}
