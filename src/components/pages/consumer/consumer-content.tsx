"use client";

import { useState } from "react";
import { ShoppingCart, TrendingUp, Wallet, CreditCard, Info } from "lucide-react";
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
import { AreaChart, StatCard } from "@/components/charts";
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
  { value: "2", label: "2 Years" },
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
];

export function ConsumerContent() {
  const [timeRange, setTimeRange] = useState("10");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [movingAverages, setMovingAverages] = useState<MovingAveragePeriod[]>([]);

  const sentiment = useFredData("UMCSENT", { years: parseInt(timeRange) });
  const pce = useFredData("PCE", { years: parseInt(timeRange) });
  const savingsRate = useFredData("PSAVERT", { years: parseInt(timeRange) });
  const consumerCredit = useFredData("TOTALSL", { years: parseInt(timeRange) });

  return (
    <PageLayout
      title="Consumer"
      description="Consumer sentiment, spending, and credit metrics"
      icon={ShoppingCart}
      actions={
        <div className="flex items-center gap-2">
          {viewMode === "chart" && (
            <MAToggle value={movingAverages} onChange={setMovingAverages} />
          )}
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <ExportButton
            data={sentiment.data}
            filename={`consumer-data-${timeRange}yr`}
            seriesName="Consumer Sentiment"
          />
          <PrintButton />
          <FavoriteButton seriesId="UMCSENT" />
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
      <ContextBanner seriesId="UMCSENT" className="mb-6" />

      {/* Key Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Consumer Sentiment"
          value={sentiment.latestValue}
          change={sentiment.yoyChange}
          changeLabel="YoY change"
          icon={TrendingUp}
          description="University of Michigan Index"
          lastUpdated={sentiment.latestDate ? format(parseISO(sentiment.latestDate), "MMM d, yyyy") : undefined}
          isLoading={sentiment.isLoading}
        />

        <StatCard
          title="Personal Spending"
          value={pce.latestValue ? pce.latestValue / 1000 : undefined}
          change={pce.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="T"
          icon={ShoppingCart}
          description="Personal Consumption Expenditures"
          lastUpdated={pce.latestDate ? format(parseISO(pce.latestDate), "MMM d, yyyy") : undefined}
          isLoading={pce.isLoading}
        />

        <StatCard
          title="Savings Rate"
          value={savingsRate.latestValue}
          change={savingsRate.yoyChange}
          changeLabel="YoY change"
          suffix="%"
          icon={Wallet}
          description="Personal saving as % of income"
          lastUpdated={savingsRate.latestDate ? format(parseISO(savingsRate.latestDate), "MMM d, yyyy") : undefined}
          isLoading={savingsRate.isLoading}
        />

        <StatCard
          title="Consumer Credit"
          value={consumerCredit.latestValue ? consumerCredit.latestValue / 1000 : undefined}
          change={consumerCredit.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="T"
          icon={CreditCard}
          description="Total consumer credit outstanding"
          lastUpdated={consumerCredit.latestDate ? format(parseISO(consumerCredit.latestDate), "MMM d, yyyy") : undefined}
          isLoading={consumerCredit.isLoading}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="sentiment" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Consumer Sentiment Index
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            The University of Michigan Consumer Sentiment Index measures
                            consumer confidence based on surveys about personal finances
                            and business conditions.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>University of Michigan, Index 1966:Q1=100</CardDescription>
                </div>
                <Badge variant="secondary">UMCSENT</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {sentiment.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={sentiment.data}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="sentimentGradient"
                  formatValue={(v) => v.toFixed(1)}
                  referenceLines={[
                    { value: 100, label: "Baseline (100)", color: "var(--muted-foreground)" },
                  ]}
                  movingAverages={movingAverages}
                />
              ) : (
                <DataTable
                  data={sentiment.data}
                  title="Consumer Sentiment"
                  formatValue={(v) => v.toFixed(1)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spending">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Consumption Expenditures</CardTitle>
                  <CardDescription>Billions of Dollars, Seasonally Adjusted Annual Rate</CardDescription>
                </div>
                <Badge variant="secondary">PCE</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pce.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={pce.data}
                  height={400}
                  color="var(--chart-2)"
                  gradientId="pceGradient"
                  formatValue={(v) => `$${(v / 1000).toFixed(1)}T`}
                />
              ) : (
                <DataTable
                  data={pce.data}
                  title="Personal Spending"
                  formatValue={(v) => `$${(v / 1000).toFixed(1)}T`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Personal Saving Rate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            The personal saving rate is the percentage of disposable
                            income that households save. Higher rates indicate more
                            cautious consumer behavior.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Percent, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">PSAVERT</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {savingsRate.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={savingsRate.data}
                  height={400}
                  color="var(--chart-3)"
                  gradientId="savingsRateGradient"
                  formatValue={(v) => `${v.toFixed(1)}%`}
                />
              ) : (
                <DataTable
                  data={savingsRate.data}
                  title="Savings Rate"
                  formatValue={(v) => `${v.toFixed(1)}%`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Total Consumer Credit Outstanding</CardTitle>
                  <CardDescription>Billions of Dollars, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">TOTALSL</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {consumerCredit.isLoading ? (
                <ChartSkeleton height={400} />
              ) : viewMode === "chart" ? (
                <AreaChart
                  data={consumerCredit.data}
                  height={400}
                  color="var(--chart-4)"
                  gradientId="consumerCreditGradient"
                  formatValue={(v) => `$${(v / 1000).toFixed(2)}T`}
                />
              ) : (
                <DataTable
                  data={consumerCredit.data}
                  title="Consumer Credit"
                  formatValue={(v) => `$${(v / 1000).toFixed(2)}T`}
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
          seriesId="UMCSENT"
          seriesName="Consumer Sentiment"
          currentValue={sentiment.latestValue}
          change={sentiment.yoyChange}
          className="lg:col-span-2"
        />

        {/* Related Indicators */}
        <IndicatorRelationships seriesId="UMCSENT" />
      </div>

      {/* Deep Dive Educational Panel */}
      <div className="mt-6">
        <EducationalPanel
          seriesId="UMCSENT"
          currentValue={sentiment.latestValue}
          change={sentiment.yoyChange}
          compact
        />
      </div>
    </PageLayout>
  );
}
