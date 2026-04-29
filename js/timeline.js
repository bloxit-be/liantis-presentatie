// Tijdlijn-strip + scrubber-animatie voor de tijdsprong-slide.
// Strip wordt geïnjecteerd in .lp-timeline-host. Scrubber reageert op
// fragmentshown/fragmenthidden binnen de slide.

const ANCHORS = [
  { key: 'twee-jaar',   percent: 0,   label: '~2 jaar geleden' },
  { key: 'zes-maanden', percent: 38,  label: '~6 maanden geleden' },
  { key: 'dinsdag',     percent: 72,  label: 'dinsdag' },
  { key: 'vandaag',     percent: 100, label: 'vandaag' },
];

function positionLeft(percent) {
  // Track loopt van 24px tot calc(100% - 24px); zet element op percent binnen die ruimte.
  return `calc(24px + ${percent}% - ${0.48 * percent}px)`;
}

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
    m.style.left = positionLeft(a.percent);
    strip.appendChild(m);

    const lbl = document.createElement('div');
    lbl.className = 'lp-timeline-label';
    lbl.dataset.anchor = a.key;
    lbl.style.left = positionLeft(a.percent);
    lbl.textContent = a.label;
    strip.appendChild(lbl);
  }

  const scrubber = document.createElement('div');
  scrubber.className = 'lp-timeline-scrubber';
  scrubber.style.left = positionLeft(100); // start op 'vandaag'
  strip.appendChild(scrubber);

  return strip;
}

function injectStrips() {
  const hosts = document.querySelectorAll('.reveal .slides .lp-timeline-host');
  hosts.forEach((host) => {
    if (host.querySelector('.lp-timeline')) return;
    host.appendChild(buildStrip());
  });
}

function activateAnchor(anchorKey) {
  const anchor = ANCHORS.find((a) => a.key === anchorKey);
  if (!anchor) return;

  const strips = document.querySelectorAll('.reveal .slides .lp-timeline');
  strips.forEach((strip) => {
    strip.querySelectorAll('.lp-timeline-marker').forEach((m) => {
      m.classList.toggle('active', m.dataset.anchor === anchorKey);
    });
    strip.querySelectorAll('.lp-timeline-label').forEach((l) => {
      l.classList.toggle('active', l.dataset.anchor === anchorKey);
    });
    const scrubber = strip.querySelector('.lp-timeline-scrubber');
    if (scrubber) {
      scrubber.classList.add('moving');
      scrubber.style.left = positionLeft(anchor.percent);
      setTimeout(() => scrubber.classList.remove('moving'), 720);
    }
  });
}

function updateScrubberFromState() {
  const slide = window.Reveal?.getCurrentSlide?.();
  if (!slide || !slide.classList.contains('lp-tijdlijn-slide')) return;

  // Vind de actief-zichtbare stop met data-time-anchor; default = vandaag.
  const visibleStops = slide.querySelectorAll('.lp-time-stop.visible[data-time-anchor]');
  let anchor = 'vandaag';
  visibleStops.forEach((s) => { anchor = s.dataset.timeAnchor; });
  activateAnchor(anchor);
}

function init() {
  injectStrips();

  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', updateScrubberFromState);
    window.Reveal.on('fragmentshown', updateScrubberFromState);
    window.Reveal.on('fragmenthidden', updateScrubberFromState);
    updateScrubberFromState();
  } else {
    document.addEventListener('reveal:ready', () => {
      window.Reveal.on('slidechanged', updateScrubberFromState);
      window.Reveal.on('fragmentshown', updateScrubberFromState);
      window.Reveal.on('fragmenthidden', updateScrubberFromState);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
