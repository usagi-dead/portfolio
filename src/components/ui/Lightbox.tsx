import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lang } from '../../types/portfolio';

export interface LightboxScreen {
  src: string;
  title?: string;
  caption?: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  screens: LightboxScreen[];
  initialIndex?: number;
  lang: Lang;
}

export function Lightbox({
  isOpen,
  onClose,
  projectTitle,
  screens,
  initialIndex = 0,
  lang,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // --- Zoom & Pan/Drag State ---
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.5;

  const [zoomScale, setZoomScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({
    x: 0,
    y: 0,
    posX: 0,
    posY: 0,
  });
  const hasDraggedRef = useRef(false);
  const activeImgRef = useRef<HTMLImageElement | null>(null);

  const resetZoom = useCallback(() => {
    setZoomScale(1);
    setIsZoomed(false);
    setZoomPosition({ x: 0, y: 0 });
    setIsDragging(false);
    hasDraggedRef.current = false;
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomScale((prev) => {
      const next = Math.min(MAX_ZOOM, Number((prev + ZOOM_STEP).toFixed(1)));
      if (next > 1) {
        setIsZoomed(true);
      }
      return next;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomScale((prev) => {
      const next = Math.max(MIN_ZOOM, Number((prev - ZOOM_STEP).toFixed(1)));
      if (next <= 1) {
        setIsZoomed(false);
        setZoomPosition({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handleClose = useCallback(() => {
    resetZoom();
    onClose();
  }, [resetZoom, onClose]);

  // Synchronize mount and exit animation lifecycle with isOpen
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
      setIsClosing(false);
      setIsRendered(true);
    } else if (isRendered) {
      resetZoom();
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialIndex, resetZoom, isRendered]);

  // Keep screen index synced with initialIndex when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
    }
  }, [initialIndex, isOpen, resetZoom]);

  // Preload all screens in browser memory
  useEffect(() => {
    if (screens && screens.length > 0) {
      screens.forEach((s) => {
        const img = new Image();
        img.src = s.src;
      });
    }
  }, [screens]);

  const hasMultiple = screens.length > 1;

  const handlePrev = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : screens.length - 1));
  }, [screens.length, resetZoom]);

  const handleNext = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev < screens.length - 1 ? prev + 1 : 0));
  }, [screens.length, resetZoom]);

  // Keyboard navigation & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft' && hasMultiple) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && hasMultiple) {
        handleNext();
      } else if (
        e.key === '+' ||
        e.key === '=' ||
        e.code === 'NumpadAdd' ||
        e.code === 'Equal'
      ) {
        e.preventDefault();
        handleZoomIn();
      } else if (
        e.key === '-' ||
        e.key === '_' ||
        e.code === 'NumpadSubtract' ||
        e.code === 'Minus'
      ) {
        e.preventDefault();
        handleZoomOut();
      } else if (
        e.key === '0' ||
        e.code === 'Digit0' ||
        e.code === 'Numpad0'
      ) {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, hasMultiple, handlePrev, handleNext, handleClose, handleZoomIn, handleZoomOut, resetZoom]);

  // Touch swipe support on mobile (disabled during zoom to allow panning)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isZoomed) return;
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;
    if (Math.abs(diff) > 45 && hasMultiple) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // --- Clamp boundaries so the zoomed image does not escape the viewport ---
  const getClampBounds = useCallback(() => {
    if (!activeImgRef.current) return { maxX: 0, maxY: 0 };
    const rect = activeImgRef.current.getBoundingClientRect();
    const scale = zoomScale;
    const baseWidth = isZoomed ? rect.width / scale : rect.width;
    const baseHeight = isZoomed ? rect.height / scale : rect.height;

    const scaledWidth = baseWidth * scale;
    const scaledHeight = baseHeight * scale;

    const winW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Generous clamp bounds: allow user to freely inspect all 4 edges and corners without clipping
    const maxX = Math.max(baseWidth / 2, Math.abs(scaledWidth - winW) / 2 + 120);
    const maxY = Math.max(baseHeight / 2, Math.abs(scaledHeight - winH) / 2 + 120);

    return { maxX, maxY };
  }, [isZoomed, zoomScale]);

  // --- Image Click (Zoom In / Zoom Out) ---
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    if (isZoomed) {
      resetZoom();
    } else {
      const img = e.currentTarget;
      activeImgRef.current = img;
      const rect = img.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const maxX = rect.width / 2;
      const maxY = rect.height / 2;

      const targetX = Math.max(-maxX, Math.min(maxX, -dx * 2));
      const targetY = Math.max(-maxY, Math.min(maxY, -dy * 2));

      setZoomPosition({ x: targetX, y: targetY });
      setZoomScale(2);
      setIsZoomed(true);
    }
  };


  // --- Mouse Drag (Pan) Handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    e.stopPropagation();
    hasDraggedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: zoomPosition.x,
      posY: zoomPosition.y,
    };
    setIsDragging(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !isZoomed) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      if (Math.hypot(deltaX, deltaY) > 4) {
        hasDraggedRef.current = true;
      }

      const { maxX, maxY } = getClampBounds();
      const newX = Math.max(-maxX, Math.min(maxX, dragStartRef.current.posX + deltaX));
      const newY = Math.max(-maxY, Math.min(maxY, dragStartRef.current.posY + deltaY));

      setZoomPosition({ x: newX, y: newY });
    },
    [isDragging, isZoomed, getClampBounds]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // --- Touch Drag (Pan) Handlers ---
  const handleTouchStartImage = (e: React.TouchEvent) => {
    if (!isZoomed) return;
    if (e.touches.length === 1) {
      hasDraggedRef.current = false;
      const touch = e.touches[0];
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        posX: zoomPosition.x,
        posY: zoomPosition.y,
      };
      setIsDragging(true);
    }
  };

  const handleTouchMoveImage = (e: React.TouchEvent) => {
    if (!isDragging || !isZoomed || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;

    if (Math.hypot(deltaX, deltaY) > 4) {
      hasDraggedRef.current = true;
    }

    const { maxX, maxY } = getClampBounds();
    const newX = Math.max(-maxX, Math.min(maxX, dragStartRef.current.posX + deltaX));
    const newY = Math.max(-maxY, Math.min(maxY, dragStartRef.current.posY + deltaY));

    setZoomPosition({ x: newX, y: newY });
  };

  const handleTouchEndImage = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  if (!isRendered) return null;

  const activeScreen = screens[currentIndex] || screens[0];
  const cleanScreenTitle = activeScreen?.title
    ? activeScreen.title.replace(/^(?:Экран|Screen)\s*\d+\s*[·•-]?\s*/i, '').trim()
    : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex flex-col justify-between p-3 sm:p-6 select-none bg-black/92 backdrop-blur-xl ${
        isZoomed ? 'overflow-hidden' : ''
      } ${
        isClosing
          ? 'animate-lightbox-out pointer-events-none'
          : 'animate-lightbox-in'
      }`}
    >
      {/* --- Top Bar --- */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[1100px] mx-auto flex items-center justify-between gap-4 py-2 px-3.5 sm:px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-xs sm:text-sm font-mono text-zinc-300 z-30 shrink-0 ${
          isClosing ? 'animate-lightbox-out' : 'animate-lightbox-top-in'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <span className="font-semibold text-white truncate">{projectTitle}</span>
          {cleanScreenTitle && (
            <>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400 truncate hidden sm:inline">{cleanScreenTitle}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Zoom Segmented Controls (+ and - buttons) */}
          <div className="flex items-center rounded-lg border border-white/[0.1] bg-white/[0.04] p-0.5">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomScale <= MIN_ZOOM}
              className={`p-1 sm:px-2 rounded-md text-xs font-mono transition-colors ${
                zoomScale <= MIN_ZOOM
                  ? 'text-zinc-600 cursor-not-allowed'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.1] cursor-pointer'
              }`}
              title={lang === 'en' ? 'Zoom out (−)' : 'Отдалить (−)'}
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.08] rounded transition-colors cursor-pointer"
              title={lang === 'en' ? 'Reset zoom (0)' : 'Сбросить масштаб (0)'}
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomScale >= MAX_ZOOM}
              className={`p-1 sm:px-2 rounded-md text-xs font-mono transition-colors ${
                zoomScale >= MAX_ZOOM
                  ? 'text-zinc-600 cursor-not-allowed'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.1] cursor-pointer'
              }`}
              title={lang === 'en' ? 'Zoom in (+)' : 'Приблизить (+)'}
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-zinc-500">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10">ESC</kbd>
            <span>{lang === 'en' ? 'close' : 'закрыть'}</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1 sm:p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
            title={lang === 'en' ? 'Close (Esc)' : 'Закрыть (Esc)'}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* --- Main Sliding Viewport Area (Full screen width) --- */}
      <div
        className={`relative flex-1 w-full flex items-center justify-center my-2 sm:my-4 min-h-0 ${
          isZoomed ? 'overflow-visible' : 'overflow-hidden'
        } ${
          isClosing ? 'animate-lightbox-image-out' : 'animate-lightbox-image-in'
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            if (isZoomed) resetZoom();
            else handleClose();
          }
        }}
      >
        {/* Navigation Arrow Left (Centered in left margin space outside image container) */}
        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className={`absolute top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/75 hover:bg-black/95 border border-white/15 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl shrink-0 ${
              isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              left: 'max(8px, calc((100vw - 1100px) / 4 - 24px))',
            }}
            title={lang === 'en' ? 'Previous screen (←)' : 'Предыдущий экран (←)'}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Center Carousel Viewport (Original max-w-[1100px] width) */}
        <div
          className={`relative w-full max-w-[1100px] mx-auto h-full flex items-center justify-center ${
            isZoomed ? 'overflow-visible' : 'overflow-hidden'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (isZoomed) resetZoom();
              else handleClose();
            }
          }}
        >
          {/* Sliding Carousel Ribbon (Smooth easing) */}
          <div
            className={`flex w-full h-full items-center ${
              isZoomed ? 'overflow-visible' : ''
            } transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform`}
            style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
          >
            {screens.map((screen, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={screen.src}
                  className={`w-full h-full shrink-0 flex flex-col items-center justify-center px-2 sm:px-6 select-none transition-opacity duration-300 ${
                    isZoomed ? 'overflow-visible' : ''
                  } ${
                    isActive
                      ? 'opacity-100 z-10'
                      : 'opacity-0 invisible pointer-events-none'
                  }`}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      if (isZoomed) resetZoom();
                      else handleClose();
                    }
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`relative max-w-full max-h-full flex flex-col items-center justify-center cursor-default ${
                      isZoomed ? 'overflow-visible' : ''
                    } ${
                      isActive ? '' : 'invisible pointer-events-none'
                    }`}
                  >
                    <img
                      ref={isActive ? activeImgRef : undefined}
                      src={screen.src}
                      alt={screen.title || projectTitle}
                      onClick={isActive ? handleImageClick : undefined}
                      onMouseDown={isActive ? handleMouseDown : undefined}
                      onTouchStart={isActive ? handleTouchStartImage : undefined}
                      onTouchMove={isActive ? handleTouchMoveImage : undefined}
                      onTouchEnd={isActive ? handleTouchEndImage : undefined}
                      draggable={false}
                      className={`max-h-[68vh] sm:max-h-[74vh] w-auto max-w-full object-contain rounded-xl sm:rounded-2xl border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.95)] select-none will-change-transform ${
                        isActive
                          ? isZoomed
                            ? isDragging
                              ? 'cursor-grabbing'
                              : 'cursor-grab'
                            : 'cursor-zoom-in'
                          : 'invisible opacity-0 pointer-events-none'
                      }`}
                      style={
                        isActive && isZoomed
                          ? {
                              transform: `translate3d(${zoomPosition.x}px, ${zoomPosition.y}px, 0) scale(${zoomScale})`,
                              transition: isDragging
                                ? 'none'
                                : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                              zIndex: 20,
                            }
                          : {
                              transform: 'translate3d(0, 0, 0) scale(1)',
                              transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                            }
                      }
                    />

                    {screen.caption && (
                      <p
                        className={`mt-2.5 sm:mt-3 text-center text-xs sm:text-sm text-zinc-400 font-sans max-w-[700px] px-4 transition-opacity duration-200 ${
                          isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
                      >
                        {screen.caption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrow Right (Centered in right margin space outside image container) */}
        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className={`absolute top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/75 hover:bg-black/95 border border-white/15 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl shrink-0 ${
              isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              right: 'max(8px, calc((100vw - 1100px) / 4 - 24px))',
            }}
            title={lang === 'en' ? 'Next screen (→)' : 'Следующий экран (→)'}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* --- Symmetrical Bottom Navigation Strip --- */}
      {hasMultiple && (
        <div
          className={`flex justify-center shrink-0 z-30 transition-opacity duration-200 ${
            isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${
            isClosing ? 'animate-lightbox-out' : 'animate-lightbox-bottom-in'
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative inline-flex items-center p-1 gap-1 rounded-xl bg-black/80 border border-white/[0.12] backdrop-blur-xl shadow-2xl"
          >
            {/* Smooth sliding active indicator */}
            <div
              className="pointer-events-none absolute top-1 bottom-1 w-9 rounded-lg bg-white/[0.18] border border-white/[0.15] shadow-md transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translateX(${currentIndex * (36 + 4)}px)`,
              }}
            />

            {screens.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  resetZoom();
                  setCurrentIndex(idx);
                }}
                className={`relative z-10 inline-flex items-center justify-center w-9 h-9 p-0 rounded-lg font-mono text-xs leading-none transition-colors duration-200 cursor-pointer ${
                  idx === currentIndex
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={`Screen 0${idx + 1}`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
