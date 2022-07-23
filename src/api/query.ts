import path = require("path");
import * as fs from "fs/promises";

import { runVbsBuffer } from "@el3um4s/run-vbs";
import { decodeVBSBuffer } from "@el3um4s/decode-mdb-strange-chars";
import { toTry } from "@el3um4s/to-try";

import { api_sql } from "../vbs/api_sql";

import { GenericObject } from "../interfaces/Interfaces";

const normalizeSQL = (sql: string): string => {
  const result = sql
    .replaceAll("\r\n", "\n")
    .replaceAll("\n", " ")
    .replaceAll('"', "'");
  return result;
};

const sql = async (data: {
  database: string;
  sql: string;
}): Promise<GenericObject[]> => {
  const vbs = api_sql;
  const file = path.resolve(data.database);

  const sqlNormalized = normalizeSQL(data.sql);

  const resultQuery = await runVbsBuffer({
    vbs,
    args: [file, `"${sqlNormalized}"`, "JSON"],
  });

  const [resultDecoded] = toTry(() => {
    const decoded = decodeVBSBuffer(resultQuery);
    const obj: { result: GenericObject[] } = JSON.parse(decoded);
    return obj.result;
  });

  return resultDecoded ? resultDecoded : [{}];
};

const sqlToFileJSON = async (data: {
  database: string;
  sql: string;
  file: string;
}): Promise<boolean> => {
  const result = await sql({ database: data.database, sql: data.sql });

  const file = path.resolve(data.file);

  await fs.writeFile(file, JSON.stringify(result));

  return true;
};

const sqlToFileCSV = async (data: {
  database: string;
  sql: string;
  file: string;
}): Promise<boolean> => {
  const vbs = api_sql;
  const mdb = path.resolve(data.database);

  const sqlNormalized = normalizeSQL(data.sql);

  const result = await runVbsBuffer({
    vbs,
    args: [mdb, `"${sqlNormalized}"`, "CSV"],
  });

  const resultDecoded = decodeVBSBuffer(result).trim();

  const file = path.resolve(data.file);
  await fs.writeFile(file, resultDecoded);

  return true;
};

export const query = {
  sql,
  sqlToFileJSON,
  sqlToFileCSV,
};
