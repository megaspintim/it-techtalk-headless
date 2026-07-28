// Single source of truth for the 8 topics — used by the mega-menu,
// the homepage "Browse by topic" section, and the News/Resources filters.
// Icons are inline SVG path data (stroke-based, 24x24 viewBox) matching
// the original mockup's hand-drawn icon set.

export const TOPICS = [
  {
    key: 'ai',
    label: 'Artificial Intelligence',
    description: 'Enhancing business functions, decision-making, and core processes.',
    icon: 'M7 7h10v10H7zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2'
  },
  {
    key: 'cyber',
    label: 'Cyber Risk Management',
    description: 'Protecting users, customers, and data from the edge to the core.',
    icon: 'M12 3l7 3v5c0 5-3.3 8.5-7 10-3.7-1.5-7-5-7-10V6l7-3z'
  },
  {
    key: 'cloud',
    label: 'Cloud Transformation',
    description: 'Modernizing and optimizing both employee and customer experiences.',
    icon: 'M7 18a4 4 0 01-.6-7.96 5 5 0 019.2-2A4.5 4.5 0 0117.5 18H7z'
  },
  {
    key: 'erp',
    label: 'Enterprise Resource Planning',
    description: "Putting agility at the centre of an organisation's technology landscape.",
    icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5'
  },
  {
    key: 'infra',
    label: 'Technology Infrastructure',
    description: 'Maintaining infrastructure performance, efficiency, and security.',
    icon: 'M4 4h16v5H4zM4 10.5h16v5H4zM4 17h16v3.5H4z'
  },
  {
    key: 'data',
    label: 'Enterprise data governance',
    description: 'Delivering cost-effective data governance, integration, and retention.',
    icon: 'M4 6a8 3 0 0016 0 8 3 0 00-16 0zM4 6v6a8 3 0 0016 0V6M4 12v6a8 3 0 0016 0v-6'
  },
  {
    key: 'comms',
    label: 'Unified Communications',
    description: 'Facilitating seamless interactions and always-on mobility.',
    icon: 'M4 5h16v11H9l-4 4V5zM8 9h8M8 12h5'
  },
  {
    key: 'virt',
    label: 'Virtualization',
    description: 'Boosting data centre, app, desktop, and server performance.',
    icon: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 9l9 5 9-5'
  }
];

export function getTopicByKey(key) {
  return TOPICS.find((t) => t.key === key);
}

export function getTopicLabel(key) {
  return getTopicByKey(key)?.label || key;
}
