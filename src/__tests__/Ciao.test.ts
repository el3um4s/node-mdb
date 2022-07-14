import { ciao, prova, prova2 } from "../index";
test("ciao", async () => {
  const result = await ciao();
  expect(result).toBe("Ciao Mondo");
});

test("prova", async () => {
  const result = await prova();
  expect(result).toBe("Ciao Mondo");
});

test("prova2", async () => {
  const result = await prova2();
  expect(result).toBe("Ciao Mondo");
});
