import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 * Emphasizes trillions for vast amounts like national debt
 */
export function formatLargeNumber(
  value: number | undefined | null,
  options: {
    prefix?: string;
    suffix?: string;
    decimals?: number;
    forceTrillions?: boolean;
  } = {}
): string {
  if (value === undefined || value === null) return "—";

  const { prefix = "", suffix = "", decimals = 2, forceTrillions = false } = options;

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  // Force trillions display for emphasis on vast amounts
  if (forceTrillions && absValue >= 1e9) {
    const trillions = absValue / 1e12;
    return `${sign}${prefix}${trillions.toFixed(decimals)}T${suffix}`;
  }

  if (absValue >= 1e12) {
    return `${sign}${prefix}${(absValue / 1e12).toFixed(decimals)}T${suffix}`;
  }
  if (absValue >= 1e9) {
    return `${sign}${prefix}${(absValue / 1e9).toFixed(decimals)}B${suffix}`;
  }
  if (absValue >= 1e6) {
    return `${sign}${prefix}${(absValue / 1e6).toFixed(decimals)}M${suffix}`;
  }
  if (absValue >= 1e3) {
    return `${sign}${prefix}${(absValue / 1e3).toFixed(decimals)}K${suffix}`;
  }

  return `${sign}${prefix}${absValue.toFixed(decimals)}${suffix}`;
}

/**
 * Format currency with appropriate scale
 * Automatically uses $T for trillions, $B for billions, etc.
 */
export function formatCurrency(
  value: number | undefined | null,
  options: { decimals?: number; showCents?: boolean } = {}
): string {
  if (value === undefined || value === null) return "—";

  const { decimals = 2, showCents = false } = options;
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1e12) {
    return `${sign}$${(absValue / 1e12).toFixed(decimals)}T`;
  }
  if (absValue >= 1e9) {
    return `${sign}$${(absValue / 1e9).toFixed(decimals)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}$${(absValue / 1e6).toFixed(decimals)}M`;
  }
  if (absValue >= 1e3 && !showCents) {
    return `${sign}$${(absValue / 1e3).toFixed(decimals)}K`;
  }

  return `${sign}$${absValue.toLocaleString(undefined, {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : decimals
  })}`;
}

/**
 * Format percentage with sign
 */
export function formatPercent(
  value: number | undefined | null,
  options: { decimals?: number; showSign?: boolean } = {}
): string {
  if (value === undefined || value === null) return "—";

  const { decimals = 2, showSign = false } = options;
  const sign = showSign && value > 0 ? "+" : "";

  return `${sign}${value.toFixed(decimals)}%`;
}
