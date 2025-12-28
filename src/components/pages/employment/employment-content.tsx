"use client";

import { useState } from "react";
import { Briefcase, Users, TrendingDown, FileText, Info, Factory, HardHat, Building2, Stethoscope, UtensilsCrossed, Cpu, Landmark, Truck, ShoppingBag } from "lucide-react";
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
  { value: "2", label: "2 Years" },
  { value: "5", label: "5 Years" },
  { value: "10", label: "10 Years" },
  { value: "20", label: "20 Years" },
];

const EMPLOYMENT_SECTORS = [
  { id: "MANEMP", name: "Manufacturing", icon: Factory, color: "var(--chart-1)" },
  { id: "USCONS", name: "Construction", icon: HardHat, color: "var(--chart-2)" },
  { id: "USEHS", name: "Education & Health", icon: Stethoscope, color: "var(--chart-3)" },
  { id: "USPBS", name: "Professional Services", icon: Building2, color: "var(--chart-4)" },
  { id: "USLAH", name: "Leisure & Hospitality", icon: UtensilsCrossed, color: "var(--chart-5)" },
  { id: "USINFO", name: "Information", icon: Cpu, color: "var(--chart-1)" },
  { id: "USFIRE", name: "Financial Activities", icon: Landmark, color: "var(--chart-2)" },
  { id: "CES4300000001", name: "Transportation", icon: Truck, color: "var(--chart-3)" },
  { id: "USTRADE", name: "Retail Trade", icon: ShoppingBag, color: "var(--chart-4)" },
  { id: "USGOVT", name: "Government", icon: Landmark, color: "var(--chart-5)" },
];

export function EmploymentContent() {
  const [timeRange, setTimeRange] = useState("5");

  // Headline data
  const unrate = useFredData("UNRATE", { years: parseInt(timeRange) });
  const payems = useFredData("PAYEMS", { years: parseInt(timeRange) });
  const civpart = useFredData("CIVPART", { years: parseInt(timeRange) });
  const icsa = useFredData("ICSA", { years: parseInt(timeRange) });

  // Sector data
  const manufacturing = useFredData("MANEMP", { years: parseInt(timeRange) });
  const construction = useFredData("USCONS", { years: parseInt(timeRange) });
  const educHealth = useFredData("USEHS", { years: parseInt(timeRange) });
  const profServices = useFredData("USPBS", { years: parseInt(timeRange) });
  const leisure = useFredData("USLAH", { years: parseInt(timeRange) });
  const information = useFredData("USINFO", { years: parseInt(timeRange) });
  const financial = useFredData("USFIRE", { years: parseInt(timeRange) });
  const transportation = useFredData("CES4300000001", { years: parseInt(timeRange) });
  const retail = useFredData("USTRADE", { years: parseInt(timeRange) });
  const government = useFredData("USGOVT", { years: parseInt(timeRange) });

  const sectorsLoading = manufacturing.isLoading || construction.isLoading || educHealth.isLoading;

  const sectorData = [
    { ...EMPLOYMENT_SECTORS[0], data: manufacturing },
    { ...EMPLOYMENT_SECTORS[1], data: construction },
    { ...EMPLOYMENT_SECTORS[2], data: educHealth },
    { ...EMPLOYMENT_SECTORS[3], data: profServices },
    { ...EMPLOYMENT_SECTORS[4], data: leisure },
    { ...EMPLOYMENT_SECTORS[5], data: information },
    { ...EMPLOYMENT_SECTORS[6], data: financial },
    { ...EMPLOYMENT_SECTORS[7], data: transportation },
    { ...EMPLOYMENT_SECTORS[8], data: retail },
    { ...EMPLOYMENT_SECTORS[9], data: government },
  ];

  // Top 5 sectors for the line chart
  const topSectors = sectorData.slice(0, 5);

  return (
    <PageLayout
      title="Employment"
      description="Labor market conditions and employment metrics"
      icon={Briefcase}
      actions={
        <div className="flex items-center gap-2">
          <ExportButton
            data={payems.data}
            filename={`employment-data-${timeRange}yr`}
            seriesName="Total Nonfarm Payrolls"
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
          title="Unemployment Rate"
          value={unrate.latestValue}
          change={unrate.yoyChange}
          changeLabel="YoY change"
          suffix="%"
          icon={TrendingDown}
          description="Civilian unemployment rate"
          lastUpdated={unrate.latestDate ? format(parseISO(unrate.latestDate), "MMM d, yyyy") : undefined}
          isLoading={unrate.isLoading}
          invertColors
        />

        <StatCard
          title="Nonfarm Payrolls"
          value={payems.latestValue ? payems.latestValue / 1000 : undefined}
          change={payems.momChange}
          changeLabel="MoM change"
          suffix="M"
          icon={Users}
          description="Total nonfarm employment"
          lastUpdated={payems.latestDate ? format(parseISO(payems.latestDate), "MMM d, yyyy") : undefined}
          isLoading={payems.isLoading}
        />

        <StatCard
          title="Labor Force Participation"
          value={civpart.latestValue}
          change={civpart.yoyChange}
          changeLabel="YoY change"
          suffix="%"
          icon={Briefcase}
          description="Civilian labor force participation rate"
          lastUpdated={civpart.latestDate ? format(parseISO(civpart.latestDate), "MMM d, yyyy") : undefined}
          isLoading={civpart.isLoading}
        />

        <StatCard
          title="Initial Jobless Claims"
          value={icsa.latestValue ? icsa.latestValue / 1000 : undefined}
          change={icsa.momChange}
          changeLabel="vs prior week"
          suffix="K"
          icon={FileText}
          description="Weekly initial unemployment claims"
          lastUpdated={icsa.latestDate ? format(parseISO(icsa.latestDate), "MMM d, yyyy") : undefined}
          isLoading={icsa.isLoading}
          invertColors
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="unemployment" className="space-y-6">
        <TabsList>
          <TabsTrigger value="unemployment">Unemployment</TabsTrigger>
          <TabsTrigger value="payrolls">Payrolls</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="participation">Participation</TabsTrigger>
          <TabsTrigger value="claims">Jobless Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="unemployment" className="space-y-6">
          {/* Date Range Comparison */}
          <DateRangeComparison
            data={unrate.data}
            title="Unemployment Rate"
            formatValue={(v) => v.toFixed(1)}
            suffix="%"
            invertColors
            isLoading={unrate.isLoading}
          />

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Unemployment Rate
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            The unemployment rate is the percentage of the labor force
                            that is jobless and actively looking for work.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                  <CardDescription>Percent, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">UNRATE</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {unrate.isLoading ? (
                <ChartSkeleton height={400} />
              ) : (
                <AreaChart
                  data={unrate.data}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="unrateGradient"
                  formatValue={(v) => `${v.toFixed(1)}%`}
                  referenceLines={[
                    { value: 4, label: "Natural Rate ~4%", color: "var(--warning)" },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payrolls">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Total Nonfarm Payrolls</CardTitle>
                  <CardDescription>Thousands of Persons, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">PAYEMS</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {payems.isLoading ? (
                <ChartSkeleton height={400} />
              ) : (
                <AreaChart
                  data={payems.data}
                  height={400}
                  color="var(--chart-2)"
                  gradientId="payemsGradient"
                  formatValue={(v) => `${(v / 1000).toFixed(1)}M`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          {/* Sector Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {sectorData.slice(0, 5).map((sector) => (
              <StatCard
                key={sector.id}
                title={sector.name}
                value={sector.data.latestValue ? sector.data.latestValue / 1000 : undefined}
                change={sector.data.yoyChange}
                changeLabel="YoY"
                suffix="M"
                icon={sector.icon}
                isLoading={sector.data.isLoading}
              />
            ))}
          </div>

          {/* Sector Comparison Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employment by Sector</CardTitle>
                  <CardDescription>Thousands of Persons, Seasonally Adjusted</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {sectorsLoading ? (
                <ChartSkeleton height={400} type="line" />
              ) : (
                <LineChart
                  series={topSectors.map((s) => ({
                    id: s.id,
                    name: s.name,
                    data: s.data.data,
                    color: s.color,
                  }))}
                  height={400}
                  formatValue={(v) => `${(v / 1000).toFixed(1)}M`}
                  showLegend
                />
              )}
            </CardContent>
          </Card>

          {/* Additional Sector Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {sectorData.slice(5).map((sector) => (
              <StatCard
                key={sector.id}
                title={sector.name}
                value={sector.data.latestValue ? sector.data.latestValue / 1000 : undefined}
                change={sector.data.yoyChange}
                changeLabel="YoY"
                suffix="M"
                icon={sector.icon}
                isLoading={sector.data.isLoading}
              />
            ))}
          </div>

          {/* Sector Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Factory className="h-4 w-4" />
                  Manufacturing
                </CardTitle>
              </CardHeader>
              <CardContent>
                {manufacturing.isLoading ? (
                  <ChartSkeleton height={200} showAxis={false} />
                ) : (
                  <AreaChart
                    data={manufacturing.data}
                    height={200}
                    color="var(--chart-1)"
                    gradientId="mfgGradient"
                    formatValue={(v) => `${(v / 1000).toFixed(2)}M`}
                    showAxis={false}
                  />
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Manufacturing employment is a key indicator of industrial health and
                  is sensitive to economic cycles and trade policies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UtensilsCrossed className="h-4 w-4" />
                  Leisure & Hospitality
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leisure.isLoading ? (
                  <ChartSkeleton height={200} showAxis={false} />
                ) : (
                  <AreaChart
                    data={leisure.data}
                    height={200}
                    color="var(--chart-5)"
                    gradientId="leisureGradient"
                    formatValue={(v) => `${(v / 1000).toFixed(2)}M`}
                    showAxis={false}
                  />
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Leisure and hospitality was hardest hit during COVID-19 and has
                  been a major driver of job recovery since 2021.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participation">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Labor Force Participation Rate</CardTitle>
                  <CardDescription>Percent, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">CIVPART</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {civpart.isLoading ? (
                <ChartSkeleton height={400} />
              ) : (
                <AreaChart
                  data={civpart.data}
                  height={400}
                  color="var(--chart-3)"
                  gradientId="civpartGradient"
                  formatValue={(v) => `${v.toFixed(1)}%`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Initial Unemployment Claims</CardTitle>
                  <CardDescription>Number, Seasonally Adjusted</CardDescription>
                </div>
                <Badge variant="secondary">ICSA</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {icsa.isLoading ? (
                <ChartSkeleton height={400} />
              ) : (
                <AreaChart
                  data={icsa.data}
                  height={400}
                  color="var(--chart-4)"
                  gradientId="icsaGradient"
                  formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
