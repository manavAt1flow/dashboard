interface Sandbox {
  alias: string;
  clientID: string;
  cpuCount: number;
  endAt: string;
  memoryMB: number;
  metadata: Record<string, any>;
  sandboxID: string;
  startedAt: string;
  templateID: string;
}

export type { Sandbox };
