import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'LearnByPlay',
  tagline: 'Turn great board games into trusted, standards-aligned instruction.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://learnbyplay.dev',
  baseUrl: '/',

  organizationName: 'TabletopFoundry',
  projectName: 'learnbyplay',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl:
            'https://github.com/TabletopFoundry/learnbyplay/tree/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    image: 'img/learnbyplay-social-card.svg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    metadata: [
      {name: 'keywords', content: 'board games, classroom, education, Common Core, lesson plans, K-12, gamification, teaching'},
      {name: 'description', content: 'LearnByPlay helps teachers turn board games into standards-aligned instruction with lesson plans, classroom tools, and a teacher dashboard.'},
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'LearnByPlay'},
    ],
    navbar: {
      title: 'LearnByPlay',
      logo: {
        alt: 'LearnByPlay logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/docs/getting-started/quickstart', label: 'Quickstart', position: 'left'},
        {to: '/docs/guides/first-lesson', label: 'Guides', position: 'left'},
        {to: '/docs/reference/configuration', label: 'Reference', position: 'left'},
        {to: '/docs/why', label: 'Why LearnByPlay', position: 'left'},
        {
          href: 'https://github.com/TabletopFoundry/learnbyplay',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Quickstart', to: '/docs/getting-started/quickstart'},
            {label: 'Core Concepts', to: '/docs/concepts/overview'},
            {label: 'Guides', to: '/docs/guides/first-lesson'},
            {label: 'Reference', to: '/docs/reference/configuration'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub Discussions', href: 'https://github.com/TabletopFoundry/learnbyplay/discussions'},
            {label: 'Issues', href: 'https://github.com/TabletopFoundry/learnbyplay/issues'},
            {label: 'Contributing', to: '/docs/contributing'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Changelog', to: '/docs/changelog'},
            {label: 'Troubleshooting', to: '/docs/troubleshooting'},
            {label: 'GitHub', href: 'https://github.com/TabletopFoundry/learnbyplay'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LearnByPlay. Released under the MIT License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'tsx', 'sql', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
