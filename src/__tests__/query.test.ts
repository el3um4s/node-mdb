import path from "path";
import * as fs from "fs";

import { toTry, toTryAsync } from "@el3um4s/to-try";

import { query } from "../index";

const database = "./src/__tests__/test.mdb";

fs.writeFileSync(
  path.resolve("src/__tests__/test.mdb"),
  fs.readFileSync(path.resolve("src/__tests__/examples/test.mdb"))
);

describe("API: query", () => {
  test("query.sql - one line", async () => {
    const sql = `SELECT userName, userAge, mail FROM Users WHERE userAge=100;`;
    const result = await query.sql({
      database,
      sql,
    });

    expect(result).toEqual([
      {
        userName: "Re Giorgio 1°",
        userAge: "100",
        mail: "rg1@test.com",
      },
    ]);
  });

  test("query.sql - no result", async () => {
    const sql = `SELECT userName, userAge, mail FROM Users WHERE userAge=1000;`;
    const result = await query.sql({
      database,
      sql,
    });

    expect(result).toEqual([{}]);
  });

  test("query.sql - multiple lines", async () => {
    const sql = `
    SELECT userName, userAge, mail 
    FROM Users 
    WHERE userAge=100;`;
    const result = await query.sql({
      database,
      sql,
    });

    expect(result).toEqual([
      {
        userName: "Re Giorgio 1°",
        userAge: "100",
        mail: "rg1@test.com",
      },
    ]);
  });

  test("query.sql - with single quotes", async () => {
    const sql = `SELECT userName, userAge, mail FROM Users WHERE (userName='Mario Rossi');`;
    const result = await query.sql({
      database,
      sql,
    });

    expect(result).toEqual([
      {
        userName: "Mario Rossi",
        userAge: "25",
        mail: "mariorossi1999@test.com",
      },
    ]);
  });

  test("query.sql - with double quotes", async () => {
    const sql = `
SELECT userName, userAge, mail 
FROM Users 
WHERE (userName Like '%1°%');`;
    const result = await query.sql({
      database,
      sql,
    });

    expect(result).toEqual([
      {
        userName: "Re Giorgio 1°",
        userAge: "100",
        mail: "rg1@test.com",
      },
    ]);
  });

  test("query.sqlToFileJSON", async () => {
    const result = await query.sqlToFileJSON({
      database,
      file: "./src/__tests__/exportedToFiles/sqlToFileJSON.json",
      sql: `SELECT userName, userAge, mail 
            FROM Users 
            WHERE (userName Like '%1°%');`,
    });

    expect(result).toBe(true);
  });

  test("query.sqlToFileJSON - no result", async () => {
    const result = await query.sqlToFileJSON({
      database,
      file: "./src/__tests__/exportedToFiles/sqlToFileJSON - no result.json",
      sql: `SELECT userName, userAge, mail 
            FROM Users 
            WHERE (userName Like '%2°%');`,
    });

    expect(result).toBe(true);
  });

  test("query.sqlToFileCSV", async () => {
    const result = await query.sqlToFileCSV({
      database,
      file: "./src/__tests__/exportedToFiles/sqlToFileCSV.csv",
      sql: `SELECT userName, userAge, mail 
            FROM Users 
            WHERE (userName Like '%1°%');`,
    });

    expect(result).toBe(true);
  });

  test("query.sqlToFileCSV - no result", async () => {
    const result = await query.sqlToFileCSV({
      database,
      file: "./src/__tests__/exportedToFiles/sqlToFileCSV - no result.csv",
      sql: `SELECT userName, userAge, mail 
            FROM Users 
            WHERE (userName Like '%2°%');`,
    });

    expect(result).toBe(true);
  });
});
