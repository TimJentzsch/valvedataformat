import { astIndent } from "../ast/indent";
import { astQuotedKey, astUnquotedKey } from "../ast/key";
import AstProperty, { astProperty } from "../ast/property";
import { astQuotedString, astUnquotedString } from "../ast/string";
import { stringPropertyParser } from "./parser";
import { applyParser, getInlineRange } from "./utils";

// String properties
describe("should parse string properties", () => {
  const key1 = astUnquotedKey("key", getInlineRange(0, 0, 3));
  const indent1 = astIndent(" ", getInlineRange(0, 3, 4));
  const value1 = astUnquotedString("value", getInlineRange(0, 4, 9));

  const key2 = astQuotedKey(true, "key", getInlineRange(0, 0, 5));
  const indent2 = astIndent(" ", getInlineRange(0, 5, 6));
  const value2 = astQuotedString(true, "value", getInlineRange(0, 6, 13));

  const params: Array<[string, AstProperty]> = [
    ["key value", astProperty([key1, indent1, value1], key1, value1)],
    ['"key" "value"', astProperty([key2, indent2, value2], key2, value2)],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(stringPropertyParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
