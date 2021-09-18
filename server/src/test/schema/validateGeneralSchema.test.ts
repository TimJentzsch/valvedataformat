import { Range } from "vscode-languageserver/node";
import AstNode from "../../ast/node";
import { astUnquotedString } from "../../ast/string";
import { getInlineRange } from "../../parser/utils";
import { VdfEmptySchema } from "../../schema/schema";
import validateNodeSchema from "../../schema/schemaValidation";

describe("validateGeneralSchemas", () => {
  // The name of the test, the node to validate, the expected diagnostic ranges
  const params: Array<[string, AstNode, Range[]]> = [
    [
      "should return no errors for undefined schema",
      astUnquotedString("content", getInlineRange(0, 0, 7)),
      [],
    ],
    [
      "should return no errors for empty schema",
      astUnquotedString(
        "content",
        getInlineRange(0, 0, 7),
        {} as VdfEmptySchema
      ),
      [],
    ],
    [
      "should return no errors for true schema",
      astUnquotedString("content", getInlineRange(0, 0, 7), true),
      [],
    ],
    [
      "should return error for false schema",
      astUnquotedString("content", getInlineRange(0, 0, 7), false),
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
