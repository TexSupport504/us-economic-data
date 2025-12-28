import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EmploymentContent } from "@/components/pages/employment/employment-content";

export const metadata: Metadata = {
  title: "Employment | US Economic Data",
  description: "Track US employment metrics including unemployment rate, nonfarm payrolls, labor force participation, and jobless claims.",
};

export default function EmploymentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <EmploymentContent />
      </main>
      <Footer />
    </div>
  );
}
