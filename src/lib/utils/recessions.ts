// NBER Recession Dates
// Source: https://www.nber.org/research/data/us-business-cycle-expansions-and-contractions

export interface Recession {
  start: string;  // ISO date string
  end: string;    // ISO date string
  name?: string;  // Optional name for the recession
}

// US Recessions since 1970 (most relevant for economic data visualization)
export const RECESSIONS: Recession[] = [
  { start: "1970-01-01", end: "1970-11-01", name: "1970 Recession" },
  { start: "1973-12-01", end: "1975-03-01", name: "1973-75 Recession" },
  { start: "1980-02-01", end: "1980-07-01", name: "1980 Recession" },
  { start: "1981-08-01", end: "1982-11-01", name: "1981-82 Recession" },
  { start: "1990-08-01", end: "1991-03-01", name: "1990-91 Recession" },
  { start: "2001-04-01", end: "2001-11-01", name: "Dot-com Recession" },
  { start: "2008-01-01", end: "2009-06-01", name: "Great Recession" },
  { start: "2020-03-01", end: "2020-04-01", name: "COVID-19 Recession" },
];

// Get recessions that fall within a date range
export function getVisibleRecessions(
  startDate: Date | string,
  endDate: Date | string
): Recession[] {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  return RECESSIONS.filter((recession) => {
    const recessionStart = new Date(recession.start);
    const recessionEnd = new Date(recession.end);

    // Include if any part of the recession overlaps with the date range
    return recessionEnd >= start && recessionStart <= end;
  });
}

// Clamp recession dates to the visible range
export function clampRecession(
  recession: Recession,
  startDate: Date | string,
  endDate: Date | string
): { start: string; end: string } {
  const rangeStart = typeof startDate === "string" ? new Date(startDate) : startDate;
  const rangeEnd = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  const recessionStart = new Date(recession.start);
  const recessionEnd = new Date(recession.end);

  return {
    start: recessionStart < rangeStart 
      ? rangeStart.toISOString().split("T")[0] 
      : recession.start,
    end: recessionEnd > rangeEnd 
      ? rangeEnd.toISOString().split("T")[0] 
      : recession.end,
  };
}
