import path from "path";
import * as fs from "fs";

import { table } from "../index";

const database = "./src/__tests__/test.mdb";

fs.writeFileSync(
  path.resolve("src/__tests__/test.mdb"),
  fs.readFileSync(path.resolve("src/__tests__/examples/test.mdb"))
);

describe("API: tables", () => {
  test("table.all", async () => {
    const result = await table.all({ database });
    expect(result).not.toBeInstanceOf(Error);

    const expected = [
      "Attività",
      "Users",
      "To Do",
      "MSysACEs",
      "MSysAccessObjects",
      "MSysObjects",
      "MSysQueries",
      "MSysRelationships",
      "MSysNameMap",
      "MSysNavPaneGroupCategories",
      "MSysNavPaneGroupToObjects",
      "MSysNavPaneGroups",
      "MSysNavPaneObjectIDs",
    ];
    expect(result.sort()).toEqual(expected.sort());
  });

  test("table.list", async () => {
    const result = await table.list({ database });
    expect(result).not.toBeInstanceOf(Error);

    const expected = ["Attività", "Users", "To Do"];
    const resultSorted = result instanceof Error ? [] : result.sort();
    expect(resultSorted).toEqual(expected.sort());
  });

  test("table.system", async () => {
    const result = await table.system({ database });
    expect(result).not.toBeInstanceOf(Error);

    const expected = [
      "MSysACEs",
      "MSysAccessObjects",
      "MSysObjects",
      "MSysQueries",
      "MSysRelationships",
      "MSysNameMap",
      "MSysNavPaneGroupCategories",
      "MSysNavPaneGroupToObjects",
      "MSysNavPaneGroups",
      "MSysNavPaneObjectIDs",
    ];
    expect(result.sort()).toEqual(expected.sort());
  });

  test("table.schema", async () => {
    const result = await table.schema({ database, table: "to do" });
    expect(result).not.toBeInstanceOf(Error);

    const expected = [
      { DESC: "Integer", NAME: "ord", TYPE: "3" },
      { DESC: "VarWChar", NAME: "to do", TYPE: "202" },
    ];

    expect(result.sort()).toEqual(expected.sort());
  });

  test("table.read", async () => {
    const result = await table.read({ database, table: "Users" });
    expect(result).not.toBeInstanceOf(Error);

    const expected = [
      {
        userName: "Mario Rossi",
        userAge: "25",
        mail: "mariorossi1999@test.com",
      },
      { userName: "Sara Carrà", userAge: "31", mail: "sara.carrà@test.com" },
      { userName: "Re Giorgio 1°", userAge: "100", mail: "rg1@test.com" },
    ];

    expect(result.length).toBe(3);
    expect(result[0].userName).toBe(expected[0].userName);
    expect(result[1].userAge).toBe(expected[1].userAge);
    expect(result[1].mail).toBe("sara.carrà@test.com");
    expect(result[2].userName).toBe("Re Giorgio 1°");
    expect(result.sort()).toEqual(expected.sort());
  });

  test("table.listToFile", async () => {
    const result = await table.listToFile({
      database,
      file: "./src/__tests__/exportedToFiles/listToFile.txt",
    });
    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBe(true);
  });

  test("table.exportToFileJSON", async () => {
    const result = await table.exportToFileJSON({
      database,
      file: "./src/__tests__/exportedToFiles/exportToFileJSON.json",
      table: "Users",
    });
    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBe(true);
  });

  test("table.exportToFileCSV", async () => {
    const result = await table.exportToFileCSV({
      database,
      file: "./src/__tests__/exportedToFiles/exportToFileCSV.csv",
      table: "Attività",
    });
    expect(result).not.toBeInstanceOf(Error);
    expect(result).toBe(true);
  });
});

describe("API: tables ERRORS", () => {
  test("table.all ERROR: DATABASE WRONG", async () => {
    const result = await table.all({ database: "NONE" });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.list ERROR: DATABASE WRONG", async () => {
    const result = await table.list({ database: "NONE" });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.system ERROR: DATABASE WRONG", async () => {
    const result = await table.system({ database: "NONE" });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.schema ERROR: DATABASE WRONG", async () => {
    const result = await table.schema({ database: "NONE", table: "to do" });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.schema ERROR: TABLE WRONG", async () => {
    const result = await table.schema({ database, table: "NONE" });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.read ERROR: DATABASE WRONG", async () => {
    const result = await table.read({ database: "NONE", table: "Users" });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.read ERROR: TABLE WRONG", async () => {
    const result = await table.read({ database, table: "NONE" });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.listToFile ERROR: DATABASE WRONG", async () => {
    const result = await table.listToFile({
      database: "NONE",
      file: "./src/__tests__/exportedToFiles/listToFile.txt",
    });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.exportToFileJSON ERROR: DATABASE WRONG", async () => {
    const result = await table.exportToFileJSON({
      database: "NONE",
      file: "./src/__tests__/exportedToFiles/exportToFileJSON.json",
      table: "Users",
    });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.exportToFileCSV ERROR: DATABASE WRONG", async () => {
    const result = await table.exportToFileCSV({
      database: "NONE",
      file: "./src/__tests__/exportedToFiles/exportToFileCSV.csv",
      table: "Attività",
    });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.exportToFileJSON ERROR: TABLE WRONG", async () => {
    const result = await table.exportToFileJSON({
      database,
      file: "./src/__tests__/exportedToFiles/exportToFileJSON.json",
      table: "NONE",
    });
    expect(result).toBeInstanceOf(Error);
  });

  test("table.exportToFileCSV ERROR: TABLE WRONG", async () => {
    const result = await table.exportToFileCSV({
      database,
      file: "./src/__tests__/exportedToFiles/exportToFileCSV.csv",
      table: "NONE",
    });
    expect(result).toBeInstanceOf(Error);
  });
});
