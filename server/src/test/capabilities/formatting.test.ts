import { FormattingOptions, TextEdit } from "vscode-languageserver/node";
import formatNode from "../../capabilities/formatting";
import { rootParser } from "../../parser/parser";
import { applyParser, getInlineRange } from "../../parser/utils";
import { applyEdits } from "../utils";

const defaultOptions: FormattingOptions = {
  insertSpaces: false,
  tabSize: 4,
};

const spaceOptions: FormattingOptions = {
  insertSpaces: true,
  tabSize: 4,
};

// formatNode
// Make sure the correct (performant) edits are returned
// We want as little edits as possible
describe("formatNode", () => {
  describe("should not edit correct formatting", () => {
    const params: Array<[string, FormattingOptions?]> = [
      ["key\tvalue"],
      ['"key"\t"value"'],
      ["key value", spaceOptions],
      ['"key"   "value"', spaceOptions],
      ["key\n{\n\tasdefgh\tvalue\n\tasd\t\tvalue\n}"],
      ['"key"\n{\n\t"asdefgh"\t"value"\n\t"asd"\t\t"value"\n}'],
      ["key\n{\n    asdefgh value\n    asd     value\n}", spaceOptions],
      [
        '"key"\n{\n    "asdefgh"   "value"\n    "asd"       "value"\n}',
        spaceOptions,
      ],
    ];

    for (const [input, options] of params) {
      test(input, async () => {
        const rootNode = applyParser(rootParser, input);
        const actual = await formatNode(rootNode, options ?? defaultOptions);
        expect(actual).toEqual([]);
      });
    }
  });

  describe("format incorrect text", () => {
    // Test name, input, expected edits, options
    const params: Array<[string, string, TextEdit[], FormattingOptions?]> = [
      [
        "should add missing value tab indent",
        '"key"\n{\n\t"asd"\t"value"\n\t"asdefgh"\t"value"\n}\n',
        [
          {
            newText: "\t",
            range: getInlineRange(2, 7),
          },
        ],
      ],
      [
        "should add missing value space indent",
        '"key"\n{\n    "asd" "value"\n    "asdefgh" "value"\n}\n',
        [
          {
            newText: "      ",
            range: getInlineRange(2, 10),
          },
          {
            newText: "  ",
            range: getInlineRange(3, 14),
          },
        ],
        spaceOptions,
      ],
      [
        "should delete extra value tab indent",
        '"key"\n{\n\t"asd"\t\t\t\t\t"value"\n\t"asdefgh"\t\t\t"value"\n}\n',
        [
          {
            newText: "",
            range: getInlineRange(2, 8, 11),
          },
          {
            newText: "",
            range: getInlineRange(3, 11, 13),
          },
        ],
      ],
      [
        "should delete extra value space indent",
        '"key"\n{\n    "asd"         "value"\n    "asdefgh"      "value"\n}\n',
        [
          {
            newText: "",
            range: getInlineRange(2, 16, 18),
          },
          {
            newText: "",
            range: getInlineRange(3, 16, 19),
          },
        ],
        spaceOptions,
      ],
    ];

    for (const [name, input, expected, options] of params) {
      test(name, async () => {
        const rootNode = applyParser(rootParser, input);
        const actual = await formatNode(rootNode, options ?? defaultOptions);
        expect(actual).toEqual(expected);
      });
    }
  });
});

// Formatting
// This is testing correctness instead of performance
// We only care about the resulting string, not about the actual edits
describe("formatting", () => {
  // The input string, the formatted output string and options to override the defaults
  const params: Array<[string, string, FormattingOptions?]> = [
    ["key\tvalue", "key\tvalue"],
    ['"key"\t"value"', '"key"\t"value"'],
    ['"key" "value"', '"key"\t"value"'],
    [
      '"key and a lot of stuff"\t"value"\n"key"\t"value"',
      '"key and a lot of stuff"\t"value"\n"key"\t\t\t\t\t\t"value"',
    ],
    ['"key"\t{}', '"key"\t{}'],
    ['"key"\n{\n\t"key"\t"value"\n}', '"key"\n{\n\t"key"\t"value"\n}'],
    ['"key"\n{\n\t"key"\t\t\t"value"\n}', '"key"\n{\n\t"key"\t"value"\n}'],
  ];

  for (const [input, expected, options] of params) {
    test(input, async () => {
      const rootNode = applyParser(rootParser, input);
      const edits = await formatNode(rootNode, options ?? defaultOptions);
      const actual = applyEdits(input, edits);
      expect(actual).toEqual(expected);
    });
  }
});
