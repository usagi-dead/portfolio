import { useEffect, useState } from 'react';
import { CodeEditorHero } from './components/editor/CodeEditorHero';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { GlobalCursorGlow } from './components/ui/GlobalCursorGlow';
import { Lightbox } from './components/ui/Lightbox';
import { ScrollReveal } from './components/ui/ScrollReveal';
import { TerminalBoot } from './components/ui/TerminalBoot';
import { Toast } from './components/ui/Toast';
import { useScrollScrolled } from './hooks/useScrollScrolled';
import type { Lang, ProjectItem } from './types/portfolio';

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('portfolio_lang');
      if (savedLang === 'ru' || savedLang === 'en') {
        return savedLang;
      }
    }
    return 'en';
  });
  const [isLangSwitching, setIsLangSwitching] = useState(false);
  const isScrolled = useScrollScrolled(12);

  // Sync html lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // --- Linux / CachyOS Terminal Boot Preloader State ---
  const [isBooting, setIsBooting] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('portfolio_booted') !== 'true';
    }
    return false;
  });

  // Controls entrance visibility
  const [isContentVisible, setIsContentVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('portfolio_booted') === 'true';
    }
    return true;
  });

  const handleStartExit = () => {
    setIsContentVisible(true);
  };

  const handleBootComplete = () => {
    sessionStorage.setItem('portfolio_booted', 'true');
    setIsBooting(false);
    setIsContentVisible(true);
  };

  const handleRebootTerminal = () => {
    sessionStorage.removeItem('portfolio_booted');
    setIsContentVisible(false);
    setIsBooting(true);
  };

  // --- Toast State ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Lightbox State ---
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    project?: ProjectItem;
    screenIndex: number;
  }>({
    isOpen: false,
    screenIndex: 0,
  });

  // Smooth language switch without document jitter
  const handleSwitchLang = (nextLang: Lang) => {
    if (nextLang === lang || isLangSwitching) return;
    setIsLangSwitching(true);
    setTimeout(() => {
      setLang(nextLang);
      try {
        localStorage.setItem('portfolio_lang', nextLang);
      } catch {
        // Safe fallback if local storage is disabled
      }
      setTimeout(() => {
        setIsLangSwitching(false);
      }, 40);
    }, 120);
  };

  const handleOpenLightbox = (project: ProjectItem, screenIndex: number) => {
    setLightboxState({
      isOpen: true,
      project,
      screenIndex,
    });
  };

  const handleCloseLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  const lightboxScreens =
    lightboxState.project?.screens?.map((s) => ({
      src: s.src,
      title: s.title?.[lang] || lightboxState.project?.title,
      caption: s.caption?.[lang] || lightboxState.project?.subtitle[lang],
    })) ||
    (lightboxState.project
      ? [
          {
            src: lightboxState.project.image,
            title: lightboxState.project.title,
            caption: lightboxState.project.subtitle[lang],
          },
        ]
      : []);

  return (
    <div
      className={`min-h-screen relative selection:bg-white/15 selection:text-white ${
        isBooting ? 'overflow-hidden max-h-screen' : ''
      }`}
    >
      {/* --- CachyOS / Linux Terminal Boot Intro Animation --- */}
      {isBooting && (
        <TerminalBoot onComplete={handleBootComplete} onStartExit={handleStartExit} />
      )}

      <GlobalCursorGlow />

      {/* --- Ambient Backdrop --- */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-20">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-190 h-85 rounded-full bg-white/4 blur-[130px]" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-220 h-120 rounded-full bg-white/[0.018] blur-[160px]" />
      </div>

      {/* --- Top Screen Shadow Curtain (Smoothly dissolves scrolling content under sticky header) --- */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 inset-x-0 h-28 sm:h-36 md:h-40 z-30 top-shadow-curtain transition-opacity duration-500 ease-out ${
          isContentVisible
            ? isScrolled
              ? 'opacity-100'
              : 'opacity-70'
            : 'opacity-0'
        }`}
      />

      {/* --- Main Layout: Header has native position: sticky --- */}
      <div className="max-w-195 w-full mx-auto px-3.5 sm:px-6 pt-5 sm:pt-7 pb-16 sm:pb-20 space-y-10 sm:space-y-16">
        <Header
          lang={lang}
          isLangSwitching={isLangSwitching}
          onSwitchLang={handleSwitchLang}
          isContentVisible={isContentVisible}
        />

        <main
          className={`relative z-[1] space-y-10 sm:space-y-16 transition-opacity duration-150 ease-out ${
            isLangSwitching ? 'opacity-40' : 'opacity-100'
          }`}
        >
          {/* Code Editor Hero: glides up on initial entrance */}
          <div
            className={`transition-opacity duration-700 ease-out sm:transition-[opacity,transform] sm:duration-750 sm:ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isContentVisible
                ? 'opacity-100 sm:translate-y-0 delay-80'
                : 'opacity-0 sm:translate-y-6 pointer-events-none'
            }`}
          >
            <CodeEditorHero lang={lang} onRebootTerminal={handleRebootTerminal} />
          </div>

          {/* Projects Section: smoothly reveals on initial reveal */}
          <div
            className={`transition-opacity duration-700 ease-out ${
              isContentVisible
                ? 'opacity-100 delay-160'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ProjectsSection lang={lang} onOpenLightbox={handleOpenLightbox} />
          </div>

          {/* Footer with clean scroll reveal */}
          <ScrollReveal>
            <Footer lang={lang} onShowToast={(msg) => setToastMessage(msg)} />
          </ScrollReveal>
        </main>
      </div>

      {/* --- Global Lightbox Modal --- */}
      <Lightbox
        isOpen={lightboxState.isOpen}
        onClose={handleCloseLightbox}
        projectTitle={lightboxState.project?.title || ''}
        screens={lightboxScreens}
        initialIndex={lightboxState.screenIndex}
        lang={lang}
      />

      {/* --- Toast Notification Badge --- */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
