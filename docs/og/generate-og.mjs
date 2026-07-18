import puppeteer from "puppeteer";
import fs from "fs";

const ROOT = "/Users/juansebastianpenadonneys/web-portfolio";
const b64 = (p) => fs.readFileSync(ROOT + p).toString("base64");
const portrait = `data:image/webp;base64,${b64("/public/stickers/neonlinkedin.webp")}`;

const ES = process.env.LANG_OG === "es";
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Sora:wght@400;600&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; overflow:hidden; background:#05060d;
         font-family:"Sora",system-ui,sans-serif; color:#e5e7eb; position:relative; }

  /* Same dotted grid the site uses as its base layer. */
  .grid { position:absolute; inset:0;
    background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0);
    background-size:30px 30px; opacity:.35; }

  /* Violet halo behind the portrait, echoing .portrait-glow on the About section. */
  .halo { position:absolute; right:-40px; top:-80px; width:780px; height:780px; border-radius:50%;
    background:radial-gradient(circle at 50% 45%,
      rgba(167,139,250,.30) 0%, rgba(56,189,248,.10) 44%, rgba(167,139,250,0) 70%); }
  .halo-2 { position:absolute; left:-220px; bottom:-260px; width:620px; height:620px; border-radius:50%;
    background:radial-gradient(circle, rgba(34,211,238,.14) 0%, rgba(34,211,238,0) 68%); }

  .wrap { position:relative; height:100%; display:flex; align-items:center;
          padding:0 68px; gap:40px; }
  .left { flex:1; min-width:0; }

  .eyebrow { font-family:"Space Grotesk",monospace; font-size:19px; letter-spacing:.30em;
    text-transform:uppercase; color:rgba(148,163,184,.95); margin-bottom:20px; }

  h1 { font-family:"Space Grotesk",sans-serif; font-weight:700; font-size:70px; line-height:1.04;
       color:#f8fafc; letter-spacing:-.5px; margin-bottom:22px; }

  .tag { font-size:25px; line-height:1.42; color:rgba(226,232,240,.80); max-width:19ch; }
  .tag b { color:#f8fafc; font-weight:600; }

  .rule { width:78px; height:3px; border-radius:2px; margin:30px 0 26px;
          background:linear-gradient(90deg,#22d3ee,#a78bfa); }

  .chips { display:flex; gap:11px; flex-wrap:wrap; }
  .chip { font-family:"Space Grotesk",monospace; font-size:16px; letter-spacing:.05em;
    padding:8px 15px; border-radius:999px; color:rgba(226,232,240,.92);
    border:1px solid rgba(255,255,255,.17); background:rgba(255,255,255,.045); }

  .right { width:392px; flex-shrink:0; display:flex; align-items:flex-end; justify-content:center;
           align-self:stretch; }
  .right img { width:392px; height:auto; display:block;
    filter:drop-shadow(0 0 3px rgba(167,139,250,.62))
           drop-shadow(0 0 26px rgba(167,139,250,.26))
           drop-shadow(0 22px 48px rgba(0,0,0,.62)); }

  .url { position:absolute; left:68px; bottom:40px; font-family:"Space Grotesk",monospace;
    font-size:19px; letter-spacing:.16em; color:rgba(148,163,184,.85); }
</style></head><body>
  <div class="grid"></div><div class="halo"></div><div class="halo-2"></div>
  <div class="wrap">
    <div class="left">
      <div class="eyebrow">AI &amp; Data Engineer &middot; Madrid</div>
      <h1>Juan&nbsp;Sebastian<br>Peña</h1>
      <div class="tag">${ES ? "Construyo productos de cliente <b>de punta a punta</b>." : "I build client products <b>end-to-end</b>."}</div>
      <div class="rule"></div>
      <div class="chips">
        <span class="chip">LLM agents</span>
        <span class="chip">Data &amp; ML</span>
        <span class="chip">${ES ? "Producción" : "Production"}</span>
      </div>
    </div>
    <div class="right"><img src="${portrait}" alt=""></div>
  </div>
  <div class="url">juansebastianpena.dev</div>
</body></html>`;

const b = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_BIN, args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1200));
await p.screenshot({ path: process.env.OUT, type: "png" });
await b.close();
console.log("generada", process.env.OUT.split("/").pop());
