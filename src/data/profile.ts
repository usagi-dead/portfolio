import type { Lang } from '../types/portfolio';

export const SOCIAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com/usagi-dead' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/usagi-dead/' },
  { label: 'Telegram', url: 'https://t.me/usagi_dead' },
] as const;

export const CORE_STACK = [
  ['Angular', 'TypeScript', 'RxJS', 'Angular Signals'],
  ['React', 'Redux Toolkit', 'JavaScript', 'HTML5 / SCSS'],
  ['Tailwind CSS', 'Taiga UI', 'Chakra UI'],
] as const;

export const TOOLS_AND_AI = [
  ['Figma', 'Vite', 'Git', 'Docker', 'Linux'],
  ['Google Antigravity', 'Gemini', 'DeepSeek'],
] as const;

export const PROFILE_META: Record<
  Lang,
  {
    headerName: string;
    name: string;
    role: string;
    design: string;
    location: string;
  }
> = {
  en: {
    headerName: 'ALEXANDER LUCHINOVICH',
    name: 'Alexander Luchinovich',
    role: 'Frontend Developer (Angular / React)',
    design: 'UI/UX in Figma from scratch',
    location: 'Minsk, Belarus',
  },
  ru: {
    headerName: 'АЛЕКСАНДР ЛУЧИНОВИЧ',
    name: 'Александр Лучинович',
    role: 'Frontend-разработчик (Angular / React)',
    design: 'Проектирование UI/UX в Figma с нуля',
    location: 'Минск, Беларусь',
  },
};

export function getRawProfileCode(lang: Lang): string {
  const meta = PROFILE_META[lang];

  return `const developer: FrontendProfile = {
  personal: {
    name: "${meta.name}",
    role: "${meta.role}",
    design: "${meta.design}",
    location: "${meta.location}"
  },
  coreStack: [
    "Angular", "TypeScript", "RxJS", "Angular Signals",
    "React", "Redux Toolkit", "JavaScript", "HTML5 / SCSS",
    "Tailwind CSS", "Taiga UI", "Chakra UI"
  ],
  toolsAndAI: [
    "Figma", "Vite", "Git", "Docker", "Linux",
    "Google Antigravity", "Gemini", "DeepSeek"
  ]
};`;
}
