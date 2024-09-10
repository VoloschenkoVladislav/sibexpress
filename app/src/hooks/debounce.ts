import { useRef, useEffect } from "react";

export function useDebouncedFunction(func: Function, delay: number, cleanUp = false) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }

  useEffect(() => (cleanUp ? clearTimer : undefined), [cleanUp]);

  // @ts-ignore
  return (...args) => {
    clearTimer();
    timeoutRef.current = setTimeout(() => func(...args), delay);
  };
}
