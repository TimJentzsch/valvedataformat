import { astIndent } from "../ast/indent";
import { astQuotedKey, astUnquotedKey } from "../ast/key";
import AstProperty, { astProperty } from "../ast/property";
import { astQuotedString, astUnquotedString } from "../ast/string";
import { stringPropertyParser } from "./parser";
import { applyParser, getInlineRange } from "./utils";

// String properties
describe("should parse string properties", () => {
  const input1 = "key value";
  const key1 = astUnquotedKey("key", getInlineRange(0, 0, 3));
  const indent1 = astIndent(" ", getInlineRange(0, 3, 4));
  const value1 = astUnquotedString("value", getInlineRange(0, 4, 9));

  const input2 = '"key" "value"';
  const key2 = astQuotedKey(true, "key", getInlineRange(0, 0, 5));
  const indent2 = astIndent(" ", getInlineRange(0, 5, 6));
  const value2 = astQuotedString(true, "value", getInlineRange(0, 6, 13));

  const input3 = '"key""value"';
  const key3 = astQuotedKey(true, "key", getInlineRange(0, 0, 5));
  const value3 = astQuotedString(true, "value", getInlineRange(0, 5, 12));

  const input4 = '"key" "value';
  const key4 = astQuotedKey(true, "key", getInlineRange(0, 0, 5));
  const indent4 = astIndent(" ", getInlineRange(0, 5, 6));
  const value4 = astQuotedString(false, "value", getInlineRange(0, 6, 12));

  const params: Array<[string, AstProperty]> = [
    [input1, astProperty([key1, indent1, value1], key1, value1)],
    [input2, astProperty([key2, indent2, value2], key2, value2)],
    [input3, astProperty([key3, value3], key3, value3)],
    [input4, astProperty([key4, indent4, value4], key4, value4)],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(stringPropertyParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
