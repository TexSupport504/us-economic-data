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

## Quick Start

### One-Command Setup

**Windows:**
```bash
git clone https://github.com/TexSupport504/us-economic-data.git
cd us-economic-data
setup.bat
```

**Mac/Linux:**
```bash
git clone https://github.com/TexSupport504/us-economic-data.git
cd us-economic-data
chmod +x setup.sh && ./setup.sh
```

The setup script will:
1. Install all dependencies
2. Create `.env.local` from the template
3. Tell you where to get your free FRED API key

### Manual Setup

If you prefer manual setup:

1. Clone and install:
```bash
git clone https://github.com/TexSupport504/us-economic-data.git
cd us-economic-data
npm install
```

2. Get a FREE FRED API key from: https://fred.stlouisfed.org/docs/api/api_key.html

3. Copy `.env.example` to `.env.local` and add your API key:
```bash
cp .env.example .env.local
# Edit .env.local with your API key
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
