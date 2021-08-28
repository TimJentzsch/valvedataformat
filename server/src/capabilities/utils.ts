import { FormattingOptions } from "vscode-languageserver/node";
import AstKey from "../ast/key";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import { PropertyType } from "../ast/property";
import AstRoot from "../ast/root";
import AstString from "../ast/string";
import { repeatStr } from "../utils/stringUtils";

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
      if (property.propertyType === PropertyType.object) {
        return 0;
      }

      return getStringLikeLength(property.value);
    })
  );
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

/** Execute the given function for a list of nodes. */
export async function executeForNodeList<T>(nodes: AstNode[], fn: (node: AstNode) => Promise<T[]>): Promise<T[]> {
  const fastResults: T[][] = [];
  const slowResults: Promise<T[]>[] = [];

  for (const node of nodes) {
    if (node.children.length === 0) {
      fastResults.push(await fn(node));
    } else {
      slowResults.push(fn(node));
    }
  }

  const combinedResults = fastResults.concat(await Promise.all(slowResults));
  const merged = ([] as T[]).concat(...combinedResults);
  return merged;
}
