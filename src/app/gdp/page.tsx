import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GDPContent } from "@/components/pages/gdp/gdp-content";

export const metadata: Metadata = {
  title: "GDP & Growth | US Economic Data",
  description: "Track US Gross Domestic Product, real GDP growth, and economic output. Real-time data visualization with historical trends.",
};

export default function GDPPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <GDPContent />
      </main>
      <Footer />
    </div>
  );
}
