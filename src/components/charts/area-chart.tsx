"use client";

import { useMemo } from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  gradientId?: string;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
  formatValue?: (value: number) => string;
  formatDate?: (date: string) => string;
  referenceLines?: { value: number; label?: string; color?: string }[];
  className?: string;
}

export function AreaChart({
  data,
  height = 300,
  color = "var(--chart-1)",
  gradientId = "areaGradient",
  showGrid = true,
  showAxis = true,
  showTooltip = true,
  animated = true,
  formatValue = (v) => v.toFixed(2),
  formatDate = (d) => format(parseISO(d), "MMM yyyy"),
  referenceLines = [],
  className,
}: AreaChartProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      formattedDate: formatDate(d.date),
    }));
  }, [data, formatDate]);

  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [data]);

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/30",
          className
        )}
        style={{ height }}
      >
        <span className="text-sm text-muted-foreground">No data available</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={animated ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("chart-container", className)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.5}
              vertical={false}
            />
          )}

          {showAxis && (
            <>
              <XAxis
                dataKey="formattedDate"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickMargin={8}
                minTickGap={50}
              />
              <YAxis
                domain={yDomain}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickMargin={8}
                tickFormatter={formatValue}
                width={60}
              />
            </>
          )}

          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(data.date), "MMMM d, yyyy")}
                    </p>
                    <p className="text-lg font-semibold tabular-nums">
                      {formatValue(data.value)}
                    </p>
                  </div>
                );
              }}
            />
          )}

          {referenceLines.map((line, i) => (
            <ReferenceLine
              key={i}
              y={line.value}
              stroke={line.color || "var(--muted-foreground)"}
              strokeDasharray="5 5"
              label={
                line.label
                  ? {
                      value: line.label,
                      fill: "var(--muted-foreground)",
                      fontSize: 11,
                    }
                  : undefined
              }
            />
          ))}

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            animationDuration={animated ? 1000 : 0}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
