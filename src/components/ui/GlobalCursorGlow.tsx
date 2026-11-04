import { useEffect, useRef } from 'react';

export function GlobalCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on devices that have a real fine pointer/mouse with hover support
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isVisible = false;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        // Snap immediately to mouse coordinates on first movement (no glide from center)
        currentX = targetX;
        currentY = targetY;
        if (glowRef.current) {
          glowRef.current.style.opacity = '1';
        }
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      currentX = targetX;
      currentY = targetY;
      isVisible = true;
      if (glowRef.current) {
        glowRef.current.style.opacity = '1';
      }
    };

    const animate = () => {
      if (isVisible) {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${currentX - 260}px, ${currentY - 260}px, 0)`;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 w-[520px] h-[520px] rounded-full z-10 mix-blend-screen opacity-0 transition-opacity duration-500 ease-out hidden md:block"
      style={{
        background:
          'radial-gradient(circle, rgba(255, 255, 255, 0.065) 0%, rgba(255, 255, 255, 0.02) 35%, rgba(255, 255, 255, 0) 70%)',
        willChange: 'transform, opacity',
      }}
    />
  );
}
