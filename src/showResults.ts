import AsciiTable from "ascii-table";


export class ShowResults
{

    public makeTableFrom(result) {
        console.log(result)
        var table = new AsciiTable('A Title')
        table
          .setHeading('', 'Name', 'Age')
          .addRow(1, 'Bob', 52)
          .addRow(2, 'John', 34)
          .addRow(3, 'Jim', 83)
        
        console.log(table.toString())
        // assume node and labels for now


        return table.toString()

    }
}