import { Range } from "vscode-languageserver/node";
import AstNode from "../../ast/node";
import { astQuotedString, astUnquotedString } from "../../ast/string";
import { getInlineRange } from "../../parser/utils";
import validateNodeSchema from "../../schema/schemaValidation";

describe("validateGeneralSchemas", () => {
  // The name of the test, the node to validate, the expected diagnostic ranges
  const params: Array<[string, AstNode, Range[]]> = [
    [
      "should return no errors for null string",
      astQuotedString("", getInlineRange(0, 0, 2), true, { type: "null" }),
      [],
    ],
    [
      "should return error for boolean string",
      astUnquotedString("0", getInlineRange(0, 0, 1), { type: "null" }),
      [getInlineRange(0, 0, 1)],
    ],
    [
      "should return error for content string",
      astUnquotedString("content", getInlineRange(0, 0, 7), { type: "null" }),
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
