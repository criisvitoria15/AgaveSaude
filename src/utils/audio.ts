interface AudioEngineState {
  on: boolean;
  ctx: AudioContext | null;
  master: GainNode | null;
  rv: ConvolverNode | null;
  pad: { g: GainNode; os: OscillatorNode[] } | null;
}

const AU: AudioEngineState = {
  on: false,
  ctx: null,
  master: null,
  rv: null,
  pad: null,
};

const SCROLL_NOTES = [523, 587, 659, 784];

export function isAudioOn(): boolean {
  return AU.on;
}

export function auInit(): void {
  if (AU.ctx) return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  const c = (AU.ctx = new AudioCtx());
  AU.master = c.createGain();
  AU.master.gain.value = 0.55;
  AU.master.connect(c.destination);

  const len = Math.floor(c.sampleRate * 2.2);
  const b = c.createBuffer(2, len, c.sampleRate);
  for (let k = 0; k < 2; k++) {
    const d = b.getChannelData(k);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
  }
  AU.rv = c.createConvolver();
  AU.rv.buffer = b;
  const rg = c.createGain();
  rg.gain.value = 0.35;
  AU.rv.connect(rg);
  rg.connect(AU.master);
}

export function tone(
  f: number,
  t: number,
  d: number,
  ty?: OscillatorType,
  v: number = 0.1,
  to?: number
): void {
  const c = AU.ctx;
  if (!c || !AU.master || !AU.rv) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = ty || 'sine';
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + Math.min(0.02, d / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g);
  g.connect(AU.master);
  g.connect(AU.rv);
  o.start(t);
  o.stop(t + d + 0.05);
}

export function bell(f: number, t: number, v: number): void {
  [1, 2.76, 5.4, 8.9].forEach((m, i) => {
    tone(f * m, t, 2.6 / (i + 1), 'sine', v / (i + 1));
  });
}

export function beat(t: number): void {
  tone(60, t, 0.28, 'sine', 0.9, 38);
  tone(55, t + 0.2, 0.3, 'sine', 0.7, 35);
}

export function noise(
  t: number,
  d: number,
  f0: number,
  f1: number,
  v: number
): void {
  const c = AU.ctx;
  if (!c || !AU.master || !AU.rv) return;
  const b = c.createBuffer(1, Math.floor(c.sampleRate * d), c.sampleRate);
  const a = b.getChannelData(0);
  for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = b;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + d);
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(v, t + d * 0.4);
  g.gain.linearRampToValueAtTime(0, t + d);
  s.connect(f);
  f.connect(g);
  g.connect(AU.master);
  g.connect(AU.rv);
  s.start(t);
}

export function swell(t: number, d: number): void {
  const c = AU.ctx;
  if (!c || !AU.master || !AU.rv) return;
  const o = c.createOscillator();
  const o2 = c.createOscillator();
  const f = c.createBiquadFilter();
  const g = c.createGain();
  o.type = o2.type = 'sawtooth';
  o.frequency.setValueAtTime(82, t);
  o.frequency.exponentialRampToValueAtTime(165, t + d);
  o2.frequency.setValueAtTime(82.8, t);
  o2.frequency.exponentialRampToValueAtTime(166, t + d);
  f.type = 'lowpass';
  f.frequency.setValueAtTime(200, t);
  f.frequency.exponentialRampToValueAtTime(2200, t + d);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.16, t + d * 0.9);
  g.gain.linearRampToValueAtTime(0, t + d + 0.3);
  o.connect(f);
  o2.connect(f);
  f.connect(g);
  g.connect(AU.master);
  g.connect(AU.rv);
  o.start(t);
  o2.start(t);
  o.stop(t + d + 0.4);
  o2.stop(t + d + 0.4);
}

export function setSnd(on: boolean): boolean {
  if (on) {
    auInit();
    if (AU.ctx) {
      AU.ctx.resume().catch(() => {});
    }
  }
  AU.on = on;
  return AU.on;
}

export function auIntro(off: number): void {
  if (!AU.ctx) return;
  const n = AU.ctx.currentTime;
  function at(t: number, fn: (time: number) => void) {
    if (t >= off) fn(n + (t - off));
  }
  at(1.2, beat);
  at(1.9, beat);
  at(2.6, (t) => swell(t, 2.2));
  at(4.4, (t) => {
    bell(784, t, 0.22);
    bell(1175, t + 0.05, 0.12);
  });
  at(5.6, (t) => {
    [1318, 1760, 2093].forEach((f, i) => {
      tone(f, t + i * 0.14, 0.9, 'sine', 0.07);
    });
  });
  at(6.4, (t) => noise(t, 0.9, 800, 6000, 0.5));
  at(7, (t) => {
    tone(90, t, 1.8, 'sine', 0.9, 30);
    noise(t, 2.2, 300, 2500, 0.22);
  });
}

export function playScrollNote(index: number): void {
  if (AU.on && AU.ctx) {
    bell(SCROLL_NOTES[index % 4], AU.ctx.currentTime, 0.1);
  }
}

export function handleVisibilityAudio(): void {
  if (!AU.ctx) return;
  if (document.hidden) {
    AU.ctx.suspend().catch(() => {});
  } else if (AU.on) {
    AU.ctx.resume().catch(() => {});
  }
}
