/**
 * Educational context and human impact data for economic indicators
 * This provides the "museum feel" - explaining what data means for everyday Americans
 */

export interface IndicatorContext {
  id: string;
  name: string;
  whyItMatters: string;
  historicalContext: string;
  humanImpact: {
    high: string;
    low: string;
    rising: string;
    falling: string;
  };
  realWorldExamples: string[];
  relatedIndicators: string[];
  keyThresholds?: {
    value: number;
    label: string;
    meaning: string;
  }[];
}

export const economicContext: Record<string, IndicatorContext> = {
  // Inflation
  CPIAUCSL: {
    id: "CPIAUCSL",
    name: "Consumer Price Index (CPI)",
    whyItMatters:
      "CPI measures how much prices have changed for everyday goods and services. It directly affects your purchasing power - how far your paycheck stretches at the grocery store, gas station, and everywhere else you spend money.",
    historicalContext:
      "The Fed targets 2% annual inflation as 'healthy' for the economy. The 2022 spike to 9.1% was the highest since 1981, when Paul Volcker raised rates to 20% to tame inflation.",
    humanImpact: {
      high: "Families struggle to afford basics. Savings lose value. Fixed-income retirees see their purchasing power erode. Workers demand higher wages, but raises often lag behind price increases.",
      low: "While low inflation sounds good, near-zero or negative inflation (deflation) can signal a weak economy. Consumers delay purchases expecting lower prices, businesses cut jobs.",
      rising: "Every trip to the store feels more expensive. Rent renewals bring sticker shock. Planning a budget becomes harder as prices are a moving target.",
      falling: "Relief at the checkout counter. Budgets stretch further. But watch out - if inflation falls too fast, it might signal an economic slowdown ahead.",
    },
    realWorldExamples: [
      "A 3% inflation rate means a $100 grocery bill this year costs $103 next year",
      "At 7% inflation, prices double in about 10 years",
      "Social Security benefits are adjusted annually based on CPI",
    ],
    relatedIndicators: ["FEDFUNDS", "PCEPILFE", "UNRATE"],
    keyThresholds: [
      { value: 2, label: "Fed Target", meaning: "The Federal Reserve's goal for healthy inflation" },
      { value: 5, label: "Elevated", meaning: "Significantly above target, may trigger Fed action" },
      { value: 8, label: "Crisis Level", meaning: "Severe impact on household budgets" },
    ],
  },

  // Federal Funds Rate
  FEDFUNDS: {
    id: "FEDFUNDS",
    name: "Federal Funds Rate",
    whyItMatters:
      "This is the interest rate banks charge each other overnight, but it ripples through your entire financial life. It influences your mortgage rate, car loan, credit card APR, and savings account yield.",
    historicalContext:
      "The Fed cut rates to near-zero after 2008 and again in 2020 to stimulate the economy. The 2022-2023 rate hikes were the fastest in 40 years to combat inflation.",
    humanImpact: {
      high: "Mortgages become expensive, cooling the housing market. Credit card debt is costlier to carry. But savings accounts and CDs finally pay meaningful interest.",
      low: "Great for borrowers - cheap mortgages and car loans. Terrible for savers - your bank account earns almost nothing. Can fuel asset bubbles in stocks and housing.",
      rising: "Monthly payments on variable-rate loans increase. Harder to qualify for mortgages. Stock market often pulls back as borrowing costs rise.",
      falling: "Existing debt becomes cheaper to refinance. Housing market heats up. Often signals the Fed is worried about economic weakness.",
    },
    realWorldExamples: [
      "A 1% rate increase on a $400K mortgage adds ~$240/month to payments",
      "Credit card rates often move in lockstep with the Fed rate",
      "High-yield savings accounts now pay 4-5% after years of near-zero",
    ],
    relatedIndicators: ["DGS10", "MORTGAGE30US", "CPIAUCSL"],
    keyThresholds: [
      { value: 0.25, label: "Near Zero", meaning: "Emergency stimulus mode" },
      { value: 2.5, label: "Neutral", meaning: "Neither stimulating nor restricting economy" },
      { value: 5, label: "Restrictive", meaning: "Actively slowing the economy to fight inflation" },
    ],
  },

  // Unemployment
  UNRATE: {
    id: "UNRATE",
    name: "Unemployment Rate",
    whyItMatters:
      "This measures the percentage of Americans actively looking for work but unable to find it. Beyond the number, each percentage point represents millions of families facing financial uncertainty.",
    historicalContext:
      "Unemployment hit 14.7% in April 2020 - the highest since the Great Depression. The 'natural' unemployment rate (when the economy is healthy) is typically 4-5%.",
    humanImpact: {
      high: "Job searches stretch for months. Families burn through savings. Mental health suffers. Communities see rising poverty and crime rates.",
      low: "Workers have bargaining power for higher wages. Easy to find new jobs. But employers struggle to hire, potentially driving up prices (wage-price spiral).",
      rising: "Anxiety spreads even among the employed. Businesses signal weakness. Consumer spending typically falls as people save more 'just in case.'",
      falling: "Confidence returns. Spending picks up. But if it falls too low, inflation pressures can build as employers compete for scarce workers.",
    },
    realWorldExamples: [
      "Each 1% unemployment = roughly 1.6 million Americans without work",
      "The 2020 pandemic spike saw 20 million jobs lost in a single month",
      "Unemployment benefits typically replace 40-50% of previous wages",
    ],
    relatedIndicators: ["PAYEMS", "ICSA", "CIVPART"],
    keyThresholds: [
      { value: 4, label: "Full Employment", meaning: "Economy at healthy capacity" },
      { value: 6, label: "Elevated", meaning: "Noticeable economic stress" },
      { value: 10, label: "Recession", meaning: "Severe economic downturn" },
    ],
  },

  // GDP
  GDPC1: {
    id: "GDPC1",
    name: "Real GDP",
    whyItMatters:
      "GDP is the total value of everything produced in America. It's the broadest measure of economic health - when GDP grows, there are more jobs, higher incomes, and more opportunities for everyone.",
    historicalContext:
      "The US economy typically grows 2-3% per year. The 2020 pandemic caused the sharpest quarterly drop since WWII, followed by the fastest recovery on record.",
    humanImpact: {
      high: "Strong growth means jobs are plentiful and wages rise. Businesses expand and invest. Government has more tax revenue for services.",
      low: "Slow growth means fewer opportunities. Companies hesitate to hire. Recent graduates struggle to find good jobs.",
      rising: "Optimism spreads through the economy. Businesses invest in new equipment and hire more workers. Stock markets typically rise.",
      falling: "Warning signs of recession. Layoffs may be coming. Companies pull back on spending and expansion plans.",
    },
    realWorldExamples: [
      "US GDP is about $28 trillion - the largest economy in the world",
      "2% growth adds roughly $560 billion to the economy annually",
      "Negative GDP growth for two consecutive quarters = technical recession",
    ],
    relatedIndicators: ["UNRATE", "PAYEMS", "A191RL1Q225SBEA"],
    keyThresholds: [
      { value: 0, label: "Stagnation", meaning: "Economy not growing" },
      { value: 2, label: "Trend Growth", meaning: "Healthy, sustainable pace" },
      { value: 4, label: "Boom", meaning: "Rapid expansion, watch for overheating" },
    ],
  },

  // Federal Debt
  GFDEBTN: {
    id: "GFDEBTN",
    name: "Federal Debt",
    whyItMatters:
      "The national debt represents money the government has borrowed over decades. Interest payments on this debt compete with funding for schools, infrastructure, defense, and social programs.",
    historicalContext:
      "Debt exploded during COVID-19 relief spending and has grown steadily since. At $34+ trillion, it now exceeds annual GDP for the first time since WWII.",
    humanImpact: {
      high: "More tax dollars go to interest payments instead of services. Future generations inherit the burden. Risk of fiscal crisis if investors lose confidence.",
      low: "More flexibility for government spending priorities. Lower interest costs. Greater ability to respond to emergencies.",
      rising: "Debates intensify over spending cuts vs. tax increases. Bond markets may demand higher interest rates to lend.",
      falling: "Rare occurrence. Usually happens during strong economic growth with budget surpluses. Last happened briefly in late 1990s.",
    },
    realWorldExamples: [
      "Interest payments now exceed $1 trillion per year - more than defense spending",
      "Debt per American is roughly $100,000 per person",
      "Debt ceiling debates can threaten government shutdowns and credit rating",
    ],
    relatedIndicators: ["GFDEGDQ188S", "FYFSD", "FDHBPIN"],
    keyThresholds: [
      { value: 60, label: "Manageable (% of GDP)", meaning: "Historically sustainable level" },
      { value: 100, label: "Elevated (% of GDP)", meaning: "Approaching concerning territory" },
      { value: 120, label: "High Risk (% of GDP)", meaning: "Debt sustainability questioned" },
    ],
  },

  // Housing
  CSUSHPISA: {
    id: "CSUSHPISA",
    name: "Home Price Index",
    whyItMatters:
      "For most Americans, their home is their largest asset. Home prices affect everything from household wealth to geographic mobility to intergenerational wealth transfer.",
    historicalContext:
      "The 2008 housing crash wiped out $8 trillion in home equity. Post-pandemic, prices surged 40%+ in many markets, creating affordability crisis.",
    humanImpact: {
      high: "Existing homeowners feel wealthy (paper gains). First-time buyers are priced out. Renters face rising costs as landlords pass on higher property values.",
      low: "Buyers find affordable homes. But homeowners may be 'underwater' - owing more than their home is worth. Banks tighten lending.",
      rising: "FOMO drives bidding wars. Families stretch budgets dangerously. Gentrification displaces long-term residents.",
      falling: "Relief for buyers but pain for sellers. Homeowners feel poorer (wealth effect). Can signal broader economic troubles.",
    },
    realWorldExamples: [
      "Median home price is now over $400,000 nationally",
      "In 2008, 10 million homeowners were underwater on their mortgages",
      "A 20% down payment now requires $80,000+ in many markets",
    ],
    relatedIndicators: ["MORTGAGE30US", "HOUST", "PERMIT"],
    keyThresholds: [
      { value: 5, label: "5% YoY Growth", meaning: "Healthy appreciation" },
      { value: 10, label: "10% YoY Growth", meaning: "Hot market, affordability concerns" },
      { value: 20, label: "20% YoY Growth", meaning: "Bubble territory" },
    ],
  },

  // Consumer Sentiment
  UMCSENT: {
    id: "UMCSENT",
    name: "Consumer Sentiment",
    whyItMatters:
      "Consumer spending drives 70% of the US economy. This survey measures how optimistic Americans feel about their finances and the economy - and confident consumers spend more.",
    historicalContext:
      "Sentiment crashed to record lows in 2022 as inflation surged. It typically leads economic turning points by several months.",
    humanImpact: {
      high: "People feel secure enough to make big purchases - cars, appliances, vacations. Businesses see strong demand and hire more.",
      low: "Fear grips households. People delay purchases and save more. Businesses see falling demand and may cut staff.",
      rising: "Growing optimism encourages spending. Often signals recovery is taking hold. Retail and hospitality sectors benefit first.",
      falling: "Anxiety builds. Consumers trade down to cheaper brands. Big-ticket purchases postponed. Warning sign for retail sector.",
    },
    realWorldExamples: [
      "Index of 100 = 1966 baseline (neutral)",
      "Below 60 typically coincides with recessions",
      "Sentiment predicts car and home sales months in advance",
    ],
    relatedIndicators: ["PCE", "RSXFS", "UNRATE"],
    keyThresholds: [
      { value: 60, label: "Pessimistic", meaning: "Consumers are worried" },
      { value: 80, label: "Neutral", meaning: "Mixed feelings" },
      { value: 100, label: "Optimistic", meaning: "Confident consumers" },
    ],
  },

  // 10-Year Treasury
  DGS10: {
    id: "DGS10",
    name: "10-Year Treasury Yield",
    whyItMatters:
      "This is the interest rate on loans to the US government for 10 years. It's the benchmark for mortgage rates, corporate borrowing, and reflects investor expectations about inflation and growth.",
    historicalContext:
      "Yields hit historic lows of 0.5% in 2020 during COVID panic. The 2023 surge above 5% hadn't been seen since 2007.",
    humanImpact: {
      high: "Mortgage rates rise, cooling housing. Government borrowing costs increase. Savers finally earn decent returns on bonds.",
      low: "Cheap mortgages fuel housing boom. Government can borrow cheaply. But signals investors expect weak growth or deflation.",
      rising: "Existing bond holders lose money. Mortgage applications drop. Stock valuations come under pressure.",
      falling: "Bond holders profit. Mortgage rates improve. Often signals investors fleeing to safety (worried about economy).",
    },
    realWorldExamples: [
      "30-year mortgage rates are typically 1.5-2% above the 10-year Treasury",
      "When 10-year yields rise 1%, bond prices fall roughly 8%",
      "Treasury bonds are considered the world's safest investment",
    ],
    relatedIndicators: ["FEDFUNDS", "MORTGAGE30US", "T10Y2Y"],
    keyThresholds: [
      { value: 2, label: "Low Yield", meaning: "Investors expect slow growth or deflation" },
      { value: 4, label: "Normal", meaning: "Historical average range" },
      { value: 5, label: "Elevated", meaning: "High borrowing costs across economy" },
    ],
  },

  // M2 Money Supply
  M2SL: {
    id: "M2SL",
    name: "M2 Money Supply",
    whyItMatters:
      "M2 measures all the money in circulation - cash, checking accounts, and easily accessible savings. Changes in money supply can foreshadow inflation or deflation.",
    historicalContext:
      "M2 exploded 40% during 2020-2021 due to stimulus and Fed policy. Many economists blame this for the 2022 inflation surge.",
    humanImpact: {
      high: "More money chasing same goods = inflation. Asset prices rise. Dollar's purchasing power erodes.",
      low: "Credit becomes scarce. Economic activity can stall. Deflation risk emerges.",
      rising: "Economy being stimulated. Watch for inflation ahead. Asset bubbles may form.",
      falling: "Rare and concerning. Signals credit contraction. Can precede recession.",
    },
    realWorldExamples: [
      "M2 is currently about $21 trillion",
      "The 2020-2021 increase added $6 trillion to the money supply",
      "Milton Friedman: 'Inflation is always and everywhere a monetary phenomenon'",
    ],
    relatedIndicators: ["CPIAUCSL", "FEDFUNDS", "WALCL"],
  },
};

/**
 * Get context for a specific indicator
 */
export function getIndicatorContext(seriesId: string): IndicatorContext | undefined {
  return economicContext[seriesId];
}

/**
 * Get human impact based on current conditions
 */
export function getHumanImpactSentiment(
  seriesId: string,
  value: number,
  change: number
): string {
  const context = economicContext[seriesId];
  if (!context) return "";

  // Determine which sentiment to show based on change direction
  if (Math.abs(change) < 0.5) {
    // Stable - show based on absolute level
    if (seriesId === "UNRATE") {
      return value > 6 ? context.humanImpact.high : context.humanImpact.low;
    }
    return value > 0 ? context.humanImpact.high : context.humanImpact.low;
  }

  return change > 0 ? context.humanImpact.rising : context.humanImpact.falling;
}
