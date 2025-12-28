"use client";

import { useState } from "react";
import { TrendingUp, Info } from "lucide-react";
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

const TIME_RANGES = [
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
  { value: "30", label: "30 Years" },
];

export function GDPContent() {
  const [timeRange, setTimeRange] = useState("10");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [movingAverages, setMovingAverages] = useState<MovingAveragePeriod[]>([]);

  const gdp = useFredData("GDP", { years: parseInt(timeRange) });
  const realGdp = useFredData("GDPC1", { years: parseInt(timeRange) });
  const gdpGrowth = useFredData("A191RL1Q225SBEA", { years: parseInt(timeRange) });

  return (
    <PageLayout
      title="GDP & Economic Growth"
      description="Gross Domestic Product and economic output metrics"
      icon={TrendingUp}
      actions={
        <div className="flex items-center gap-2">
          {viewMode === "chart" && (
            <MAToggle value={movingAverages} onChange={setMovingAverages} />
          )}
          <ViewToggle value={viewMode} onChange={setViewMode} />
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
      {/* Key Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard
          title="Nominal GDP"
          value={gdp.latestValue ? gdp.latestValue / 1000 : undefined}
          change={gdp.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="T"
          icon={TrendingUp}
          description="Total value of goods and services"
          lastUpdated={gdp.latestDate ? format(parseISO(gdp.latestDate), "MMM d, yyyy") : undefined}
          isLoading={gdp.isLoading}
        />

        <StatCard
          title="Real GDP"
          value={realGdp.latestValue ? realGdp.latestValue / 1000 : undefined}
          change={realGdp.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="T"
          icon={TrendingUp}
          description="Inflation-adjusted GDP"
          lastUpdated={realGdp.latestDate ? format(parseISO(realGdp.latestDate), "MMM d, yyyy") : undefined}
          isLoading={realGdp.isLoading}
        />

        <StatCard
          title="GDP Growth Rate"
          value={gdpGrowth.latestValue}
          change={gdpGrowth.momChange}
          changeLabel="vs prior quarter"
          suffix="%"
          icon={TrendingUp}
          description="Quarterly annualized growth"
          lastUpdated={gdpGrowth.latestDate ? format(parseISO(gdpGrowth.latestDate), "MMM d, yyyy") : undefined}
          isLoading={gdpGrowth.isLoading}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="real" className="space-y-6">
        <TabsList>
          <TabsTrigger value="real">Real GDP</TabsTrigger>
          <TabsTrigger value="nominal">Nominal GDP</TabsTrigger>
          <TabsTrigger value="growth">Growth Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="real">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Real Gross Domestic Product
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Real GDP is adjusted for inflation and measures the actual
                            growth in economic output. It&apos;s the primary measure of
                            economic growth.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Trillions of Chained 2017 Dollars, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">GDPC1</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {realGdp.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={realGdp.data}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="realGdpGradient"
                  formatValue={(v) => `$${(v / 1000).toFixed(1)}T`}
                  movingAverages={movingAverages}
                />
              ) : (
                <DataTable
                  data={realGdp.data}
                  title="Real GDP"
                  formatValue={(v) => `$${(v / 1000).toFixed(2)}T`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nominal">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Nominal GDP</CardTitle>
                  <CardDescription>Trillions of Dollars, Seasonally Adjusted Annual Rate</CardDescription>
                </div>
                <Badge variant="secondary">GDP</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {gdp.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={gdp.data}
                  height={400}
                  color="var(--chart-2)"
                  gradientId="nominalGdpGradient"
                  formatValue={(v) => `$${(v / 1000).toFixed(1)}T`}
                  movingAverages={movingAverages}
                />
              ) : (
                <DataTable
                  data={gdp.data}
                  title="Nominal GDP"
                  formatValue={(v) => `$${(v / 1000).toFixed(2)}T`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Real GDP Growth Rate</CardTitle>
                  <CardDescription>Percent Change from Preceding Period, Seasonally Adjusted Annual Rate</CardDescription>
                </div>
                <Badge variant="secondary">A191RL1Q225SBEA</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {gdpGrowth.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={gdpGrowth.data}
                  height={400}
                  color="var(--chart-3)"
                  gradientId="gdpGrowthGradient"
                  formatValue={(v) => `${v.toFixed(1)}%`}
                  referenceLines={[
                    { value: 0, label: "0%", color: "var(--muted-foreground)" },
                    { value: 2, label: "2% Trend", color: "var(--warning)" },
                  ]}
                  movingAverages={movingAverages}
                />
              ) : (
                <DataTable
                  data={gdpGrowth.data}
                  title="Growth Rate"
                  formatValue={(v) => `${v.toFixed(2)}%`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
