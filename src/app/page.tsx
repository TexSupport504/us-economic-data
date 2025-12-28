import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <DashboardContent />
      </main>
      <Footer />
    </div>
  );
}
