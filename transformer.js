"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var _ = __importStar(require("lodash"));
var ts = __importStar(require("typescript"));
exports.default = (function (program) {
    return function (ctx) {
        return function (sourceFile) {
            var visitor = function (node) {
                return ts.visitEachChild(visitNode(node, program), visitor, ctx);
            };
            return ts.visitEachChild(visitNode(sourceFile, program), visitor, ctx);
        };
    };
});
var symbolMap = new Map();
var visitNode = function (node, program) {
    // collect all top level symbols in the source file
    if (node.kind === ts.SyntaxKind.SourceFile) {
        node['locals'].forEach(function (symbol, key) {
            if (!symbolMap.has(key)) {
                symbolMap.set(key, symbol);
            }
        });
    }
    var typeChecker = program.getTypeChecker();
    if (!isKeysCallExpression(node, typeChecker)) {
        return node;
    }
    if (!node.typeArguments) {
        return ts.createArrayLiteral([]);
    }
    var type = typeChecker.getTypeFromTypeNode(node.typeArguments[0]);
    var properties = [];
    var symbols = typeChecker.getPropertiesOfType(type);
    symbols.forEach(function (symbol) {
        properties = __spreadArrays(properties, getSymbolProperties(symbol, [], symbolMap));
    });
    return ts.createArrayLiteral(properties.map(function (property) { return ts.createRegularExpressionLiteral(JSON.stringify(property)); }));
};
var getSymbolProperties = function (symbol, outerLayerProperties, symbolMap) {
    var properties = [];
    var propertyPathElements = JSON.parse(JSON.stringify(outerLayerProperties.map(function (property) { return property; })));
    var propertyName = symbol.escapedName;
    propertyPathElements.push(propertyName);
    /* please note: due to interface or type can be a intersection types (e.g. A & B)
     * or a union types (e.g. A | B), these types have no "valueDeclaration" property.
     * We must traverse the "symbol.declarations" to collect "questionToken" of all sub types
     */
    var optional = _.some(symbol.declarations, function (declaration) {
        return !!declaration.questionToken;
    });
    var modifiers = [];
    symbol.declarations.forEach(function (declaration) {
        if (declaration.modifiers) {
            declaration.modifiers.forEach(function (modifier) {
                modifiers.push(getModifierType(modifier));
            });
        }
    });
    var property = {
        name: propertyPathElements.join('.'),
        modifiers: modifiers,
        optional: optional,
        type: getPropertyType(symbol.valueDeclaration ? symbol.valueDeclaration['type'] : symbol['type']),
    };
    if (symbol.valueDeclaration && symbol.valueDeclaration['type'].kind === ts.SyntaxKind.ArrayType) { // array
        var elementType = getPropertyType(symbol.valueDeclaration['type'].elementType);
        if (elementType === 'object') {
            property.elementKeys = _.flattenDeep(symbol.valueDeclaration['type'].elementType.members.map(function (member) {
                return getSymbolProperties(member.symbol, [], symbolMap);
            }));
        }
        else {
            property.elementType = elementType;
        }
    }
    properties.push(property);
    var propertiesOfSymbol = _getPropertiesOfSymbol(symbol, propertyPathElements, symbolMap);
    properties = __spreadArrays(properties, propertiesOfSymbol);
    return properties;
};
var isOutermostLayerSymbol = function (symbol) {
    return symbol.valueDeclaration && symbol.valueDeclaration.symbol.valueDeclaration.type.members;
};
var isInnerLayerSymbol = function (symbol) {
    return symbol.valueDeclaration && symbol.valueDeclaration.symbol.valueDeclaration.type.typeName;
};
var _getPropertiesOfSymbol = function (symbol, propertyPathElements, symbolMap) {
    if (!isOutermostLayerSymbol(symbol) && !isInnerLayerSymbol(symbol)) {
        return [];
    }
    var properties = [];
    var members;
    if (symbol.valueDeclaration.type.symbol) {
        members = symbol.valueDeclaration.type.members.map(function (member) { return member.symbol; });
    }
    else {
        var propertyTypeName = symbol.valueDeclaration.type.typeName.escapedText;
        var propertyTypeSymbol = symbolMap.get(propertyTypeName);
        if (propertyTypeSymbol) {
            if (propertyTypeSymbol.members) {
                members = propertyTypeSymbol.members;
            }
            else {
                members = propertyTypeSymbol.exportSymbol.members;
            }
        }
    }
    if (members) {
        members.forEach(function (member) {
            properties = __spreadArrays(properties, getSymbolProperties(member, propertyPathElements, symbolMap));
        });
    }
    return properties;
};
var getPropertyType = function (symbol) {
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
        case ts.SyntaxKind.TypeLiteral:
            return 'object';
        case ts.SyntaxKind.UnionType:
            return symbol.types.map(function (token) { return getPropertyType(token); });
        case ts.SyntaxKind.IntersectionType:
            return symbol.types.map(function (token) { return getPropertyType(token); });
        default:
            return 'unknown';
    }
};
var getModifierType = function (modifier) {
    switch (modifier.kind) {
        case ts.SyntaxKind.ReadonlyKeyword:
            return 'readonly';
        default:
            return 'unknown';
    }
};
var indexTs = path.join(__dirname, './index.ts');
var isKeysCallExpression = function (node, typeChecker) {
    if (!ts.isCallExpression(node)) {
        return false;
    }
    var signature = typeChecker.getResolvedSignature(node);
    if (typeof signature === 'undefined') {
        return false;
    }
    var declaration = signature.declaration;
    return !!declaration
        && !ts.isJSDocSignature(declaration)
        && (path.join(declaration.getSourceFile().fileName) === indexTs)
        && !!declaration.name
        && declaration.name.getText() === 'keys';
};
