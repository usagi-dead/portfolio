import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  accentRgb?: string;
}

let globalMouseX = -9999;
let globalMouseY = -9999;
let isGlobalListenerAttached = false;

function setupGlobalMouseListener() {
  if (typeof window === 'undefined' || isGlobalListenerAttached) return;
  const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mq.matches) return;
  window.addEventListener(
    'mousemove',
    (e) => {
      globalMouseX = e.clientX;
      globalMouseY = e.clientY;
    },
    { passive: true }
  );
  isGlobalListenerAttached = true;
}

export function SpotlightCard({
  children,
  className = '',
  as: Component = 'div',
  accentRgb = '255, 255, 255',
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const isInside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;

    if (isInside) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
      cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      globalMouseX = e.clientX;
      globalMouseY = e.clientY;
      updatePosition(e.clientX, e.clientY);
    },
    [updatePosition]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      globalMouseX = e.clientX;
      globalMouseY = e.clientY;
      updatePosition(e.clientX, e.clientY);
    },
    [updatePosition]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;

    setupGlobalMouseListener();

    const handleScrollOrResize = () => {
      if (globalMouseX === -9999) return;
      updatePosition(globalMouseX, globalMouseY);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [updatePosition]);

  return (
    <Component
      ref={cardRef as any}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative frame-outer ${className}`}
      {...props}
    >
      {/* --- Outer Border Spotlight Glow Layer (22px mobile / 26px desktop) --- */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[22px] sm:rounded-[26px] transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(380px circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px), rgba(255, 255, 255, 0.45), rgba(${accentRgb}, 0.22) 35%, transparent 70%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* --- Inner Frame Border Spotlight Glow Layer (18px/4px mobile, 19px/7px desktop) --- */}
      <div
        className="pointer-events-none absolute inset-[4px] sm:inset-[7px] rounded-[18px] sm:rounded-[19px] transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(340px circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px), rgba(255, 255, 255, 0.38), rgba(${accentRgb}, 0.15) 30%, transparent 65%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />

      {/* --- Ambient Surface Reflection Layer --- */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[22px] sm:rounded-[26px] transition-opacity duration-300 z-0 overflow-hidden"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at var(--spotlight-x, -999px) var(--spotlight-y, -999px), rgba(${accentRgb}, 0.04), transparent 75%)`,
        }}
      />

      {children}
    </Component>
  );
}
