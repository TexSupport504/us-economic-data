"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/lib/stores/favorites-store";

interface FavoriteButtonProps {
  seriesId: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "ghost" | "outline" | "default";
  className?: string;
}

export function FavoriteButton({
  seriesId,
  size = "icon",
  variant = "ghost",
  className,
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isFav = isFavorite(seriesId);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(seriesId);
      }}
      className={cn(
        "transition-all",
        isFav && "text-warning",
        className
      )}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-all",
          isFav && "fill-warning"
        )}
      />
    </Button>
  );
}
