import { runVbsBuffer } from "@el3um4s/run-vbs";

const charFromVBS = async (char: string) => {
  const vbs = `Wscript.Echo "${char}"`;
  const result = await runVbsBuffer({ vbs });
  // const r = `${result[0]}`.replace("<Buffer ", "").replace(" 0d 0a>", "");
  const r: { type: number; data: number[] } = JSON.parse(
    JSON.stringify(result[0])
  );
  const a = r.data
    .map((x) => x.toString(16).padStart(2, "0"))
    .filter((x) => x != "0d" && x != "0a")
    .join("");
  return a;
};

const charFromBuffer = (char: string) => {
  const buffer = Buffer.from(char, "utf8");
  return buffer.toString("hex");
};

const showConversion = async (char: string) => {
  const c = char[0];
  const win = await charFromVBS(c);
  const buffer = charFromBuffer(c);

  const charW = Buffer.from(win, "hex");
  const charB = Buffer.from(buffer, "hex");

  console.log(`${c} -> ${win} -> ${buffer}`);
  console.log(`${c} -> ${charW} -> ${charB}`);

  const a = Buffer.from(
    "6369c7ffc7fd".replace("c7ff", "c3a0").replace("c7fd", "c3b2"),
    "hex"
  );
  const b = Buffer.from("6369c3a0c3b2", "hex");

  console.log(`${a}`, `${b}`);

  return { char: c, win, buffer };
};

const args = process.argv.slice(2);

showConversion(args[0]);
