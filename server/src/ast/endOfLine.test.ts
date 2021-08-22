import { getInlineRange, getRange } from "../parser/utils";
import AstEndOfLine, { astCrLf, astEndOfLine, astLf } from "./endOfLine";

describe('astEndOfLine', () => {
  test('should properly create LF node', () => {
    const actual = astEndOfLine("\n", true, getRange(0, 0, 1, 0));
    const expected: AstEndOfLine = {
      type: "endOfLine",
      children: [],
      value: "\n",
      isLf: true,
      range: getRange(0, 0, 1, 0),
    };

    expect(actual).toEqual(expected);
  });

  test('should properly create CRLF node', () => {
    const actual = astEndOfLine("\r\n", false, getRange(0, 0, 1, 0));
    const expected: AstEndOfLine = {
      type: "endOfLine",
      children: [],
      value: "\r\n",
      isLf: false,
      range: getRange(0, 0, 1, 0),
    };

    expect(actual).toEqual(expected);
  });
});

describe('astLf', () => {
  test('should properly create LF node', () => {
    const actual = astLf(getRange(0, 0, 1, 0));
    const expected: AstEndOfLine = {
      type: "endOfLine",
      children: [],
      value: "\n",
      isLf: true,
      range: getRange(0, 0, 1, 0),
    };

    expect(actual).toEqual(expected);
  });
});

describe('astCrLf', () => {
  test('should properly create CRLF node', () => {
    const actual = astCrLf(getRange(0, 0, 1, 0));
    const expected: AstEndOfLine = {
      type: "endOfLine",
      children: [],
      value: "\r\n",
      isLf: false,
      range: getRange(0, 0, 1, 0),
    };

    expect(actual).toEqual(expected);
  });
});
