import { TextEdit, FormattingOptions, Range } from "vscode-languageserver/node";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import AstProperty, { AstStringProperty } from "../ast/property";
import AstRoot from "../ast/root";
import {
  getStringLikeLength,
  getIndent,
  getMaxKeyLength,
  getMaxValueLength,
} from "./utils";

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
