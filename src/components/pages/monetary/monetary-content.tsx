"use client";

import { useState } from "react";
import { Landmark, TrendingUp, Info } from "lucide-react";
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
import { useFredData } from "@/lib/hooks/use-fred-data";

const TIME_RANGES = [
  { value: "2", label: "2 Years" },
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
];

export function MonetaryContent() {
  const [timeRange, setTimeRange] = useState("10");

  const m2 = useFredData("M2SL", { years: parseInt(timeRange) });
  const fedBalance = useFredData("WALCL", { years: parseInt(timeRange) });

  return (
    <PageLayout
      title="Monetary Policy"
      description="Money supply and Federal Reserve balance sheet"
      icon={Landmark}
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
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <StatCard
          title="M2 Money Supply"
          value={m2.latestValue ? m2.latestValue / 1000 : undefined}
          change={m2.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="T"
          icon={TrendingUp}
          description="Broad measure of money supply"
          lastUpdated={m2.latestDate ? format(parseISO(m2.latestDate), "MMM d, yyyy") : undefined}
          isLoading={m2.isLoading}
        />

        <StatCard
          title="Fed Balance Sheet"
          value={fedBalance.latestValue ? fedBalance.latestValue / 1000000 : undefined}
          change={fedBalance.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="T"
          icon={Landmark}
          description="Total assets held by Federal Reserve"
          lastUpdated={fedBalance.latestDate ? format(parseISO(fedBalance.latestDate), "MMM d, yyyy") : undefined}
          isLoading={fedBalance.isLoading}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="m2" className="space-y-6">
        <TabsList>
          <TabsTrigger value="m2">Money Supply</TabsTrigger>
          <TabsTrigger value="balance">Fed Balance Sheet</TabsTrigger>
        </TabsList>

        <TabsContent value="m2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    M2 Money Supply
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            M2 includes cash, checking deposits, savings deposits,
                            money market securities, and other time deposits. It&apos;s a
                            key indicator of money available for spending.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Billions of Dollars, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">M2SL</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {m2.isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <AreaChart
                  data={m2.data}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="m2Gradient"
                  formatValue={(v) => `$${(v / 1000).toFixed(1)}T`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Federal Reserve Balance Sheet
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            The Fed&apos;s total assets, including Treasury securities and
                            mortgage-backed securities. Changes reflect quantitative
                            easing/tightening policies.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Millions of Dollars, Not Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">WALCL</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {fedBalance.isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <AreaChart
                  data={fedBalance.data}
                  height={400}
                  color="var(--chart-2)"
                  gradientId="fedBalanceGradient"
                  formatValue={(v) => `$${(v / 1000000).toFixed(2)}T`}
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
            <CardTitle className="text-base">Quantitative Easing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              When the Fed buys assets (Treasury bonds, mortgage-backed securities),
              it expands its balance sheet and increases money supply. This is used
              to stimulate the economy during downturns.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quantitative Tightening</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              When the Fed reduces its balance sheet by letting bonds mature without
              reinvesting, it removes money from circulation. This is used to combat
              inflation by tightening financial conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
