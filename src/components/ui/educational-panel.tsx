"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  History,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Link2,
  AlertCircle
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getIndicatorContext, type IndicatorContext } from "@/lib/data/economic-context";

interface EducationalPanelProps {
  seriesId: string;
  currentValue?: number | null;
  change?: number | null;
  className?: string;
  compact?: boolean;
}

export function EducationalPanel({
  seriesId,
  currentValue,
  change,
  className,
  compact = false
}: EducationalPanelProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const context = getIndicatorContext(seriesId);

  if (!context) {
    return null;
  }

  const getTrendSentiment = () => {
    if (change === undefined || change === null || Math.abs(change) < 0.1) return null;
    return change > 0 ? "rising" : "falling";
  };

  const trend = getTrendSentiment();
  const humanImpact = trend
    ? context.humanImpact[trend]
    : currentValue !== undefined && currentValue !== null
      ? (seriesId === "UNRATE"
          ? (currentValue > 6 ? context.humanImpact.high : context.humanImpact.low)
          : (currentValue > 0 ? context.humanImpact.high : context.humanImpact.low))
      : context.humanImpact.high;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            Understanding {context.name}
          </CardTitle>
          {compact && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4">
              {/* Why It Matters */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Lightbulb className="h-4 w-4" />
                  Why It Matters
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {context.whyItMatters}
                </p>
              </div>

              {/* Current Human Impact */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {trend === "rising" ? (
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  ) : trend === "falling" ? (
                    <TrendingDown className="h-4 w-4 text-blue-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  What This Means for Americans
                  {trend && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {trend === "rising" ? "Rising" : "Falling"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {humanImpact}
                </p>
              </div>

              {/* Historical Context */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <History className="h-4 w-4" />
                  Historical Context
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {context.historicalContext}
                </p>
              </div>

              {/* Real World Examples */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Real-World Examples
                </div>
                <ul className="space-y-1">
                  {context.realWorldExamples.map((example, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Thresholds */}
              {context.keyThresholds && context.keyThresholds.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Key Thresholds
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {context.keyThresholds.map((threshold, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs",
                          currentValue !== undefined && currentValue !== null &&
                          Math.abs(currentValue - threshold.value) < threshold.value * 0.1
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        )}
                      >
                        <span className="font-semibold">{threshold.value}</span>
                        <span className="text-muted-foreground">{threshold.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Indicators */}
              {context.relatedIndicators.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Link2 className="h-4 w-4" />
                    Related Indicators
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {context.relatedIndicators.map((indicator) => (
                      <Badge key={indicator} variant="secondary" className="text-xs">
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
