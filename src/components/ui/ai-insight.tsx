"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, Minus, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getIndicatorContext, getHumanImpactSentiment } from "@/lib/data/economic-context";

interface AIInsightProps {
  seriesId: string;
  seriesName: string;
  currentValue?: number | null;
  previousValue?: number | null;
  change?: number | null;
  className?: string;
}

export function AIInsight({
  seriesId,
  seriesName,
  currentValue,
  previousValue,
  change,
  className
}: AIInsightProps) {
  const context = getIndicatorContext(seriesId);

  // Generate a "sentiment score" based on the indicator and its trend
  const sentimentAnalysis = useMemo(() => {
    if (!context || currentValue === undefined || currentValue === null) return null;

    const actualChange = change ?? 0;

    // Different indicators have different "good" directions
    const invertedIndicators = ["UNRATE", "CPIAUCSL", "GFDEBTN", "GFDEGDQ188S"];
    const isInverted = invertedIndicators.includes(seriesId);

    // Calculate sentiment: positive change is good unless inverted
    let sentiment: "positive" | "negative" | "neutral" = "neutral";
    let sentimentScore = 50; // 0-100, 50 is neutral

    if (Math.abs(actualChange) < 0.5) {
      sentiment = "neutral";
      sentimentScore = 50;
    } else if (isInverted) {
      sentiment = actualChange > 0 ? "negative" : "positive";
      sentimentScore = actualChange > 0 ? 30 - Math.min(actualChange * 5, 20) : 70 + Math.min(Math.abs(actualChange) * 5, 20);
    } else {
      sentiment = actualChange > 0 ? "positive" : "negative";
      sentimentScore = actualChange > 0 ? 70 + Math.min(actualChange * 5, 20) : 30 - Math.min(Math.abs(actualChange) * 5, 20);
    }

    // Clamp score
    sentimentScore = Math.max(10, Math.min(90, sentimentScore));

    return { sentiment, sentimentScore };
  }, [context, currentValue, change, seriesId]);

  const humanImpact = useMemo(() => {
    if (!context || currentValue === undefined || currentValue === null) return null;
    return getHumanImpactSentiment(seriesId, currentValue, change ?? 0);
  }, [context, seriesId, currentValue, change]);

  if (!context || !sentimentAnalysis) {
    return null;
  }

  const getSentimentColor = () => {
    switch (sentimentAnalysis.sentiment) {
      case "positive":
        return "text-emerald-500";
      case "negative":
        return "text-rose-500";
      default:
        return "text-amber-500";
    }
  };

  const getSentimentBg = () => {
    switch (sentimentAnalysis.sentiment) {
      case "positive":
        return "bg-emerald-500/10";
      case "negative":
        return "bg-rose-500/10";
      default:
        return "bg-amber-500/10";
    }
  };

  const getSentimentLabel = () => {
    if (sentimentAnalysis.sentimentScore >= 70) return "Favorable";
    if (sentimentAnalysis.sentimentScore >= 55) return "Slightly Positive";
    if (sentimentAnalysis.sentimentScore >= 45) return "Stable";
    if (sentimentAnalysis.sentimentScore >= 30) return "Slightly Concerning";
    return "Concerning";
  };

  const TrendIcon = change && change > 0.5
    ? TrendingUp
    : change && change < -0.5
      ? TrendingDown
      : Minus;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          AI Economic Insight
          <Badge variant="outline" className="ml-auto text-xs font-normal">
            Real-time Analysis
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sentiment Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Public Economic Sentiment</span>
            <span className={cn("font-medium", getSentimentColor())}>
              {getSentimentLabel()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", getSentimentBg())}
              initial={{ width: 0 }}
              animate={{ width: `${sentimentAnalysis.sentimentScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                background: `linear-gradient(90deg,
                  hsl(${sentimentAnalysis.sentimentScore * 1.2}, 70%, 50%),
                  hsl(${sentimentAnalysis.sentimentScore * 1.2 + 20}, 70%, 45%))`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Pessimistic</span>
            <span>Neutral</span>
            <span>Optimistic</span>
          </div>
        </div>

        {/* Current Trend Indicator */}
        <div className={cn(
          "flex items-center gap-3 rounded-lg p-3",
          getSentimentBg()
        )}>
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            sentimentAnalysis.sentiment === "positive" ? "bg-emerald-500/20" :
            sentimentAnalysis.sentiment === "negative" ? "bg-rose-500/20" :
            "bg-amber-500/20"
          )}>
            <TrendIcon className={cn("h-5 w-5", getSentimentColor())} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">
              {seriesName} is {change && change > 0.5 ? "Rising" : change && change < -0.5 ? "Falling" : "Stable"}
            </div>
            <div className="text-xs text-muted-foreground">
              {change !== undefined && change !== null && (
                <span>
                  {change > 0 ? "+" : ""}{change.toFixed(2)}% year-over-year change
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Human Impact Insight */}
        {humanImpact && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-primary" />
              Impact on Everyday Americans
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {humanImpact}
            </p>
          </div>
        )}

        {/* Quick Facts */}
        {context.realWorldExamples.length > 0 && (
          <div className="border-t pt-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Did You Know?
            </div>
            <p className="text-sm text-foreground">
              {context.realWorldExamples[Math.floor(Math.random() * context.realWorldExamples.length)]}
            </p>
          </div>
        )}

        {/* AI Disclaimer */}
        <div className="text-[10px] text-muted-foreground/60 text-center pt-2 border-t">
          Analysis generated based on current economic data trends and historical patterns
        </div>
      </CardContent>
    </Card>
  );
}
