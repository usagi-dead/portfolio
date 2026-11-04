import { PROJECTS } from '../../data/projects';
import type { Lang, ProjectItem } from '../../types/portfolio';
import { ScrollReveal } from '../ui/ScrollReveal';
import { ProjectCard } from './ProjectCard';

interface ProjectsSectionProps {
  lang: Lang;
  onOpenLightbox: (project: ProjectItem, screenIndex: number) => void;
}

export function ProjectsSection({ lang, onOpenLightbox }: ProjectsSectionProps) {
  return (
    <section className="space-y-10 sm:space-y-16">
      {PROJECTS.map((project, index) => (
        <ScrollReveal key={project.id} delay={index === 0 ? 0 : 50}>
          <ProjectCard
            project={project}
            lang={lang}
            onOpenLightbox={onOpenLightbox}
          />
        </ScrollReveal>
      ))}
    </section>
  );
}
