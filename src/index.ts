import { runVbs, runVbsBuffer } from "@el3um4s/run-vbs";
import { decodeVBSBuffer } from "@el3um4s/decode-mdb-strange-chars";

import { api_schema } from "./vbs/api_schema";
import { api_query_all_values } from "./vbs/api_query_all_values";
import { api_sql } from "./vbs/api_sql";

import {
  tablesList,
  tablesListAll,
  tablesListSystem,
  tableSchema,
} from "./api/tables";

import path = require("path");

import fs = require("fs");

export { tablesList, tablesListAll, tablesListSystem, tableSchema };
// export const tablesAll = async (data: { database: string }): Promise<any> => {
//   const vbs = api_schema;
//   const file = path.resolve(data.database);
//   const result = await runVbsBuffer({
//     vbs,
//     args: [file, "JSON"],
//   });

//   const resultDecoded = decodeVBSBuffer(result);
//   const obj = JSON.parse(resultDecoded);
//   const onlyTables = obj.result.filter(
//     (x: { TABLE_TYPE: string }) =>
//       x.TABLE_TYPE.toLowerCase() === "table" ||
//       x.TABLE_TYPE.toLowerCase() === "system table" ||
//       x.TABLE_TYPE.toLowerCase() === "access table"
//   );
//   return onlyTables;
// };

const ciao = async () => {
  const vbs = `Wscript.Echo "Ciao Mondo"`;
  const result = await runVbs({ vbs });
  return result;
};

const prova = async (): Promise<string> => {
  const vbs = api_schema;

  const file = path.resolve("./src/__tests__/adodb.mdb");
  const result = await runVbsBuffer({
    vbs,
    args: [file, "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);
  const obj = JSON.parse(resultDecoded);

  fs.writeFileSync("prova.json", obj);
  return obj;
};

const prova2 = async (): Promise<string> => {
  const vbs = api_schema;

  const file = path.resolve("./src/__tests__/chars.mdb");
  const result = await runVbsBuffer({
    vbs,
    args: [file, "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("prova-2.json", resultDecoded);
  const obj = JSON.parse(resultDecoded);

  console.log(obj.result.length);
  return obj.result;
};

const prova3 = async (): Promise<string> => {
  const vbs = api_query_all_values;

  const file = path.resolve("./src/__tests__/chars.mdb");
  const result = await runVbsBuffer({
    vbs,
    args: [file, "aà", "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);
  const obj = JSON.parse(resultDecoded);

  fs.writeFileSync("prova-3.json", obj);

  return obj;
};

const prova4 = async (): Promise<string> => {
  const vbs = api_query_all_values;

  const file = path.resolve("./src/__tests__/chars.mdb");
  const result = await runVbsBuffer({
    vbs,
    args: [file, "°", "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("prova-4.json", resultDecoded);
  const obj = JSON.parse(resultDecoded);

  return obj;
};

const listaCaratteri = async (): Promise<string> => {
  const vbs = api_query_all_values;

  const file = path.resolve("./src/__tests__/chars.mdb");
  const result = await runVbsBuffer({
    vbs,
    args: [file, "lista", "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("lista.json", resultDecoded);
  // const obj = JSON.parse(resultDecoded);

  return resultDecoded;
};

const listaCaratteriCSV = async (): Promise<string> => {
  const vbs = api_query_all_values;

  const file = path.resolve("./src/__tests__/chars.mdb");
  const result = await runVbsBuffer({
    vbs,
    args: [file, "lista", "CSV"],
  });

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("lista.csv", resultDecoded);

  return resultDecoded;
};

export {
  ciao,
  prova,
  prova2,
  prova3,
  prova4,
  listaCaratteri,
  listaCaratteriCSV,
};
