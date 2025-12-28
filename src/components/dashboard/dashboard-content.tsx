"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Percent,
  Home,
  ShoppingCart,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard, MiniChart } from "@/components/charts";
import { useFredData } from "@/lib/hooks/use-fred-data";
import { format, parseISO } from "date-fns";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function KeyIndicatorCard({
  title,
  href,
  icon: Icon,
  seriesId,
  suffix = "",
  prefix = "",
  changeLabel = "YoY",
  description,
  invertColors = false,
}: {
  title: string;
  href: string;
  icon: React.ElementType;
  seriesId: string;
  suffix?: string;
  prefix?: string;
  changeLabel?: string;
  description: string;
  invertColors?: boolean;
}) {
  const { data, latestValue, yoyChange, latestDate, isLoading } = useFredData(seriesId, { years: 2 });

  const recentData = data.slice(-60); // Last 60 data points for sparkline

  return (
    <motion.div variants={itemVariants}>
      <Link href={href}>
        <Card className="group stat-card-hover cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-2xl font-bold tabular-nums">
                  {isLoading ? (
                    <span className="text-muted-foreground">Loading...</span>
                  ) : (
                    <>
                      {prefix}
                      {latestValue?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      {suffix}
                    </>
                  )}
                </div>
                {yoyChange !== null && yoyChange !== undefined && (
                  <Badge
                    variant="secondary"
                    className={`mt-1 tabular-nums ${
                      (invertColors ? yoyChange < 0 : yoyChange > 0)
                        ? "bg-positive/10 text-positive"
                        : "bg-negative/10 text-negative"
                    }`}
                  >
                    {yoyChange > 0 ? "+" : ""}
                    {yoyChange.toFixed(2)}% {changeLabel}
                  </Badge>
                )}
                <p className="mt-2 text-xs text-muted-foreground">{description}</p>
                {latestDate && (
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    {format(parseISO(latestDate), "MMM d, yyyy")}
                  </p>
                )}
              </div>
              <div className="w-24">
                <MiniChart data={recentData} height={48} showTrend />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function DashboardContent() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border/40 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-4">
              Live Data
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              US Economic Data
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Real-time visualization of key economic indicators. Track GDP, inflation,
              employment, interest rates, and more with data from official sources.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Button asChild>
                <Link href="/inflation">
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Inflation Data
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/gdp">
                  Explore GDP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Key Indicators Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h2 className="text-xl font-semibold">Key Indicators</h2>
            <p className="text-sm text-muted-foreground">
              Overview of the most important economic metrics
            </p>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <KeyIndicatorCard
            title="Inflation (CPI)"
            href="/inflation"
            icon={DollarSign}
            seriesId="CPIAUCSL"
            description="Consumer Price Index for All Urban Consumers"
            changeLabel="YoY"
          />

          <KeyIndicatorCard
            title="Real GDP"
            href="/gdp"
            icon={TrendingUp}
            seriesId="GDPC1"
            prefix="$"
            suffix="B"
            description="Real Gross Domestic Product"
            changeLabel="YoY"
          />

          <KeyIndicatorCard
            title="Unemployment"
            href="/employment"
            icon={Briefcase}
            seriesId="UNRATE"
            suffix="%"
            description="Civilian Unemployment Rate"
            changeLabel="YoY"
            invertColors
          />

          <KeyIndicatorCard
            title="Fed Funds Rate"
            href="/rates"
            icon={Percent}
            seriesId="FEDFUNDS"
            suffix="%"
            description="Effective Federal Funds Rate"
            changeLabel="YoY"
          />

          <KeyIndicatorCard
            title="Home Prices"
            href="/housing"
            icon={Home}
            seriesId="CSUSHPISA"
            description="Case-Shiller US National Home Price Index"
            changeLabel="YoY"
          />

          <KeyIndicatorCard
            title="Consumer Sentiment"
            href="/consumer"
            icon={ShoppingCart}
            seriesId="UMCSENT"
            description="University of Michigan Consumer Sentiment"
            changeLabel="YoY"
          />
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="mb-6 text-xl font-semibold">Additional Metrics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickStatCard title="10Y Treasury" seriesId="DGS10" suffix="%" />
            <QuickStatCard title="30Y Mortgage" seriesId="MORTGAGE30US" suffix="%" />
            <QuickStatCard title="Jobless Claims" seriesId="ICSA" suffix="K" divisor={1000} />
            <QuickStatCard title="Personal Saving Rate" seriesId="PSAVERT" suffix="%" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function QuickStatCard({
  title,
  seriesId,
  suffix = "",
  prefix = "",
  divisor = 1,
}: {
  title: string;
  seriesId: string;
  suffix?: string;
  prefix?: string;
  divisor?: number;
}) {
  const { latestValue, momChange, isLoading } = useFredData(seriesId, { years: 1 });

  const displayValue = latestValue ? latestValue / divisor : undefined;

  return (
    <Card className="stat-card-hover">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold tabular-nums">
            {isLoading ? (
              "..."
            ) : (
              <>
                {prefix}
                {displayValue?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                {suffix}
              </>
            )}
          </span>
          {momChange !== null && momChange !== undefined && (
            <span
              className={`text-xs tabular-nums ${
                momChange >= 0 ? "text-positive" : "text-negative"
              }`}
            >
              {momChange >= 0 ? "+" : ""}
              {momChange.toFixed(2)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
