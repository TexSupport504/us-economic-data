import { NextRequest, NextResponse } from "next/server";
import { subYears } from "date-fns";
import fredAPI from "@/lib/api/fred";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ series: string }> }
) {
  try {
    const { series } = await params;
    const searchParams = request.nextUrl.searchParams;
    const years = parseInt(searchParams.get("years") || "10", 10);

    const startDate = subYears(new Date(), years);

    const [observations, seriesInfo] = await Promise.all([
      fredAPI.getSeriesObservations(series, {
        startDate,
        sortOrder: "asc",
      }),
      fredAPI.getSeriesInfo(series),
    ]);

    if (observations.length === 0) {
      return NextResponse.json(
        { error: "No data found for series" },
        { status: 404 }
      );
    }

    // Transform to numbers
    const data = observations.map((obs) => ({
      date: obs.date,
      value: parseFloat(obs.value),
    }));

    const latestValue = data[data.length - 1]?.value;
    const latestDate = data[data.length - 1]?.date;

    // Calculate changes using the API helper
    const yoyChange = fredAPI.calculateYoYChange(observations);
    const momChange = fredAPI.calculateMoMChange(observations);

    return NextResponse.json({
      series,
      data,
      latestValue,
      latestDate,
      yoyChange,
      momChange,
      seriesInfo: seriesInfo ? {
        title: seriesInfo.title,
        units: seriesInfo.units,
        frequency: seriesInfo.frequency,
      } : undefined,
    });
  } catch (error) {
    console.error("FRED API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from FRED" },
      { status: 500 }
    );
  }
}
