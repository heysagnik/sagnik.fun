// Tiny synthesized "dial click": a band-passed noise tick plus a soft low thump. No audio assets.
const KEY = "dial-sound";

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let last = 0;

export function isSoundOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

// Browsers only start audio after a user gesture (a wheel scroll does not count). Call this from
// gesture handlers: it creates the context once and resumes it every time until it is running.
export function armDialSound() {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function playDialClick() {
  if (!ctx || ctx.state !== "running" || !isSoundOn()) return;
  const now = ctx.currentTime;
  if (now - last < 0.04) return;
  last = now;

  if (!noise) {
    noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const detune = 1 + (Math.random() - 0.5) * 0.16;

  const tick = ctx.createBufferSource();
  tick.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2000 * detune;
  band.Q.value = 0.8;
  const tickGain = ctx.createGain();
  tickGain.gain.setValueAtTime(0.28, now);
  tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
  tick.connect(band).connect(tickGain).connect(ctx.destination);
  tick.start(now);

  const thump = ctx.createOscillator();
  thump.type = "sine";
  thump.frequency.setValueAtTime(620 * detune, now);
  thump.frequency.exponentialRampToValueAtTime(260, now + 0.05);
  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(0.05, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
  thump.connect(thumpGain).connect(ctx.destination);
  thump.start(now);
  thump.stop(now + 0.05);
}
