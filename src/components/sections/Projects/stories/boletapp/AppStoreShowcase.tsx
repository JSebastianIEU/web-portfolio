"use client";

import { useState } from "react";
import { BrowserFrame } from "./ProductFrames";

const BASE = "/images/projects/boletapp/appstore";
const APPS = {
  fan: { name: "Boletapp", url: "apps.apple.com/co/app/boletapp", shots: 6 },
  pro: { name: "Boletapp Pro", url: "apps.apple.com/co/app/boletapp-pro", shots: 5 },
} as const;
type AppId = keyof typeof APPS;

/** The two App Store listings, switchable by tab, with each app's store screenshots below. */
export default function AppStoreShowcase({ es }: { es: boolean }) {
  const [app, setApp] = useState<AppId>("fan");
  const current = APPS[app];
  return (
    <div className="bp-appstore">
      <p className="bp-appstore-title">{es ? "En la App Store" : "On the App Store"}</p>
      <div className="bp-appstore-tabs" role="tablist" aria-label={es ? "Ficha de la app" : "App listing"}>
        {(Object.keys(APPS) as AppId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`bp-appstore-tab-${id}`}
            aria-selected={app === id}
            aria-controls="bp-appstore-panel"
            className="bp-appstore-tab"
            onClick={() => setApp(id)}
          >
            {APPS[id].name}
          </button>
        ))}
      </div>
      <div id="bp-appstore-panel" role="tabpanel" aria-labelledby={`bp-appstore-tab-${app}`} className="bp-appstore-panel">
        <BrowserFrame url={current.url} className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="bp-appstore-ficha"
            src={`${BASE}/${app}-ficha.webp`}
            alt={es ? `Ficha de ${current.name} en la App Store` : `${current.name} App Store listing`}
            width={1440}
            height={900}
            loading="lazy"
          />
        </BrowserFrame>
        <ul className="bp-appstore-shots" aria-label={es ? "Pantallazos de tienda" : "Store screenshots"}>
          {Array.from({ length: current.shots }, (_, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              <li key={`${app}-${n}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE}/${app}-${n}.webp`}
                  alt={es ? `${current.name}, pantallazo ${i + 1}` : `${current.name}, screenshot ${i + 1}`}
                  width={540}
                  height={1174}
                  loading="lazy"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
