import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'CCA Prep — Claude Certified Architect',
  tagline: 'Complete study guide for the CCA Foundations exam',
  favicon: 'img/favicon.svg',
  url: 'https://cca-prep-a54506.git.pages.epam.com',
  baseUrl: '/',
  organizationName: 'Vinicius_Fagundes',
  projectName: 'cca-prep',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  markdown: { hooks: { onBrokenMarkdownLinks: 'warn' } },
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    ['classic', {
      docs: {
        sidebarPath: './sidebars.ts',
        routeBasePath: 'study-guide',
        editUrl: 'https://git.epam.com/Vinicius_Fagundes/cca-prep/-/edit/main/',
      },
      blog: false,
      theme: { customCss: './src/css/custom.css' },
    } satisfies Preset.Options],
  ],
  themeConfig: {
    image: 'img/logo.svg',
    colorMode: { defaultMode: 'dark', disableSwitch: false, respectPrefersColorScheme: true },
    navbar: {
      title: 'CCA Prep',
      logo: { alt: 'CCA Prep', src: 'img/logo.svg' },
      items: [
        { to: '/overview', label: 'Overview', position: 'left' },
        { type: 'docSidebar', sidebarId: 'studySidebar', position: 'left', label: 'Study guide' },
        { to: '/cheatsheet', label: 'Cheat sheet', position: 'left' },
        { to: '/quiz', label: 'Quiz', position: 'left' },
        { to: '/mock', label: 'Mock Exam', position: 'left' },
        { to: '/flashcards', label: 'Flashcards', position: 'left' },
        { to: '/study-guide/contributing', label: 'Contributing', position: 'left' },
        { type: 'custom-buyMeACoffee', position: 'left' } as any,
        { href: 'https://git.epam.com/Vinicius_Fagundes/cca-prep', label: 'GitLab', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        { title: 'Study', items: [
          { label: 'Overview', to: '/overview' },
          { label: 'Study guide', to: '/study-guide/intro' },
          { label: 'Cheat sheet', to: '/cheatsheet' },
        ]},
        { title: 'Practice', items: [
          { label: 'Quiz', to: '/quiz' },
          { label: 'Mock Exam', to: '/mock' },
          { label: 'Flashcards', to: '/flashcards' },
          { label: 'Anti-patterns', to: '/study-guide/anti-patterns' },
        ]},
        { title: 'Official resources', items: [
          { label: 'Anthropic docs', href: 'https://platform.claude.com/docs/en/home' },
          { label: 'Agent SDK', href: 'https://platform.claude.com/docs/en/agent-sdk/overview' },
          { label: 'Claude Code', href: 'https://code.claude.com/docs/en/overview' },
          { label: 'Anthropic Academy', href: 'https://anthropic.skilljar.com' },
        ]},
      ],
      copyright: 'Community study resource. Not affiliated with Anthropic. Built with Docusaurus.',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'python', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
