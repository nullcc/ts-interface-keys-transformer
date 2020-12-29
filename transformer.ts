import * as path from 'path';
import * as _ from 'lodash';
import * as ts from 'typescript';

export default (program: ts.Program): ts.TransformerFactory<ts.SourceFile> => {
  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      const visitor = (node: ts.Node): ts.Node => {
        return ts.visitEachChild(visitNode(node, program), visitor, ctx);
      };
      return <ts.SourceFile> ts.visitEachChild(visitNode(sourceFile, program), visitor, ctx);
    };
  };
}

export interface Property {
  name: string;
  modifiers: string[];
  optional: boolean;
  type: string;
  elementKeys?: string[];
  elementType?: any;
  title?: string;
  args?: {
    [key: string]: string;
  };
}

const symbolMap = new Map<string, ts.Symbol>();

const visitNode = (node: ts.Node, program: ts.Program): ts.Node => {
  // collect all top level symbols in the source file
  if (node.kind === ts.SyntaxKind.SourceFile) {
    node['locals'].forEach((symbol: ts.Symbol, key: string) => {
      if (!symbolMap.has(key)) {
        symbolMap.set(key, symbol);
      }
    });
  }
  const typeChecker = program.getTypeChecker();
  if (!isKeysCallExpression(node, typeChecker)) {
    return node;
  }
  if (!node.typeArguments) {
    return ts.createArrayLiteral([]);
  }
  const type = typeChecker.getTypeFromTypeNode(node.typeArguments[0]);
  let properties: Property[] = [];
  const symbols = typeChecker.getPropertiesOfType(type);
  symbols.forEach(symbol => {
    properties = [ ...properties, ...getSymbolProperties(symbol, [], symbolMap) ];
  });

  return ts.createArrayLiteral(properties.map(property => ts.createRegularExpressionLiteral(JSON.stringify(property))));
};

const getSymbolProperties = (symbol: ts.Symbol, outerLayerProperties: Property[], symbolMap: Map<string, ts.Symbol>): Property[] => {
  let properties: Property[] = [];
  const propertyPathElements = JSON.parse(JSON.stringify(outerLayerProperties.map(property => property)));
  const propertyName = symbol.escapedName;
  propertyPathElements.push(propertyName);
  /* please note: due to interface or type can be a intersection types (e.g. A & B)
   * or a union types (e.g. A | B), these types have no "valueDeclaration" property.
   * We must traverse the "symbol.declarations" to collect "questionToken" of all sub types
   */
  const optional = _.some(symbol.declarations, (declaration: ts.PropertyDeclaration) => {
    return !!declaration.questionToken;
  });
  const modifiers: string[] = [];
  symbol.declarations.forEach((declaration: any) => {
    if (declaration.modifiers) {
      declaration.modifiers.forEach((modifier: ts.Token<ts.SyntaxKind.ReadonlyKeyword>) => {
        modifiers.push(getModifierType(modifier));
      });
    }
  });
  const property: Property = {
    name: propertyPathElements.join('.'),
    modifiers,
    optional,
    type: getPropertyType(symbol.valueDeclaration ? symbol.valueDeclaration['type'] : symbol['type']),
  };
  if (symbol.valueDeclaration && symbol.valueDeclaration['type'].kind === ts.SyntaxKind.ArrayType) { // array: []
    const elementType = getPropertyType(symbol.valueDeclaration['type'].elementType);
    if (symbol.valueDeclaration['type'].elementType.members) {
      property.elementKeys = _.flattenDeep(symbol.valueDeclaration['type'].elementType.members.map((member: any) => {
        return getSymbolProperties(member.symbol, [], symbolMap);
      }));
    } else if (symbol['typeArguments']) {
      property.elementKeys = _.flattenDeep(symbol['typeArguments'][0].members.map((member: any) => {
        return getSymbolProperties(member.symbol, [], symbolMap);
      }));
    } else {
      const members = symbolMap.has(elementType) ? (symbolMap.get(elementType)!['declarations'][0] as any).members : [];
      if (members && members.length > 0) {
        property.elementKeys = _.flattenDeep(members.map((member: any) => {
          return getSymbolProperties(member.symbol, [], symbolMap);
        }));
      } else {
        property.elementType = elementType;
      }
    }
  } else if (symbol.valueDeclaration && symbol.valueDeclaration['type']['typeArguments']) { // for Array<xxx>
    let type;
    if (symbol.valueDeclaration['type']['typeArguments'][0].typeName) {
      type = symbol.valueDeclaration['type']['typeArguments'][0].typeName.escapedText;
    }
    const members = symbolMap.has(type) ? (symbolMap.get(type)!['declarations'][0] as any).members : symbol.valueDeclaration['type']['typeArguments'][0].members;
    property.elementKeys = _.flattenDeep(members.map((member: any) => {
      return getSymbolProperties(member.symbol, [], symbolMap);
    }));
  }

  if (symbol.valueDeclaration) {
    const fullText = symbol.valueDeclaration.getFullText();
    const title_reg = /(?<=\* )[^@](.*)+[^\n]/g;
    const title = fullText.match(title_reg);
    if (title) {
      property.title = title.toString();
    }

    const args_reg = /(?<=\* @).*/g;
    const args = fullText.match(args_reg);
    if (args) {
      property.args = args.reduce((p, c) => {
        const key = c.match(/[^\s]+/);
        const value = c.match(/(?<=\s).*/);
        if (key) {
          p[key[0]] = value ? value[0] : ''
        }
        return p;
      }, {});
    }
  }

  properties.push(property);

  const propertiesOfSymbol = _getPropertiesOfSymbol(symbol, propertyPathElements, symbolMap);
  properties = [
    ...properties,
    ...propertiesOfSymbol,
  ];

  return properties;
};

const isOutermostLayerSymbol = (symbol: any): boolean => {
  return symbol.valueDeclaration && symbol.valueDeclaration.symbol.valueDeclaration.type.members;
};

const isInnerLayerSymbol = (symbol: any): boolean => {
  return symbol.valueDeclaration && symbol.valueDeclaration.symbol.valueDeclaration.type.typeName;
};

const _getPropertiesOfSymbol = (symbol: ts.Symbol, propertyPathElements: Property[], symbolMap: Map<string, ts.Symbol>): Property[] => {
  if (!isOutermostLayerSymbol(symbol) && !isInnerLayerSymbol(symbol)) {
    return [];
  }
  let properties: Property[] = [];
  let members: any;
  if ((<any>symbol.valueDeclaration).type.symbol) {
    members = (<any>symbol.valueDeclaration).type.members.map((member: any) => member.symbol);
  } else {
    const propertyTypeName = (<any>symbol.valueDeclaration).type.typeName.escapedText;
    const propertyTypeSymbol = symbolMap.get(propertyTypeName);
    if (propertyTypeSymbol) {
      if (propertyTypeSymbol.members) {
        members = propertyTypeSymbol.members;
      } else {
        members = (<any>propertyTypeSymbol).exportSymbol.members;
      }
    }
  }
  if (members) {
    members.forEach((member: any) => {
      properties = [
        ...properties,
        ...getSymbolProperties(member, propertyPathElements, symbolMap),
      ];
    });
  }

  return properties;
};

const getPropertyType = (symbol: any): string => {
  if (symbol.intrinsicName) {
    return symbol.intrinsicName;
  }
  if (symbol.types) {
    return symbol.types.map((token: any) => getPropertyType(token));
  }
  switch (symbol.kind) {
    case ts.SyntaxKind.ArrayType:
      return 'array';
    case ts.SyntaxKind.StringKeyword:
      return 'string';
    case ts.SyntaxKind.NumberKeyword:
      return 'number';
    case ts.SyntaxKind.BooleanKeyword:
      return 'boolean';
    case ts.SyntaxKind.FunctionType:
      return 'Function';
    case ts.SyntaxKind.TypeReference:
      return symbol.typeName.escapedText;
    case ts.SyntaxKind.AnyKeyword:
      return 'any';
    case ts.SyntaxKind.NullKeyword:
      return 'null';
    case ts.SyntaxKind.ObjectKeyword:
      return 'object';
    case ts.SyntaxKind.TypeLiteral:
      return 'object';
    case ts.SyntaxKind.UnionType:
      return symbol.types.map((token: any) => getPropertyType(token));
    case ts.SyntaxKind.IntersectionType:
      return symbol.types.map((token: any) => getPropertyType(token));
    default:
      return 'unknown';
  }
};

const getModifierType = (modifier: ts.Token<ts.SyntaxKind>): string => {
  switch (modifier.kind) {
    case ts.SyntaxKind.ReadonlyKeyword:
      return 'readonly';
    default:
      return 'unknown';
  }
}

const indexTs = path.join(__dirname, './index.ts');
const isKeysCallExpression = (node: ts.Node, typeChecker: ts.TypeChecker): node is ts.CallExpression => {
  if (!ts.isCallExpression(node)) {
    return false;
  }
  const signature = typeChecker.getResolvedSignature(node);
  if (typeof signature === 'undefined') {
    return false;
  }
  const { declaration } = signature;
  return !!declaration
    && !ts.isJSDocSignature(declaration)
    && (path.join(declaration.getSourceFile().fileName) === indexTs)
    && !!declaration.name
    && declaration.name.getText() === 'keys';
};
