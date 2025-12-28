import { NextRequest, NextResponse } from "next/server";
import { subYears } from "date-fns";
import fredAPI from "@/lib/api/fred";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seriesParam = searchParams.get("series");
    const years = parseInt(searchParams.get("years") || "10", 10);

    if (!seriesParam) {
      return NextResponse.json(
        { error: "Series parameter is required" },
        { status: 400 }
      );
    }

    const seriesIds = seriesParam.split(",").filter(Boolean);
    const startDate = subYears(new Date(), years);

    const results = await Promise.all(
      seriesIds.map(async (series) => {
        const [observations, seriesInfo] = await Promise.all([
          fredAPI.getSeriesObservations(series, {
            startDate,
            sortOrder: "asc",
          }),
          fredAPI.getSeriesInfo(series),
        ]);

        if (observations.length === 0) {
          return { series, data: null };
        }

        const data = observations.map((obs) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }));

        const latestValue = data[data.length - 1]?.value;
        const latestDate = data[data.length - 1]?.date;

        return {
          series,
          data: {
            series,
            data,
            latestValue,
            latestDate,
            yoyChange: fredAPI.calculateYoYChange(observations),
            momChange: fredAPI.calculateMoMChange(observations),
            seriesInfo: seriesInfo ? {
              title: seriesInfo.title,
              units: seriesInfo.units,
              frequency: seriesInfo.frequency,
            } : undefined,
          },
        };
      })
    );

    const response = results.reduce(
      (acc, { series, data }) => {
        if (data) acc[series] = data;
        return acc;
      },
      {} as Record<string, unknown>
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("FRED API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from FRED" },
      { status: 500 }
    );
  }
}
