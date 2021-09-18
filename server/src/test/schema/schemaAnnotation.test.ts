import { astLBracket, astRBracket } from "../../ast/bracket";
import { astQuotedKey } from "../../ast/key";
import AstNode from "../../ast/node";
import { astObject } from "../../ast/object";
import { astStringProperty } from "../../ast/property";
import { astQuotedString, astUnquotedString } from "../../ast/string";
import { getInlineRange } from "../../parser/utils";
import { VdfSchema } from "../../schema/schema";
import annotateSchema from "../../schema/schemaAnnotation";

describe("annotateSchema", () => {
  // Test name, schema, input node, expected output node
  const params: Array<[string, VdfSchema | undefined, AstNode, AstNode]> = [
    // String
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
    // Object
    [
      "should annotate object with undefined schema",
      undefined,
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astQuotedKey("key", getInlineRange(0, 1, 6)),
            [],
            astQuotedString("value", getInlineRange(0, 6, 13))
          ),
        ],
        astRBracket(getInlineRange(0, 13, 14))
      ),
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astQuotedKey("key", getInlineRange(0, 1, 6)),
            [],
            astQuotedString("value", getInlineRange(0, 6, 13))
          ),
        ],
        astRBracket(getInlineRange(0, 13, 14))
      ),
    ],
    [
      "should annotate object with boolean schema",
      true,
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astQuotedKey("key", getInlineRange(0, 1, 6)),
            [],
            astQuotedString("value", getInlineRange(0, 6, 13))
          ),
        ],
        astRBracket(getInlineRange(0, 13, 14))
      ),
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astQuotedKey("key", getInlineRange(0, 1, 6)),
            [],
            astQuotedString("value", getInlineRange(0, 6, 13))
          ),
        ],
        astRBracket(getInlineRange(0, 13, 14)),
        true
      ),
    ],
    [
      "should annotate object with empty schema",
      { type: undefined },
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astQuotedKey("key", getInlineRange(0, 1, 6)),
            [],
            astQuotedString("value", getInlineRange(0, 6, 13))
          ),
        ],
        astRBracket(getInlineRange(0, 13, 14))
      ),
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astQuotedKey("key", getInlineRange(0, 1, 6)),
            [],
            astQuotedString("value", getInlineRange(0, 6, 13))
          ),
        ],
        astRBracket(getInlineRange(0, 13, 14)),
        { type: undefined }
      ),
    ],
    [
      "should annotate object with object schema",
      {
        type: "object",
        properties: {
          key: { type: "string" },
        },
      },
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astQuotedKey("key", getInlineRange(0, 1, 6)),
            [],
            astQuotedString("value", getInlineRange(0, 6, 13))
          ),
        ],
        astRBracket(getInlineRange(0, 13, 14))
      ),
      astObject(
        astLBracket(getInlineRange(0, 0, 1)),
        [
          astStringProperty(
            astQuotedKey("key", getInlineRange(0, 1, 6)),
            [],
            astQuotedString("value", getInlineRange(0, 6, 13), true, {
              type: "string",
            })
          ),
        ],
        astRBracket(getInlineRange(0, 13, 14)),
        {
          type: "object",
          properties: {
            key: { type: "string" },
          },
        }
      ),
    ],
  ];

  for (const [name, schema, node, expected] of params) {
    test(name, () => {
      const actual = annotateSchema(node, schema);
      expect(actual).toEqual(expected);
    });
  }
});
