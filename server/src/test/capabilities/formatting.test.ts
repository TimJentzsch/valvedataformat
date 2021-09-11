import { FormattingOptions, TextEdit } from "vscode-languageserver/node";
import formatNode from "../../capabilities/formatting";
import { rootParser } from "../../parser/parser";
import { applyParser } from "../../parser/utils";
import { applyEdits } from "../utils";

// String property
describe("formatStringProperty", () => {
  describe("should not edit correct formatting", () => {
    const params: Array<[string, FormattingOptions?]> = [["key\tvalue"]];

    const defaultOptions: FormattingOptions = {
      insertSpaces: false,
      tabSize: 4,
    };

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
// To stay independant from performance improvements, we apply the returned text edits to the input string
// This is testing correctness instead of performance
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

  const defaultOptions: FormattingOptions = {
    insertSpaces: false,
    tabSize: 4,
  };

  for (const [input, expected, options] of params) {
    test(input, async () => {
      const rootNode = applyParser(rootParser, input);
      const edits = await formatNode(rootNode, options ?? defaultOptions);
      const actual = applyEdits(input, edits);
      expect(actual).toEqual(expected);
    });
  }
});
