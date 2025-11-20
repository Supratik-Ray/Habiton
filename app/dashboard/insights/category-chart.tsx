"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  health: { label: "Health", color: "var(--chart-1)" },
  fitness: { label: "Fitness", color: "var(--chart-2)" },
  learning: { label: "Learning", color: "var(--chart-3)" },
  productivity: { label: "Productivity", color: "var(--chart-4)" },
  mindfulness: { label: "Mindfulness", color: "var(--chart-5)" },
  routine: { label: "Routine", color: "var(--chart-6)" },
  finance: { label: "Finance", color: "var(--chart-7)" },
} satisfies ChartConfig;

export function CategoryChart({
  distributionData,
}: {
  distributionData: { category: string; count: number }[];
}) {
  const finalData = distributionData.map((item) => ({
    ...item,
    fill: `var(--color-${item.category})`,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Habit Categories</CardTitle>
        <CardDescription>Your habits by category</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />

            <Pie data={finalData} dataKey="count" nameKey="category" label />

            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
