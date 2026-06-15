import { useState, useEffect, useRef } from 'react';

export default function Timer({ duration, onTimeUp, running }) {
  const [remaining, setRemaining] = useState(duration);
  const called = useRef(false);

  useEffect(() => {
    setRemaining(duration);
    called.current = false;
  }, [duration]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id);
          if (!called.current) {
            called.current = true;
            setTimeout(() => onTimeUp?.(), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onTimeUp]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const isLow = remaining <= 60;

  return (
    <span className={`font-mono font-body-md text-body-md ${isLow ? 'text-red-400 animate-pulse' : 'text-gray-400 dark:text-gray-500'}`}>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}
