import { format, subYears } from "date-fns";

const FRED_BASE_URL = "https://api.stlouisfed.org/fred";

export interface FredSeriesObservation {
  date: string;
  value: string;
}

export interface FredSeriesInfo {
  id: string;
  title: string;
  observation_start: string;
  observation_end: string;
  frequency: string;
  units: string;
  seasonal_adjustment: string;
  last_updated: string;
  notes?: string;
}

export interface FredResponse<T> {
  realtime_start: string;
  realtime_end: string;
  observation_start?: string;
  observation_end?: string;
  units?: string;
  output_type?: number;
  file_type?: string;
  order_by?: string;
  sort_order?: string;
  count?: number;
  offset?: number;
  limit?: number;
  observations?: T[];
  seriess?: T[];
}

// Common FRED series IDs for US economic data
export const FRED_SERIES = {
  // Inflation - Headline
  CPIAUCSL: { id: "CPIAUCSL", name: "Consumer Price Index (All Urban)", category: "inflation" },
  CPILFESL: { id: "CPILFESL", name: "Core CPI (Less Food & Energy)", category: "inflation" },
  PCEPI: { id: "PCEPI", name: "PCE Price Index", category: "inflation" },
  PCEPILFE: { id: "PCEPILFE", name: "Core PCE Price Index", category: "inflation" },

  // Inflation - CPI Components
  CPIUFDSL: { id: "CPIUFDSL", name: "CPI: Food", category: "inflation-components" },
  CPIENGSL: { id: "CPIENGSL", name: "CPI: Energy", category: "inflation-components" },
  CUSR0000SAH1: { id: "CUSR0000SAH1", name: "CPI: Shelter", category: "inflation-components" },
  CUSR0000SAM2: { id: "CUSR0000SAM2", name: "CPI: Medical Care Services", category: "inflation-components" },
  CUSR0000SETG01: { id: "CUSR0000SETG01", name: "CPI: Gasoline", category: "inflation-components" },
  CUSR0000SAT1: { id: "CUSR0000SAT1", name: "CPI: Transportation", category: "inflation-components" },
  CUUR0000SA0E: { id: "CUUR0000SA0E", name: "CPI: Energy in CPI", category: "inflation-components" },
  CUSR0000SAE1: { id: "CUSR0000SAE1", name: "CPI: Education", category: "inflation-components" },

  // GDP
  GDP: { id: "GDP", name: "Gross Domestic Product", category: "gdp" },
  GDPC1: { id: "GDPC1", name: "Real GDP", category: "gdp" },
  A191RL1Q225SBEA: { id: "A191RL1Q225SBEA", name: "Real GDP Growth Rate", category: "gdp" },

  // Employment - Headline
  UNRATE: { id: "UNRATE", name: "Unemployment Rate", category: "employment" },
  PAYEMS: { id: "PAYEMS", name: "Total Nonfarm Payrolls", category: "employment" },
  CIVPART: { id: "CIVPART", name: "Labor Force Participation Rate", category: "employment" },
  ICSA: { id: "ICSA", name: "Initial Jobless Claims", category: "employment" },

  // Employment - Sector Breakdowns
  MANEMP: { id: "MANEMP", name: "Manufacturing Employment", category: "employment-sectors" },
  USCONS: { id: "USCONS", name: "Construction Employment", category: "employment-sectors" },
  USFIRE: { id: "USFIRE", name: "Financial Activities Employment", category: "employment-sectors" },
  USPBS: { id: "USPBS", name: "Professional & Business Services", category: "employment-sectors" },
  USEHS: { id: "USEHS", name: "Education & Health Services", category: "employment-sectors" },
  USLAH: { id: "USLAH", name: "Leisure & Hospitality", category: "employment-sectors" },
  USINFO: { id: "USINFO", name: "Information Sector", category: "employment-sectors" },
  USMINE: { id: "USMINE", name: "Mining & Logging", category: "employment-sectors" },
  CES4300000001: { id: "CES4300000001", name: "Transportation & Warehousing", category: "employment-sectors" },
  USWTRADE: { id: "USWTRADE", name: "Wholesale Trade", category: "employment-sectors" },
  USTRADE: { id: "USTRADE", name: "Retail Trade", category: "employment-sectors" },
  USGOVT: { id: "USGOVT", name: "Government", category: "employment-sectors" },

  // Interest Rates
  FEDFUNDS: { id: "FEDFUNDS", name: "Federal Funds Rate", category: "rates" },
  DGS10: { id: "DGS10", name: "10-Year Treasury Yield", category: "rates" },
  DGS2: { id: "DGS2", name: "2-Year Treasury Yield", category: "rates" },
  T10Y2Y: { id: "T10Y2Y", name: "10Y-2Y Treasury Spread", category: "rates" },
  DGS1: { id: "DGS1", name: "1-Year Treasury Yield", category: "rates" },
  DGS5: { id: "DGS5", name: "5-Year Treasury Yield", category: "rates" },
  DGS30: { id: "DGS30", name: "30-Year Treasury Yield", category: "rates" },

  // Housing
  CSUSHPISA: { id: "CSUSHPISA", name: "Case-Shiller Home Price Index", category: "housing" },
  HOUST: { id: "HOUST", name: "Housing Starts", category: "housing" },
  PERMIT: { id: "PERMIT", name: "Building Permits", category: "housing" },
  MORTGAGE30US: { id: "MORTGAGE30US", name: "30-Year Mortgage Rate", category: "housing" },
  EXHOSLUSM495S: { id: "EXHOSLUSM495S", name: "Existing Home Sales", category: "housing" },
  MSACSR: { id: "MSACSR", name: "Monthly Supply of Homes", category: "housing" },

  // Consumer
  UMCSENT: { id: "UMCSENT", name: "Consumer Sentiment", category: "consumer" },
  PCE: { id: "PCE", name: "Personal Consumption Expenditures", category: "consumer" },
  PSAVERT: { id: "PSAVERT", name: "Personal Saving Rate", category: "consumer" },
  TOTALSL: { id: "TOTALSL", name: "Consumer Credit", category: "consumer" },
  DSPIC96: { id: "DSPIC96", name: "Real Disposable Personal Income", category: "consumer" },

  // Money Supply
  M2SL: { id: "M2SL", name: "M2 Money Supply", category: "monetary" },
  WALCL: { id: "WALCL", name: "Fed Balance Sheet", category: "monetary" },
} as const;

export type FredSeriesId = keyof typeof FRED_SERIES;

class FredAPI {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FRED_API_KEY || "";
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const searchParams = new URLSearchParams({
      api_key: this.apiKey,
      file_type: "json",
      ...params,
    });

    const url = `${FRED_BASE_URL}${endpoint}?${searchParams}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getSeriesInfo(seriesId: string): Promise<FredSeriesInfo | null> {
    try {
      const data = await this.fetch<FredResponse<FredSeriesInfo>>("/series", {
        series_id: seriesId,
      });
      return data.seriess?.[0] || null;
    } catch (error) {
      console.error(`Error fetching series info for ${seriesId}:`, error);
      return null;
    }
  }

  async getSeriesObservations(
    seriesId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      sortOrder?: "asc" | "desc";
      units?: "lin" | "chg" | "ch1" | "pch" | "pc1" | "pca" | "cch" | "cca" | "log";
      frequency?: "d" | "w" | "bw" | "m" | "q" | "sa" | "a";
    } = {}
  ): Promise<FredSeriesObservation[]> {
    const {
      startDate = subYears(new Date(), 10),
      endDate = new Date(),
      limit,
      sortOrder = "desc",
      units,
      frequency,
    } = options;

    const params: Record<string, string> = {
      series_id: seriesId,
      observation_start: format(startDate, "yyyy-MM-dd"),
      observation_end: format(endDate, "yyyy-MM-dd"),
      sort_order: sortOrder,
    };

    if (limit) params.limit = limit.toString();
    if (units) params.units = units;
    if (frequency) params.frequency = frequency;

    try {
      const data = await this.fetch<FredResponse<FredSeriesObservation>>("/series/observations", params);
      return (data.observations || []).filter(obs => obs.value !== ".");
    } catch (error) {
      console.error(`Error fetching observations for ${seriesId}:`, error);
      return [];
    }
  }

  async getLatestValue(seriesId: string): Promise<{ value: number; date: string } | null> {
    const observations = await this.getSeriesObservations(seriesId, { limit: 1, sortOrder: "desc" });
    if (observations.length === 0) return null;

    return {
      value: parseFloat(observations[0].value),
      date: observations[0].date,
    };
  }

  async getMultipleSeries(
    seriesIds: string[],
    options: Parameters<typeof this.getSeriesObservations>[1] = {}
  ): Promise<Record<string, FredSeriesObservation[]>> {
    const results = await Promise.all(
      seriesIds.map(async (id) => ({
        id,
        data: await this.getSeriesObservations(id, options),
      }))
    );

    return results.reduce(
      (acc, { id, data }) => {
        acc[id] = data;
        return acc;
      },
      {} as Record<string, FredSeriesObservation[]>
    );
  }

  // Calculate year-over-year change
  calculateYoYChange(observations: FredSeriesObservation[]): number | null {
    if (observations.length < 2) return null;

    const sorted = [...observations].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latest = parseFloat(sorted[0].value);

    // Find observation from ~12 months ago
    const latestDate = new Date(sorted[0].date);
    const yearAgo = subYears(latestDate, 1);

    const yearAgoObs = sorted.find((obs) => {
      const obsDate = new Date(obs.date);
      const diffDays = Math.abs((latestDate.getTime() - obsDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 330 && diffDays <= 400; // Allow some flexibility
    });

    if (!yearAgoObs) return null;

    const yearAgoValue = parseFloat(yearAgoObs.value);
    return ((latest - yearAgoValue) / yearAgoValue) * 100;
  }

  // Calculate month-over-month change
  calculateMoMChange(observations: FredSeriesObservation[]): number | null {
    if (observations.length < 2) return null;

    const sorted = [...observations].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latest = parseFloat(sorted[0].value);
    const previous = parseFloat(sorted[1].value);

    return ((latest - previous) / previous) * 100;
  }
}

export const fredAPI = new FredAPI();
export default fredAPI;
