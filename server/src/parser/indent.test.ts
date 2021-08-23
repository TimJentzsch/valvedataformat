import AstIndent, { astIndent } from "../ast/indent";
import { indentParser } from "./parser";
import { applyParser, getInlineRange } from "./utils";

// Indent parsing (spaces and tabs)
describe("should parse indent", () => {
  const params: Array<[string, AstIndent]> = [
    [
      " ",
      astIndent(" ", getInlineRange(0, 0, 1)),
    ],
    [
      "\t",
      astIndent("\t", getInlineRange(0, 0, 1)),
    ],
    [
      "    ",
      astIndent("    ", getInlineRange(0, 0, 4)),
    ],
    [
      "\t\t\t\t",
      astIndent("\t\t\t\t", getInlineRange(0, 0, 4)),
    ],
    [
      " \t \t",
      astIndent(" \t \t", getInlineRange(0, 0, 4)),
    ],
    [
      "\t \t ",
      astIndent("\t \t ", getInlineRange(0, 0, 4)),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(indentParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
