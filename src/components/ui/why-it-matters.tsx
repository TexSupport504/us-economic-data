"use client";

import { Lightbulb, Info } from "lucide-react";
import { motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getIndicatorContext } from "@/lib/data/economic-context";

interface WhyItMattersProps {
  seriesId: string;
  variant?: "inline" | "tooltip" | "block";
  className?: string;
}

export function WhyItMatters({
  seriesId,
  variant = "tooltip",
  className
}: WhyItMattersProps) {
  const context = getIndicatorContext(seriesId);

  if (!context) {
    return null;
  }

  if (variant === "tooltip") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className={cn(
              "inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors",
              className
            )}>
              <Lightbulb className="h-3 w-3" />
              <span>Why it matters</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-sm p-4">
            <div className="space-y-2">
              <div className="font-medium text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Why {context.name} Matters
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {context.whyItMatters}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-start gap-2 text-sm text-muted-foreground",
          className
        )}
      >
        <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <span>{context.whyItMatters}</span>
      </motion.div>
    );
  }

  // Block variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg bg-primary/5 border border-primary/10 p-4 space-y-2",
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Lightbulb className="h-4 w-4" />
        Why {context.name} Matters
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {context.whyItMatters}
      </p>
    </motion.div>
  );
}

interface QuickFactProps {
  seriesId: string;
  className?: string;
}

export function QuickFact({ seriesId, className }: QuickFactProps) {
  const context = getIndicatorContext(seriesId);

  if (!context || context.realWorldExamples.length === 0) {
    return null;
  }

  // Get a random fact (or deterministic based on seriesId)
  const factIndex = seriesId.charCodeAt(0) % context.realWorldExamples.length;
  const fact = context.realWorldExamples[factIndex];

  return (
    <div className={cn(
      "flex items-start gap-2 text-sm",
      className
    )}>
      <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <span className="text-muted-foreground">{fact}</span>
    </div>
  );
}
