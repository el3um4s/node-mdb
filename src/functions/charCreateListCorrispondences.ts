import { runVbsBuffer } from "@el3um4s/run-vbs";

import { charList } from "./charList";

import { decode } from "./decode";

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

const stringFromVBS = async (str: string) => {
  const win = await charFromVBS(str);
  const stringW = Buffer.from(win, "hex");
  console.log(`${str} -> ${win} -> ${stringW}`);

  const prova = await decode("4369616f204d6f6e646fb6f8c7ff");
  console.log(prova);

  const testA = `7b22736368656d61223a5b7b225441424c455f4e414d45223a22f8222c225441424c455f54595045223a225441424c45227d2c7b225441424c455f4e414d45223a2261222c225441424c455f54595045223a225441424c45227d2c7b225441424c455f4e414d45223a226185222c225441424c455f54595045223a225441424c45227d2c7b225441424c455f4e414d45223a224d5379734163636573734f626a65637473222c225441424c455f54595045223a22414343455353205441424c45227d2c7b225441424c455f4e414d45223a224d537973416363657373584d4c222c225441424c455f54595045223a22414343455353205441424c45227d2c7b225441424c455f4e414d45223a224d53797341434573222c225441424c455f54595045223a2253595354454d205441424c45227d2c7b225441424c455f4e414d45223a224d5379734e616d654d6170222c225441424c455f54595045223a22414343455353205441424c45227d2c7b225441424c455f4e414d45223a224d5379734e617650616e6547726f757043617465676f72696573222c225441424c455f54595045223a22414343455353205441424c45227d2c7b225441424c455f4e414d45223a224d5379734e617650616e6547726f757073222c225441424c455f54595045223a22414343455353205441424c45227d2c7b225441424c455f4e414d45223a224d5379734e617650616e6547726f7570546f4f626a65637473222c225441424c455f54595045223a22414343455353205441424c45227d2c7b225441424c455f4e414d45223a224d5379734e617650616e654f626a656374494473222c225441424c455f54595045223a22414343455353205441424c45227d2c7b225441424c455f4e414d45223a224d5379734f626a65637473222c225441424c455f54595045223a2253595354454d205441424c45227d2c7b225441424c455f4e414d45223a224d53797351756572696573222c225441424c455f54595045223a2253595354454d205441424c45227d2c7b225441424c455f4e414d45223a224d53797352656c6174696f6e7368697073222c225441424c455f54595045223a2253595354454d205441424c45227d5d7d0d0a`;
  const graffa = "7b";
  const graffaEnd = "7d";
  const apici = "22";
  const schema = "736368656d61";
  const square = "5b";
  const squareClose = "5d";
  const colon = "3a";
  const comma = "2c";
  const TABLE_NAME = "5441424c455f4e414d45";
  const TABLE_TYPE = "5441424c455f54595045";
  const TABLE = "5441424c45";
  const altro =
    "4d5379734163636573734f626a65637473414343455353204d537973416363657373584d4c414343455353204d5379734143457353595354454d204d5379734e616d654d6170414343455353204d5379734e617650616e6547726f757043617465676f72696573414343455353204d5379734e617650616e6547726f757073414343455353204d5379734e617650616e6547726f7570546f4f626a65637473414343455353204d5379734e617650616e654f626a656374494473414343455353204d5379734f626a6563747353595354454d204d5379735175657269657353595354454d204d53797352656c6174696f6e736869707353595354454d200d0a";

  const r = testA
    .replaceAll(graffa, "")
    .replaceAll(graffaEnd, "")
    .replaceAll(apici, "")
    .replaceAll(schema, "")
    .replaceAll(square, "")
    .replaceAll(squareClose, "")
    .replaceAll(colon, "")
    .replaceAll(comma, "")
    .replaceAll(TABLE_NAME, "")
    .replaceAll(TABLE_TYPE, "")
    .replaceAll(TABLE, "")
    .replaceAll(altro, "");
  console.log(r);
  const test = await decode(r);
  console.log(test);
  return win;
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

const getCorrispondence = async (char: string) => {
  const c = char[0];
  const win = await charFromVBS(c);
  const buffer = charFromBuffer(c);
  return { char: c, win, buffer };
};

const createListCorrispondences = async () => {
  const list = await Promise.all(charList.map(getCorrispondence));
  return list;
};

const createCorrispondenceWinToBuffer = async () => {
  const list: { [key: string]: string } = {};
  for (const char of charList) {
    const win = await charFromVBS(char);
    const buffer = charFromBuffer(char);
    list[win] = buffer;
  }
  return list;
};

const test = async () => {
  console.log("start");
  const list = await createListCorrispondences();
  console.log("end");
  console.log(list);
  return list;
};

// test();
const args = process.argv.slice(2);

// showConversion(args[0]);

stringFromVBS(args[0]);
