import type React from 'react';
import type { Lang } from '../../types/portfolio';
import { AnimatedLink } from '../ui/AnimatedLink';

interface FooterProps {
  lang: Lang;
  onShowToast: (message: string) => void;
}

export function Footer({ lang, onShowToast }: FooterProps) {
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const email = 'luchinovich2006@gmail.com';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
    }
    onShowToast('✓ Email copied to clipboard');
  };

  return (
    <footer className="pt-4 sm:pt-6 pb-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 text-xs sm:text-[13px] text-zinc-300 text-center sm:text-left">
        <div className="flex items-center gap-2.5 font-medium text-zinc-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse shrink-0" />
          <span>
            {lang === 'en'
              ? "Available for frontend roles — let's talk"
              : 'Открыт к предложениям — давайте пообщаемся'}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-7 font-normal text-zinc-300">
          <AnimatedLink
            href="mailto:luchinovich2006@gmail.com"
            label="Email"
            external={false}
            onClick={handleEmailClick}
            title={lang === 'en' ? 'Copy luchinovich2006@gmail.com' : 'Скопировать luchinovich2006@gmail.com'}
          />
          <AnimatedLink href="https://t.me/usagi_dead" label="Telegram" />
          <AnimatedLink
            href={
              lang === 'ru'
                ? './Alexander_Luchinovich_CV_RU.pdf'
                : './Alexander_Luchinovich_CV_EN.pdf'
            }
            label={lang === 'ru' ? 'Резюме' : 'Resume'}
            download
          />
        </div>
      </div>
    </footer>
  );
}
