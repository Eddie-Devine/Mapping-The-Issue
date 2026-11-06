// The RPG dialog box. It's a native <dialog>, so the browser traps focus while it's open
// and returns focus to whatever opened it when it closes.
import { sfx } from '../audio/sfx.js';
import { mountScene } from '../scenes/runtime.js';
import { motionAllowed } from '../world/motion.js';
import { typeOut } from './typewriter.js';

export function createDialog() {
  const el = document.createElement('dialog');
  el.className = 'rpg-dialog on-dark';
  el.setAttribute('aria-labelledby', 'rpg-title');
  el.innerHTML = `
    <header class="rpg-head">
      <div>
        <p class="rpg-kicker"></p>
        <h2 class="rpg-title" id="rpg-title"></h2>
      </div>
      <button class="rpg-close" type="button" aria-label="Close">✕</button>
    </header>
    <div class="rpg-scene" hidden></div>
    <div class="rpg-body" tabindex="-1"></div>
    <footer class="rpg-foot">
      <button class="pixel-btn rpg-scene-action" type="button" hidden></button>
      <button class="pixel-btn rpg-prev" type="button">◀ PREV</button>
      <span class="rpg-page"></span>
      <button class="pixel-btn rpg-next" type="button">NEXT ▶</button>
    </footer>
  `;
  document.body.append(el);

  const kicker = el.querySelector('.rpg-kicker');
  const title = el.querySelector('.rpg-title');
  const body = el.querySelector('.rpg-body');
  const prev = el.querySelector('.rpg-prev');
  const next = el.querySelector('.rpg-next');
  const pageLabel = el.querySelector('.rpg-page');
  const sceneHost = el.querySelector('.rpg-scene');
  const sceneAction = el.querySelector('.rpg-scene-action');

  let pages = [];
  let page = 0;
  let typed = true;
  let typing = null;
  let mounted = null;
  let sceneRun = null;

  const stopTyping = () => {
    typing?.finish();
    typing = null;
  };

  /** Some leaves open with a small animated scene above their text. */
  function setScene(scene) {
    mounted?.destroy();
    mounted = null;
    sceneRun = scene?.action?.run ?? null;
    sceneHost.hidden = !scene;
    sceneAction.hidden = !scene?.action;
    if (scene?.action) sceneAction.textContent = scene.action.label;
    if (scene) mounted = mountScene(sceneHost, scene);
  }

  function show(index) {
    stopTyping();
    page = index;
    body.innerHTML = pages[page];
    body.scrollTop = 0;
    const last = page === pages.length - 1;
    prev.hidden = page === 0;
    next.textContent = last ? 'CLOSE' : 'NEXT ▶';
    pageLabel.textContent = pages.length > 1 ? `${page + 1} / ${pages.length}` : '';
    body.focus({ preventScroll: true });
    if (typed && motionAllowed()) {
      // A blip every few letters is plenty: one per letter would buzz.
      let letters = 0;
      typing = typeOut(body, { onChar: () => (letters++ % 3 === 0 ? sfx.blip() : null) });
    }
  }

  function close() {
    stopTyping();
    el.close();
  }

  function advance() {
    if (page < pages.length - 1) show(page + 1);
    else close();
  }

  next.addEventListener('click', advance);
  prev.addEventListener('click', () => show(page - 1));
  el.querySelector('.rpg-close').addEventListener('click', close);
  sceneAction.addEventListener('click', () => {
    sceneRun?.();
    mounted?.refresh();
  });
  el.addEventListener('close', () => {
    stopTyping();
    setScene(null);
  });

  el.addEventListener('click', (event) => {
    if (event.target === el) close(); // A click on the dim backdrop.
    else if (typing?.isRunning() && event.target.closest('.rpg-body') && !event.target.closest('a')) stopTyping();
  });

  el.addEventListener('keydown', (event) => {
    const running = typing?.isRunning();
    const onControl = event.target.closest('a, button, summary, input');
    if (event.key === 'Tab') {
      stopTyping();
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (running) {
        event.preventDefault();
        stopTyping();
      } else if (!onControl) {
        event.preventDefault();
        advance();
      }
    } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      if (page < pages.length - 1) show(page + 1);
    } else if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      if (page > 0) show(page - 1);
    }
  });

  return {
    /**
     * Opens the box, or swaps its contents if it's already open.
     * `titleHtml` and `pages` are HTML. Pass `typed: false` for tables and cards.
     */
    open({ kickerHtml = '', titleHtml, pages: newPages, typed: newTyped = true, wide = false, scene = null }) {
      stopTyping();
      pages = newPages;
      typed = newTyped;
      kicker.innerHTML = kickerHtml;
      kicker.hidden = !kickerHtml;
      title.innerHTML = titleHtml;
      el.classList.toggle('wide', wide);
      if (!el.open) el.showModal();
      setScene(scene);
      show(0);
    },
    close,
    get isOpen() {
      return el.open;
    },
  };
}
