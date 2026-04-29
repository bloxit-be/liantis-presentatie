# Liantis demo-presentatie — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bouw een korte (~5 min) Liantis-gestylede demo-presentatie op Reveal.js (12 slides, met persistente tijdlijn-strip + scrubber-animatie en cinematic year-flash) plus een handout-pagina met links naar de twee live demo's.

**Architecture:** Static HTML/CSS/JS — geen build-step. Eén `index.html` laadt slides per `fetch()` zoals in `smartpeak/ems-presentatie-repo`. Reveal.js 4.x als vendored bundle. Tijdlijn-animatie via één `js/timeline.js` module die `Reveal.on('slidechanged')` consumeert. Handout-pagina is volledig zelfstandig HTML, deelt enkel de Liantis brand-CSS.

**Tech Stack:** Reveal.js 4.x (vendored), vanilla JS modules, Liantis brand-tokens in CSS variabelen, Poppins web-font (self-hosted woff2), Python http.server voor lokale dev, GitHub Pages voor deploy.

**Spec:** `docs/superpowers/specs/2026-04-29-liantis-demo-presentatie-design.md`

---

## File Structure

| File | Verantwoordelijkheid |
|---|---|
| `index.html` | Reveal.js entry, laadt slides per `fetch()` |
| `css/reveal-overrides.css` | Liantis brand-tokens + Reveal-overrides + Poppins-faces |
| `css/timeline.css` | Tijdlijn-strip + scrubber + year-flash animatie |
| `js/main.js` | Reveal init, key-bindings (F = fullscreen) |
| `js/timeline.js` | Inject tijdlijn-strip in slides 1-4, scrubber-animatie, year-flash one-shot |
| `slides/00-titel.html` | Titel-slide "Demo's" |
| `slides/01-time-jump.html` | "Even terug in de tijd" + year-flash trigger |
| `slides/02-twee-jaar-geleden.html` | NACEBEL eerste PoC (>1 week werk) |
| `slides/03-zes-maanden-geleden.html` | Ignite-PoCs (≤1 dag) |
| `slides/04-dinsdag.html` | Upgrade dinsdag (2u) |
| `slides/05-demo1-overview.html` | NACEBEL Form→Mail-diagram |
| `slides/06-demo1-live.html` | Sobere "DEMO" overgangsslide |
| `slides/07-demo2-overview.html` | Eenmanszaak Chat→Mail/JSON met input-cycle fragments |
| `slides/08-demo2-live.html` | Sobere "DEMO" overgangsslide |
| `slides/09-vragen.html` | Q&A slide |
| `slides/10-probeer-zelf.html` | QR + URL + disclaimer |
| `slides/11-one-more-thing.html` | "One more thing" reveal |
| `handout/index.html` | Standalone handout-pagina met demo-cards |
| `handout/style.css` | Handout-only styling (deelt brand-tokens) |
| `assets/fonts/Poppins-*.woff2` | Self-hosted Poppins (400, 600, 700, 800) |
| `assets/liantis-logo.svg` | Logo (te genereren als simpel SVG-tekst-mark) |
| `assets/qr-handout.svg` | QR-placeholder (later vervangen) |
| `vendor/reveal.js/` | Reveal.js 4.x vendored vanaf reference-repo |

---

## Task 1: Vendor Reveal.js + Poppins-font + brand-CSS

**Files:**
- Create: `vendor/reveal.js/` (gekopieerd uit `/home/ubuntu/kevin/smartpeak/ems-presentatie-repo/vendor/reveal.js/`)
- Create: `assets/fonts/Poppins-Regular.woff2`, `Poppins-SemiBold.woff2`, `Poppins-Bold.woff2`, `Poppins-ExtraBold.woff2`
- Create: `css/reveal-overrides.css`
- Create: `assets/liantis-logo.svg`

- [ ] **Step 1: Vendor Reveal.js vanaf reference-repo**

```bash
cp -R /home/ubuntu/kevin/smartpeak/ems-presentatie-repo/vendor /home/ubuntu/kevin/liantis-presentatie/
ls /home/ubuntu/kevin/liantis-presentatie/vendor/reveal.js/dist/
```

Expected: `reset.css reveal.css reveal.esm.js ... theme/` zichtbaar.

- [ ] **Step 2: Download Poppins woff2's vanaf Google Fonts API**

```bash
mkdir -p /home/ubuntu/kevin/liantis-presentatie/assets/fonts
cd /home/ubuntu/kevin/liantis-presentatie/assets/fonts
# Pak google-fonts-helper of trek direct:
for w in 400 600 700 800; do
  curl -s "https://fonts.googleapis.com/css2?family=Poppins:wght@${w}&display=swap" -H "User-Agent: Mozilla/5.0" -o /tmp/poppins-${w}.css
  url=$(grep -oP 'https://[^)]*\.woff2' /tmp/poppins-${w}.css | head -1)
  curl -sL "$url" -o "Poppins-${w}.woff2"
done
ls -la
```

Expected: 4 woff2-bestanden, elk > 20KB.

- [ ] **Step 3: Maak Liantis-logo SVG (simpele tekst-mark)**

Write `/home/ubuntu/kevin/liantis-presentatie/assets/liantis-logo.svg`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" role="img" aria-label="Liantis demo">
  <text x="0" y="44" font-family="Poppins, system-ui, sans-serif" font-size="40" font-weight="700" fill="#7843A5" letter-spacing="-1">liantis</text>
  <text x="172" y="44" font-family="Poppins, system-ui, sans-serif" font-size="40" font-weight="300" fill="#29004d" letter-spacing="-1">·</text>
</svg>
```

- [ ] **Step 4: Schrijf Liantis-brand CSS**

Write `/home/ubuntu/kevin/liantis-presentatie/css/reveal-overrides.css`:

```css
/* Liantis demo-deck — Reveal overrides */

@font-face {
  font-family: 'Poppins';
  font-weight: 400;
  font-display: swap;
  src: url('../assets/fonts/Poppins-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-weight: 600;
  font-display: swap;
  src: url('../assets/fonts/Poppins-600.woff2') format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-weight: 700;
  font-display: swap;
  src: url('../assets/fonts/Poppins-700.woff2') format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-weight: 800;
  font-display: swap;
  src: url('../assets/fonts/Poppins-800.woff2') format('woff2');
}

:root {
  --lp-purple: #7843A5;
  --lp-purple-dark: #29004d;
  --lp-cream: #f9f2ff;
  --lp-text: #1a1230;
  --lp-text-muted: #6b5f80;
  --lp-bg: #ffffff;
  --lp-border: #e6daf3;
  --lp-accent: #f5a623;
}

.reveal {
  font-family: 'Poppins', system-ui, sans-serif;
  font-size: 32px;
  color: var(--lp-text);
  background: var(--lp-bg);
}

.reveal .slides > section {
  padding: 64px 56px 48px;
  box-sizing: border-box;
  text-align: left;
}

.reveal h1, .reveal h2, .reveal h3 {
  font-family: 'Poppins', system-ui, sans-serif;
  font-weight: 700;
  color: var(--lp-purple-dark);
  letter-spacing: -0.025em;
  line-height: 1.1;
  margin: 0 0 0.45em;
  text-transform: none;
}
.reveal h1 { font-size: 2.4em; }
.reveal h2 { font-size: 1.6em; }
.reveal h3 { font-size: 1.05em; color: var(--lp-purple); }

.reveal h2::after {
  content: '';
  display: block;
  width: 56px;
  height: 4px;
  background: var(--lp-purple);
  border-radius: 2px;
  margin-top: 0.3em;
}

.reveal p, .reveal li { line-height: 1.5; color: var(--lp-text); }
.reveal a { color: var(--lp-purple); text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }

.reveal ul { list-style: none; padding-left: 0; }
.reveal ul li { position: relative; padding-left: 1.2em; margin-bottom: 0.4em; }
.reveal ul li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 8px;
  height: 8px;
  background: var(--lp-purple);
  border-radius: 2px;
}

.reveal .slide-number { display: none; }
.reveal .controls { color: var(--lp-purple); }
.reveal .progress { color: var(--lp-purple); height: 4px; }

/* Title slide */
.reveal .lp-title {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}
.reveal .lp-title::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 10px;
  background: linear-gradient(180deg, var(--lp-purple), var(--lp-purple-dark));
}
.reveal .lp-title h1 { font-size: 3.2em; margin-bottom: 0.2em; color: var(--lp-purple-dark); }
.reveal .lp-title h1::after { display: none; }
.reveal .lp-title .lp-subtitle { color: var(--lp-text-muted); font-size: 0.9em; font-weight: 400; }
.reveal .lp-logo { height: 60px; margin-bottom: 1.5em; }

/* DEMO transition slide */
.reveal .lp-demo-slide {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  background: var(--lp-purple-dark);
  color: var(--lp-cream);
}
.reveal .lp-demo-slide::after {
  content: 'DEMO';
  font-size: 8em;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--lp-cream);
}

/* Card grids */
.reveal .lp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5em; margin-top: 1em; }
.reveal .lp-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1em; margin-top: 1em; }
.reveal .lp-card {
  padding: 1em 1.2em;
  background: var(--lp-cream);
  border-radius: 8px;
  border: 1px solid var(--lp-border);
  font-size: 0.85em;
}
.reveal .lp-card.purple {
  background: var(--lp-purple);
  color: var(--lp-cream);
  border-color: var(--lp-purple);
}
.reveal .lp-card.purple h3 { color: var(--lp-cream); }
.reveal .lp-card h3 { margin: 0 0 0.4em; font-size: 1em; }
.reveal .lp-card h3::after { display: none; }

/* Big stat blocks */
.reveal .lp-big {
  font-size: 3em;
  font-weight: 800;
  color: var(--lp-purple);
  line-height: 1;
  letter-spacing: -0.04em;
}
.reveal .lp-big-label {
  display: block;
  font-size: 0.6em;
  color: var(--lp-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin-top: 0.3em;
}

/* Diagram for demo overview */
.reveal .lp-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2em;
  font-size: 1.1em;
  margin: 1.5em 0;
}
.reveal .lp-diagram .lp-pill {
  padding: 0.6em 1.2em;
  background: var(--lp-cream);
  border: 2px solid var(--lp-purple);
  border-radius: 999px;
  font-weight: 600;
  color: var(--lp-purple-dark);
}
.reveal .lp-diagram .lp-arrow {
  font-size: 1.4em;
  color: var(--lp-purple);
}
.reveal .lp-diagram .lp-brain {
  padding: 0.6em 1em;
  background: var(--lp-purple);
  color: var(--lp-cream);
  border-radius: 12px;
  font-weight: 700;
}

/* Disclaimer-callout */
.reveal .lp-note {
  margin-top: 1.5em;
  padding: 0.7em 1em;
  background: var(--lp-cream);
  border-left: 4px solid var(--lp-purple);
  border-radius: 4px;
  font-size: 0.7em;
  color: var(--lp-text-muted);
  font-style: italic;
}

/* QR slide */
.reveal .lp-qr-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  margin-top: 1em;
}
.reveal .lp-qr-block img { width: 240px; height: auto; }
.reveal .lp-qr-block .lp-url {
  font-family: ui-monospace, 'JetBrains Mono', Menlo, monospace;
  font-size: 0.7em;
  color: var(--lp-purple-dark);
}

/* One-more-thing slide */
.reveal .lp-omt {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  background: var(--lp-purple-dark);
  color: var(--lp-cream);
}
.reveal .lp-omt h2 {
  color: var(--lp-cream);
  font-style: italic;
  font-weight: 400;
  font-size: 1.4em;
}
.reveal .lp-omt h2::after { display: none; }
.reveal .lp-omt .lp-omt-reveal {
  font-size: 1.6em;
  font-weight: 700;
  color: var(--lp-cream);
  margin-top: 1em;
  max-width: 18em;
  line-height: 1.3;
}
.reveal .lp-omt .lp-omt-reveal strong {
  color: #ffffff;
  background: var(--lp-purple);
  padding: 0 0.2em;
  border-radius: 4px;
}

/* Input-cycle for demo 2 */
.reveal .lp-input-cycle {
  display: inline-block;
  position: relative;
  min-width: 8em;
  text-align: center;
  font-weight: 700;
  color: var(--lp-purple);
}
.reveal .lp-input-cycle .fragment {
  position: absolute;
  left: 0;
  right: 0;
  transition: opacity 0.25s ease;
}
.reveal .lp-input-cycle .fragment:first-child { position: static; }
```

- [ ] **Step 5: Commit vendoring + base CSS**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
git add vendor assets/fonts assets/liantis-logo.svg css/reveal-overrides.css
git commit -m "feat: vendor Reveal.js + Poppins + Liantis brand CSS"
```

---

## Task 2: Reveal-bootstrap (`index.html` + `js/main.js`)

**Files:**
- Create: `index.html`
- Create: `js/main.js`

- [ ] **Step 1: Schrijf `index.html` (loader-pattern uit reference-repo)**

Write `/home/ubuntu/kevin/liantis-presentatie/index.html`:

```html
<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Liantis · demo's</title>
  <link rel="stylesheet" href="vendor/reveal.js/dist/reveal.css" />
  <link rel="stylesheet" href="vendor/reveal.js/dist/theme/white.css" id="theme" />
  <link rel="stylesheet" href="css/reveal-overrides.css" />
  <link rel="stylesheet" href="css/timeline.css" />
</head>
<body>
  <div class="reveal">
    <div class="slides" id="slides-root"></div>
  </div>

  <script type="module">
    const chapters = [
      '00-titel',
      '01-time-jump',
      '02-twee-jaar-geleden',
      '03-zes-maanden-geleden',
      '04-dinsdag',
      '05-demo1-overview',
      '06-demo1-live',
      '07-demo2-overview',
      '08-demo2-live',
      '09-vragen',
      '10-probeer-zelf',
      '11-one-more-thing',
    ];
    const root = document.getElementById('slides-root');
    for (const c of chapters) {
      const r = await fetch(`slides/${c}.html`);
      if (!r.ok) { console.error(`fetch ${c}: ${r.status}`); continue; }
      root.insertAdjacentHTML('beforeend', await r.text());
    }
    await import('./js/main.js');
    await import('./js/timeline.js');
  </script>
</body>
</html>
```

- [ ] **Step 2: Schrijf `js/main.js`**

Write `/home/ubuntu/kevin/liantis-presentatie/js/main.js`:

```js
import Reveal from '../vendor/reveal.js/dist/reveal.esm.js';
import Notes from '../vendor/reveal.js/plugin/notes/notes.esm.js';

const deck = new Reveal({
  hash: true,
  controls: true,
  controlsTutorial: false,
  controlsLayout: 'edges',
  progress: true,
  slideNumber: false,
  history: true,
  keyboard: true,
  overview: true,
  center: false,
  transition: 'slide',
  transitionSpeed: 'fast',
  backgroundTransition: 'none',
  width: 1280,
  height: 720,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 1.5,
  plugins: [Notes],
});

window.Reveal = deck;
deck.initialize();

window.addEventListener('keydown', (e) => {
  if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.target.matches('input,textarea')) {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
});
```

- [ ] **Step 3: Maak een lege placeholder voor elke slide-file zodat `fetch` slaagt**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
mkdir -p slides
for c in 00-titel 01-time-jump 02-twee-jaar-geleden 03-zes-maanden-geleden 04-dinsdag 05-demo1-overview 06-demo1-live 07-demo2-overview 08-demo2-live 09-vragen 10-probeer-zelf 11-one-more-thing; do
  echo "<section><h2>${c}</h2><p>placeholder</p></section>" > "slides/${c}.html"
done
ls slides/
```

Expected: 12 .html-bestanden in `slides/`.

- [ ] **Step 4: Maak een lege `css/timeline.css` (vermijdt 404 in `index.html`)**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
echo "/* timeline-styles komen in Task 4 */" > css/timeline.css
```

- [ ] **Step 5: Maak een lege `js/timeline.js`-stub (vermijdt 404)**

Write `/home/ubuntu/kevin/liantis-presentatie/js/timeline.js`:

```js
// Timeline-animatie wordt in Task 4 ingevuld.
export default {};
```

- [ ] **Step 6: Test lokaal met http.server**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
python3 -m http.server 8765 >/tmp/lp-server.log 2>&1 &
sleep 1
curl -sf http://localhost:8765/ -o /dev/null && echo "ROOT OK"
curl -sf http://localhost:8765/slides/00-titel.html -o /dev/null && echo "SLIDES OK"
curl -sf http://localhost:8765/vendor/reveal.js/dist/reveal.css -o /dev/null && echo "REVEAL OK"
kill %1 2>/dev/null
```

Expected: drie regels `ROOT OK / SLIDES OK / REVEAL OK`.

- [ ] **Step 7: Commit bootstrap**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
git add index.html js/ css/timeline.css slides/
git commit -m "feat: Reveal-bootstrap met 12 placeholder-slides"
```

---

## Task 3: Statische slides (geen tijdlijn-animatie nog)

**Files:**
- Modify: `slides/00-titel.html` t/m `slides/11-one-more-thing.html`

Inhoud per slide hieronder. Eén commit aan het eind.

- [ ] **Step 1: `slides/00-titel.html`**

```html
<section class="lp-title">
  <img class="lp-logo" src="assets/liantis-logo.svg" alt="Liantis" />
  <h1>Demo's</h1>
  <p class="lp-subtitle">Twee korte voorbeelden, met context.</p>
</section>
```

- [ ] **Step 2: `slides/01-time-jump.html`**

```html
<section data-time-anchor="vandaag" class="lp-time-jump">
  <h2>Even terug in de tijd…</h2>
  <p class="lp-subtitle">Hoe deze demo's tot stand kwamen.</p>
  <!-- Year-flash overlay wordt door js/timeline.js geïnjecteerd op de eerste reveal van deze slide. -->
</section>
```

- [ ] **Step 3: `slides/02-twee-jaar-geleden.html`**

```html
<section data-time-anchor="twee-jaar">
  <h2>~2 jaar geleden</h2>
  <div class="lp-grid-2">
    <div>
      <p>Eerste NACEBEL-PoC. Andere stack, andere aanpak: regels, scripting, handmatig getunede embeddings.</p>
      <ul>
        <li>Veel custom plumbing</li>
        <li>Beperkte modellen</li>
        <li>Trage feedback-cyclus</li>
      </ul>
    </div>
    <div>
      <span class="lp-big">&gt; 1 week</span>
      <span class="lp-big-label">werk voor één PoC</span>
    </div>
  </div>
</section>
```

- [ ] **Step 4: `slides/03-zes-maanden-geleden.html`**

```html
<section data-time-anchor="zes-maanden">
  <h2>~6 maanden geleden</h2>
  <div class="lp-grid-2">
    <div>
      <p>Voorbereiding voor de Ignite-voordracht. De huidige twee PoC's gebouwd ter illustratie van de mogelijkheden.</p>
      <ul>
        <li>Modernere modellen</li>
        <li>n8n als orkestrator</li>
        <li>Snel itereren in plaats van bouwen</li>
      </ul>
    </div>
    <div>
      <span class="lp-big">≤ 1 dag</span>
      <span class="lp-big-label">voor beide PoC's samen</span>
    </div>
  </div>
</section>
```

- [ ] **Step 5: `slides/04-dinsdag.html`**

```html
<section data-time-anchor="dinsdag">
  <h2>Dinsdag deze week</h2>
  <div class="lp-grid-2">
    <div>
      <p>Upgrade om beter aan te sluiten bij Liantis: huisstijl, recentere modellen, optimalisaties.</p>
      <ul>
        <li>Liantis-look in de chat-UI</li>
        <li>Recentere LLM-versies</li>
        <li>Snellere flows, minder kost per call</li>
      </ul>
    </div>
    <div>
      <span class="lp-big">2 uur</span>
      <span class="lp-big-label">van &quot;oude&quot; naar &quot;wat je zo gaat zien&quot;</span>
    </div>
  </div>
</section>
```

- [ ] **Step 6: `slides/05-demo1-overview.html`**

```html
<section>
  <h2>Demo 1 — NACEBEL-coderen</h2>
  <div class="lp-diagram">
    <span class="lp-pill">Form</span>
    <span class="lp-arrow">→</span>
    <span class="lp-brain">AI</span>
    <span class="lp-arrow">→</span>
    <span class="lp-pill">Mail</span>
  </div>
  <p class="lp-note">
    Form en mail zijn slechts voorbeelden van interfaces. Voor deze PoC handig — in productie kan input
    een API-call zijn, een formulier in een ander systeem, een upload, een spraak-flow… Hetzelfde voor de output.
  </p>
</section>
```

- [ ] **Step 7: `slides/06-demo1-live.html`**

```html
<section class="lp-demo-slide" data-no-padding>
  <!-- Tekst "DEMO" wordt door CSS ::after geleverd -->
</section>
```

- [ ] **Step 8: `slides/07-demo2-overview.html`**

```html
<section>
  <h2>Demo 2 — Eenmanszaak-intake</h2>
  <div class="lp-diagram">
    <span class="lp-pill">
      <span class="lp-input-cycle">
        <span class="fragment current-visible" data-fragment-index="0">Chat</span>
        <span class="fragment current-visible" data-fragment-index="1">WhatsApp</span>
        <span class="fragment current-visible" data-fragment-index="2">Messenger</span>
        <span class="fragment current-visible" data-fragment-index="3">Telefoon</span>
        <span class="fragment current-visible" data-fragment-index="4">Brief</span>
        <span class="fragment current-visible" data-fragment-index="5">Stem</span>
      </span>
    </span>
    <span class="lp-arrow">→</span>
    <span class="lp-brain">AI</span>
    <span class="lp-arrow">→</span>
    <span class="lp-pill">Mail / JSON</span>
  </div>
  <p class="lp-note">
    Mail toont visueel iets — in productie meestal een JSON-payload naar een service zoals de Digital
    Gateway-API die we opzetten richting de overheid.
  </p>
  <p class="lp-note">
    Druk <kbd>spatie</kbd> om door de input-kanalen te bladeren.
  </p>
</section>
```

- [ ] **Step 9: `slides/08-demo2-live.html`**

```html
<section class="lp-demo-slide" data-no-padding></section>
```

- [ ] **Step 10: `slides/09-vragen.html`**

```html
<section class="lp-title">
  <h1>Vragen?</h1>
</section>
```

- [ ] **Step 11: `slides/10-probeer-zelf.html`**

```html
<section>
  <h2>Probeer het zelf</h2>
  <div class="lp-qr-block">
    <img src="assets/qr-handout.svg" alt="QR naar handout-pagina" />
    <p class="lp-url">bloxit-be.github.io/liantis-presentatie/handout/</p>
  </div>
  <p class="lp-note">
    De demo's blijven actief tot <strong>29 mei 2026</strong>. Ze draaien op eigen kosten — gelieve
    beperkt te gebruiken. Geen account nodig, geen gegevens worden bewaard.
  </p>
</section>
```

- [ ] **Step 12: `slides/11-one-more-thing.html`**

```html
<section class="lp-omt">
  <h2>one more thing…</h2>
  <p class="fragment lp-omt-reveal">
    Deze presentatie + de handout-pagina zijn <strong>ook door AI gemaakt</strong> —
    woensdag, in <strong>1 uur</strong>.
  </p>
</section>
```

- [ ] **Step 13: Genereer een placeholder QR**

Write `/home/ubuntu/kevin/liantis-presentatie/assets/qr-handout.svg`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="img" aria-label="QR placeholder">
  <rect width="240" height="240" fill="#f9f2ff" rx="12" />
  <rect x="20" y="20" width="60" height="60" fill="#7843A5" />
  <rect x="160" y="20" width="60" height="60" fill="#7843A5" />
  <rect x="20" y="160" width="60" height="60" fill="#7843A5" />
  <rect x="35" y="35" width="30" height="30" fill="#f9f2ff" />
  <rect x="175" y="35" width="30" height="30" fill="#f9f2ff" />
  <rect x="35" y="175" width="30" height="30" fill="#f9f2ff" />
  <text x="120" y="125" text-anchor="middle" font-family="Poppins, system-ui, sans-serif" font-size="18" font-weight="700" fill="#29004d">QR</text>
  <text x="120" y="150" text-anchor="middle" font-family="Poppins, system-ui, sans-serif" font-size="11" fill="#6b5f80">placeholder</text>
</svg>
```

- [ ] **Step 14: Open in browser, controleer dat alle slides renderen**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
python3 -m http.server 8765 >/tmp/lp-server.log 2>&1 &
sleep 1
# Curl elke slide om HTML-validiteit te checken
for c in 00-titel 01-time-jump 02-twee-jaar-geleden 03-zes-maanden-geleden 04-dinsdag 05-demo1-overview 06-demo1-live 07-demo2-overview 08-demo2-live 09-vragen 10-probeer-zelf 11-one-more-thing; do
  curl -sf "http://localhost:8765/slides/${c}.html" -o /dev/null && echo "${c} OK" || echo "${c} FAIL"
done
kill %1 2>/dev/null
```

Expected: 12 OK-regels.

- [ ] **Step 15: Commit slides**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
git add slides/ assets/qr-handout.svg
git commit -m "feat: 12 statische slides + QR-placeholder"
```

---

## Task 4: Tijdlijn-animatie (`timeline.css` + `timeline.js`)

**Files:**
- Modify: `css/timeline.css`
- Modify: `js/timeline.js`

- [ ] **Step 1: Schrijf `css/timeline.css`**

Write `/home/ubuntu/kevin/liantis-presentatie/css/timeline.css`:

```css
/* Tijdlijn-strip — verschijnt op slides 1-4 (data-time-anchor) */

.reveal .lp-timeline {
  position: absolute;
  top: 24px;
  left: 56px;
  right: 56px;
  height: 48px;
  pointer-events: none;
  z-index: 5;
}

.reveal .lp-timeline-track {
  position: absolute;
  top: 22px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #e6daf3, #c8aee5);
  border-radius: 2px;
}

.reveal .lp-timeline-marker {
  position: absolute;
  top: 16px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #c8aee5;
  transform: translateX(-50%);
  transition: border-color 0.3s ease, background 0.3s ease;
}
.reveal .lp-timeline-marker.active {
  background: #7843A5;
  border-color: #29004d;
  box-shadow: 0 0 0 6px rgba(120, 67, 165, 0.18);
}

.reveal .lp-timeline-label {
  position: absolute;
  top: 36px;
  font-size: 9px;
  color: #6b5f80;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  transform: translateX(-50%);
  white-space: nowrap;
}

.reveal .lp-timeline-scrubber {
  position: absolute;
  top: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #7843A5;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(40, 0, 77, 0.4);
  transform: translateX(-50%);
  transition: left 0.7s cubic-bezier(0.7, 0, 0.3, 1), filter 0.7s linear;
}
.reveal .lp-timeline-scrubber.moving {
  filter: blur(2px);
}

/* Year-flash overlay (slide 01-time-jump first reveal) */
.lp-year-flash {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lp-cream, #f9f2ff);
  z-index: 10000;
  pointer-events: none;
  animation: lp-flash-bg 1.5s forwards;
}
.lp-year-flash .lp-year {
  font-family: 'Poppins', system-ui, sans-serif;
  font-weight: 800;
  font-size: 14vw;
  color: var(--lp-purple, #7843A5);
  letter-spacing: -0.04em;
  opacity: 0;
  animation: lp-flash-year 0.35s forwards;
}
@keyframes lp-flash-bg {
  0%, 80% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes lp-flash-year {
  0% { opacity: 0; transform: scale(0.92); }
  40% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.08); }
}
```

- [ ] **Step 2: Schrijf `js/timeline.js`**

Write `/home/ubuntu/kevin/liantis-presentatie/js/timeline.js`:

```js
// Tijdlijn-strip + scrubber-animatie + year-flash op slide 1.
// Geactiveerd op alle slides met data-time-anchor.

const ANCHORS = [
  { key: 'twee-jaar',   percent: 0,   label: '~2 jaar geleden' },
  { key: 'zes-maanden', percent: 38,  label: '~6 maanden geleden' },
  { key: 'dinsdag',     percent: 72,  label: 'dinsdag' },
  { key: 'vandaag',     percent: 100, label: 'vandaag' },
];

const YEARS = ['2026', '2025', '2024', '2023'];

function buildStrip() {
  const strip = document.createElement('div');
  strip.className = 'lp-timeline';

  const track = document.createElement('div');
  track.className = 'lp-timeline-track';
  strip.appendChild(track);

  for (const a of ANCHORS) {
    const m = document.createElement('div');
    m.className = 'lp-timeline-marker';
    m.dataset.anchor = a.key;
    m.style.left = `${a.percent}%`;
    strip.appendChild(m);

    const lbl = document.createElement('div');
    lbl.className = 'lp-timeline-label';
    lbl.style.left = `${a.percent}%`;
    lbl.textContent = a.label;
    strip.appendChild(lbl);
  }

  const scrubber = document.createElement('div');
  scrubber.className = 'lp-timeline-scrubber';
  scrubber.style.left = '100%'; // start op 'vandaag'
  strip.appendChild(scrubber);

  return strip;
}

function injectStrips() {
  const sections = document.querySelectorAll('.reveal .slides > section[data-time-anchor]');
  sections.forEach((section) => {
    if (section.querySelector('.lp-timeline')) return;
    section.insertBefore(buildStrip(), section.firstChild);
  });
}

function activateAnchor(anchorKey) {
  const allStrips = document.querySelectorAll('.reveal .slides > section[data-time-anchor] .lp-timeline');
  const anchor = ANCHORS.find((a) => a.key === anchorKey);
  if (!anchor) return;

  for (const strip of allStrips) {
    strip.querySelectorAll('.lp-timeline-marker').forEach((m) => {
      m.classList.toggle('active', m.dataset.anchor === anchorKey);
    });
    const scrubber = strip.querySelector('.lp-timeline-scrubber');
    if (scrubber) {
      scrubber.classList.add('moving');
      scrubber.style.left = `${anchor.percent}%`;
      setTimeout(() => scrubber.classList.remove('moving'), 720);
    }
  }
}

function playYearFlash() {
  const overlay = document.createElement('div');
  overlay.className = 'lp-year-flash';
  document.body.appendChild(overlay);

  let idx = 0;
  const showNext = () => {
    overlay.innerHTML = '';
    if (idx >= YEARS.length) {
      setTimeout(() => overlay.remove(), 100);
      return;
    }
    const span = document.createElement('span');
    span.className = 'lp-year';
    span.textContent = YEARS[idx++];
    overlay.appendChild(span);
    setTimeout(showNext, 350);
  };
  showNext();
}

function init() {
  injectStrips();

  let yearFlashPlayed = false;

  const onSlideChanged = (event) => {
    const section = event.currentSlide;
    const anchor = section?.dataset?.timeAnchor;
    if (!anchor) return;

    if (anchor === 'vandaag' && !yearFlashPlayed) {
      yearFlashPlayed = true;
      playYearFlash();
      // Na de flash: scrubber blijft op vandaag (default).
      return;
    }
    activateAnchor(anchor);
  };

  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', onSlideChanged);
    // Trigger ook op page-load als eerste slide al een time-anchor heeft.
    const ev = { currentSlide: window.Reveal.getCurrentSlide?.() };
    if (ev.currentSlide) onSlideChanged(ev);
  } else {
    document.addEventListener('reveal:ready', () => {
      window.Reveal.on('slidechanged', onSlideChanged);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

- [ ] **Step 3: Test in browser — manuele rookcheck**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
python3 -m http.server 8765 >/tmp/lp-server.log 2>&1 &
sleep 1
# Check dat timeline-files geserveerd worden
curl -sf http://localhost:8765/css/timeline.css | head -5
curl -sf http://localhost:8765/js/timeline.js | head -5
kill %1 2>/dev/null
```

Expected: niet-lege response van beide files.

**Manuele test (door Kevin):** open `http://localhost:8765`, navigeer slide 0 → 1 → 2 → 3 → 4 → 5. Verwacht:
- Op slide 1: cinematic year-flash (1.5s, jaartallen 2026→2023), scrubber-strip verschijnt op `vandaag`
- Op slide 2: scrubber animeert links naar `~2 jaar geleden`
- Op slide 3: scrubber animeert rechts naar `~6 maanden geleden`
- Op slide 4: scrubber animeert verder naar `dinsdag`
- Op slide 5+: geen tijdlijn-strip meer

- [ ] **Step 4: Commit timeline**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
git add css/timeline.css js/timeline.js
git commit -m "feat: tijdlijn-strip + scrubber-animatie + year-flash"
```

---

## Task 5: Handout-pagina

**Files:**
- Create: `handout/index.html`
- Create: `handout/style.css`

- [ ] **Step 1: Schrijf `handout/style.css`**

Write `/home/ubuntu/kevin/liantis-presentatie/handout/style.css`:

```css
@font-face {
  font-family: 'Poppins';
  font-weight: 400;
  font-display: swap;
  src: url('../assets/fonts/Poppins-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-weight: 600;
  font-display: swap;
  src: url('../assets/fonts/Poppins-600.woff2') format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-weight: 700;
  font-display: swap;
  src: url('../assets/fonts/Poppins-700.woff2') format('woff2');
}

:root {
  --lp-purple: #7843A5;
  --lp-purple-dark: #29004d;
  --lp-cream: #f9f2ff;
  --lp-text: #1a1230;
  --lp-text-muted: #6b5f80;
  --lp-bg: #ffffff;
  --lp-border: #e6daf3;
}

* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', system-ui, sans-serif;
  background: var(--lp-cream);
  color: var(--lp-text);
  line-height: 1.5;
}

.lp-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.lp-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}
.lp-header img { height: 36px; }

.lp-page h1 {
  font-size: 2.2em;
  font-weight: 700;
  color: var(--lp-purple-dark);
  letter-spacing: -0.025em;
  margin: 0 0 0.3em;
}
.lp-page > p.lead {
  color: var(--lp-text-muted);
  margin: 0 0 2em;
}

.lp-cards {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}
@media (min-width: 600px) {
  .lp-cards { grid-template-columns: 1fr 1fr; }
}

.lp-card {
  display: flex;
  flex-direction: column;
  background: var(--lp-bg);
  border: 1px solid var(--lp-border);
  border-radius: 12px;
  padding: 20px 22px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.lp-card:hover {
  border-color: var(--lp-purple);
  transform: translateY(-2px);
}
.lp-card h2 {
  margin: 0 0 0.4em;
  font-size: 1.15em;
  color: var(--lp-purple-dark);
}
.lp-card p {
  margin: 0 0 1em;
  font-size: 0.92em;
  color: var(--lp-text-muted);
}
.lp-card .lp-cta {
  margin-top: auto;
  align-self: flex-start;
  padding: 0.5em 1em;
  background: var(--lp-purple);
  color: #fff;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9em;
}

.lp-disclaimer {
  background: var(--lp-bg);
  border-left: 4px solid var(--lp-purple);
  border-radius: 6px;
  padding: 14px 18px;
  font-size: 0.85em;
  color: var(--lp-text-muted);
}
.lp-disclaimer strong { color: var(--lp-purple-dark); }

.lp-footer {
  margin-top: 48px;
  text-align: center;
  font-size: 0.75em;
  color: var(--lp-text-muted);
}
```

- [ ] **Step 2: Schrijf `handout/index.html`**

Write `/home/ubuntu/kevin/liantis-presentatie/handout/index.html`:

```html
<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Probeer de demo's zelf · Liantis</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="lp-page">
    <div class="lp-header">
      <img src="../assets/liantis-logo.svg" alt="Liantis" />
    </div>

    <h1>Probeer de demo's zelf</h1>
    <p class="lead">De twee voorbeelden uit de presentatie, klaar om uit te proberen op je telefoon of laptop.</p>

    <section class="lp-cards">
      <a class="lp-card" href="#nacebel-demo-url-tbd" id="card-nacebel">
        <h2>NACEBEL-coderen</h2>
        <p>Voer een korte beschrijving van een activiteit in en krijg een passende NACEBEL-code voorgesteld.</p>
        <span class="lp-cta">Open demo →</span>
      </a>
      <a class="lp-card" href="https://bloxit-be.github.io/liantis-poc/" id="card-eenmanszaak">
        <h2>Eenmanszaak-intake</h2>
        <p>Chat-flow die je begeleidt bij de vragen voor het opstarten van een eenmanszaak.</p>
        <span class="lp-cta">Open demo →</span>
      </a>
    </section>

    <aside class="lp-disclaimer">
      <strong>Goed om te weten.</strong> De demo's blijven actief tot <strong>29 mei 2026</strong>.
      Ze draaien op eigen kosten — gelieve beperkt te gebruiken. Geen account nodig, geen gegevens worden bewaard.
      Vragen? <a href="mailto:kevin@bloxit.be">kevin@bloxit.be</a>.
    </aside>

    <footer class="lp-footer">
      Demo van Bloxit, niet officieel Liantis.
    </footer>
  </main>
</body>
</html>
```

- [ ] **Step 3: Lokale rookcheck**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
python3 -m http.server 8765 >/tmp/lp-server.log 2>&1 &
sleep 1
curl -sf http://localhost:8765/handout/ -o /dev/null && echo "HANDOUT OK"
curl -sf http://localhost:8765/handout/style.css -o /dev/null && echo "STYLE OK"
kill %1 2>/dev/null
```

Expected: `HANDOUT OK` en `STYLE OK`.

- [ ] **Step 4: Commit handout**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
git add handout/
git commit -m "feat: handout-pagina met demo-cards + disclaimer"
```

---

## Task 6: GitHub Pages-deploy

**Files:** geen (config via `gh`).

- [ ] **Step 1: Push huidige `main`**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
git push origin main
```

- [ ] **Step 2: Activeer GitHub Pages op `main` branch, root**

```bash
gh api -X POST /repos/bloxit-be/liantis-presentatie/pages \
  -f 'source[branch]=main' \
  -f 'source[path]=/' 2>&1 | head -20
```

Expected: JSON-response met `"status": "built"` of `"queued"`. Als `404` of `409` → herproberen na 5s of via `PUT`:

```bash
gh api -X PUT /repos/bloxit-be/liantis-presentatie/pages \
  -f 'source[branch]=main' \
  -f 'source[path]=/'
```

- [ ] **Step 3: Wacht tot deploy klaar is en verifieer URL**

```bash
for i in {1..20}; do
  status=$(gh api /repos/bloxit-be/liantis-presentatie/pages 2>/dev/null | grep -oP '"status": "\K[^"]+' | head -1)
  echo "tick $i: ${status}"
  if [ "$status" = "built" ]; then break; fi
  sleep 6
done
curl -sIL https://bloxit-be.github.io/liantis-presentatie/ | head -3
curl -sIL https://bloxit-be.github.io/liantis-presentatie/handout/ | head -3
```

Expected: beide curls geven `HTTP/2 200`.

- [ ] **Step 4: Verifieer slides + handout in een echte browser (manueel door Kevin)**

URL's:
- Deck: `https://bloxit-be.github.io/liantis-presentatie/`
- Handout: `https://bloxit-be.github.io/liantis-presentatie/handout/`

---

## Task 7: README + handout-URL definitief maken

**Files:**
- Modify: `README.md`
- Modify: `slides/10-probeer-zelf.html`

- [ ] **Step 1: Werk README bij met live-link**

Edit `README.md` — vervang het hele bestand door:

```markdown
# Liantis demo-presentatie

Korte web-based presentatie (~5 min) als opwarmer voor twee live demo's bij Liantis.
Reveal.js, Liantis-styling, gehost op GitHub Pages.

**Live deck:** https://bloxit-be.github.io/liantis-presentatie/
**Handout (probeer zelf):** https://bloxit-be.github.io/liantis-presentatie/handout/

## Lokaal draaien

\`\`\`bash
python3 -m http.server 8765
# Open http://localhost:8765
\`\`\`

## Toetsen

| Toets | Actie |
|---|---|
| ← → | Vorige / volgende slide |
| Spatie | Volgende slide / fragment |
| Esc | Overzicht |
| F | Fullscreen |

## Structuur

- `slides/` — één file per slide
- `handout/` — standalone handout-pagina (target voor QR)
- `js/timeline.js` — tijdlijn-animatie + year-flash
- `docs/superpowers/` — spec + plan

## TODO na voltooiing

- NACEBEL-demo URL invullen in `handout/index.html` zodra die definitief is
- QR-code genereren met de live handout-URL en `assets/qr-handout.svg` vervangen
```

- [ ] **Step 2: Commit + push**

```bash
cd /home/ubuntu/kevin/liantis-presentatie
git add README.md
git commit -m "docs: live-links naar deck + handout in README"
git push origin main
```

---

## Self-Review

**Spec coverage:**
- Stack/branding/locatie → Task 1 ✅
- 12 slides → Task 3 ✅
- Tijdlijn + year-flash → Task 4 ✅
- Demo-2 input-cycle (fragments) → Task 3 stap 8 ✅
- Handout-pagina → Task 5 ✅
- GitHub Pages-deploy → Task 6 ✅
- Open punten (NACEBEL-URL, QR-image) → bewust placeholder, in Task 7 README opgenomen ✅

**Placeholder-scan:** `#nacebel-demo-url-tbd` is een bewuste placeholder met TODO in README. Geen "TBD" of "fill in later" in code.

**Type-consistentie:** alle CSS-klassen gebruiken `lp-`-prefix (Liantis-presentatie). Anchor-keys `twee-jaar / zes-maanden / dinsdag / vandaag` zijn consistent gebruikt in HTML `data-time-anchor` én JS `ANCHORS`-array.
