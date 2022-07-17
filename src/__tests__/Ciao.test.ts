import {
  ciao,
  prova,
  prova2,
  prova3,
  prova4,
  listaCaratteri,
  listaCaratteriCSV,
} from "../index";

// test("ciao", async () => {
//   const result = await ciao();
//   expect(result).toBe("Ciao Mondo");
// });

// test("prova", async () => {
//   const result = await prova();
//   expect(result).toBe("Ciao Mondo");
// });

test("prova2", async () => {
  const result = await prova2();
  expect(result).toBe("Ciao Mondo");
});

// test("prova3", async () => {
//   const result = await prova3();
//   expect(result).toBe("Ciao Mondo");
// });

// test("prova4", async () => {
//   const result = await prova4();
//   expect(result).toBe("Ciao Mondo");
// });

test("listaCaratteri", async () => {
  const result = await listaCaratteri();
  expect(result).toBe("Ciao Mondo");
});
test("listaCaratteriCSV", async () => {
  const result = await listaCaratteriCSV();
  expect(result).toBe("Ciao Mondo");
});
