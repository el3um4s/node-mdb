// import { charCorrispondencesWin } from "./charCorrispondencesWin";
import { charCorrispondencesAccess } from "./charCorrispondencesAccess";

const replaceChars = async (text: string) => {
  let textReplaced = text;
  charCorrispondencesAccess.forEach((c) => {
    textReplaced = textReplaced.replace(c.win, c.buffer);
  });
  return textReplaced;

  // const list = await charCorrispondencesWin();
  // const result = text.replace(/[\u0020-\u007F]/g, (char) => {
  //     const win = char.charCodeAt(0).toString(16);
  //     const buffer = char.charCodeAt(0).toString(16);
  //     const corrispondence = list.find((c) => c.win === win);
  //     if (corrispondence) {
  //     return String.fromCharCode(parseInt(corrispondence.buffer, 16));
  //     }
  //     return char;
  // });
};

export const decode = async (text: string): Promise<string> => {
  const textReplaced = await replaceChars(text);
  const result = Buffer.from(textReplaced, "hex");
  return result.toString("utf8");
};
