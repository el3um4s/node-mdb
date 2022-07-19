import { table } from "../index";

const database = "./src/__tests__/test.mdb";

describe("API: tables", () => {
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
    expect(result.sort()).toEqual(expected.sort());
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

  test("table.list_toFile", async () => {
    const result = await table.list_toFile({
      database,
      file: "./src/__tests__/exportedToFiles/list_toFile.txt",
    });
    expect(result).toBe(true);
  });
});
