import { getInlineRange } from "../parser/utils";
import { astComment } from "./comment";
import { astIndent } from "./indent";
import { astUnquotedKey } from "./key";
import AstProperty, { astProperty, astStringProperty } from "./property";
import { astQuotedString } from "./string";

describe("astProperty", () => {
  test("should properly create property", () => {
    const key = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const indent = astIndent(" ", getInlineRange(0, 3, 4));
    const value = astQuotedString("value", getInlineRange(0, 4, 11));

    const actual = astProperty([key, indent, value], key, value);
    const expected: AstProperty = {
      type: "property",
      key,
      value,
      children: [key, indent, value],
      range: getInlineRange(0, 0, 11),
    };

    expect(actual).toEqual(expected);
  });
});

describe("astStringProperty", () => {
  test("should create string property without trivia", () => {
    const key = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const value = astQuotedString("value", getInlineRange(0, 3, 10));

    const actual = astStringProperty(key, value);
    const expected: AstProperty = {
      type: "property",
      key,
      value,
      children: [key, value],
      range: getInlineRange(0, 0, 10),
    };

    expect(actual).toEqual(expected);
  });

  test("should create string property with between trivia", () => {
    const key = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const betweenTrivia = astIndent(" ", getInlineRange(0, 3, 4));
    const value = astQuotedString("value", getInlineRange(0, 4, 11));

    const actual = astStringProperty(key, value, [betweenTrivia]);
    const expected: AstProperty = {
      type: "property",
      key,
      value,
      children: [key, betweenTrivia, value],
      range: getInlineRange(0, 0, 11),
    };

    expect(actual).toEqual(expected);
  });

  test("should create string property with post trivia", () => {
    const key = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const value = astQuotedString("value", getInlineRange(0, 3, 10));
    const postTrivia = astComment(" Comment", getInlineRange(0, 10, 20));

    const actual = astStringProperty(key, value, undefined, [postTrivia]);
    const expected: AstProperty = {
      type: "property",
      key,
      value,
      children: [key, value, postTrivia],
      range: getInlineRange(0, 0, 20),
    };

    expect(actual).toEqual(expected);
  });

  test("should create string property with between and post trivia", () => {
    const key = astUnquotedKey("key", getInlineRange(0, 0, 3));
    const betweenTrivia = astIndent(" ", getInlineRange(0, 3, 4));
    const value = astQuotedString("value", getInlineRange(0, 4, 11));
    const postTrivia = astComment(" Comment", getInlineRange(0, 11, 21));

    const actual = astStringProperty(key, value, [betweenTrivia], [postTrivia]);
    const expected: AstProperty = {
      type: "property",
      key,
      value,
      children: [key, betweenTrivia, value, postTrivia],
      range: getInlineRange(0, 0, 21),
    };

    expect(actual).toEqual(expected);
  });
});
