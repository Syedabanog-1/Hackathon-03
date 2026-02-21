import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "LearnFlow Docs",
  tagline: "AI-Powered Python Tutoring Platform — Skills-First Development",
  favicon: "img/favicon.ico",

  url: "http://localhost",
  baseUrl: "/",

  organizationName: "learnflow",
  projectName: "learnflow-docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/learnflow/learnflow-app/tree/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "LearnFlow",
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/learnflow/skills-library",
          label: "Skills Library",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Architecture", to: "/docs/architecture" },
            { label: "Skills", to: "/docs/skills/overview" },
            { label: "Deployment", to: "/docs/deployment/quickstart" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LearnFlow. Built with Skills-First Development.`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
