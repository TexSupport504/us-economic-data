"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Alert {
  id: string;
  seriesId: string;
  seriesName: string;
  condition: "above" | "below";
  threshold: number;
  isTriggered: boolean;
  lastChecked?: string;
  lastValue?: number;
}

interface AlertsState {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id" | "isTriggered">) => void;
  removeAlert: (id: string) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  checkAlert: (id: string, currentValue: number) => boolean;
  getTriggeredAlerts: () => Alert[];
  clearTriggered: () => void;
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],

      addAlert: (alert) =>
        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              ...alert,
              id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              isTriggered: false,
            },
          ],
        })),

      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        })),

      updateAlert: (id, updates) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        })),

      checkAlert: (id, currentValue) => {
        const { alerts, updateAlert } = get();
        const alert = alerts.find((a) => a.id === id);

        if (!alert) return false;

        const isTriggered =
          alert.condition === "above"
            ? currentValue > alert.threshold
            : currentValue < alert.threshold;

        updateAlert(id, {
          isTriggered,
          lastChecked: new Date().toISOString(),
          lastValue: currentValue,
        });

        return isTriggered;
      },

      getTriggeredAlerts: () => get().alerts.filter((alert) => alert.isTriggered),

      clearTriggered: () =>
        set((state) => ({
          alerts: state.alerts.map((alert) => ({
            ...alert,
            isTriggered: false,
          })),
        })),
    }),
    {
      name: "us-econ-alerts",
    }
  )
);
