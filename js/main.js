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
