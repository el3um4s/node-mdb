import path from "path";
import * as fs from "fs";

import { query } from "../index";
import { table } from "../index";

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

  test("query.sql - INSERT", async () => {
    const rowsBeforeInsert = await table.count({ database, table: "Users" });
    const sql = `INSERT INTO [Users](userName, userAge, mail) VALUES ("Topo Gigio", 6, "topogigio@test.com");`;
    await query.sql({
      database,
      sql,
    });

    const rowsAfterInsert = await table.count({ database, table: "Users" });

    expect(rowsAfterInsert).toBe(rowsBeforeInsert + 1);
  });

  test("query.sql - UPDATE", async () => {
    const rowsBeforeUpdate = await table.count({ database, table: "Users" });

    // UPDATE table_name
    // SET column1 = value1, column2 = value2, ...
    // WHERE condition;
    const originalValue = await query.sql({
      database,
      sql: `SELECT * FROM Users WHERE userName like ('%Topo%');`,
    });

    expect(originalValue[0]).toEqual({
      userName: "Topo Gigio",
      userAge: "6",
      mail: "topogigio@test.com",
    });

    const sql = `
    UPDATE [Users]
    SET userAge = 100, mail = "oldTopo@test.com"
    WHERE userName = "Topo Gigio";
    `;
    await query.sql({
      database,
      sql,
    });

    const rowsAfterUpdate = await table.count({ database, table: "Users" });

    expect(rowsAfterUpdate).toBe(rowsBeforeUpdate);

    const updatedValue = await query.sql({
      database,
      sql: `SELECT * FROM Users WHERE userName like ('%Topo%');`,
    });

    expect(updatedValue[0]).toEqual({
      userName: "Topo Gigio",
      userAge: "100",
      mail: "oldTopo@test.com",
    });
  });

  test("query.sql - DELETE", async () => {
    const rowsBeforeDelete = await table.count({ database, table: "Users" });
    const sql = `
    DELETE FROM [Users]
    WHERE userName = "Topo Gigio";`;
    await query.sql({
      database,
      sql,
    });

    const rowsAfterDelete = await table.count({ database, table: "Users" });

    expect(rowsAfterDelete).toBe(rowsBeforeDelete - 1);
  });
});
