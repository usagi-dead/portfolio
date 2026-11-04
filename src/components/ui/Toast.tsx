import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 2800 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-3"
    >
      <div className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#0c0c10]/95 border border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-xl text-xs sm:text-[13px] text-zinc-100 font-sans font-medium tracking-wide">
        <span className="text-emerald-400 font-bold text-sm">✓</span>
        <span>Email copied to clipboard</span>
        <span className="text-zinc-500 font-mono text-[11px] hidden sm:inline ml-1">
          (luchinovich2006@gmail.com)
        </span>
      </div>
    </div>
  );
}
