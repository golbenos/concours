import { useCallback, useRef } from 'react';

function playTone(freq, duration, type = 'sine') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export default function useSound() {
  const enabled = useRef(localStorage.getItem('soundEnabled') !== 'false');

  const playCorrect = useCallback(() => {
    if (!enabled.current) return;
    playTone(523.25, 0.12);
    setTimeout(() => playTone(659.25, 0.15), 100);
  }, []);

  const playIncorrect = useCallback(() => {
    if (!enabled.current) return;
    playTone(200, 0.2, 'sawtooth');
  }, []);

  const playFinish = useCallback(() => {
    if (!enabled.current) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.2), i * 120);
    });
  }, []);

  const toggleSound = useCallback(() => {
    enabled.current = !enabled.current;
    localStorage.setItem('soundEnabled', enabled.current);
    return enabled.current;
  }, []);

  return { playCorrect, playIncorrect, playFinish, toggleSound, isSoundEnabled: () => enabled.current };
}
