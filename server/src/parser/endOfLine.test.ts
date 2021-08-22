import AstEndOfLine from "../ast/endOfLine";
import endOfLineParser from "./endOfLine";
import { applyParser, getInlineRange } from "./utils";

// End of line parsing
describe("should parse end of lline", () => {
  const params: Array<[string, AstEndOfLine]> = [
    [
      "\n",
      {
        type: "endOfLine",
        children: [],
        value: "\n",
        isLf: true,
        isCrLf: false,
        range: getInlineRange(0, 0, 1),
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
        range: getInlineRange(0, 0, 2),
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
