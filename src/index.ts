import { runVbs } from "@el3um4s/run-vbs";
import path = require("path");

import { api_schema } from "./vbs/api_schema";

import fs = require("fs");

const ciao = async () => {
  const vbs = `Wscript.Echo "Ciao Mondo"`;
  const result = await runVbs({ vbs });
  return result;
};

const prova = async () => {
  const vbs = api_schema;

  const file = path.resolve("./src/__tests__/adodb.mdb");
  console.log(file);
  const result = await runVbs({
    vbs,
    args: [file, "JSON"],
  });
  console.log(result);

  fs.writeFileSync("prova.json", result);
  return result;
};

const prova2 = async () => {
  const vbs = api_schema;

  const file = path.resolve("./src/__tests__/test.mdb");
  console.log(file);
  const result = await runVbs({
    vbs,
    args: [file, "JSON"],
  });
  console.log(result);

  fs.writeFileSync("prova-2.json", result);

  return result;
};

export { ciao, prova, prova2 };
