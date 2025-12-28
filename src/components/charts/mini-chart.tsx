"use client";

import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MiniChartProps {
  data: { date: string; value: number }[];
  height?: number;
  color?: string;
  showTrend?: boolean;
  className?: string;
}

export function MiniChart({
  data,
  height = 40,
  color = "var(--chart-1)",
  showTrend = true,
  className,
}: MiniChartProps) {
  const trendColor = useMemo(() => {
    if (!showTrend || data.length < 2) return color;
    const first = data[0]?.value ?? 0;
    const last = data[data.length - 1]?.value ?? 0;
    return last >= first ? "var(--positive)" : "var(--negative)";
  }, [data, color, showTrend]);

  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2;
    return [min - padding, max + padding];
  }, [data]);

  if (data.length === 0) {
    return (
      <div
        className={cn("rounded bg-muted/30", className)}
        style={{ height }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("overflow-hidden", className)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`miniGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={trendColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={yDomain} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke={trendColor}
            strokeWidth={1.5}
            fill={`url(#miniGradient-${color})`}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
