import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConsumerContent } from "@/components/pages/consumer/consumer-content";

export const metadata: Metadata = {
  title: "Consumer | US Economic Data",
  description: "Track US consumer metrics including sentiment, spending, savings rate, and consumer credit.",
};

export default function ConsumerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ConsumerContent />
      </main>
      <Footer />
    </div>
  );
}
