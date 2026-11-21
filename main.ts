// Lighthouse Cove — spot the difference, make.fun entry hand-in program.
//
// Node 22, standard library only. It takes this repository's game/ and
// screenshots/ folders and writes them, plus the judge's dossier.json, into
// the output directory: /output in the grader, or MAKEFUN_OUTPUT_DIR when
// set (handy for a local check: MAKEFUN_OUTPUT_DIR=out node main.ts).
//
// The dossier is built with the kit's vendored library, vendor/makefun-game.ts,
// under the scorer's caps: 160 KiB of source text, at most 4 screenshots of
// 256 KiB each, game/ within 993 files and 48 MiB, paths within 1000 bytes.
// The program is deterministic: two runs write byte-identical outputs.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function clearDir(dir: string): void {
  // Empty the directory's contents without removing the directory itself,
  // so a second run over a stale output still lands byte-identical.
  if (!existsSync(dir)) return;
  for (const entry of ['game', 'screenshots', 'dossier.json']) {
    const target = join(dir, entry);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  }
}

function handIn(): void {
  const gameSource = join(repoRoot, 'game');
  if (!existsSync(join(gameSource, 'index.html'))) {
    throw new Error('game/index.html is missing — nothing to hand in');
  }
  mkdirSync(outputDir, { recursive: true });
  clearDir(outputDir);

  const gameDest = join(outputDir, 'game');
  cpSync(gameSource, gameDest, { recursive: true });

  const shotsSource = join(repoRoot, 'screenshots');
  const shotsDest = join(outputDir, 'screenshots');
  mkdirSync(shotsDest, { recursive: true });
  if (existsSync(shotsSource)) cpSync(shotsSource, shotsDest, { recursive: true });

  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
}

handIn();
