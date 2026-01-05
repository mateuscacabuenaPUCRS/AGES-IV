"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import type { ChartConfig } from "@/components/charts/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/components/chart";

interface BaseBarChartProps<TData> {
  data: TData[];
  dataKey: string;
  categoryKey: string;
  config: ChartConfig;
}

export function BaseBarChart<TData extends Record<string, unknown>>({
  data,
  dataKey,
  categoryKey,
  config,
}: BaseBarChartProps<TData>) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#cccc" />
        <XAxis dataKey={categoryKey} tickLine={true} axisLine={true} tickMargin={8} />
        <YAxis tickLine={true} axisLine={true} width={32} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="bg-white" />}
        />
        <Bar dataKey={dataKey} radius={8}>
          {data.map((item, index) => {
            const categoryValue = item[categoryKey] as string;
            const color =
              config[categoryValue]?.color || config[dataKey]?.color || "var(--color-primary)";
            return <Cell key={`cell-${categoryValue}-${index}`} fill={color} />;
          })}
        </Bar>{" "}
      </BarChart>
    </ChartContainer>
  );
}
