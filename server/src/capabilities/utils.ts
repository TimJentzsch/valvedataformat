import { FormattingOptions } from "vscode-languageserver/node";
import AstIndent, { IndentType } from "../ast/indent";
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

/** Calculates the next column that is aligned with the tab marks. */
export function nextIndentColumn(column: number, options: FormattingOptions): number {
  return Math.ceil(column / options.tabSize) * options.tabSize;
}

/** Get the column after the indent is applied at the start column. */
export function getColumnAfterIndent(startColumn: number, indent: AstIndent, options: FormattingOptions): number {
  if (indent.indentType === IndentType.spaces) {
    return startColumn + indent.count;
  }

  // The first tab lines up to the next column, the others apply the tab size
  return nextIndentColumn(startColumn + 1, options) + (indent.count - 1) * options.tabSize;
}

/** Get the number of indent characters needed to get from the start to the goal column. */
export function getNeededIndentCount(startColumn: number, goalColumn: number, options: FormattingOptions): number {
  if (options.insertSpaces) {
    return goalColumn - startColumn;
  }

  return Math.ceil((goalColumn - startColumn) / options.tabSize);
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
