// Deterministic screenshot states for Lighthouse Cove.
// ?shot=start renders the title screen, ?shot=play renders level 1 mid-hunt
// with three differences already ringed and four still hidden, and ?shot=end
// renders the win screen. The timer is frozen in every shot state so the
// screenshots are stable. &seed=N is accepted and ignored — the scenes are
// fully deterministic already.

import { game, startLevel, showOverlay, updateHud, paintPanels, updateCrosshair } from './game.js';
import { LEVELS } from './scenes.js';

function renderPlayShot() {
  startLevel(0);
  game.frozen = true;
  // Ring the first three differences on both panels, leave four hidden.
  const level = LEVELS[0];
  const foundIds = level.differences.slice(0, 3).map((d) => d.id);
  game.found = new Set(foundIds);
  game.score = 325;
  game.combo = 2;
  game.timeLeft = 96;
  game.totalFound = 3;
  paintPanels();
  const left = document.getElementById('markersLeft');
  const right = document.getElementById('markersRight');
  left.innerHTML = '';
  right.innerHTML = '';
  for (const diff of level.differences) {
    if (!game.found.has(diff.id)) continue;
    for (const container of [left, right]) {
      const ring = document.createElement('div');
      ring.className = 'ring';
      ring.style.left = `${diff.x * (580 / 600)}px`;
      ring.style.top = `${diff.y * (435 / 450)}px`;
      container.appendChild(ring);
    }
  }
  updateHud();
}

function renderEndShot() {
  startLevel(2);
  game.frozen = true;
  const level = LEVELS[2];
  game.found = new Set(level.differences.map((d) => d.id));
  game.score = 2840;
  game.totalFound = 24;
  game.bestCombo = 5;
  game.timeLeft = 61;
  paintPanels();
  game.screen = 'win';
  updateHud();
  showOverlay(`
    <h2>🏆 You found them all!</h2>
    <h3>Lighthouse Cove — complete</h3>
    <p>Every difference in all three scenes, hunted down.</p>
    <p class="big-score">Final score: 2840</p>
    <p>24 differences found · best combo ×5 · time bonus +122</p>
    <button type="button">↻ Play again</button>
    <p class="keys">Thanks for playing Lighthouse Cove — a spot-the-difference game built for make.fun.</p>
  `);
}

export function applyShotMode() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return false;
  if (shot === 'start') {
    // The start screen is already showing; freeze the clock for stability.
    game.frozen = true;
    return true;
  }
  if (shot === 'play') {
    renderPlayShot();
    // Park the keyboard cursor on an unfound difference so the crosshair
    // shows in the play screenshot too.
    game.cursor = { x: 432, y: 232 };
    game.activePanel = 'left';
    updateCrosshair();
    return true;
  }
  if (shot === 'end') {
    renderEndShot();
    return true;
  }
  return false;
}
