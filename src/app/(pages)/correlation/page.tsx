import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CorrelationContent } from "@/components/pages/correlation/correlation-content";

export default function CorrelationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CorrelationContent />
      </main>
      <Footer />
    </div>
  );
}
