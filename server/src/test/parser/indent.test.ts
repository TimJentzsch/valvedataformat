import AstIndent, { astSpaces, astTabs } from "../../ast/indent";
import { indentParser } from "../../parser/parser";
import { applyParser, getInlineRange } from "../../parser/utils";

// Indent parsing (spaces and tabs)
describe("should parse indent", () => {
  const params: Array<[string, AstIndent]> = [
    [
      " ",
      astSpaces(1, getInlineRange(0, 0, 1)),
    ],
    [
      "\t",
      astTabs(1, getInlineRange(0, 0, 1)),
    ],
    [
      "    ",
      astSpaces(4, getInlineRange(0, 0, 4)),
    ],
    [
      "\t\t\t\t",
      astTabs(4, getInlineRange(0, 0, 4)),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(indentParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
