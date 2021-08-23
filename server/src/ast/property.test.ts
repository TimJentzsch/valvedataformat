import { getInlineRange } from "../parser/utils";
import { astIndent } from "./indent";
import { astUnquotedKey } from "./key";
import AstProperty, { astProperty } from "./property";
import {
  astQuotedString,
} from "./string";

describe("astProperty", () => {
  test("should properly create property", () => {
    const key = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const indent = astIndent(" ", getInlineRange(0, 3, 4));
    const value = astQuotedString(true, "value", getInlineRange(0, 4, 11));

    const actual = astProperty([key, indent, value], key, value);
    const expected: AstProperty = {
      type: "property",
      key,
      value,
      children: [key, indent, value],
      range: getInlineRange(0, 0, 11),
    };

    expect(actual).toEqual(expected);
  });
});
