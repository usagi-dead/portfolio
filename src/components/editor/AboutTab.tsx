import type { Lang } from '../../types/portfolio';
import { CodeLine } from './CodePrimitives';

interface AboutTabProps {
  lang: Lang;
  isActive: boolean;
}

export function AboutTab({ lang }: AboutTabProps) {
  return (
    <div>
      <CodeLine n={1}>
        <span className="code-glow-amber font-semibold">
          {lang === 'en'
            ? '# Alexander Luchinovich — Frontend Developer'
            : '# Александр Лучинович — Frontend-разработчик'}
        </span>
      </CodeLine>
      <CodeLine n={2}>{''}</CodeLine>
      <CodeLine n={3}>
        <span className="text-zinc-300">
          {lang === 'en'
            ? 'Frontend Developer with commercial experience in '
            : 'Frontend-разработчик с коммерческим опытом на '}
        </span>
        <span className="code-glow-blue">React</span>
      </CodeLine>
      <CodeLine n={4}>
        <span className="text-zinc-300">
          {lang === 'en' ? 'and a primary focus on the ' : 'и основным фокусом на экосистеме '}
        </span>
        <span className="code-glow-green">Angular</span>
        <span className="text-zinc-300">{lang === 'en' ? ' ecosystem.' : '.'}</span>
      </CodeLine>
      <CodeLine n={5}>
        <span className="text-zinc-400">
          {lang === 'en'
            ? 'I handle the client side from Figma UI/UX to production release.'
            : 'Веду клиентскую часть от идеи и макетов в Figma до релиза.'}
        </span>
      </CodeLine>
      <CodeLine n={6}>{''}</CodeLine>
      <CodeLine n={7}>
        <span className="text-[#c084fc] font-semibold">
          {lang === 'en' ? '## Commercial Experience' : '## Опыт работы'}
        </span>
      </CodeLine>
      <CodeLine n={8}>
        <span className="text-zinc-500">- </span>
        <span className="code-glow-green">
          {lang === 'en' ? 'June 2026 – Present' : 'Июнь 2026 – Н.в.'}
        </span>
        <span className="text-zinc-200">
          {lang === 'en' ? ' | Project Work' : ' | Проектная работа'}
        </span>
      </CodeLine>
      <CodeLine n={9} indent={1}>
        <span className="text-zinc-400">
          {lang === 'en'
            ? 'Car Auction Platform (B2B/B2C) · Angular, Signals'
            : 'Онлайн-аукцион авто (B2B/B2C) · Angular, Signals'}
        </span>
      </CodeLine>
      <CodeLine n={10}>
        <span className="text-zinc-500">- </span>
        <span className="code-glow-green">
          {lang === 'en' ? 'Aug 2024 – Sep 2025' : 'Авг 2024 – Сен 2025'}
        </span>
        <span className="text-zinc-200"> | HOUSE Group LLC</span>
      </CodeLine>
      <CodeLine n={11} indent={1}>
        <span className="text-zinc-400">
          {lang === 'en'
            ? 'Web apps & TMA in an outsourcing team'
            : 'Веб-приложения и TMA в команде аутсорса'}
        </span>
      </CodeLine>
      <CodeLine n={12}>{''}</CodeLine>
      <CodeLine n={13}>
        <span className="text-[#c084fc] font-semibold">
          {lang === 'en' ? '## Education & Achievements' : '## Образование и достижения'}
        </span>
      </CodeLine>
      <CodeLine n={14}>
        <span className="text-zinc-500">- </span>
        <span className="code-glow-amber">
          {lang === 'en' ? '2nd Place' : '2-е место'}
        </span>
        <span className="text-zinc-300">
          {lang === 'en'
            ? ' — Republican ProfSkills ("Web Dev")'
            : ' — Республиканский конкурс ProfSkills'}
        </span>
      </CodeLine>
      <CodeLine n={15}>
        <span className="text-zinc-500">- </span>
        <span className="text-zinc-200">
          {lang === 'en' ? 'T-Education (T-Bank): ' : 'Т-Образование (Т-Банк): '}
        </span>
        <span className="text-zinc-400">
          {lang === 'en' ? 'Angular Intensive (2025)' : 'Интенсив по Angular (2025)'}
        </span>
      </CodeLine>
      <CodeLine n={16}>
        <span className="text-zinc-500">- </span>
        <span className="text-zinc-200">
          {lang === 'en' ? 'MCB: ' : 'МКП: '}
        </span>
        <span className="text-zinc-400">
          {lang === 'en' ? 'Software Technician (2021 – 2025)' : 'Техник-программист (2021 – 2025)'}
        </span>
      </CodeLine>
      <CodeLine n={17}>
        <span className="text-zinc-500">&gt; </span>
        <span className="code-glow-green italic">
          {lang === 'en'
            ? 'Status: Open to Angular / React opportunities'
            : 'Статус: Открыт к предложениям (Angular / React)'}
        </span>
      </CodeLine>
    </div>
  );
}
