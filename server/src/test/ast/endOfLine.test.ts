import { getRange } from "../../parser/utils";
import AstEndOfLine, { astCrLf, astEndOfLine, astLf, EolType } from "../../ast/endOfLine";
import { NodeType } from "../../ast/baseNode";

describe("astEndOfLine", () => {
  test("should properly create LF node", () => {
    const actual = astEndOfLine(EolType.lf, getRange(0, 0, 1, 0));
    const expected: AstEndOfLine = {
      type: NodeType.endOfLine,
      children: [],
      eolType: EolType.lf,
      range: getRange(0, 0, 1, 0),
    };

    expect(actual).toEqual(expected);
  });

  test("should properly create CRLF node", () => {
    const actual = astEndOfLine(EolType.crlf, getRange(0, 0, 1, 0));
    const expected: AstEndOfLine = {
      type: NodeType.endOfLine,
      children: [],
      eolType: EolType.crlf,
      range: getRange(0, 0, 1, 0),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astLf", () => {
  test("should properly create LF node", () => {
    const actual = astLf(getRange(0, 0, 1, 0));
    const expected: AstEndOfLine = {
      type: NodeType.endOfLine,
      children: [],
      eolType: EolType.lf,
      range: getRange(0, 0, 1, 0),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astCrLf", () => {
  test("should properly create CRLF node", () => {
    const actual = astCrLf(getRange(0, 0, 1, 0));
    const expected: AstEndOfLine = {
      type: NodeType.endOfLine,
      children: [],
      eolType: EolType.crlf,
      range: getRange(0, 0, 1, 0),
    };

    expect(actual).toEqual(expected);
  });
});
