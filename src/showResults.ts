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

        const uniqueFields = new Set(rows.map(row => Object.keys(row)).flat());
        const propertyKeys = new Set(rows.map(row => Object.keys(row.properties || {})).flat());
        uniqueFields.delete("properties");
        const columns = [...uniqueFields];
        const propertyColumns = [...propertyKeys]

        var table = new AsciiTable();
        table.setHeading(...columns, ...propertyColumns);

        for (const row of rows) {
            table.addRow(
              ...columns.map(col => formatValue(row[col])),
              ...propertyColumns.map(col => formatValue(row.properties[col]))
            );
        }

        return table.toString()
    }
}