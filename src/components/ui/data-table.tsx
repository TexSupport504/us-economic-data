"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  value: number;
}

interface DataTableProps {
  data: DataPoint[];
  title?: string;
  formatValue?: (value: number) => string;
  formatDate?: (date: string) => string;
  showChange?: boolean;
  maxRows?: number;
  className?: string;
}

type SortField = "date" | "value" | "change";
type SortDirection = "asc" | "desc";

export function DataTable({
  data,
  title,
  formatValue = (v) => v.toFixed(2),
  formatDate = (d) => format(parseISO(d), "MMM d, yyyy"),
  showChange = true,
  maxRows = 50,
  className,
}: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const tableData = useMemo(() => {
    // Calculate period-over-period change
    const withChange = data.map((item, index) => {
      const prevItem = data[index + 1]; // Data is typically newest first
      const change = prevItem ? ((item.value - prevItem.value) / prevItem.value) * 100 : null;
      return { ...item, change };
    });

    // Sort data
    const sorted = [...withChange].sort((a, b) => {
      let comparison = 0;

      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "value") {
        comparison = a.value - b.value;
      } else if (sortField === "change") {
        comparison = (a.change ?? 0) - (b.change ?? 0);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted.slice(0, maxRows);
  }, [data, sortField, sortDirection, maxRows]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  if (data.length === 0) {
    return (
      <div className={cn("flex h-[300px] items-center justify-center rounded-lg bg-muted/30", className)}>
        <span className="text-sm text-muted-foreground">No data available</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("rounded-md border", className)}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => handleSort("date")}
              >
                Date
                <SortIcon field="date" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="-mr-3 h-8 font-medium"
                onClick={() => handleSort("value")}
              >
                {title || "Value"}
                <SortIcon field="value" />
              </Button>
            </TableHead>
            {showChange && (
              <TableHead className="w-[100px] text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-mr-3 h-8 font-medium"
                  onClick={() => handleSort("change")}
                >
                  Change
                  <SortIcon field="change" />
                </Button>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={row.date}>
              <TableCell className="font-medium tabular-nums">
                {formatDate(row.date)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatValue(row.value)}
              </TableCell>
              {showChange && (
                <TableCell className="text-right tabular-nums">
                  {row.change !== null ? (
                    <span
                      className={cn(
                        "inline-flex items-center",
                        row.change > 0 && "text-positive",
                        row.change < 0 && "text-negative"
                      )}
                    >
                      {row.change > 0 ? "+" : ""}
                      {row.change.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.length > maxRows && (
        <div className="border-t px-4 py-2 text-center text-xs text-muted-foreground">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </motion.div>
  );
}
