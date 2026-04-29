# Liantis demo-presentatie

Korte web-based presentatie (~5 min) als opwarmer voor twee live demo's bij Liantis.
Reveal.js, Liantis-styling, gehost op GitHub Pages.

**Live deck:** https://bloxit-be.github.io/liantis-presentatie/
**Handout (probeer zelf):** https://bloxit-be.github.io/liantis-presentatie/handout/

## Lokaal draaien

```bash
python3 -m http.server 8765
# Open http://localhost:8765
```

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

## Open punten

- NACEBEL-demo URL invullen in `handout/index.html` zodra die definitief is (placeholder `#nacebel-demo-url-tbd`)
- QR-code genereren met de live handout-URL en `assets/qr-handout.svg` vervangen
