"use client";

import { useState } from "react";
import { Banknote, TrendingUp, TrendingDown, Percent, Info, DollarSign } from "lucide-react";
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
import { ExportButton } from "@/components/ui/export-button";
import { useFredData } from "@/lib/hooks/use-fred-data";

const TIME_RANGES = [
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
  { value: "30", label: "30 Years" },
  { value: "50", label: "50 Years" },
];

export function DebtContent() {
  const [timeRange, setTimeRange] = useState("20");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [movingAverages, setMovingAverages] = useState<MovingAveragePeriod[]>([]);

  const totalDebt = useFredData("GFDEBTN", { years: parseInt(timeRange) });
  const debtToGdp = useFredData("GFDEGDQ188S", { years: parseInt(timeRange) });
  const deficit = useFredData("FYFSD", { years: parseInt(timeRange) });
  const interestPayments = useFredData("FDHBPIN", { years: parseInt(timeRange) });

  const isLoading = totalDebt.isLoading || debtToGdp.isLoading;

  return (
    <PageLayout
      title="Debt & Deficits"
      description="Federal debt, budget deficits, and interest payments"
      icon={Banknote}
      actions={
        <div className="flex items-center gap-2">
          {viewMode === "chart" && (
            <MAToggle value={movingAverages} onChange={setMovingAverages} />
          )}
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <ExportButton
            data={totalDebt.data}
            filename={`federal-debt-${timeRange}yr`}
            seriesName="Federal Debt"
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
          title="Federal Debt"
          value={totalDebt.latestValue ? totalDebt.latestValue / 1000000 : undefined}
          change={totalDebt.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="T"
          icon={Banknote}
          description="Total public debt"
          lastUpdated={totalDebt.latestDate ? format(parseISO(totalDebt.latestDate), "MMM d, yyyy") : undefined}
          isLoading={totalDebt.isLoading}
          invertColors
        />

        <StatCard
          title="Debt-to-GDP"
          value={debtToGdp.latestValue}
          change={debtToGdp.yoyChange}
          changeLabel="YoY change"
          suffix="%"
          icon={Percent}
          description="Federal debt as % of GDP"
          lastUpdated={debtToGdp.latestDate ? format(parseISO(debtToGdp.latestDate), "MMM d, yyyy") : undefined}
          isLoading={debtToGdp.isLoading}
          invertColors
        />

        <StatCard
          title="Budget Surplus/Deficit"
          value={deficit.latestValue ? deficit.latestValue / 1000 : undefined}
          change={deficit.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="T"
          icon={deficit.latestValue && deficit.latestValue < 0 ? TrendingDown : TrendingUp}
          description={deficit.latestValue && deficit.latestValue < 0 ? "Annual deficit" : "Annual surplus"}
          lastUpdated={deficit.latestDate ? format(parseISO(deficit.latestDate), "MMM d, yyyy") : undefined}
          isLoading={deficit.isLoading}
        />

        <StatCard
          title="Interest Payments"
          value={interestPayments.latestValue}
          change={interestPayments.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="B"
          icon={DollarSign}
          description="Interest on federal debt"
          lastUpdated={interestPayments.latestDate ? format(parseISO(interestPayments.latestDate), "MMM d, yyyy") : undefined}
          isLoading={interestPayments.isLoading}
          invertColors
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="debt" className="space-y-6">
        <TabsList>
          <TabsTrigger value="debt">Total Debt</TabsTrigger>
          <TabsTrigger value="ratio">Debt-to-GDP</TabsTrigger>
          <TabsTrigger value="deficit">Deficit</TabsTrigger>
          <TabsTrigger value="interest">Interest</TabsTrigger>
        </TabsList>

        <TabsContent value="debt">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Federal Debt: Total Public
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Total federal debt outstanding includes debt held by the public
                            and intragovernmental holdings (like Social Security trust funds).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Millions of Dollars, Not Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">GFDEBTN</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {totalDebt.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={totalDebt.data}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="totalDebtGradient"
                  formatValue={(v) => `$${(v / 1000000).toFixed(1)}T`}
                  movingAverages={movingAverages}
                />
              ) : (
                <DataTable
                  data={totalDebt.data}
                  title="Federal Debt"
                  formatValue={(v) => `$${(v / 1000000).toFixed(1)}T`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratio">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Federal Debt to GDP Ratio
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            This ratio shows federal debt as a percentage of GDP.
                            Higher ratios indicate greater debt burden relative to
                            economic output. 100%+ is often considered a warning threshold.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Percent of GDP</CardDescription>
                </div>
                <Badge variant="secondary">GFDEGDQ188S</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {debtToGdp.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={debtToGdp.data}
                  height={400}
                  color="var(--chart-2)"
                  gradientId="debtToGdpGradient"
                  formatValue={(v) => `${v.toFixed(0)}%`}
                  referenceLines={[
                    { value: 100, label: "100% of GDP", color: "var(--warning)" },
                  ]}
                />
              ) : (
                <DataTable
                  data={debtToGdp.data}
                  title="Debt-to-GDP"
                  formatValue={(v) => `${v.toFixed(0)}%`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deficit">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Federal Surplus or Deficit
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            The annual federal budget balance. Negative values indicate
                            a deficit (spending exceeds revenue), positive values
                            indicate a surplus.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Millions of Dollars, Fiscal Year</CardDescription>
                </div>
                <Badge variant="secondary">FYFSD</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {deficit.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={deficit.data}
                  height={400}
                  color="var(--chart-3)"
                  gradientId="deficitGradient"
                  formatValue={(v) => `$${(v / 1000).toFixed(1)}T`}
                  referenceLines={[
                    { value: 0, label: "Balanced", color: "var(--muted-foreground)" },
                  ]}
                />
              ) : (
                <DataTable
                  data={deficit.data}
                  title="Budget Surplus/Deficit"
                  formatValue={(v) => `$${(v / 1000).toFixed(1)}T`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interest">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Interest Payments on Federal Debt
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Annual interest payments on the federal debt. As debt grows
                            and interest rates rise, these payments consume an
                            increasing share of the federal budget.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Billions of Dollars</CardDescription>
                </div>
                <Badge variant="secondary">FDHBPIN</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {interestPayments.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={interestPayments.data}
                  height={400}
                  color="var(--chart-4)"
                  gradientId="interestGradient"
                  formatValue={(v) => `$${v.toFixed(0)}B`}
                />
              ) : (
                <DataTable
                  data={interestPayments.data}
                  title="Interest Payments"
                  formatValue={(v) => `$${v.toFixed(0)}B`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Section */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Debt Ceiling</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Congress sets a statutory limit on federal borrowing. Reaching this
              limit requires congressional action to raise or suspend it, often
              leading to political negotiations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deficit vs Debt</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              The deficit is the annual shortfall (spending minus revenue).
              The debt is the cumulative total of all past deficits. Each year
              of deficit adds to the total debt.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sustainability</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Debt sustainability depends on interest rates relative to GDP growth.
              If GDP grows faster than interest costs, debt becomes more manageable
              over time.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
