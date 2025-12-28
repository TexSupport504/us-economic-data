"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: string[];
  addFavorite: (seriesId: string) => void;
  removeFavorite: (seriesId: string) => void;
  toggleFavorite: (seriesId: string) => void;
  isFavorite: (seriesId: string) => boolean;
  reorderFavorites: (from: number, to: number) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (seriesId) =>
        set((state) => ({
          favorites: state.favorites.includes(seriesId)
            ? state.favorites
            : [...state.favorites, seriesId],
        })),

      removeFavorite: (seriesId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== seriesId),
        })),

      toggleFavorite: (seriesId) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.includes(seriesId)) {
          removeFavorite(seriesId);
        } else {
          addFavorite(seriesId);
        }
      },

      isFavorite: (seriesId) => get().favorites.includes(seriesId),

      reorderFavorites: (from, to) =>
        set((state) => {
          const newFavorites = [...state.favorites];
          const [removed] = newFavorites.splice(from, 1);
          newFavorites.splice(to, 0, removed);
          return { favorites: newFavorites };
        }),
    }),
    {
      name: "us-econ-favorites",
    }
  )
);
