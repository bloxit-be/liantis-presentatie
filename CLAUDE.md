# CLAUDE.md

Guidance for Claude Code in this repo.

## Project

Korte demo-presentatie voor Liantis (~5 min) als opwarmer voor twee live demo's: NACEBEL-coderen en eenmanszaak-intake. Plus een handout-pagina (`/handout/`) waar het publiek de demo's zelf kan testen.

## Status

Spec goedgekeurd 2026-04-29: `docs/superpowers/specs/2026-04-29-liantis-demo-presentatie-design.md`.

**Volgende stap:** implementatieplan via `superpowers:writing-plans`, daarna implementeren.

## Stack

- **Framework:** Reveal.js 4.x, static HTML/CSS/JS, geen build-step.
- **Branding:** Liantis (`#7843A5` purple, `#29004d` dark, `#f9f2ff` cream), Poppins web-font.
- **Deploy:** GitHub Pages, `bloxit-be/liantis-presentatie`.

## Inhoudelijke regels

- Eén slide per file in `slides/`, flat (geen vertical sub-slides).
- Tijdlijn-strip + scrubber persistent op slides 1-4, met 1.5s year-flash op slide 1.
- Demo-overgangsslides zijn sober: enkel het woord "DEMO".
- Disclaimer op handout: 1 maand actief vanaf presentatiedatum, op eigen kosten, beperkt gebruiken.

## Working notes

- Houd `slides/` flat — één section per file maakt review simpel.
- Vendor `reveal.js` lokaal (zelfde aanpak als `smartpeak/ems-presentatie-repo`), geen npm.
