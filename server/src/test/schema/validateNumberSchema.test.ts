import { Range } from "vscode-languageserver/node";
import { astLBracket, astRBracket } from "../../ast/bracket";
import AstNode from "../../ast/node";
import { astObject } from "../../ast/object";
import { astQuotedString, astUnquotedString } from "../../ast/string";
import { getInlineRange } from "../../parser/utils";
import validateNodeSchema from "../../schema/schemaValidation";

describe("validateNumberSchema", () => {
  // The name of the test, the node to validate, the expected diagnostic ranges
  const params: Array<[string, AstNode, Range[]]> = [
    [
      "should return no errors for 0",
      astUnquotedString("0", getInlineRange(0, 0, 1), {
        type: "number",
      }),
      [],
    ],
    [
      "should return no errors for 1",
      astUnquotedString("1", getInlineRange(0, 0, 1), {
        type: "number",
      }),
      [],
    ],
    [
      "should return no errors for 2561",
      astUnquotedString("2561", getInlineRange(0, 0, 4), {
        type: "number",
      }),
      [],
    ],
    [
      "should return no errors for 364.0",
      astUnquotedString("364.0", getInlineRange(0, 0, 5), {
        type: "number",
      }),
      [],
    ],
    [
      "should return no errors for 2.3",
      astUnquotedString("2.3", getInlineRange(0, 0, 3), {
        type: "number",
      }),
      [],
    ],
    [
      "should return no errors for 376.3123198",
      astUnquotedString("376.3123198", getInlineRange(0, 0, 11), {
        type: "number",
      }),
      [],
    ],
    [
      "should return no errors for valid complex schema",
      astUnquotedString("23.0", getInlineRange(0, 0, 4), {
        type: "number",
        minimum: 23,
        exclusiveMinimum: 22,
        maximum: 23,
        exclusiveMaxmimum: 24,
      }),
      [],
    ],
    [
      "should return no errors for valid const schema",
      astUnquotedString("3.2", getInlineRange(0, 0, 3), {
        type: "number",
        const: 3.2,
      }),
      [],
    ],
    [
      "should return no errors for valid enum schema",
      astUnquotedString("3.2", getInlineRange(0, 0, 3), {
        type: "number",
        enum: [2.8, 7.0, 3.2],
      }),
      [],
    ],
    [
      "should return error for empty string",
      astQuotedString("", getInlineRange(0, 0, 2), true, { type: "number" }),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for content string",
      astQuotedString("content", getInlineRange(0, 0, 9), true, {
        type: "number",
      }),
      [getInlineRange(0, 0, 9)],
    ],
    [
      "should return error for partial int",
      astQuotedString("34a", getInlineRange(0, 0, 4), true, {
        type: "number",
      }),
      [getInlineRange(0, 0, 4)],
    ],
    [
      "should return error for object",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [],
        astRBracket(getInlineRange(0, 1, 2)),
        { type: "number" }
      ),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for const violation",
      astUnquotedString("4.3", getInlineRange(0, 0, 3), {
        type: "number",
        const: 3.8,
      }),
      [getInlineRange(0, 0, 3)],
    ],
    [
      "should return error for enum violation",
      astUnquotedString("7.4", getInlineRange(0, 0, 3), {
        type: "number",
        enum: [3.9, 2.1, 7.2, 100.6789],
      }),
      [getInlineRange(0, 0, 3)],
    ],
    [
      "should return error for minimum violation",
      astUnquotedString("23.1", getInlineRange(0, 0, 4), {
        type: "number",
        minimum: 23.11,
      }),
      [getInlineRange(0, 0, 4)],
    ],
    [
      "should return error for maximum violation",
      astUnquotedString("23.1", getInlineRange(0, 0, 4), {
        type: "number",
        maximum: 23.09,
      }),
      [getInlineRange(0, 0, 4)],
    ],
    [
      "should return error for exclusive minimum violation",
      astUnquotedString("23.1", getInlineRange(0, 0, 4), {
        type: "number",
        exclusiveMinimum: 23.1,
      }),
      [getInlineRange(0, 0, 4)],
    ],
    [
      "should return error for exclusive maximum violation",
      astUnquotedString("23.1", getInlineRange(0, 0, 4), {
        type: "number",
        exclusiveMaxmimum: 23.1,
      }),
      [getInlineRange(0, 0, 4)],
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
