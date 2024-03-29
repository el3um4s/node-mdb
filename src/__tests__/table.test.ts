import path from "path";
import * as fs from "fs";

import { toTry, toTryAsync } from "@el3um4s/to-try";

import { table } from "../index";

import { TableContents } from "../interfaces/Interfaces";

const database = "./src/__tests__/test.mdb";

fs.writeFileSync(
  path.resolve("src/__tests__/test.mdb"),
  fs.readFileSync(path.resolve("src/__tests__/examples/test.mdb"))
);

describe("API: table", () => {
  test("table.all", async () => {
    const result = await table.all({ database });

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

    const expected = ["Attività", "Users", "To Do"];
    const resultSorted = result instanceof Error ? [] : result.sort();
    expect(resultSorted).toEqual(expected.sort());
  });

  test("table.system", async () => {
    const result = await table.system({ database });

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

    const expected = [
      { DESC: "Integer", NAME: "ord", TYPE: "3" },
      { DESC: "VarWChar", NAME: "to do", TYPE: "202" },
    ];

    expect(result.sort()).toEqual(expected.sort());
  });

  test("table.read", async () => {
    const result = await table.read({ database, table: "Users" });

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

  test("table.select userName and userAge", async () => {
    const result = await table.select({
      database,
      table: "Users",
      columns: ["userName", "userAge"],
    });

    const expected = [
      {
        userName: "Mario Rossi",
        userAge: "25",
      },
      { userName: "Sara Carrà", userAge: "31" },
      { userName: "Re Giorgio 1°", userAge: "100" },
    ];

    expect(result.length).toBe(3);
    expect(result[0].userName).toBe(expected[0].userName);
    expect(result[1].userAge).toBe(expected[1].userAge);
    expect(result[2].userName).toBe("Re Giorgio 1°");
    expect(result.sort()).toEqual(expected.sort());
  });

  test("table.select userName, userAge where userAge < 100", async () => {
    const result = await table.select({
      database,
      table: "Users",
      columns: ["userName", "userAge"],
      where: "[userAge] < 100",
    });

    const expected = [
      {
        userName: "Mario Rossi",
        userAge: "25",
      },
      { userName: "Sara Carrà", userAge: "31" },
    ];

    expect(result.length).toBe(2);
    expect(result[0].userName).toBe(expected[0].userName);
    expect(result[1].userAge).toBe(expected[1].userAge);
    expect(result.sort()).toEqual(expected.sort());
  });

  test("table.select all", async () => {
    const result = await table.select({ database, table: "Users" });

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

  test("table.count", async () => {
    const result = await table.count({ database, table: "Users" });

    expect(result).toBe(3);
  });

  test("table.listToFile", async () => {
    const result = await table.listToFile({
      database,
      file: "./src/__tests__/exportedToFiles/listToFile.txt",
    });

    expect(result).toBe(true);
  });

  test("table.exportToFileJSON", async () => {
    const result = await table.exportToFileJSON({
      database,
      file: "./src/__tests__/exportedToFiles/exportToFileJSON.json",
      table: "Users",
    });

    expect(result).toBe(true);
  });

  test("table.exportToFileCSV", async () => {
    const result = await table.exportToFileCSV({
      database,
      file: "./src/__tests__/exportedToFiles/exportToFileCSV.csv",
      table: "Attività",
    });

    expect(result).toBe(true);
  });
});

describe("API: table ERRORS", () => {
  test("table.all ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.all({ database: "NONE" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.list ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.list({ database: "NONE" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.system ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.system({ database: "NONE" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.schema ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.schema({ database: "NONE", table: "to do" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.schema ERROR: TABLE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.schema({ database, table: "NONE" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.read ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.read({ database: "NONE", table: "Users" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.read ERROR: TABLE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.read({ database, table: "NONE" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.count ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.count({ database: "NONE", table: "Users" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.count ERROR: TABLE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.count({ database, table: "NONE" })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.listToFile ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.listToFile({
        database: "NONE",
        file: "./src/__tests__/exportedToFiles/ERROR_listToFile.txt",
      })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.exportToFileJSON ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.exportToFileJSON({
        database: "NONE",
        file: "./src/__tests__/exportedToFiles/ERROR_exportToFileJSON.json",
        table: "Users",
      })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.exportToFileCSV ERROR: DATABASE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.exportToFileCSV({
        database: "NONE",
        file: "./src/__tests__/exportedToFiles/ERROR_exportToFileCSV.csv",
        table: "Attività",
      })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.exportToFileJSON ERROR: TABLE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.exportToFileJSON({
        database,
        file: "./src/__tests__/exportedToFiles/ERROR_TABLE_exportToFileJSON.json",
        table: "NONE",
      })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });

  test("table.exportToFileCSV ERROR: TABLE WRONG", async () => {
    const [result, error] = await toTryAsync(() =>
      table.exportToFileCSV({
        database,
        file: "./src/__tests__/exportedToFiles/ERROR_TABLE_exportToFileCSV.csv",
        table: "NONE",
      })
    );

    expect(result).toBeFalsy();
    expect(error).toBeTruthy();
  });
});

describe("API DERIVED: table", () => {
  test("table.readAllTables", async () => {
    const result = await table.readAllTables({ database });

    expect(result).toBeTruthy();
    expect(result.length).toBe(3);
    const activity = result.filter((t) => t.TABLE_NAME === "Attività")[0];

    expect(activity).toBeTruthy();
    expect(activity.TABLE_CONTENT.length).toBe(3);
  });

  test("table.readAllTables with events", async () => {
    const checkEvents = {
      onStart: false,
      onEnd: false,
      onTableRead: new Array<string>(),
    };
    const events = {
      onStart: () => {
        checkEvents.onStart = true;
        // console.log(`STARTED, ${l.length} tables to read`);
      },
      onEnd: () => {
        checkEvents.onEnd = true;
        // console.log("ENDED");
      },
      onTableRead: (t: TableContents) => {
        checkEvents.onTableRead.push(t.TABLE_NAME);
        // console.log(`TABLE ${t.TABLE_NAME} READ WITH ${t.TABLE_CONTENT.length} ROWS`);
      },
    };
    const result = await table.readAllTables({ database, events });

    expect(result).toBeTruthy();
    expect(result.length).toBe(3);
    const activity = result.filter((t) => t.TABLE_NAME === "Attività")[0];

    expect(activity).toBeTruthy();
    expect(activity.TABLE_CONTENT.length).toBe(3);

    expect(checkEvents.onStart).toBeTruthy();
    expect(checkEvents.onEnd).toBeTruthy();
    expect(checkEvents.onTableRead.length).toBe(3);
    expect(checkEvents.onTableRead).toContain("Attività");
    expect(checkEvents.onTableRead.sort()).toEqual(
      ["Attività", "Users", "To Do"].sort()
    );
  });

  test("table.exportAllTablesToFileJSON", async () => {
    const folder = "./src/__tests__/exportedToFiles/exportAllTablesToFileJSON";
    const result = await table.exportAllTablesToFileJSON({ database, folder });

    expect(result).toBeTruthy();
  });

  test("table.exportAllTablesToFileJSON with events", async () => {
    const folder =
      "./src/__tests__/exportedToFiles/exportAllTablesToFileJSON_WithEvents";

    toTry(() => fs.rmSync(folder, { recursive: true }));

    const checkEvents = {
      onStart: false,
      onEnd: false,
      onTableRead: new Array<string>(),
    };

    const afterRead: TableContents[] = [];
    const events = {
      onStart: () => {
        checkEvents.onStart = true;
      },
      onEnd: (r: TableContents[]) => {
        checkEvents.onEnd = true;
        afterRead.push(...r);
      },
      onTableRead: (t: TableContents) => {
        checkEvents.onTableRead.push(t.TABLE_NAME);
      },
    };
    const resultExport = await table.exportAllTablesToFileJSON({
      database,
      events,
      folder,
    });

    expect(resultExport).toBeTruthy();

    expect(afterRead.length).toBe(3);
    const activity = afterRead.filter((t) => t.TABLE_NAME === "Attività")[0];

    expect(activity).toBeTruthy();
    expect(activity.TABLE_CONTENT.length).toBe(3);

    expect(checkEvents.onStart).toBeTruthy();
    expect(checkEvents.onEnd).toBeTruthy();
    expect(checkEvents.onTableRead.length).toBe(3);
    expect(checkEvents.onTableRead).toContain("Attività");
    expect(checkEvents.onTableRead.sort()).toEqual(
      ["Attività", "Users", "To Do"].sort()
    );
  });

  test("table.exportAllTablesToFileCSV", async () => {
    const folder = "./src/__tests__/exportedToFiles/exportAllTablesToFileCSV";
    const result = await table.exportAllTablesToFileCSV({
      database,
      folder,
    });

    expect(result).toBeTruthy();
  });

  test("table.exportAllTablesToFileCSV with events", async () => {
    const folder =
      "./src/__tests__/exportedToFiles/exportAllTablesToFileCSV_WithEvents";

    toTry(() => fs.rmSync(folder, { recursive: true }));

    const checkEvents = {
      onStart: false,
      onEnd: false,
      onTableRead: new Array<string>(),
    };

    const afterRead: TableContents[] = [];
    const events = {
      onStart: () => {
        checkEvents.onStart = true;
      },
      onEnd: (r: TableContents[]) => {
        checkEvents.onEnd = true;
        afterRead.push(...r);
      },
      onTableRead: (t: TableContents) => {
        checkEvents.onTableRead.push(t.TABLE_NAME);
      },
    };
    const resultExport = await table.exportAllTablesToFileCSV({
      database,
      events,
      folder,
    });

    expect(resultExport).toBeTruthy();

    expect(afterRead.length).toBe(3);
    const activity = afterRead.filter((t) => t.TABLE_NAME === "Attività")[0];

    expect(activity).toBeTruthy();
    expect(activity.TABLE_CONTENT.length).toBe(3);

    expect(checkEvents.onStart).toBeTruthy();
    expect(checkEvents.onEnd).toBeTruthy();
    expect(checkEvents.onTableRead.length).toBe(3);
    expect(checkEvents.onTableRead).toContain("Attività");
    expect(checkEvents.onTableRead.sort()).toEqual(
      ["Attività", "Users", "To Do"].sort()
    );
  });
});
