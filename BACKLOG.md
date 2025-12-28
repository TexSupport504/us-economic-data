# Feature Backlog

This document tracks planned features, improvements, and ideas for the US Economic Data Dashboard.

## Priority Legend
- **P0**: Critical - Must have
- **P1**: High - Should have soon
- **P2**: Medium - Nice to have
- **P3**: Low - Future consideration

---

## Data & API Enhancements

### P1 - Additional Data Sources
- [ ] **Bureau of Labor Statistics (BLS) API** - Direct employment data, wage statistics
- [ ] **Treasury Direct API** - Treasury auction data, debt statistics
- [ ] **Census Bureau API** - Trade data, economic census
- [ ] **OECD Data** - International comparisons

### P1 - More FRED Series
- [ ] **Trade**: Trade balance, imports/exports by category
- [ ] **Debt**: National debt, debt-to-GDP ratio
- [ ] **Productivity**: Labor productivity, unit labor costs
- [ ] **Business**: ISM Manufacturing/Services PMI, industrial production
- [ ] **Regional**: State-level unemployment, regional Fed surveys

### P2 - Data Features
- [ ] **Real-time data updates** - WebSocket or polling for live updates
- [ ] **Historical data range** - Allow 30+ year historical views
- [ ] **Data caching improvements** - Redis/Upstash for persistent cache
- [ ] **Rate limiting** - Protect API endpoints

---

## Charts & Visualization

### P1 - New Chart Types
- [ ] **Candlestick charts** - For rate/yield data
- [ ] **Heatmaps** - Correlation matrices, calendar heatmaps
- [ ] **Treemaps** - GDP composition, employment by sector
- [ ] **Gauge charts** - For single metrics vs targets
- [ ] **Waterfall charts** - For breakdown analysis

### P1 - Chart Enhancements
- [ ] **Zoom and pan** - Interactive chart navigation
- [ ] **Annotation system** - Add notes to charts (recessions, events)
- [ ] **Recession shading** - Automatic NBER recession highlighting
- [ ] **Moving averages** - 3-month, 6-month, 12-month overlays
- [ ] **Trendlines** - Linear/polynomial regression lines
- [ ] **Comparison mode** - Overlay multiple series on same chart

### P2 - Chart Features
- [ ] **Fullscreen mode** - Expand charts to fullscreen
- [ ] **Print-friendly** - Optimized print styles
- [ ] **Share charts** - Generate shareable chart images/links
- [ ] **Embed codes** - Allow embedding charts in other sites

---

## UI/UX Improvements

### P1 - Design Enhancements
- [ ] **Skeleton loading states** - Replace "Loading..." with skeletons
- [ ] **Error boundaries** - Graceful error handling with retry
- [ ] **Empty states** - Better UI when no data available
- [ ] **Breadcrumbs** - Navigation breadcrumbs on all pages
- [ ] **Table views** - Toggle between chart and table view

### P1 - Navigation & Discovery
- [ ] **Favorites/Bookmarks** - Save favorite series
- [ ] **Recent views** - Track recently viewed metrics
- [ ] **Related indicators** - Show related metrics on each page
- [ ] **Quick links** - Jump to specific chart sections

### P2 - Personalization
- [ ] **Custom dashboards** - User-created dashboard layouts
- [ ] **Saved date ranges** - Remember preferred time ranges
- [ ] **Preferred units** - Toggle between different units
- [ ] **Widget system** - Drag-and-drop dashboard widgets

### P2 - Accessibility
- [ ] **Keyboard navigation** - Full keyboard support
- [ ] **Screen reader optimization** - ARIA labels, announcements
- [ ] **High contrast mode** - Accessibility color theme
- [ ] **Reduced motion** - Respect prefers-reduced-motion

---

## New Pages & Features

### P1 - New Data Pages
- [ ] **Markets** - Stock indices, volatility (VIX), commodities
- [ ] **International** - Global GDP comparisons, currency rates
- [ ] **Debt & Deficits** - National debt, budget deficits
- [ ] **Trade** - Trade balance, import/export breakdowns
- [ ] **Leading Indicators** - LEI, yield curve inversions

### P1 - Analysis Features
- [ ] **Economic calendar** - Upcoming data releases
- [ ] **Alerts/Notifications** - Price/level alerts
- [ ] **Commentary** - AI-generated market commentary
- [ ] **Correlations** - Show correlations between indicators

### P2 - Reports & Insights
- [ ] **Weekly digest** - Auto-generated weekly summary
- [ ] **Custom reports** - Build PDF reports with selected charts
- [ ] **Comparison reports** - Side-by-side period comparisons
- [ ] **Scenario analysis** - What-if calculations

---

## Technical Improvements

### P1 - Performance
- [ ] **Image optimization** - Next.js Image component usage
- [ ] **Bundle analysis** - Reduce bundle size
- [ ] **Code splitting** - Lazy load chart components
- [ ] **Service worker** - Offline support, caching

### P1 - Infrastructure
- [ ] **Error tracking** - Sentry integration
- [ ] **Analytics** - Privacy-focused analytics (Plausible/Fathom)
- [ ] **Monitoring** - Uptime monitoring, performance metrics
- [ ] **CI/CD** - GitHub Actions for testing/deployment

### P2 - Developer Experience
- [ ] **Storybook** - Component documentation
- [ ] **Unit tests** - Jest/Vitest test suite
- [ ] **E2E tests** - Playwright test suite
- [ ] **API documentation** - OpenAPI/Swagger docs

---

## Mobile & PWA

### P2 - Mobile Optimization
- [ ] **Touch gestures** - Swipe between charts
- [ ] **Mobile-first charts** - Optimized chart sizes
- [ ] **Bottom navigation** - Mobile nav bar
- [ ] **Pull to refresh** - Refresh data with pull gesture

### P3 - PWA Features
- [ ] **Install prompt** - Add to home screen
- [ ] **Offline mode** - View cached data offline
- [ ] **Push notifications** - Alert notifications
- [ ] **Background sync** - Sync data in background

---

## Community & Social

### P3 - Sharing Features
- [ ] **Social sharing** - Share to Twitter/LinkedIn
- [ ] **Public profiles** - User profiles with saved charts
- [ ] **Comments** - Discussion on data points
- [ ] **Embed widgets** - Embeddable chart widgets

### P3 - Education
- [ ] **Glossary** - Economic terms glossary
- [ ] **Tutorials** - How to read each indicator
- [ ] **Historical context** - Major economic events timeline

---

## Completed Features ✓

- [x] Real-time FRED API integration
- [x] Dashboard with key metrics
- [x] GDP page with charts
- [x] Inflation page with CPI components
- [x] Employment page with sector breakdowns
- [x] Interest Rates page with yield curves
- [x] Housing page
- [x] Consumer page
- [x] Monetary Policy page
- [x] Date range comparison component
- [x] Data export (CSV/JSON)
- [x] Global search (Cmd+K)
- [x] Dark/Light mode
- [x] Responsive design
- [x] Vercel deployment

---

## Notes

### API Rate Limits
- FRED API: 120 requests per minute
- Consider implementing request queuing for bulk data fetches

### Design Inspiration
- Bloomberg Terminal
- TradingView
- FRED website
- Koyfin
- Bravo's Research (YouTube)

### Potential Monetization (Future)
- Premium tier with advanced features
- API access for developers
- White-label solutions
- Sponsored content/partnerships
