import { Metadata } from "next";
import { DebtContent } from "@/components/pages/debt/debt-content";

export const metadata: Metadata = {
  title: "Debt & Deficits | US Economic Data",
  description: "US federal debt, budget deficits, debt-to-GDP ratio, and interest payments data",
};

export default function DebtPage() {
  return <DebtContent />;
}
