import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FederalArrestsContent } from "@/components/pages/federal-arrests/federal-arrests-content";

export const metadata: Metadata = {
  title: "Federal Arrests & Detentions | US Economic Data",
  description: "Comprehensive dataset of US federal arrests and detentions since 2025, including ICE, CBP, FBI, DEA, US Marshals, ATF, and HSI enforcement statistics.",
};

export default function FederalArrestsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <FederalArrestsContent />
      </main>
      <Footer />
    </div>
  );
}
