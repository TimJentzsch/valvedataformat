import AstComment from "../ast/comment";
import commentParser from "./comment";
import { applyParser } from "./utils";

// Comment parsing
describe("should parse comment", () => {
  const params: Array<[string, AstComment]> = [
    [
      "// Comment",
      {
        type: "comment",
        children: [],
        value: " Comment",
        range: {
          start: {
            line: 0,
            character: 0,
          },
          end: {
            line: 0,
            character: 10,
          },
        },
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
