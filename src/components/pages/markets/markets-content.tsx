"use client";

import { useState } from "react";
import { LineChart as LineChartIcon, TrendingUp, TrendingDown, Activity, Fuel, Info } from "lucide-react";
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
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
];

export function MarketsContent() {
  const [timeRange, setTimeRange] = useState("5");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [movingAverages, setMovingAverages] = useState<MovingAveragePeriod[]>([]);

  // Stock indices
  const sp500 = useFredData("SP500", { years: parseInt(timeRange) });
  const nasdaq = useFredData("NASDAQCOM", { years: parseInt(timeRange) });
  const djia = useFredData("DJIA", { years: parseInt(timeRange) });

  // Volatility & Risk
  const vix = useFredData("VIXCLS", { years: parseInt(timeRange) });
  const hySpread = useFredData("BAMLH0A0HYM2", { years: parseInt(timeRange) });

  // Commodities
  const wtiOil = useFredData("DCOILWTICO", { years: parseInt(timeRange) });
  const gold = useFredData("GOLDAMGBD228NLBM", { years: parseInt(timeRange) });
  const natGas = useFredData("DHHNGSP", { years: parseInt(timeRange) });

  const isLoading = sp500.isLoading || nasdaq.isLoading || vix.isLoading;

  return (
    <PageLayout
      title="Markets"
      description="Stock indices, volatility, and commodity prices"
      icon={LineChartIcon}
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
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="S&P 500"
          value={sp500.latestValue}
          change={sp500.yoyChange}
          changeLabel="YoY change"
          icon={sp500.yoyChange && sp500.yoyChange > 0 ? TrendingUp : TrendingDown}
          description="Large-cap US stocks"
          lastUpdated={sp500.latestDate ? format(parseISO(sp500.latestDate), "MMM d, yyyy") : undefined}
          isLoading={sp500.isLoading}
        />

        <StatCard
          title="NASDAQ"
          value={nasdaq.latestValue}
          change={nasdaq.yoyChange}
          changeLabel="YoY change"
          icon={nasdaq.yoyChange && nasdaq.yoyChange > 0 ? TrendingUp : TrendingDown}
          description="Tech-heavy index"
          lastUpdated={nasdaq.latestDate ? format(parseISO(nasdaq.latestDate), "MMM d, yyyy") : undefined}
          isLoading={nasdaq.isLoading}
        />

        <StatCard
          title="VIX"
          value={vix.latestValue}
          change={vix.yoyChange}
          changeLabel="YoY change"
          icon={Activity}
          description="Market volatility (fear index)"
          lastUpdated={vix.latestDate ? format(parseISO(vix.latestDate), "MMM d, yyyy") : undefined}
          isLoading={vix.isLoading}
          invertColors
        />

        <StatCard
          title="WTI Crude Oil"
          value={wtiOil.latestValue}
          change={wtiOil.yoyChange}
          changeLabel="YoY change"
          prefix="$"
          suffix="/bbl"
          icon={Fuel}
          description="US benchmark oil price"
          lastUpdated={wtiOil.latestDate ? format(parseISO(wtiOil.latestDate), "MMM d, yyyy") : undefined}
          isLoading={wtiOil.isLoading}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="stocks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stocks">Stock Indices</TabsTrigger>
          <TabsTrigger value="volatility">Volatility</TabsTrigger>
          <TabsTrigger value="commodities">Commodities</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      S&P 500 Index
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              The S&P 500 tracks 500 of the largest US companies
                              and is the most widely followed stock market index.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Index Value</CardDescription>
                  </div>
                  <Badge variant="secondary">SP500</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {sp500.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : viewMode === "chart" ? (
                  <AreaChart
                    data={sp500.data}
                    height={300}
                    color="var(--chart-1)"
                    gradientId="sp500Gradient"
                    formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    movingAverages={movingAverages}
                  />
                ) : (
                  <DataTable
                    data={sp500.data}
                    title="S&P 500"
                    formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      NASDAQ Composite
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              The NASDAQ Composite includes all stocks listed on
                              the NASDAQ exchange, heavily weighted toward technology.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Index Value</CardDescription>
                  </div>
                  <Badge variant="secondary">NASDAQCOM</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {nasdaq.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : viewMode === "chart" ? (
                  <AreaChart
                    data={nasdaq.data}
                    height={300}
                    color="var(--chart-2)"
                    gradientId="nasdaqGradient"
                    formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    movingAverages={movingAverages}
                  />
                ) : (
                  <DataTable
                    data={nasdaq.data}
                    title="NASDAQ"
                    formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="volatility">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      VIX Volatility Index
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              The VIX measures expected market volatility over the
                              next 30 days. Higher values indicate more fear and
                              uncertainty in the market.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Index Value (the &quot;Fear Index&quot;)</CardDescription>
                  </div>
                  <Badge variant="secondary">VIXCLS</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {vix.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : viewMode === "chart" ? (
                  <AreaChart
                    data={vix.data}
                    height={300}
                    color="var(--chart-3)"
                    gradientId="vixGradient"
                    formatValue={(v) => v.toFixed(1)}
                    referenceLines={[
                      { value: 20, label: "Normal", color: "var(--positive)" },
                      { value: 30, label: "Elevated", color: "var(--warning)" },
                    ]}
                    movingAverages={movingAverages}
                  />
                ) : (
                  <DataTable
                    data={vix.data}
                    title="VIX"
                    formatValue={(v) => v.toFixed(2)}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      High Yield Bond Spread
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              The spread between high-yield (junk) bonds and
                              Treasury yields. Widening spreads indicate increased
                              credit risk and potential economic stress.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Option-Adjusted Spread (%)</CardDescription>
                  </div>
                  <Badge variant="secondary">BAMLH0A0HYM2</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {hySpread.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : viewMode === "chart" ? (
                  <AreaChart
                    data={hySpread.data}
                    height={300}
                    color="var(--chart-4)"
                    gradientId="hySpreadGradient"
                    formatValue={(v) => `${v.toFixed(2)}%`}
                    movingAverages={movingAverages}
                  />
                ) : (
                  <DataTable
                    data={hySpread.data}
                    title="HY Spread"
                    formatValue={(v) => `${v.toFixed(2)}%`}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commodities">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>WTI Crude Oil</CardTitle>
                    <CardDescription>USD per Barrel</CardDescription>
                  </div>
                  <Badge variant="secondary">DCOILWTICO</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {wtiOil.isLoading ? (
                  <ChartSkeleton height={250} />
                ) : viewMode === "chart" ? (
                  <AreaChart
                    data={wtiOil.data}
                    height={250}
                    color="var(--chart-1)"
                    gradientId="wtiOilGradient"
                    formatValue={(v) => `$${v.toFixed(2)}`}
                    movingAverages={movingAverages}
                  />
                ) : (
                  <DataTable
                    data={wtiOil.data}
                    title="WTI Oil"
                    formatValue={(v) => `$${v.toFixed(2)}`}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gold</CardTitle>
                    <CardDescription>USD per Troy Ounce</CardDescription>
                  </div>
                  <Badge variant="secondary">GOLD</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {gold.isLoading ? (
                  <ChartSkeleton height={250} />
                ) : viewMode === "chart" ? (
                  <AreaChart
                    data={gold.data}
                    height={250}
                    color="var(--chart-2)"
                    gradientId="goldGradient"
                    formatValue={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    movingAverages={movingAverages}
                  />
                ) : (
                  <DataTable
                    data={gold.data}
                    title="Gold"
                    formatValue={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Natural Gas</CardTitle>
                    <CardDescription>USD per Million BTU</CardDescription>
                  </div>
                  <Badge variant="secondary">DHHNGSP</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {natGas.isLoading ? (
                  <ChartSkeleton height={250} />
                ) : viewMode === "chart" ? (
                  <AreaChart
                    data={natGas.data}
                    height={250}
                    color="var(--chart-3)"
                    gradientId="natGasGradient"
                    formatValue={(v) => `$${v.toFixed(2)}`}
                    movingAverages={movingAverages}
                  />
                ) : (
                  <DataTable
                    data={natGas.data}
                    title="Natural Gas"
                    formatValue={(v) => `$${v.toFixed(2)}`}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Stock Index Comparison</CardTitle>
              <CardDescription>S&P 500, NASDAQ, and Dow Jones (normalized)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ChartSkeleton height={400} type="line" />
              ) : (
                <LineChart
                  series={[
                    { id: "sp500", name: "S&P 500", data: sp500.data, color: "var(--chart-1)" },
                    { id: "nasdaq", name: "NASDAQ", data: nasdaq.data, color: "var(--chart-2)" },
                    { id: "djia", name: "Dow Jones", data: djia.data, color: "var(--chart-3)" },
                  ]}
                  height={400}
                  formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  showLegend
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
            <CardTitle className="text-base">Stock Indices</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              The S&P 500 tracks 500 large US companies. The NASDAQ is
              tech-heavy. The Dow Jones follows 30 blue-chip stocks.
              Together they provide a broad view of market performance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">VIX & Volatility</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              The VIX measures expected volatility over 30 days. Readings
              below 20 suggest calm markets. Above 30 indicates elevated
              fear. Spikes often coincide with market selloffs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Commodities</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Oil prices affect inflation and consumer spending. Gold is
              often seen as a safe haven during uncertainty. Natural gas
              prices impact energy costs and utilities.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
