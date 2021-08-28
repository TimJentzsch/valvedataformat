import { repeatStr } from "../../utils/stringUtils";

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
