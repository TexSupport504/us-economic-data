"use client";

import { useMemo } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getVisibleRecessions, clampRecession } from "@/lib/utils/recessions";

interface DataSeries {
  id: string;
  name: string;
  data: { date: string; value: number }[];
  color?: string;
}

interface LineChartProps {
  series: DataSeries[];
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  formatValue?: (value: number) => string;
  formatDate?: (date: string) => string;
  referenceLines?: { value: number; label?: string; color?: string }[];
  showRecessions?: boolean;
  className?: string;
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function LineChart({
  series,
  height = 300,
  showGrid = true,
  showAxis = true,
  showTooltip = true,
  showLegend = true,
  animated = true,
  formatValue = (v) => v.toFixed(2),
  formatDate = (d) => format(parseISO(d), "MMM yyyy"),
  referenceLines = [],
  showRecessions = true,
  className,
}: LineChartProps) {
  // Merge all series data by date
  const chartData = useMemo(() => {
    const dateMap = new Map<string, Record<string, number | string>>();

    series.forEach((s) => {
      s.data.forEach((d) => {
        const existing = dateMap.get(d.date) || { date: d.date };
        existing[s.id] = d.value;
        dateMap.set(d.date, existing);
      });
    });

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime())
      .map((d) => ({
        ...d,
        formattedDate: formatDate(d.date as string),
      }));
  }, [series, formatDate]);

  const yDomain = useMemo(() => {
    const allValues = series.flatMap((s) => s.data.map((d) => d.value));
    if (allValues.length === 0) return [0, 100];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [series]);

  // Get all unique dates from series data for recession calculation
  const allDates = useMemo(() => {
    const dateSet = new Set<string>();
    series.forEach((s) => s.data.forEach((d) => dateSet.add(d.date)));
    return Array.from(dateSet).sort();
  }, [series]);

  // Get recession periods that fall within the data range
  const recessionAreas = useMemo(() => {
    if (!showRecessions || allDates.length === 0) return [];

    const startDate = allDates[0];
    const endDate = allDates[allDates.length - 1];
    const visibleRecessions = getVisibleRecessions(startDate, endDate);

    return visibleRecessions.map((recession) => {
      const clamped = clampRecession(recession, startDate, endDate);

      // Find the first data point after recession start
      let startIndex = 0;
      for (let i = 0; i < allDates.length; i++) {
        if (allDates[i] >= clamped.start) {
          startIndex = i;
          break;
        }
      }

      // Find the last data point before recession end
      let endIndex = allDates.length - 1;
      for (let i = allDates.length - 1; i >= 0; i--) {
        if (allDates[i] <= clamped.end) {
          endIndex = i;
          break;
        }
      }

      return {
        x1: formatDate(allDates[startIndex]),
        x2: formatDate(allDates[endIndex]),
      };
    });
  }, [allDates, showRecessions, formatDate]);

  if (series.length === 0 || chartData.length === 0) {
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
        <RechartsLineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
                if (!active || !payload?.length) return null;
                const date = payload[0]?.payload?.date;
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                    <p className="mb-1 text-xs text-muted-foreground">
                      {date && format(parseISO(date), "MMMM d, yyyy")}
                    </p>
                    {payload.map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {p.name}:
                        </span>
                        <span className="font-semibold tabular-nums">
                          {formatValue(p.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          )}

          {showLegend && series.length > 1 && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          )}

          {/* Recession shading */}
          {recessionAreas.map((area, i) => (
            <ReferenceArea
              key={`recession-${i}`}
              x1={area.x1}
              x2={area.x2}
              fill="var(--muted-foreground)"
              fillOpacity={0.1}
              stroke="none"
            />
          ))}

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

          {series.map((s, i) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.id}
              name={s.name}
              stroke={s.color || CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={animated ? 1000 : 0}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
