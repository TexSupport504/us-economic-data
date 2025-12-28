import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">US Economic Data</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Real-time visualization of US economic indicators. Data sourced from
              official government APIs including FRED, BLS, and Treasury.
            </p>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Data Sources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://fred.stlouisfed.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Federal Reserve (FRED)
                </a>
              </li>
              <li>
                <a
                  href="https://www.bls.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Bureau of Labor Statistics
                </a>
              </li>
              <li>
                <a
                  href="https://www.bea.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Bureau of Economic Analysis
                </a>
              </li>
              <li>
                <a
                  href="https://home.treasury.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  US Treasury
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/gdp" className="hover:text-foreground">
                  GDP & Growth
                </Link>
              </li>
              <li>
                <Link href="/inflation" className="hover:text-foreground">
                  Inflation
                </Link>
              </li>
              <li>
                <Link href="/employment" className="hover:text-foreground">
                  Employment
                </Link>
              </li>
              <li>
                <Link href="/rates" className="hover:text-foreground">
                  Interest Rates
                </Link>
              </li>
              <li>
                <Link href="/housing" className="hover:text-foreground">
                  Housing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            Data updates automatically. Last refresh shown on each indicator.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Tailwind CSS, and shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
}
