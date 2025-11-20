"use client";

import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TcompletionRates = {
  totalExpected: number;
  totalCompleted: number;
  label: string;
}[];

const chartConfig = {
  totalExpected: {
    label: "Expected",
    color: "var(--chart-1)",
  },
  totalCompleted: {
    label: "Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function CompletionRateChart({
  completionRates,
}: {
  completionRates: TcompletionRates;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Weekly Completion Rate</CardTitle>
        <CardDescription>Expected vs Completed habits</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={completionRates}>
            <CartesianGrid vertical={false} />

            <XAxis dataKey="label" />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar
              dataKey="totalExpected"
              fill="var(--color-totalExpected)"
              radius={4}
            />

            <Bar
              dataKey="totalCompleted"
              fill="var(--color-totalCompleted)"
              radius={4}
            />

            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
