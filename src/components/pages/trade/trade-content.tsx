"use client";

import { useState } from "react";
import { Ship, TrendingDown, TrendingUp, ArrowUpDown, Info } from "lucide-react";
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
import { ExportButton } from "@/components/ui/export-button";
import { useFredData } from "@/lib/hooks/use-fred-data";

const TIME_RANGES = [
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
  { value: "30", label: "30 Years" },
];

export function TradeContent() {
  const [timeRange, setTimeRange] = useState("10");

  const tradeBalance = useFredData("BOPGSTB", { years: parseInt(timeRange) });
  const exports = useFredData("BOPTEXP", { years: parseInt(timeRange) });
  const imports = useFredData("BOPTIMP", { years: parseInt(timeRange) });
  const netExports = useFredData("NETEXP", { years: parseInt(timeRange) });

  const isLoading = tradeBalance.isLoading || exports.isLoading || imports.isLoading;

  return (
    <PageLayout
      title="Trade"
      description="International trade balance, imports, and exports"
      icon={Ship}
      actions={
        <div className="flex items-center gap-2">
          <ExportButton
            data={tradeBalance.data}
            filename={`trade-balance-${timeRange}yr`}
            seriesName="Trade Balance"
          />
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
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Trade Balance"
          value={tradeBalance.latestValue}
          change={tradeBalance.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="B"
          icon={tradeBalance.latestValue && tradeBalance.latestValue < 0 ? TrendingDown : TrendingUp}
          description={tradeBalance.latestValue && tradeBalance.latestValue < 0 ? "Trade deficit" : "Trade surplus"}
          lastUpdated={tradeBalance.latestDate ? format(parseISO(tradeBalance.latestDate), "MMM d, yyyy") : undefined}
          isLoading={tradeBalance.isLoading}
        />

        <StatCard
          title="Exports"
          value={exports.latestValue}
          change={exports.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="B"
          icon={TrendingUp}
          description="Total goods & services exported"
          lastUpdated={exports.latestDate ? format(parseISO(exports.latestDate), "MMM d, yyyy") : undefined}
          isLoading={exports.isLoading}
        />

        <StatCard
          title="Imports"
          value={imports.latestValue}
          change={imports.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="B"
          icon={TrendingDown}
          description="Total goods & services imported"
          lastUpdated={imports.latestDate ? format(parseISO(imports.latestDate), "MMM d, yyyy") : undefined}
          isLoading={imports.isLoading}
          invertColors
        />

        <StatCard
          title="Net Exports (GDP)"
          value={netExports.latestValue}
          change={netExports.momChange}
          changeLabel="vs prior quarter"
          prefix="$"
          suffix="B"
          icon={ArrowUpDown}
          description="Net exports contribution to GDP"
          lastUpdated={netExports.latestDate ? format(parseISO(netExports.latestDate), "MMM d, yyyy") : undefined}
          isLoading={netExports.isLoading}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="balance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="balance">Trade Balance</TabsTrigger>
          <TabsTrigger value="flows">Imports & Exports</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Trade Balance
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            The trade balance measures the difference between exports and
                            imports. A negative value indicates a trade deficit (imports
                            exceed exports).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Billions of Dollars, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">BOPGSTB</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {tradeBalance.isLoading ? (
                <ChartSkeleton height={400} />
              ) : (
                <AreaChart
                  data={tradeBalance.data}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="tradeBalanceGradient"
                  formatValue={(v) => `$${v.toFixed(0)}B`}
                  referenceLines={[
                    { value: 0, label: "Balance", color: "var(--muted-foreground)" },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Exports</CardTitle>
                    <CardDescription>Billions of Dollars</CardDescription>
                  </div>
                  <Badge variant="secondary">BOPTEXP</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {exports.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : (
                  <AreaChart
                    data={exports.data}
                    height={300}
                    color="var(--positive)"
                    gradientId="exportsGradient"
                    formatValue={(v) => `$${v.toFixed(0)}B`}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Imports</CardTitle>
                    <CardDescription>Billions of Dollars</CardDescription>
                  </div>
                  <Badge variant="secondary">BOPTIMP</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {imports.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : (
                  <AreaChart
                    data={imports.data}
                    height={300}
                    color="var(--negative)"
                    gradientId="importsGradient"
                    formatValue={(v) => `$${v.toFixed(0)}B`}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Imports vs Exports</CardTitle>
              <CardDescription>Billions of Dollars, Seasonally Adjusted</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ChartSkeleton height={400} type="line" />
              ) : (
                <LineChart
                  series={[
                    { id: "exports", name: "Exports", data: exports.data, color: "var(--positive)" },
                    { id: "imports", name: "Imports", data: imports.data, color: "var(--negative)" },
                  ]}
                  height={400}
                  formatValue={(v) => `$${v.toFixed(0)}B`}
                  showLegend
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Section */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trade Deficit</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              The US has run a trade deficit since the 1970s, meaning it imports more
              than it exports. This reflects strong consumer demand and the dollar&apos;s
              role as the global reserve currency.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Impact on GDP</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Net exports (exports minus imports) are a component of GDP. A trade
              deficit subtracts from GDP growth, while a surplus adds to it. However,
              imports also reflect domestic economic strength.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
