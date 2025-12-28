"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Info, Fuel, Home, Utensils, Stethoscope, GraduationCap, Car } from "lucide-react";
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
import { ExportButton } from "@/components/ui/export-button";
import { DateRangeComparison } from "@/components/ui/date-range-comparison";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
import { useFredData } from "@/lib/hooks/use-fred-data";

const TIME_RANGES = [
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
];

const CPI_COMPONENTS = [
  { id: "CPIUFDSL", name: "Food", icon: Utensils, color: "var(--chart-1)" },
  { id: "CPIENGSL", name: "Energy", icon: Fuel, color: "var(--chart-2)" },
  { id: "CUSR0000SAH1", name: "Shelter", icon: Home, color: "var(--chart-3)" },
  { id: "CUSR0000SAM2", name: "Medical Care", icon: Stethoscope, color: "var(--chart-4)" },
  { id: "CUSR0000SAT1", name: "Transportation", icon: Car, color: "var(--chart-5)" },
  { id: "CUSR0000SAE1", name: "Education", icon: GraduationCap, color: "var(--chart-1)" },
];

export function InflationContent() {
  const [timeRange, setTimeRange] = useState("5");

  // Fetch data for different inflation metrics
  const cpi = useFredData("CPIAUCSL", { years: parseInt(timeRange) });
  const coreCpi = useFredData("CPILFESL", { years: parseInt(timeRange) });
  const pce = useFredData("PCEPI", { years: parseInt(timeRange) });
  const corePce = useFredData("PCEPILFE", { years: parseInt(timeRange) });

  // CPI Components
  const cpiFood = useFredData("CPIUFDSL", { years: parseInt(timeRange) });
  const cpiEnergy = useFredData("CPIENGSL", { years: parseInt(timeRange) });
  const cpiShelter = useFredData("CUSR0000SAH1", { years: parseInt(timeRange) });
  const cpiMedical = useFredData("CUSR0000SAM2", { years: parseInt(timeRange) });
  const cpiTransport = useFredData("CUSR0000SAT1", { years: parseInt(timeRange) });
  const cpiEducation = useFredData("CUSR0000SAE1", { years: parseInt(timeRange) });

  const isLoading = cpi.isLoading || coreCpi.isLoading || pce.isLoading || corePce.isLoading;
  const componentsLoading = cpiFood.isLoading || cpiEnergy.isLoading || cpiShelter.isLoading;

  const componentData = [
    { ...CPI_COMPONENTS[0], data: cpiFood },
    { ...CPI_COMPONENTS[1], data: cpiEnergy },
    { ...CPI_COMPONENTS[2], data: cpiShelter },
    { ...CPI_COMPONENTS[3], data: cpiMedical },
    { ...CPI_COMPONENTS[4], data: cpiTransport },
    { ...CPI_COMPONENTS[5], data: cpiEducation },
  ];

  return (
    <PageLayout
      title="Inflation"
      description="Consumer Price Index, PCE, and price trend analysis"
      icon={DollarSign}
      actions={
        <div className="flex items-center gap-2">
          <ExportButton
            data={cpi.data}
            filename={`cpi-data-${timeRange}yr`}
            seriesName="CPI"
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
          title="CPI (All Items)"
          value={cpi.latestValue}
          change={cpi.yoyChange}
          changeLabel="YoY change"
          icon={DollarSign}
          description="Consumer Price Index for All Urban Consumers"
          lastUpdated={cpi.latestDate ? format(parseISO(cpi.latestDate), "MMM d, yyyy") : undefined}
          isLoading={cpi.isLoading}
        />

        <StatCard
          title="Core CPI"
          value={coreCpi.latestValue}
          change={coreCpi.yoyChange}
          changeLabel="YoY change"
          icon={TrendingUp}
          description="CPI excluding Food & Energy"
          lastUpdated={coreCpi.latestDate ? format(parseISO(coreCpi.latestDate), "MMM d, yyyy") : undefined}
          isLoading={coreCpi.isLoading}
        />

        <StatCard
          title="PCE Price Index"
          value={pce.latestValue}
          change={pce.yoyChange}
          changeLabel="YoY change"
          icon={DollarSign}
          description="Personal Consumption Expenditures Price Index"
          lastUpdated={pce.latestDate ? format(parseISO(pce.latestDate), "MMM d, yyyy") : undefined}
          isLoading={pce.isLoading}
        />

        <StatCard
          title="Core PCE"
          value={corePce.latestValue}
          change={corePce.yoyChange}
          changeLabel="YoY change"
          icon={TrendingDown}
          description="PCE excluding Food & Energy (Fed's preferred)"
          lastUpdated={corePce.latestDate ? format(parseISO(corePce.latestDate), "MMM d, yyyy") : undefined}
          isLoading={corePce.isLoading}
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="cpi" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cpi">CPI</TabsTrigger>
          <TabsTrigger value="components">CPI Components</TabsTrigger>
          <TabsTrigger value="pce">PCE</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="cpi" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* CPI Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Consumer Price Index
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              The CPI measures the average change in prices paid by urban
                              consumers for a basket of goods and services. It&apos;s the most
                              widely used measure of inflation.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>All Urban Consumers, All Items</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExportButton data={cpi.data} filename="cpi" seriesName="CPI" size="icon" variant="ghost" />
                    <Badge variant="secondary">CPIAUCSL</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {cpi.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : (
                  <AreaChart
                    data={cpi.data}
                    height={300}
                    color="var(--chart-1)"
                    gradientId="cpiGradient"
                    formatValue={(v) => v.toFixed(1)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Core CPI Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Core CPI
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              Core CPI excludes volatile food and energy prices to show
                              underlying inflation trends more clearly.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Less Food and Energy</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExportButton data={coreCpi.data} filename="core-cpi" seriesName="Core CPI" size="icon" variant="ghost" />
                    <Badge variant="secondary">CPILFESL</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {coreCpi.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : (
                  <AreaChart
                    data={coreCpi.data}
                    height={300}
                    color="var(--chart-2)"
                    gradientId="coreCpiGradient"
                    formatValue={(v) => v.toFixed(1)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          {/* Component Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {componentData.map((component) => (
              <StatCard
                key={component.id}
                title={component.name}
                value={component.data.latestValue}
                change={component.data.yoyChange}
                changeLabel="YoY change"
                icon={component.icon}
                isLoading={component.data.isLoading}
              />
            ))}
          </div>

          {/* Components Line Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>CPI Component Breakdown</CardTitle>
                  <CardDescription>Price indices for major spending categories</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {componentsLoading ? (
                <ChartSkeleton height={400} type="line" />
              ) : (
                <LineChart
                  series={componentData.map((c) => ({
                    id: c.id,
                    name: c.name,
                    data: c.data.data,
                    color: c.color,
                  }))}
                  height={400}
                  formatValue={(v) => v.toFixed(1)}
                  showLegend
                />
              )}
            </CardContent>
          </Card>

          {/* Component Details Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Home className="h-4 w-4" />
                  Shelter
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cpiShelter.isLoading ? (
                  <ChartSkeleton height={200} showAxis={false} />
                ) : (
                  <AreaChart
                    data={cpiShelter.data}
                    height={200}
                    color="var(--chart-3)"
                    gradientId="shelterGradient"
                    formatValue={(v) => v.toFixed(1)}
                    showAxis={false}
                  />
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Shelter costs (rent, owners&apos; equivalent rent) are the largest component of CPI,
                  making up about 1/3 of the index.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Fuel className="h-4 w-4" />
                  Energy
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cpiEnergy.isLoading ? (
                  <ChartSkeleton height={200} showAxis={false} />
                ) : (
                  <AreaChart
                    data={cpiEnergy.data}
                    height={200}
                    color="var(--chart-2)"
                    gradientId="energyGradient"
                    formatValue={(v) => v.toFixed(1)}
                    showAxis={false}
                  />
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Energy prices are highly volatile, driven by oil prices and seasonal demand.
                  This is why Core CPI excludes energy.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pce" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* PCE Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      PCE Price Index
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              The PCE price index measures prices paid by consumers for goods
                              and services. It&apos;s based on data from businesses rather than
                              consumer surveys.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Personal Consumption Expenditures</CardDescription>
                  </div>
                  <Badge variant="secondary">PCEPI</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {pce.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : (
                  <AreaChart
                    data={pce.data}
                    height={300}
                    color="var(--chart-3)"
                    gradientId="pceGradient"
                    formatValue={(v) => v.toFixed(1)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Core PCE Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Core PCE
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>
                              Core PCE is the Federal Reserve&apos;s preferred inflation measure.
                              The Fed targets 2% annual core PCE inflation.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Fed&apos;s Preferred Measure</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-primary text-primary">
                    Fed Target: 2%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {corePce.isLoading ? (
                  <ChartSkeleton height={300} />
                ) : (
                  <AreaChart
                    data={corePce.data}
                    height={300}
                    color="var(--chart-4)"
                    gradientId="corePceGradient"
                    formatValue={(v) => v.toFixed(1)}
                    referenceLines={[{ value: 2, label: "2% Target", color: "var(--warning)" }]}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Date Range Comparisons */}
          <div className="grid gap-4 md:grid-cols-2">
            <DateRangeComparison
              data={cpi.data}
              title="CPI"
              formatValue={(v) => v.toFixed(1)}
              isLoading={cpi.isLoading}
            />
            <DateRangeComparison
              data={corePce.data}
              title="Core PCE"
              formatValue={(v) => v.toFixed(1)}
              isLoading={corePce.isLoading}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>CPI vs PCE Comparison</CardTitle>
              <CardDescription>
                Compare headline and core measures of consumer inflation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <ChartSkeleton height={400} type="line" />
              ) : (
                <LineChart
                  series={[
                    { id: "cpi", name: "CPI", data: cpi.data, color: "var(--chart-1)" },
                    { id: "coreCpi", name: "Core CPI", data: coreCpi.data, color: "var(--chart-2)" },
                    { id: "pce", name: "PCE", data: pce.data, color: "var(--chart-3)" },
                    { id: "corePce", name: "Core PCE", data: corePce.data, color: "var(--chart-4)" },
                  ]}
                  height={400}
                  formatValue={(v) => v.toFixed(1)}
                  showLegend
                />
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Why Two Measures?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  CPI and PCE measure inflation differently. CPI uses a fixed basket of goods
                  and is based on household surveys. PCE uses business data and accounts for
                  consumers switching between products when prices change.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fed&apos;s Target</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  The Federal Reserve targets 2% annual inflation as measured by Core PCE.
                  This excludes food and energy prices to focus on underlying inflation trends
                  and guide monetary policy decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
