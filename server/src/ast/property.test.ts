import { getInlineRange } from "../parser/utils";
import { astIndent } from "./indent";
import { astUnquotedKey } from "./key";
import AstProperty, { astProperty } from "./property";
import AstString, {
  astQuotedString,
  astUnquotedString,
} from "./string";

describe("astProperty", () => {
  test("should properly create property", () => {
    const key = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const indent = astIndent(" ", getInlineRange(0, 3, 4));
    const value = astQuotedString(true, "value", getInlineRange(0, 4, 11));
    const actual = astProperty(key, value, [key, indent, value]);

    const expectedKey = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const expectedIndent = astIndent(" ", getInlineRange(0, 3, 4));
    const expectedValue = astQuotedString(true, "value", getInlineRange(0, 4, 11));
    const expected: AstProperty = {
      type: "property",
      key: expectedKey,
      value: expectedValue,
      children: [expectedKey, expectedIndent, expectedValue],
      range: getInlineRange(0, 0, 11),
    };
    expectedKey.parent = expected;
    expectedIndent.parent = expected;
    expectedValue.parent = expected;

    expect(actual).toEqual(expected);
  });

  test("should properly assign parent references", () => {
    const key = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const indent = astIndent(" ", getInlineRange(0, 3, 4));
    const value = astQuotedString(true, "value", getInlineRange(0, 4, 11));
    const actual = astProperty(key, value, [key, indent, value]);

    for (const child of actual.children) {
      expect(child.parent).toBe(actual);
    }
    expect(actual.key.parent).toBe(actual);
    expect(actual.value?.parent).toBe(actual);
  });
});
