import { PROFILE_META, SOCIAL_LINKS } from '../../data/profile';
import { useScrollScrolled } from '../../hooks/useScrollScrolled';
import type { Lang } from '../../types/portfolio';
import { AnimatedLink } from '../ui/AnimatedLink';
import { LanguageToggle } from '../ui/LanguageToggle';

interface HeaderProps {
  lang: Lang;
  isLangSwitching: boolean;
  onSwitchLang: (lang: Lang) => void;
  isContentVisible?: boolean;
}

export function Header({
  lang,
  isLangSwitching,
  onSwitchLang,
  isContentVisible = true,
}: HeaderProps) {
  const isScrolled = useScrollScrolled(16);
  const resumeUrl =
    lang === 'ru'
      ? '/Alexander_Luchinovich_CV_RU.pdf'
      : '/Alexander_Luchinovich_CV_EN.pdf';

  return (
    <header
      className={`sticky top-3 sm:top-4 z-40 max-w-[780px] w-full mx-auto transition-opacity duration-500 ease-out ${
        isContentVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`header-outer ${
          isScrolled
            ? 'bg-[#08080a]/85 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] border-white/[0.1]'
            : 'bg-white/[0.015] shadow-[0_18px_45px_rgba(0,0,0,0.8)]'
        }`}
      >
        <nav className="header-inner px-3.5 sm:px-5 md:px-6 py-2.5 md:py-0 md:min-h-[54px] flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
          <div className="pointer-events-none absolute inset-x-20 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Top/Left Block: Developer Name and Mobile Controls */}
          <div className="flex items-center justify-between min-w-0 gap-3">
            <a
              href="#"
              className="flex items-center gap-2 text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.06em] sm:tracking-[0.08em] uppercase text-zinc-100 hover:text-white transition-colors whitespace-nowrap shrink-0 md:min-w-[225px]"
            >
              <span className="inline-block w-[2px] h-3.5 bg-zinc-100 animate-pulse shrink-0" />
              <span
                className={`inline-block whitespace-nowrap transition-opacity duration-150 ease-out ${
                  isLangSwitching ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {PROFILE_META[lang].headerName}
              </span>
            </a>

            {/* Mobile Controls (< md): ONLY Language Switcher in top row */}
            <div
              className={`flex items-center md:hidden shrink-0 transition-opacity duration-150 ease-out ${
                isLangSwitching ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <LanguageToggle lang={lang} onSwitch={onSwitchLang} />
            </div>
          </div>

          {/* Mobile Bottom Row (< md): All Social Links + Resume in ONE unified row */}
          <div
            className={`flex items-center justify-between md:hidden w-full text-[11px] sm:text-xs font-normal text-zinc-300 border-t border-white/[0.05] pt-2 transition-opacity duration-150 ease-out ${
              isLangSwitching ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              {SOCIAL_LINKS.map((link) => (
                <AnimatedLink key={link.label} href={link.url} label={link.label} />
              ))}
              <AnimatedLink
                href={resumeUrl}
                label={lang === 'ru' ? 'Резюме' : 'Resume'}
                external
                title={lang === 'ru' ? 'Открыть резюме (RU)' : 'Open resume (EN)'}
              />
            </div>
          </div>

          {/* Desktop Navigation Block (>= md): All Links + Resume + Language Switcher in ONE unified block */}
          <div
            className={`hidden md:flex items-center gap-4 sm:gap-5.5 text-xs sm:text-[13px] font-normal text-zinc-300 shrink-0 transition-opacity duration-150 ease-out ${
              isLangSwitching ? 'opacity-40' : 'opacity-100'
            }`}
          >
            {SOCIAL_LINKS.map((link) => (
              <AnimatedLink key={link.label} href={link.url} label={link.label} />
            ))}
            <AnimatedLink
              href={resumeUrl}
              label={lang === 'ru' ? 'Резюме' : 'Resume'}
              external
              title={lang === 'ru' ? 'Открыть резюме (RU)' : 'Open resume (EN)'}
            />
            <LanguageToggle lang={lang} onSwitch={onSwitchLang} />
          </div>
        </nav>
      </div>
    </header>
  );
}
