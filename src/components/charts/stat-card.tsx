"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatLargeNumber, formatCurrency } from "@/lib/utils";
import { MiniChart } from "./mini-chart";

interface DataPoint {
  date: string;
  value: number;
}

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  change?: number | null;
  changeLabel?: string;
  changeType?: "percentage" | "absolute";
  icon?: LucideIcon;
  suffix?: string;
  prefix?: string;
  description?: string;
  lastUpdated?: string;
  isLoading?: boolean;
  className?: string;
  invertColors?: boolean;
  sparklineData?: DataPoint[];
  formatAsCurrency?: boolean;
  formatAsTrillions?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  changeType = "percentage",
  icon: Icon,
  suffix = "",
  prefix = "",
  description,
  lastUpdated,
  isLoading = false,
  className,
  invertColors = false,
  sparklineData,
  formatAsCurrency = false,
  formatAsTrillions = false,
}: StatCardProps) {
  const getChangeColor = (change: number) => {
    if (change === 0) return "text-muted-foreground";
    const isPositive = invertColors ? change < 0 : change > 0;
    return isPositive ? "text-positive" : "text-negative";
  };

  const getChangeBgColor = (change: number) => {
    if (change === 0) return "bg-muted/50";
    const isPositive = invertColors ? change < 0 : change > 0;
    return isPositive ? "bg-positive/10" : "bg-negative/10";
  };

  const ChangeIcon = change === 0 || change === null || change === undefined ? Minus : change > 0 ? ArrowUp : ArrowDown;

  // Format the value based on options
  const formatValue = (val: number | string | undefined): string => {
    if (val === undefined || val === null) return "—";
    if (typeof val === "string") return val;

    if (formatAsCurrency) {
      return formatCurrency(val);
    }
    if (formatAsTrillions) {
      return formatLargeNumber(val, { prefix, suffix, forceTrillions: true });
    }
    return `${prefix}${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}${suffix}`;
  };

  const isTrillionValue = typeof value === "number" && value >= 1e12;

  if (isLoading) {
    return (
      <Card className={cn("stat-card-hover", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-8 w-32" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn("stat-card-hover", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-2xl font-bold tabular-nums tracking-tight md:text-3xl",
                  isTrillionValue && "trillion-value"
                )}>
                  {formatValue(value)}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                {change !== undefined && change !== null && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "gap-1 font-medium tabular-nums",
                      getChangeBgColor(change),
                      getChangeColor(change)
                    )}
                  >
                    <ChangeIcon className="h-3 w-3" />
                    {changeType === "percentage"
                      ? `${Math.abs(change).toFixed(2)}%`
                      : Math.abs(change).toLocaleString()}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{changeLabel}</span>
              </div>

              {description && (
                <p className="mt-2 text-xs text-muted-foreground">{description}</p>
              )}

              {lastUpdated && (
                <p className="mt-2 text-xs text-muted-foreground/60">
                  Updated: {lastUpdated}
                </p>
              )}
            </div>

            {sparklineData && sparklineData.length > 0 && (
              <div className="w-20 shrink-0 sparkline-container">
                <MiniChart data={sparklineData} height={40} showTrend />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
