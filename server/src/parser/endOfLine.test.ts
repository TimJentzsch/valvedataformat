import AstEndOfLine from "../ast/endOfLine";
import endOfLineParser from "./endOfLine";
import { applyParser, getRange } from "./utils";

// End of line parsing
describe("should parse end of line", () => {
  const params: Array<[string, AstEndOfLine]> = [
    [
      "\n",
      {
        type: "endOfLine",
        children: [],
        value: "\n",
        isLf: true,
        isCrLf: false,
        range: getRange(0, 0, 1, 0),
      },
    ],
    [
      "\r\n",
      {
        type: "endOfLine",
        children: [],
        value: "\r\n",
        isLf: false,
        isCrLf: true,
        range: getRange(0, 0, 1, 0),
      },
    ],
  ];

  for (const [input, expected] of params) {
    test(input, () => {
      const actual = applyParser(endOfLineParser, input);
      expect(actual).toEqual(expected);
    });
  }
});
