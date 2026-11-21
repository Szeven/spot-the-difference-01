// Scene 2 — Mushroom Hollow.
// A storybook forest clearing: a cottage with a smoking chimney, a giant
// spotted mushroom, an owl on a branch, a butterfly, a snail and a flower
// path. Variant 1 applies the eight differences listed below.

import { circle, ellipse, rect, poly, line, roundedRect, drawCloud, drawFlower, drawRoundTree, drawSun } from './helpers.js';

export const hollowScene = {
  id: 'hollow',
  name: 'Mushroom Hollow',
  timeLimit: 150,
  differences: [
    { id: 'chimney-smoke', x: 316, y: 62, r: 30, label: 'the chimney smoke faded' },
    { id: 'owl-eyes', x: 520, y: 142, r: 26, label: 'the owl closed its eyes' },
    { id: 'butterfly', x: 150, y: 180, r: 28, label: 'the butterfly flew off' },
    { id: 'mushroom-spots', x: 470, y: 282, r: 34, label: 'two mushroom spots vanished' },
    { id: 'window-lit', x: 272, y: 242, r: 26, label: 'the cottage window went dark' },
    { id: 'snail', x: 352, y: 410, r: 26, label: 'the snail slid away' },
    { id: 'flower-colour', x: 122, y: 362, r: 24, label: 'a flower changed colour' },
    { id: 'tree-apples', x: 92, y: 152, r: 26, label: 'two apples fell from the tree' },
  ],

  paint(ctx, variant) {
    const changed = variant === 1;
    const W = 600;
    const H = 450;

    // Soft morning sky and meadow.
    const sky = ctx.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, '#a8e0c8');
    sky.addColorStop(1, '#f2f7d9');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 300);
    ctx.fillStyle = '#7ec850';
    ctx.fillRect(0, 300, W, 150);
    ellipse(ctx, 300, 306, 320, 14, '#6db844');

    drawSun(ctx, 520, 62, 26, true);
    drawCloud(ctx, 120, 60, 0.9, '#ffffff');
    drawCloud(ctx, 400, 40, 0.7, '#ffffff');

    // Big round tree on the left, with apples (difference 8: two apples gone).
    drawRoundTree(ctx, 92, 210, 58, '#3e9b4f', '#6b4423');
    circle(ctx, 66, 168, 7, '#e23b3b');
    if (!changed) {
      circle(ctx, 118, 152, 7, '#e23b3b');
      circle(ctx, 92, 138, 7, '#e23b3b');
    }
    circle(ctx, 104, 190, 7, '#e23b3b');

    // Branch with the owl on the right (difference 2: eyes open vs closed).
    line(ctx, 470, 168, 560, 148, 8, '#6b4423');
    ellipse(ctx, 520, 142, 22, 26, '#8a6d4b');
    ellipse(ctx, 512, 118, 10, 12, '#8a6d4b');
    ellipse(ctx, 528, 118, 10, 12, '#8a6d4b');
    if (!changed) {
      circle(ctx, 512, 140, 5, '#ffffff');
      circle(ctx, 528, 140, 5, '#ffffff');
      circle(ctx, 512, 140, 2.5, '#1c1c1c');
      circle(ctx, 528, 140, 2.5, '#1c1c1c');
    } else {
      line(ctx, 506, 140, 518, 140, 2, '#1c1c1c');
      line(ctx, 522, 140, 534, 140, 2, '#1c1c1c');
    }
    poly(ctx, [[516, 152], [524, 152], [520, 158]], '#ffb703');
    ellipse(ctx, 520, 162, 12, 8, '#d9c7a7');

    // The cottage.
    rect(ctx, 210, 200, 150, 130, '#f7e3c3');
    poly(ctx, [[196, 204], [285, 130], [374, 204]], '#c0563b');
    poly(ctx, [[196, 204], [285, 130], [374, 204]], '#c0563b');
    rect(ctx, 300, 108, 26, 62, '#b08968');
    rect(ctx, 296, 102, 34, 10, '#8a6d4b');
    // Chimney smoke (difference 1: smoke is gone).
    if (!changed) {
      circle(ctx, 312, 88, 12, 'rgba(255,255,255,0.85)');
      circle(ctx, 320, 66, 15, 'rgba(255,255,255,0.7)');
      circle(ctx, 312, 44, 17, 'rgba(255,255,255,0.55)');
    }
    // Door and window (difference 5: lit window goes dark).
    roundedRect(ctx, 268, 268, 34, 62, 8, '#7a4a2b');
    circle(ctx, 296, 300, 3, '#f2b705');
    roundedRect(ctx, 322, 232, 28, 28, 4, '#5a3a28');
    ctx.fillStyle = changed ? '#2b3a42' : '#ffd60a';
    ctx.fillRect(325, 235, 22, 22);
    line(ctx, 336, 235, 336, 257, 2, '#5a3a28');
    line(ctx, 325, 246, 347, 246, 2, '#5a3a28');
    // Roof shingles.
    line(ctx, 220, 188, 350, 188, 3, '#a34a33');
    line(ctx, 238, 172, 332, 172, 3, '#a34a33');
    line(ctx, 258, 156, 312, 156, 3, '#a34a33');

    // Giant mushroom on the right (difference 4: two spots vanish).
    rect(ctx, 458, 300, 26, 70, '#f7e3c3');
    ellipse(ctx, 471, 300, 62, 34, '#e23b3b');
    circle(ctx, 446, 286, 8, '#ffffff');
    circle(ctx, 492, 278, 7, '#ffffff');
    circle(ctx, 470, 296, 6, '#ffffff');
    if (!changed) {
      circle(ctx, 432, 296, 6, '#ffffff');
      circle(ctx, 500, 296, 6, '#ffffff');
    }
    ellipse(ctx, 471, 372, 40, 8, '#e8c98a');

    // A pair of baby mushrooms at the big one's foot.
    rect(ctx, 408, 356, 10, 16, '#f7e3c3');
    ellipse(ctx, 413, 356, 16, 9, '#ff6b9d');
    circle(ctx, 413, 353, 3, '#ffffff');
    rect(ctx, 528, 360, 8, 12, '#f7e3c3');
    ellipse(ctx, 532, 360, 12, 7, '#ff6b9d');

    // Butterfly (difference 3: the butterfly is gone).
    if (!changed) {
      ctx.save();
      ctx.translate(150, 180);
      ctx.rotate(-0.4);
      ellipse(ctx, -9, -6, 10, 7, '#b388ff');
      ellipse(ctx, 9, -6, 10, 7, '#b388ff');
      ellipse(ctx, -7, 7, 8, 5, '#8e6cff');
      ellipse(ctx, 7, 7, 8, 5, '#8e6cff');
      ctx.restore();
      line(ctx, 150, 180, 156, 172, 2, '#1c1c1c');
    }

    // Flower path stones.
    for (const [sx, sy] of [[250, 348], [300, 366], [348, 348], [392, 368]]) {
      ellipse(ctx, sx, sy, 22, 9, '#d9c7a7');
    }

    // Flowers along the path (difference 7: one flower turns purple).
    drawFlower(ctx, 122, 362, changed ? '#b388ff' : '#ff6b9d', '#ffd60a');
    drawFlower(ctx, 180, 392, '#ff6b9d', '#ffd60a');
    drawFlower(ctx, 430, 396, '#ff9f1c', '#7a4a2b');
    drawFlower(ctx, 540, 402, '#ff6b9d', '#ffd60a');

    // Snail on the path (difference 6: the snail is gone).
    if (!changed) {
      ellipse(ctx, 352, 410, 20, 8, '#f2b705');
      circle(ctx, 344, 398, 12, '#e85d3d');
      ctx.beginPath();
      ctx.arc(344, 398, 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#a83a22';
      ctx.lineWidth = 2;
      ctx.stroke();
      line(ctx, 366, 402, 372, 392, 2, '#1c1c1c');
      circle(ctx, 372, 390, 2, '#1c1c1c');
    }

    // Grass tufts.
    for (const gx of [40, 60, 200, 560, 580]) {
      line(ctx, gx, 430, gx - 5, 414, 2, '#2e7d32');
      line(ctx, gx, 430, gx, 412, 2, '#2e7d32');
      line(ctx, gx, 430, gx + 5, 414, 2, '#2e7d32');
    }
  },
};
