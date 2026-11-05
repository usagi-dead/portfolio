import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if element is already within or near viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
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
        threshold: 0,
        rootMargin: '0px 0px 120px 0px', // Reveal ahead of scroll so content is ready before entering viewport
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-500 ease-out sm:transition-[opacity,transform] sm:duration-600 sm:ease-out ${
        isVisible
          ? 'opacity-100 sm:translate-y-0'
          : 'opacity-0 sm:translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}
