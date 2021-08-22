import AstComment from "../ast/comment";
import commentParser from "./comment";
import { applyParser, getInlineRange } from "./utils";

// Comment parsing
describe("should parse comment", () => {
  const params: Array<[string, AstComment]> = [
    [
      "// Comment",
      {
        type: "comment",
        children: [],
        value: " Comment",
        range: getInlineRange(0, 0, 10),
      },
    ],
    [
      '// Comment with "key" "value"',
      {
        type: "comment",
        children: [],
        value: ' Comment with "key" "value"',
        range: getInlineRange(0, 0, 29),
      },
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(commentParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
