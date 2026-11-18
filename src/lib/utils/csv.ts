export function serializeCsv(rows: readonly (readonly string[])[]) {
  return rows
    .map((row) =>
      row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
}
