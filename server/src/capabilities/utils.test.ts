import { FormattingOptions } from "vscode-languageserver/node";
import { getIndent, repeatStr } from "./utils";

// repeatStr
describe("repeatStr", () => {
  test("should repeat single space", () => {
    const actual = repeatStr(" ", 4);
    const expected = "    ";
    expect(actual).toEqual(expected);
  });

  test("should repeat single tab", () => {
    const actual = repeatStr("\t", 4);
    const expected = "\t\t\t\t";
    expect(actual).toEqual(expected);
  });

  test("should repeat multiple spaces", () => {
    const actual = repeatStr("    ", 2);
    const expected = "        ";
    expect(actual).toEqual(expected);
  });
});

// getIndent
describe("getIndent", () => {
  const tabOptions: FormattingOptions = {
    insertSpaces: false,
    tabSize: 4,
  };
  const spaceOptions: FormattingOptions = {
    insertSpaces: true,
    tabSize: 4,
  };

  const params: Array<[string, [FormattingOptions, number, number], string]> = [
    ["should return single tab for length 4", [tabOptions, 0, 4], "\t"],
    ["should return single tab for length 3", [tabOptions, 0, 3], "\t"],
    ["should return single tab for length 1", [tabOptions, 0, 1], "\t"],
    ["should return no tabs for length 0", [tabOptions, 0, 0], ""],
    ["should return 4 spaces for length 4", [spaceOptions, 0, 4], "    "],
    ["should return 4 spaces for length 3", [spaceOptions, 0, 3], "    "],
    ["should return 4 spaces for length 1", [spaceOptions, 0, 1], "    "],
    ["should return no spaces for length 0", [spaceOptions, 0, 0], ""],
    [
      "should return single tab for column 1 length 3",
      [tabOptions, 1, 3],
      "\t",
    ],
    [
      "should return single tab for column 1 length 0",
      [tabOptions, 1, 0],
      "\t",
    ],
    [
      "should return two tabs for column 1 length 4",
      [tabOptions, 1, 4],
      "\t\t",
    ],
    [
      "should return 3 spaces for column 1 length 3",
      [spaceOptions, 1, 3],
      "   ",
    ],
    [
      "should return 3 spaces for column 1 length 0",
      [spaceOptions, 1, 0],
      "   ",
    ],
    [
      "should return 7 spaces for column 1 length 4",
      [spaceOptions, 1, 4],
      "       ",
    ],
    [
      "should return 23 spaces for column 5 length 20",
      [spaceOptions, 5, 20],
      "                       ",
    ],
  ];

  for (const [name, [options, startColumn, length], expected] of params) {
    test(name, () => {
      const actual = getIndent(options, startColumn, length);
      expect(actual).toEqual(expected);
    });
  }
});
