import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitionDone, setIsTransitionDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if element is already within viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      if (delay > 0) {
        timerRef.current = setTimeout(() => setIsVisible(true), delay);
      } else {
        setIsVisible(true);
      }
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timerRef.current = setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px 40px 0px',
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay]);

  // Once revealed and animation finishes, remove transform and will-change to prevent mobile scroll clipping
  useEffect(() => {
    if (isVisible && !isTransitionDone) {
      const fallbackTimer = setTimeout(() => {
        setIsTransitionDone(true);
      }, 750);
      return () => clearTimeout(fallbackTimer);
    }
  }, [isVisible, isTransitionDone]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === ref.current && isVisible) {
      setIsTransitionDone(true);
    }
  };

  return (
    <div
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isTransitionDone
          ? 'opacity-100 transform-none will-change-auto'
          : isVisible
          ? 'opacity-100 translate-y-0 will-change-[opacity,transform]'
          : 'opacity-0 translate-y-3 sm:translate-y-6 will-change-[opacity,transform]'
      } ${className}`}
    >
      {children}
    </div>
  );
}
