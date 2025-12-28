import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RatesContent } from "@/components/pages/rates/rates-content";

export const metadata: Metadata = {
  title: "Interest Rates | US Economic Data",
  description: "Track US interest rates including Federal Funds Rate, Treasury yields, and yield curve spreads.",
};

export default function RatesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <RatesContent />
      </main>
      <Footer />
    </div>
  );
}
