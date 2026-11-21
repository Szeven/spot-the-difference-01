// Scene 1 — Lighthouse Cove.
// A sunny seaside cove: striped lighthouse, a little red-sailed boat, gulls,
// a crab on the rocks and a starfish on the sand. The right panel is drawn
// with `variant = 1`, which applies the seven differences listed below.

import { circle, ellipse, rect, poly, line, roundedRect, drawCloud, drawGull, drawSun, drawStar } from './helpers.js';

export const coveScene = {
  id: 'cove',
  name: 'Lighthouse Cove',
  timeLimit: 150,
  differences: [
    { id: 'sun-rays', x: 92, y: 72, r: 42, label: 'the sun lost its rays' },
    { id: 'boat-sail', x: 152, y: 296, r: 36, label: 'the boat sail changed colour' },
    { id: 'gull-count', x: 262, y: 72, r: 26, label: 'a seagull flew away' },
    { id: 'tower-window', x: 432, y: 232, r: 26, label: 'the lighthouse window vanished' },
    { id: 'crab', x: 92, y: 402, r: 30, label: 'the crab scuttled off' },
    { id: 'starfish', x: 522, y: 420, r: 26, label: 'the starfish disappeared' },
    { id: 'high-cloud', x: 482, y: 88, r: 38, label: 'a cloud drifted away' },
  ],

  paint(ctx, variant) {
    const changed = variant === 1;
    const W = 600;
    const H = 450;

    // Sky.
    const sky = ctx.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, '#7ec8e3');
    sky.addColorStop(1, '#d8f1f8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 300);

    // Sun (difference 1: rays vanish in the changed picture).
    drawSun(ctx, 92, 72, 30, !changed);

    // Clouds (difference 7: the high cloud on the right is gone).
    drawCloud(ctx, 300, 58, 1.0, '#ffffff');
    drawCloud(ctx, 178, 128, 0.6, '#ffffff');
    if (!changed) drawCloud(ctx, 482, 88, 0.8, '#ffffff');

    // Seagulls (difference 3: the middle gull is gone).
    drawGull(ctx, 205, 92, 1.0, '#2b3a42');
    if (!changed) drawGull(ctx, 262, 72, 0.9, '#2b3a42');
    drawGull(ctx, 335, 112, 0.8, '#2b3a42');

    // Distant headland.
    poly(ctx, [[0, 300], [70, 252], [150, 300]], '#5d8a6a');
    poly(ctx, [[430, 300], [520, 258], [600, 300]], '#5d8a6a');

    // Sea.
    const sea = ctx.createLinearGradient(0, 300, 0, 400);
    sea.addColorStop(0, '#2f8fbf');
    sea.addColorStop(1, '#17617f');
    ctx.fillStyle = sea;
    ctx.fillRect(0, 300, W, 100);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 3;
    for (const [wx, wy, wl] of [[60, 322, 70], [330, 330, 90], [470, 318, 60], [180, 356, 80], [420, 362, 70]]) {
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.quadraticCurveTo(wx + wl / 2, wy - 7, wx + wl, wy);
      ctx.stroke();
    }

    // Little boat (difference 2: red sail becomes blue).
    const sailColor = changed ? '#3a6fd8' : '#e4572e';
    poly(ctx, [[152, 268], [152, 322], [196, 322]], sailColor);
    poly(ctx, [[146, 276], [146, 322], [112, 322]], '#fff3d6');
    line(ctx, 152, 264, 152, 324, 4, '#6b4423');
    poly(ctx, [[104, 322], [204, 322], [192, 340], [118, 340]], '#8b5a2b');
    circle(ctx, 152, 264, 5, '#f2b705');

    // A striped buoy bobbing near the boat.
    circle(ctx, 268, 352, 12, '#ff8c42');
    rect(ctx, 256, 348, 24, 8, '#fff3d6');
    line(ctx, 268, 340, 268, 330, 3, '#37474f');

    // Sandy shore at the bottom.
    ctx.fillStyle = '#f2d8a0';
    ctx.fillRect(0, 400, W, 50);
    ellipse(ctx, 300, 400, 320, 12, '#e8c98a');

    // Rocks on the shore.
    ellipse(ctx, 92, 412, 42, 20, '#8d99a5');
    ellipse(ctx, 150, 422, 30, 14, '#7b8894');
    ellipse(ctx, 522, 414, 36, 16, '#8d99a5');

    // Crab on the left rock (difference 5: the crab is gone).
    if (!changed) {
      ellipse(ctx, 92, 398, 14, 10, '#e4572e');
      line(ctx, 80, 400, 66, 392, 3, '#e4572e');
      line(ctx, 80, 404, 66, 412, 3, '#e4572e');
      line(ctx, 104, 400, 118, 392, 3, '#e4572e');
      line(ctx, 104, 404, 118, 412, 3, '#e4572e');
      circle(ctx, 86, 390, 3, '#1c1c1c');
      circle(ctx, 98, 390, 3, '#1c1c1c');
    }

    // Starfish on the sand (difference 6: the starfish is gone).
    if (!changed) {
      drawStar(ctx, 522, 420, 14, '#ff8c42');
      circle(ctx, 522, 420, 4, '#e56b1f');
    }

    // The lighthouse, standing on the right headland.
    // Tower body with red stripes.
    poly(ctx, [[408, 392], [418, 150], [446, 150], [456, 392]], '#f8f4e8');
    poly(ctx, [[412, 330], [452, 330], [450, 296], [414, 296]], '#e4572e');
    poly(ctx, [[415, 240], [449, 240], [447, 206], [417, 206]], '#e4572e');
    // Gallery and lamp room.
    rect(ctx, 408, 138, 48, 14, '#37474f');
    rect(ctx, 420, 108, 24, 30, '#ffd60a');
    line(ctx, 432, 108, 432, 100, 3, '#37474f');
    poly(ctx, [[414, 108], [450, 108], [432, 88]], '#e4572e');
    // Lamp glow.
    const glow = ctx.createRadialGradient(432, 123, 4, 432, 123, 60);
    glow.addColorStop(0, 'rgba(255, 214, 10, 0.85)');
    glow.addColorStop(1, 'rgba(255, 214, 10, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(372, 63, 120, 120);
    // Tower window (difference 4: the window is gone).
    if (!changed) {
      roundedRect(ctx, 424, 218, 16, 24, 8, '#37474f');
      roundedRect(ctx, 426, 220, 12, 20, 6, '#9fd8e8');
    }
    // Door at the base.
    roundedRect(ctx, 424, 356, 16, 36, 8, '#6b4423');

    // Grass tufts on the shore.
    for (const gx of [240, 268, 540, 566]) {
      line(ctx, gx, 408, gx - 5, 392, 2, '#3e7d4e');
      line(ctx, gx, 408, gx, 390, 2, '#3e7d4e');
      line(ctx, gx, 408, gx + 5, 392, 2, '#3e7d4e');
    }
  },
};
