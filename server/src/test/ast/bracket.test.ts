import { getInlineRange } from "../../parser/utils";
import AstBracket, { astBracket, astLBracket, astRBracket } from "../../ast/bracket";

describe('astBracket', () => {
  test('should properly create left bracket node', () => {
    const actual = astBracket("{", "left", getInlineRange(0, 0, 1));
    const expected: AstBracket = {
      type: "bracket",
      children: [],
      value: "{",
      bracketType: "left",
      range: getInlineRange(0, 0, 1),
    };

    expect(actual).toEqual(expected);
  });

  test('should properly create right bracket node', () => {
    const actual = astBracket("}", "right", getInlineRange(0, 0, 1));
    const expected: AstBracket = {
      type: "bracket",
      children: [],
      value: "}",
      bracketType: "right",
      range: getInlineRange(0, 0, 1),
    };

    expect(actual).toEqual(expected);
  });
});

describe('astLBracket', () => {
  test('should properly create left bracket node', () => {
    const actual = astLBracket(getInlineRange(0, 0, 1));
    const expected: AstBracket = {
      type: "bracket",
      children: [],
      value: "{",
      bracketType: "left",
      range: getInlineRange(0, 0, 1),
    };

    expect(actual).toEqual(expected);
  });
});

describe('astRBracket', () => {
  test('should properly create right bracket node', () => {
    const actual = astRBracket(getInlineRange(0, 0, 1));
    const expected: AstBracket = {
      type: "bracket",
      children: [],
      value: "}",
      bracketType: "right",
      range: getInlineRange(0, 0, 1),
    };

    expect(actual).toEqual(expected);
  });
});
