"use client";

import { motion } from "framer-motion";
import { SearchX, AlertCircle, RefreshCw, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: "default" | "error" | "search";
}

const variantConfig = {
  default: {
    icon: AlertCircle,
    iconColor: "text-muted-foreground",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-destructive",
  },
  search: {
    icon: SearchX,
    iconColor: "text-muted-foreground",
  },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4",
          variant === "error" && "bg-destructive/10"
        )}
      >
        <Icon className={cn("h-8 w-8", config.iconColor)} />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// Preset empty states
export function NoDataState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      title="No data available"
      description="We couldn't find any data for this time period. Try adjusting the date range or check back later."
      action={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
    />
  );
}

export function NoResultsState({ query }: { query?: string }) {
  return (
    <EmptyState
      variant="search"
      title="No results found"
      description={
        query
          ? `No results match "${query}". Try a different search term.`
          : "No results match your search. Try a different term."
      }
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      variant="error"
      title="Something went wrong"
      description="We encountered an error loading this data. Please try again."
      action={onRetry ? { label: "Try Again", onClick: onRetry } : undefined}
    />
  );
}
