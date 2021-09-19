import { Range } from "vscode-languageserver/node";
import { astLBracket, astRBracket } from "../../ast/bracket";
import AstNode from "../../ast/node";
import { astObject } from "../../ast/object";
import { astQuotedString, astUnquotedString } from "../../ast/string";
import { getInlineRange } from "../../parser/utils";
import validateNodeSchema from "../../schema/schemaValidation";

describe("validateIntegerSchema", () => {
  // The name of the test, the node to validate, the expected diagnostic ranges
  const params: Array<[string, AstNode, Range[]]> = [
    [
      "should return no errors for 0",
      astUnquotedString("0", getInlineRange(0, 0, 1), {
        type: "integer",
      }),
      [],
    ],
    [
      "should return no errors for 1",
      astUnquotedString("1", getInlineRange(0, 0, 1), {
        type: "integer",
      }),
      [],
    ],
    [
      "should return no errors for 2561",
      astUnquotedString("2561", getInlineRange(0, 0, 4), {
        type: "integer",
      }),
      [],
    ],
    [
      "should return no errors for 364.0",
      astUnquotedString("364.0", getInlineRange(0, 0, 5), {
        type: "integer",
      }),
      [],
    ],
    [
      "should return error for 2.3",
      astUnquotedString("2.3", getInlineRange(0, 0, 3), {
        type: "integer",
      }),
      [getInlineRange(0, 0, 3)],
    ],
    [
      "should return no errors for valid complex schema",
      astUnquotedString("20", getInlineRange(0, 0, 2), {
        type: "integer",
        minimum: 20,
        exclusiveMinimum: 19,
        maximum: 20,
        exclusiveMaxmimum: 21,
        multipleOf: 5,
      }),
      [],
    ],
    [
      "should return no errors for valid const schema",
      astUnquotedString("3", getInlineRange(0, 0, 1), {
        type: "integer",
        const: 3,
      }),
      [],
    ],
    [
      "should return no errors for valid enum schema",
      astUnquotedString("3", getInlineRange(0, 0, 1), {
        type: "integer",
        enum: [2, 7, 3],
      }),
      [],
    ],
    [
      "should return error for empty string",
      astQuotedString("", getInlineRange(0, 0, 2), true, { type: "integer" }),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for content string",
      astQuotedString("content", getInlineRange(0, 0, 9), true, {
        type: "integer",
      }),
      [getInlineRange(0, 0, 9)],
    ],
    [
      "should return error for partial int",
      astQuotedString("34a", getInlineRange(0, 0, 4), true, {
        type: "integer",
      }),
      [getInlineRange(0, 0, 4)],
    ],
    [
      "should return error for object",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [],
        astRBracket(getInlineRange(0, 1, 2)),
        { type: "integer" }
      ),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for const violation",
      astUnquotedString("4", getInlineRange(0, 0, 1), {
        type: "integer",
        const: 3,
      }),
      [getInlineRange(0, 0, 1)],
    ],
    [
      "should return error for enum violation",
      astUnquotedString("7", getInlineRange(0, 0, 1), {
        type: "integer",
        enum: [3, 2, 100],
      }),
      [getInlineRange(0, 0, 1)],
    ],
    [
      "should return error for minimum violation",
      astUnquotedString("23", getInlineRange(0, 0, 2), {
        type: "integer",
        minimum: 24,
      }),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for maximum violation",
      astUnquotedString("23", getInlineRange(0, 0, 2), {
        type: "integer",
        maximum: 22,
      }),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for exclusive minimum violation",
      astUnquotedString("23", getInlineRange(0, 0, 2), {
        type: "integer",
        exclusiveMinimum: 23,
      }),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for exclusive maximum violation",
      astUnquotedString("23", getInlineRange(0, 0, 2), {
        type: "integer",
        exclusiveMaxmimum: 23,
      }),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for multipleOf violation",
      astUnquotedString("23", getInlineRange(0, 0, 2), {
        type: "integer",
        multipleOf: 5,
      }),
      [getInlineRange(0, 0, 2)],
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
