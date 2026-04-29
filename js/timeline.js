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
      return;
    }
    activateAnchor(anchor);
  };

  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', onSlideChanged);
    const current = window.Reveal.getCurrentSlide?.();
    if (current) onSlideChanged({ currentSlide: current });
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
