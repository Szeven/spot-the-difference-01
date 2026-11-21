// Tiny static server for local play-testing of Lighthouse Cove.
//
// Serves game/ at http://localhost:8080 with no build step and no network
// dependency. Usage: `node serve.ts` (or `node serve.ts 9000` for a port).
// Pass ?shot=start|play|end&seed=N in the URL for deterministic states
// used by the screenshot flow (see shots.json).

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const gameDir = join(repoRoot, 'game');
const port = Number(process.argv[2] ?? 8080);

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  const rawPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const safePath = normalize(join(gameDir, rawPath === '/' ? 'index.html' : rawPath));
  if (!safePath.startsWith(gameDir) || !existsSync(safePath) || !statSync(safePath).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found\n');
    return;
  }
  res.writeHead(200, {
    'content-type': mimeTypes[extname(safePath)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  res.end(readFileSync(safePath));
});

server.listen(port, () => {
  console.log(`Lighthouse Cove served at http://localhost:${port}`);
});
