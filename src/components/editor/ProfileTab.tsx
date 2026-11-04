import { CORE_STACK, PROFILE_META, TOOLS_AND_AI } from '../../data/profile';
import type { Lang } from '../../types/portfolio';
import { CodeLine, CodeStrings } from './CodePrimitives';

interface ProfileTabProps {
  lang: Lang;
  isActive: boolean;
}

export function ProfileTab({ lang }: ProfileTabProps) {
  const meta = PROFILE_META[lang];

  return (
    <div>
      <CodeLine n={1} indent={0}>
        <span className="code-glow-amber">const</span>{' '}
        <span className="text-zinc-100">developer</span>
        <span className="text-zinc-400">:</span>{' '}
        <span className="text-[#c084fc]">FrontendProfile</span>{' '}
        <span className="text-zinc-300">=</span>{' '}
        <span className="code-glow-amber">{'{'}</span>
      </CodeLine>
      <CodeLine n={2} indent={1}>
        <span className="text-zinc-100">personal:</span>{' '}
        <span className="text-[#60a5fa]">{'{'}</span>
      </CodeLine>
      <CodeLine n={3} indent={2}>
        <span className="text-zinc-200">name:</span>{' '}
        <span className="code-glow-green italic">&quot;{meta.name}&quot;</span>,
      </CodeLine>
      <CodeLine n={4} indent={2}>
        <span className="text-zinc-200">role:</span>{' '}
        <span className="code-glow-green italic">&quot;{meta.role}&quot;</span>,
      </CodeLine>
      <CodeLine n={5} indent={2}>
        <span className="text-zinc-200">design:</span>{' '}
        <span className="code-glow-green italic">&quot;{meta.design}&quot;</span>,
      </CodeLine>
      <CodeLine n={6} indent={2}>
        <span className="text-zinc-200">location:</span>{' '}
        <span className="code-glow-green italic">&quot;{meta.location}&quot;</span>
      </CodeLine>
      <CodeLine n={7} indent={1}>
        <span className="text-[#60a5fa]">{'}'}</span>,
      </CodeLine>
      <CodeLine n={8} indent={1}>
        <span className="text-zinc-100">coreStack:</span>{' '}
        <span className="text-[#60a5fa]">[</span>
      </CodeLine>
      <CodeLine n={9} indent={2}>
        <CodeStrings items={CORE_STACK[0]} trailingComma />
      </CodeLine>
      <CodeLine n={10} indent={2}>
        <CodeStrings items={CORE_STACK[1]} trailingComma />
      </CodeLine>
      <CodeLine n={11} indent={2}>
        <CodeStrings items={CORE_STACK[2]} />
      </CodeLine>
      <CodeLine n={12} indent={1}>
        <span className="text-[#60a5fa]">]</span>,
      </CodeLine>
      <CodeLine n={13} indent={1}>
        <span className="text-zinc-100">toolsAndAI:</span>{' '}
        <span className="text-[#60a5fa]">[</span>
      </CodeLine>
      <CodeLine n={14} indent={2}>
        <CodeStrings items={TOOLS_AND_AI[0]} trailingComma />
      </CodeLine>
      <CodeLine n={15} indent={2}>
        <CodeStrings items={TOOLS_AND_AI[1]} />
      </CodeLine>
      <CodeLine n={16} indent={1}>
        <span className="text-[#60a5fa]">]</span>
      </CodeLine>
      <CodeLine n={17} indent={0}>
        <span className="code-glow-amber">{'}'}</span>;
      </CodeLine>
    </div>
  );
}
