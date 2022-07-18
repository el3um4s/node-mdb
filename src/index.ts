import { runVbs, runVbsBuffer } from "@el3um4s/run-vbs";
import { decodeVBSBuffer } from "@el3um4s/decode-mdb-strange-chars";

import { api_schema } from "./vbs/api_schema";
import { api_query_all_values } from "./vbs/api_query_all_values";
import { api_sql } from "./vbs/api_sql";

import path = require("path");

import fs = require("fs");

const charFromBuffer = async (b: string[]) => {
  const str: { type: number; data: number[] } = JSON.parse(
    JSON.stringify(b[0])
  );
  const result = str.data.map((x) => x.toString(16).padStart(2, "0")).join(" ");
  return result;
};

const ciao = async () => {
  const vbs = `Wscript.Echo "Ciao Mondo"`;
  const result = await runVbs({ vbs });
  return result;
};

const prova = async (): Promise<string> => {
  const vbs = api_schema;

  const file = path.resolve("./src/__tests__/adodb.mdb");
  console.log(file);
  const result = await runVbsBuffer({
    vbs,
    args: [file, "JSON"],
  });

  // const stringW = await charFromBuffer(result);
  // console.log(stringW);
  // const resultDecoded = await decode(stringW);
  // console.log(resultDecoded);

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("prova.json", resultDecoded);
  return resultDecoded;
};

const prova2 = async (): Promise<string> => {
  const vbs = api_schema;

  const file = path.resolve("./src/__tests__/chars.mdb");
  console.log(file);
  const result = await runVbsBuffer({
    vbs,
    args: [file, "JSON"],
  });

  // const stringW = await charFromBuffer(result);
  // console.log(stringW);
  // const resultDecoded = await decode(stringW);
  // console.log(resultDecoded);

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("prova-2.json", resultDecoded);

  return resultDecoded;
};

const prova3 = async (): Promise<string> => {
  const vbs = api_query_all_values;

  const file = path.resolve("./src/__tests__/chars.mdb");
  console.log(file);
  const result = await runVbsBuffer({
    vbs,
    args: [file, "aà", "JSON"],
  });

  // const stringW = await charFromBuffer(result);
  // console.log(stringW);
  // const resultDecoded = await decode(stringW);
  // console.log(resultDecoded);

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("prova-3.json", resultDecoded);

  return resultDecoded;
};

const prova4 = async (): Promise<string> => {
  const vbs = api_query_all_values;

  const file = path.resolve("./src/__tests__/chars.mdb");
  console.log(file);
  const result = await runVbsBuffer({
    vbs,
    args: [file, "°", "JSON"],
  });

  // const stringW = await charFromBuffer(result);
  // console.log(stringW);
  // const resultDecoded = await decode(stringW);
  // console.log(resultDecoded);

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("prova-4.json", resultDecoded);

  return resultDecoded;
};

const listaCaratteri = async (): Promise<string> => {
  const vbs = api_query_all_values;

  const file = path.resolve("./src/__tests__/chars.mdb");
  console.log(file);
  const result = await runVbsBuffer({
    vbs,
    args: [file, "lista", "JSON"],
  });

  // const stringW = await charFromBuffer(result);
  // console.log(stringW);
  // const resultDecoded = await decode(stringW);
  // console.log(resultDecoded);

  const resultDecoded = decodeVBSBuffer(result);

  fs.writeFileSync("lista.json", resultDecoded);

  return resultDecoded;
};

const listaCaratteriCSV = async (): Promise<string> => {
  const vbs = api_query_all_values;

  const file = path.resolve("./src/__tests__/chars.mdb");
  console.log(file);
  const result = await runVbsBuffer({
    vbs,
    args: [file, "lista", "CSV"],
  });

  // const stringW = await charFromBuffer(result);
  // console.log(stringW);
  // const resultDecoded = await decode(stringW);
  // console.log(resultDecoded);

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
