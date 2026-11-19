function escapeCsvCell(value: string): string {
  let safeValue = String(value);

  // Untrusted form submissions should not become
  // executable spreadsheet formulas.
  if (/^\s*[=+\-@]/.test(safeValue) || /^[\t\r\n]/.test(safeValue)) {
    safeValue = `'${safeValue}`;
  }

  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function serializeCsv(rows: readonly (readonly string[])[]): string {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}
