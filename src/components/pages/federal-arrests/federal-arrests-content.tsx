"use client";

import { useState, useMemo } from "react";
import {
  Shield,
  Users,
  Building,
  Plane,
  Scale,
  Pill,
  Target,
  Search,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Info,
} from "lucide-react";
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
import { PrintButton } from "@/components/ui/print-button";
import { DataTable } from "@/components/ui/data-table";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";

import {
  iceArrestsData,
  iceDetentionData,
  cbpStats,
  cbpBorderData,
  fbiStats,
  deaStats,
  usMarshalsStats,
  atfStats,
  hsiStats,
  deportationData,
  federalArrestsSummary,
  iceCriminalCategories,
  allAgencies,
  getTotalMonthlyArrests,
  federalArrestsContext,
  type AgencyStats,
} from "@/lib/data/federal-arrests";

const AGENCY_ICONS: Record<string, typeof Shield> = {
  "ice-ero": Shield,
  cbp: Plane,
  fbi: Search,
  dea: Pill,
  usms: Scale,
  atf: Target,
  hsi: Building,
};

const AGENCY_COLORS: Record<string, string> = {
  "ice-ero": "var(--chart-1)",
  cbp: "var(--chart-2)",
  fbi: "var(--chart-3)",
  dea: "var(--chart-4)",
  usms: "var(--chart-5)",
  atf: "var(--chart-1)",
  hsi: "var(--chart-2)",
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toLocaleString();
}

function AgencyCard({ agency }: { agency: AgencyStats }) {
  const Icon = AGENCY_ICONS[agency.id] || Shield;
  const color = AGENCY_COLORS[agency.id] || "var(--chart-1)";

  // Transform data for chart
  const chartData = agency.monthlyData.map(d => ({
    date: `${d.date}-01`,
    value: d.value,
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
            >
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{agency.shortName}</CardTitle>
              <CardDescription className="text-xs">{agency.name}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {formatNumber(agency.totalArrests2025)} arrests
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <AreaChart
          data={chartData}
          height={120}
          color={color}
          gradientId={`${agency.id}Gradient`}
          formatValue={(v) => formatNumber(v)}
          showAxis={false}
        />
      </CardContent>
    </Card>
  );
}

export function FederalArrestsContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [selectedAgency, setSelectedAgency] = useState<string>("all");

  // Calculate totals
  const totalArrests = Object.values(federalArrestsSummary.totalArrests2025).reduce((a, b) => a + b, 0);
  const totalMonthlyData = useMemo(() => getTotalMonthlyArrests(), []);
  const chartTotalData = totalMonthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }));

  // ICE detention chart data
  const detentionChartData = iceDetentionData.map(d => ({
    date: `${d.date}-01`,
    value: d.totalDetained,
  }));

  // Border apprehensions chart data
  const borderChartData = cbpBorderData.map(d => ({
    date: `${d.date}-01`,
    value: d.swbApprehensions,
  }));

  // Deportation chart data
  const deportationChartData = deportationData.map(d => ({
    date: `${d.date}-01`,
    value: d.totalRemovals,
  }));

  // Agency comparison line chart data
  const agencyComparisonData = allAgencies.slice(0, 5).map(agency => ({
    id: agency.id,
    name: agency.shortName,
    data: agency.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value })),
    color: AGENCY_COLORS[agency.id],
  }));

  // Latest detention stats
  const latestDetention = iceDetentionData[iceDetentionData.length - 1];
  const latestBorder = cbpBorderData[cbpBorderData.length - 1];

  return (
    <PageLayout
      title="Federal Arrests & Detentions"
      description="Comprehensive data on US federal law enforcement actions since 2025"
      icon={Shield}
      actions={
        <div className="flex items-center gap-2">
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <ExportButton
            data={chartTotalData}
            filename="federal-arrests-2025"
            seriesName="Total Federal Arrests"
          />
          <PrintButton />
        </div>
      }
    >
      {/* Context Banner */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">About This Dataset</h3>
            <p className="text-sm text-muted-foreground">
              {federalArrestsContext.overview}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Federal Arrests"
          value={totalArrests}
          icon={Shield}
          description="Combined arrests across all agencies (2025)"
          sparklineData={chartTotalData}
        />

        <StatCard
          title="ICE Detainees"
          value={latestDetention.totalDetained}
          icon={Users}
          description="Current ICE detention population"
          sparklineData={detentionChartData}
        />

        <StatCard
          title="Border Crossings"
          value={latestBorder.swbApprehensions}
          change={latestBorder.yoyChange}
          changeLabel="YoY change"
          icon={Plane}
          description="Monthly SW border apprehensions"
          invertColors
          sparklineData={borderChartData}
        />

        <StatCard
          title="Total Deportations"
          value={federalArrestsSummary.totalDeportations2025}
          icon={TrendingDown}
          description="Removals in 2025"
          sparklineData={deportationChartData}
        />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ice">ICE</TabsTrigger>
          <TabsTrigger value="cbp">Border Patrol</TabsTrigger>
          <TabsTrigger value="fbi">FBI</TabsTrigger>
          <TabsTrigger value="dea">DEA</TabsTrigger>
          <TabsTrigger value="marshals">US Marshals</TabsTrigger>
          <TabsTrigger value="detention">Detention</TabsTrigger>
          <TabsTrigger value="deportation">Deportation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Agency Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allAgencies.map(agency => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>

          {/* Agency Comparison Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Arrests by Agency</CardTitle>
                  <CardDescription>Top 5 agencies comparison (2025)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <LineChart
                  series={agencyComparisonData}
                  height={400}
                  formatValue={(v) => formatNumber(v)}
                  showLegend
                />
              ) : (
                <DataTable
                  data={chartTotalData}
                  title="Total Monthly Arrests"
                  formatValue={(v) => formatNumber(v)}
                />
              )}
            </CardContent>
          </Card>

          {/* Key Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Trends in 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {federalArrestsContext.keyTrends.map((trend, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">{trend}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ICE Tab */}
        <TabsContent value="ice" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {iceArrestsData.keyMetrics.slice(0, 4).map((metric, i) => (
              <StatCard
                key={i}
                title={metric.label}
                value={metric.value}
                description={metric.description}
                icon={Shield}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ICE ERO Monthly Arrests</CardTitle>
                  <CardDescription>Enforcement and Removal Operations (2025)</CardDescription>
                </div>
                <Badge variant="secondary">ICE ERO</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <AreaChart
                  data={iceArrestsData.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }))}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="iceArrestsGradient"
                  formatValue={(v) => formatNumber(v)}
                />
              ) : (
                <DataTable
                  data={iceArrestsData.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }))}
                  title="ICE Monthly Arrests"
                  formatValue={(v) => formatNumber(v)}
                />
              )}
            </CardContent>
          </Card>

          {/* Criminal Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Arrest Categories by Criminal History</CardTitle>
              <CardDescription>Breakdown of ICE arrests by criminal background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {iceCriminalCategories.map((cat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{cat.category}</span>
                      <span className="font-medium">{formatNumber(cat.count)} ({cat.percentage}%)</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notable Operations */}
          {iceArrestsData.notableOperations && (
            <Card>
              <CardHeader>
                <CardTitle>Notable ICE Operations (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {iceArrestsData.notableOperations.map((op, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{op.name}</h4>
                          <Badge variant="outline">{op.date}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{op.description}</p>
                        <p className="mt-2 text-sm font-medium text-primary">{formatNumber(op.arrests)} arrests</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* CBP/Border Patrol Tab */}
        <TabsContent value="cbp" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cbpStats.keyMetrics.slice(0, 4).map((metric, i) => (
              <StatCard
                key={i}
                title={metric.label}
                value={metric.value}
                description={metric.description}
                icon={Plane}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Southwest Border Apprehensions</CardTitle>
                  <CardDescription>Monthly USBP apprehensions at the southwest border</CardDescription>
                </div>
                <Badge variant="secondary">CBP</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <AreaChart
                  data={borderChartData}
                  height={400}
                  color="var(--chart-2)"
                  gradientId="cbpGradient"
                  formatValue={(v) => formatNumber(v)}
                />
              ) : (
                <DataTable
                  data={borderChartData}
                  title="Border Apprehensions"
                  formatValue={(v) => formatNumber(v)}
                />
              )}
            </CardContent>
          </Card>

          {/* Year-over-Year Changes */}
          <Card>
            <CardHeader>
              <CardTitle>Year-over-Year Change by Month</CardTitle>
              <CardDescription>Percentage change compared to same month in 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                {cbpBorderData.map((d, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(`${d.date}-01`), "MMMM yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-positive" />
                      <span className="text-lg font-bold text-positive">{d.yoyChange}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatNumber(d.swbApprehensions)} apprehensions
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FBI Tab */}
        <TabsContent value="fbi" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {fbiStats.keyMetrics.slice(0, 4).map((metric, i) => (
              <StatCard
                key={i}
                title={metric.label}
                value={metric.value}
                change={metric.change}
                description={metric.description}
                icon={Search}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>FBI Monthly Arrests (Estimated)</CardTitle>
                  <CardDescription>Based on field office reports and national statistics</CardDescription>
                </div>
                <Badge variant="secondary">FBI</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <AreaChart
                  data={fbiStats.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }))}
                  height={400}
                  color="var(--chart-3)"
                  gradientId="fbiGradient"
                  formatValue={(v) => formatNumber(v)}
                />
              ) : (
                <DataTable
                  data={fbiStats.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }))}
                  title="FBI Monthly Arrests"
                  formatValue={(v) => formatNumber(v)}
                />
              )}
            </CardContent>
          </Card>

          {/* Notable Operations */}
          {fbiStats.notableOperations && (
            <Card>
              <CardHeader>
                <CardTitle>Notable FBI Operations (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {fbiStats.notableOperations.map((op, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <h4 className="font-semibold">{op.name}</h4>
                      <Badge variant="outline" className="mt-2">{op.date}</Badge>
                      <p className="mt-2 text-sm text-muted-foreground">{op.description}</p>
                      <p className="mt-2 text-lg font-bold text-primary">{formatNumber(op.arrests)} arrests</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* DEA Tab */}
        <TabsContent value="dea" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {deaStats.keyMetrics.slice(0, 4).map((metric, i) => (
              <StatCard
                key={i}
                title={metric.label}
                value={metric.value}
                description={metric.description}
                icon={Pill}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>DEA Monthly Arrests</CardTitle>
                  <CardDescription>Drug enforcement arrests (2025)</CardDescription>
                </div>
                <Badge variant="secondary">DEA</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <AreaChart
                  data={deaStats.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }))}
                  height={400}
                  color="var(--chart-4)"
                  gradientId="deaGradient"
                  formatValue={(v) => formatNumber(v)}
                />
              ) : (
                <DataTable
                  data={deaStats.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }))}
                  title="DEA Monthly Arrests"
                  formatValue={(v) => formatNumber(v)}
                />
              )}
            </CardContent>
          </Card>

          {/* Drug Seizures */}
          <Card>
            <CardHeader>
              <CardTitle>Drug Seizures (2025)</CardTitle>
              <CardDescription>Key substances seized by DEA operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4 text-center">
                  <Pill className="mx-auto h-8 w-8 text-red-500" />
                  <div className="mt-2 text-2xl font-bold">45M+</div>
                  <div className="text-sm text-muted-foreground">Fentanyl Pills</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <Pill className="mx-auto h-8 w-8 text-orange-500" />
                  <div className="mt-2 text-2xl font-bold">9,320 lbs</div>
                  <div className="text-sm text-muted-foreground">Fentanyl Powder</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <Pill className="mx-auto h-8 w-8 text-blue-500" />
                  <div className="mt-2 text-2xl font-bold">65,000 lbs</div>
                  <div className="text-sm text-muted-foreground">Methamphetamine</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <Pill className="mx-auto h-8 w-8 text-white" />
                  <div className="mt-2 text-2xl font-bold">201,500 lbs</div>
                  <div className="text-sm text-muted-foreground">Cocaine</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notable Operations */}
          {deaStats.notableOperations && (
            <Card>
              <CardHeader>
                <CardTitle>Major DEA Operations (2025)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deaStats.notableOperations.map((op, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{op.name}</h4>
                          <Badge variant="outline">{op.date}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{op.description}</p>
                        <p className="mt-2 text-sm font-medium text-primary">{formatNumber(op.arrests)} arrests</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* US Marshals Tab */}
        <TabsContent value="marshals" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {usMarshalsStats.keyMetrics.slice(0, 4).map((metric, i) => (
              <StatCard
                key={i}
                title={metric.label}
                value={metric.value}
                description={metric.description}
                icon={Scale}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>US Marshals Monthly Arrests</CardTitle>
                  <CardDescription>Fugitive apprehensions (2025)</CardDescription>
                </div>
                <Badge variant="secondary">USMS</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <AreaChart
                  data={usMarshalsStats.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }))}
                  height={400}
                  color="var(--chart-5)"
                  gradientId="usmsGradient"
                  formatValue={(v) => formatNumber(v)}
                />
              ) : (
                <DataTable
                  data={usMarshalsStats.monthlyData.map(d => ({ date: `${d.date}-01`, value: d.value }))}
                  title="US Marshals Monthly Arrests"
                  formatValue={(v) => formatNumber(v)}
                />
              )}
            </CardContent>
          </Card>

          {/* Arrest Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Fugitive Arrest Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold">{formatNumber(28706)}</div>
                  <div className="text-sm text-muted-foreground">Federal Fugitives</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold">{formatNumber(45516)}</div>
                  <div className="text-sm text-muted-foreground">State/Local Fugitives</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold">{formatNumber(5337)}</div>
                  <div className="text-sm text-muted-foreground">Homicide Suspects</div>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <div className="text-2xl font-bold">{formatNumber(9762)}</div>
                  <div className="text-sm text-muted-foreground">Sex Offenders</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detention Tab */}
        <TabsContent value="detention" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Current Detainees"
              value={latestDetention.totalDetained}
              icon={Users}
              description="Total ICE detention population"
            />
            <StatCard
              title="With Criminal Record"
              value={latestDetention.withCriminalRecord}
              icon={AlertTriangle}
              description={`${((latestDetention.withCriminalRecord / latestDetention.totalDetained) * 100).toFixed(0)}% of total`}
            />
            <StatCard
              title="Without Criminal Record"
              value={latestDetention.withoutCriminalRecord}
              icon={Users}
              description={`${((latestDetention.withoutCriminalRecord / latestDetention.totalDetained) * 100).toFixed(0)}% of total`}
            />
            <StatCard
              title="Average Days Detained"
              value={latestDetention.averageDaysDetained}
              suffix=" days"
              icon={Shield}
              description="Average length of detention"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ICE Detention Population Over Time</CardTitle>
                  <CardDescription>Monthly detention facility population (2025)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <AreaChart
                  data={detentionChartData}
                  height={400}
                  color="var(--chart-1)"
                  gradientId="detentionGradient"
                  formatValue={(v) => formatNumber(v)}
                />
              ) : (
                <DataTable
                  data={detentionChartData}
                  title="Detention Population"
                  formatValue={(v) => formatNumber(v)}
                />
              )}
            </CardContent>
          </Card>

          {/* Criminal vs Non-Criminal */}
          <Card>
            <CardHeader>
              <CardTitle>Detention by Criminal Status</CardTitle>
              <CardDescription>Breakdown of detainees by criminal record status</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                series={[
                  {
                    id: "criminal",
                    name: "With Criminal Record",
                    data: iceDetentionData.map(d => ({ date: `${d.date}-01`, value: d.withCriminalRecord })),
                    color: "var(--chart-1)",
                  },
                  {
                    id: "noncriminal",
                    name: "Without Criminal Record",
                    data: iceDetentionData.map(d => ({ date: `${d.date}-01`, value: d.withoutCriminalRecord })),
                    color: "var(--chart-3)",
                  },
                ]}
                height={300}
                formatValue={(v) => formatNumber(v)}
                showLegend
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deportation Tab */}
        <TabsContent value="deportation" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Removals (2025)"
              value={federalArrestsSummary.totalDeportations2025}
              icon={Plane}
              description="Deportations by ICE and CBP"
            />
            <StatCard
              title="Self-Deportations"
              value={federalArrestsSummary.totalSelfDeportations2025}
              icon={Users}
              description="Voluntary departures (estimated)"
            />
            <StatCard
              title="ICE Interior Removals"
              value={234000}
              icon={Shield}
              description="Through first 250 days"
            />
            <StatCard
              title="CBP Removals"
              value={166000}
              icon={Plane}
              description="Border-related deportations"
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Deportations</CardTitle>
                  <CardDescription>Combined ICE and CBP removals (2025)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "chart" ? (
                <AreaChart
                  data={deportationChartData}
                  height={400}
                  color="var(--chart-2)"
                  gradientId="deportationGradient"
                  formatValue={(v) => formatNumber(v)}
                />
              ) : (
                <DataTable
                  data={deportationChartData}
                  title="Monthly Deportations"
                  formatValue={(v) => formatNumber(v)}
                />
              )}
            </CardContent>
          </Card>

          {/* Deportation Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Deportation by Type</CardTitle>
              <CardDescription>Interior vs border removals over time</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart
                series={[
                  {
                    id: "ice",
                    name: "ICE Interior",
                    data: deportationData.map(d => ({ date: `${d.date}-01`, value: d.iceInterior })),
                    color: "var(--chart-1)",
                  },
                  {
                    id: "cbp",
                    name: "CBP Removals",
                    data: deportationData.map(d => ({ date: `${d.date}-01`, value: d.cbpRemovals })),
                    color: "var(--chart-2)",
                  },
                ]}
                height={300}
                formatValue={(v) => formatNumber(v)}
                showLegend
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Sources */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Data Sources & Methodology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {federalArrestsContext.methodology}
          </p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {federalArrestsContext.dataSources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{source.name}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
