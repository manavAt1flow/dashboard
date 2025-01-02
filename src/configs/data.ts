import { nanoid } from "nanoid";
import { Sandbox, Template } from "@/types/api";

const TEMPLATES = [
  { id: "node-typescript-v1", memory: [1024, 2048, 4096], cpu: [1, 2, 4] },
  { id: "react-vite-v2", memory: [1024, 2048], cpu: [1, 2] },
  { id: "postgres-v15", memory: [2048, 4096, 8192], cpu: [2, 4] },
  { id: "redis-v7", memory: [2048, 4096], cpu: [1, 2] },
  { id: "python-ml-v1", memory: [4096, 8192], cpu: [2, 4] },
  { id: "elastic-v8", memory: [4096, 8192], cpu: [2, 4] },
  { id: "grafana-v9", memory: [2048, 4096], cpu: [1, 2] },
  { id: "nginx-v1", memory: [1024, 2048], cpu: [1, 2] },
] as const;

const ENVIRONMENTS = ["prod", "staging", "dev", "test"] as const;
const COMPONENTS = [
  "backend",
  "frontend",
  "api",
  "auth",
  "cache",
  "database",
  "queue",
  "search",
  "monitoring",
] as const;

function generateMockSandboxes(count: number): Sandbox[] {
  const sandboxes: Sandbox[] = [];
  const baseDate = new Date("2024-03-19T00:00:00Z");

  for (let i = 0; i < count; i++) {
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const env = ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)];
    const component = COMPONENTS[Math.floor(Math.random() * COMPONENTS.length)];

    // Each sandbox starts 24 hours after the previous one
    const startDate = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    // Random memory and CPU from template's allowed values
    const memory =
      template.memory[Math.floor(Math.random() * template.memory.length)];
    const cpu = template.cpu[Math.floor(Math.random() * template.cpu.length)];

    sandboxes.push({
      alias: `${env}-${component}-${nanoid(4)}`,
      clientID: nanoid(8),
      cpuCount: cpu,
      endAt: endDate.toISOString(),
      memoryMB: memory,
      metadata: {
        lastUpdate: new Date(
          startDate.getTime() + 2 * 60 * 60 * 1000,
        ).toISOString(),
      },
      sandboxID: nanoid(8),
      startedAt: startDate.toISOString(),
      templateID: template.id,
    });
  }

  return sandboxes;
}

export const MOCK_SANDBOXES_DATA = generateMockSandboxes(50);

export function generateMockTemplates(count: number = 50): Template[] {
  const baseTemplates = [
    {
      name: "node",
      versions: ["14", "16", "18", "20"],
      sizes: ["small", "medium", "large"],
    },
    {
      name: "python",
      versions: ["3.8", "3.9", "3.10", "3.11"],
      sizes: ["ml", "web", "data"],
    },
    {
      name: "golang",
      versions: ["1.19", "1.20", "1.21"],
      sizes: ["api", "worker"],
    },
    {
      name: "postgres",
      versions: ["13", "14", "15"],
      sizes: ["standard", "extended"],
    },
    {
      name: "redis",
      versions: ["6", "7"],
      sizes: ["cache", "queue"],
    },
  ];

  const templates: Template[] = [];
  const users = [
    { email: "alice@example.com", id: nanoid(8) },
    { email: "bob@example.com", id: nanoid(8) },
    { email: "charlie@example.com", id: nanoid(8) },
    { email: null, id: null },
  ];

  for (let i = 0; i < count; i++) {
    const baseTemplate =
      baseTemplates[Math.floor(Math.random() * baseTemplates.length)];
    const version =
      baseTemplate.versions[
        Math.floor(Math.random() * baseTemplate.versions.length)
      ];
    const size =
      baseTemplate.sizes[Math.floor(Math.random() * baseTemplate.sizes.length)];

    const createdDate = new Date(
      2024 - Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28),
    );
    const updatedDate = new Date(
      createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000,
    );

    const creator = users[Math.floor(Math.random() * users.length)];

    templates.push({
      aliases: [
        `${baseTemplate.name}-${version}-${size}`,
        `${baseTemplate.name}-${version}`,
        `${baseTemplate.name}-latest`,
      ],
      buildID: nanoid(8),
      cpuCount: Math.pow(2, Math.floor(Math.random() * 3)), // 1, 2, or 4 CPUs
      memoryMB: 1024 * Math.pow(2, Math.floor(Math.random() * 4)), // 1GB to 8GB
      public: Math.random() > 0.3, // 70% chance of being public
      templateID: `${baseTemplate.name}-${version}-${size}-${nanoid(4)}`,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      createdBy:
        creator.id === null
          ? null
          : {
              email: creator.email!,
              id: creator.id!,
            },
    });
  }

  return templates;
}

export const MOCK_TEMPLATES_DATA = generateMockTemplates(50);
