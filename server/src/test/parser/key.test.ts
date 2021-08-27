import AstKey, { astQuotedKey, astUnquotedKey } from "../../ast/key";
import { keyParser } from "../../parser/parser";
import { applyParser, getInlineRange } from "../../parser/utils";

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
    ['""', astQuotedKey( "", getInlineRange(0, 0, 2))],
    ['"', astQuotedKey("", getInlineRange(0, 0, 1), false)],
    ['"value"', astQuotedKey("value", getInlineRange(0, 0, 7))],
    ['"value', astQuotedKey("value", getInlineRange(0, 0, 6), false)],
    [
      '"value with spaces"',
      astQuotedKey("value with spaces", getInlineRange(0, 0, 19)),
    ],
    [
      '"value with {}"',
      astQuotedKey("value with {}", getInlineRange(0, 0, 15)),
    ],
    [
      '"value with \\"',
      astQuotedKey("value with \\", getInlineRange(0, 0, 14)),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(keyParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
