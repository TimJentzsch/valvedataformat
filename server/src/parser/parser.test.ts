import { TokenPosition } from "typescript-parsec";
import { Range } from "vscode-languageserver/node";
import AstComment from "../ast/comment";
import AstString from "../ast/string";
import { applyParser, commentParser, stringParser, tokenPositionToDocumentRange } from "./parser";

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
