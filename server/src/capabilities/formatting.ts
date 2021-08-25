import { TextEdit, FormattingOptions, Range } from "vscode-languageserver/node";
import AstKey from "../ast/key";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import AstProperty, { AstStringProperty } from "../ast/property";
import AstRoot from "../ast/root";
import AstString from "../ast/string";

/** Format the given node. */
export default async function formatNode(
  node: AstNode,
  options: FormattingOptions,
  curIndent: number = 0
): Promise<TextEdit[]> {
  switch (node.type) {
    case "root":
      return formatRoot(node, options, curIndent);
    case "object":
      return formatObject(node, options, curIndent);
    case "property":
      return formatProperty(node, options, curIndent);
    default:
      return [];
  }
}

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
      const value = property.value;
      if (value === undefined || value.type === "object") {
        return 0;
      }
      return getStringLikeLength(value);
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

/** Format the given string node. */
export async function formatStringProperty(
  property: AstStringProperty,
  options: FormattingOptions,
  curIndent: number = 0,
  maxKeyLength: number = 0,
  maxValueLength: number = 0
): Promise<TextEdit[]> {
  const edits: TextEdit[] = [];

  const key = property.key;
  const value = property.value;

  if (value === undefined) {
    return [];
  }

  // Line up all property values
  const keyLength = getStringLikeLength(property.key);
  const neededBetweenIndent = 1 + (maxKeyLength - keyLength);
  const keyEndColumn = curIndent * options.tabSize + keyLength;
  const betweenIndent = getIndent(options, keyEndColumn, neededBetweenIndent);
  const betweenRange: Range = {
    start: key.range.end,
    end: value.range.start,
  };

  edits.push({
    range: betweenRange,
    newText: betweenIndent,
  });

  return edits;
}

/** Format the given property node. */
export async function formatProperty(
  property: AstProperty,
  options: FormattingOptions,
  curIndent: number = 0,
  maxKeyLength: number = 0,
  maxValueLength: number = 0
): Promise<TextEdit[]> {
  const value = property.value;

  if (value === undefined || value.type === "string") {
    return formatStringProperty(
      property as AstStringProperty,
      options,
      curIndent,
      maxKeyLength,
      maxValueLength
    );
  }

  return formatNode(value, options, curIndent);
}

/** Format the given object node. */
export async function formatObject(
  obj: AstObject,
  options: FormattingOptions,
  curIndent: number = 0
): Promise<TextEdit[]> {
  const maxKeyLength = getMaxKeyLength(obj);
  const maxValueLength = getMaxValueLength(obj);

  const propertyEditsCollection = await Promise.all(
    obj.properties.map((property) =>
      formatProperty(
        property,
        options,
        curIndent + 1,
        maxKeyLength,
        maxValueLength
      )
    )
  );

  const propertyEdits = ([] as TextEdit[]).concat(...propertyEditsCollection);

  return propertyEdits;
}

/** Format the given root node. */
export async function formatRoot(
  root: AstRoot,
  options: FormattingOptions,
  curIndent: number = 0
): Promise<TextEdit[]> {
  const maxKeyLength = getMaxKeyLength(root);
  const maxValueLength = getMaxValueLength(root);

  const propertyEditsCollection = await Promise.all(
    root.properties.map((property) =>
      formatProperty(property, options, curIndent, maxKeyLength, maxValueLength)
    )
  );

  const propertyEdits = ([] as TextEdit[]).concat(...propertyEditsCollection);

  return propertyEdits;
}
