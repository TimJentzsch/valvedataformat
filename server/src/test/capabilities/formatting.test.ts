import { FormattingOptions } from "vscode-languageserver/node";
import formatNode from "../../capabilities/formatting";
import { rootParser } from "../../parser/parser";
import { applyParser } from "../../parser/utils";
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
