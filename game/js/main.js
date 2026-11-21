// Lighthouse Cove — entry point.
// Boots the game, then applies a deterministic screenshot state when the
// page is opened with ?shot=start|play|end (see shots.json).

import { boot } from './game.js';
import { applyShotMode } from './shots.js';

boot();
applyShotMode();

// Debug handle for play-testing from the browser console.
window.__cove = { boot, applyShotMode };
