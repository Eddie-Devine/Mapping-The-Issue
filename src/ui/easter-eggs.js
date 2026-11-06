// A secret for curious visitors: the classic code (↑ ↑ ↓ ↓ ← → ← → B A) unlocks a golden climber.
import { sfx } from '../audio/sfx.js';
import { settings } from '../world/settings.js';

const CODE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

export function connectEasterEggs() {
  const toast = document.createElement('p');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.append(toast);

  let progress = 0;
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    progress = key === CODE[progress] ? progress + 1 : key === CODE[0] ? 1 : 0;
    if (progress < CODE.length) return;
    progress = 0;
    settings.set('goldUnlocked', true);
    settings.set('climber', 'gold');
    sfx.start();
    toast.textContent = '⭐ SECRET FOUND: THE GOLDEN CLIMBER';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  });
}
