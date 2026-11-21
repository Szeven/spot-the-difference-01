// Lighthouse Cove — game state, input and rendering.
// Owns the play loop: painting both panels, click and keyboard picking,
// the countdown, score and combos, hints, markers, and the overlays for
// start, level-clear, win and time-up.

import { LEVELS } from './scenes.js';
import * as sfx from './audio.js';

const PANEL_W = 600;
const PANEL_H = 450;
const SCALE_X = 580 / PANEL_W;
const SCALE_Y = 435 / PANEL_H;

const $ = (id) => document.getElementById(id);

const els = {
  levelName: $('levelName'),
  foundCount: $('foundCount'),
  leftCount: $('leftCount'),
  timer: $('timer'),
  score: $('score'),
  hintBtn: $('hintBtn'),
  hintCount: $('hintCount'),
  soundBtn: $('soundBtn'),
  restartBtn: $('restartBtn'),
  canvasLeft: $('canvasLeft'),
  canvasRight: $('canvasRight'),
  markersLeft: $('markersLeft'),
  markersRight: $('markersRight'),
  crossLeft: $('crossLeft'),
  crossRight: $('crossRight'),
  overlay: $('overlay'),
  overlayCard: $('overlayCard'),
  comboPop: $('comboPop'),
};

export const game = {
  screen: 'start',
  levelIndex: 0,
  found: new Set(),
  score: 0,
  combo: 0,
  bestCombo: 0,
  hintsLeft: 3,
  timeLeft: 0,
  timerId: null,
  activePanel: 'left',
  cursor: { x: PANEL_W / 2, y: PANEL_H / 2 },
  totalFound: 0,
  frozen: false,
};

export function currentLevel() {
  return LEVELS[game.levelIndex];
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function updateHud() {
  const level = currentLevel();
  els.levelName.textContent = `${game.levelIndex + 1} · ${level.name}`;
  els.foundCount.textContent = `${game.found.size} / ${level.differences.length}`;
  const left = level.differences.length - game.found.size;
  els.leftCount.textContent = left === 0 ? 'all found!' : `${left} to go`;
  els.timer.textContent = formatTime(Math.max(0, game.timeLeft));
  els.timer.classList.toggle('danger', game.timeLeft <= 30 && game.screen === 'playing');
  els.score.textContent = String(game.score);
  els.hintCount.textContent = String(game.hintsLeft);
  els.hintBtn.disabled = game.hintsLeft <= 0 || game.screen !== 'playing';
}

export function paintPanels() {
  const level = currentLevel();
  const ctxL = els.canvasLeft.getContext('2d');
  const ctxR = els.canvasRight.getContext('2d');
  level.paint(ctxL, 0);
  level.paint(ctxR, 1);
}

function placeMarker(container, diff, cls) {
  const ring = document.createElement('div');
  ring.className = cls;
  ring.style.left = `${diff.x * SCALE_X}px`;
  ring.style.top = `${diff.y * SCALE_Y}px`;
  container.appendChild(ring);
  return ring;
}

function showMarkers() {
  els.markersLeft.innerHTML = '';
  els.markersRight.innerHTML = '';
  const level = currentLevel();
  for (const diff of level.differences) {
    if (game.found.has(diff.id)) {
      placeMarker(els.markersLeft, diff, 'ring');
      placeMarker(els.markersRight, diff, 'ring');
    }
  }
}

function showCombo(text) {
  els.comboPop.textContent = text;
  els.comboPop.hidden = false;
  els.comboPop.style.animation = 'none';
  void els.comboPop.offsetWidth;
  els.comboPop.style.animation = '';
  window.setTimeout(() => { els.comboPop.hidden = true; }, 950);
}

function stopTimer() {
  if (game.timerId !== null) {
    window.clearInterval(game.timerId);
    game.timerId = null;
  }
}

function startTimer() {
  stopTimer();
  game.timerId = window.setInterval(() => {
    if (game.screen !== 'playing' || game.frozen) return;
    game.timeLeft -= 1;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      updateHud();
      onTimeUp();
      return;
    }
    updateHud();
  }, 1000);
}

export function showOverlay(html) {
  els.overlayCard.innerHTML = html;
  els.overlay.hidden = false;
}

export function hideOverlay() {
  els.overlay.hidden = true;
  els.overlayCard.innerHTML = '';
}

function showStartScreen() {
  game.screen = 'start';
  game.levelIndex = 0;
  game.found = new Set();
  game.score = 0;
  game.combo = 0;
  game.bestCombo = 0;
  game.totalFound = 0;
  game.hintsLeft = 3;
  game.timeLeft = currentLevel().timeLimit;
  paintPanels();
  showMarkers();
  updateHud();
  showOverlay(`
    <h2>🔦 Lighthouse Cove</h2>
    <h3>Spot the Difference</h3>
    <p>Two pictures hang side by side — but the right one has been changed!
       Find every hidden difference before the clock runs out.</p>
    <ul class="level-list">
      <li>🌊 <b>Level 1 · Lighthouse Cove</b> — 7 differences</li>
      <li>🍄 <b>Level 2 · Mushroom Hollow</b> — 8 differences</li>
      <li>⛺ <b>Level 3 · Starlight Camp</b> — 9 differences</li>
    </ul>
    <p>Click a difference in <b>either</b> picture. A wrong click costs 5 seconds.
       Stuck? A hint rings the spot — you have 3 per level.</p>
    <button id="playBtn" type="button">▶ Start hunting</button>
    <p class="keys">Mouse or keyboard: arrows move, Tab switches picture, Enter picks · H hint · M sound · R restart · P pause</p>
  `);
  $('playBtn').addEventListener('click', () => {
    sfx.playClick();
    startLevel(0);
  });
}

export function startLevel(index) {
  game.levelIndex = index;
  game.found = new Set();
  game.combo = 0;
  game.hintsLeft = 3;
  game.timeLeft = currentLevel().timeLimit;
  game.screen = 'playing';
  game.cursor = { x: PANEL_W / 2, y: PANEL_H / 2 };
  hideOverlay();
  paintPanels();
  showMarkers();
  updateHud();
  updateCrosshair();
  sfx.playStart();
  startTimer();
}

function onLevelClear() {
  stopTimer();
  const timeBonus = game.timeLeft * 2;
  game.score += timeBonus;
  sfx.playLevelClear();
  const level = currentLevel();
  const isLast = game.levelIndex === LEVELS.length - 1;
  game.screen = isLast ? 'win' : 'level-clear';
  updateHud();
  if (isLast) {
    showOverlay(`
      <h2>🏆 You found them all!</h2>
      <h3>Lighthouse Cove — complete</h3>
      <p>Every difference in all three scenes, hunted down.</p>
      <p class="big-score">Final score: ${game.score}</p>
      <p>${game.totalFound} differences found · best combo ×${game.bestCombo} · time bonus +${timeBonus}</p>
      <button id="againBtn" type="button">↻ Play again</button>
      <p class="keys">Thanks for playing Lighthouse Cove — a spot-the-difference game built for make.fun.</p>
    `);
    $('againBtn').addEventListener('click', () => {
      sfx.playClick();
      game.score = 0;
      game.totalFound = 0;
      game.bestCombo = 0;
      startLevel(0);
    });
    return;
  }
  showOverlay(`
    <h2>🎉 Level clear!</h2>
    <h3>${level.name} — all ${level.differences.length} differences found</h3>
    <p>Time bonus: <b>+${timeBonus}</b> &nbsp;·&nbsp; Score: <b>${game.score}</b></p>
    <p>Next up: <b>${LEVELS[game.levelIndex + 1].name}</b> — ${LEVELS[game.levelIndex + 1].differences.length} differences, trickier still.</p>
    <button id="nextBtn" type="button">Next level ▶</button>
  `);
  $('nextBtn').addEventListener('click', () => {
    sfx.playClick();
    startLevel(game.levelIndex + 1);
  });
}

function onTimeUp() {
  stopTimer();
  game.screen = 'time-up';
  sfx.playMiss();
  const level = currentLevel();
  showOverlay(`
    <h2>⏰ Time's up!</h2>
    <h3>${level.name}</h3>
    <p>You found ${game.found.size} of ${level.differences.length} differences.
       The rest are still hiding — give it another go!</p>
    <button id="retryBtn" type="button">↻ Try this level again</button>
  `);
  $('retryBtn').addEventListener('click', () => {
    sfx.playClick();
    startLevel(game.levelIndex);
  });
}

export function pickAt(x, y) {
  if (game.screen !== 'playing' || game.frozen) return;
  const level = currentLevel();
  const hit = level.differences.find(
    (d) => !game.found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r,
  );
  if (hit) {
    game.found.add(hit.id);
    game.totalFound += 1;
    game.combo += 1;
    game.bestCombo = Math.max(game.bestCombo, game.combo);
    const gained = 100 + (game.combo - 1) * 25;
    game.score += gained;
    placeMarker(els.markersLeft, hit, 'ring');
    placeMarker(els.markersRight, hit, 'ring');
    if (game.combo >= 3) {
      sfx.playCombo();
      showCombo(`Combo ×${game.combo}! +${gained}`);
    } else {
      sfx.playFound();
      showCombo(`Found it! +${gained}`);
    }
    updateHud();
    if (game.found.size === level.differences.length) onLevelClear();
    return;
  }
  // A miss: red X on both panels, combo lost, five seconds off the clock.
  game.combo = 0;
  game.timeLeft = Math.max(0, game.timeLeft - 5);
  sfx.playMiss();
  for (const container of [els.markersLeft, els.markersRight]) {
    const miss = document.createElement('div');
    miss.className = 'miss';
    miss.textContent = '✕';
    miss.style.left = `${x * SCALE_X}px`;
    miss.style.top = `${y * SCALE_Y}px`;
    container.appendChild(miss);
    window.setTimeout(() => miss.remove(), 650);
  }
  updateHud();
  if (game.timeLeft <= 0) onTimeUp();
}

export function useHint() {
  if (game.screen !== 'playing' || game.frozen || game.hintsLeft <= 0) return;
  const level = currentLevel();
  const remaining = level.differences.filter((d) => !game.found.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - 15);
  sfx.playHint();
  const rings = [
    placeMarker(els.markersLeft, pick, 'ring hint-ring'),
    placeMarker(els.markersRight, pick, 'ring hint-ring'),
  ];
  window.setTimeout(() => rings.forEach((r) => r.remove()), 2500);
  updateHud();
}

export function toggleSound() {
  sfx.setMuted(!sfx.isMuted());
  els.soundBtn.textContent = sfx.isMuted() ? '🔇 Muted' : '🔊 Sound';
}

export function togglePause() {
  if (game.screen === 'playing') {
    game.screen = 'paused';
    stopTimer();
    showOverlay(`
      <h2>⏸ Paused</h2>
      <p>Take a breath — the differences will wait.</p>
      <button id="resumeBtn" type="button">▶ Resume</button>
    `);
    $('resumeBtn').addEventListener('click', () => {
      sfx.playClick();
      game.screen = 'playing';
      hideOverlay();
      startTimer();
    });
  } else if (game.screen === 'paused') {
    game.screen = 'playing';
    hideOverlay();
    startTimer();
  }
}

export function updateCrosshair() {
  const show = game.screen === 'playing';
  els.crossLeft.hidden = !(show && game.activePanel === 'left');
  els.crossRight.hidden = !(show && game.activePanel === 'right');
  const el = game.activePanel === 'left' ? els.crossLeft : els.crossRight;
  el.style.left = `${10 + game.cursor.x * SCALE_X}px`;
  el.style.top = `${10 + game.cursor.y * SCALE_Y}px`;
}

function canvasCoords(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
    y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
  };
}

export function bindInput() {
  els.canvasLeft.addEventListener('click', (event) => {
    game.activePanel = 'left';
    const { x, y } = canvasCoords(event, els.canvasLeft);
    game.cursor = { x, y };
    updateCrosshair();
    pickAt(x, y);
  });
  els.canvasRight.addEventListener('click', (event) => {
    game.activePanel = 'right';
    const { x, y } = canvasCoords(event, els.canvasRight);
    game.cursor = { x, y };
    updateCrosshair();
    pickAt(x, y);
  });

  els.hintBtn.addEventListener('click', useHint);
  els.soundBtn.addEventListener('click', () => { sfx.playClick(); toggleSound(); });
  els.restartBtn.addEventListener('click', () => {
    if (game.screen === 'playing' || game.screen === 'paused') {
      sfx.playClick();
      startLevel(game.levelIndex);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (game.screen !== 'playing') return;
      event.preventDefault();
      const step = event.shiftKey ? 8 : 24;
      if (event.key === 'ArrowLeft') game.cursor.x = Math.max(0, game.cursor.x - step);
      if (event.key === 'ArrowRight') game.cursor.x = Math.min(PANEL_W, game.cursor.x + step);
      if (event.key === 'ArrowUp') game.cursor.y = Math.max(0, game.cursor.y - step);
      if (event.key === 'ArrowDown') game.cursor.y = Math.min(PANEL_H, game.cursor.y + step);
      updateCrosshair();
      return;
    }
    if (event.key === 'Tab') {
      if (game.screen !== 'playing') return;
      event.preventDefault();
      game.activePanel = game.activePanel === 'left' ? 'right' : 'left';
      updateCrosshair();
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (game.screen !== 'playing') return;
      event.preventDefault();
      pickAt(game.cursor.x, game.cursor.y);
      return;
    }
    const key = event.key.toLowerCase();
    if (key === 'h') useHint();
    if (key === 'm') toggleSound();
    if (key === 'r' && (game.screen === 'playing' || game.screen === 'paused')) startLevel(game.levelIndex);
    if (key === 'p') togglePause();
  });
}

export function boot() {
  bindInput();
  showStartScreen();
}
