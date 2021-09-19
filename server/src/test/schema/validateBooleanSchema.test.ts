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
      "should return no errors for 0",
      astUnquotedString("0", getInlineRange(0, 0, 1), { type: "boolean" }),
      [],
    ],
    [
      "should return no errors for 1",
      astUnquotedString("1", getInlineRange(0, 0, 1), { type: "boolean" }),
      [],
    ],
    [
      "should return no errors for valid const schema",
      astUnquotedString("0", getInlineRange(0, 0, 1), {
        type: "boolean",
        const: "0",
      }),
      [],
    ],
    [
      "should return no errors for valid enum schema",
      astUnquotedString("1", getInlineRange(0, 0, 1), {
        type: "boolean",
        enum: ["1"],
      }),
      [],
    ],
    [
      "should return error for empty string",
      astQuotedString("", getInlineRange(0, 0, 2), true, { type: "boolean" }),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for object",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [],
        astRBracket(getInlineRange(0, 1, 2)),
        { type: "boolean" }
      ),
      [getInlineRange(0, 0, 2)],
    ],
    [
      "should return error for const violation",
      astUnquotedString("0", getInlineRange(0, 0, 1), {
        type: "boolean",
        const: "1",
      }),
      [getInlineRange(0, 0, 1)],
    ],
    [
      "should return error for enum violation",
      astUnquotedString("1", getInlineRange(0, 0, 1), {
        type: "boolean",
        enum: ["0"],
      }),
      [getInlineRange(0, 0, 1)],
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
