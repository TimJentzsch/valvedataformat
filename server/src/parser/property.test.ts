import { astIndent } from "../ast/indent";
import { astQuotedKey, astUnquotedKey } from "../ast/key";
import AstProperty, { astProperty, astStringProperty } from "../ast/property";
import { astQuotedString, astUnquotedString } from "../ast/string";
import { stringPropertyParser } from "./parser";
import { applyParser, getInlineRange } from "./utils";

// String properties
describe("should parse string properties", () => {
  const params: Array<[string, AstProperty]> = [
    [
      "key value",
      astStringProperty(
        astUnquotedKey("key", getInlineRange(0, 0, 3)),
        astUnquotedString("value", getInlineRange(0, 4, 9)),
        [astIndent(" ", getInlineRange(0, 3, 4))]
      ),
    ],
    [
      '"key" "value"',
      astStringProperty(
        astQuotedKey(true, "key", getInlineRange(0, 0, 5)),
        astQuotedString(true, "value", getInlineRange(0, 6, 13)),
        [astIndent(" ", getInlineRange(0, 5, 6))]
      ),
    ],
    [
      '"key""value"',
      astStringProperty(
        astQuotedKey(true, "key", getInlineRange(0, 0, 5)),
        astQuotedString(true, "value", getInlineRange(0, 5, 12))
      ),
    ],
    [
      '"key" "value',
      astStringProperty(
        astQuotedKey(true, "key", getInlineRange(0, 0, 5)),
        astQuotedString(false, "value", getInlineRange(0, 6, 12)),
        [astIndent(" ", getInlineRange(0, 5, 6))]
      ),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(stringPropertyParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
