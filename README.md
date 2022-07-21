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
  - `NAME`: name of the column
  - `TYPE`: type of the column
  - `DESC`: description of the column
- `table.read({ database:string, table:string }): Promise<GenericObject[]>`: read the table like an array of objects.
- `table.select({ database:string, table:string, columns?:string[], where?:string }): Promise<GenericObject[]>`: read the table like an array of objects.
- `table.count({ database:string, table:string }): Promise<number>`: count the number of rows in the table.
- `table.listToFile({ database:string, file:string }): Promise<boolean>`: list all tables in the database (excluding system tables) and save them in file
- `table.exportToFileJSON({ database:string, table:string, file:string }): Promise<boolean>`: read the table like an array of objects and save it in file
- `table.exportToFileCSV({ database:string, table:string, file:string }): Promise<boolean>`: read the table and export to a CSV file

**To Do**:

- `table.query({ database:string, table:string, query:string }): Promise<GenericObject[]>`: query the table. `query` is a string with the query to execute.
