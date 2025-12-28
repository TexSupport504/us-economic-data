import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MonetaryContent } from "@/components/pages/monetary/monetary-content";

export const metadata: Metadata = {
  title: "Monetary Policy | US Economic Data",
  description: "Track US monetary policy including M2 money supply and Federal Reserve balance sheet.",
};

export default function MonetaryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <MonetaryContent />
      </main>
      <Footer />
    </div>
  );
}
