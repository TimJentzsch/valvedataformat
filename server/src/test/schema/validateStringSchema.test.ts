import { Range } from "vscode-languageserver/node";
import { astLBracket, astRBracket } from "../../ast/bracket";
import AstNode from "../../ast/node";
import { astObject } from "../../ast/object";
import { astQuotedString, astUnquotedString } from "../../ast/string";
import { getInlineRange } from "../../parser/utils";
import validateNodeSchema from "../../schema/schemaValidation";

describe("validateStringSchema", () => {
  // The name of the test, the node to validate, the expected diagnostic ranges
  const params: Array<[string, AstNode, Range[]]> = [
    [
      "should return no errors for basic schema",
      astUnquotedString("content", getInlineRange(0, 0, 7), { type: "string" }),
      [],
    ],
    [
      "should return no errors for valid complex schema",
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
        pattern: "^\\w+$",
        minLength: 2,
        maxLength: 20,
      }),
      [],
    ],
    [
      "should return no errors for valid const schema",
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
        const: "content",
      }),
      [],
    ],
    [
      "should return no errors for valid enum schema",
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
        enum: ["foo", "content", "bar"],
      }),
      [],
    ],
    [
      "should return no errors for empty string",
      astQuotedString("", getInlineRange(0, 0, 2), true, { type: "string" }),
      [],
    ],
    [
      "should return error for object",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [],
        astRBracket(getInlineRange(0, 1, 2)),
        { type: "string" }
      ),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for const violation",
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
        const: "foo",
      }),
      [getInlineRange(0, 0, 7)],
    ],
    [
      "should return error for enum violation",
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
        enum: ["foo", "bar"],
      }),
      [getInlineRange(0, 0, 7)],
    ],
    [
      "should return error for minLength violation",
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
        minLength: 20,
      }),
      [getInlineRange(0, 0, 7)],
    ],
    [
      "should return error for maxLength violation",
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
        maxLength: 3,
      }),
      [getInlineRange(0, 0, 7)],
    ],
    [
      "should return error for pattern violation",
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
        pattern: "\\d+",
      }),
      [getInlineRange(0, 0, 7)],
    ],
  ];

  for (const [name, node, expectedRanges] of params) {
    test(name, async () => {
      const diagnostics = await validateNodeSchema(node);
      const actualRanges = diagnostics.map((diag) => diag.range);
      expect(actualRanges).toEqual(expectedRanges);
    });
  }
});
