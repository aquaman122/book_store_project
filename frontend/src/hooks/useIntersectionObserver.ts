import React ,{ useEffect, useRef } from "react";

type callback = (entries: IntersectionObserverEntry[]) => void;
interface ObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useIntersectionObserver = (callback: callback, options?: ObserverOptions) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if(targetRef.current) {
        observer.disconnect()
      }
    };
  }, [targetRef.current, options, callback]);

  return targetRef;
}