// WebAudio sound effects for Lighthouse Cove.
// Every sound is synthesised with oscillators — no audio files, no network.
// The AudioContext is created lazily on the first user gesture so browsers
// allow playback.

let audioContext = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
}

function context() {
  if (!audioContext) {
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return null;
    audioContext = new AC();
  }
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

function tone(freq, startAt, duration, type, volume) {
  if (muted) return;
  const ac = context();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(volume, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + duration + 0.05);
}

// A soft click for ordinary button presses.
export function playClick() {
  tone(620, 0, 0.08, 'sine', 0.12);
}

// The satisfying two-note chime when a difference is found.
export function playFound() {
  tone(880, 0, 0.16, 'sine', 0.22);
  tone(1318, 0.09, 0.24, 'sine', 0.22);
}

// A higher sparkle for a combo (third find in a row without a miss).
export function playCombo() {
  tone(1046, 0, 0.12, 'triangle', 0.2);
  tone(1318, 0.07, 0.12, 'triangle', 0.2);
  tone(1760, 0.14, 0.22, 'triangle', 0.2);
}

// A low buzz for a wrong click.
export function playMiss() {
  tone(160, 0, 0.18, 'sawtooth', 0.12);
  tone(110, 0.05, 0.2, 'sawtooth', 0.1);
}

// A gentle ping when a hint is used.
export function playHint() {
  tone(1174, 0, 0.3, 'sine', 0.14);
  tone(1568, 0.12, 0.3, 'sine', 0.1);
}

// A bright two-note jingle when a level starts.
export function playStart() {
  tone(659, 0, 0.12, 'triangle', 0.18);
  tone(880, 0.1, 0.2, 'triangle', 0.18);
}

// A short fanfare when a level is cleared.
export function playLevelClear() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((freq, i) => tone(freq, i * 0.11, 0.22, 'triangle', 0.2));
}

// The full win fanfare when all three levels are done.
export function playWin() {
  const notes = [523, 659, 784, 1046, 784, 1046, 1318];
  notes.forEach((freq, i) => tone(freq, i * 0.13, 0.26, 'triangle', 0.2));
}
