import { getInlineRange } from "../../parser/utils";
import AstBracket, { astBracket, astLBracket, astRBracket, BracketType } from "../../ast/bracket";
import { NodeType } from "../../ast/baseNode";

describe('astBracket', () => {
  test('should properly create left bracket node', () => {
    const actual = astBracket(BracketType.left, getInlineRange(0, 0, 1));
    const expected: AstBracket = {
      type: NodeType.bracket,
      children: [],
      bracketType: BracketType.left,
      range: getInlineRange(0, 0, 1),
    };

    expect(actual).toEqual(expected);
  });

  test('should properly create right bracket node', () => {
    const actual = astBracket(BracketType.right, getInlineRange(0, 0, 1));
    const expected: AstBracket = {
      type: NodeType.bracket,
      children: [],
      bracketType: BracketType.right,
      range: getInlineRange(0, 0, 1),
    };

    expect(actual).toEqual(expected);
  });
});

describe('astLBracket', () => {
  test('should properly create left bracket node', () => {
    const actual = astLBracket(getInlineRange(0, 0, 1));
    const expected: AstBracket = {
      type: NodeType.bracket,
      children: [],
      bracketType: BracketType.left,
      range: getInlineRange(0, 0, 1),
    };

    expect(actual).toEqual(expected);
  });
});

describe('astRBracket', () => {
  test('should properly create right bracket node', () => {
    const actual = astRBracket(getInlineRange(0, 0, 1));
    const expected: AstBracket = {
      type: NodeType.bracket,
      children: [],
      bracketType: BracketType.right,
      range: getInlineRange(0, 0, 1),
    };

    expect(actual).toEqual(expected);
  });
});
