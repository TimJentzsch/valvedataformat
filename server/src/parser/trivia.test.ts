import { astComment } from "../ast/comment";
import { astIndent } from "../ast/indent";
import Trivia from "../ast/trivia";
import { triviaParser } from "./parser";
import { applyParser, getInlineRange } from "./utils";

// Trivia parsing
describe("should parse trivia", () => {
  const params: Array<[string, Trivia[]]> = [
    [
      "",
      []
    ],
    [
      "// Comment",
      [
        astComment(" Comment", getInlineRange(0, 0, 10)),
      ]
    ],
    [
      " ",
      [
        astIndent(" ", getInlineRange(0, 0, 1)),
      ]
    ],
    [
      "  // Comment",
      [
        astIndent("  ", getInlineRange(0, 0, 2)),
        astComment(" Comment", getInlineRange(0, 2, 12)),
      ]
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(triviaParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
