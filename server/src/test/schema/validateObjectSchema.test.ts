import { Range } from "vscode-languageserver/node";
import { astLBracket, astRBracket } from "../../ast/bracket";
import AstNode from "../../ast/node";
import { astObject } from "../../ast/object";
import { astUnquotedString } from "../../ast/string";
import { getInlineRange } from "../../parser/utils";
import validateNodeSchema from "../../schema/schemaValidation";

describe("validateObjectSchema", () => {
  // The name of the test, the node to validate, the expected diagnostic ranges
  const params: Array<[string, AstNode, Range[]]> = [
    [
      "should return no errors for valid empty object",
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [],
        astRBracket(getInlineRange(0, 1, 2)),
        { type: "object" }
      ),
      [],
    ],
    [
      "should return error for string",
      astUnquotedString("content", getInlineRange(0, 0, 7), { type: "object" }),
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
