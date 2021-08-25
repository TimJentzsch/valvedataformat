import { DocumentSymbol, SymbolKind } from "vscode-languageserver/node";
import AstNode from "../ast/node";
import AstObject from "../ast/object";
import AstProperty from "../ast/property";
import AstRoot from "../ast/root";
import AstString from "../ast/string";

export default async function getNodeSymbols(
  node: AstNode
): Promise<DocumentSymbol[]> {
  switch (node.type) {
    case "root":
      return getRootSymbols(node);
    case "object":
      return getObjectSymbols(node);
    case "property":
      return getPropertySymbols(node);
    case "string":
      return getStringSymbols(node);
    default:
      return [];
  }
}

/** Get the document symbols of the child nodes. */
export async function getChildNodeSymbols(
  children: AstNode[]
): Promise<DocumentSymbol[]> {
  const childSymbols = await Promise.all(
    children.map((child) => getNodeSymbols(child))
  );

  // Merge results
  return ([] as DocumentSymbol[]).concat(...childSymbols);
}

/** Get the document symbols of a root node. */
export async function getRootSymbols(root: AstRoot): Promise<DocumentSymbol[]> {
  const childSymbols = await getChildNodeSymbols(root.children);
  return childSymbols;
}

/** Get the document symbols of an object node. */
export async function getObjectSymbols(
  obj: AstObject
): Promise<DocumentSymbol[]> {
  const childSymbols = await getChildNodeSymbols(obj.children);
  return childSymbols;
}

/** Get the document symbols of a property node */
export async function getPropertySymbols(
  property: AstProperty
): Promise<DocumentSymbol[]> {
  const key = property.key;
  const value = property.value;
  const childSymbols = value ? await getNodeSymbols(value) : [];

  // If key or value are undefined, select the other one.
  // Otherwise select key start until value end.
  const selectionRange =
    key !== undefined
      ? value !== undefined
        ? {
            start: key.range.start,
            end: value.range.end,
          }
        : key.range
      : value?.range ?? property.range;

  const kind =
    property.valueType === "object" ? SymbolKind.Object : SymbolKind.Property;

  const symbol: DocumentSymbol = {
    name: property.key?.value ?? "Property",
    kind,
    range: property.range,
    selectionRange,
    children: childSymbols,
  };

  return [symbol];
}

/** Get the document symbols of a string node. */
export async function getStringSymbols(
  str: AstString
): Promise<DocumentSymbol[]> {
  const value = str.value;
  const symbol: DocumentSymbol = {
    name: value,
    kind: SymbolKind.String,
    range: str.range,
    selectionRange: str.range,
    children: [],
  };

  return [symbol];
}
