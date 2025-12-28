"use client";

import { useState } from "react";
import { Percent, Info, TrendingUp, TrendingDown } from "lucide-react";
import { format, parseISO } from "date-fns";

import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AreaChart, LineChart, StatCard } from "@/components/charts";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
import { DataTable } from "@/components/ui/data-table";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";
import { MAToggle, type MovingAveragePeriod } from "@/components/ui/ma-toggle";
import { useFredData } from "@/lib/hooks/use-fred-data";
import { ContextBanner } from "@/components/ui/context-banner";
import { AIInsight } from "@/components/ui/ai-insight";
import { EducationalPanel } from "@/components/ui/educational-panel";
import { IndicatorRelationships } from "@/components/ui/indicator-relationships";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { PrintButton } from "@/components/ui/print-button";
import { ExportButton } from "@/components/ui/export-button";

const TIME_RANGES = [
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
];

export function RatesContent() {
  const [timeRange, setTimeRange] = useState("5");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [movingAverages, setMovingAverages] = useState<MovingAveragePeriod[]>([]);

  const fedfunds = useFredData("FEDFUNDS", { years: parseInt(timeRange) });
  const dgs10 = useFredData("DGS10", { years: parseInt(timeRange) });
  const dgs2 = useFredData("DGS2", { years: parseInt(timeRange) });
  const t10y2y = useFredData("T10Y2Y", { years: parseInt(timeRange) });

  return (
    <PageLayout
      title="Interest Rates"
      description="Federal Funds Rate, Treasury yields, and yield curve"
      icon={Percent}
      actions={
        <div className="flex items-center gap-2">
          {viewMode === "chart" && (
            <MAToggle value={movingAverages} onChange={setMovingAverages} />
          )}
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <ExportButton
            data={fedfunds.data}
            filename={`interest-rates-${timeRange}yr`}
            seriesName="Federal Funds Rate"
          />
          <PrintButton />
          <FavoriteButton seriesId="FEDFUNDS" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      {/* Educational Context Banner */}
      <ContextBanner seriesId="FEDFUNDS" className="mb-6" />

      {/* Key Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Fed Funds Rate"
          value={fedfunds.latestValue}
          change={fedfunds.yoyChange}
          changeLabel="YoY change"
          suffix="%"
          icon={Percent}
          description="Effective Federal Funds Rate"
          lastUpdated={fedfunds.latestDate ? format(parseISO(fedfunds.latestDate), "MMM d, yyyy") : undefined}
          isLoading={fedfunds.isLoading}
        />

        <StatCard
          title="10-Year Treasury"
          value={dgs10.latestValue}
          change={dgs10.yoyChange}
          changeLabel="YoY change"
          suffix="%"
          icon={TrendingUp}
          description="10-Year Treasury Constant Maturity"
          lastUpdated={dgs10.latestDate ? format(parseISO(dgs10.latestDate), "MMM d, yyyy") : undefined}
          isLoading={dgs10.isLoading}
        />

        <StatCard
          title="2-Year Treasury"
          value={dgs2.latestValue}
          change={dgs2.yoyChange}
          changeLabel="YoY change"
          suffix="%"
          icon={TrendingDown}
          description="2-Year Treasury Constant Maturity"
          lastUpdated={dgs2.latestDate ? format(parseISO(dgs2.latestDate), "MMM d, yyyy") : undefined}
          isLoading={dgs2.isLoading}
        />

        <StatCard
          title="10Y-2Y Spread"
          value={t10y2y.latestValue}
          change={t10y2y.momChange}
          changeLabel="MoM change"
          suffix="%"
          icon={t10y2y.latestValue && t10y2y.latestValue < 0 ? TrendingDown : TrendingUp}
          description={t10y2y.latestValue && t10y2y.latestValue < 0 ? "Yield curve inverted" : "Yield curve normal"}
          lastUpdated={t10y2y.latestDate ? format(parseISO(t10y2y.latestDate), "MMM d, yyyy") : undefined}
          isLoading={t10y2y.isLoading}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="fedfunds" className="space-y-6">
        <TabsList>
          <TabsTrigger value="fedfunds">Fed Funds</TabsTrigger>
          <TabsTrigger value="treasuries">Treasuries</TabsTrigger>
          <TabsTrigger value="spread">Yield Spread</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="fedfunds">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Effective Federal Funds Rate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            The federal funds rate is the interest rate banks charge each
                            other for overnight loans. It&apos;s the Fed&apos;s primary tool for
                            monetary policy.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Percent, Not Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">FEDFUNDS</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {fedfunds.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={fedfunds.data}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="fedfundsGradient"
                  formatValue={(v) => `${v.toFixed(2)}%`}
                  movingAverages={movingAverages}
                />
              ) : (
                <DataTable
                  data={fedfunds.data}
                  title="Fed Funds Rate"
                  formatValue={(v) => `${v.toFixed(2)}%`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treasuries">
          <Card>
            <CardHeader>
              <CardTitle>Treasury Yields</CardTitle>
              <CardDescription>10-Year and 2-Year Treasury Constant Maturity Rates</CardDescription>
            </CardHeader>
            <CardContent>
              {dgs10.isLoading || dgs2.isLoading ? (
                <ChartSkeleton height={400} type="line" />
              ) : (
                <LineChart
                  series={[
                    { id: "dgs10", name: "10-Year Treasury", data: dgs10.data, color: "var(--chart-1)" },
                    { id: "dgs2", name: "2-Year Treasury", data: dgs2.data, color: "var(--chart-2)" },
                  ]}
                  height={400}
                  formatValue={(v) => `${v.toFixed(2)}%`}
                  showLegend
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spread">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    10-Year Minus 2-Year Treasury Spread
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            A negative spread (yield curve inversion) has historically
                            preceded recessions. It indicates short-term rates are higher
                            than long-term rates.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Percent, Not Seasonally Adjusted</CardDescription>
                </div>
                {t10y2y.latestValue && t10y2y.latestValue < 0 && (
                  <Badge variant="destructive">Inverted</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {t10y2y.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={t10y2y.data}
                  height={400}
                  color="var(--chart-3)"
                  gradientId="t10y2yGradient"
                  formatValue={(v) => `${v.toFixed(2)}%`}
                  referenceLines={[
                    { value: 0, label: "0% (Flat)", color: "var(--warning)" },
                  ]}
                />
              ) : (
                <DataTable
                  data={t10y2y.data}
                  title="10Y-2Y Spread"
                  formatValue={(v) => `${v.toFixed(2)}%`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>All Rates Comparison</CardTitle>
              <CardDescription>Federal Funds Rate and Treasury Yields</CardDescription>
            </CardHeader>
            <CardContent>
              {fedfunds.isLoading || dgs10.isLoading || dgs2.isLoading ? (
                <ChartSkeleton height={400} type="line" />
              ) : (
                <LineChart
                  series={[
                    { id: "fedfunds", name: "Fed Funds Rate", data: fedfunds.data, color: "var(--chart-1)" },
                    { id: "dgs10", name: "10-Year Treasury", data: dgs10.data, color: "var(--chart-2)" },
                    { id: "dgs2", name: "2-Year Treasury", data: dgs2.data, color: "var(--chart-3)" },
                  ]}
                  height={400}
                  formatValue={(v) => `${v.toFixed(2)}%`}
                  showLegend
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Museum-Style Educational Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* AI Insight */}
        <AIInsight
          seriesId="FEDFUNDS"
          seriesName="Federal Funds Rate"
          currentValue={fedfunds.latestValue}
          change={fedfunds.yoyChange}
          className="lg:col-span-2"
        />

        {/* Related Indicators */}
        <IndicatorRelationships seriesId="FEDFUNDS" />
      </div>

      {/* Deep Dive Educational Panel - 10Y Treasury */}
      <div className="mt-6">
        <EducationalPanel
          seriesId="DGS10"
          currentValue={dgs10.latestValue}
          change={dgs10.yoyChange}
          compact
        />
      </div>
    </PageLayout>
  );
}
