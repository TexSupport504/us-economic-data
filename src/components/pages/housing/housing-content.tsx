"use client";

import { useState } from "react";
import { Home, TrendingUp, Building, Percent, Info } from "lucide-react";
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
import { useFredData } from "@/lib/hooks/use-fred-data";

const TIME_RANGES = [
  { value: "2", label: "2 Years" },
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
];

export function HousingContent() {
  const [timeRange, setTimeRange] = useState("10");

  const caseShiller = useFredData("CSUSHPISA", { years: parseInt(timeRange) });
  const housingStarts = useFredData("HOUST", { years: parseInt(timeRange) });
  const permits = useFredData("PERMIT", { years: parseInt(timeRange) });
  const mortgage = useFredData("MORTGAGE30US", { years: parseInt(timeRange) });

  return (
    <PageLayout
      title="Housing"
      description="Home prices, housing starts, and mortgage rates"
      icon={Home}
      actions={
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
      }
    >
      {/* Key Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Home Price Index"
          value={caseShiller.latestValue}
          change={caseShiller.yoyChange}
          changeLabel="YoY change"
          icon={TrendingUp}
          description="Case-Shiller US National Index"
          lastUpdated={caseShiller.latestDate ? format(parseISO(caseShiller.latestDate), "MMM d, yyyy") : undefined}
          isLoading={caseShiller.isLoading}
        />

        <StatCard
          title="Housing Starts"
          value={housingStarts.latestValue}
          change={housingStarts.yoyChange}
          changeLabel="YoY change"
          suffix="K"
          icon={Building}
          description="Thousands of units, SAAR"
          lastUpdated={housingStarts.latestDate ? format(parseISO(housingStarts.latestDate), "MMM d, yyyy") : undefined}
          isLoading={housingStarts.isLoading}
        />

        <StatCard
          title="Building Permits"
          value={permits.latestValue}
          change={permits.yoyChange}
          changeLabel="YoY change"
          suffix="K"
          icon={Home}
          description="Thousands of units, SAAR"
          lastUpdated={permits.latestDate ? format(parseISO(permits.latestDate), "MMM d, yyyy") : undefined}
          isLoading={permits.isLoading}
        />

        <StatCard
          title="30-Year Mortgage"
          value={mortgage.latestValue}
          change={mortgage.yoyChange}
          changeLabel="YoY change"
          suffix="%"
          icon={Percent}
          description="Fixed rate mortgage average"
          lastUpdated={mortgage.latestDate ? format(parseISO(mortgage.latestDate), "MMM d, yyyy") : undefined}
          isLoading={mortgage.isLoading}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="prices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="prices">Home Prices</TabsTrigger>
          <TabsTrigger value="construction">Construction</TabsTrigger>
          <TabsTrigger value="mortgage">Mortgage Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="prices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Case-Shiller Home Price Index
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            The S&P/Case-Shiller index measures home prices in 20 major
                            metropolitan areas. An index of 100 represents prices in
                            January 2000.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>US National Home Price Index, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">CSUSHPISA</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {caseShiller.isLoading ? (
                <ChartSkeleton height={400} />
              ) : (
                <AreaChart
                  data={caseShiller.data}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="caseShillerGradient"
                  formatValue={(v) => v.toFixed(1)}
                  referenceLines={[
                    { value: 100, label: "Jan 2000 = 100", color: "var(--muted-foreground)" },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="construction">
          <Card>
            <CardHeader>
              <CardTitle>Housing Starts & Building Permits</CardTitle>
              <CardDescription>Thousands of Units, Seasonally Adjusted Annual Rate</CardDescription>
            </CardHeader>
            <CardContent>
              {housingStarts.isLoading || permits.isLoading ? (
                <ChartSkeleton height={400} type="line" />
              ) : (
                <LineChart
                  series={[
                    { id: "starts", name: "Housing Starts", data: housingStarts.data, color: "var(--chart-1)" },
                    { id: "permits", name: "Building Permits", data: permits.data, color: "var(--chart-2)" },
                  ]}
                  height={400}
                  formatValue={(v) => `${v.toFixed(0)}K`}
                  showLegend
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mortgage">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>30-Year Fixed Mortgage Rate</CardTitle>
                  <CardDescription>US Weekly Average, Not Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">MORTGAGE30US</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {mortgage.isLoading ? (
                <ChartSkeleton height={400} />
              ) : (
                <AreaChart
                  data={mortgage.data}
                  height={400}
                  color="var(--chart-3)"
                  gradientId="mortgageGradient"
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
