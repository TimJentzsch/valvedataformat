import { FormattingOptions } from "vscode-languageserver/node";
import { getNeededIndentlength } from "../../capabilities/utils";

// getNeededIndentLength
describe("getNeededIndentLength", () => {
  const tabOptions: FormattingOptions = {
    insertSpaces: false,
    tabSize: 4,
  };
  const spaceOptions: FormattingOptions = {
    insertSpaces: true,
    tabSize: 4,
  };

  const params: Array<[string, [FormattingOptions, number, number], number]> = [
    ["should return single tab for length 4", [tabOptions, 0, 4], 4],
    ["should return single tab for length 3", [tabOptions, 0, 3], 4],
    ["should return single tab for length 1", [tabOptions, 0, 1], 4],
    ["should return no tabs for length 0", [tabOptions, 0, 0], 0],
    ["should return 4 spaces for length 4", [spaceOptions, 0, 4], 4],
    ["should return 4 spaces for length 3", [spaceOptions, 0, 3], 4],
    ["should return 4 spaces for length 1", [spaceOptions, 0, 1], 4],
    ["should return no spaces for length 0", [spaceOptions, 0, 0], 0],
    ["should return single tab for column 1 length 3", [tabOptions, 1, 3], 3],
    ["should return single tab for column 1 length 0", [tabOptions, 1, 0], 3],
    ["should return two tabs for column 1 length 4", [tabOptions, 1, 4], 7],
    ["should return 3 spaces for column 1 length 3", [spaceOptions, 1, 3], 3],
    ["should return 3 spaces for column 1 length 0", [spaceOptions, 1, 0], 3],
    ["should return 7 spaces for column 1 length 4", [spaceOptions, 1, 4], 7],
    [
      "should return 23 spaces for column 5 length 20",
      [spaceOptions, 5, 20],
      23,
    ],
  ];

  for (const [name, [options, startColumn, length], expected] of params) {
    test(name, () => {
      const actual = getNeededIndentlength(options, startColumn, length);
      expect(actual).toEqual(expected);
    });
  }
});