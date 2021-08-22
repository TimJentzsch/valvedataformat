import AstComment, { astComment } from "../ast/comment";
import commentParser from "./comment";
import { applyParser, getInlineRange } from "./utils";

// Comment parsing
describe("should parse comment", () => {
  const params: Array<[string, AstComment]> = [
    [
      "// Comment",
      astComment(" Comment", getInlineRange(0, 0, 10)),
    ],
    [
      '// Comment with "key" "value"',
      astComment(' Comment with "key" "value"', getInlineRange(0, 0, 29)),
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(commentParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
