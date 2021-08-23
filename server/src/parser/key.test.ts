import AstKey, { astQuotedKey, astUnquotedKey } from "../ast/key";
import { keyParser } from "./parser";
import { applyParser, getInlineRange } from "./utils";

// Unquoted key parsing
describe("should parse unquoted key", () => {
  const params: Array<[string, AstKey]> = [
    ["value", astUnquotedKey("value", getInlineRange(0, 0, 5))],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(keyParser, input);
      expect(actual).toEqual(expected);
    });
  }
});

// Quoted key parsing
describe("should parse quoted key", () => {
  const params: Array<[string, AstKey]> = [
    ['""', astQuotedKey(true, "", getInlineRange(0, 0, 2))],
    ['"', astQuotedKey(false, "", getInlineRange(0, 0, 1))],
    ['"value"', astQuotedKey(true, "value", getInlineRange(0, 0, 7))],
    ['"value', astQuotedKey(false, "value", getInlineRange(0, 0, 6))],
    [
      '"value with spaces"',
      astQuotedKey(true, "value with spaces", getInlineRange(0, 0, 19)),
    ],
    [
      '"value with {}"',
      astQuotedKey(true, "value with {}", getInlineRange(0, 0, 15)),
    ],
    [
      '"value with \\"',
      astQuotedKey(true, "value with \\", getInlineRange(0, 0, 14)),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(keyParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
