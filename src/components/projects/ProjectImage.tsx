import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import type { Lang, ProjectScreen } from '../../types/portfolio';

interface ProjectImageProps {
  src: string;
  alt: string;
  lang: Lang;
  onClick?: () => void;
  screens?: ProjectScreen[];
  currentScreenIdx?: number;
  onPrevScreen?: (e: React.MouseEvent) => void;
  onNextScreen?: (e: React.MouseEvent) => void;
  onSelectScreen?: (idx: number, e: React.MouseEvent) => void;
  accentColor?: string;
  accentRgb?: string;
}

/**
 * Image component with automatic webp -> png fallback
 */
function FallbackImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
}

export function ProjectImage({
  src,
  alt,
  lang,
  onClick,
  screens,
  currentScreenIdx = 0,
  onPrevScreen,
  onNextScreen,
  onSelectScreen,
  accentColor = '#00BC7D',
  accentRgb = '74, 222, 128',
}: ProjectImageProps) {
  const hasMultiple = (screens?.length ?? 0) > 1;
  const activeScreen = screens?.[currentScreenIdx];

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultiple) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasMultiple || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = Math.abs(e.touches[0].clientX - touchStartXRef.current);
    const diffY = Math.abs(e.touches[0].clientY - touchStartYRef.current);
    if (diffX > 8 && diffX > diffY) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultiple || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        onNextScreen?.(e as unknown as React.MouseEvent);
      } else {
        onPrevScreen?.(e as unknown as React.MouseEvent);
      }
    }
  };

  // Preload all project screen images into browser memory on mount
  useEffect(() => {
    if (screens && screens.length > 0) {
      screens.forEach((screen) => {
        const img = new Image();
        img.src = screen.src;
      });
    }
  }, [screens]);

  return (
    <div className="relative group/img rounded-2xl bg-[#09090b] border border-white/[0.08] overflow-hidden select-none isolate">
      {/* Top accent border line matching card styling */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 sm:inset-x-20 top-0 h-[1px] z-20"
        style={{
          background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.4), transparent)`,
        }}
      />

      {/* --- Top Sub-bar with screen tabs (if multiple screens) --- */}
      {hasMultiple && (
        <div className="relative z-10 flex items-center justify-between min-h-[58px] sm:min-h-[62px] p-2.5 sm:p-3 border-b border-white/[0.06] bg-white/[0.015] backdrop-blur-sm text-xs font-mono rounded-t-[15px]">
          <div className="text-zinc-400 truncate pr-2 flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
              }}
            />
            <span
              key={currentScreenIdx}
              className="inline-block animate-text-swap text-zinc-300 font-medium truncate"
            >
              {activeScreen?.title?.[lang] || (lang === 'ru' ? `Экран 0${currentScreenIdx + 1}` : `Screen 0${currentScreenIdx + 1}`)}
            </span>
          </div>

          {/* Symmetrical square pagination controls (w-6 h-6 on mobile, w-7 h-7 on desktop) */}
          <div className="relative inline-flex items-center p-1 gap-1 rounded-xl bg-black/60 border border-white/[0.08] backdrop-blur-md shrink-0 nav-btn-group">
            {/* Smooth sliding active indicator */}
            <div
              className="pointer-events-none absolute top-1 bottom-1 left-1 w-6 sm:w-7 rounded-lg shadow-sm transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(calc(${currentScreenIdx} * var(--btn-step)))`,
                backgroundColor: `rgba(${accentRgb}, 0.2)`,
                borderColor: `rgba(${accentRgb}, 0.4)`,
                borderWidth: '1px',
              }}
            />

            {screens?.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => onSelectScreen?.(idx, e)}
                className={`relative z-10 inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 p-0 rounded-lg font-mono text-[11px] sm:text-xs leading-none transition-colors duration-200 cursor-pointer ${
                  idx === currentScreenIdx
                    ? 'font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                style={{
                  color: idx === currentScreenIdx ? accentColor : undefined,
                }}
                title={screens?.[idx]?.title?.[lang] || (lang === 'ru' ? `Экран 0${idx + 1}` : `Screen 0${idx + 1}`)}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- Fixed Aspect Ratio Viewport (16:9 exact ratio matching 1200x675 screenshots) --- */}
      <div
        onClick={() => {
          if (isSwipingRef.current) {
            isSwipingRef.current = false;
            return;
          }
          onClick?.();
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative aspect-[16/9] w-full overflow-hidden cursor-zoom-in group/thumb bg-black/40 touch-pan-y rounded-b-[15px]"
      >
        {/* Horizontal sliding track for animated screen flipping */}
        <div
          className="flex w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translateX(-${currentScreenIdx * 100}%)` }}
        >
          {screens && screens.length > 0 ? (
            screens.map((screen) => (
              <div
                key={screen.src}
                className="w-full h-full shrink-0 flex items-start justify-center"
              >
                <FallbackImage
                  src={screen.src}
                  alt={screen.title?.[lang] || alt}
                  className="w-full h-full object-cover object-top select-none pointer-events-none"
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full shrink-0 flex items-start justify-center">
              <FallbackImage
                src={src}
                alt={alt}
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* --- Hover Expand Cue Pill --- */}
        <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 opacity-0 group-hover/thumb:opacity-100 transition-all duration-200 translate-y-1 group-hover/thumb:translate-y-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 border border-white/15 text-zinc-200 text-[11px] font-mono backdrop-blur-md shadow-lg">
            <Maximize2 className="w-3 h-3" style={{ color: accentColor }} />
            <span>{lang === 'ru' ? 'Увеличить' : 'Zoom In'}</span>
          </div>
        </div>

        {/* --- In-card Prev / Next Arrows for Multiple Screens --- */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrevScreen?.(e);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white/80 hover:text-white backdrop-blur-md transition-all opacity-0 group-hover/img:opacity-100 hover:scale-105 cursor-pointer shadow-md"
              title={lang === 'ru' ? 'Предыдущий экран' : 'Previous screen'}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNextScreen?.(e);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white/80 hover:text-white backdrop-blur-md transition-all opacity-0 group-hover/img:opacity-100 hover:scale-105 cursor-pointer shadow-md"
              title={lang === 'ru' ? 'Следующий экран' : 'Next screen'}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
