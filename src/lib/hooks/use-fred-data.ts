"use client";

import useSWR from "swr";

interface FredDataPoint {
  date: string;
  value: number;
}

interface FredDataResponse {
  series: string;
  data: FredDataPoint[];
  latestValue: number;
  latestDate: string;
  yoyChange: number | null;
  momChange: number | null;
  seriesInfo?: {
    title: string;
    units: string;
    frequency: string;
  };
}

const fetcher = async (url: string): Promise<FredDataResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const multipleFetcher = async (url: string): Promise<Record<string, FredDataResponse>> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export function useFredData(
  seriesId: string,
  options: {
    years?: number;
    refreshInterval?: number;
  } = {}
) {
  const { years = 10, refreshInterval = 3600000 } = options; // Default: 10 years, refresh hourly

  const { data, error, isLoading, mutate } = useSWR<FredDataResponse>(
    `/api/fred/${seriesId}?years=${years}`,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );

  return {
    data: data?.data || [],
    latestValue: data?.latestValue,
    latestDate: data?.latestDate,
    yoyChange: data?.yoyChange,
    momChange: data?.momChange,
    seriesInfo: data?.seriesInfo,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

export function useMultipleFredSeries(
  seriesIds: string[],
  options: {
    years?: number;
    refreshInterval?: number;
  } = {}
) {
  const { years = 10, refreshInterval = 3600000 } = options;

  const key = seriesIds.length > 0 ? `/api/fred/multiple?series=${seriesIds.join(",")}&years=${years}` : null;

  const { data, error, isLoading, mutate } = useSWR<Record<string, FredDataResponse>>(
    key,
    key ? multipleFetcher : null,
    {
      refreshInterval,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data: data || {},
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
