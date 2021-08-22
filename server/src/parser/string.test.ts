import AstString from "../ast/string";
import stringParser from "./string";
import { applyParser } from "./utils";

// String parsing
describe("should parse string", () => {
  const params: Array<[string, AstString]> = [
    [
      "value",
      {
        type: "string",
        children: [],
        isQuoted: false,
        isTerminated: true,
        value: "value",
        range: {
          start: {
            line: 0,
            character: 0,
          },
          end: {
            line: 0,
            character: 5,
          },
        },
      },
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(stringParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
