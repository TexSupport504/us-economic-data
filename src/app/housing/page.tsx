import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HousingContent } from "@/components/pages/housing/housing-content";

export const metadata: Metadata = {
  title: "Housing | US Economic Data",
  description: "Track US housing market including home prices, housing starts, building permits, and mortgage rates.",
};

export default function HousingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HousingContent />
      </main>
      <Footer />
    </div>
  );
}
