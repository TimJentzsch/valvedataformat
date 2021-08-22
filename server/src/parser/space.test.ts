import AstSpace from "../ast/space";
import spaceParser from "./space";
import { applyParser, getInlineRange } from "./utils";

// Space parsing
describe("should parse space", () => {
  const params: Array<[string, AstSpace]> = [
    [
      " ",
      {
        type: "space",
        children: [],
        value: " ",
        range: getInlineRange(0, 0, 1),
      },
    ],
    [
      "\t",
      {
        type: "space",
        children: [],
        value: "\t",
        range: getInlineRange(0, 0, 1),
      },
    ],
    [
      "    ",
      {
        type: "space",
        children: [],
        value: "    ",
        range: getInlineRange(0, 0, 4),
      },
    ],
    [
      "\t\t\t\t",
      {
        type: "space",
        children: [],
        value: "\t\t\t\t",
        range: getInlineRange(0, 0, 4),
      },
    ],
    [
      " \t \t",
      {
        type: "space",
        children: [],
        value: " \t \t",
        range: getInlineRange(0, 0, 4),
      },
    ],
    [
      "\t \t ",
      {
        type: "space",
        children: [],
        value: "\t \t ",
        range: getInlineRange(0, 0, 4),
      },
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(spaceParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
