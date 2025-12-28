# US Economic Data Dashboard

A premium, modern web application for visualizing US economic data in real-time. Built with Next.js, TypeScript, and powered by the Federal Reserve Economic Data (FRED) API.

## Features

- **Real-time Economic Data**: Live data from the Federal Reserve (FRED API)
- **Multiple Data Categories**:
  - **GDP**: Real GDP, nominal GDP, growth rates
  - **Inflation**: CPI, Core CPI, PCE, Core PCE with component breakdowns
  - **Employment**: Unemployment rate, payrolls, labor force participation, sector breakdowns
  - **Interest Rates**: Treasury yields, Fed Funds Rate, yield curves
  - **Housing**: Home prices, housing starts, mortgage rates
  - **Consumer**: Retail sales, consumer sentiment, spending
  - **Monetary Policy**: Money supply, Fed balance sheet, bank reserves
- **Interactive Charts**: Area charts, line charts with multiple series
- **Date Range Comparison**: Compare current values to 1, 2, 3, 5, or 10 years ago
- **Data Export**: Download data as CSV or JSON
- **Global Search**: Quick search with Cmd+K / Ctrl+K
- **Dark/Light Mode**: Automatic and manual theme switching
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Premium UI**: Smooth animations, modern styling

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Data Fetching**: SWR with automatic caching
- **State Management**: Zustand
- **API**: FRED (Federal Reserve Economic Data)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- FRED API key (free from https://fred.stlouisfed.org/docs/api/api_key.html)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/us-economic-data.git
cd us-economic-data
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your FRED API key:
```env
FRED_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/fred/          # API routes for FRED data
│   ├── (pages)/           # Page routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── charts/            # Chart components (AreaChart, LineChart, StatCard)
│   ├── layout/            # Layout components (Header, Footer, PageLayout)
│   ├── pages/             # Page-specific content components
│   ├── providers/         # Context providers
│   └── ui/                # UI components (shadcn/ui + custom)
├── config/
│   └── navigation.ts      # Navigation configuration
└── lib/
    ├── api/               # FRED API client
    ├── hooks/             # Custom React hooks
    └── utils/             # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This project is configured for Vercel deployment. Simply connect your GitHub repository to Vercel and add your `FRED_API_KEY` environment variable.

## Data Sources

- [Federal Reserve Economic Data (FRED)](https://fred.stlouisfed.org/) - Primary data source

## License

MIT
