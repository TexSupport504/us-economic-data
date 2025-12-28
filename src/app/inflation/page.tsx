import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InflationContent } from "@/components/pages/inflation/inflation-content";

export const metadata: Metadata = {
  title: "Inflation Data | US Economic Data",
  description: "Track US inflation through CPI, Core CPI, PCE, and other price indices. Real-time data visualization with historical trends.",
};

export default function InflationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InflationContent />
      </main>
      <Footer />
    </div>
  );
}
