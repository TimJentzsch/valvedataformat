import { TextEdit, FormattingOptions, Range } from "vscode-languageserver/node";
import { NodeType } from "../ast/baseNode";
import { IndentType } from "../ast/indent";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import AstProperty, { AstStringProperty, PropertyType } from "../ast/property";
import AstRoot from "../ast/root";
import { repeatStr } from "../utils/stringUtils";
import {
  getStringLikeLength,
  getMaxKeyLength,
  getMaxValueLength,
  nextIndentColumn,
  getColumnAfterIndent,
  getNeededIndentCount,
} from "./utils";

export interface NodeFormattingOptions extends FormattingOptions {
  /** The current level of indent. */
  indent?: number;
  /** The current column.
   * Columns differ from the character in a position when tabs are used.
   * One tab is always one character, but has as many columns as the tab size used.
   */
  column?: number;
}

export interface PropertyFormattingOptions extends NodeFormattingOptions {
  /** The maximum length of the keys in the current object. */
  maxKeyLength?: number;
  /** The maximum length of the values in the current object. */
  maxValueLength?: number;
}

/** Format the given node. */
export default async function formatNode(
  node: AstNode,
  options: NodeFormattingOptions
): Promise<TextEdit[]> {
  switch (node.type) {
    case NodeType.root:
      return formatRoot(node, options);
    case NodeType.object:
      return formatObject(node, options);
    case NodeType.property:
      return formatProperty(node, options);
    default:
      return [];
  }
}

/** Format the given string node. */
export async function formatStringProperty(
  property: AstStringProperty,
  options: PropertyFormattingOptions
): Promise<TextEdit[]> {
  const edits: TextEdit[] = [];

  const key = property.key;
  const value = property.value;

  if (value === undefined) {
    return [];
  }

  const keyLength = getStringLikeLength(property.key);
  const column = options.column ?? 0;
  const maxKeyLength = options.maxKeyLength ?? keyLength;

  // Line up all property values
  const keyColumn = column + keyLength;
  const goalColumn = nextIndentColumn(column + maxKeyLength + 1, options);

  let curColumn = keyColumn;

  const wantedIndentType = options.insertSpaces
    ? IndentType.spaces
    : IndentType.tabs;

  for (const indent of property.betweenIndent) {
    if (indent.indentType === wantedIndentType) {
      // There is already some indent that we can use
      const columnAfterIndent = getColumnAfterIndent(
        curColumn,
        indent,
        options
      );

      if (columnAfterIndent <= goalColumn) {
        // It's not too much indent
        curColumn = columnAfterIndent;

        if (curColumn === goalColumn) {
          // We have enough indent
          if (indent.range.end.character < value.range.start.character) {
            // There is more indent, delete the rest
            const range: Range = {
              start: indent.range.end,
              end: value.range.start,
            };
            edits.push({
              range,
              newText: "",
            });
          }
          break;
        }
      } else {
        // It's too much indent, delete the excess
        const excessColumns = columnAfterIndent - goalColumn;
        // The number of indent characters that have to be deleted
        const excessIndent = options.insertSpaces
          ? excessColumns
          : Math.ceil(excessColumns / options.tabSize);
        const indentEnd = indent.range.end;
        const range: Range = {
          start: {
            line: indentEnd.line,
            character: indentEnd.character - excessIndent,
          },
          end: value.range.start,
        };
        edits.push({
          range,
          newText: "",
        });
        break;
      }
    } else {
      // The indent is of the wrong type, delete it
      edits.push({
        range: indent.range,
        newText: "",
      });
    }
  }

  if (curColumn < goalColumn) {
    // There isn't enough indent, we need to add some
    const newText = repeatStr(
      options.insertSpaces ? " " : "\t",
      getNeededIndentCount(curColumn, goalColumn, options)
    );
    const range: Range = {
      start: value.range.start,
      end: value.range.start,
    };
    edits.push({
      range,
      newText,
    });
  }

  return edits;
}

/** Format the given property node. */
export async function formatProperty(
  property: AstProperty,
  options: PropertyFormattingOptions
): Promise<TextEdit[]> {
  if (property.propertyType === PropertyType.string) {
    return formatStringProperty(property, options);
  }

  return formatNode(property.value, options);
}

/** Format the given object node. */
export async function formatObject(
  obj: AstObject,
  options: NodeFormattingOptions
): Promise<TextEdit[]> {
  const maxKeyLength = getMaxKeyLength(obj);
  const maxValueLength = getMaxValueLength(obj);

  const propOptions: PropertyFormattingOptions = {
    ...options,
    maxKeyLength,
    maxValueLength,
    indent: (options.indent ?? 0) + 1,
    column: (options.column ?? 0) + options.tabSize,
  };

  const propertyEditsCollection = await Promise.all(
    obj.properties.map((property) => formatProperty(property, propOptions))
  );

  const propertyEdits = ([] as TextEdit[]).concat(...propertyEditsCollection);

  return propertyEdits;
}

/** Format the given root node. */
export async function formatRoot(
  root: AstRoot,
  options: FormattingOptions
): Promise<TextEdit[]> {
  const maxKeyLength = getMaxKeyLength(root);
  const maxValueLength = getMaxValueLength(root);

  const propOptions: PropertyFormattingOptions = {
    ...options,
    maxKeyLength,
    maxValueLength,
  };

  const propertyEditsCollection = await Promise.all(
    root.properties.map((property) => formatProperty(property, propOptions))
  );

  const propertyEdits = ([] as TextEdit[]).concat(...propertyEditsCollection);

  return propertyEdits;
}
