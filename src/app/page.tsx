import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MarketTicker } from "@/components/layout/market-ticker";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { KeyboardShortcutsModal } from "@/components/ui/keyboard-shortcuts-modal";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MarketTicker />
      <main className="flex-1">
        <DashboardContent />
      </main>
      <Footer />
      <KeyboardShortcutsModal />
    </div>
  );
}
