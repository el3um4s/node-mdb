import path = require("path");
import * as fs from "fs/promises";

import { runVbsBuffer } from "@el3um4s/run-vbs";
import { decodeVBSBuffer } from "@el3um4s/decode-mdb-strange-chars";

import { api_schema } from "../vbs/api_schema";
import { api_schema_table } from "../vbs/api_schema_table";
import { api_query_all_values } from "../vbs/api_query_all_values";
import { api_sql } from "../vbs/api_sql";

import {
  TableName,
  Columns,
  GenericObject,
  TableContents,
  ReadEvents,
} from "../interfaces/Interfaces";

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

const listToFile = async (data: {
  database: string;
  file: string;
}): Promise<boolean> => {
  const result = await list({ database: data.database });

  const r = result.join("\n");

  const file = path.resolve(data.file);

  await fs.writeFile(file, r);

  return true;
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
}): Promise<boolean> => {
  const result = await read({ database: data.database, table: data.table });

  const file = path.resolve(data.file);

  await fs.writeFile(file, JSON.stringify(result));

  return true;
};

const exportToFileCSV = async (data: {
  database: string;
  table: string;
  file: string;
}): Promise<boolean> => {
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
};

const count = async (data: {
  database: string;
  table: string;
}): Promise<number> => {
  const vbs = api_sql;
  const file = path.resolve(data.database);
  const result = await runVbsBuffer({
    vbs,
    args: [file, `"SELECT COUNT(*) AS RESULT FROM [${data.table}]"`, "JSON"],
  });

  const resultDecoded = decodeVBSBuffer(result);

  const obj: { result: { RESULT: string }[] } = JSON.parse(resultDecoded);

  return parseInt(obj.result[0].RESULT);
};

const select = async (data: {
  database: string;
  table: string;
  columns?: string[];
  where?: string;
}): Promise<GenericObject[]> => {
  const vbs = api_sql;
  const file = path.resolve(data.database);
  const listColumns = data.columns
    ? data.columns.map((x) => `[${x}]`).join(",")
    : "*";

  const where = data.where
    ? ` WHERE ${data.where
        .replaceAll("\r\n", "\n")
        .replaceAll("\n", " ")
        .replaceAll('"', "'")}`
    : "";

  const result = await runVbsBuffer({
    vbs,
    args: [
      file,
      `"SELECT ${listColumns} FROM [${data.table}] ${where} "`,
      "JSON",
    ],
  });

  const resultDecoded = decodeVBSBuffer(result);

  const obj: { result: GenericObject[] } = JSON.parse(resultDecoded);
  return obj.result;
};

const readAllTables = async (data: {
  database: string;
  events?: ReadEvents;
}): Promise<TableContents[]> => {
  const { database, events } = data;
  const tables = await list({ database });

  if (events?.onStart) {
    events.onStart(tables);
  }

  const result = await Promise.all(
    tables.map(async (table) => {
      const rows = await count({ database, table });
      const content = await read({ database, table });
      const result = {
        TABLE_NAME: table,
        TABLE_CONTENT: content,
        TABLE_ROWS: rows,
      };

      if (events?.onTableRead) {
        events?.onTableRead(result);
      }
      return result;
    })
  );

  if (events?.onEnd) {
    events.onEnd(result);
  }

  return result;
};

const exportAllTablesToFileJSON = async (data: {
  database: string;
  folder: string;
  events?: ReadEvents;
}): Promise<boolean> => {
  const { database, folder, events } = data;
  const tables = await list({ database });

  if (events?.onStart) {
    events.onStart(tables);
  }

  try {
    await fs.access(path.resolve(folder));
  } catch {
    await fs.mkdir(path.resolve(folder));
  }

  const result = await Promise.all(
    tables.map(async (table) => {
      const rows = await count({ database, table });
      const content = await read({ database, table });
      const result = {
        TABLE_NAME: table,
        TABLE_CONTENT: content,
        TABLE_ROWS: rows,
      };

      const fileJSON = path.resolve(folder, `${table}.json`);
      await fs.writeFile(fileJSON, JSON.stringify(result.TABLE_CONTENT));

      if (events?.onTableRead) {
        events?.onTableRead(result);
      }
      return result;
    })
  );

  if (events?.onEnd) {
    events.onEnd(result);
  }

  return true;
};

const exportAllTablesToFileCSV = async (data: {
  database: string;
  folder: string;
  events?: ReadEvents;
}): Promise<boolean> => {
  const { database, folder, events } = data;
  const tables = await list({ database });

  if (events?.onStart) {
    events.onStart(tables);
  }

  try {
    await fs.access(path.resolve(folder));
  } catch {
    await fs.mkdir(path.resolve(folder));
  }

  const returnResult = events?.onTableRead || events?.onEnd;

  const result = await Promise.all(
    tables.map(async (table) => {
      const file = path.resolve(folder, `${table}.csv`);
      await exportToFileCSV({ database, table, file });

      if (returnResult) {
        const rows = await count({ database, table });
        const content = await read({ database, table });
        const result = {
          TABLE_NAME: table,
          TABLE_CONTENT: content,
          TABLE_ROWS: rows,
        };

        if (events?.onTableRead) {
          events?.onTableRead(result);
        }
        return result;
      }
      return {
        TABLE_NAME: table,
        TABLE_CONTENT: [],
        TABLE_ROWS: 0,
      };
    })
  );

  if (returnResult && events?.onEnd) {
    events.onEnd(result);
  }

  return true;
};

export const table = {
  list,
  all,
  system,
  schema,
  read,
  select,
  count,
  listToFile,
  exportToFileJSON,
  exportToFileCSV,
  readAllTables,
  exportAllTablesToFileJSON,
  exportAllTablesToFileCSV,
};
