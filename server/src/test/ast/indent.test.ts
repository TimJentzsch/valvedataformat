import { getInlineRange } from "../../parser/utils";
import AstIndent, { astIndent, astSpaces, astTabs, IndentType } from "../../ast/indent";
import { NodeType } from "../../ast/baseNode";

describe("astIndent", () => {
  test("should properly create indent spaces node", () => {
    const actual = astIndent(IndentType.spaces, 4, getInlineRange(0, 0, 4));
    const expected: AstIndent = {
      type: NodeType.indent,
      children: [],
      indentType: IndentType.spaces,
      count: 4,
      range: getInlineRange(0, 0, 4),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly create indent tabs node", () => {
    const actual = astIndent(IndentType.tabs, 4, getInlineRange(0, 0, 4));
    const expected: AstIndent = {
      type: NodeType.indent,
      children: [],
      indentType: IndentType.tabs,
      count: 4,
      range: getInlineRange(0, 0, 4),
    };

    expect(actual).toEqual(expected);
  });
});

describe('astSpaces', () => {
  test("should properly create indent spaces node", () => {
    const actual = astSpaces(4, getInlineRange(0, 0, 4));
    const expected: AstIndent = {
      type: NodeType.indent,
      children: [],
      indentType: IndentType.spaces,
      count: 4,
      range: getInlineRange(0, 0, 4),
    };

    expect(actual).toEqual(expected);
  });
});

describe('astTabs', () => {
  test("should properly create indent tabs node", () => {
    const actual = astTabs(4, getInlineRange(0, 0, 4));
    const expected: AstIndent = {
      type: NodeType.indent,
      children: [],
      indentType: IndentType.tabs,
      count: 4,
      range: getInlineRange(0, 0, 4),
    };

    expect(actual).toEqual(expected);
  });
});
