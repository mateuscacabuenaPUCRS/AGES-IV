"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import type { ChartConfig } from "@/components/charts/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/components/chart";

interface BaseAreaChartProps<TData> {
  data: TData[];
  dataKey: string;
  categoryKey: string;
  config: ChartConfig;
  strokeColor?: string;
  referenceLines?: { x: string }[];
}

export function BaseAreaChart<TData extends object>({
  data,
  dataKey,
  categoryKey,
  config,
  strokeColor,
  referenceLines,
}: BaseAreaChartProps<TData>) {
  return (
    <ChartContainer config={config} className="h-full w-full">
      <AreaChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#cccc" />
        <XAxis dataKey={categoryKey} tickLine={true} axisLine={true} tickMargin={8} interval={1} />
        <YAxis tickLine={true} axisLine={true} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" className="bg-white" />}
        />
        {referenceLines?.map((line, index) => (
          <ReferenceLine key={index} x={line.x} strokeDasharray="3 3" />
        ))}
        <Area
          dataKey={dataKey}
          type="linear"
          fill="var(--color-fill, #ffffff)"
          fillOpacity={0.4}
          stroke={strokeColor || "var(--color-stroke, #000000)"}
          strokeWidth={2}
          activeDot={{
            r: 6,
            strokeWidth: 2,
            fill: strokeColor || "#000000",
            stroke: "#ffffff",
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
