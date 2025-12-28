import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Percent,
  Home,
  ShoppingCart,
  Landmark,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
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
    icon: BarChart3,
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
        icon: TrendingUp,
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
        icon: DollarSign,
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
        icon: Landmark,
        description: "Money supply and Fed balance sheet",
      },
    ],
  },
  {
    title: "Sectors",
    items: [
      {
        title: "Housing",
        href: "/housing",
        icon: Home,
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
];

export const allNavItems: NavItem[] = [
  ...mainNavItems,
  ...dataCategories.flatMap((category) => category.items),
];
