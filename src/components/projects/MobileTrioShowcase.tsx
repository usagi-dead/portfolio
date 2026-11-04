import { Maximize2 } from 'lucide-react';
import { useRef, useState } from 'react';
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
    default: 'Telegram Mini App · 01 Menu · 02 Builder · 03 Cart',
    screens: [
      'Screen 01 · Dynamic Menu, Promo Stories & Categories',
      'Screen 02 · Item Customizer & Ingredient Management',
      'Screen 03 · Shopping Cart & Fast Checkout',
    ],
  },
  ru: {
    default: 'Telegram Mini App · 01 Меню · 02 Конструктор · 03 Корзина',
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
  const [focusedScreen, setFocusedScreen] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleHoverScreen = (idx: number) => {
    setFocusedScreen(idx);
  };

  const handleSelectScreen = (idx: number) => {
    setFocusedScreen(idx);
    if (scrollContainerRef.current) {
      const target = scrollContainerRef.current.querySelector(
        `[data-screen-idx="${idx}"]`
      ) as HTMLElement | null;
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  };

  const isAnyFocused = focusedScreen !== null;

  return (
    <div
      onMouseLeave={() => setFocusedScreen(null)}
      className="relative group/img rounded-2xl bg-[#09090b] border border-white/[0.08] overflow-hidden select-none"
    >
      {/* Top accent border line matching card styling */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-20 top-0 h-[1px] z-20"
        style={{
          background: `linear-gradient(to right, transparent, rgba(${accentRgb}, 0.4), transparent)`,
        }}
      />

      {/* --- Top Sub-bar / Interactive User Flow Bar (Car Auction matching geometry and height) --- */}
      <div className="relative z-10 flex items-center justify-between min-h-[58px] sm:min-h-[62px] p-2.5 sm:p-3 border-b border-white/[0.06] bg-white/[0.015] backdrop-blur-sm text-xs font-mono">
        <div className="text-zinc-400 truncate pr-2 flex items-center gap-2 min-w-0">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
          <span
            key={focusedScreen ?? 'default'}
            className="inline-block animate-text-swap text-zinc-300 font-medium truncate"
          >
            {focusedScreen === null
              ? FLOW_TITLES[lang].default
              : FLOW_TITLES[lang].screens[focusedScreen]}
          </span>
        </div>

        {/* Right side: compact 01 | 02 | 03 switcher with lime accent */}
        <div
          onMouseLeave={() => setFocusedScreen(null)}
          className="relative inline-flex items-center p-1 gap-1 rounded-xl bg-black/60 border border-white/[0.08] backdrop-blur-md shrink-0 nav-btn-group"
        >
          {/* Smooth sliding active indicator */}
          <div
            className={`pointer-events-none absolute top-1 bottom-1 left-1 w-6 sm:w-7 rounded-lg shadow-sm transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              focusedScreen !== null ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translateX(calc(${(focusedScreen ?? 0)} * var(--btn-step)))`,
              backgroundColor: `rgba(${accentRgb}, 0.2)`,
              borderColor: `rgba(${accentRgb}, 0.4)`,
              borderWidth: '1px',
            }}
          />

          {screens.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => handleHoverScreen(idx)}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectScreen(idx);
              }}
              className={`relative z-10 inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 p-0 rounded-lg font-mono text-[11px] sm:text-xs leading-none transition-colors duration-200 cursor-pointer before:absolute before:-inset-x-[2px] before:inset-y-0 before:content-[''] ${
                focusedScreen === idx
                  ? 'font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              style={{
                color: focusedScreen === idx ? accentColor : undefined,
              }}
              title={FLOW_TITLES[lang].screens[idx]}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* --- 3 Smartphones on Dark Podium (Desktop: 3 in a row / Mobile: compact horizontal swipe carousel) --- */}
      <div className="p-3 sm:p-6 md:p-8 relative">
        <div
          ref={scrollContainerRef}
          className="relative z-10 flex sm:grid sm:grid-cols-3 sm:gap-5 md:gap-6 items-center overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3.5 px-3 sm:px-1 pt-2 sm:pt-4 pb-3 sm:pb-4 custom-scrollbar"
        >
          {screens.map((screen, idx) => {
            const isThisFocused = focusedScreen === idx;

            // Staggering: central phone (idx 1) slightly higher, side phones (idx 0 & 2) slightly lower
            const staggerClass =
              idx === 1
                ? 'sm:-translate-y-1.5'
                : 'sm:translate-y-1.5';

            return (
              <div
                key={screen.src}
                data-screen-idx={idx}
                className={`w-[175px] max-w-[175px] sm:w-full sm:max-w-none shrink-0 snap-center transition-all duration-300 ${staggerClass}`}
              >
                <div
                  onClick={() => onOpenLightbox?.(idx)}
                  onMouseEnter={() => handleHoverScreen(idx)}
                  onMouseLeave={() => setFocusedScreen(null)}
                  className={`group/phone rounded-[24px] p-[6px] bg-[#141418] border transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-zoom-in relative ${
                    isThisFocused
                      ? 'scale-[1.03] z-20 opacity-100 sm:-translate-y-2'
                      : isAnyFocused
                      ? 'opacity-60 scale-[0.98] z-0'
                      : 'opacity-100 hover:scale-[1.02] hover:opacity-100'
                  }`}
                  style={{
                    borderColor: isThisFocused
                      ? `rgba(${accentRgb}, 0.6)`
                      : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isThisFocused
                      ? `0 20px 40px rgba(0,0,0,0.9), 0 0 24px rgba(${accentRgb}, 0.22)`
                      : '0 16px 36px rgba(0,0,0,0.85)',
                  }}
                >
                  {/* Speaker notch at top of phone bezel */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 pointer-events-none z-20" />

                  {/* Screen image with automatic webp -> png -> placeholder fallback (No truncated sub-labels inside) */}
                  <PhoneScreenImage
                    src={screen.src}
                    alt={FLOW_TITLES[lang].screens[idx] || `${projectTitle} Screen 0${idx + 1}`}
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
