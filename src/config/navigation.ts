import {
  ChartLineUp,
  CurrencyDollar,
  Briefcase,
  Percent,
  House,
  ShoppingCart,
  Bank,
  ChartBar,
  Boat,
  Money,
  ChartLine,
  GitDiff,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";

export interface NavItem {
  title: string;
  href: string;
  icon: PhosphorIcon;
  description: string;
  badge?: string;
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: ChartBar,
    description: "Overview of key economic indicators",
  },
];

export const dataCategories: NavCategory[] = [
  {
    title: "Growth",
    items: [
      {
        title: "GDP",
        href: "/gdp",
        icon: ChartLineUp,
        description: "Gross Domestic Product and economic growth",
      },
    ],
  },
  {
    title: "Prices",
    items: [
      {
        title: "Inflation",
        href: "/inflation",
        icon: CurrencyDollar,
        description: "CPI, PCE, and price indices",
        badge: "Key",
      },
    ],
  },
  {
    title: "Labor",
    items: [
      {
        title: "Employment",
        href: "/employment",
        icon: Briefcase,
        description: "Jobs, unemployment, and labor force",
      },
    ],
  },
  {
    title: "Financial",
    items: [
      {
        title: "Interest Rates",
        href: "/rates",
        icon: Percent,
        description: "Fed funds, Treasury yields, and spreads",
      },
      {
        title: "Monetary Policy",
        href: "/monetary",
        icon: Bank,
        description: "Money supply and Fed balance sheet",
      },
      {
        title: "Markets",
        href: "/markets",
        icon: ChartLine,
        description: "Stocks, VIX volatility, and commodities",
        badge: "New",
      },
    ],
  },
  {
    title: "Sectors",
    items: [
      {
        title: "Housing",
        href: "/housing",
        icon: House,
        description: "Home prices, starts, and mortgage rates",
      },
      {
        title: "Consumer",
        href: "/consumer",
        icon: ShoppingCart,
        description: "Spending, sentiment, and savings",
      },
    ],
  },
  {
    title: "Fiscal",
    items: [
      {
        title: "Trade",
        href: "/trade",
        icon: Boat,
        description: "Trade balance, imports, and exports",
      },
      {
        title: "Debt",
        href: "/debt",
        icon: Money,
        description: "Federal debt, deficits, and interest",
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        title: "Correlation",
        href: "/correlation",
        icon: GitDiff,
        description: "Compare indicators and analyze relationships",
        badge: "New",
      },
    ],
  },
];

export const allNavItems: NavItem[] = [
  ...mainNavItems,
  ...dataCategories.flatMap((category) => category.items),
];
