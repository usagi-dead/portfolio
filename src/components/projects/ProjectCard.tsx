import { Fragment, useState } from 'react';
import type { Lang, ProjectItem } from '../../types/portfolio';
import { AnimatedLink } from '../ui/AnimatedLink';
import { SpotlightCard } from '../ui/SpotlightCard';
import { MobileTrioShowcase } from './MobileTrioShowcase';
import { ProjectImage } from './ProjectImage';

interface ProjectCardProps {
  project: ProjectItem;
  lang: Lang;
  onOpenLightbox?: (project: ProjectItem, screenIndex: number) => void;
}

export function ProjectCard({ project, lang, onOpenLightbox }: ProjectCardProps) {
  const [currentScreenIdx, setCurrentScreenIdx] = useState(0);

  const screens = project.screens || [{ src: project.image, title: project.subtitle }];
  const currentScreen = screens[currentScreenIdx] || screens[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentScreenIdx((prev) => (prev > 0 ? prev - 1 : screens.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentScreenIdx((prev) => (prev < screens.length - 1 ? prev + 1 : 0));
  };

  const handleSelectScreen = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentScreenIdx(idx);
  };

  return (
    <SpotlightCard as="article" accentRgb={project.accentRgb}>
      <div className="frame-inner p-4 sm:p-7 space-y-4 sm:space-y-5">
        <div
          className="pointer-events-none absolute inset-x-24 top-0 h-[1px] z-10"
          style={{
            background: `linear-gradient(to right, transparent, rgba(${project.accentRgb || '255, 255, 255'}, 0.35), transparent)`,
          }}
        />

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4 border-b border-white/[0.06] pb-3.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="order-1 text-lg sm:text-[21px] font-bold tracking-tight text-white">
                {project.title}
              </h2>
              <span className="order-2 sm:order-3 text-xs sm:text-[13px] text-zinc-500 shrink-0">
                {project.date[lang]}
              </span>
              <span className="order-3 sm:order-2 basis-full sm:basis-auto text-xs sm:text-[13px] text-zinc-400">
                {project.subtitle[lang]}
              </span>
            </div>

            <div className="flex items-center gap-5 text-xs sm:text-[13px] font-normal text-zinc-300 shrink-0">
              {project.links.map((link) => (
                <AnimatedLink key={link.label} href={link.url} label={link.label} />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono text-zinc-500">
            {project.stack.map((tech, i) => (
              <Fragment key={tech}>
                <span className="text-zinc-400 hover:text-zinc-200 transition-colors">
                  {tech}
                </span>
                {i < project.stack.length - 1 && <span className="text-zinc-700">·</span>}
              </Fragment>
            ))}
          </div>
        </div>

        {project.layout === 'mobile-trio' ? (
          <MobileTrioShowcase
            screens={project.screens || []}
            projectTitle={project.title}
            lang={lang}
            onOpenLightbox={(idx) => onOpenLightbox?.(project, idx)}
            accentColor={project.accentColor}
            accentRgb={project.accentRgb}
          />
        ) : (
          <ProjectImage
            src={currentScreen.src}
            alt={project.title}
            lang={lang}
            screens={project.screens}
            currentScreenIdx={currentScreenIdx}
            onPrevScreen={handlePrev}
            onNextScreen={handleNext}
            onSelectScreen={handleSelectScreen}
            onClick={() => onOpenLightbox?.(project, currentScreenIdx)}
            accentColor={project.accentColor}
            accentRgb={project.accentRgb}
          />
        )}
      </div>
    </SpotlightCard>
  );
}
