import { Position, TextEdit } from "vscode-languageserver/node";
import { getInlineRange } from "../parser/utils";
import { applyEdits, getOffsetFromPosition } from "./utils";

describe("getOffsetFromPosition", () => {
  const params: Array<[string, Position, number]> = [
    ["Test", { line: 0, character: 0 }, 0],
    ["Test", { line: 0, character: 3 }, 3],
    ["Test\nWith lines", { line: 1, character: 3 }, 8],
  ];

  for (const [content, pos, expected] of params) {
    test(`${content} [${pos.line}/${pos.character}]`, () => {
      const actual = getOffsetFromPosition(content, pos);
      expect(actual).toEqual(expected);
    });
  }
});

describe("applyEdits", () => {
  // Test name, input, edits to apply, expected output
  const params: Array<[string, string, TextEdit[], string]> = [
    [
      "should not change anything after empty edit",
      "Test",
      [
        {
          newText: "",
          range: getInlineRange(0, 1, 1),
        },
      ],
      "Test",
    ],
    [
      "should insert new text at cursor",
      "Test",
      [
        {
          newText: "1234",
          range: getInlineRange(0, 1, 1),
        },
      ],
      "T1234est",
    ],
    [
      "should delete text in range",
      "Test text",
      [
        {
          newText: "",
          range: getInlineRange(0, 1, 7),
        },
      ],
      "Txt",
    ],
    [
      "should replace text in range",
      "Test text",
      [
        {
          newText: "123",
          range: getInlineRange(0, 1, 7),
        },
      ],
      "T123xt",
    ],
    [
      "should handle insert and insert",
      "Test text",
      [
        {
          newText: "123",
          range: getInlineRange(0, 1, 1),
        },
        {
          newText: "456",
          range: getInlineRange(0, 6, 6),
        },
      ],
      "T123est t456ext",
    ],
    [
      "should handle delete and delete",
      "Test text",
      [
        {
          newText: "",
          range: getInlineRange(0, 1, 3),
        },
        {
          newText: "",
          range: getInlineRange(0, 6, 8),
        },
      ],
      "Tt tt",
    ],
    [
      "should handle insert and delete",
      "Test text",
      [
        {
          newText: "123",
          range: getInlineRange(0, 1, 1),
        },
        {
          newText: "",
          range: getInlineRange(0, 6, 8),
        },
      ],
      "T123est tt",
    ],
  ];

  for (const [name, content, edits, expected] of params) {
    test(name, () => {
      const actual = applyEdits(content, edits);
      expect(actual).toEqual(expected);
    });
  }
});
