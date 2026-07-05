import { useEffect, useRef, useState } from 'react';
import { Universe } from '../models/Universe';

export function useSimulation(width: number, height: number) {
  const universeRef = useRef<Universe | null>(null);
  
  if (!universeRef.current) {
    universeRef.current = new Universe(width, height);
  }

  const [isRunning, setIsRunning] = useState(false);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!isRunning || !universeRef.current) return;

    const interval = setInterval(() => {
      if (!universeRef.current) return;
      
      universeRef.current.update();
      forceUpdate(v => v + 1);
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    if (universeRef.current) {
      universeRef.current.reset();
      setIsRunning(false);
      forceUpdate(v => v + 1);
    }
  };

  return {
    universe: universeRef.current,
    isRunning,
    start,
    pause,
    reset
  };
}