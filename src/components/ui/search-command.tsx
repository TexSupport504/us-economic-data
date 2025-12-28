"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FRED_SERIES } from "@/lib/api/fred";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  name: string;
  category: string;
  href: string;
}

const searchItems: SearchItem[] = [
  // Pages
  { id: "dashboard", name: "Dashboard", category: "Pages", href: "/" },
  { id: "inflation", name: "Inflation", category: "Pages", href: "/inflation" },
  { id: "gdp", name: "GDP & Growth", category: "Pages", href: "/gdp" },
  { id: "employment", name: "Employment", category: "Pages", href: "/employment" },
  { id: "rates", name: "Interest Rates", category: "Pages", href: "/rates" },
  { id: "housing", name: "Housing", category: "Pages", href: "/housing" },
  { id: "consumer", name: "Consumer", category: "Pages", href: "/consumer" },
  { id: "monetary", name: "Monetary Policy", category: "Pages", href: "/monetary" },

  // Data Series
  ...Object.entries(FRED_SERIES).map(([key, value]) => ({
    id: key,
    name: `${value.name} (${key})`,
    category: getCategoryLabel(value.category),
    href: getCategoryHref(value.category),
  })),
];

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    inflation: "Inflation",
    "inflation-components": "CPI Components",
    gdp: "GDP",
    employment: "Employment",
    "employment-sectors": "Employment Sectors",
    rates: "Interest Rates",
    housing: "Housing",
    consumer: "Consumer",
    monetary: "Monetary",
  };
  return labels[category] || category;
}

function getCategoryHref(category: string): string {
  const hrefs: Record<string, string> = {
    inflation: "/inflation",
    "inflation-components": "/inflation",
    gdp: "/gdp",
    employment: "/employment",
    "employment-sectors": "/employment",
    rates: "/rates",
    housing: "/housing",
    consumer: "/consumer",
    monetary: "/monetary",
  };
  return hrefs[category] || "/";
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredItems = query.length > 0
    ? searchItems.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search data...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="sr-only">Search</DialogTitle>
          </DialogHeader>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search pages, indicators, series..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-11 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            {query.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                Type to search for pages and economic indicators...
              </p>
            ) : filteredItems.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No results found.
              </p>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">
                    {category}
                  </p>
                  {items.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.href)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span className="truncate">{item.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.category}
                      </Badge>
                    </button>
                  ))}
                  {items.length > 5 && (
                    <p className="px-2 py-1 text-xs text-muted-foreground">
                      +{items.length - 5} more
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
