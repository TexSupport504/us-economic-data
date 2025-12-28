interface DataPoint {
  date: string;
  value: number;
}

interface ExportOptions {
  filename: string;
  seriesName?: string;
}

export function exportToCSV(data: DataPoint[], options: ExportOptions): void {
  const { filename, seriesName } = options;

  const headers = ["Date", seriesName || "Value"];
  const rows = data.map((point) => [point.date, point.value.toString()]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

export function exportToJSON(data: DataPoint[], options: ExportOptions): void {
  const { filename, seriesName } = options;

  const jsonContent = JSON.stringify(
    {
      series: seriesName,
      exportedAt: new Date().toISOString(),
      dataPoints: data.length,
      data,
    },
    null,
    2
  );

  downloadFile(jsonContent, `${filename}.json`, "application/json");
}

export function exportMultipleSeriesToCSV(
  series: { id: string; name: string; data: DataPoint[] }[],
  filename: string
): void {
  // Get all unique dates
  const allDates = new Set<string>();
  series.forEach((s) => s.data.forEach((d) => allDates.add(d.date)));
  const sortedDates = Array.from(allDates).sort();

  // Create lookup maps for each series
  const seriesLookups = series.map((s) => {
    const lookup = new Map<string, number>();
    s.data.forEach((d) => lookup.set(d.date, d.value));
    return lookup;
  });

  // Build CSV
  const headers = ["Date", ...series.map((s) => s.name)];
  const rows = sortedDates.map((date) => {
    const values = seriesLookups.map((lookup) => {
      const value = lookup.get(date);
      return value !== undefined ? value.toString() : "";
    });
    return [date, ...values];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  downloadFile(csvContent, `${filename}.csv`, "text/csv");
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
