import { useCallback, useRef } from "react";


export const useDebounce = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
  ) => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedCallback = useCallback(
      (...args: Parameters<T>) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay]
    );

    return debouncedCallback;
  };