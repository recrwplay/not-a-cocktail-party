import AsciiTable from "ascii-table";

const formatValue = (anything: any): string => {
  if (anything === undefined) return "";
  if (typeof anything === "object") return JSON.stringify(anything);
  return String(anything);
}

export class ShowResults
{
    public makeTableFrom(rows: Record<string, any>[]) {
        if (rows.length === 0) return '';

        const keys = rows.map(row => Object.keys(row));
        const uniqueFields = new Set(...keys);
        const columns = [...uniqueFields];

        var table = new AsciiTable();
        table.setHeading(...columns);

        for (const row of rows) {
            table.addRow(
              ...columns.map(col => formatValue(row[col]))
            );
        }

        return table.toString()
    }
}