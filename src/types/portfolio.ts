export type Lang = 'en' | 'ru';

export type EditorTab = 'profile' | 'about';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectScreen {
  src: string;
  title?: Record<Lang, string>;
  caption?: Record<Lang, string>;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: Record<Lang, string>;
  date: Record<Lang, string>;
  stack: string[];
  image: string;
  screens?: ProjectScreen[];
  links: ProjectLink[];
  layout?: 'default' | 'mobile-trio';
  accentColor?: string;
  accentRgb?: string;
}
