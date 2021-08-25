import { FormattingOptions } from "vscode-languageserver/node";
import AstKey from "../ast/key";
import AstObject from "../ast/object";
import AstRoot from "../ast/root";
import AstString from "../ast/string";

/** Get the length of a string-like node (i.e. a key or a string). */
export function getStringLikeLength(str?: AstKey | AstString): number {
  if (str === undefined) {
    return 0;
  }

  const contentLength = str.value.length;

  // Account for the quotation marks
  return str.isQuoted
    ? str.isTerminated
      ? contentLength + 2
      : contentLength + 1
    : contentLength;
}

/** Get the maximal length of the keys of the object. */
export function getMaxKeyLength(obj: AstObject | AstRoot): number {
  return Math.max(
    0,
    ...obj.properties.map((property) => {
      return getStringLikeLength(property.key);
    })
  );
}

/** Get the maximal length of the keys of the object. */
export function getMaxValueLength(obj: AstObject | AstRoot): number {
  return Math.max(
    0,
    ...obj.properties.map((property) => {
      if (property.valueType === "object") {
        return 0;
      }

      return getStringLikeLength(property.value);
    })
  );
}

/** Repeat the string the given amount of times. */
export function repeatStr(str: string, count: number): string {
  let res = "";

  for (let i = 0; i < count; i++) {
    res += str;
  }

  return res;
}

/** Get the indent of the given length, based on the given options. */
export function getIndent(
  options: FormattingOptions,
  startColumn: number,
  length: number
): string {
  const size = options.tabSize;
  // First calculate the column that we need to reach.
  // This has to be a multiple of the tabSize.
  const endColumn = Math.ceil((startColumn + length) / size) * size;
  const actualLength = endColumn - startColumn;
  const count = options.insertSpaces
    ? actualLength
    : Math.ceil(actualLength / size);
  const indent = options.insertSpaces ? " " : "\t";

  return repeatStr(indent, count);
}
