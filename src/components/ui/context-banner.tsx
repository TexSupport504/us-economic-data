"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, History, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getIndicatorContext } from "@/lib/data/economic-context";

interface ContextBannerProps {
  seriesId: string;
  className?: string;
}

export function ContextBanner({ seriesId, className }: ContextBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const context = getIndicatorContext(seriesId);

  if (!context || isDismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-gradient-to-r from-primary/5 via-background to-primary/5",
        className
      )}
    >
      {/* Decorative element */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary" />

      <div className="pl-4 pr-2 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium">
                Understanding {context.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {context.whyItMatters}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 px-2 text-xs"
            >
              {isExpanded ? "Less" : "More"}
              <ChevronDown
                className={cn(
                  "h-3 w-3 ml-1 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 mt-3 border-t space-y-3">
                {/* Historical Context */}
                <div className="flex items-start gap-2">
                  <History className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block mb-1">
                      Historical Context
                    </span>
                    <p className="text-sm text-foreground">
                      {context.historicalContext}
                    </p>
                  </div>
                </div>

                {/* Real World Examples */}
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {context.realWorldExamples.map((example, i) => (
                    <div
                      key={i}
                      className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2"
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
