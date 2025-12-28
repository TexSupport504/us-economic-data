"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  height?: number;
  className?: string;
  showAxis?: boolean;
  type?: "area" | "line" | "bar";
}

export function ChartSkeleton({
  height = 300,
  className,
  showAxis = true,
  type = "area",
}: ChartSkeletonProps) {
  // Generate random-ish bar heights for visual interest
  const barCount = 12;
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Create a wave-like pattern
    const baseHeight = 40 + Math.sin(i * 0.5) * 20 + Math.random() * 20;
    return Math.min(Math.max(baseHeight, 20), 80);
  });

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ height }}
    >
      {/* Y-Axis skeleton */}
      {showAxis && (
        <div className="absolute left-0 top-0 flex h-full w-12 flex-col justify-between py-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      )}

      {/* Chart area */}
      <div
        className={cn(
          "flex h-full items-end gap-1 pb-8 pt-4",
          showAxis ? "pl-14 pr-4" : "px-4"
        )}
      >
        {type === "bar" ? (
          // Bar chart skeleton
          bars.map((barHeight, i) => (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${barHeight}%`, opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex-1"
            >
              <Skeleton className="h-full w-full rounded-t-sm" />
            </motion.div>
          ))
        ) : (
          // Area/Line chart skeleton - wave pattern
          <div className="relative flex-1">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,70 Q10,60 20,65 T40,55 T60,60 T80,50 T100,55 L100,100 L0,100 Z"
                fill="currentColor"
                className="text-muted/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.path
                d="M0,70 Q10,60 20,65 T40,55 T60,60 T80,50 T100,55"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </svg>
          </div>
        )}
      </div>

      {/* X-Axis skeleton */}
      {showAxis && (
        <div className="absolute bottom-0 left-14 right-4 flex justify-between">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-3 w-12" />
          ))}
        </div>
      )}

      {/* Shimmer overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
  showDescription?: boolean;
  showBadge?: boolean;
}

export function StatCardSkeleton({
  className,
  showDescription = true,
  showBadge = true,
}: CardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        {showBadge && <Skeleton className="h-5 w-16 rounded-full" />}
        <Skeleton className="h-3 w-20" />
      </div>
      {showDescription && (
        <Skeleton className="mt-3 h-3 w-full" />
      )}
    </motion.div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex gap-4 border-b pb-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.div
          key={rowIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: rowIndex * 0.05 }}
          className="flex gap-4"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-4 flex-1",
                colIndex === 0 && "w-32 flex-none"
              )}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}
