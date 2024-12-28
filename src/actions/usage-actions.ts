"use server";

import { checkAuthenticated, getTeamApiKey } from "./utils";
import { Usage, TransformedUsageData } from "@/types/usage";

interface GetUsageActionProps {
  teamId: string;
}

export async function getUsageAction({ teamId }: GetUsageActionProps) {
  const { user } = await checkAuthenticated();

  const apiKey = await getTeamApiKey(user.id, teamId);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BILLING_API_URL}/teams/${teamId}/usage`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Team-API-Key": apiKey,
      },
    },
  );

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Failed to fetch usage data");
  }

  const data = await response.json();

  return transformUsageData(data.usages);
}

function transformUsageData(usages: Usage[]): TransformedUsageData {
  const ramData = usages.map((usage) => ({
    x: `${String(usage.month).padStart(2, "0")}/${usage.year}`,
    y: usage.template_usage.reduce(
      (acc, template) => acc + template.ram_gb_hours,
      0,
    ),
  }));

  const vcpuData = usages.map((usage) => ({
    x: `${String(usage.month).padStart(2, "0")}/${usage.year}`,
    y: usage.template_usage.reduce(
      (acc, template) => acc + template.sandbox_hours,
      0,
    ),
  }));

  const costData = usages.map((usage) => ({
    x: `${String(usage.month).padStart(2, "0")}/${usage.year}`,
    y: usage.template_usage.reduce(
      (acc, template) => acc + template.total_cost,
      0,
    ),
  }));

  return {
    vcpuSeries: [
      {
        id: "vCPU Hours",
        data: vcpuData,
      },
    ],
    ramSeries: [
      {
        id: "RAM Usage",
        data: ramData,
      },
    ],
    costSeries: [
      {
        id: "Cost",
        data: costData,
      },
    ],
  };
}
