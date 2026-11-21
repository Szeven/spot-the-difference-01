// Level registry for Lighthouse Cove.
// Each level is one illustrated scene with its own time limit and its list
// of differences. The game walks this list in order; finishing a level
// unlocks the next, and finishing all three wins the game.

import { coveScene } from './scenes-cove.js';
import { hollowScene } from './scenes-hollow.js';
import { campScene } from './scenes-camp.js';

export const LEVELS = [coveScene, hollowScene, campScene];

export function levelById(id) {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0];
}

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.differences.length, 0);
}

// Human-readable level names, in play order, for the HUD and overlays.
export function levelNames() {
  return LEVELS.map((level, i) => `${i + 1} · ${level.name}`);
}
