import {
  ciao,
  prova,
  prova2,
  prova3,
  prova4,
  listaCaratteri,
  listaCaratteriCSV,
  tablesList,
  tablesListAll,
  tablesListSystem,
  tableSchema,
} from "../index";

const database = "./src/__tests__/test.mdb";

describe("API: tables", () => {
  test("tablesListAll", async () => {
    const result = await tablesListAll({ database });
    // console.log(result);

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

  test("tableSchema", async () => {
    const result = await tableSchema({ database, table: "to do" });

    const expected = [
      { DESC: "Integer", NAME: "ord", TYPE: "3" },
      { DESC: "VarWChar", NAME: "to do", TYPE: "202" },
    ];

    expect(result.sort()).toEqual(expected.sort());
  });
});

// test("ciao", async () => {
//   const result = await ciao();
//   expect(result).toBe("Ciao Mondo");
// });

// test("prova", async () => {
//   const result = await prova();
//   expect(result).toBe("Ciao Mondo");
// });

// test("prova2", async () => {
//   const result = await prova2();
//   expect(result).toBe("Ciao Mondo");
// });

// test("prova3", async () => {
//   const result = await prova3();
//   expect(result).toBe("Ciao Mondo");
// });

// test("prova4", async () => {
//   const result = await prova4();
//   expect(result).toBe("Ciao Mondo");
// });

// test("listaCaratteri", async () => {
//   const result = await listaCaratteri();
//   expect(result).toBe("Ciao Mondo");
// });
// test("listaCaratteriCSV", async () => {
//   const result = await listaCaratteriCSV();
//   expect(result).toBe("Ciao Mondo");
// });
