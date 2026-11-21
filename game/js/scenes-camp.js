// Scene 3 — Starlight Camp.
// A quiet night camp: a striped tent, a crackling fire, a crescent moon,
// pine trees, a lantern, a backpack and a guitar leaning on a tree.
// Variant 1 applies the nine differences listed below.

import { circle, ellipse, rect, poly, line, roundedRect, drawMoon, drawPine, drawStar } from './helpers.js';

export const campScene = {
  id: 'camp',
  name: 'Starlight Camp',
  timeLimit: 150,
  differences: [
    { id: 'moon-phase', x: 502, y: 70, r: 36, label: 'the moon turned crescent' },
    { id: 'star-cluster', x: 152, y: 82, r: 30, label: 'a cluster of stars faded' },
    { id: 'campfire-flame', x: 300, y: 330, r: 34, label: 'the campfire flame shrank' },
    { id: 'tent-flag', x: 302, y: 148, r: 26, label: 'the tent flag disappeared' },
    { id: 'lantern-glow', x: 422, y: 362, r: 26, label: 'the lantern went dark' },
    { id: 'marshmallow', x: 232, y: 332, r: 26, label: 'the marshmallow vanished' },
    { id: 'backpack-colour', x: 482, y: 382, r: 28, label: 'the backpack changed colour' },
    { id: 'pine-count', x: 72, y: 202, r: 30, label: 'a pine tree disappeared' },
    { id: 'guitar', x: 388, y: 302, r: 30, label: 'the guitar is gone' },
  ],

  paint(ctx, variant) {
    const changed = variant === 1;
    const W = 600;
    const H = 450;

    // Night sky and ground.
    const sky = ctx.createLinearGradient(0, 0, 0, 320);
    sky.addColorStop(0, '#0d1b3e');
    sky.addColorStop(1, '#274b73');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 320);
    ctx.fillStyle = '#1d3a2a';
    ctx.fillRect(0, 320, W, 130);
    ellipse(ctx, 300, 324, 320, 12, '#24452f');

    // Stars (difference 2: the little cluster at top-left fades).
    const stars = [[60, 60], [110, 40], [200, 50], [260, 90], [330, 44], [400, 80], [450, 40], [540, 130], [80, 140], [360, 120]];
    for (const [sx, sy] of stars) drawStar(ctx, sx, sy, 5, '#fff7c0');
    if (!changed) {
      drawStar(ctx, 152, 82, 6, '#fff7c0');
      drawStar(ctx, 134, 96, 4, '#fff7c0');
      drawStar(ctx, 170, 98, 4, '#fff7c0');
    }

    // Moon (difference 1: full moon becomes a crescent).
    drawMoon(ctx, 502, 70, 30, changed ? 'crescent' : 'full');

    // Pine trees (difference 8: the leftmost pine is gone).
    if (!changed) drawPine(ctx, 72, 320, 130, '#1e5c34', '#4a3220');
    drawPine(ctx, 128, 320, 96, '#256b3d', '#4a3220');
    drawPine(ctx, 540, 320, 118, '#1e5c34', '#4a3220');

    // The tent.
    poly(ctx, [[210, 330], [300, 190], [390, 330]], '#e85d3d');
    poly(ctx, [[300, 190], [390, 330], [336, 330]], '#f4a259');
    poly(ctx, [[300, 190], [264, 330], [210, 330]], '#c94a2e');
    poly(ctx, [[282, 330], [300, 268], [318, 330]], '#2b2118');
    line(ctx, 300, 190, 300, 330, 3, '#8a3a22');
    // Tent flag (difference 4: the flag is gone).
    if (!changed) {
      line(ctx, 300, 190, 300, 148, 3, '#f7e3c3');
      poly(ctx, [[300, 148], [328, 156], [300, 164]], '#ffd60a');
    }

    // Sleeping bag beside the tent.
    roundedRect(ctx, 150, 356, 90, 34, 17, '#3a6fd8');
    roundedRect(ctx, 150, 356, 90, 16, 8, '#5b8de8');
    circle(ctx, 158, 372, 8, '#ffd60a');

    // Campfire (difference 3: the flame shrinks).
    ellipse(ctx, 300, 352, 52, 12, '#4a3220');
    line(ctx, 268, 348, 332, 336, 6, '#6b4423');
    line(ctx, 268, 336, 332, 348, 6, '#6b4423');
    const flameH = changed ? 26 : 52;
    const flameW = changed ? 16 : 26;
    poly(ctx, [[300, 348 - flameH], [300 - flameW, 348], [300 + flameW, 348]], '#ff7b00');
    poly(ctx, [[300, 348 - flameH * 0.6], [300 - flameW * 0.6, 348], [300 + flameW * 0.6, 348]], '#ffd60a');
    // Fire glow.
    const glow = ctx.createRadialGradient(300, 330, 6, 300, 330, 90);
    glow.addColorStop(0, 'rgba(255, 160, 40, 0.4)');
    glow.addColorStop(1, 'rgba(255, 160, 40, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(210, 240, 180, 180);

    // Marshmallow stick (difference 6: the marshmallow is gone).
    line(ctx, 210, 356, 244, 322, 4, '#6b4423');
    if (!changed) {
      roundedRect(ctx, 238, 312, 14, 16, 5, '#fff8e6');
      line(ctx, 242, 316, 248, 316, 2, '#e8c98a');
    }

    // Lantern (difference 5: the lantern glow goes out).
    line(ctx, 422, 330, 422, 344, 3, '#8a6d4b');
    roundedRect(ctx, 410, 344, 24, 30, 6, '#37474f');
    ctx.fillStyle = changed ? '#2b3a42' : '#ffd60a';
    ctx.fillRect(414, 349, 16, 20);
    if (!changed) {
      const lglow = ctx.createRadialGradient(422, 359, 4, 422, 359, 44);
      lglow.addColorStop(0, 'rgba(255, 214, 10, 0.5)');
      lglow.addColorStop(1, 'rgba(255, 214, 10, 0)');
      ctx.fillStyle = lglow;
      ctx.fillRect(378, 315, 88, 88);
    }

    // Guitar leaning on the right pine (difference 9: the guitar is gone).
    if (!changed) {
      ctx.save();
      ctx.translate(388, 302);
      ctx.rotate(0.5);
      ellipse(ctx, 0, 0, 18, 24, '#8a5a2b');
      circle(ctx, 0, 0, 8, '#2b2118');
      rect(ctx, -4, -52, 8, 34, '#6b4423');
      rect(ctx, -8, -58, 16, 8, '#37474f');
      line(ctx, -2, -50, -2, 16, 1, '#f7e3c3');
      line(ctx, 2, -50, 2, 16, 1, '#f7e3c3');
      ctx.restore();
    }

    // Backpack (difference 7: red backpack becomes teal).
    const packColor = changed ? '#2a9d8f' : '#e23b3b';
    roundedRect(ctx, 462, 360, 40, 44, 10, packColor);
    roundedRect(ctx, 472, 346, 20, 16, 8, packColor);
    rect(ctx, 468, 378, 28, 6, '#37474f');
    circle(ctx, 482, 392, 4, '#ffd60a');

    // Fireflies.
    for (const [fx, fy] of [[90, 300], [520, 280], [440, 240], [180, 250]]) {
      circle(ctx, fx, fy, 3, 'rgba(255, 247, 192, 0.9)');
    }

    // A log bench for sitting by the fire.
    roundedRect(ctx, 96, 386, 64, 14, 7, '#6b4423');
    rect(ctx, 104, 400, 8, 12, '#4a3220');
    rect(ctx, 144, 400, 8, 12, '#4a3220');
  },
};
