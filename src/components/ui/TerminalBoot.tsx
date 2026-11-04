import { useCallback, useEffect, useRef, useState } from 'react';

interface TerminalBootProps {
  onComplete: () => void;
  onStartExit?: () => void;
}

export function TerminalBoot({ onComplete, onStartExit }: TerminalBootProps) {
  const [typedCmd, setTypedCmd] = useState('');
  const [logsStep, setLogsStep] = useState(0); // 0: typing, 1: log1, 2: log2, 3: log3, 4: log4
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleSkip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    onStartExit?.();
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 180);
  }, [onComplete, onStartExit]);

  // Keyboard shortcut listener (ESC or Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Extended boot sequence (~2.2s - 2.4s total)
  useEffect(() => {
    const fullCmd = 'vite --host --mode=production';
    let charIdx = 0;

    // Smooth progress bar animation over ~1.6s
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(100, prev + 2.5);
      });
    }, 38);
    timersRef.current.push(progressInterval as unknown as ReturnType<typeof setTimeout>);

    // Step 1: Type command (0 - 480ms)
    const typeInterval = setInterval(() => {
      charIdx += 1;
      setTypedCmd(fullCmd.slice(0, charIdx));
      if (charIdx >= fullCmd.length) {
        clearInterval(typeInterval);

        // Step 2: Cascade logs comfortably spaced (~300ms intervals)
        // Log 1 (~620ms)
        const t1 = setTimeout(() => {
          setLogsStep(1);

          // Log 2 (~940ms)
          const t2 = setTimeout(() => {
            setLogsStep(2);

            // Log 3 (~1260ms)
            const t3 = setTimeout(() => {
              setLogsStep(3);

              // Log 4: Ready (~1580ms)
              const t4 = setTimeout(() => {
                setLogsStep(4);
                setProgress(100);

                // Step 3: Trigger site entrance and start terminal exit (~1880ms)
                const t5 = setTimeout(() => {
                  onStartExit?.();
                  setIsExiting(true);

                  // Complete & unmount (~2280ms)
                  const t6 = setTimeout(() => {
                    onComplete();
                  }, 400);
                  timersRef.current.push(t6);
                }, 300);
                timersRef.current.push(t5);
              }, 320);
              timersRef.current.push(t4);
            }, 320);
            timersRef.current.push(t3);
          }, 320);
          timersRef.current.push(t2);
        }, 140);
        timersRef.current.push(t1);
      }
    }, 16);
    timersRef.current.push(typeInterval as unknown as ReturnType<typeof setTimeout>);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [onComplete, onStartExit]);

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100] bg-[#070708] flex flex-col items-center justify-center p-4 cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.03] blur-md pointer-events-none'
          : 'opacity-100 scale-100 blur-0'
      }`}
    >
      {/* Terminal Window Frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="frame-outer max-w-[560px] w-full shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
      >
        <div className="frame-inner p-4 sm:p-6 font-mono text-xs sm:text-[13px] leading-relaxed">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e06c75]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e5c07b]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#98c379]" />
              <span className="ml-2 text-[11px] text-zinc-500 hidden xs:inline">
                usagi@cachyos: ~/portfolio
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-600 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
              CachyOS Linux (x86_64)
            </div>
          </div>

          {/* Prompt line */}
          <div className="text-zinc-300 flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="text-[#4ade80] font-semibold">usagi@cachyos</span>
            <span className="text-zinc-500">~/portfolio</span>
            <span className="text-[#60a5fa] font-bold">❯</span>
            <span className="text-white font-medium">{typedCmd}</span>
            {logsStep === 0 && (
              <span className="inline-block w-1.5 h-3.5 bg-zinc-300 ml-0.5 animate-pulse" />
            )}
          </div>

          {/* Staggered Boot Logs */}
          <div className="mt-3.5 space-y-2 min-h-[104px]">
            {logsStep >= 1 && (
              <div className="animate-in fade-in duration-200 flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-600 font-mono">[</span>
                <span className="text-[#4ade80] font-bold">  OK  </span>
                <span className="text-zinc-600 font-mono">]</span>
                <span>Initializing Wayland session (niri 120Hz)...</span>
              </div>
            )}

            {logsStep >= 2 && (
              <div className="animate-in fade-in duration-200 flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-600 font-mono">[</span>
                <span className="text-[#4ade80] font-bold">  OK  </span>
                <span className="text-zinc-600 font-mono">]</span>
                <span>Compiling alexander.profile.ts (strict mode)...</span>
              </div>
            )}

            {logsStep >= 3 && (
              <div className="animate-in fade-in duration-200 flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-600 font-mono">[</span>
                <span className="text-[#4ade80] font-bold">  OK  </span>
                <span className="text-zinc-600 font-mono">]</span>
                <span>Hydrating UI components & Figma assets...</span>
              </div>
            )}

            {logsStep >= 4 && (
              <div className="animate-in fade-in duration-200 flex items-center gap-2 text-[#38bdf8] font-medium pt-0.5">
                <span className="font-bold">→</span>
                <span>Ready in 42ms. Launching interface...</span>
              </div>
            )}
          </div>

          {/* Minimalist Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <div className="h-[2px] w-full bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-[#4ade80] to-cyan-400 shadow-[0_0_8px_rgba(74,222,128,0.5)] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skip Hint */}
      <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.06] backdrop-blur-sm">
        <span>Click anywhere or press</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300 text-[10px]">ESC</kbd>
        <span>to skip</span>
      </div>
    </div>
  );
}
