import { astComment } from "../ast/comment";
import { astIndent } from "../ast/indent";
import { astQuotedKey, astUnquotedKey } from "../ast/key";
import AstProperty, { astStringProperty } from "../ast/property";
import { astQuotedString, astUnquotedString } from "../ast/string";
import { propertyParser, stringPropertyParser } from "./parser";
import { applyParser, getInlineRange } from "./utils";

/** Parameters for string properties */
const stringParams: Array<[string, AstProperty]> = [
  [
    "key value",
    astStringProperty(
      astUnquotedKey("key", getInlineRange(0, 0, 3)),
      astUnquotedString("value", getInlineRange(0, 4, 9)),
      [astIndent(" ", getInlineRange(0, 3, 4))]
    ),
  ],
  [
    "key\tvalue",
    astStringProperty(
      astUnquotedKey("key", getInlineRange(0, 0, 3)),
      astUnquotedString("value", getInlineRange(0, 4, 9)),
      [astIndent("\t", getInlineRange(0, 3, 4))]
    ),
  ],
  [
    '"key" "value"',
    astStringProperty(
      astQuotedKey("key", getInlineRange(0, 0, 5)),
      astQuotedString(true, "value", getInlineRange(0, 6, 13)),
      [astIndent(" ", getInlineRange(0, 5, 6))]
    ),
  ],
  [
    '"key""value"',
    astStringProperty(
      astQuotedKey("key", getInlineRange(0, 0, 5)),
      astQuotedString(true, "value", getInlineRange(0, 5, 12))
    ),
  ],
  [
    '"key" "value',
    astStringProperty(
      astQuotedKey("key", getInlineRange(0, 0, 5)),
      astQuotedString(false, "value", getInlineRange(0, 6, 12)),
      [astIndent(" ", getInlineRange(0, 5, 6))]
    ),
  ],
  [
    '"key and // stuff',
    astStringProperty(
      astQuotedKey("key and // stuff", getInlineRange(0, 0, 17), false)
    ),
  ],
  [
    '"key" "value" // Comment',
    astStringProperty(
      astQuotedKey("key", getInlineRange(0, 0, 5)),
      astQuotedString(true, "value", getInlineRange(0, 6, 13)),
      [astIndent(" ", getInlineRange(0, 5, 6))],
      [
        astIndent(" ", getInlineRange(0, 13, 14)),
        astComment(" Comment", getInlineRange(0, 14, 24)),
      ]
    ),
  ],
  [
    "key // Comment",
    astStringProperty(
      astUnquotedKey("key", getInlineRange(0, 0, 3)),
      undefined,
      [
        astIndent(" ", getInlineRange(0, 3, 4)),
        astComment(" Comment", getInlineRange(0, 4, 14)),
      ]
    ),
  ],
];

// String properties
describe("stringPropertyParser", () => {
  for (const [input, expected] of stringParams) {
    test(input, () => {
      const actual = applyParser(stringPropertyParser, input);
      expect(actual).toEqual(expected);
    });
  }
});


// Properties
describe("propertyParser", () => {
  describe('should parse string properties', () => {
    for (const [input, expected] of stringParams) {
      test(input, () => {
        const actual = applyParser(propertyParser, input);
        expect(actual).toEqual(expected);
      });
    }
  });
});
