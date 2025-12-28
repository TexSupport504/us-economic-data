/**
 * Major economic events for chart annotations
 * These events are significant markers that help contextualize economic data
 */

export interface EconomicEvent {
  date: string;
  label: string;
  description: string;
  type: "recession" | "policy" | "crisis" | "election" | "milestone";
  color?: string;
}

export const economicEvents: EconomicEvent[] = [
  // Recessions (NBER dates)
  {
    date: "2020-02",
    label: "COVID-19",
    description: "COVID-19 Pandemic begins in the US",
    type: "crisis",
  },
  {
    date: "2008-12",
    label: "Great Recession",
    description: "Financial crisis and Great Recession",
    type: "recession",
  },
  {
    date: "2001-03",
    label: "Dot-com Bust",
    description: "Dot-com bubble burst recession",
    type: "recession",
  },

  // Federal Reserve Policy Events
  {
    date: "2022-03",
    label: "Rate Hikes Begin",
    description: "Fed begins aggressive rate hiking cycle",
    type: "policy",
  },
  {
    date: "2020-03",
    label: "Emergency Rate Cut",
    description: "Fed cuts rates to near zero",
    type: "policy",
  },
  {
    date: "2015-12",
    label: "First Rate Hike",
    description: "First rate increase since 2008",
    type: "policy",
  },
  {
    date: "2012-09",
    label: "QE3",
    description: "Fed announces QE3 - unlimited bond buying",
    type: "policy",
  },
  {
    date: "2010-11",
    label: "QE2",
    description: "Fed announces second round of quantitative easing",
    type: "policy",
  },
  {
    date: "2008-11",
    label: "QE1",
    description: "Fed begins quantitative easing",
    type: "policy",
  },

  // Major Crises
  {
    date: "2023-03",
    label: "Bank Crisis",
    description: "SVB and regional bank failures",
    type: "crisis",
  },
  {
    date: "2011-08",
    label: "Debt Ceiling",
    description: "US credit rating downgraded",
    type: "crisis",
  },

  // Elections (inaugurations)
  {
    date: "2021-01",
    label: "Biden",
    description: "Biden administration begins",
    type: "election",
  },
  {
    date: "2017-01",
    label: "Trump",
    description: "Trump administration begins",
    type: "election",
  },
  {
    date: "2009-01",
    label: "Obama",
    description: "Obama administration begins",
    type: "election",
  },

  // Economic Milestones
  {
    date: "2023-01",
    label: "$31T Debt",
    description: "US national debt exceeds $31 trillion",
    type: "milestone",
  },
  {
    date: "2022-06",
    label: "9% CPI",
    description: "Inflation peaks at 9.1% YoY",
    type: "milestone",
  },
  {
    date: "2020-04",
    label: "14.7% Unemployment",
    description: "Unemployment peaks during COVID",
    type: "milestone",
  },
  {
    date: "2019-09",
    label: "Repo Crisis",
    description: "Fed intervenes in repo market",
    type: "crisis",
  },
];

// Get color for event type
export function getEventColor(type: EconomicEvent["type"]): string {
  switch (type) {
    case "recession":
      return "var(--negative)";
    case "crisis":
      return "var(--warning)";
    case "policy":
      return "var(--chart-1)";
    case "election":
      return "var(--chart-4)";
    case "milestone":
      return "var(--chart-2)";
    default:
      return "var(--muted-foreground)";
  }
}

// Filter events within a date range
export function getEventsInRange(
  startDate: string,
  endDate: string,
  types?: EconomicEvent["type"][]
): EconomicEvent[] {
  return economicEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const inRange = eventDate >= start && eventDate <= end;
    const matchesType = !types || types.length === 0 || types.includes(event.type);

    return inRange && matchesType;
  });
}

// Get events for a specific year range
export function getEventsForYears(years: number): EconomicEvent[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - years);

  return getEventsInRange(
    startDate.toISOString().slice(0, 7),
    endDate.toISOString().slice(0, 7)
  );
}
