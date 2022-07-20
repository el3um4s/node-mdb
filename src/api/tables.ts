import path = require("path");
import * as fs from "fs/promises";

import { runVbsBuffer } from "@el3um4s/run-vbs";
import { decodeVBSBuffer } from "@el3um4s/decode-mdb-strange-chars";

import { api_schema } from "../vbs/api_schema";
import { api_schema_table } from "../vbs/api_schema_table";
import { api_query_all_values } from "../vbs/api_query_all_values";

interface TableName {
  TABLE_NAME: string;
  TABLE_TYPE: "TABLE" | "SYSTEM TABLE" | "ACCESS TABLE" | "VIEW";
}

interface Columns {
  NAME: string;
  TYPE: number;
  DESC: string;
}

type GenericObject = Record<string, unknown>;

const list = async (data: { database: string }): Promise<string[] | Error> => {
  try {
    const vbs = api_schema;
    const file = path.resolve(data.database);
    const result = await runVbsBuffer({
      vbs,
      args: [file, "JSON"],
    });

    const resultDecoded = decodeVBSBuffer(result);
    const obj: { result: TableName[] } = JSON.parse(resultDecoded);
    const onlyTables = obj.result
      .filter((x) => x.TABLE_TYPE.toLowerCase() === "table")
      .map((x) => x.TABLE_NAME);
    return onlyTables;
  } catch (error) {
    return Object.assign(new Error(`table.list error`), error);
  }
};

const listToFile = async (data: {
  database: string;
  file: string;
}): Promise<true | Error> => {
  try {
    const result = await list({ database: data.database });

    if (result instanceof Error) {
      throw result;
    }
    const r = result.join("\n");

    const file = path.resolve(data.file);

    await fs.writeFile(file, r);

    return true;
  } catch (error) {
    return Object.assign(new Error(`table.listToFile error`), error);
  }
};

const all = async (data: { database: string }): Promise<string[]> => {
  const vbs = api_schema;
  const file = path.resolve(data.database);
  const result = await runVbsBuffer({
    vbs,
    args: [file, "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);
  const obj: { result: TableName[] } = JSON.parse(resultDecoded);
  const onlyTables = obj.result
    .filter(
      (x) =>
        x.TABLE_TYPE.toLowerCase() === "table" ||
        x.TABLE_TYPE.toLowerCase() === "system table" ||
        x.TABLE_TYPE.toLowerCase() === "access table"
    )
    .map((x) => x.TABLE_NAME);
  return onlyTables;
};

const system = async (data: { database: string }): Promise<string[]> => {
  const vbs = api_schema;
  const file = path.resolve(data.database);
  const result = await runVbsBuffer({
    vbs,
    args: [file, "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);
  const obj: { result: TableName[] } = JSON.parse(resultDecoded);

  const onlyTables = obj.result
    .filter(
      (x) =>
        x.TABLE_TYPE.toLowerCase() === "system table" ||
        x.TABLE_TYPE.toLowerCase() === "access table"
    )
    .map((x) => x.TABLE_NAME);
  return onlyTables;
};

const schema = async (data: {
  database: string;
  table: string;
}): Promise<Columns[]> => {
  const vbs = api_schema_table;
  const file = path.resolve(data.database);
  const result = await runVbsBuffer({
    vbs,
    args: [file, `"${data.table}"`, "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);

  const obj: { result: Columns[] } = JSON.parse(resultDecoded);

  return obj.result;
};

const read = async (data: {
  database: string;
  table: string;
}): Promise<GenericObject[]> => {
  const vbs = api_query_all_values;
  const file = path.resolve(data.database);
  const result = await runVbsBuffer({
    vbs,
    args: [file, `"${data.table}"`, "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);

  const obj: { result: GenericObject[] } = JSON.parse(resultDecoded);
  return obj.result;
};

const exportToFileJSON = async (data: {
  database: string;
  table: string;
  file: string;
}): Promise<true | Error> => {
  try {
    const result = await read({ database: data.database, table: data.table });

    const file = path.resolve(data.file);

    await fs.writeFile(file, JSON.stringify(result));

    return true;
  } catch (error) {
    return Object.assign(new Error(`table.exportToFileJSON error`), error);
  }
};

const exportToFileCSV = async (data: {
  database: string;
  table: string;
  file: string;
}): Promise<true | Error> => {
  try {
    const vbs = api_query_all_values;
    const mdb = path.resolve(data.database);
    const result = await runVbsBuffer({
      vbs,
      args: [mdb, `"${data.table}"`, "CSV"],
    });

    const resultDecoded = decodeVBSBuffer(result).trim();

    const file = path.resolve(data.file);
    await fs.writeFile(file, resultDecoded);

    return true;
  } catch (error) {
    return Object.assign(new Error(`table.exportToFileCSV error`), error);
  }
};

export const table = {
  list,
  all,
  system,
  schema,
  listToFile,
  read,
  exportToFileJSON,
  exportToFileCSV,
};
