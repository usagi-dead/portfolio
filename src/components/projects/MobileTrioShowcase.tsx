import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Lang, ProjectScreen } from '../../types/portfolio';

interface MobileTrioShowcaseProps {
  screens: ProjectScreen[];
  projectTitle: string;
  lang: Lang;
  onOpenLightbox?: (screenIndex: number) => void;
  accentColor?: string;
  accentRgb?: string;
}

const FLOW_TITLES: Record<Lang, { default: string; screens: [string, string, string] }> = {
  en: {
    default: 'Telegram Mini App · 01 Menu · 02 Dish · 03 Cart',
    screens: [
      'Screen 01 · Dynamic Menu, Promo Stories & Categories',
      'Screen 02 · Item Customizer & Ingredient Management',
      'Screen 03 · Shopping Cart & Fast Checkout',
    ],
  },
  ru: {
    default: 'Telegram Mini App · 01 Меню · 02 Блюдо · 03 Корзина',
    screens: [
      'Экран 01 · Динамическое меню, сторис и категории блюд',
      'Экран 02 · Карточка блюда и кастомизация ингредиентов',
      'Экран 03 · Корзина и оформление заказа',
    ],
  },
};

/**
 * Image component with fallback to mock smartphone UI
 */
function PhoneScreenImage({
  src,
  alt,
  accentColor = '#6ED209',
  accentRgb = '110, 210, 9',
}: {
  src: string;
  alt: string;
  accentColor?: string;
  accentRgb?: string;
}) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="rounded-[19px] aspect-[9/19.5] w-full bg-[#121318] flex flex-col items-center justify-between p-4 text-center border border-white/[0.06] select-none">
        {/* Mock status bar */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
          <span>09:41</span>
          <div className="w-2.5 h-1.5 rounded-[2px] border border-zinc-600 bg-zinc-600/40" />
        </div>

        {/* Center branding */}
        <div className="flex flex-col items-center my-auto">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3"
            style={{
              backgroundColor: `rgba(${accentRgb}, 0.1)`,
              border: `1px solid rgba(${accentRgb}, 0.3)`,
              boxShadow: `0 0 20px rgba(${accentRgb}, 0.15)`,
            }}
          >
            🌯
          </div>
          <span className="text-xs font-mono font-bold text-white tracking-wide">{alt}</span>
          <span className="text-[10px] font-mono mt-1" style={{ color: accentColor }}>
            Telegram Mini App
          </span>
        </div>

        {/* Mock bottom bar */}
        <div className="w-full h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] font-mono text-zinc-400">
          9:19.5 Mobile View
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className="rounded-[19px] aspect-[9/19.5] w-full h-auto object-cover object-top select-none pointer-events-none"
    />
  );
}

export function MobileTrioShowcase({
  screens,
  projectTitle,
  lang,
  onOpenLightbox,
  accentColor = '#6ED209',
  accentRgb = '110, 210, 9',
}: MobileTrioShowcaseProps) {
  // Mobile active screen index (0, 1, 2)
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  // Desktop persistent focus state: set by clicking number buttons (01, 02, 03)
  const [focusedScreen, setFocusedScreen] = useState<number | null>(null);

  // Desktop hover preview state
  const [hoveredScreen, setHoveredScreen] = useState<number | null>(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  // Preload all screen images on mount
  useEffect(() => {
    if (screens && screens.length > 0) {
      screens.forEach((screen) => {
        const img = new Image();
        img.src = screen.src;
      });
    }
  }, [screens]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset desktop focus when user clicks outside the showcase or presses Escape
  useEffect(() => {
    if (focusedScreen === null || isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setFocusedScreen(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocusedScreen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedScreen, isMobile]);

  // Handle number click in the top switcher bar
  const handleNumberClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setActiveMobileIdx(idx);
    } else {
      // On desktop, clicking a number toggles/sets focus state
      setFocusedScreen((prev) => (prev === idx ? null : idx));
    }
  };

  // Touch handlers for fluid mobile swiping (discrete GPU-accelerated slider)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = Math.abs(e.touches[0].clientX - touchStartXRef.current);
    const diffY = Math.abs(e.touches[0].clientY - touchStartYRef.current);
    if (diffX > 10 && diffX > diffY) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && activeMobileIdx < screens.length - 1) {
        setActiveMobileIdx((prev) => Math.min(screens.length - 1, prev + 1));
      } else if (diffX < 0 && activeMobileIdx > 0) {
        setActiveMobileIdx((prev) => Math.max(0, prev - 1));
      }
    }

    setTimeout(() => {
      isSwipingRef.current = false;
    }, 80);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveMobileIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveMobileIdx((prev) => Math.min(screens.length - 1, prev + 1));
  };

  // Desktop active index is either previewed hover or persistent focus
  const activeDesktopIdx = hoveredScreen ?? focusedScreen;
  const currentIndicatorIdx = isMobile ? activeMobileIdx : activeDesktopIdx;

  // Header display title
  const currentTitle = isMobile
    ? (screens[activeMobileIdx]?.title?.[lang] || FLOW_TITLES[lang].screens[activeMobileIdx])
    : activeDesktopIdx === null
    ? FLOW_TITLES[lang].default
    : (screens[activeDesktopIdx]?.title?.[lang] || FLOW_TITLES[lang].screens[activeDesktopIdx]);

  return (
    <div
      ref={rootRef}
      onMouseLeave={() => {
        if (!isMobile) setHoveredScreen(null);
      }}
      className="relative group/img rounded-2xl bg-[#09090b] border border-white/[0.08] overflow-hidden select-none isolate"
    >
      {/* Top accent border line matching card styling */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 sm:inset-x-20 top-0 h-[1px] z-20"
        style={{
          background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.4), transparent)`,
        }}
      />

      {/* --- Top Sub-bar / Interactive User Flow Bar --- */}
      <div className="relative z-10 flex items-center justify-between min-h-[58px] sm:min-h-[62px] p-2.5 sm:p-3 border-b border-white/[0.06] bg-white/[0.015] backdrop-blur-sm text-xs font-mono rounded-t-[15px]">
        <div className="text-zinc-400 truncate pr-2 flex items-center gap-2 min-w-0">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          <span
            key={currentIndicatorIdx ?? 'default'}
            className="inline-block animate-text-swap text-zinc-300 font-medium truncate"
          >
            {currentTitle}
          </span>
        </div>

        {/* Right side: compact 01 | 02 | 03 switcher with accent sliding pill */}
        <div className="relative inline-flex items-center p-1 gap-1 rounded-xl bg-black/60 border border-white/[0.08] backdrop-blur-md shrink-0 nav-btn-group">
          {/* Smooth sliding active indicator pill */}
          <div
            className={`pointer-events-none absolute top-1 bottom-1 left-1 w-6 sm:w-7 rounded-lg shadow-sm transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              currentIndicatorIdx !== null ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translateX(calc(${(currentIndicatorIdx ?? 0)} * var(--btn-step)))`,
              backgroundColor: `rgba(${accentRgb}, 0.2)`,
              borderColor: `rgba(${accentRgb}, 0.4)`,
              borderWidth: '1px',
            }}
          />

          {screens.map((_, idx) => {
            const isPillActive = currentIndicatorIdx === idx;
            const isItemFocused = !isMobile && focusedScreen === idx;

            return (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => {
                  if (!isMobile) setHoveredScreen(idx);
                }}
                onMouseLeave={() => {
                  if (!isMobile) setHoveredScreen(null);
                }}
                onClick={(e) => handleNumberClick(idx, e)}
                className={`relative z-10 inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 p-0 rounded-lg font-mono text-[11px] sm:text-xs leading-none transition-colors duration-200 cursor-pointer before:absolute before:-inset-x-[2px] before:inset-y-0 before:content-[''] ${
                  isPillActive || isItemFocused
                    ? 'font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                style={{
                  color: isPillActive || isItemFocused ? accentColor : undefined,
                }}
                title={
                  isMobile
                    ? (screens[idx]?.title?.[lang] || FLOW_TITLES[lang].screens[idx])
                    : `${screens[idx]?.title?.[lang] || FLOW_TITLES[lang].screens[idx]} (${
                        isItemFocused ? (lang === 'ru' ? 'Снять фокус' : 'Unfocus') : (lang === 'ru' ? 'Выставить фокус' : 'Set focus')
                      })`
                }
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Mobile View (< 640px): High-Performance Transform Carousel with Zero Stutter --- */}
      <div
        className="sm:hidden relative w-full overflow-hidden touch-pan-y py-4 px-2 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Horizontal sliding track */}
        <div
          className="flex w-full transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translate3d(-${activeMobileIdx * 100}%, 0, 0)` }}
        >
          {screens.map((screen, idx) => (
            <div
              key={screen.src}
              className="w-full shrink-0 flex items-center justify-center px-4"
            >
              <div
                onClick={() => {
                  if (isSwipingRef.current) return;
                  onOpenLightbox?.(idx);
                }}
                className="group/phone w-[210px] max-w-[68vw] rounded-[24px] p-[6px] bg-[#141418] border border-white/10 cursor-zoom-in relative active:scale-[0.98] transition-transform duration-150"
                style={{
                  borderColor:
                    activeMobileIdx === idx
                      ? `rgba(${accentRgb}, 0.5)`
                      : 'rgba(255, 255, 255, 0.1)',
                  boxShadow:
                    activeMobileIdx === idx
                      ? `0 18px 40px rgba(0,0,0,0.9), 0 0 20px rgba(${accentRgb}, 0.18)`
                      : '0 16px 36px rgba(0,0,0,0.85)',
                }}
              >
                {/* Speaker notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 pointer-events-none z-20" />

                {/* Screen image with automatic fallback */}
                <PhoneScreenImage
                  src={screen.src}
                  alt={screen.title?.[lang] || `${projectTitle} Screen 0${idx + 1}`}
                  accentColor={accentColor}
                  accentRgb={accentRgb}
                />

                {/* Subtle zoom cue icon */}
                <div className="pointer-events-none absolute top-3.5 right-3.5 z-20">
                  <div
                    className="p-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10"
                    style={{
                      borderColor: `rgba(${accentRgb}, 0.3)`,
                      color: accentColor,
                    }}
                  >
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile in-card Prev / Next Arrow buttons */}
        {activeMobileIdx > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous screen"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 border border-white/15 text-white/90 active:scale-95 backdrop-blur-md shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {activeMobileIdx < screens.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next screen"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 border border-white/15 text-white/90 active:scale-95 backdrop-blur-md shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-3 pb-1">
          {screens.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveMobileIdx(idx)}
              aria-label={`Go to screen ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeMobileIdx === idx ? 'w-5' : 'w-1.5 bg-white/20'
              }`}
              style={{
                backgroundColor: activeMobileIdx === idx ? accentColor : undefined,
                boxShadow: activeMobileIdx === idx ? `0 0 8px ${accentColor}` : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* --- Desktop View (>= 640px): 3 Smartphones on Dark Podium with Focus State --- */}
      <div className="hidden sm:block p-6 md:p-8 relative rounded-b-[15px]">
        <div className="relative z-10 grid grid-cols-3 gap-5 md:gap-6 items-center select-none">
          {screens.map((screen, idx) => {
            const isFocused = focusedScreen === idx;
            const isHighlighted = activeDesktopIdx === idx;
            const hasAnyActive = activeDesktopIdx !== null;

            // Staggering when unfocused: central phone (idx 1) slightly higher
            const baseStagger = idx === 1 ? 'sm:-translate-y-1.5' : 'sm:translate-y-1.5';

            return (
              <div
                key={screen.src}
                className={`w-full transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isHighlighted ? 'sm:-translate-y-3' : baseStagger
                }`}
              >
                <div
                  onClick={() => {
                    // Open lightbox on desktop click
                    onOpenLightbox?.(idx);
                  }}
                  onMouseEnter={() => setHoveredScreen(idx)}
                  onMouseLeave={() => setHoveredScreen(null)}
                  className={`group/phone rounded-[24px] p-[6px] bg-[#141418] border transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-zoom-in relative ${
                    isHighlighted
                      ? 'scale-[1.04] z-20 opacity-100 ring-2'
                      : hasAnyActive
                      ? 'opacity-40 scale-[0.96] z-0 hover:opacity-85 hover:scale-[0.98]'
                      : 'opacity-100 hover:scale-[1.02] hover:opacity-100'
                  }`}
                  style={{
                    borderColor: isHighlighted
                      ? `rgba(${accentRgb}, 0.8)`
                      : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isHighlighted
                      ? `0 24px 48px rgba(0,0,0,0.95), 0 0 28px rgba(${accentRgb}, 0.28)`
                      : '0 16px 36px rgba(0,0,0,0.85)',
                  }}
                >
                  {/* Speaker notch at top of phone bezel */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 pointer-events-none z-20" />

                  {/* Focus badge indicator in top-left corner on desktop if focused */}
                  {isFocused && (
                    <div
                      className="absolute top-3 left-3 z-30 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold text-white bg-black/80 backdrop-blur-md border animate-fade-in"
                      style={{
                        borderColor: accentColor,
                        color: accentColor,
                        boxShadow: `0 0 10px rgba(${accentRgb}, 0.3)`,
                      }}
                    >
                      0{idx + 1} FOCUS
                    </div>
                  )}

                  {/* Screen image with automatic fallback */}
                  <PhoneScreenImage
                    src={screen.src}
                    alt={screen.title?.[lang] || `${projectTitle} Screen 0${idx + 1}`}
                    accentColor={accentColor}
                    accentRgb={accentRgb}
                  />

                  {/* Hover zoom cue icon */}
                  <div className="pointer-events-none absolute top-3.5 right-3.5 opacity-0 group-hover/phone:opacity-100 transition-opacity duration-200 z-20">
                    <div
                      className="p-1 rounded-md bg-black/80 backdrop-blur-md"
                      style={{
                        border: `1px solid rgba(${accentRgb}, 0.4)`,
                        color: accentColor,
                      }}
                    >
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
