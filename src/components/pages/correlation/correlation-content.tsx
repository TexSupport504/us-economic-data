"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GitCompare, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "@/components/charts";
import { useFredData } from "@/lib/hooks/use-fred-data";
import { FRED_SERIES } from "@/lib/api/fred";

// Popular series for correlation analysis
const CORRELATION_SERIES = [
  { id: "CPIAUCSL", name: "CPI Inflation", group: "Prices" },
  { id: "FEDFUNDS", name: "Fed Funds Rate", group: "Rates" },
  { id: "DGS10", name: "10-Year Treasury", group: "Rates" },
  { id: "UNRATE", name: "Unemployment Rate", group: "Employment" },
  { id: "GDPC1", name: "Real GDP", group: "Growth" },
  { id: "CSUSHPISA", name: "Home Prices", group: "Housing" },
  { id: "MORTGAGE30US", name: "30-Year Mortgage", group: "Housing" },
  { id: "UMCSENT", name: "Consumer Sentiment", group: "Consumer" },
  { id: "SP500", name: "S&P 500", group: "Markets" },
  { id: "VIXCLS", name: "VIX Volatility", group: "Markets" },
  { id: "T10Y2Y", name: "Yield Curve (10Y-2Y)", group: "Rates" },
  { id: "PAYEMS", name: "Nonfarm Payrolls", group: "Employment" },
];

// Calculate Pearson correlation coefficient
function calculateCorrelation(data1: number[], data2: number[]): number {
  if (data1.length !== data2.length || data1.length === 0) return 0;

  const n = data1.length;
  const sum1 = data1.reduce((a, b) => a + b, 0);
  const sum2 = data2.reduce((a, b) => a + b, 0);
  const sum1Sq = data1.reduce((a, b) => a + b * b, 0);
  const sum2Sq = data2.reduce((a, b) => a + b * b, 0);
  const pSum = data1.reduce((total, val, i) => total + val * data2[i], 0);

  const num = pSum - (sum1 * sum2) / n;
  const den = Math.sqrt(
    (sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n)
  );

  if (den === 0) return 0;
  return num / den;
}

// Interpret correlation strength
function getCorrelationInterpretation(r: number): {
  strength: string;
  color: string;
  description: string;
} {
  const absR = Math.abs(r);
  if (absR >= 0.8) {
    return {
      strength: r > 0 ? "Strong Positive" : "Strong Negative",
      color: r > 0 ? "text-positive" : "text-negative",
      description: "These indicators move closely together",
    };
  }
  if (absR >= 0.5) {
    return {
      strength: r > 0 ? "Moderate Positive" : "Moderate Negative",
      color: r > 0 ? "text-chart-2" : "text-chart-5",
      description: "These indicators show some relationship",
    };
  }
  if (absR >= 0.3) {
    return {
      strength: r > 0 ? "Weak Positive" : "Weak Negative",
      color: "text-muted-foreground",
      description: "These indicators show a slight relationship",
    };
  }
  return {
    strength: "No Correlation",
    color: "text-muted-foreground",
    description: "These indicators move independently",
  };
}

export function CorrelationContent() {
  const [series1, setSeries1] = useState("CPIAUCSL");
  const [series2, setSeries2] = useState("FEDFUNDS");
  const [timeRange, setTimeRange] = useState(10);

  const { data: data1, isLoading: loading1 } = useFredData(series1, { years: timeRange });
  const { data: data2, isLoading: loading2 } = useFredData(series2, { years: timeRange });

  const series1Info = FRED_SERIES[series1 as keyof typeof FRED_SERIES];
  const series2Info = FRED_SERIES[series2 as keyof typeof FRED_SERIES];

  // Merge data by date for correlation calculation
  const { mergedData, correlation } = useMemo(() => {
    if (data1.length === 0 || data2.length === 0) {
      return { mergedData: [], correlation: 0 };
    }

    // Create a map of dates to values for series 2
    const data2Map = new Map(data2.map((d) => [d.date, d.value]));

    // Find matching dates
    const merged: { date: string; value1: number; value2: number }[] = [];
    for (const d1 of data1) {
      const v2 = data2Map.get(d1.date);
      if (v2 !== undefined) {
        merged.push({ date: d1.date, value1: d1.value, value2: v2 });
      }
    }

    // Calculate correlation on matching data
    const values1 = merged.map((d) => d.value1);
    const values2 = merged.map((d) => d.value2);
    const r = calculateCorrelation(values1, values2);

    return { mergedData: merged, correlation: r };
  }, [data1, data2]);

  const interpretation = getCorrelationInterpretation(correlation);
  const isLoading = loading1 || loading2;

  // Prepare chart data
  const chartSeries = useMemo(() => {
    if (mergedData.length === 0) return [];

    return [
      {
        id: series1,
        name: series1Info?.name || series1,
        data: mergedData.map((d) => ({ date: d.date, value: d.value1 })),
        color: "var(--chart-1)",
      },
      {
        id: series2,
        name: series2Info?.name || series2,
        data: mergedData.map((d) => ({ date: d.date, value: d.value2 })),
        color: "var(--chart-2)",
      },
    ];
  }, [mergedData, series1, series2, series1Info, series2Info]);

  const CorrelationIcon =
    correlation > 0.3 ? TrendingUp : correlation < -0.3 ? TrendingDown : Minus;

  return (
    <PageLayout
      title="Correlation Analysis"
      description="Compare two economic indicators and analyze their relationship"
      icon={GitCompare}
    >
      <div className="grid gap-6">
        {/* Series Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Indicators</CardTitle>
            <CardDescription>
              Choose two economic indicators to compare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-muted-foreground mb-1 block">
                  First Indicator
                </label>
                <Select value={series1} onValueChange={setSeries1}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CORRELATION_SERIES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {s.group}
                          </Badge>
                          {s.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Second Indicator
                </label>
                <Select value={series2} onValueChange={setSeries2}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CORRELATION_SERIES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <span className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {s.group}
                          </Badge>
                          {s.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32">
                <label className="text-sm text-muted-foreground mb-1 block">
                  Time Range
                </label>
                <Select
                  value={timeRange.toString()}
                  onValueChange={(v) => setTimeRange(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                    <SelectItem value="10">10 Years</SelectItem>
                    <SelectItem value="20">20 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Correlation Result */}
        <motion.div
          key={`${series1}-${series2}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CorrelationIcon className={`h-5 w-5 ${interpretation.color}`} />
                    Correlation Coefficient
                  </CardTitle>
                  <CardDescription>
                    {interpretation.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold tabular-nums ${interpretation.color}`}>
                    {isLoading ? "..." : correlation.toFixed(3)}
                  </div>
                  <Badge className={interpretation.color}>
                    {interpretation.strength}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">Data Points</div>
                  <div className="text-xl font-semibold">{mergedData.length}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">R-Squared</div>
                  <div className="text-xl font-semibold">
                    {(correlation * correlation).toFixed(3)}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">Direction</div>
                  <div className="text-xl font-semibold">
                    {correlation > 0 ? "Same" : correlation < 0 ? "Opposite" : "None"}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">Confidence</div>
                  <div className="text-xl font-semibold">
                    {Math.abs(correlation) >= 0.5 ? "High" : Math.abs(correlation) >= 0.3 ? "Medium" : "Low"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dual-Axis Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Comparison</CardTitle>
            <CardDescription>
              Dual-axis chart showing both indicators over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <span className="text-muted-foreground">Loading data...</span>
              </div>
            ) : chartSeries.length > 0 ? (
              <LineChart
                series={chartSeries}
                height={400}
                animated
                showRecessions
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <span className="text-muted-foreground">No matching data found</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interpretation Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Understanding Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Correlation Scale</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-20 font-mono text-positive">+0.8 to +1.0</span>
                    <span>Strong Positive - Move together</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 font-mono text-chart-2">+0.5 to +0.8</span>
                    <span>Moderate Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 font-mono text-muted-foreground">-0.5 to +0.5</span>
                    <span>Weak or No Correlation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 font-mono text-chart-5">-0.8 to -0.5</span>
                    <span>Moderate Negative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 font-mono text-negative">-1.0 to -0.8</span>
                    <span>Strong Negative - Move opposite</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Important Notes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Correlation does not imply causation</li>
                  <li>• Relationships may change over different time periods</li>
                  <li>• Consider lagging effects between indicators</li>
                  <li>• External factors may influence both series</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
