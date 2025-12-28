"use client";

import { useState, useMemo } from "react";
import { Calendar, ArrowRightLeft } from "lucide-react";
import { format, parseISO, subYears } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  value: number;
}

interface ComparisonPeriod {
  label: string;
  yearsAgo: number;
}

const COMPARISON_PERIODS: ComparisonPeriod[] = [
  { label: "vs 1 Year Ago", yearsAgo: 1 },
  { label: "vs 2 Years Ago", yearsAgo: 2 },
  { label: "vs 3 Years Ago", yearsAgo: 3 },
  { label: "vs 5 Years Ago", yearsAgo: 5 },
  { label: "vs Pre-COVID (2019)", yearsAgo: 5 }, // Approximate
  { label: "vs 10 Years Ago", yearsAgo: 10 },
];

interface DateRangeComparisonProps {
  data: DataPoint[];
  title: string;
  formatValue?: (value: number) => string;
  suffix?: string;
  prefix?: string;
  invertColors?: boolean;
  isLoading?: boolean;
}

export function DateRangeComparison({
  data,
  title,
  formatValue = (v) => v.toFixed(2),
  suffix = "",
  prefix = "",
  invertColors = false,
  isLoading = false,
}: DateRangeComparisonProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1");

  const comparison = useMemo(() => {
    if (data.length === 0) return null;

    const yearsAgo = parseInt(selectedPeriod);
    const sortedData = [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latestPoint = sortedData[0];
    if (!latestPoint) return null;

    const latestDate = new Date(latestPoint.date);
    const comparisonDate = subYears(latestDate, yearsAgo);

    // Find the closest data point to the comparison date
    const comparisonPoint = sortedData.reduce((closest, point) => {
      const pointDate = new Date(point.date);
      const closestDate = closest ? new Date(closest.date) : null;

      const pointDiff = Math.abs(pointDate.getTime() - comparisonDate.getTime());
      const closestDiff = closestDate
        ? Math.abs(closestDate.getTime() - comparisonDate.getTime())
        : Infinity;

      return pointDiff < closestDiff ? point : closest;
    }, null as DataPoint | null);

    if (!comparisonPoint) return null;

    const absoluteChange = latestPoint.value - comparisonPoint.value;
    const percentChange = ((latestPoint.value - comparisonPoint.value) / comparisonPoint.value) * 100;

    return {
      latest: {
        value: latestPoint.value,
        date: latestPoint.date,
      },
      comparison: {
        value: comparisonPoint.value,
        date: comparisonPoint.date,
      },
      absoluteChange,
      percentChange,
    };
  }, [data, selectedPeriod]);

  const getChangeColor = (change: number) => {
    if (change === 0) return "text-muted-foreground";
    const isPositive = invertColors ? change < 0 : change > 0;
    return isPositive ? "text-positive" : "text-negative";
  };

  const getChangeBgColor = (change: number) => {
    if (change === 0) return "bg-muted";
    const isPositive = invertColors ? change < 0 : change > 0;
    return isPositive ? "bg-positive/10" : "bg-negative/10";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowRightLeft className="h-4 w-4" />
            Period Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowRightLeft className="h-4 w-4" />
              Period Comparison: {title}
            </CardTitle>
            <CardDescription>Compare current values to historical periods</CardDescription>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPARISON_PERIODS.map((period) => (
                <SelectItem key={period.yearsAgo} value={period.yearsAgo.toString()}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {comparison ? (
          <div className="space-y-4">
            {/* Main Comparison */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Current Value */}
              <div className="rounded-lg border bg-card p-4">
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {prefix}{formatValue(comparison.latest.value)}{suffix}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <Calendar className="mr-1 inline h-3 w-3" />
                  {format(parseISO(comparison.latest.date), "MMM d, yyyy")}
                </p>
              </div>

              {/* Change */}
              <div className={cn("rounded-lg border p-4", getChangeBgColor(comparison.percentChange))}>
                <p className="text-xs text-muted-foreground">Change</p>
                <p className={cn("mt-1 text-2xl font-bold tabular-nums", getChangeColor(comparison.percentChange))}>
                  {comparison.percentChange >= 0 ? "+" : ""}
                  {comparison.percentChange.toFixed(2)}%
                </p>
                <p className={cn("mt-1 text-sm tabular-nums", getChangeColor(comparison.absoluteChange))}>
                  {comparison.absoluteChange >= 0 ? "+" : ""}
                  {prefix}{formatValue(comparison.absoluteChange)}{suffix}
                </p>
              </div>

              {/* Historical Value */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">
                  {selectedPeriod} Year{parseInt(selectedPeriod) > 1 ? "s" : ""} Ago
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-muted-foreground">
                  {prefix}{formatValue(comparison.comparison.value)}{suffix}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <Calendar className="mr-1 inline h-3 w-3" />
                  {format(parseISO(comparison.comparison.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            {/* Quick Period Badges */}
            <div className="flex flex-wrap gap-2">
              {COMPARISON_PERIODS.slice(0, 4).map((period) => {
                const isSelected = period.yearsAgo.toString() === selectedPeriod;
                return (
                  <Badge
                    key={period.yearsAgo}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedPeriod(period.yearsAgo.toString())}
                  >
                    {period.yearsAgo}Y
                  </Badge>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center">
            <span className="text-muted-foreground">
              Not enough historical data for comparison
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
