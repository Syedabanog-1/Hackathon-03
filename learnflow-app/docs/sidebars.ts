import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "Introduction",
    },
    {
      type: "doc",
      id: "architecture",
      label: "Architecture",
    },
    {
      type: "category",
      label: "Skills",
      items: [
        "skills/overview",
        "skills/agents-md-gen",
        "skills/k8s-foundation",
        "skills/kafka-k8s-setup",
        "skills/postgres-k8s-setup",
        "skills/fastapi-dapr-agent",
        "skills/mcp-code-execution",
        "skills/nextjs-k8s-deploy",
        "skills/docusaurus-deploy",
      ],
    },
    {
      type: "category",
      label: "Deployment",
      items: [
        "deployment/quickstart",
        "deployment/phase-by-phase",
        "deployment/troubleshooting",
      ],
    },
    {
      type: "category",
      label: "LearnFlow App",
      items: [
        "app/overview",
        "app/services",
        "app/frontend",
        "app/mcp-servers",
      ],
    },
  ],
};

export default sidebars;
