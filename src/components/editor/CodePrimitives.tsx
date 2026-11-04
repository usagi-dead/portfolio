import type { ReactNode } from 'react';

interface CodeLineProps {
  n: number;
  indent?: 0 | 1 | 2;
  children: ReactNode;
}

export function CodeLine({ n, indent = 0, children }: CodeLineProps) {
  const indentPadding =
    indent === 1 ? 'pl-3 sm:pl-5' : indent === 2 ? 'pl-6 sm:pl-10' : '';

  return (
    <div className="flex items-start rounded-md px-1.5 -mx-1.5 hover:bg-white/[0.03] transition-colors">
      <span className="w-5 sm:w-7 shrink-0 select-none text-right pr-3 sm:pr-5 text-zinc-600 text-[11px] sm:text-xs font-mono leading-[1.85]">
        {n}
      </span>
      <div className={`flex-1 min-w-0 break-words ${indentPadding}`}>
        {children}
      </div>
    </div>
  );
}

interface CodeStringsProps {
  items: readonly string[];
  trailingComma?: boolean;
}

export function CodeStrings({ items, trailingComma = false }: CodeStringsProps) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={item} className="whitespace-nowrap">
            <span className="code-glow-green italic">&quot;{item}&quot;</span>
            {(!isLast || trailingComma) && <span className="text-zinc-400">,</span>}
          </span>
        );
      })}
    </span>
  );
}
