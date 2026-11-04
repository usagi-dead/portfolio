import type { Lang } from '../../types/portfolio';

interface LanguageToggleProps {
  lang: Lang;
  onSwitch: (lang: Lang) => void;
}

export function LanguageToggle({ lang, onSwitch }: LanguageToggleProps) {
  return (
    <div
      className="relative grid grid-cols-2 p-[3px] rounded-[9px] bg-black/60 border border-white/[0.08] font-mono text-[11px] select-none shrink-0"
      title="Switch language / Переключить язык"
    >
      <div
        className={`pointer-events-none absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-[6px] bg-white/[0.13] border border-white/[0.12] shadow-sm transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          lang === 'ru' ? 'translate-x-full' : 'translate-x-0'
        }`}
      />
      <button
        type="button"
        onClick={() => onSwitch('en')}
        className={`relative z-10 w-7 sm:w-8 h-5 sm:h-6 flex items-center justify-center rounded-[6px] transition-colors duration-200 cursor-pointer ${
          lang === 'en' ? 'text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onSwitch('ru')}
        className={`relative z-10 w-7 sm:w-8 h-5 sm:h-6 flex items-center justify-center rounded-[6px] transition-colors duration-200 cursor-pointer ${
          lang === 'ru' ? 'text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        RU
      </button>
    </div>
  );
}
