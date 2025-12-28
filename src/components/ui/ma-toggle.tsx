"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type MovingAveragePeriod = 3 | 6 | 12;

interface MAToggleProps {
  value: MovingAveragePeriod[];
  onChange: (value: MovingAveragePeriod[]) => void;
  className?: string;
}

export function MAToggle({ value, onChange, className }: MAToggleProps) {
  return (
    <ToggleGroup
      type="multiple"
      value={value.map(String)}
      onValueChange={(v) => onChange(v.map(Number) as MovingAveragePeriod[])}
      className={cn("gap-1", className)}
    >
      <ToggleGroupItem
        value="3"
        aria-label="Toggle 3-month moving average"
        className="h-7 px-2 text-xs"
        style={{ borderColor: value.includes(3) ? "var(--chart-2)" : undefined }}
      >
        3M
      </ToggleGroupItem>
      <ToggleGroupItem
        value="6"
        aria-label="Toggle 6-month moving average"
        className="h-7 px-2 text-xs"
        style={{ borderColor: value.includes(6) ? "var(--chart-3)" : undefined }}
      >
        6M
      </ToggleGroupItem>
      <ToggleGroupItem
        value="12"
        aria-label="Toggle 12-month moving average"
        className="h-7 px-2 text-xs"
        style={{ borderColor: value.includes(12) ? "var(--chart-4)" : undefined }}
      >
        12M
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
