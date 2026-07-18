import puppeteer from "puppeteer";
import fs from "fs";
const ROOT = "/Users/juansebastianpenadonneys/web-portfolio/public/images/projects/ie-tower/gallery/";
const FLOORS = ["floor23","floor21","floor19","floor17","floor15","floor13",
                "floor11","floor9","floor7","floor5","floor3","basement2"];
const label = (f) => f.startsWith("basement") ? "B" + f.replace("basement","") : f.replace("floor","");
const tile = (f) => `
  <div class="cell">
    <img src="data:image/webp;base64,${fs.readFileSync(ROOT + f + ".webp").toString("base64")}">
    <span class="lbl">${label(f)}</span>
  </div>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<style>
 *{margin:0;padding:0;box-sizing:border-box}
 body{width:1280px;height:720px;background:#05060d;overflow:hidden;position:relative;
      font-family:"Space Grotesk",monospace}
 .grid{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
       gap:4px;width:100%;height:100%}
 .cell{position:relative;overflow:hidden;background:#0c1020}
 .cell img{width:100%;height:100%;object-fit:cover;display:block;
           filter:saturate(.82) brightness(.92)}
 .lbl{position:absolute;left:9px;top:8px;font-size:15px;font-weight:700;
      color:rgba(248,250,252,.96);letter-spacing:.06em;
      text-shadow:0 1px 5px rgba(0,0,0,.95),0 0 14px rgba(0,0,0,.7)}
 /* Vignette so the grid recedes and the caption reads on top of it. */
 .veil{position:absolute;inset:0;pointer-events:none;
   background:linear-gradient(180deg,rgba(5,6,13,.28) 0%,rgba(5,6,13,.04) 30%,rgba(5,6,13,.62) 68%,rgba(5,6,13,.97) 100%)}
 .cap{position:absolute;left:34px;right:34px;bottom:34px}
 .cap .k{font-size:15px;letter-spacing:.30em;text-transform:uppercase;
         color:rgba(148,163,184,.95);margin-bottom:9px}
 .cap .t{font-size:35px;font-weight:700;color:#f8fafc;line-height:1.14;letter-spacing:-.3px}
 .rule{position:absolute;left:34px;bottom:20px;width:64px;height:3px;border-radius:2px;
       background:linear-gradient(90deg,#22d3ee,#a78bfa)}
</style></head><body>
 <div class="grid">${FLOORS.map(tile).join("")}</div>
 <div class="veil"></div>
 <div class="cap">
   <div class="k">Visual place recognition</div>
   <div class="t">${process.env.LANG_T === "es" ? "¿En qué planta estás?" : "Which floor are you on?"}</div>
 </div>
 <div class="rule"></div>
</body></html>`;

const b = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_BIN, args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: "networkidle0" });
await new Promise(r => setTimeout(r, 900));
await p.screenshot({ path: process.env.OUT });
await b.close();
console.log("generado", process.env.OUT.split("/").pop());
