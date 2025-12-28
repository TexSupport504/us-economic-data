"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface PageLayoutProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageLayout({
  title,
  description,
  icon: Icon,
  children,
  actions,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-border/40 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {title}
                </h1>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </motion.div>
        </div>
      </div>

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="container mx-auto max-w-7xl px-4 py-8"
      >
        {children}
      </motion.div>
    </div>
  );
}
