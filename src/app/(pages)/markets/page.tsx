import { Metadata } from "next";
import { MarketsContent } from "@/components/pages/markets/markets-content";

export const metadata: Metadata = {
  title: "Markets | US Economic Data",
  description: "Stock market indices, VIX volatility, and commodity prices",
};

export default function MarketsPage() {
  return <MarketsContent />;
}
