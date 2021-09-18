import AstNode from "../../ast/node";
import { astUnquotedString } from "../../ast/string";
import { getInlineRange } from "../../parser/utils";
import { VdfSchema } from "../../schema/schema";
import annotateSchema from "../../schema/schemaAnnotation";

describe("annotateSchema", () => {
  // Test name, schema, input node, expected output node
  const params: Array<[string, VdfSchema | undefined, AstNode, AstNode]> = [
    [
      "should annotate string with undefined schema",
      undefined,
      astUnquotedString("content", getInlineRange(0, 0, 7)),
      astUnquotedString("content", getInlineRange(0, 0, 7)),
    ],
    [
      "should annotate string with boolean schema",
      true,
      astUnquotedString("content", getInlineRange(0, 0, 7)),
      astUnquotedString("content", getInlineRange(0, 0, 7), true),
    ],
    [
      "should annotate string with empty schema",
      { type: undefined },
      astUnquotedString("content", getInlineRange(0, 0, 7)),
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: undefined,
      }),
    ],
    [
      "should annotate string with string schema",
      { type: "string" },
      astUnquotedString("content", getInlineRange(0, 0, 7)),
      astUnquotedString("content", getInlineRange(0, 0, 7), {
        type: "string",
      }),
    ],
  ];

  for (const [name, schema, node, expected] of params) {
    test(name, () => {
      const actual = annotateSchema(node, schema);
      expect(actual).toEqual(expected);
    });
  }
});
