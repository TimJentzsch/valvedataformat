import AstKey, { astQuotedKey, astUnquotedKey } from "../../ast/key";
import { Range } from "vscode-languageserver/node";
import { getInlineRange } from "../../parser/utils";
import { validateKey, validateObject, validateProperty, validateString } from "../../capabilities/validation";
import AstString, { astQuotedString, astUnquotedString } from "../../ast/string";
import AstProperty, { astObjectProperty, astStringProperty } from "../../ast/property";
import { astIndent, astSpaces } from "../../ast/indent";
import AstObject, { astObject } from "../../ast/object";
import { astLBracket, astRBracket } from "../../ast/bracket";

// Key
describe("validateKey", () => {
  // Test name, input AST node and the ranges of the output diagnostics.
  const params: Array<[string, AstKey, Range[]]> = [
    [
      "should not have errors for unquoted key",
      astUnquotedKey("key", getInlineRange(0, 0, 3)),
      [],
    ],
    [
      "should not have errors for terminated quoted key",
      astQuotedKey("key", getInlineRange(0, 0, 5)),
      [],
    ],
    [
      "should have error for unterminated quoted key",
      astQuotedKey("key", getInlineRange(0, 0, 4), false),
      [getInlineRange(0, 3, 4)],
    ],
  ];

  for (const [name, key, expectedRanges] of params) {
    test(name, () => {
      return validateKey(key).then((diagnostics) => {
        const actualRanges = diagnostics.map((diag) => diag.range);
        expect(actualRanges).toEqual(expectedRanges);
      });
    });
  }
});

// String
describe("validateString", () => {
  // Test name, input AST node and the ranges of the output diagnostics.
  const params: Array<[string, AstString, Range[]]> = [
    [
      "should not have errors for unquoted string",
      astUnquotedString("value", getInlineRange(0, 0, 5)),
      [],
    ],
    [
      "should not have errors for terminated quoted string",
      astQuotedString("value", getInlineRange(0, 0, 7)),
      [],
    ],
    [
      "should have error for unterminated quoted string",
      astQuotedString("value", getInlineRange(0, 0, 6), false),
      [getInlineRange(0, 5, 6)],
    ],
  ];

  for (const [name, str, expectedRanges] of params) {
    test(name, () => {
      return validateString(str).then((diagnostics) => {
        const actualRanges = diagnostics.map((diag) => diag.range);
        expect(actualRanges).toEqual(expectedRanges);
      });
    });
  }
});

// Property
describe("validateProperty", () => {
  // Test name, input AST node and the ranges of the output diagnostics.
  const params: Array<[string, AstProperty, Range[]]> = [
    [
      "should not have errors for valid unquoted string property",
      astStringProperty(
        astUnquotedKey("key", getInlineRange(0, 0, 3)),
        [astSpaces(1, getInlineRange(0, 3, 4))],
        astUnquotedString("value", getInlineRange(0, 4, 9))
      ),
      [],
    ],
    [
      "should have error for string property without value",
      astStringProperty(astUnquotedKey("key", getInlineRange(0, 0, 3)), [
        astSpaces(1, getInlineRange(0, 3, 4)),
      ]),
      [getInlineRange(0, 0, 3)],
    ],
    [
      "should have errors for unterminated quoted key and value",
      astStringProperty(
        astQuotedKey("key", getInlineRange(0, 0, 4), false),
        [astSpaces(1, getInlineRange(0, 4, 5))],
        astQuotedString("value", getInlineRange(0, 5, 11), false)
      ),
      [getInlineRange(0, 3, 4), getInlineRange(0, 10, 11)],
    ],
    [
      "should have error for object property without key",
      astObjectProperty(
        undefined,
        [],
        astObject(
          astLBracket(getInlineRange(0, 0, 1)),
          [],
          astRBracket(getInlineRange(0, 1, 2)),
        )
      ),
      [getInlineRange(0, 0, 1)],
    ],
  ];

  for (const [name, property, expectedRanges] of params) {
    test(name, () => {
      return validateProperty(property).then((diagnostics) => {
        const actualRanges = diagnostics.map((diag) => diag.range);
        expect(actualRanges).toEqual(expectedRanges);
      });
    });
  }
});

// Object
describe("validateObject", () => {
  // Test name, input AST node and the ranges of the output diagnostics.
  const params: Array<[string, AstObject, Range[]]> = [
    [
      "should not have errors for valid empty object",
      astObject(astLBracket(getInlineRange(0, 0, 1)), [], astRBracket(getInlineRange(0, 1, 2))),
      [],
    ],
    [
      "should have error for object without closing bracket",
      astObject(astLBracket(getInlineRange(0, 0, 1))),
      [getInlineRange(0, 0, 1)],
    ],
    [
      "should have error for property without key",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astUnquotedKey("key", getInlineRange(0, 1, 4)),
          )
        ],
        astRBracket(getInlineRange(0, 4, 5)),
      ),
      [getInlineRange(0, 1, 4)],
    ],
  ];

  for (const [name, obj, expectedRanges] of params) {
    test(name, async () => {
      const diagnostics = await validateObject(obj);
      const actualRanges = diagnostics.map((diag) => diag.range);
      expect(actualRanges).toEqual(expectedRanges);
    });
  }
});
