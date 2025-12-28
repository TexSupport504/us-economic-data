"use client";

import { useMemo } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useFredData } from "@/lib/hooks/use-fred-data";
import { cn } from "@/lib/utils";

interface TickerItem {
  id: string;
  label: string;
  suffix?: string;
  prefix?: string;
  invertColors?: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  { id: "SP500", label: "S&P 500", prefix: "" },
  { id: "DGS10", label: "10Y Treasury", suffix: "%" },
  { id: "VIXCLS", label: "VIX" },
  { id: "FEDFUNDS", label: "Fed Funds", suffix: "%" },
  { id: "UNRATE", label: "Unemployment", suffix: "%", invertColors: true },
  { id: "CPIAUCSL", label: "CPI" },
];

function TickerItemDisplay({ item }: { item: TickerItem }) {
  const { latestValue, momChange, isLoading } = useFredData(item.id, { years: 1 });

  const changeColor = useMemo(() => {
    if (momChange === null || momChange === undefined || momChange === 0) {
      return "text-muted-foreground";
    }
    const isPositive = item.invertColors ? momChange < 0 : momChange > 0;
    return isPositive ? "text-positive" : "text-negative";
  }, [momChange, item.invertColors]);

  const ChangeIcon =
    momChange === null || momChange === undefined || momChange === 0
      ? Minus
      : momChange > 0
      ? ArrowUp
      : ArrowDown;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4">
        <span className="text-xs text-muted-foreground">{item.label}</span>
        <span className="text-xs text-muted-foreground">...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4">
      <span className="text-xs text-muted-foreground">{item.label}</span>
      <span className="text-sm font-semibold tabular-nums">
        {item.prefix}
        {latestValue?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        {item.suffix}
      </span>
      {momChange !== null && momChange !== undefined && (
        <span className={cn("flex items-center text-xs tabular-nums", changeColor)}>
          <ChangeIcon className="h-3 w-3" />
          {Math.abs(momChange).toFixed(2)}%
        </span>
      )}
    </div>
  );
}

export function MarketTicker() {
  return (
    <div className="relative overflow-hidden border-b border-border/40 bg-muted/30 no-print">
      <div className="flex items-center py-1.5">
        {/* Static display for now - can add scrolling animation later */}
        <div className="flex items-center divide-x divide-border/40">
          {TICKER_ITEMS.map((item) => (
            <TickerItemDisplay key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
