import AsciiTable from "ascii-table";


const formatValue = (anything: any): string => {
  if (anything === undefined) return "";
  if (typeof anything === "object") return JSON.stringify(anything);
  return String(anything);
}

export class ShowResults
{

    public makeTableFrom(result: any[][]) {
        const entities = [];

        for (const row of result) {
            for (const node of row) {
                entities.push({
                    labels: node.labels.join(', '),
                    ...node.properties,
                });
            }
        }

        const keys = entities.map(e => Object.keys(e));
        const uniqueFields = new Set(...keys);
        const columns = [...uniqueFields];

        var table = new AsciiTable();
        table.setHeading(...columns);

        for (const e of entities) {
            table.addRow(
              ...columns.map(col => formatValue(e[col]))
            );
        }

        return table.toString()
    }
}