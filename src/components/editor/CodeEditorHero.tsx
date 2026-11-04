import { Check, Copy, Play, RotateCcw, Square, Terminal, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getRawProfileCode } from '../../data/profile';
import type { EditorTab, Lang } from '../../types/portfolio';
import { SpotlightCard } from '../ui/SpotlightCard';
import { AboutTab } from './AboutTab';
import { ProfileTab } from './ProfileTab';

interface CodeEditorHeroProps {
  lang: Lang;
  onRebootTerminal?: () => void;
}

export function CodeEditorHero({ lang, onRebootTerminal }: CodeEditorHeroProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('profile');
  const [copied, setCopied] = useState(false);

  // --- Dynamic Animated Height State ---
  const profileContentRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  // --- Console Terminal State ---
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleStage, setConsoleStage] = useState(0); // 0: initial, 1: typing, 2: compiling/pausing, 3: completed
  const [typedCommand, setTypedCommand] = useState('');
  const [consoleExecutedTab, setConsoleExecutedTab] = useState<EditorTab>('profile');
  const runTimeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const profileTabRef = useRef<HTMLButtonElement>(null);
  const aboutTabRef = useRef<HTMLButtonElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 4, width: 150 });

  // Update sliding pill in editor header
  useEffect(() => {
    const updatePill = () => {
      const currentEl = activeTab === 'profile' ? profileTabRef.current : aboutTabRef.current;
      if (currentEl) {
        setPillStyle({
          left: currentEl.offsetLeft,
          width: currentEl.offsetWidth,
        });
      }
    };

    updatePill();
    window.addEventListener('resize', updatePill);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && profileTabRef.current) {
      ro = new ResizeObserver(() => {
        updatePill();
      });
      ro.observe(profileTabRef.current);
      if (aboutTabRef.current) {
        ro.observe(aboutTabRef.current);
      }
    }

    return () => {
      window.removeEventListener('resize', updatePill);
      ro?.disconnect();
    };
  }, [activeTab, lang]);

  // Measure and animate height of the active tab only
  useEffect(() => {
    const activeEl = activeTab === 'profile' ? profileContentRef.current : aboutContentRef.current;
    if (!activeEl) return;

    const updateHeight = () => {
      if (activeEl) {
        setContainerHeight(activeEl.offsetHeight);
      }
    };

    updateHeight();

    const ro = new ResizeObserver(updateHeight);
    ro.observe(activeEl);
    return () => ro.disconnect();
  }, [activeTab, lang]);

  const copyCurrentFile = () => {
    navigator.clipboard.writeText(getRawProfileCode(lang));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const clearRunTimeouts = () => {
    runTimeoutRef.current.forEach(clearTimeout);
    runTimeoutRef.current = [];
  };

  useEffect(() => {
    return () => clearRunTimeouts();
  }, []);

  const stopExecution = useCallback(() => {
    clearRunTimeouts();
    setIsRunning(false);
    setConsoleStage(4);
  }, []);

  // When switching tabs, preserve the open terminal and its output
  const handleTabSwitch = (nextTab: EditorTab) => {
    if (nextTab === activeTab) return;
    setActiveTab(nextTab);
  };

  const runExecution = useCallback((tabToRun: EditorTab) => {
    clearRunTimeouts();
    setConsoleExecutedTab(tabToRun);
    setIsConsoleOpen(true);
    setIsRunning(true);
    setConsoleStage(1);
    setTypedCommand('');

    const targetCmd =
      tabToRun === 'profile'
        ? '> tsc alexander.profile.ts --strict'
        : '> md-parse about.md --verify-experience';

    let charIdx = 0;
    const typeInterval = setInterval(() => {
      charIdx += 1;
      setTypedCommand(targetCmd.slice(0, charIdx));

      if (charIdx >= targetCmd.length) {
        clearInterval(typeInterval);

        // Step 2: Compiling / Parsing pause (~200ms)
        const t1 = setTimeout(() => {
          setConsoleStage(2);

          // Step 3: Show result and stay active in watch mode (like WebStorm)
          const t2 = setTimeout(() => {
            setConsoleStage(3);
            setIsRunning(true);
          }, 240);
          runTimeoutRef.current.push(t2);
        }, 100);
        runTimeoutRef.current.push(t1);
      }
    }, 11);

    runTimeoutRef.current.push(typeInterval);
  }, []);

  const handleToggleRun = () => {
    if (isRunning) {
      stopExecution();
    } else {
      runExecution(activeTab);
    }
  };

  return (
    <section>
      <SpotlightCard className="w-full">
        <div className="frame-inner">
          <div className="pointer-events-none absolute inset-x-24 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent z-10" />

          {/* --- Editor Window Bar: Responsive flex on mobile (< 640px) / 3-column grid on desktop --- */}
          <div className="relative flex items-center justify-between gap-1.5 px-3 py-2.5 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-2 sm:px-5 sm:py-3.5 border-b border-white/[0.06] bg-white/[0.01] z-10">
            {/* Col 1: Window control dots */}
            <div
              onClick={onRebootTerminal}
              className="justify-self-start shrink-0 flex items-center gap-1.5 sm:gap-2 cursor-pointer group/dots py-1"
              title="Reboot terminal"
            >
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#e06c75]/90 inline-block shadow-[0_0_8px_rgba(224,108,117,0.4)] group-hover/dots:scale-120 transition-transform" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#e5c07b]/90 inline-block shadow-[0_0_8px_rgba(229,192,123,0.3)] group-hover/dots:scale-120 transition-transform" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#98c379]/90 inline-block shadow-[0_0_8px_rgba(152,195,121,0.3)] group-hover/dots:scale-120 transition-transform" />
            </div>

            {/* Col 2: Center tabs pill */}
            <div className="justify-self-center shrink-0 relative inline-flex items-center p-0.5 sm:p-1 rounded-xl bg-black/45 border border-white/[0.07] text-[11px] sm:text-xs font-mono">
              <div
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                }}
                className="pointer-events-none absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 rounded-lg bg-white/[0.11] border border-white/[0.1] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
              <button
                ref={profileTabRef}
                type="button"
                onClick={() => handleTabSwitch('profile')}
                className={`relative z-10 px-2 sm:px-3.5 py-1 rounded-lg whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                  activeTab === 'profile' ? 'text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className="hidden sm:inline">alexander.</span>profile.ts
              </button>
              <button
                ref={aboutTabRef}
                type="button"
                onClick={() => handleTabSwitch('about')}
                className={`relative z-10 px-2 sm:px-3.5 py-1 rounded-lg whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                  activeTab === 'about' ? 'text-white font-medium' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                about.md
              </button>
            </div>

            {/* Col 3: Actions (Compact icon buttons on mobile, full text on desktop) */}
            <div className="justify-self-end shrink-0 flex items-center justify-end gap-1.5 sm:gap-2">
              {/* WebStorm-style Run / Stop button */}
              <button
                type="button"
                onClick={handleToggleRun}
                className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-mono w-7 h-7 p-0 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-md transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isRunning
                    ? 'text-[#e06c75] bg-[#e06c75]/12 border border-[#e06c75]/35 shadow-[0_0_12px_rgba(224,108,117,0.22)] hover:bg-[#e06c75]/20'
                    : 'text-emerald-400 bg-white/[0.06] border border-white/10 hover:bg-white/[0.09] hover:border-white/15'
                }`}
                title={
                  isRunning
                    ? (lang === 'ru' ? 'Остановить процесс (Stop)' : 'Stop process')
                    : (lang === 'ru' ? 'Запустить компиляцию / проверку (Run)' : 'Run execution in terminal')
                }
              >
                {isRunning ? (
                  <>
                    <Square className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#e06c75] fill-[#e06c75] shrink-0" />
                    <span className="hidden sm:inline-block">
                      {lang === 'ru' ? 'остановить' : 'stop'}
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 fill-emerald-400 shrink-0" />
                    <span className="hidden sm:inline-block">
                      {lang === 'ru' ? 'запустить' : 'run'}
                    </span>
                  </>
                )}
              </button>

              {/* Copy button: square icon button on mobile, fixed width on desktop */}
              <button
                type="button"
                onClick={copyCurrentFile}
                className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-mono w-7 h-7 p-0 sm:h-auto sm:py-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.05] border border-transparent transition-[width,background-color,border-color,color] duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  lang === 'ru' ? 'sm:w-[108px]' : 'sm:w-[72px]'
                }`}
                title={lang === 'en' ? 'Copy code' : 'Скопировать код'}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 hidden sm:inline-block transition-opacity duration-200">
                      {lang === 'ru' ? 'скопировано' : 'copied'}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline-block transition-opacity duration-200">
                      {lang === 'ru' ? 'копировать' : 'copy'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* --- Editor Viewport with Adaptive Dynamic Height --- */}
          <div className="relative px-3.5 sm:px-8 pt-5 sm:pt-6 pb-8 sm:pb-10 font-mono text-[12px] sm:text-[14px] leading-[1.68]">
            <div
              style={{ height: containerHeight ? `${containerHeight}px` : 'auto' }}
              className="relative transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden"
            >
              {/* Profile Tab Content */}
              <div
                ref={profileContentRef}
                className={`transition-all duration-300 ease-out ${
                  activeTab === 'profile'
                    ? 'relative opacity-100 translate-y-0 blur-0 pointer-events-auto'
                    : 'absolute inset-x-0 top-0 opacity-0 -translate-y-1.5 blur-[3px] pointer-events-none'
                }`}
              >
                <ProfileTab lang={lang} isActive={activeTab === 'profile'} />
              </div>

              {/* About Tab Content */}
              <div
                ref={aboutContentRef}
                className={`transition-all duration-300 ease-out ${
                  activeTab === 'about'
                    ? 'relative opacity-100 translate-y-0 blur-0 pointer-events-auto'
                    : 'absolute inset-x-0 top-0 opacity-0 -translate-y-1.5 blur-[3px] pointer-events-none'
                }`}
              >
                <AboutTab lang={lang} isActive={activeTab === 'about'} />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0b0b0d] to-transparent z-10" />
          </div>

          {/* --- Interactive Terminal Console Dock --- */}
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out border-t bg-[#07070a]/96 backdrop-blur-xl ${
              isConsoleOpen
                ? 'grid-rows-[1fr] opacity-100 border-white/[0.08]'
                : 'grid-rows-[0fr] opacity-0 border-transparent pointer-events-none'
            }`}
          >
            <div className="overflow-hidden">
              {/* Terminal Header Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 sm:px-5 sm:py-2 bg-white/[0.02] border-b border-white/[0.04] text-[10px] sm:text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 shrink-0" />
                  <span className="text-zinc-300 font-medium">
                    {lang === 'ru' ? 'терминал' : 'terminal'}
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500">
                    {consoleExecutedTab === 'profile' ? 'tsc v5.7' : 'markdown-cli'}
                  </span>
                  {isRunning ? (
                    <span className="inline-flex items-center gap-1.5 ml-1.5 sm:ml-2 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {consoleExecutedTab === 'profile'
                        ? (lang === 'ru' ? 'активен (watch)' : 'active (watch)')
                        : (lang === 'ru' ? 'активен' : 'active')}
                    </span>
                  ) : consoleStage === 4 ? (
                    <span className="inline-flex items-center gap-1.5 ml-1.5 sm:ml-2 text-zinc-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      {lang === 'ru' ? 'остановлен' : 'stopped'}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => runExecution(activeTab)}
                    className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    title={lang === 'ru' ? 'Перезапустить' : 'Re-run'}
                  >
                    <RotateCcw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${consoleStage === 1 || consoleStage === 2 ? 'animate-spin' : ''}`} />
                    <span>{lang === 'ru' ? 'перезапуск' : 'rerun'}</span>
                  </button>
                  <span className="text-zinc-700">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      stopExecution();
                      setIsConsoleOpen(false);
                    }}
                    className="hover:text-white transition-colors cursor-pointer p-0.5"
                    title={lang === 'ru' ? 'Закрыть терминал' : 'Close terminal'}
                  >
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="px-3 py-2.5 sm:px-6 sm:py-4 font-mono text-[11px] sm:text-[12px] leading-relaxed space-y-1">
                {/* Line 1: Command */}
                <div className="text-zinc-300 flex items-center min-h-[1.4em]">
                  <span>{typedCommand}</span>
                  {consoleStage === 1 && (
                    <span className="inline-block w-1 sm:w-1.5 h-2.5 sm:h-3 bg-zinc-300 ml-1 animate-pulse" />
                  )}
                </div>

                {/* Step 2: Compiling pause spinner */}
                {consoleStage === 2 && (
                  <div className="text-zinc-500 text-[10px] sm:text-[11px] flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>
                      {consoleExecutedTab === 'profile'
                        ? (lang === 'ru' ? 'проверка типов TypeScript...' : 'checking TypeScript types...')
                        : (lang === 'ru' ? 'верификация резюме и опыта...' : 'verifying resume & sections...')}
                    </span>
                  </div>
                )}

                {/* Line 2: Success line */}
                {(consoleStage === 3 || consoleStage === 4) && (
                  <div className="text-emerald-400 flex items-center gap-1.5 font-medium animate-in fade-in duration-200">
                    <span className="text-[11px] sm:text-[12px] shrink-0 font-bold">✓</span>
                    <span>
                      {consoleExecutedTab === 'profile'
                        ? (lang === 'ru'
                            ? 'Успешно скомпилировано за 42мс. 0 ошибок.'
                            : 'Compiled successfully in 42ms. 0 errors.')
                        : (lang === 'ru'
                            ? 'Проверено 3 секции: Опыт (1.5+ года), Образование, ProfSkills (2-е место).'
                            : 'Parsed 3 sections: Experience (1.5+ yrs), Education, ProfSkills (2nd place).')}
                    </span>
                  </div>
                )}

                {/* Line 3: Status / Summary line */}
                {(consoleStage === 3 || consoleStage === 4) && (
                  <div className="text-zinc-300 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <span className="text-emerald-400 font-bold text-[11px] sm:text-[12px] shrink-0">→</span>
                    {consoleExecutedTab === 'profile' ? (
                      <span>
                        {lang === 'ru' ? 'Статус: ' : 'Status: '}
                        <span className="text-white font-medium bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px]">
                          {lang === 'ru'
                            ? 'Готов к задачам на Angular / React.'
                            : 'Ready for Angular / React roles.'}
                        </span>
                      </span>
                    ) : (
                      <span>
                        {lang === 'ru' ? 'Итог: ' : 'Summary: '}
                        <span className="text-white font-medium bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px]">
                          {lang === 'ru'
                            ? 'Полный цикл UI/UX (Figma) + Frontend (Angular/React).'
                            : 'Full-cycle UI/UX (Figma) + Frontend (Angular/React).'}
                        </span>
                      </span>
                    )}
                    {isRunning && (
                      <span className="inline-block w-1 sm:w-1.5 h-2.5 sm:h-3 bg-emerald-400/80 ml-1 animate-pulse" />
                    )}
                  </div>
                )}

                {/* Line 4: Stopped status */}
                {consoleStage === 4 && (
                  <div className="text-zinc-400 flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] animate-in fade-in duration-200 pt-1">
                    <span className="text-[#e06c75] text-[11px] sm:text-[12px] shrink-0">■</span>
                    <span className="text-zinc-400">
                      {lang === 'ru'
                        ? 'Процесс остановлен пользователем (exit code 130)'
                        : 'Process finished with exit code 130 (interrupted)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </section>
  );
}
