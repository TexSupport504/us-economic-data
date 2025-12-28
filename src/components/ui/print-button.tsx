"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintButtonProps {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PrintButton({
  variant = "outline",
  size = "sm",
  className,
}: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={className}
      aria-label="Print this page"
    >
      <Printer className="h-4 w-4" />
      <span className="sr-only md:not-sr-only md:ml-2">Print</span>
    </Button>
  );
}
