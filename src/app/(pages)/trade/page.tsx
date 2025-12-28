import { Metadata } from "next";
import { TradeContent } from "@/components/pages/trade/trade-content";

export const metadata: Metadata = {
  title: "Trade | US Economic Data",
  description: "US international trade balance, imports, exports, and trade deficit data",
};

export default function TradePage() {
  return <TradeContent />;
}
