import { Card, CardContent, CardHeader } from "@/components/charts/components/card";
import cn from "@/utils/cn";
import React from "react";
interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  className?: string;
  id?: string;
}
export function ChartCard({ title, children, controls, className, id }: ChartCardProps) {
  return (
    <Card
      id={id}
      className={cn("bg-white text-black w-full border border-black rounded-[10px]", className)}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
        <div className="text-black text-sm font-bold">{title}</div>
        {controls}
      </CardHeader>
      <CardContent className="h-[450px]">{children}</CardContent>
    </Card>
  );
}
