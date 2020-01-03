"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
var transformer_1 = __importDefault(require("./transformer"));
function compile(filePaths, writeFileCallback) {
    var program = ts.createProgram(filePaths, {
        strict: true,
        noEmitOnError: true,
        suppressImplicitAnyIndexErrors: true,
        target: ts.ScriptTarget.ES5,
    });
    var transformers = {
        before: [transformer_1.default(program)],
        after: [],
    };
    var _a = program.emit(undefined, writeFileCallback, undefined, false, transformers), emitSkipped = _a.emitSkipped, diagnostics = _a.diagnostics;
    if (emitSkipped) {
        throw new Error(diagnostics.map(function (diagnostic) { return diagnostic.messageText; }).join('\n'));
    }
}
exports.default = compile;
