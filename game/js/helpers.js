// Shared canvas drawing helpers for Lighthouse Cove's three scenes.
// Every helper draws one small illustrated element at (x, y) on a 2D
// context; the scene painters compose them into full pictures.

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundedRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function poly(ctx, points, fill) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, width, stroke) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = width;
  ctx.strokeStyle = stroke;
  ctx.lineCap = 'round';
  ctx.stroke();
}

// A soft puffy cloud made of overlapping circles.
export function drawCloud(ctx, x, y, scale, fill) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.arc(22, -8, 26, 0, Math.PI * 2);
  ctx.arc(48, 0, 20, 0, Math.PI * 2);
  ctx.arc(24, 8, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// A five-point star, used for night skies and decorations.
export function drawStar(ctx, x, y, r, fill, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.45;
    const angle = rot + (i * Math.PI) / 5;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

// A small seagull: two curved wings.
export function drawGull(ctx, x, y, scale, stroke) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(-14, 0);
  ctx.quadraticCurveTo(-7, -9, 0, 0);
  ctx.quadraticCurveTo(7, -9, 14, 0);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = stroke;
  ctx.stroke();
  ctx.restore();
}

// A pine tree: stacked triangles with a trunk.
export function drawPine(ctx, x, y, height, green, trunk) {
  const w = height * 0.42;
  rect(ctx, x - 4, y, 8, height * 0.14, trunk);
  poly(ctx, [[x, y - height], [x - w, y - height * 0.25], [x + w, y - height * 0.25]], green);
  poly(ctx, [[x, y - height * 0.8], [x - w * 0.85, y], [x + w * 0.85, y]], green);
}

// A round-crowned tree with a trunk.
export function drawRoundTree(ctx, x, y, r, green, trunk) {
  rect(ctx, x - 6, y - 6, 12, 46, trunk);
  circle(ctx, x - r * 0.55, y - 26, r * 0.62, green);
  circle(ctx, x + r * 0.55, y - 26, r * 0.62, green);
  circle(ctx, x, y - 52, r * 0.72, green);
}

// A simple five-petal flower on a stem.
export function drawFlower(ctx, x, y, petal, center) {
  line(ctx, x, y, x, y + 22, 3, '#2e7d32');
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  circle(ctx, x, y, 5, center);
}

// A glowing sun with rays.
export function drawSun(ctx, x, y, r, withRays) {
  if (withRays) {
    ctx.save();
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      line(ctx, x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6),
        x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18), 4, '#ffb703');
    }
    ctx.restore();
  }
  circle(ctx, x, y, r, '#ffd60a');
  circle(ctx, x - 8, y - 8, r * 0.45, '#ffe66d');
}

// A crescent moon.
export function drawMoon(ctx, x, y, r, phase) {
  circle(ctx, x, y, r, '#f4f1de');
  if (phase === 'crescent') {
    circle(ctx, x + r * 0.45, y - r * 0.15, r * 0.85, '#1b2a4a');
  }
  circle(ctx, x - r * 0.3, y - r * 0.3, r * 0.18, '#d9d4b8');
  circle(ctx, x + r * 0.25, y + r * 0.3, r * 0.14, '#d9d4b8');
}

// A tiny four-point sparkle, for glints on water and fireflies.
export function drawSparkle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fillStyle = fill;
  ctx.fill();
}
