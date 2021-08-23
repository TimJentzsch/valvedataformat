import AstSpace, { astSpace } from "../ast/space";
import { spaceParser } from "./parser";
import { applyParser, getInlineRange } from "./utils";

// Space parsing
describe("should parse space", () => {
  const params: Array<[string, AstSpace]> = [
    [
      " ",
      astSpace(" ", getInlineRange(0, 0, 1)),
    ],
    [
      "\t",
      astSpace("\t", getInlineRange(0, 0, 1)),
    ],
    [
      "    ",
      astSpace("    ", getInlineRange(0, 0, 4)),
    ],
    [
      "\t\t\t\t",
      astSpace("\t\t\t\t", getInlineRange(0, 0, 4)),
    ],
    [
      " \t \t",
      astSpace(" \t \t", getInlineRange(0, 0, 4)),
    ],
    [
      "\t \t ",
      astSpace("\t \t ", getInlineRange(0, 0, 4)),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(spaceParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
