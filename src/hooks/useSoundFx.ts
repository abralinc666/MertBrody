import { useCallback, useEffect, useRef, useState } from 'react';

type SoundName = 'click' | 'betPlaced' | 'win' | 'error' | 'cashout' | 'tab';

let audioCtx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function envelope(ctx: AudioContext, gain: GainNode, peak: number, attack: number, decay: number, startAt: number) {
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(peak, startAt + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + attack + decay);
}

function playOsc(ctx: AudioContext, freq: number, type: OscillatorType, peak: number, attack: number, decay: number, startAt: number, glideTo?: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, startAt + attack + decay);
  osc.connect(gain);
  gain.connect(ctx.destination);
  envelope(ctx, gain, peak, attack, decay, startAt);
  osc.start(startAt);
  osc.stop(startAt + attack + decay + 0.05);
  return osc;
}

function playClickSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playOsc(ctx, 1800, 'sine', 0.04, 0.005, 0.04, t);
}

function playTabSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playOsc(ctx, 900, 'triangle', 0.05, 0.005, 0.06, t, 1300);
}

function playBetPlacedSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playOsc(ctx, 523, 'sine', 0.08, 0.01, 0.12, t);
  playOsc(ctx, 659, 'sine', 0.08, 0.01, 0.12, t + 0.08);
  playOsc(ctx, 784, 'sine', 0.09, 0.01, 0.18, t + 0.16);
}

function playWinSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    playOsc(ctx, f, 'sine', 0.1, 0.01, 0.2, t + i * 0.1);
    playOsc(ctx, f * 2, 'triangle', 0.04, 0.01, 0.2, t + i * 0.1);
  });
}

function playCashoutSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playOsc(ctx, 880, 'sine', 0.08, 0.01, 0.1, t);
  playOsc(ctx, 1320, 'sine', 0.07, 0.01, 0.14, t + 0.06);
}

function playErrorSound(ctx: AudioContext) {
  const t = ctx.currentTime;
  playOsc(ctx, 220, 'sawtooth', 0.06, 0.01, 0.18, t, 140);
}

export function playSound(name: SoundName) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  switch (name) {
    case 'click': playClickSound(ctx); break;
    case 'tab': playTabSound(ctx); break;
    case 'betPlaced': playBetPlacedSound(ctx); break;
    case 'win': playWinSound(ctx); break;
    case 'cashout': playCashoutSound(ctx); break;
    case 'error': playErrorSound(ctx); break;
  }
}

export function useSoundFx() {
  const [soundOn, setSoundOn] = useState(true);
  const mutedRef = useRef(false);

  useEffect(() => { mutedRef.current = !soundOn; muted = !soundOn; }, [soundOn]);

  const toggleSound = useCallback(() => setSoundOn((v) => !v), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (mutedRef.current) return;
      const target = e.target as HTMLElement;
      const btn = target.closest('button');
      if (!btn) return;
      if (btn.dataset.sound) return;
      if (btn.classList.contains('odd') || btn.classList.contains('sub-odd')) return;
      playSound('click');
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return { soundOn, toggleSound };
}
