import { TokenPosition } from "typescript-parsec";
import { Range } from "vscode-languageserver/node";
import { astLf } from "../ast/endOfLine";
import { astIndent } from "../ast/indent";
import AstNode from "../ast/node";
import { astQuotedString, astString, astUnquotedString } from "../ast/string";
import { getInlineRange, getRange, getRangeFromNodeList, getRangeFromTokenPosition } from "./utils";

describe("getRange", () => {
  const params: Array<[[number, number, number, number], Range]> = [
    [
      [0, 0, 0, 0],
      {
        start: {
          line: 0,
          character: 0,
        },
        end: {
          line: 0,
          character: 0,
        }
      },
    ],
    [
      [2, 5, 2, 8],
      {
        start: {
          line: 2,
          character: 5,
        },
        end: {
          line: 2,
          character: 8,
        }
      }
    ],
    [
      [3, 7, 5, 1],
      {
        start: {
          line: 3,
          character: 7,
        },
        end: {
          line: 5,
          character: 1,
        }
      }
    ]
  ];

  for (const [[startLine, startCharacter, endLine, endCharacter], expected] of params) {
    test(`should convert (${startLine}, ${startCharacter}, ${endLine}, ${endCharacter})`, () => {
      const actual = getRange(startLine, startCharacter, endLine, endCharacter);
      expect(actual).toEqual(expected);
    });
  }
});

// Conversion from inline range to range
describe('getInlineRange', () => {
  const params: Array<[[number, number, number?], Range]> = [
    [
      [0, 0, 0],
      getRange(0, 0, 0, 0),
    ],
    [
      [0, 0, undefined],
      getRange(0, 0, 0, 0),
    ],
    [
      [2, 3, 3],
      getRange(2, 3, 2, 3),
    ],
    [
      [2, 3, undefined],
      getRange(2, 3, 2, 3),
    ],
    [
      [4, 2, 7],
      getRange(4, 2, 4, 7),
    ],
  ];

  for (const [[line, startCharacter, endCharacter], expected] of params) {
    test(`should convert (${line}, ${startCharacter}, ${endCharacter})`, () => {
      const actual = getInlineRange(line, startCharacter, endCharacter);
      expect(actual).toEqual(expected);
    });
  }
});

// Conversion from token position to document range
describe("getRangeFromTokenPosition", () => {
  const params: Array<[TokenPosition, Range]> = [
    [
      {
        rowBegin: 1,
        columnBegin: 1,
        rowEnd: 1,
        columnEnd: 1,
        index: 0,
      },
      getInlineRange(0, 0),
    ],
  ];

  for (const [input, expected] of params) {
    test(`should convert ${JSON.stringify(input, null, 0)}`, () => {
      const actual = getRangeFromTokenPosition(input);
      expect(actual).toEqual(expected);
    });
  }
});

// Conversion from node list to document range
describe("getRangeFromNodeList", () => {
  const params: Array<[AstNode[], Range]> = [
    [
      [
        astUnquotedString("key", getInlineRange(0, 0, 3)),
        astIndent("    ", getInlineRange(0, 3, 7)),
        astUnquotedString("value", getInlineRange(0, 7, 13)),
      ],
      getInlineRange(0, 0, 13),
    ],
    [
      [
        astUnquotedString("key", getInlineRange(0, 0, 3)),
        astLf(getRange(0, 3, 1, 0)),
        astUnquotedString("value", getInlineRange(1, 0, 5)),
      ],
      getRange(0, 0, 1, 5),
    ],
  ];

  for (const [input, expected] of params) {
    test(`should convert ${JSON.stringify(input, null, 0)}`, () => {
      const actual = getRangeFromNodeList(input);
      expect(actual).toEqual(expected);
    });
  }
});
