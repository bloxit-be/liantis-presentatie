# Liantis demo-presentatie — design

**Datum:** 2026-04-29
**Status:** approved (Kevin, 2026-04-29)
**Doel:** korte presentatie (~5 min) als opwarmer voor twee live demo's bij Liantis.

## Context

Kevin geeft bij Liantis een korte sessie met twee live demo's:

1. **NACEBEL-coderen** — een form-input → AI → mail-output PoC.
2. **Eenmanszaak-intake** — een chat-input → AI → mail/JSON-output PoC.

De presentatie moet kort zijn en vooral het *tijdsverhaal* maken: hoe lang dit soort PoC twee jaar geleden duurde, vs. zes maanden geleden, vs. dinsdag deze week. Daarna twee korte intro-slides per demo (zodat het publiek weet dat input/output-keuze arbitrair is), de demo's zelf, Q&A, een QR voor zelf-uitproberen, en een "one more thing"-afsluiter die onthult dat de presentatie zelf ook door AI gemaakt werd.

## Stack

- **Framework:** Reveal.js 4.x, static HTML/CSS/JS, geen build-step.
- **Styling:** Liantis brand-palette uit memory:
  - Primary purple `#7843A5`
  - Dark purple `#29004d`
  - Cream `#f9f2ff`
- **Font:** Poppins (web), self-hosted woff2.
- **Repo-structuur:** zelfde patroon als `ems-presentatie-repo` (slide-per-file in `slides/`, één `index.html` met loader).
- **Hosting:** GitHub Pages, subpath in bestaande `bloxit-be/liantis-poc` repo zodat handout-pagina + demo-links onder dezelfde origin leven. Te bevestigen bij deploy.

## Repo-structuur

```
liantis-presentatie/
├── CLAUDE.md
├── README.md
├── index.html                 # loader, kanaalt slides/*.html in
├── handout/
│   └── index.html             # QR-bestemming met demo-links + disclaimer
├── slides/
│   ├── 00-titel.html
│   ├── 01-time-jump.html
│   ├── 02-twee-jaar-geleden.html
│   ├── 03-zes-maanden-geleden.html
│   ├── 04-dinsdag.html
│   ├── 05-demo1-overview.html
│   ├── 06-demo1-live.html      # sobere "DEMO"-overgangsslide
│   ├── 07-demo2-overview.html
│   ├── 08-demo2-live.html      # sobere "DEMO"-overgangsslide
│   ├── 09-vragen.html
│   ├── 10-probeer-zelf.html
│   └── 11-one-more-thing.html
├── css/
│   ├── reveal-overrides.css   # Liantis-thema bovenop Reveal white-theme
│   └── timeline.css           # styles voor de tijdlijn-strip + scrubber
├── js/
│   ├── main.js                # Reveal init
│   └── timeline.js            # scrubber-animatie + year-flash
├── assets/
│   ├── fonts/                 # Poppins woff2's
│   ├── liantis-logo.svg
│   └── qr-handout.svg         # placeholder tot deploy-URL vast staat
└── docs/superpowers/
    ├── specs/2026-04-29-liantis-demo-presentatie-design.md
    └── plans/                 # geschreven via writing-plans
```

## Slide-deck (12 slides)

Elke slide is één Reveal-`<section>`. Geen vertical sub-slides — alles flat.

| # | File | Slide-titel | Inhoud |
|---|---|---|---|
| 0 | `00-titel.html` | **Demo's** | Fullscreen titel-slide. Liantis-purple gradient als linker accent-balk, logo, "Demo's" als h1, korte subtitle. |
| 1 | `01-time-jump.html` | **Even terug in de tijd…** | Bij eerste reveal: 1.5s cinematic year-flash (`2026 → 2025 → 2024 → 2023`, full-screen, Poppins extra-bold, accent-purple, snel vervagend). Daarna verschijnt de persistente tijdlijn-strip met scrubber op `vandaag`. |
| 2 | `02-twee-jaar-geleden.html` | **~2 jaar geleden** | Tijdlijn-strip blijft, scrubber slidet naar marker `~2 jaar geleden`. Inhoud: eerste NACEBEL-PoC, fundamenteel andere aanpak, **>1 week werk**. 3 bullets max. |
| 3 | `03-zes-maanden-geleden.html` | **~6 maanden geleden** | Scrubber naar `~6 mnd geleden`. Inhoud: huidige PoC's gebouwd ter illustratie voor Ignite-voordracht, **≤1 dag werk in totaal**. |
| 4 | `04-dinsdag.html` | **Dinsdag deze week** | Scrubber naar `dinsdag`. Inhoud: upgrade voor betere Liantis-fit, recentere modellen, optimalisaties, **2u werk**. |
| 5 | `05-demo1-overview.html` | **Demo 1 — NACEBEL-coderen** | Diagram `Form → 🔮 → Mail`. Disclaimer onderaan: "Form en mail zijn slechts voorbeeld-interfaces — input en output zijn vrij vervangbaar." |
| 6 | `06-demo1-live.html` | **DEMO** | Sobere overgangsslide (fullscreen woord "DEMO" centraal, Liantis-purple). Kevin schakelt naar live-omgeving. |
| 7 | `07-demo2-overview.html` | **Demo 2 — Eenmanszaak-intake** | Diagram `[Chat] → 🔮 → Mail / JSON`. **Animatie**: het input-woord cyclet via Reveal-fragments bij iedere spatiebalk: Chat → WhatsApp → Messenger → Telefoon → Brief → Stem → … Onderaan: "Mail toont visueel iets — in productie meestal JSON naar een service zoals de Digital Gateway-API." |
| 8 | `08-demo2-live.html` | **DEMO** | Sobere overgangsslide. |
| 9 | `09-vragen.html` | **Vragen?** | Sobere Q&A-slide. |
| 10 | `10-probeer-zelf.html` | **Probeer zelf** | QR-code-placeholder, URL onder de QR (verwijzend naar `/handout/`), disclaimer-card: "1 maand actief · op eigen kosten gehost · graag beperkt gebruiken." |
| 11 | `11-one-more-thing.html` | **One more thing…** | Apple-stijl reveal. Eerste tekst klein gecentreerd ("one more thing…"), dan fragment: deze presentatie + de handout-pagina zijn ook door AI gebouwd, op woensdag, in 1u totaal. |

## Tijdlijn-animatie (slide 1-4)

**Concept:** persistente horizontale strip bovenaan slides 1-4 (en optioneel ook subtiel op 5+), met 4 markers links-naar-rechts:

```
~2 jaar geleden ──── ~6 mnd geleden ──── dinsdag ──── vandaag
```

Een `scrubber` (kleine cirkel op de strip) start op `vandaag`. Bij elke slide-overgang animeert de scrubber naar het juiste marker met:
- `transform: translateX()` over 700ms `cubic-bezier(0.7, 0, 0.3, 1)`
- Tijdens de beweging: `filter: blur(2px)` op de scrubber, weg na settle
- Lichte vlam-puls (`box-shadow` keyframe) op de bestemming-marker

**Year-flash (alleen slide 1, eerste reveal):** een full-screen `<div>` boven de slide, toont jaartallen `2026 → 2025 → 2024 → 2023` in 1.5s totaal, Poppins 800, accent-purple op cream. CSS-keyframe-animatie, vanilla JS triggert hem op `slidechanged`.

**Implementatie:** alle tijdlijn-state in één `js/timeline.js` module die:
- DOM-strip injecteert in slides 1-4
- `Reveal.on('slidechanged', ...)` luistert en scrubber-X positioneert
- One-shot year-flash spelt de eerste keer slide 1 in zicht komt

## Demo-2 input-cycle (slide 7)

Reveal fragments houden de implementatie eenvoudig:

```html
<div class="lp-input-cycle">
  <span class="fragment current-visible">Chat</span>
  <span class="fragment current-visible">WhatsApp</span>
  <span class="fragment current-visible">Messenger</span>
  <span class="fragment current-visible">Telefoon</span>
  <span class="fragment current-visible">Brief</span>
  <span class="fragment current-visible">Stem</span>
</div>
```

Reveal `current-visible` zorgt dat alleen de actieve span getoond wordt, spatiebalk schakelt door. CSS positioneert ze gestapeld op dezelfde plek met fade-in/out (0.3s).

## Handout-pagina (`/handout/`)

Single-page HTML, zelfde Liantis-styling, geen Reveal nodig:

- Liantis-logo + h1 "Probeer de demo's zelf"
- Twee kaarten:
  - **NACEBEL-coderen** — knop naar form-URL (placeholder tot Kevin URL bevestigt)
  - **Eenmanszaak-intake** — knop naar chat-embed (`https://bloxit-be.github.io/liantis-poc/`)
- Disclaimer-blok onderaan: actief tot `2026-05-29` (1 maand vanaf vandaag), op eigen kosten, beperkt gebruiken
- Geen formulier, geen tracking, geen analytics

## Wat we expliciet **niet** doen

- Geen build-tooling, geen npm/Vite. Vendor `reveal.js` zoals in ems-presentatie-repo.
- Geen speaker-notes (Kevin kent zijn verhaal).
- Geen QR-genereren tot de handout-URL definitief is — placeholder volstaat in de eerste implementatie-fase.
- Geen analytics op de handout-pagina.
- Geen build-step voor PDF-export — als nodig kan `?print-pdf` later via decktape, maar valt buiten scope nu.

## Open punten (op te lossen tijdens implementatie of later)

- **NACEBEL-demo URL** — Kevin moet de live URL bevestigen voor de handout-pagina-link.
- **Hosting-keuze definitief** — subpath in `bloxit-be/liantis-poc` vs. nieuwe repo. Default = subpath.
- **QR-image** — genereren als de handout-URL definitief is (later op woensdag, samen met Kevin).
