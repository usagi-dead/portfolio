import type React from 'react';

interface AnimatedLinkProps {
  href: string;
  label: string;
  external?: boolean;
  download?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  title?: string;
}

export function AnimatedLink({
  href,
  label,
  external = true,
  download = false,
  onClick,
  title,
}: AnimatedLinkProps) {
  return (
    <a
      href={href}
      download={download ? true : undefined}
      target={!download && external ? '_blank' : undefined}
      rel={!download && external ? 'noreferrer' : undefined}
      onClick={onClick}
      title={title}
      className="group/link inline-flex items-center text-zinc-300 hover:text-white transition-colors font-normal cursor-pointer"
    >
      <span>{label}</span>
      <span className="text-zinc-500 ml-1 inline-block transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:text-zinc-200">
        →
      </span>
    </a>
  );
}
