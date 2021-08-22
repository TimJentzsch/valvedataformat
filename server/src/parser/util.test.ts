import { TokenPosition } from "typescript-parsec";
import { Range } from "vscode-languageserver/node";
import { tokenPositionToDocumentRange } from "./utils";

// Conversion from token position to document range
describe("should convert token position to document range", () => {
  const params: Array<[TokenPosition, Range]> = [
    [
      {
        rowBegin: 1,
        columnBegin: 1,
        rowEnd: 1,
        columnEnd: 1,
        index: 0,
      },
      {
        start: {
          line: 0,
          character: 0,
        },
        end: {
          line: 0,
          character: 0,
        },
      },
    ],
  ];

  for (const [input, expected] of params) {
    const actual = tokenPositionToDocumentRange(input);
    expect(actual).toEqual(expected);
  }
});
