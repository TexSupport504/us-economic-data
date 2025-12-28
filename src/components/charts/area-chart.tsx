"use client";

import { useMemo } from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getVisibleRecessions, clampRecession } from "@/lib/utils/recessions";
import { getEventsInRange, getEventColor, type EconomicEvent } from "@/lib/utils/economic-events";

interface DataPoint {
  date: string;
  value: number;
}

type MovingAveragePeriod = 3 | 6 | 12;

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
  showRecessions?: boolean;
  showEvents?: boolean;
  eventTypes?: EconomicEvent["type"][];
  movingAverages?: MovingAveragePeriod[];
  className?: string;
}

const MA_COLORS: Record<MovingAveragePeriod, string> = {
  3: "var(--chart-2)",
  6: "var(--chart-3)",
  12: "var(--chart-4)",
};

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
  showRecessions = true,
  showEvents = false,
  eventTypes = [],
  movingAverages = [],
  className,
}: AreaChartProps) {
  // Calculate moving averages
  const calculateMA = (values: number[], period: number, index: number): number | null => {
    if (index < period - 1) return null;
    const slice = values.slice(index - period + 1, index + 1);
    return slice.reduce((sum, val) => sum + val, 0) / period;
  };

  const chartData = useMemo(() => {
    const values = data.map((d) => d.value);
    return data.map((d, i) => {
      const point: Record<string, unknown> = {
        ...d,
        formattedDate: formatDate(d.date),
      };
      // Add moving averages if requested
      for (const period of movingAverages) {
        point[`ma${period}`] = calculateMA(values, period, i);
      }
      return point;
    });
  }, [data, formatDate, movingAverages]);

  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [data]);

  // Get recession periods that fall within the data range
  const recessionAreas = useMemo(() => {
    if (!showRecessions || data.length === 0) return [];

    const startDate = data[0].date;
    const endDate = data[data.length - 1].date;
    const visibleRecessions = getVisibleRecessions(startDate, endDate);

    return visibleRecessions.map((recession) => {
      const clamped = clampRecession(recession, startDate, endDate);

      // Find the index of the first data point after recession start
      let startIndex = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].date >= clamped.start) {
          startIndex = i;
          break;
        }
      }

      // Find the index of the last data point before recession end
      let endIndex = data.length - 1;
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].date <= clamped.end) {
          endIndex = i;
          break;
        }
      }

      return {
        x1: formatDate(data[startIndex].date),
        x2: formatDate(data[endIndex].date),
      };
    });
  }, [data, showRecessions, formatDate]);

  // Get economic events within data range
  const eventMarkers = useMemo(() => {
    if (!showEvents || data.length === 0) return [];

    const startDate = data[0].date;
    const endDate = data[data.length - 1].date;
    const events = getEventsInRange(startDate, endDate, eventTypes.length > 0 ? eventTypes : undefined);

    return events.map((event) => {
      // Find the closest data point to the event date
      let closestIndex = 0;
      let minDiff = Infinity;
      for (let i = 0; i < data.length; i++) {
        const diff = Math.abs(new Date(data[i].date).getTime() - new Date(event.date).getTime());
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }

      return {
        x: formatDate(data[closestIndex].date),
        label: event.label,
        description: event.description,
        color: getEventColor(event.type),
        type: event.type,
      };
    });
  }, [data, showEvents, eventTypes, formatDate]);

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
                const pointData = payload[0].payload;
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(pointData.date), "MMMM d, yyyy")}
                    </p>
                    <p className="text-lg font-semibold tabular-nums">
                      {formatValue(pointData.value)}
                    </p>
                    {movingAverages.length > 0 && (
                      <div className="mt-1 space-y-0.5 border-t border-border pt-1">
                        {movingAverages.map((period) => {
                          const maValue = pointData[`ma${period}`];
                          if (maValue == null) return null;
                          return (
                            <p key={period} className="text-xs" style={{ color: MA_COLORS[period] }}>
                              {period}M MA: {formatValue(maValue)}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }}
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

          {/* Economic event markers */}
          {eventMarkers.map((event, i) => (
            <ReferenceLine
              key={`event-${i}`}
              x={event.x}
              stroke={event.color}
              strokeDasharray="3 3"
              strokeOpacity={0.7}
              label={{
                value: event.label,
                fill: event.color,
                fontSize: 10,
                position: "top",
                offset: 5,
              }}
            />
          ))}

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            animationDuration={animated ? 1000 : 0}
            name="Value"
          />

          {/* Moving average lines */}
          {movingAverages.map((period) => (
            <Line
              key={`ma-${period}`}
              type="monotone"
              dataKey={`ma${period}`}
              stroke={MA_COLORS[period]}
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
              animationDuration={animated ? 1000 : 0}
              connectNulls
              name={`${period}M MA`}
            />
          ))}

          {movingAverages.length > 0 && (
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10 }}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          )}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
