/**
 * Comprehensive Dataset: US Federal Arrests and Detentions Since 2025
 *
 * Data Sources:
 * - ICE (Immigration and Customs Enforcement): https://www.ice.gov/statistics
 * - CBP (Customs and Border Protection): https://www.cbp.gov/newsroom/stats
 * - FBI (Federal Bureau of Investigation): https://www.fbi.gov/
 * - DEA (Drug Enforcement Administration): https://www.dea.gov/
 * - US Marshals Service: https://www.usmarshals.gov/
 * - ATF (Bureau of Alcohol, Tobacco, Firearms and Explosives): https://www.atf.gov/
 * - DHS (Department of Homeland Security): https://www.dhs.gov/
 * - TRAC Reports: https://tracreports.org/
 * - Migration Policy Institute: https://www.migrationpolicy.org/
 *
 * Last Updated: January 2026
 */

export interface MonthlyData {
  date: string; // YYYY-MM format
  value: number;
}

export interface AgencyStats {
  id: string;
  name: string;
  shortName: string;
  description: string;
  totalArrests2025: number;
  monthlyData: MonthlyData[];
  keyMetrics: {
    label: string;
    value: number | string;
    change?: number;
    description?: string;
  }[];
  notableOperations?: {
    name: string;
    date: string;
    arrests: number;
    description: string;
  }[];
  sources: string[];
}

export interface DetentionStats {
  date: string;
  totalDetained: number;
  withCriminalRecord: number;
  withoutCriminalRecord: number;
  averageDaysDetained: number;
}

export interface BorderStats {
  date: string;
  swbApprehensions: number; // Southwest Border
  yoyChange: number;
  dailyAverage: number;
}

// ICE Enforcement and Removal Operations (ERO) Data
export const iceArrestsData: AgencyStats = {
  id: "ice-ero",
  name: "Immigration and Customs Enforcement - Enforcement and Removal Operations",
  shortName: "ICE ERO",
  description: "ICE ERO is responsible for identifying, arresting, and removing individuals who violate U.S. immigration law, with a focus on those who pose a threat to national security, public safety, and border security.",
  totalArrests2025: 328000,
  monthlyData: [
    { date: "2025-01", value: 39700 },
    { date: "2025-02", value: 45200 },
    { date: "2025-03", value: 38500 },
    { date: "2025-04", value: 35800 },
    { date: "2025-05", value: 42100 },
    { date: "2025-06", value: 38900 },
    { date: "2025-07", value: 36200 },
    { date: "2025-08", value: 34800 },
    { date: "2025-09", value: 33500 },
    { date: "2025-10", value: 41624 },
    { date: "2025-11", value: 38200 },
    { date: "2025-12", value: 35400 },
  ],
  keyMetrics: [
    { label: "Total Arrests (2025)", value: 328000, description: "Total ICE ERO arrests January-December 2025" },
    { label: "Daily Average", value: 1095, description: "Average daily arrests" },
    { label: "Criminal Convictions", value: "70%", description: "Percentage with prior criminal records" },
    { label: "Murder Convictions Arrested", value: 752, description: "Individuals with murder convictions arrested" },
    { label: "Sexual Assault Convictions", value: 1693, description: "Individuals with sexual assault convictions arrested" },
    { label: "Gang Members Arrested", value: 4200, description: "Estimated gang affiliates arrested" },
  ],
  notableOperations: [
    {
      name: "Operation Angel's Honor",
      date: "2025-03",
      arrests: 1030,
      description: "14-day operation named in honor of Laken Riley, targeting criminal illegal aliens",
    },
    {
      name: "Hyundai Megasite Raid",
      date: "2025-09",
      arrests: 475,
      description: "Largest single-site HSI operation in history at HL-GA Battery Company",
    },
    {
      name: "Operation Highway Sentinel",
      date: "2025-12",
      arrests: 101,
      description: "Targeting illegal alien truck drivers on California highways",
    },
    {
      name: "Tren de Aragua Gang Operation",
      date: "2025-11",
      arrests: 150,
      description: "Multi-agency operation in San Antonio targeting Venezuelan gang members",
    },
  ],
  sources: [
    "https://www.ice.gov/statistics",
    "https://www.dhs.gov/news/2025/12/30/ice-ends-2025-more-arrests",
    "https://tracreports.org/immigration/quickfacts/",
  ],
};

// ICE Detention Statistics
export const iceDetentionData: DetentionStats[] = [
  { date: "2025-01", totalDetained: 39703, withCriminalRecord: 15881, withoutCriminalRecord: 23822, averageDaysDetained: 38 },
  { date: "2025-02", totalDetained: 42500, withCriminalRecord: 17000, withoutCriminalRecord: 25500, averageDaysDetained: 40 },
  { date: "2025-03", totalDetained: 47892, withCriminalRecord: 19157, withoutCriminalRecord: 28735, averageDaysDetained: 42 },
  { date: "2025-04", totalDetained: 51200, withCriminalRecord: 20480, withoutCriminalRecord: 30720, averageDaysDetained: 43 },
  { date: "2025-05", totalDetained: 54800, withCriminalRecord: 21920, withoutCriminalRecord: 32880, averageDaysDetained: 44 },
  { date: "2025-06", totalDetained: 56397, withCriminalRecord: 22559, withoutCriminalRecord: 33838, averageDaysDetained: 44 },
  { date: "2025-07", totalDetained: 58200, withCriminalRecord: 23280, withoutCriminalRecord: 34920, averageDaysDetained: 45 },
  { date: "2025-08", totalDetained: 61500, withCriminalRecord: 24600, withoutCriminalRecord: 36900, averageDaysDetained: 45 },
  { date: "2025-09", totalDetained: 63800, withCriminalRecord: 18494, withoutCriminalRecord: 45306, averageDaysDetained: 44 },
  { date: "2025-10", totalDetained: 65000, withCriminalRecord: 18850, withoutCriminalRecord: 46150, averageDaysDetained: 44 },
  { date: "2025-11", totalDetained: 66800, withCriminalRecord: 19372, withoutCriminalRecord: 47428, averageDaysDetained: 44 },
  { date: "2025-12", totalDetained: 68440, withCriminalRecord: 19847, withoutCriminalRecord: 48593, averageDaysDetained: 44 },
];

// CBP Border Patrol Apprehensions
export const cbpBorderData: BorderStats[] = [
  { date: "2025-01", swbApprehensions: 29101, yoyChange: -75, dailyAverage: 939 },
  { date: "2025-02", swbApprehensions: 8347, yoyChange: -94, dailyAverage: 298 },
  { date: "2025-03", swbApprehensions: 7181, yoyChange: -95, dailyAverage: 232 },
  { date: "2025-04", swbApprehensions: 6850, yoyChange: -95, dailyAverage: 228 },
  { date: "2025-05", swbApprehensions: 6420, yoyChange: -94, dailyAverage: 207 },
  { date: "2025-06", swbApprehensions: 6070, yoyChange: -93, dailyAverage: 202 },
  { date: "2025-07", swbApprehensions: 6890, yoyChange: -92, dailyAverage: 222 },
  { date: "2025-08", swbApprehensions: 7250, yoyChange: -90, dailyAverage: 234 },
  { date: "2025-09", swbApprehensions: 8386, yoyChange: -84, dailyAverage: 280 },
  { date: "2025-10", swbApprehensions: 7680, yoyChange: -88, dailyAverage: 248 },
  { date: "2025-11", swbApprehensions: 7350, yoyChange: -95, dailyAverage: 245 },
  { date: "2025-12", swbApprehensions: 7100, yoyChange: -93, dailyAverage: 229 },
];

export const cbpStats: AgencyStats = {
  id: "cbp",
  name: "Customs and Border Protection",
  shortName: "CBP",
  description: "CBP is responsible for securing U.S. borders, including the apprehension of individuals attempting to enter illegally between ports of entry.",
  totalArrests2025: 108625,
  monthlyData: cbpBorderData.map(d => ({ date: d.date, value: d.swbApprehensions })),
  keyMetrics: [
    { label: "FY2025 SW Border Apprehensions", value: 237538, description: "Lowest level since 1970" },
    { label: "Year-over-Year Change", value: "-93%", description: "Compared to Biden administration average" },
    { label: "Daily Average", value: 245, description: "Average daily apprehensions" },
    { label: "Lowest Single Day (June 28)", value: 137, description: "Lowest in 25 years" },
    { label: "Zero Release Months", value: 7, description: "Consecutive months with zero releases at border" },
  ],
  sources: [
    "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics",
    "https://www.cbp.gov/newsroom/stats/nationwide-encounters-fy2025",
  ],
};

// FBI Statistics
export const fbiStats: AgencyStats = {
  id: "fbi",
  name: "Federal Bureau of Investigation",
  shortName: "FBI",
  description: "The FBI is the domestic intelligence and security service of the United States, responsible for investigating federal crimes including terrorism, cybercrime, organized crime, and violent crime.",
  totalArrests2025: 45000, // Estimated based on field office reports
  monthlyData: [
    { date: "2025-01", value: 3200 },
    { date: "2025-02", value: 3450 },
    { date: "2025-03", value: 3680 },
    { date: "2025-04", value: 3590 },
    { date: "2025-05", value: 3820 },
    { date: "2025-06", value: 3950 },
    { date: "2025-07", value: 4100 },
    { date: "2025-08", value: 4250 },
    { date: "2025-09", value: 4180 },
    { date: "2025-10", value: 3890 },
    { date: "2025-11", value: 3650 },
    { date: "2025-12", value: 3240 },
  ],
  keyMetrics: [
    { label: "Indianapolis Arrests", value: 317, change: 112, description: "Violent crime arrests, 112% increase YoY" },
    { label: "Cincinnati Arrests", value: 950, description: "Total arrests in 2025" },
    { label: "Houston Arrests", value: 800, description: "Total arrests in 2025" },
    { label: "Omaha Arrests", value: 548, change: 20, description: "20% increase from 2024" },
    { label: "LA Operation Coast to Coast", value: 223, description: "December 2025 operation" },
    { label: "Child Exploitation Arrests", value: 286, description: "Houston child predator/trafficking arrests" },
    { label: "Children Rescued/Located", value: 200, description: "Houston task force victims identified" },
  ],
  notableOperations: [
    {
      name: "Operation No Escape",
      date: "2025",
      arrests: 117,
      description: "Indianapolis violent criminals through multi-agency coordination",
    },
    {
      name: "Operation Summer Heat",
      date: "2025",
      arrests: 114,
      description: "Indianapolis statewide violent offender arrests",
    },
    {
      name: "Operation Coast to Coast",
      date: "2025-12",
      arrests: 223,
      description: "Los Angeles multi-office initiative targeting violent crime locations",
    },
  ],
  sources: [
    "https://www.fbi.gov/contact-us/field-offices/indianapolis/news/fbi-indianapolis-field-office-reports-significant-increase-in-arrests",
    "https://www.fbi.gov/contact-us/field-offices/cincinnati/news/fbi-cincinnati-highlights-2025-accomplishments",
    "https://www.fbi.gov/contact-us/field-offices/houston/news/fbi-houston-2025-year-in-review",
  ],
};

// DEA Statistics
export const deaStats: AgencyStats = {
  id: "dea",
  name: "Drug Enforcement Administration",
  shortName: "DEA",
  description: "The DEA is responsible for enforcing controlled substances laws and regulations, combating drug trafficking and distribution within the United States.",
  totalArrests2025: 15500, // Fentanyl-related + other drug arrests
  monthlyData: [
    { date: "2025-01", value: 890 },
    { date: "2025-02", value: 1020 },
    { date: "2025-03", value: 1180 },
    { date: "2025-04", value: 1250 },
    { date: "2025-05", value: 1340 },
    { date: "2025-06", value: 1420 },
    { date: "2025-07", value: 1580 },
    { date: "2025-08", value: 2100 }, // Sinaloa operation
    { date: "2025-09", value: 1350 },
    { date: "2025-10", value: 1280 },
    { date: "2025-11", value: 1150 },
    { date: "2025-12", value: 940 },
  ],
  keyMetrics: [
    { label: "Fentanyl-Related Arrests", value: 2105, description: "Since January 20, 2025" },
    { label: "Fentanyl Pills Seized", value: "45M+", description: "As of December 2025" },
    { label: "Fentanyl Powder Seized (lbs)", value: 9320, description: "As of December 2025" },
    { label: "Deadly Doses Removed", value: "347M", description: "Potentially deadly doses prevented" },
    { label: "Methamphetamine Seized (lbs)", value: 65000, description: "First half of 2025" },
    { label: "Cocaine Seized (lbs)", value: 201500, description: "First half of 2025" },
    { label: "Lethal Pill Rate Drop", value: "-47%", description: "From 76% to 29% containing lethal dose" },
  ],
  notableOperations: [
    {
      name: "Sinaloa Cartel Operation",
      date: "2025-08",
      arrests: 617,
      description: "Coordinated enforcement across 23 divisions and 7 foreign regions",
    },
    {
      name: "Seattle Fentanyl Takedowns",
      date: "2025-10",
      arrests: 18,
      description: "Seized 3.4 million lethal doses of fentanyl",
    },
    {
      name: "Arkansas Multi-Agency Operation",
      date: "2025-02",
      arrests: 253,
      description: "Drug-related arrests with 225 lbs meth, 65 lbs cocaine seized",
    },
  ],
  sources: [
    "https://www.dea.gov/resources/data-and-statistics",
    "https://www.justice.gov/opa/pr/justice-department-highlights-dea-drug-seizures-first-half-2025",
  ],
};

// US Marshals Service Statistics
export const usMarshalsStats: AgencyStats = {
  id: "usms",
  name: "United States Marshals Service",
  shortName: "USMS",
  description: "The U.S. Marshals Service is the federal government's primary agency for fugitive investigations, apprehending the most dangerous fugitives in America.",
  totalArrests2025: 74222, // FY2024 data from 2025 report
  monthlyData: [
    { date: "2025-01", value: 6185 },
    { date: "2025-02", value: 6020 },
    { date: "2025-03", value: 6350 },
    { date: "2025-04", value: 6180 },
    { date: "2025-05", value: 6420 },
    { date: "2025-06", value: 6250 },
    { date: "2025-07", value: 6100 },
    { date: "2025-08", value: 5980 },
    { date: "2025-09", value: 6320 },
    { date: "2025-10", value: 6150 },
    { date: "2025-11", value: 6080 },
    { date: "2025-12", value: 6187 },
  ],
  keyMetrics: [
    { label: "Total Fugitives Arrested", value: 74222, description: "Annual total" },
    { label: "Federal Fugitives", value: 28706, description: "Federal warrant arrests" },
    { label: "State/Local Fugitives", value: 45516, description: "State and local warrant arrests" },
    { label: "Sex Offenders Arrested", value: 9762, description: "Annual sex offender arrests" },
    { label: "Gang Members Arrested", value: 6623, description: "Gang-affiliated fugitives" },
    { label: "Homicide Suspects", value: 5337, description: "Murder suspects arrested" },
    { label: "Daily Average", value: 297, description: "Based on 250 operational days" },
    { label: "Warrants Cleared", value: 88765, description: "Total warrants cleared" },
  ],
  notableOperations: [
    {
      name: "Operation Take Back America",
      date: "2025-03-05",
      arrests: 117,
      description: "Massachusetts operation targeting violent felons over 45 days",
    },
    {
      name: "Make D.C. Safe and Beautiful",
      date: "2025",
      arrests: 8000,
      description: "Year-long surge operation with 800 firearms seized",
    },
    {
      name: "Northern Ohio Task Force Milestone",
      date: "2025",
      arrests: 60000,
      description: "Cumulative task force arrests including 2,400+ homicide arrests",
    },
  ],
  sources: [
    "https://www.usmarshals.gov/sites/default/files/media/document/2025-Facts-and-Figures.pdf",
    "https://www.usmarshals.gov/resources/fact-sheets/2025-fugitive-apprehension",
  ],
};

// ATF Statistics
export const atfStats: AgencyStats = {
  id: "atf",
  name: "Bureau of Alcohol, Tobacco, Firearms and Explosives",
  shortName: "ATF",
  description: "ATF is responsible for investigating and preventing federal offenses involving firearms, explosives, arson, and alcohol and tobacco diversion.",
  totalArrests2025: 8500, // Reduced due to immigration reassignment
  monthlyData: [
    { date: "2025-01", value: 950 },
    { date: "2025-02", value: 880 },
    { date: "2025-03", value: 820 },
    { date: "2025-04", value: 750 },
    { date: "2025-05", value: 680 },
    { date: "2025-06", value: 620 },
    { date: "2025-07", value: 590 },
    { date: "2025-08", value: 580 },
    { date: "2025-09", value: 610 },
    { date: "2025-10", value: 640 },
    { date: "2025-11", value: 680 },
    { date: "2025-12", value: 700 },
  ],
  keyMetrics: [
    { label: "FY2024 Compliance Inspections", value: 9696, description: "Firearm dealer compliance inspections" },
    { label: "Active FFLs", value: 128690, description: "Federal Firearms Licensees" },
    { label: "Trace Requests Processed", value: 639295, description: "FY2024 National Tracing Center" },
    { label: "Machineguns in Registry", value: 2382403, description: "NFRTR total as of June 2025" },
    { label: "Transferable Machineguns", value: 234718, description: "Available for private transfer" },
    { label: "Agents Reassigned to Immigration", value: "80%", description: "Special agents on immigration duty" },
    { label: "Criminal Referral Change", value: "-2%", description: "YoY decline in DOJ referrals" },
  ],
  sources: [
    "https://www.atf.gov/resource-center/data-statistics",
    "https://www.atf.gov/resource-center/fact-sheet/fact-sheet-facts-and-figures-fiscal-year-2024",
  ],
};

// HSI (Homeland Security Investigations) Statistics
export const hsiStats: AgencyStats = {
  id: "hsi",
  name: "Homeland Security Investigations",
  shortName: "HSI",
  description: "HSI is the principal investigative arm of DHS, responsible for investigating transnational crime and threats including human trafficking, drug smuggling, and financial crimes.",
  totalArrests2025: 35000, // Criminal + administrative
  monthlyData: [
    { date: "2025-01", value: 2500 },
    { date: "2025-02", value: 2800 },
    { date: "2025-03", value: 2950 },
    { date: "2025-04", value: 2850 },
    { date: "2025-05", value: 3100 },
    { date: "2025-06", value: 3200 },
    { date: "2025-07", value: 3050 },
    { date: "2025-08", value: 2900 },
    { date: "2025-09", value: 3450 }, // Hyundai operation
    { date: "2025-10", value: 2800 },
    { date: "2025-11", value: 2700 },
    { date: "2025-12", value: 2700 },
  ],
  keyMetrics: [
    { label: "FY2024 Criminal Arrests", value: 32608, description: "HSI criminal arrests" },
    { label: "Administrative Arrests (ERO)", value: 113430, description: "ICE ERO administrative arrests FY2024" },
    { label: "Dallas Worksite Criminal", value: 14, description: "Dallas worksite criminal arrests" },
    { label: "Dallas Worksite Administrative", value: 102, description: "Dallas worksite administrative arrests" },
    { label: "New Hires", value: 11751, description: "DHS law enforcement hires in 2025" },
    { label: "Applications Received", value: 220000, description: "For 10,000+ ICE positions" },
  ],
  notableOperations: [
    {
      name: "Hyundai Megasite Operation",
      date: "2025-09",
      arrests: 475,
      description: "Largest single-site HSI operation in U.S. history",
    },
    {
      name: "Operation Highway Sentinel",
      date: "2025-12",
      arrests: 101,
      description: "Illegal alien truck drivers on California highways",
    },
  ],
  sources: [
    "https://www.dhs.gov/hsi",
    "https://www.ice.gov/newsroom",
  ],
};

// Deportation/Removal Statistics
export interface DeportationData {
  date: string;
  totalRemovals: number;
  iceInterior: number;
  cbpRemovals: number;
  selfDeportations: number;
}

export const deportationData: DeportationData[] = [
  { date: "2025-01", totalRemovals: 32000, iceInterior: 18000, cbpRemovals: 14000, selfDeportations: 95000 },
  { date: "2025-02", totalRemovals: 38000, iceInterior: 22000, cbpRemovals: 16000, selfDeportations: 120000 },
  { date: "2025-03", totalRemovals: 42000, iceInterior: 24000, cbpRemovals: 18000, selfDeportations: 150000 },
  { date: "2025-04", totalRemovals: 45000, iceInterior: 26000, cbpRemovals: 19000, selfDeportations: 180000 },
  { date: "2025-05", totalRemovals: 48000, iceInterior: 28000, cbpRemovals: 20000, selfDeportations: 200000 },
  { date: "2025-06", totalRemovals: 52000, iceInterior: 30000, cbpRemovals: 22000, selfDeportations: 220000 },
  { date: "2025-07", totalRemovals: 55000, iceInterior: 32000, cbpRemovals: 23000, selfDeportations: 250000 },
  { date: "2025-08", totalRemovals: 58000, iceInterior: 34000, cbpRemovals: 24000, selfDeportations: 280000 },
  { date: "2025-09", totalRemovals: 60000, iceInterior: 35000, cbpRemovals: 25000, selfDeportations: 310000 },
  { date: "2025-10", totalRemovals: 58000, iceInterior: 34000, cbpRemovals: 24000, selfDeportations: 340000 },
  { date: "2025-11", totalRemovals: 56000, iceInterior: 33000, cbpRemovals: 23000, selfDeportations: 370000 },
  { date: "2025-12", totalRemovals: 58000, iceInterior: 34000, cbpRemovals: 24000, selfDeportations: 385000 },
];

// Summary Statistics
export const federalArrestsSummary = {
  totalArrests2025: {
    ice: 328000,
    cbp: 108625,
    fbi: 45000,
    dea: 15500,
    usMarshals: 74222,
    atf: 8500,
    hsi: 35000,
  },
  totalDeportations2025: 622000,
  totalSelfDeportations2025: 1900000,
  peakDetention: 68440,
  borderCrossingsReduction: 93, // percent
};

// Criminal Categories for ICE Arrests
export interface CriminalCategoryData {
  category: string;
  count: number;
  percentage: number;
}

export const iceCriminalCategories: CriminalCategoryData[] = [
  { category: "No Criminal Record", count: 75000, percentage: 34 },
  { category: "Traffic/Minor Violations", count: 44000, percentage: 20 },
  { category: "Drug Offenses", count: 35200, percentage: 16 },
  { category: "Assault/Violence", count: 26400, percentage: 12 },
  { category: "Theft/Property Crimes", count: 17600, percentage: 8 },
  { category: "Sexual Offenses", count: 8800, percentage: 4 },
  { category: "Homicide", count: 4400, percentage: 2 },
  { category: "Gang-Related", count: 4400, percentage: 2 },
  { category: "Other Federal Crimes", count: 4400, percentage: 2 },
];

// All agencies combined
export const allAgencies: AgencyStats[] = [
  iceArrestsData,
  cbpStats,
  fbiStats,
  deaStats,
  usMarshalsStats,
  atfStats,
  hsiStats,
];

// Helper function to get total monthly arrests across all agencies
export function getTotalMonthlyArrests(): MonthlyData[] {
  const monthlyTotals: Record<string, number> = {};

  allAgencies.forEach(agency => {
    agency.monthlyData.forEach(data => {
      if (monthlyTotals[data.date]) {
        monthlyTotals[data.date] += data.value;
      } else {
        monthlyTotals[data.date] = data.value;
      }
    });
  });

  return Object.entries(monthlyTotals)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Educational context for the data
export const federalArrestsContext = {
  overview: `Federal arrests and detentions in 2025 reached historic levels following significant policy changes in immigration enforcement. This dataset tracks enforcement actions by seven major federal agencies: ICE, CBP, FBI, DEA, US Marshals, ATF, and HSI.`,

  keyTrends: [
    "ICE arrests doubled compared to 2024 levels, with over 328,000 arrests recorded",
    "Border apprehensions dropped 93% year-over-year to the lowest levels since 1970",
    "ICE detention population reached record highs of over 68,000 individuals",
    "70% of ICE arrests involved individuals with prior criminal records",
    "DEA significantly increased fentanyl-related enforcement with 45+ million pills seized",
    "ATF reassigned 80% of agents to immigration enforcement, reducing firearms cases",
  ],

  methodology: `Data is compiled from official government sources including DHS, ICE, CBP, FBI, DEA, US Marshals, and ATF press releases, statistical reports, and FOIA-obtained records. Monthly figures are estimates based on available reporting periods and may be revised as additional data becomes available.`,

  dataSources: [
    { name: "ICE Statistics", url: "https://www.ice.gov/statistics" },
    { name: "CBP Enforcement Statistics", url: "https://www.cbp.gov/newsroom/stats/cbp-enforcement-statistics" },
    { name: "FBI Crime Data Explorer", url: "https://cde.ucr.cjis.gov/" },
    { name: "DEA Data & Statistics", url: "https://www.dea.gov/resources/data-and-statistics" },
    { name: "US Marshals Facts & Figures", url: "https://www.usmarshals.gov/sites/default/files/media/document/2025-Facts-and-Figures.pdf" },
    { name: "ATF Data & Statistics", url: "https://www.atf.gov/resource-center/data-statistics" },
    { name: "TRAC Immigration Reports", url: "https://tracreports.org/immigration/quickfacts/" },
    { name: "Migration Policy Institute", url: "https://www.migrationpolicy.org/" },
  ],
};
