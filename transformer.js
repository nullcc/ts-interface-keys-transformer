"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
var path = __importStar(require("path"));
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
    if (node.kind === ts.SyntaxKind.SourceFile) {
        node.locals.forEach(function (value, key) {
            if (!symbolMap.get(key)) {
                symbolMap.set(key, value);
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
        properties = properties.concat(getPropertiesOfSymbol(symbol, [], symbolMap));
    });
    return ts.createArrayLiteral(properties.map(function (property) { return ts.createRegularExpressionLiteral(JSON.stringify(property)); }));
};
var getPropertiesOfSymbol = function (symbol, outerLayerProperties, symbolMap) {
    var properties = [];
    var propertyPathElements = JSON.parse(JSON.stringify(outerLayerProperties.map(function (property) { return property; })));
    var property = symbol.escapedName;
    propertyPathElements.push(property);
    var optional = true;
    for (var _i = 0, _a = symbol.declarations; _i < _a.length; _i++) {
        var declaration = _a[_i];
        if (undefined === declaration.questionToken) {
            optional = false;
            break;
        }
    }
    var key = {
        name: propertyPathElements.join('.'),
        optional: optional,
    };
    properties.push(key);
    var propertiesOfSymbol = _getPropertiesOfSymbol(symbol, propertyPathElements, symbolMap);
    properties = properties.concat(propertiesOfSymbol);
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
            properties = properties.concat(getPropertiesOfSymbol(member, propertyPathElements, symbolMap));
        });
    }
    return properties;
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
