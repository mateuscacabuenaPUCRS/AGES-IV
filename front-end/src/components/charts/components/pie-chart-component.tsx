"use client";

import { Pie, PieChart, Cell } from "recharts";
import type { ChartConfig } from "@/components/charts/components/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/components/chart";

interface BasePieChartProps<TData> {
  data: TData[];
  dataKey: string;
  nameKey: string;
  config: ChartConfig;
}

export function BasePieChart<TData extends Record<string, unknown>>({
  data,
  dataKey,
  nameKey,
  config,
}: BasePieChartProps<TData>) {
  const colors = Object.values(config).map((item) => item.color || "#000000");

  return (
    <ChartContainer config={config} className="h-full w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel className="bg-white" />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          outerRadius={180}
          labelLine={false}
          label={(props) => `${(Number(props.percent) * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
}
