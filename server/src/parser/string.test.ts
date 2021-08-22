import AstString, { astQuotedString, astUnquotedString } from "../ast/string";
import stringParser from "./string";
import { applyParser, getInlineRange } from "./utils";

// Unquoted string parsing
describe("should parse unquoted string", () => {
  const params: Array<[string, AstString]> = [
    ["value", astUnquotedString("value", getInlineRange(0, 0, 5))],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(stringParser, input);
      expect(actual).toEqual(expected);
    });
  }
});

// Quoted string parsing
describe("should parse quoted string", () => {
  const params: Array<[string, AstString]> = [
    ['""', astQuotedString(true, "", getInlineRange(0, 0, 2))],
    ['"', astQuotedString(false, "", getInlineRange(0, 0, 1))],
    ['"value"', astQuotedString(true, "value", getInlineRange(0, 0, 7))],
    ['"value', astQuotedString(false, "value", getInlineRange(0, 0, 6))],
    [
      '"value with spaces"',
      astQuotedString(true, "value with spaces", getInlineRange(0, 0, 19)),
    ],
    [
      '"value with {}"',
      astQuotedString(true, "value with {}", getInlineRange(0, 0, 15)),
    ],
    [
      '"value with \\"',
      astQuotedString(true, "value with \\", getInlineRange(0, 0, 14)),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(stringParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
