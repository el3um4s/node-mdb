import path = require("path");
import * as fs from "fs/promises";

import { runVbsBuffer } from "@el3um4s/run-vbs";
import { decodeVBSBuffer } from "@el3um4s/decode-mdb-strange-chars";

import { api_schema } from "../vbs/api_schema";
import { api_schema_table } from "../vbs/api_schema_table";

interface TableName {
  TABLE_NAME: string;
  TABLE_TYPE: "TABLE" | "SYSTEM TABLE" | "ACCESS TABLE" | "VIEW";
}

interface Columns {
  NAME: string;
  TYPE: number;
  DESC: string;
}

const list = async (data: { database: string }): Promise<string[]> => {
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
};

const list_toFile = async (data: {
  database: string;
  file: string;
}): Promise<boolean> => {
  const result = await list({ database: data.database });
  const file = path.resolve(data.file);
  try {
    await fs.writeFile(file, JSON.stringify(result));
    return true;
  } catch (err) {
    return false;
  }
};

export const all = async (data: { database: string }): Promise<string[]> => {
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

export const system = async (data: { database: string }): Promise<string[]> => {
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

export const schema = async (data: {
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

export const table = { list, all, system, schema, list_toFile };
