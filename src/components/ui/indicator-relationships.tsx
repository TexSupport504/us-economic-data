"use client";

import { ArrowRight, Link2, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getIndicatorContext, economicContext } from "@/lib/data/economic-context";

// Map FRED series IDs to their dashboard page routes
const seriesRoutes: Record<string, string> = {
  CPIAUCSL: "/inflation",
  PCEPILFE: "/inflation",
  FEDFUNDS: "/interest-rates",
  DGS10: "/interest-rates",
  MORTGAGE30US: "/housing",
  UNRATE: "/employment",
  PAYEMS: "/employment",
  ICSA: "/employment",
  CIVPART: "/employment",
  GDPC1: "/gdp",
  A191RL1Q225SBEA: "/gdp",
  GFDEBTN: "/debt",
  GFDEGDQ188S: "/debt",
  FYFSD: "/debt",
  FDHBPIN: "/debt",
  CSUSHPISA: "/housing",
  HOUST: "/housing",
  PERMIT: "/housing",
  UMCSENT: "/consumer",
  PCE: "/consumer",
  RSXFS: "/consumer",
  M2SL: "/monetary-policy",
  WALCL: "/monetary-policy",
  T10Y2Y: "/interest-rates",
};

// Relationship descriptions between indicators
const relationshipDescriptions: Record<string, Record<string, string>> = {
  CPIAUCSL: {
    FEDFUNDS: "When inflation rises, the Fed typically raises interest rates to cool spending",
    UNRATE: "High inflation can initially boost employment, but sustained inflation often leads to job losses",
    PCEPILFE: "Core PCE is the Fed's preferred inflation measure - both track price changes"
  },
  FEDFUNDS: {
    DGS10: "The Fed rate influences but doesn't directly control long-term Treasury yields",
    MORTGAGE30US: "Mortgage rates typically move with Fed policy, affecting home affordability",
    CPIAUCSL: "The Fed raises rates to fight inflation, and cuts them to stimulate growth"
  },
  UNRATE: {
    GDPC1: "Low unemployment usually means strong GDP growth, and vice versa",
    PAYEMS: "Payrolls directly feed into unemployment calculations",
    CPIAUCSL: "The Phillips Curve suggests a tradeoff between unemployment and inflation"
  },
  GDPC1: {
    UNRATE: "Economic growth creates jobs; recessions cause unemployment to spike",
    GFDEBTN: "Strong GDP growth can help manage debt burden through higher tax revenues",
    PAYEMS: "GDP growth is closely tied to job creation across sectors"
  },
  GFDEBTN: {
    GFDEGDQ188S: "Debt-to-GDP shows sustainability - high debt is less concerning if GDP is also high",
    FDHBPIN: "As debt grows, so do interest payments, creating fiscal pressure",
    FEDFUNDS: "Higher interest rates increase the cost of servicing government debt"
  },
  DGS10: {
    MORTGAGE30US: "The 10-year Treasury is the benchmark for mortgage rate pricing",
    FEDFUNDS: "The Fed influences short rates directly; 10-year responds to inflation expectations",
    T10Y2Y: "The spread between 10Y and 2Y yields signals recession risk"
  },
};

interface IndicatorRelationshipsProps {
  seriesId: string;
  className?: string;
}

export function IndicatorRelationships({ seriesId, className }: IndicatorRelationshipsProps) {
  const context = getIndicatorContext(seriesId);

  if (!context || context.relatedIndicators.length === 0) {
    return null;
  }

  const relationships = relationshipDescriptions[seriesId] || {};

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 className="h-4 w-4 text-primary" />
          How {context.name} Connects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {context.relatedIndicators.map((relatedId, index) => {
          const relatedContext = economicContext[relatedId];
          const route = seriesRoutes[relatedId];
          const description = relationships[relatedId];

          if (!relatedContext) {
            return (
              <div
                key={relatedId}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Badge variant="secondary">{relatedId}</Badge>
              </div>
            );
          }

          const content = (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group flex items-start gap-3 rounded-lg border p-3 transition-colors",
                route && "hover:bg-muted/50 cursor-pointer"
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{relatedContext.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {relatedId}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {description || `Related economic indicator that influences or is influenced by ${context.name}`}
                </p>
              </div>
              {route && (
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              )}
            </motion.div>
          );

          return route ? (
            <Link key={relatedId} href={route}>
              {content}
            </Link>
          ) : (
            <div key={relatedId}>{content}</div>
          );
        })}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Economic indicators are interconnected. Changes in one often signal or cause changes in others.
        </div>
      </CardContent>
    </Card>
  );
}
