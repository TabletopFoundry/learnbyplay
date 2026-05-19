import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'introduction',
    'why',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quickstart',
        'getting-started/installation',
        'getting-started/first-lesson-in-5-minutes',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'concepts/overview',
        'concepts/games-and-standards',
        'concepts/lesson-plans',
        'concepts/classroom-tools',
        'concepts/dashboard-and-data',
        'concepts/architecture',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/first-lesson',
        'guides/finding-games-by-standard',
        'guides/running-a-classroom-session',
        'guides/exporting-pdfs',
        'guides/managing-classes-and-sessions',
        'guides/deploying-to-production',
        'guides/resetting-demo-data',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/configuration',
        'reference/routes',
        'reference/api',
        'reference/data-model',
        'reference/server-actions',
        'reference/cli-scripts',
      ],
    },
    'troubleshooting',
    'contributing',
    'changelog',
  ],
};

export default sidebars;
