# Node MDB

> A Node.js javascript client implementing the ADODB protocol on windows.

NPM link: [@el3um4s/node-mdb](https://www.npmjs.com/package/@el3um4s/node-mdb)

This project arises from the need to access legacy databases. Read tables from MDB files. Performs simple queries on MDB files. It can be considered as an updated version of [node-adodb](https://www.npmjs.com/package/@el3um4s/node-adodb). For \*nix systems you can use [Node MdbTools](https://www.npmjs.com/package/@el3um4s/mdbtools).

> The library need system support `Microsoft.Jet.OLEDB.4.0` or `Microsoft.ACE.OLEDB.12.0`, `Windows XP SP2` above support `Microsoft.Jet.OLEDB.4.0` by default, Others need to install support!
>
> Recommended use `Microsoft.ACE.OLEDB.12.0`, download: [Microsoft.ACE.OLEDB.12.0](https://www.microsoft.com/en-us/download/details.aspx?id=13255)

### Install and use the package

To use the package in a project:

```bash
npm i @el3um4s/node-mdb
```

and then in a file:

```ts
import { table } from "@el3um4s/node-mdb";

const database = "./src/__tests__/test.mdb";

const result = await table.list({ database });
console.log(result);
//  ["Attività", "Users", "To Do"]

const schema = await table.schema({ database, table: "to do" });
console.log(schema);
// [
//   { DESC: "Integer", NAME: "ord", TYPE: "3" },
//   { DESC: "VarWChar", NAME: "to do", TYPE: "202" },
// ]
```

### API: table

- `table.list({ database:string }): Promise<string[]>`: list all tables in the database (excluding system tables)
- `table.all({ database:string} ): Promise<string[]>`: list all tables in the database (including system tables)
- `table.system({ database:string} ): Promise<string[]>`: list all system tables in the database
- `table.schema({ database:string, table:string }): Promise<Columns[]>`: get the schema of the table. Return an array of objects with the following properties:
  - `NAME: string`: name of the column
  - `TYPE: number`: type of the column
  - `DESC: string`: description of the column
- `table.read({ database:string, table:string }): Promise<GenericObject[]>`: read the table like an array of objects.
- `table.readAllTables({ database:string, events?: ReadEvents }): Promise<TableContents[]>`: read all tables like an array of objects type `TableContents` with the following properties:
  - `TABLE_NAME: string`: name of the table
  - `TABLE_CONTENT: GenericObject[]`: content of the table
  - `TABLE_ROWS: number`: rows of the table
    You can intercept the events by passing an object with the following properties:
  - `onStart: (tables: string[]) => void`: called when the reading starts
  - `onEnd: (result: TableContents[]) => void`: called when the reading ends
  - `onTableRead: (data: TableContents) => void`: called when the table is read
- `table.select({ database:string, table:string, columns?:string[], where?:string }): Promise<GenericObject[]>`: read the table like an array of objects.
- `table.count({ database:string, table:string }): Promise<number>`: count the number of rows in the table.
- `table.listToFile({ database:string, file:string }): Promise<boolean>`: list all tables in the database (excluding system tables) and save them in file
- `table.exportToFileJSON({ database:string, table:string, file:string }): Promise<boolean>`: read the table like an array of objects and save it in file
- `table.exportToFileCSV({ database:string, table:string, file:string }): Promise<boolean>`: read the table and export to a CSV file
- `table.exportAllTablesToFileJSON({ database:string, folder: string, events?: ReadEvents }): Promise<TableContents[]>`: read all tables like an array of objects and save it in file
- `table.exportAllTablesToFileCSV({ database:string, folder: string, events?: ReadEvents }): Promise<TableContents[]>`: read all tables like an array of objects and export to a CSV file
