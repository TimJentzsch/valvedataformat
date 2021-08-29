import { Position } from "vscode-languageserver/node";
import { getOffsetFromPosition } from "./utils";

describe("getOffsetFromPosition", () => {
  const params: Array<[string, Position, number]> = [
    ["Test", { line: 0, character: 0 }, 0],
    ["Test", { line: 0, character: 3 }, 3],
    ["Test\nWith lines", { line: 1, character: 3 }, 8],
  ];

  for (const [content, pos, expected] of params) {
    test(`${content} [${pos.line}/${pos.character}]`, () => {
      const actual = getOffsetFromPosition(content, pos);
      expect(actual).toEqual(expected);
    });
  }
});
