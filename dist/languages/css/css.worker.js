import { Position, CompletionItemKind, Range, TextEdit, InsertTextFormat, MarkedString, Location, DocumentHighlightKind, SymbolKind, Command, DiagnosticSeverity, Color, ColorInformation, ColorPresentation, FoldingRangeKind, FoldingRange, DiagnosticRelatedInformation, Diagnostic, TextDocumentEdit, WorkspaceEdit, WorkspaceChange, TextDocumentIdentifier, VersionedTextDocumentIdentifier, TextDocumentItem, MarkupKind, MarkupContent, CompletionItem, CompletionList, Hover, ParameterInformation, SignatureInformation, DocumentHighlight, SymbolInformation, DocumentSymbol, CodeActionKind, CodeActionContext, CodeAction, CodeLens, FormattingOptions, DocumentLink, EOL, TextDocument, TextDocumentSaveReason } from '../../monaco/types.js';
import { initialize } from '../../monaco/editor.worker.js';
import '../../monaco/workers.js';
import '../../monaco/base.js';
import '../../monaco/editor.js';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Ident"] = 0] = "Ident";
    TokenType[TokenType["AtKeyword"] = 1] = "AtKeyword";
    TokenType[TokenType["String"] = 2] = "String";
    TokenType[TokenType["BadString"] = 3] = "BadString";
    TokenType[TokenType["UnquotedString"] = 4] = "UnquotedString";
    TokenType[TokenType["Hash"] = 5] = "Hash";
    TokenType[TokenType["Num"] = 6] = "Num";
    TokenType[TokenType["Percentage"] = 7] = "Percentage";
    TokenType[TokenType["Dimension"] = 8] = "Dimension";
    TokenType[TokenType["UnicodeRange"] = 9] = "UnicodeRange";
    TokenType[TokenType["CDO"] = 10] = "CDO";
    TokenType[TokenType["CDC"] = 11] = "CDC";
    TokenType[TokenType["Colon"] = 12] = "Colon";
    TokenType[TokenType["SemiColon"] = 13] = "SemiColon";
    TokenType[TokenType["CurlyL"] = 14] = "CurlyL";
    TokenType[TokenType["CurlyR"] = 15] = "CurlyR";
    TokenType[TokenType["ParenthesisL"] = 16] = "ParenthesisL";
    TokenType[TokenType["ParenthesisR"] = 17] = "ParenthesisR";
    TokenType[TokenType["BracketL"] = 18] = "BracketL";
    TokenType[TokenType["BracketR"] = 19] = "BracketR";
    TokenType[TokenType["Whitespace"] = 20] = "Whitespace";
    TokenType[TokenType["Includes"] = 21] = "Includes";
    TokenType[TokenType["Dashmatch"] = 22] = "Dashmatch";
    TokenType[TokenType["SubstringOperator"] = 23] = "SubstringOperator";
    TokenType[TokenType["PrefixOperator"] = 24] = "PrefixOperator";
    TokenType[TokenType["SuffixOperator"] = 25] = "SuffixOperator";
    TokenType[TokenType["Delim"] = 26] = "Delim";
    TokenType[TokenType["EMS"] = 27] = "EMS";
    TokenType[TokenType["EXS"] = 28] = "EXS";
    TokenType[TokenType["Length"] = 29] = "Length";
    TokenType[TokenType["Angle"] = 30] = "Angle";
    TokenType[TokenType["Time"] = 31] = "Time";
    TokenType[TokenType["Freq"] = 32] = "Freq";
    TokenType[TokenType["Exclamation"] = 33] = "Exclamation";
    TokenType[TokenType["Resolution"] = 34] = "Resolution";
    TokenType[TokenType["Comma"] = 35] = "Comma";
    TokenType[TokenType["Charset"] = 36] = "Charset";
    TokenType[TokenType["EscapedJavaScript"] = 37] = "EscapedJavaScript";
    TokenType[TokenType["BadEscapedJavaScript"] = 38] = "BadEscapedJavaScript";
    TokenType[TokenType["Comment"] = 39] = "Comment";
    TokenType[TokenType["SingleLineComment"] = 40] = "SingleLineComment";
    TokenType[TokenType["EOF"] = 41] = "EOF";
    TokenType[TokenType["CustomToken"] = 42] = "CustomToken";
})(TokenType || (TokenType = {}));
var MultiLineStream = /** @class */ (function () {
    function MultiLineStream(source) {
        this.source = source;
        this.len = source.length;
        this.position = 0;
    }
    MultiLineStream.prototype.substring = function (from, to) {
        if (to === void 0) { to = this.position; }
        return this.source.substring(from, to);
    };
    MultiLineStream.prototype.eos = function () {
        return this.len <= this.position;
    };
    MultiLineStream.prototype.pos = function () {
        return this.position;
    };
    MultiLineStream.prototype.goBackTo = function (pos) {
        this.position = pos;
    };
    MultiLineStream.prototype.goBack = function (n) {
        this.position -= n;
    };
    MultiLineStream.prototype.advance = function (n) {
        this.position += n;
    };
    MultiLineStream.prototype.nextChar = function () {
        return this.source.charCodeAt(this.position++) || 0;
    };
    MultiLineStream.prototype.peekChar = function (n) {
        if (n === void 0) { n = 0; }
        return this.source.charCodeAt(this.position + n) || 0;
    };
    MultiLineStream.prototype.lookbackChar = function (n) {
        if (n === void 0) { n = 0; }
        return this.source.charCodeAt(this.position - n) || 0;
    };
    MultiLineStream.prototype.advanceIfChar = function (ch) {
        if (ch === this.source.charCodeAt(this.position)) {
            this.position++;
            return true;
        }
        return false;
    };
    MultiLineStream.prototype.advanceIfChars = function (ch) {
        var i;
        if (this.position + ch.length > this.source.length) {
            return false;
        }
        for (i = 0; i < ch.length; i++) {
            if (this.source.charCodeAt(this.position + i) !== ch[i]) {
                return false;
            }
        }
        this.advance(i);
        return true;
    };
    MultiLineStream.prototype.advanceWhileChar = function (condition) {
        var posNow = this.position;
        while (this.position < this.len && condition(this.source.charCodeAt(this.position))) {
            this.position++;
        }
        return this.position - posNow;
    };
    return MultiLineStream;
}());
var _a = 'a'.charCodeAt(0);
var _f = 'f'.charCodeAt(0);
var _z = 'z'.charCodeAt(0);
var _A = 'A'.charCodeAt(0);
var _F = 'F'.charCodeAt(0);
var _Z = 'Z'.charCodeAt(0);
var _0 = '0'.charCodeAt(0);
var _9 = '9'.charCodeAt(0);
var _TLD = '~'.charCodeAt(0);
var _HAT = '^'.charCodeAt(0);
var _EQS = '='.charCodeAt(0);
var _PIP = '|'.charCodeAt(0);
var _MIN = '-'.charCodeAt(0);
var _USC = '_'.charCodeAt(0);
var _PRC = '%'.charCodeAt(0);
var _MUL = '*'.charCodeAt(0);
var _LPA = '('.charCodeAt(0);
var _RPA = ')'.charCodeAt(0);
var _LAN = '<'.charCodeAt(0);
var _RAN = '>'.charCodeAt(0);
var _ATS = '@'.charCodeAt(0);
var _HSH = '#'.charCodeAt(0);
var _DLR = '$'.charCodeAt(0);
var _BSL = '\\'.charCodeAt(0);
var _FSL = '/'.charCodeAt(0);
var _NWL = '\n'.charCodeAt(0);
var _CAR = '\r'.charCodeAt(0);
var _LFD = '\f'.charCodeAt(0);
var _DQO = '"'.charCodeAt(0);
var _SQO = '\''.charCodeAt(0);
var _WSP = ' '.charCodeAt(0);
var _TAB = '\t'.charCodeAt(0);
var _SEM = ';'.charCodeAt(0);
var _COL = ':'.charCodeAt(0);
var _CUL = '{'.charCodeAt(0);
var _CUR = '}'.charCodeAt(0);
var _BRL = '['.charCodeAt(0);
var _BRR = ']'.charCodeAt(0);
var _CMA = ','.charCodeAt(0);
var _DOT = '.'.charCodeAt(0);
var _BNG = '!'.charCodeAt(0);
var staticTokenTable = {};
staticTokenTable[_SEM] = TokenType.SemiColon;
staticTokenTable[_COL] = TokenType.Colon;
staticTokenTable[_CUL] = TokenType.CurlyL;
staticTokenTable[_CUR] = TokenType.CurlyR;
staticTokenTable[_BRR] = TokenType.BracketR;
staticTokenTable[_BRL] = TokenType.BracketL;
staticTokenTable[_LPA] = TokenType.ParenthesisL;
staticTokenTable[_RPA] = TokenType.ParenthesisR;
staticTokenTable[_CMA] = TokenType.Comma;
var staticUnitTable = {};
staticUnitTable['em'] = TokenType.EMS;
staticUnitTable['ex'] = TokenType.EXS;
staticUnitTable['px'] = TokenType.Length;
staticUnitTable['cm'] = TokenType.Length;
staticUnitTable['mm'] = TokenType.Length;
staticUnitTable['in'] = TokenType.Length;
staticUnitTable['pt'] = TokenType.Length;
staticUnitTable['pc'] = TokenType.Length;
staticUnitTable['deg'] = TokenType.Angle;
staticUnitTable['rad'] = TokenType.Angle;
staticUnitTable['grad'] = TokenType.Angle;
staticUnitTable['ms'] = TokenType.Time;
staticUnitTable['s'] = TokenType.Time;
staticUnitTable['hz'] = TokenType.Freq;
staticUnitTable['khz'] = TokenType.Freq;
staticUnitTable['%'] = TokenType.Percentage;
staticUnitTable['dpi'] = TokenType.Resolution;
staticUnitTable['dpcm'] = TokenType.Resolution;
var Scanner = /** @class */ (function () {
    function Scanner() {
        this.ignoreComment = true;
        this.ignoreWhitespace = true;
        this.inURL = false;
    }
    Scanner.prototype.setSource = function (input) {
        this.stream = new MultiLineStream(input);
    };
    Scanner.prototype.finishToken = function (offset, type, text) {
        return {
            offset: offset,
            len: this.stream.pos() - offset,
            type: type,
            text: text || this.stream.substring(offset)
        };
    };
    Scanner.prototype.substring = function (offset, len) {
        return this.stream.substring(offset, offset + len);
    };
    Scanner.prototype.pos = function () {
        return this.stream.pos();
    };
    Scanner.prototype.goBackTo = function (pos) {
        this.stream.goBackTo(pos);
    };
    Scanner.prototype.scanUnquotedString = function () {
        var offset = this.stream.pos();
        var content = [];
        if (this._unquotedString(content)) {
            return this.finishToken(offset, TokenType.UnquotedString, content.join(''));
        }
        return null;
    };
    Scanner.prototype.scan = function () {
        // processes all whitespaces and comments
        var triviaToken = this.trivia();
        if (triviaToken !== null) {
            return triviaToken;
        }
        var offset = this.stream.pos();
        // End of file/input
        if (this.stream.eos()) {
            return this.finishToken(offset, TokenType.EOF);
        }
        return this.scanNext(offset);
    };
    Scanner.prototype.scanNext = function (offset) {
        // CDO <!--
        if (this.stream.advanceIfChars([_LAN, _BNG, _MIN, _MIN])) {
            return this.finishToken(offset, TokenType.CDO);
        }
        // CDC -->
        if (this.stream.advanceIfChars([_MIN, _MIN, _RAN])) {
            return this.finishToken(offset, TokenType.CDC);
        }
        var content = [];
        if (this.ident(content)) {
            return this.finishToken(offset, TokenType.Ident, content.join(''));
        }
        // at-keyword
        if (this.stream.advanceIfChar(_ATS)) {
            content = ['@'];
            if (this._name(content)) {
                var keywordText = content.join('');
                if (keywordText === '@charset') {
                    return this.finishToken(offset, TokenType.Charset, keywordText);
                }
                return this.finishToken(offset, TokenType.AtKeyword, keywordText);
            }
            else {
                return this.finishToken(offset, TokenType.Delim);
            }
        }
        // hash
        if (this.stream.advanceIfChar(_HSH)) {
            content = ['#'];
            if (this._name(content)) {
                return this.finishToken(offset, TokenType.Hash, content.join(''));
            }
            else {
                return this.finishToken(offset, TokenType.Delim);
            }
        }
        // Important
        if (this.stream.advanceIfChar(_BNG)) {
            return this.finishToken(offset, TokenType.Exclamation);
        }
        // Numbers
        if (this._number()) {
            var pos = this.stream.pos();
            content = [this.stream.substring(offset, pos)];
            if (this.stream.advanceIfChar(_PRC)) {
                // Percentage 43%
                return this.finishToken(offset, TokenType.Percentage);
            }
            else if (this.ident(content)) {
                var dim = this.stream.substring(pos).toLowerCase();
                var tokenType_1 = staticUnitTable[dim];
                if (typeof tokenType_1 !== 'undefined') {
                    // Known dimension 43px
                    return this.finishToken(offset, tokenType_1, content.join(''));
                }
                else {
                    // Unknown dimension 43ft
                    return this.finishToken(offset, TokenType.Dimension, content.join(''));
                }
            }
            return this.finishToken(offset, TokenType.Num);
        }
        // String, BadString
        content = [];
        var tokenType = this._string(content);
        if (tokenType !== null) {
            return this.finishToken(offset, tokenType, content.join(''));
        }
        // single character tokens
        tokenType = staticTokenTable[this.stream.peekChar()];
        if (typeof tokenType !== 'undefined') {
            this.stream.advance(1);
            return this.finishToken(offset, tokenType);
        }
        // includes ~=
        if (this.stream.peekChar(0) === _TLD && this.stream.peekChar(1) === _EQS) {
            this.stream.advance(2);
            return this.finishToken(offset, TokenType.Includes);
        }
        // DashMatch |=
        if (this.stream.peekChar(0) === _PIP && this.stream.peekChar(1) === _EQS) {
            this.stream.advance(2);
            return this.finishToken(offset, TokenType.Dashmatch);
        }
        // Substring operator *=
        if (this.stream.peekChar(0) === _MUL && this.stream.peekChar(1) === _EQS) {
            this.stream.advance(2);
            return this.finishToken(offset, TokenType.SubstringOperator);
        }
        // Substring operator ^=
        if (this.stream.peekChar(0) === _HAT && this.stream.peekChar(1) === _EQS) {
            this.stream.advance(2);
            return this.finishToken(offset, TokenType.PrefixOperator);
        }
        // Substring operator $=
        if (this.stream.peekChar(0) === _DLR && this.stream.peekChar(1) === _EQS) {
            this.stream.advance(2);
            return this.finishToken(offset, TokenType.SuffixOperator);
        }
        // Delim
        this.stream.nextChar();
        return this.finishToken(offset, TokenType.Delim);
    };
    Scanner.prototype._matchWordAnyCase = function (characters) {
        var index = 0;
        this.stream.advanceWhileChar(function (ch) {
            var result = characters[index] === ch || characters[index + 1] === ch;
            if (result) {
                index += 2;
            }
            return result;
        });
        if (index === characters.length) {
            return true;
        }
        else {
            this.stream.goBack(index / 2);
            return false;
        }
    };
    Scanner.prototype.trivia = function () {
        while (true) {
            var offset = this.stream.pos();
            if (this._whitespace()) {
                if (!this.ignoreWhitespace) {
                    return this.finishToken(offset, TokenType.Whitespace);
                }
            }
            else if (this.comment()) {
                if (!this.ignoreComment) {
                    return this.finishToken(offset, TokenType.Comment);
                }
            }
            else {
                return null;
            }
        }
    };
    Scanner.prototype.comment = function () {
        if (this.stream.advanceIfChars([_FSL, _MUL])) {
            var success_1 = false, hot_1 = false;
            this.stream.advanceWhileChar(function (ch) {
                if (hot_1 && ch === _FSL) {
                    success_1 = true;
                    return false;
                }
                hot_1 = ch === _MUL;
                return true;
            });
            if (success_1) {
                this.stream.advance(1);
            }
            return true;
        }
        return false;
    };
    Scanner.prototype._number = function () {
        var npeek = 0, ch;
        if (this.stream.peekChar() === _DOT) {
            npeek = 1;
        }
        ch = this.stream.peekChar(npeek);
        if (ch >= _0 && ch <= _9) {
            this.stream.advance(npeek + 1);
            this.stream.advanceWhileChar(function (ch) {
                return ch >= _0 && ch <= _9 || npeek === 0 && ch === _DOT;
            });
            return true;
        }
        return false;
    };
    Scanner.prototype._newline = function (result) {
        var ch = this.stream.peekChar();
        switch (ch) {
            case _CAR:
            case _LFD:
            case _NWL:
                this.stream.advance(1);
                result.push(String.fromCharCode(ch));
                if (ch === _CAR && this.stream.advanceIfChar(_NWL)) {
                    result.push('\n');
                }
                return true;
        }
        return false;
    };
    Scanner.prototype._escape = function (result, includeNewLines) {
        var ch = this.stream.peekChar();
        if (ch === _BSL) {
            this.stream.advance(1);
            ch = this.stream.peekChar();
            var hexNumCount = 0;
            while (hexNumCount < 6 && (ch >= _0 && ch <= _9 || ch >= _a && ch <= _f || ch >= _A && ch <= _F)) {
                this.stream.advance(1);
                ch = this.stream.peekChar();
                hexNumCount++;
            }
            if (hexNumCount > 0) {
                try {
                    var hexVal = parseInt(this.stream.substring(this.stream.pos() - hexNumCount), 16);
                    if (hexVal) {
                        result.push(String.fromCharCode(hexVal));
                    }
                }
                catch (e) {
                    // ignore
                }
                // optional whitespace or new line, not part of result text
                if (ch === _WSP || ch === _TAB) {
                    this.stream.advance(1);
                }
                else {
                    this._newline([]);
                }
                return true;
            }
            if (ch !== _CAR && ch !== _LFD && ch !== _NWL) {
                this.stream.advance(1);
                result.push(String.fromCharCode(ch));
                return true;
            }
            else if (includeNewLines) {
                return this._newline(result);
            }
        }
        return false;
    };
    Scanner.prototype._stringChar = function (closeQuote, result) {
        // not closeQuote, not backslash, not newline
        var ch = this.stream.peekChar();
        if (ch !== 0 && ch !== closeQuote && ch !== _BSL && ch !== _CAR && ch !== _LFD && ch !== _NWL) {
            this.stream.advance(1);
            result.push(String.fromCharCode(ch));
            return true;
        }
        return false;
    };
    Scanner.prototype._string = function (result) {
        if (this.stream.peekChar() === _SQO || this.stream.peekChar() === _DQO) {
            var closeQuote = this.stream.nextChar();
            result.push(String.fromCharCode(closeQuote));
            while (this._stringChar(closeQuote, result) || this._escape(result, true)) {
                // loop
            }
            if (this.stream.peekChar() === closeQuote) {
                this.stream.nextChar();
                result.push(String.fromCharCode(closeQuote));
                return TokenType.String;
            }
            else {
                return TokenType.BadString;
            }
        }
        return null;
    };
    Scanner.prototype._unquotedChar = function (result) {
        // not closeQuote, not backslash, not newline
        var ch = this.stream.peekChar();
        if (ch !== 0 && ch !== _BSL && ch !== _SQO && ch !== _DQO && ch !== _LPA && ch !== _RPA && ch !== _WSP && ch !== _TAB && ch !== _NWL && ch !== _LFD && ch !== _CAR) {
            this.stream.advance(1);
            result.push(String.fromCharCode(ch));
            return true;
        }
        return false;
    };
    Scanner.prototype._unquotedString = function (result) {
        var hasContent = false;
        while (this._unquotedChar(result) || this._escape(result)) {
            hasContent = true;
        }
        return hasContent;
    };
    Scanner.prototype._whitespace = function () {
        var n = this.stream.advanceWhileChar(function (ch) {
            return ch === _WSP || ch === _TAB || ch === _NWL || ch === _LFD || ch === _CAR;
        });
        return n > 0;
    };
    Scanner.prototype._name = function (result) {
        var matched = false;
        while (this._identChar(result) || this._escape(result)) {
            matched = true;
        }
        return matched;
    };
    Scanner.prototype.ident = function (result) {
        var pos = this.stream.pos();
        var hasMinus = this._minus(result);
        if (hasMinus && this._minus(result) /* -- */) {
            if (this._identFirstChar(result) || this._escape(result)) {
                while (this._identChar(result) || this._escape(result)) {
                    // loop
                }
                return true;
            }
        }
        else if (this._identFirstChar(result) || this._escape(result)) {
            while (this._identChar(result) || this._escape(result)) {
                // loop
            }
            return true;
        }
        this.stream.goBackTo(pos);
        return false;
    };
    Scanner.prototype._identFirstChar = function (result) {
        var ch = this.stream.peekChar();
        if (ch === _USC || // _
            ch >= _a && ch <= _z || // a-z
            ch >= _A && ch <= _Z || // A-Z
            ch >= 0x80 && ch <= 0xFFFF) {
            this.stream.advance(1);
            result.push(String.fromCharCode(ch));
            return true;
        }
        return false;
    };
    Scanner.prototype._minus = function (result) {
        var ch = this.stream.peekChar();
        if (ch === _MIN) {
            this.stream.advance(1);
            result.push(String.fromCharCode(ch));
            return true;
        }
        return false;
    };
    Scanner.prototype._identChar = function (result) {
        var ch = this.stream.peekChar();
        if (ch === _USC || // _
            ch === _MIN || // -
            ch >= _a && ch <= _z || // a-z
            ch >= _A && ch <= _Z || // A-Z
            ch >= _0 && ch <= _9 || // 0/9
            ch >= 0x80 && ch <= 0xFFFF) {
            this.stream.advance(1);
            result.push(String.fromCharCode(ch));
            return true;
        }
        return false;
    };
    return Scanner;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <summary>
/// Nodes for the css 2.1 specification. See for reference:
/// http://www.w3.org/TR/CSS21/grammar.html#grammar
/// </summary>
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Undefined"] = 0] = "Undefined";
    NodeType[NodeType["Identifier"] = 1] = "Identifier";
    NodeType[NodeType["Stylesheet"] = 2] = "Stylesheet";
    NodeType[NodeType["Ruleset"] = 3] = "Ruleset";
    NodeType[NodeType["Selector"] = 4] = "Selector";
    NodeType[NodeType["SimpleSelector"] = 5] = "SimpleSelector";
    NodeType[NodeType["SelectorInterpolation"] = 6] = "SelectorInterpolation";
    NodeType[NodeType["SelectorCombinator"] = 7] = "SelectorCombinator";
    NodeType[NodeType["SelectorCombinatorParent"] = 8] = "SelectorCombinatorParent";
    NodeType[NodeType["SelectorCombinatorSibling"] = 9] = "SelectorCombinatorSibling";
    NodeType[NodeType["SelectorCombinatorAllSiblings"] = 10] = "SelectorCombinatorAllSiblings";
    NodeType[NodeType["SelectorCombinatorShadowPiercingDescendant"] = 11] = "SelectorCombinatorShadowPiercingDescendant";
    NodeType[NodeType["Page"] = 12] = "Page";
    NodeType[NodeType["PageBoxMarginBox"] = 13] = "PageBoxMarginBox";
    NodeType[NodeType["ClassSelector"] = 14] = "ClassSelector";
    NodeType[NodeType["IdentifierSelector"] = 15] = "IdentifierSelector";
    NodeType[NodeType["ElementNameSelector"] = 16] = "ElementNameSelector";
    NodeType[NodeType["PseudoSelector"] = 17] = "PseudoSelector";
    NodeType[NodeType["AttributeSelector"] = 18] = "AttributeSelector";
    NodeType[NodeType["Declaration"] = 19] = "Declaration";
    NodeType[NodeType["Declarations"] = 20] = "Declarations";
    NodeType[NodeType["Property"] = 21] = "Property";
    NodeType[NodeType["Expression"] = 22] = "Expression";
    NodeType[NodeType["BinaryExpression"] = 23] = "BinaryExpression";
    NodeType[NodeType["Term"] = 24] = "Term";
    NodeType[NodeType["Operator"] = 25] = "Operator";
    NodeType[NodeType["Value"] = 26] = "Value";
    NodeType[NodeType["StringLiteral"] = 27] = "StringLiteral";
    NodeType[NodeType["URILiteral"] = 28] = "URILiteral";
    NodeType[NodeType["EscapedValue"] = 29] = "EscapedValue";
    NodeType[NodeType["Function"] = 30] = "Function";
    NodeType[NodeType["NumericValue"] = 31] = "NumericValue";
    NodeType[NodeType["HexColorValue"] = 32] = "HexColorValue";
    NodeType[NodeType["MixinDeclaration"] = 33] = "MixinDeclaration";
    NodeType[NodeType["MixinReference"] = 34] = "MixinReference";
    NodeType[NodeType["VariableName"] = 35] = "VariableName";
    NodeType[NodeType["VariableDeclaration"] = 36] = "VariableDeclaration";
    NodeType[NodeType["Prio"] = 37] = "Prio";
    NodeType[NodeType["Interpolation"] = 38] = "Interpolation";
    NodeType[NodeType["NestedProperties"] = 39] = "NestedProperties";
    NodeType[NodeType["ExtendsReference"] = 40] = "ExtendsReference";
    NodeType[NodeType["SelectorPlaceholder"] = 41] = "SelectorPlaceholder";
    NodeType[NodeType["Debug"] = 42] = "Debug";
    NodeType[NodeType["If"] = 43] = "If";
    NodeType[NodeType["Else"] = 44] = "Else";
    NodeType[NodeType["For"] = 45] = "For";
    NodeType[NodeType["Each"] = 46] = "Each";
    NodeType[NodeType["While"] = 47] = "While";
    NodeType[NodeType["MixinContent"] = 48] = "MixinContent";
    NodeType[NodeType["Media"] = 49] = "Media";
    NodeType[NodeType["Keyframe"] = 50] = "Keyframe";
    NodeType[NodeType["FontFace"] = 51] = "FontFace";
    NodeType[NodeType["Import"] = 52] = "Import";
    NodeType[NodeType["Namespace"] = 53] = "Namespace";
    NodeType[NodeType["Invocation"] = 54] = "Invocation";
    NodeType[NodeType["FunctionDeclaration"] = 55] = "FunctionDeclaration";
    NodeType[NodeType["ReturnStatement"] = 56] = "ReturnStatement";
    NodeType[NodeType["MediaQuery"] = 57] = "MediaQuery";
    NodeType[NodeType["FunctionParameter"] = 58] = "FunctionParameter";
    NodeType[NodeType["FunctionArgument"] = 59] = "FunctionArgument";
    NodeType[NodeType["KeyframeSelector"] = 60] = "KeyframeSelector";
    NodeType[NodeType["ViewPort"] = 61] = "ViewPort";
    NodeType[NodeType["Document"] = 62] = "Document";
    NodeType[NodeType["AtApplyRule"] = 63] = "AtApplyRule";
    NodeType[NodeType["CustomPropertyDeclaration"] = 64] = "CustomPropertyDeclaration";
    NodeType[NodeType["CustomPropertySet"] = 65] = "CustomPropertySet";
    NodeType[NodeType["ListEntry"] = 66] = "ListEntry";
    NodeType[NodeType["Supports"] = 67] = "Supports";
    NodeType[NodeType["SupportsCondition"] = 68] = "SupportsCondition";
    NodeType[NodeType["NamespacePrefix"] = 69] = "NamespacePrefix";
    NodeType[NodeType["GridLine"] = 70] = "GridLine";
    NodeType[NodeType["Plugin"] = 71] = "Plugin";
})(NodeType || (NodeType = {}));
var ReferenceType;
(function (ReferenceType) {
    ReferenceType[ReferenceType["Mixin"] = 0] = "Mixin";
    ReferenceType[ReferenceType["Rule"] = 1] = "Rule";
    ReferenceType[ReferenceType["Variable"] = 2] = "Variable";
    ReferenceType[ReferenceType["Function"] = 3] = "Function";
    ReferenceType[ReferenceType["Keyframe"] = 4] = "Keyframe";
    ReferenceType[ReferenceType["Unknown"] = 5] = "Unknown";
})(ReferenceType || (ReferenceType = {}));
function getNodeAtOffset(node, offset) {
    var candidate = null;
    if (!node || offset < node.offset || offset > node.end) {
        return null;
    }
    // Find the shortest node at the position
    node.accept(function (node) {
        if (node.offset === -1 && node.length === -1) {
            return true;
        }
        if (node.offset <= offset && node.end >= offset) {
            if (!candidate) {
                candidate = node;
            }
            else if (node.length <= candidate.length) {
                candidate = node;
            }
            return true;
        }
        return false;
    });
    return candidate;
}
function getNodePath(node, offset) {
    var candidate = getNodeAtOffset(node, offset), path = [];
    while (candidate) {
        path.unshift(candidate);
        candidate = candidate.parent;
    }
    return path;
}
function getParentDeclaration(node) {
    var decl = node.findParent(NodeType.Declaration);
    if (decl && decl.getValue() && decl.getValue().encloses(node)) {
        return decl;
    }
    return null;
}
var Node$1 = /** @class */ (function () {
    function Node(offset, len, nodeType) {
        if (offset === void 0) { offset = -1; }
        if (len === void 0) { len = -1; }
        this.parent = null;
        this.offset = offset;
        this.length = len;
        if (nodeType) {
            this.nodeType = nodeType;
        }
    }
    Object.defineProperty(Node.prototype, "end", {
        get: function () { return this.offset + this.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "type", {
        get: function () {
            return this.nodeType || NodeType.Undefined;
        },
        set: function (type) {
            this.nodeType = type;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.getTextProvider = function () {
        var node = this;
        while (node && !node.textProvider) {
            node = node.parent;
        }
        if (node) {
            return node.textProvider;
        }
        return function () { return 'unknown'; };
    };
    Node.prototype.getText = function () {
        return this.getTextProvider()(this.offset, this.length);
    };
    Node.prototype.matches = function (str) {
        return this.length === str.length && this.getTextProvider()(this.offset, this.length) === str;
    };
    Node.prototype.startsWith = function (str) {
        return this.length >= str.length && this.getTextProvider()(this.offset, str.length) === str;
    };
    Node.prototype.endsWith = function (str) {
        return this.length >= str.length && this.getTextProvider()(this.end - str.length, str.length) === str;
    };
    Node.prototype.accept = function (visitor) {
        if (visitor(this) && this.children) {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.accept(visitor);
            }
        }
    };
    Node.prototype.acceptVisitor = function (visitor) {
        this.accept(visitor.visitNode.bind(visitor));
    };
    Node.prototype.adoptChild = function (node, index) {
        if (index === void 0) { index = -1; }
        if (node.parent && node.parent.children) {
            var idx = node.parent.children.indexOf(node);
            if (idx >= 0) {
                node.parent.children.splice(idx, 1);
            }
        }
        node.parent = this;
        var children = this.children;
        if (!children) {
            children = this.children = [];
        }
        if (index !== -1) {
            children.splice(index, 0, node);
        }
        else {
            children.push(node);
        }
        return node;
    };
    Node.prototype.attachTo = function (parent, index) {
        if (index === void 0) { index = -1; }
        if (parent) {
            parent.adoptChild(this, index);
        }
        return this;
    };
    Node.prototype.collectIssues = function (results) {
        if (this.issues) {
            results.push.apply(results, this.issues);
        }
    };
    Node.prototype.addIssue = function (issue) {
        if (!this.issues) {
            this.issues = [];
        }
        this.issues.push(issue);
    };
    Node.prototype.hasIssue = function (rule) {
        return this.issues && this.issues.some(function (i) { return i.getRule() === rule; });
    };
    Node.prototype.isErroneous = function (recursive) {
        if (recursive === void 0) { recursive = false; }
        if (this.issues && this.issues.length > 0) {
            return true;
        }
        return recursive && this.children && this.children.some(function (c) { return c.isErroneous(true); });
    };
    Node.prototype.setNode = function (field, node, index) {
        if (index === void 0) { index = -1; }
        if (node) {
            node.attachTo(this, index);
            this[field] = node;
            return true;
        }
        return false;
    };
    Node.prototype.addChild = function (node) {
        if (node) {
            if (!this.children) {
                this.children = [];
            }
            node.attachTo(this);
            this.updateOffsetAndLength(node);
            return true;
        }
        return false;
    };
    Node.prototype.updateOffsetAndLength = function (node) {
        if (node.offset < this.offset || this.offset === -1) {
            this.offset = node.offset;
        }
        var nodeEnd = node.end;
        if ((nodeEnd > this.end) || this.length === -1) {
            this.length = nodeEnd - this.offset;
        }
    };
    Node.prototype.hasChildren = function () {
        return this.children && this.children.length > 0;
    };
    Node.prototype.getChildren = function () {
        return this.children ? this.children.slice(0) : [];
    };
    Node.prototype.getChild = function (index) {
        if (this.children && index < this.children.length) {
            return this.children[index];
        }
        return null;
    };
    Node.prototype.addChildren = function (nodes) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            this.addChild(node);
        }
    };
    Node.prototype.findFirstChildBeforeOffset = function (offset) {
        if (this.children) {
            var current = null;
            for (var i = this.children.length - 1; i >= 0; i--) {
                // iterate until we find a child that has a start offset smaller than the input offset
                current = this.children[i];
                if (current.offset <= offset) {
                    return current;
                }
            }
        }
        return null;
    };
    Node.prototype.findChildAtOffset = function (offset, goDeep) {
        var current = this.findFirstChildBeforeOffset(offset);
        if (current && current.end >= offset) {
            if (goDeep) {
                return current.findChildAtOffset(offset, true) || current;
            }
            return current;
        }
        return null;
    };
    Node.prototype.encloses = function (candidate) {
        return this.offset <= candidate.offset && this.offset + this.length >= candidate.offset + candidate.length;
    };
    Node.prototype.getParent = function () {
        var result = this.parent;
        while (result instanceof Nodelist) {
            result = result.parent;
        }
        return result;
    };
    Node.prototype.findParent = function (type) {
        var result = this;
        while (result && result.type !== type) {
            result = result.parent;
        }
        return result;
    };
    Node.prototype.setData = function (key, value) {
        if (!this.options) {
            this.options = {};
        }
        this.options[key] = value;
    };
    Node.prototype.getData = function (key) {
        if (!this.options || !this.options.hasOwnProperty(key)) {
            return null;
        }
        return this.options[key];
    };
    return Node;
}());
var Nodelist = /** @class */ (function (_super) {
    __extends(Nodelist, _super);
    function Nodelist(parent, index) {
        if (index === void 0) { index = -1; }
        var _this = _super.call(this, -1, -1) || this;
        _this.attachTo(parent, index);
        _this.offset = -1;
        _this.length = -1;
        return _this;
    }
    return Nodelist;
}(Node$1));
var Identifier = /** @class */ (function (_super) {
    __extends(Identifier, _super);
    function Identifier(offset, length) {
        var _this = _super.call(this, offset, length) || this;
        _this.isCustomProperty = false;
        return _this;
    }
    Object.defineProperty(Identifier.prototype, "type", {
        get: function () {
            return NodeType.Identifier;
        },
        enumerable: true,
        configurable: true
    });
    Identifier.prototype.containsInterpolation = function () {
        return this.hasChildren();
    };
    return Identifier;
}(Node$1));
var Stylesheet = /** @class */ (function (_super) {
    __extends(Stylesheet, _super);
    function Stylesheet(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Stylesheet.prototype, "type", {
        get: function () {
            return NodeType.Stylesheet;
        },
        enumerable: true,
        configurable: true
    });
    Stylesheet.prototype.setName = function (value) {
        this.name = value;
    };
    return Stylesheet;
}(Node$1));
var Declarations = /** @class */ (function (_super) {
    __extends(Declarations, _super);
    function Declarations(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Declarations.prototype, "type", {
        get: function () {
            return NodeType.Declarations;
        },
        enumerable: true,
        configurable: true
    });
    return Declarations;
}(Node$1));
var BodyDeclaration = /** @class */ (function (_super) {
    __extends(BodyDeclaration, _super);
    function BodyDeclaration(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    BodyDeclaration.prototype.getDeclarations = function () {
        return this.declarations;
    };
    BodyDeclaration.prototype.setDeclarations = function (decls) {
        return this.setNode('declarations', decls);
    };
    return BodyDeclaration;
}(Node$1));
var RuleSet = /** @class */ (function (_super) {
    __extends(RuleSet, _super);
    function RuleSet(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(RuleSet.prototype, "type", {
        get: function () {
            return NodeType.Ruleset;
        },
        enumerable: true,
        configurable: true
    });
    RuleSet.prototype.getSelectors = function () {
        if (!this.selectors) {
            this.selectors = new Nodelist(this);
        }
        return this.selectors;
    };
    RuleSet.prototype.isNested = function () {
        return this.parent && this.parent.findParent(NodeType.Declarations) !== null;
    };
    return RuleSet;
}(BodyDeclaration));
var Selector = /** @class */ (function (_super) {
    __extends(Selector, _super);
    function Selector(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Selector.prototype, "type", {
        get: function () {
            return NodeType.Selector;
        },
        enumerable: true,
        configurable: true
    });
    return Selector;
}(Node$1));
var SimpleSelector = /** @class */ (function (_super) {
    __extends(SimpleSelector, _super);
    function SimpleSelector(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(SimpleSelector.prototype, "type", {
        get: function () {
            return NodeType.SimpleSelector;
        },
        enumerable: true,
        configurable: true
    });
    return SimpleSelector;
}(Node$1));
var AtApplyRule = /** @class */ (function (_super) {
    __extends(AtApplyRule, _super);
    function AtApplyRule(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(AtApplyRule.prototype, "type", {
        get: function () {
            return NodeType.AtApplyRule;
        },
        enumerable: true,
        configurable: true
    });
    AtApplyRule.prototype.setIdentifier = function (node) {
        return this.setNode('identifier', node, 0);
    };
    AtApplyRule.prototype.getIdentifier = function () {
        return this.identifier;
    };
    AtApplyRule.prototype.getName = function () {
        return this.identifier ? this.identifier.getText() : '';
    };
    return AtApplyRule;
}(Node$1));
var AbstractDeclaration = /** @class */ (function (_super) {
    __extends(AbstractDeclaration, _super);
    function AbstractDeclaration(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    return AbstractDeclaration;
}(Node$1));
var CustomPropertyDeclaration = /** @class */ (function (_super) {
    __extends(CustomPropertyDeclaration, _super);
    function CustomPropertyDeclaration(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(CustomPropertyDeclaration.prototype, "type", {
        get: function () {
            return NodeType.CustomPropertyDeclaration;
        },
        enumerable: true,
        configurable: true
    });
    CustomPropertyDeclaration.prototype.setProperty = function (node) {
        return this.setNode('property', node);
    };
    CustomPropertyDeclaration.prototype.getProperty = function () {
        return this.property;
    };
    CustomPropertyDeclaration.prototype.setValue = function (value) {
        return this.setNode('value', value);
    };
    CustomPropertyDeclaration.prototype.getValue = function () {
        return this.value;
    };
    CustomPropertyDeclaration.prototype.setPropertySet = function (value) {
        return this.setNode('propertySet', value);
    };
    CustomPropertyDeclaration.prototype.getPropertySet = function () {
        return this.propertySet;
    };
    return CustomPropertyDeclaration;
}(AbstractDeclaration));
var CustomPropertySet = /** @class */ (function (_super) {
    __extends(CustomPropertySet, _super);
    function CustomPropertySet(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(CustomPropertySet.prototype, "type", {
        get: function () {
            return NodeType.CustomPropertySet;
        },
        enumerable: true,
        configurable: true
    });
    return CustomPropertySet;
}(BodyDeclaration));
var Declaration = /** @class */ (function (_super) {
    __extends(Declaration, _super);
    function Declaration(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Declaration.prototype, "type", {
        get: function () {
            return NodeType.Declaration;
        },
        enumerable: true,
        configurable: true
    });
    Declaration.prototype.setProperty = function (node) {
        return this.setNode('property', node);
    };
    Declaration.prototype.getProperty = function () {
        return this.property;
    };
    Declaration.prototype.getFullPropertyName = function () {
        var propertyName = this.property ? this.property.getName() : 'unknown';
        if (this.parent instanceof Declarations && this.parent.getParent() instanceof NestedProperties) {
            var parentDecl = this.parent.getParent().getParent();
            if (parentDecl instanceof Declaration) {
                return parentDecl.getFullPropertyName() + propertyName;
            }
        }
        return propertyName;
    };
    Declaration.prototype.getNonPrefixedPropertyName = function () {
        var propertyName = this.getFullPropertyName();
        if (propertyName && propertyName.charAt(0) === '-') {
            var vendorPrefixEnd = propertyName.indexOf('-', 1);
            if (vendorPrefixEnd !== -1) {
                return propertyName.substring(vendorPrefixEnd + 1);
            }
        }
        return propertyName;
    };
    Declaration.prototype.setValue = function (value) {
        return this.setNode('value', value);
    };
    Declaration.prototype.getValue = function () {
        return this.value;
    };
    Declaration.prototype.setNestedProperties = function (value) {
        return this.setNode('nestedProprties', value);
    };
    Declaration.prototype.getNestedProperties = function () {
        return this.nestedProprties;
    };
    return Declaration;
}(AbstractDeclaration));
var Property = /** @class */ (function (_super) {
    __extends(Property, _super);
    function Property(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Property.prototype, "type", {
        get: function () {
            return NodeType.Property;
        },
        enumerable: true,
        configurable: true
    });
    Property.prototype.setIdentifier = function (value) {
        return this.setNode('identifier', value);
    };
    Property.prototype.getIdentifier = function () {
        return this.identifier;
    };
    Property.prototype.getName = function () {
        return this.getText();
    };
    Property.prototype.isCustomProperty = function () {
        return this.identifier.isCustomProperty;
    };
    return Property;
}(Node$1));
var Invocation = /** @class */ (function (_super) {
    __extends(Invocation, _super);
    function Invocation(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Invocation.prototype, "type", {
        get: function () {
            return NodeType.Invocation;
        },
        enumerable: true,
        configurable: true
    });
    Invocation.prototype.getArguments = function () {
        if (!this.arguments) {
            this.arguments = new Nodelist(this);
        }
        return this.arguments;
    };
    return Invocation;
}(Node$1));
var Function$1 = /** @class */ (function (_super) {
    __extends(Function, _super);
    function Function(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Function.prototype, "type", {
        get: function () {
            return NodeType.Function;
        },
        enumerable: true,
        configurable: true
    });
    Function.prototype.setIdentifier = function (node) {
        return this.setNode('identifier', node, 0);
    };
    Function.prototype.getIdentifier = function () {
        return this.identifier;
    };
    Function.prototype.getName = function () {
        return this.identifier ? this.identifier.getText() : '';
    };
    return Function;
}(Invocation));
var FunctionParameter = /** @class */ (function (_super) {
    __extends(FunctionParameter, _super);
    function FunctionParameter(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(FunctionParameter.prototype, "type", {
        get: function () {
            return NodeType.FunctionParameter;
        },
        enumerable: true,
        configurable: true
    });
    FunctionParameter.prototype.setIdentifier = function (node) {
        return this.setNode('identifier', node, 0);
    };
    FunctionParameter.prototype.getIdentifier = function () {
        return this.identifier;
    };
    FunctionParameter.prototype.getName = function () {
        return this.identifier ? this.identifier.getText() : '';
    };
    FunctionParameter.prototype.setDefaultValue = function (node) {
        return this.setNode('defaultValue', node, 0);
    };
    FunctionParameter.prototype.getDefaultValue = function () {
        return this.defaultValue;
    };
    return FunctionParameter;
}(Node$1));
var FunctionArgument = /** @class */ (function (_super) {
    __extends(FunctionArgument, _super);
    function FunctionArgument(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(FunctionArgument.prototype, "type", {
        get: function () {
            return NodeType.FunctionArgument;
        },
        enumerable: true,
        configurable: true
    });
    FunctionArgument.prototype.setIdentifier = function (node) {
        return this.setNode('identifier', node, 0);
    };
    FunctionArgument.prototype.getIdentifier = function () {
        return this.identifier;
    };
    FunctionArgument.prototype.getName = function () {
        return this.identifier ? this.identifier.getText() : '';
    };
    FunctionArgument.prototype.setValue = function (node) {
        return this.setNode('value', node, 0);
    };
    FunctionArgument.prototype.getValue = function () {
        return this.value;
    };
    return FunctionArgument;
}(Node$1));
var IfStatement = /** @class */ (function (_super) {
    __extends(IfStatement, _super);
    function IfStatement(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(IfStatement.prototype, "type", {
        get: function () {
            return NodeType.If;
        },
        enumerable: true,
        configurable: true
    });
    IfStatement.prototype.setExpression = function (node) {
        return this.setNode('expression', node, 0);
    };
    IfStatement.prototype.setElseClause = function (elseClause) {
        return this.setNode('elseClause', elseClause);
    };
    return IfStatement;
}(BodyDeclaration));
var ForStatement = /** @class */ (function (_super) {
    __extends(ForStatement, _super);
    function ForStatement(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(ForStatement.prototype, "type", {
        get: function () {
            return NodeType.For;
        },
        enumerable: true,
        configurable: true
    });
    ForStatement.prototype.setVariable = function (node) {
        return this.setNode('variable', node, 0);
    };
    return ForStatement;
}(BodyDeclaration));
var EachStatement = /** @class */ (function (_super) {
    __extends(EachStatement, _super);
    function EachStatement(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(EachStatement.prototype, "type", {
        get: function () {
            return NodeType.Each;
        },
        enumerable: true,
        configurable: true
    });
    EachStatement.prototype.getVariables = function () {
        if (!this.variables) {
            this.variables = new Nodelist(this);
        }
        return this.variables;
    };
    return EachStatement;
}(BodyDeclaration));
var WhileStatement = /** @class */ (function (_super) {
    __extends(WhileStatement, _super);
    function WhileStatement(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(WhileStatement.prototype, "type", {
        get: function () {
            return NodeType.While;
        },
        enumerable: true,
        configurable: true
    });
    return WhileStatement;
}(BodyDeclaration));
var ElseStatement = /** @class */ (function (_super) {
    __extends(ElseStatement, _super);
    function ElseStatement(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(ElseStatement.prototype, "type", {
        get: function () {
            return NodeType.Else;
        },
        enumerable: true,
        configurable: true
    });
    return ElseStatement;
}(BodyDeclaration));
var FunctionDeclaration = /** @class */ (function (_super) {
    __extends(FunctionDeclaration, _super);
    function FunctionDeclaration(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(FunctionDeclaration.prototype, "type", {
        get: function () {
            return NodeType.FunctionDeclaration;
        },
        enumerable: true,
        configurable: true
    });
    FunctionDeclaration.prototype.setIdentifier = function (node) {
        return this.setNode('identifier', node, 0);
    };
    FunctionDeclaration.prototype.getIdentifier = function () {
        return this.identifier;
    };
    FunctionDeclaration.prototype.getName = function () {
        return this.identifier ? this.identifier.getText() : '';
    };
    FunctionDeclaration.prototype.getParameters = function () {
        if (!this.parameters) {
            this.parameters = new Nodelist(this);
        }
        return this.parameters;
    };
    return FunctionDeclaration;
}(BodyDeclaration));
var ViewPort = /** @class */ (function (_super) {
    __extends(ViewPort, _super);
    function ViewPort(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(ViewPort.prototype, "type", {
        get: function () {
            return NodeType.ViewPort;
        },
        enumerable: true,
        configurable: true
    });
    return ViewPort;
}(BodyDeclaration));
var FontFace = /** @class */ (function (_super) {
    __extends(FontFace, _super);
    function FontFace(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(FontFace.prototype, "type", {
        get: function () {
            return NodeType.FontFace;
        },
        enumerable: true,
        configurable: true
    });
    return FontFace;
}(BodyDeclaration));
var NestedProperties = /** @class */ (function (_super) {
    __extends(NestedProperties, _super);
    function NestedProperties(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(NestedProperties.prototype, "type", {
        get: function () {
            return NodeType.NestedProperties;
        },
        enumerable: true,
        configurable: true
    });
    return NestedProperties;
}(BodyDeclaration));
var Keyframe = /** @class */ (function (_super) {
    __extends(Keyframe, _super);
    function Keyframe(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Keyframe.prototype, "type", {
        get: function () {
            return NodeType.Keyframe;
        },
        enumerable: true,
        configurable: true
    });
    Keyframe.prototype.setKeyword = function (keyword) {
        return this.setNode('keyword', keyword, 0);
    };
    Keyframe.prototype.getKeyword = function () {
        return this.keyword;
    };
    Keyframe.prototype.setIdentifier = function (node) {
        return this.setNode('identifier', node, 0);
    };
    Keyframe.prototype.getIdentifier = function () {
        return this.identifier;
    };
    Keyframe.prototype.getName = function () {
        return this.identifier ? this.identifier.getText() : '';
    };
    return Keyframe;
}(BodyDeclaration));
var KeyframeSelector = /** @class */ (function (_super) {
    __extends(KeyframeSelector, _super);
    function KeyframeSelector(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(KeyframeSelector.prototype, "type", {
        get: function () {
            return NodeType.KeyframeSelector;
        },
        enumerable: true,
        configurable: true
    });
    return KeyframeSelector;
}(BodyDeclaration));
var Import = /** @class */ (function (_super) {
    __extends(Import, _super);
    function Import(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Import.prototype, "type", {
        get: function () {
            return NodeType.Import;
        },
        enumerable: true,
        configurable: true
    });
    Import.prototype.setMedialist = function (node) {
        if (node) {
            node.attachTo(this);
            this.medialist = node;
            return true;
        }
        return false;
    };
    return Import;
}(Node$1));
var Namespace = /** @class */ (function (_super) {
    __extends(Namespace, _super);
    function Namespace(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Namespace.prototype, "type", {
        get: function () {
            return NodeType.Namespace;
        },
        enumerable: true,
        configurable: true
    });
    return Namespace;
}(Node$1));
var Media = /** @class */ (function (_super) {
    __extends(Media, _super);
    function Media(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Media.prototype, "type", {
        get: function () {
            return NodeType.Media;
        },
        enumerable: true,
        configurable: true
    });
    return Media;
}(BodyDeclaration));
var Supports = /** @class */ (function (_super) {
    __extends(Supports, _super);
    function Supports(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Supports.prototype, "type", {
        get: function () {
            return NodeType.Supports;
        },
        enumerable: true,
        configurable: true
    });
    return Supports;
}(BodyDeclaration));
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Document.prototype, "type", {
        get: function () {
            return NodeType.Document;
        },
        enumerable: true,
        configurable: true
    });
    return Document;
}(BodyDeclaration));
var Medialist = /** @class */ (function (_super) {
    __extends(Medialist, _super);
    function Medialist(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Medialist.prototype.getMediums = function () {
        if (!this.mediums) {
            this.mediums = new Nodelist(this);
        }
        return this.mediums;
    };
    return Medialist;
}(Node$1));
var MediaQuery = /** @class */ (function (_super) {
    __extends(MediaQuery, _super);
    function MediaQuery(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(MediaQuery.prototype, "type", {
        get: function () {
            return NodeType.MediaQuery;
        },
        enumerable: true,
        configurable: true
    });
    return MediaQuery;
}(Node$1));
var SupportsCondition = /** @class */ (function (_super) {
    __extends(SupportsCondition, _super);
    function SupportsCondition(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(SupportsCondition.prototype, "type", {
        get: function () {
            return NodeType.SupportsCondition;
        },
        enumerable: true,
        configurable: true
    });
    return SupportsCondition;
}(Node$1));
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Page.prototype, "type", {
        get: function () {
            return NodeType.Page;
        },
        enumerable: true,
        configurable: true
    });
    return Page;
}(BodyDeclaration));
var PageBoxMarginBox = /** @class */ (function (_super) {
    __extends(PageBoxMarginBox, _super);
    function PageBoxMarginBox(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(PageBoxMarginBox.prototype, "type", {
        get: function () {
            return NodeType.PageBoxMarginBox;
        },
        enumerable: true,
        configurable: true
    });
    return PageBoxMarginBox;
}(BodyDeclaration));
var Expression = /** @class */ (function (_super) {
    __extends(Expression, _super);
    function Expression(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Expression.prototype, "type", {
        get: function () {
            return NodeType.Expression;
        },
        enumerable: true,
        configurable: true
    });
    return Expression;
}(Node$1));
var BinaryExpression = /** @class */ (function (_super) {
    __extends(BinaryExpression, _super);
    function BinaryExpression(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(BinaryExpression.prototype, "type", {
        get: function () {
            return NodeType.BinaryExpression;
        },
        enumerable: true,
        configurable: true
    });
    BinaryExpression.prototype.setLeft = function (left) {
        return this.setNode('left', left);
    };
    BinaryExpression.prototype.getLeft = function () {
        return this.left;
    };
    BinaryExpression.prototype.setRight = function (right) {
        return this.setNode('right', right);
    };
    BinaryExpression.prototype.getRight = function () {
        return this.right;
    };
    BinaryExpression.prototype.setOperator = function (value) {
        return this.setNode('operator', value);
    };
    BinaryExpression.prototype.getOperator = function () {
        return this.operator;
    };
    return BinaryExpression;
}(Node$1));
var Term = /** @class */ (function (_super) {
    __extends(Term, _super);
    function Term(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Term.prototype, "type", {
        get: function () {
            return NodeType.Term;
        },
        enumerable: true,
        configurable: true
    });
    Term.prototype.setOperator = function (value) {
        return this.setNode('operator', value);
    };
    Term.prototype.getOperator = function () {
        return this.operator;
    };
    Term.prototype.setExpression = function (value) {
        return this.setNode('expression', value);
    };
    Term.prototype.getExpression = function () {
        return this.expression;
    };
    return Term;
}(Node$1));
var AttributeSelector = /** @class */ (function (_super) {
    __extends(AttributeSelector, _super);
    function AttributeSelector(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(AttributeSelector.prototype, "type", {
        get: function () {
            return NodeType.AttributeSelector;
        },
        enumerable: true,
        configurable: true
    });
    AttributeSelector.prototype.setExpression = function (value) {
        return this.setNode('expression', value);
    };
    AttributeSelector.prototype.getExpression = function () {
        return this.expression;
    };
    AttributeSelector.prototype.setNamespacePrefix = function (value) {
        return this.setNode('namespacePrefix', value);
    };
    AttributeSelector.prototype.getNamespacePrefix = function () {
        return this.namespacePrefix;
    };
    return AttributeSelector;
}(Node$1));
var Operator = /** @class */ (function (_super) {
    __extends(Operator, _super);
    function Operator(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Operator.prototype, "type", {
        get: function () {
            return NodeType.Operator;
        },
        enumerable: true,
        configurable: true
    });
    return Operator;
}(Node$1));
var HexColorValue = /** @class */ (function (_super) {
    __extends(HexColorValue, _super);
    function HexColorValue(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(HexColorValue.prototype, "type", {
        get: function () {
            return NodeType.HexColorValue;
        },
        enumerable: true,
        configurable: true
    });
    return HexColorValue;
}(Node$1));
var NumericValue = /** @class */ (function (_super) {
    __extends(NumericValue, _super);
    function NumericValue(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(NumericValue.prototype, "type", {
        get: function () {
            return NodeType.NumericValue;
        },
        enumerable: true,
        configurable: true
    });
    NumericValue.prototype.getValue = function () {
        var raw = this.getText();
        var unitIdx = 0, code, _dot = '.'.charCodeAt(0), _0 = '0'.charCodeAt(0), _9 = '9'.charCodeAt(0);
        for (var i = 0, len = raw.length; i < len; i++) {
            code = raw.charCodeAt(i);
            if (!(_0 <= code && code <= _9 || code === _dot)) {
                break;
            }
            unitIdx += 1;
        }
        return {
            value: raw.substring(0, unitIdx),
            unit: unitIdx < raw.length ? raw.substring(unitIdx) : undefined
        };
    };
    return NumericValue;
}(Node$1));
var VariableDeclaration = /** @class */ (function (_super) {
    __extends(VariableDeclaration, _super);
    function VariableDeclaration(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(VariableDeclaration.prototype, "type", {
        get: function () {
            return NodeType.VariableDeclaration;
        },
        enumerable: true,
        configurable: true
    });
    VariableDeclaration.prototype.setVariable = function (node) {
        if (node) {
            node.attachTo(this);
            this.variable = node;
            return true;
        }
        return false;
    };
    VariableDeclaration.prototype.getVariable = function () {
        return this.variable;
    };
    VariableDeclaration.prototype.getName = function () {
        return this.variable ? this.variable.getName() : '';
    };
    VariableDeclaration.prototype.setValue = function (node) {
        if (node) {
            node.attachTo(this);
            this.value = node;
            return true;
        }
        return false;
    };
    VariableDeclaration.prototype.getValue = function () {
        return this.value;
    };
    return VariableDeclaration;
}(AbstractDeclaration));
var Interpolation = /** @class */ (function (_super) {
    __extends(Interpolation, _super);
    function Interpolation(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Interpolation.prototype, "type", {
        get: function () {
            return NodeType.Interpolation;
        },
        enumerable: true,
        configurable: true
    });
    return Interpolation;
}(Node$1));
var Variable = /** @class */ (function (_super) {
    __extends(Variable, _super);
    function Variable(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(Variable.prototype, "type", {
        get: function () {
            return NodeType.VariableName;
        },
        enumerable: true,
        configurable: true
    });
    Variable.prototype.getName = function () {
        return this.getText();
    };
    return Variable;
}(Node$1));
var ExtendsReference = /** @class */ (function (_super) {
    __extends(ExtendsReference, _super);
    function ExtendsReference(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(ExtendsReference.prototype, "type", {
        get: function () {
            return NodeType.ExtendsReference;
        },
        enumerable: true,
        configurable: true
    });
    ExtendsReference.prototype.getSelectors = function () {
        if (!this.selectors) {
            this.selectors = new Nodelist(this);
        }
        return this.selectors;
    };
    return ExtendsReference;
}(Node$1));
var MixinReference = /** @class */ (function (_super) {
    __extends(MixinReference, _super);
    function MixinReference(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(MixinReference.prototype, "type", {
        get: function () {
            return NodeType.MixinReference;
        },
        enumerable: true,
        configurable: true
    });
    MixinReference.prototype.getNamespaces = function () {
        if (!this.namespaces) {
            this.namespaces = new Nodelist(this);
        }
        return this.namespaces;
    };
    MixinReference.prototype.setIdentifier = function (node) {
        return this.setNode('identifier', node, 0);
    };
    MixinReference.prototype.getIdentifier = function () {
        return this.identifier;
    };
    MixinReference.prototype.getName = function () {
        return this.identifier ? this.identifier.getText() : '';
    };
    MixinReference.prototype.getArguments = function () {
        if (!this.arguments) {
            this.arguments = new Nodelist(this);
        }
        return this.arguments;
    };
    MixinReference.prototype.setContent = function (node) {
        return this.setNode('content', node);
    };
    MixinReference.prototype.getContent = function () {
        return this.content;
    };
    return MixinReference;
}(Node$1));
var MixinDeclaration = /** @class */ (function (_super) {
    __extends(MixinDeclaration, _super);
    function MixinDeclaration(offset, length) {
        return _super.call(this, offset, length) || this;
    }
    Object.defineProperty(MixinDeclaration.prototype, "type", {
        get: function () {
            return NodeType.MixinDeclaration;
        },
        enumerable: true,
        configurable: true
    });
    MixinDeclaration.prototype.setIdentifier = function (node) {
        return this.setNode('identifier', node, 0);
    };
    MixinDeclaration.prototype.getIdentifier = function () {
        return this.identifier;
    };
    MixinDeclaration.prototype.getName = function () {
        return this.identifier ? this.identifier.getText() : '';
    };
    MixinDeclaration.prototype.getParameters = function () {
        if (!this.parameters) {
            this.parameters = new Nodelist(this);
        }
        return this.parameters;
    };
    MixinDeclaration.prototype.setGuard = function (node) {
        if (node) {
            node.attachTo(this);
            this.guard = node;
        }
        return false;
    };
    return MixinDeclaration;
}(BodyDeclaration));
var LessGuard = /** @class */ (function (_super) {
    __extends(LessGuard, _super);
    function LessGuard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LessGuard.prototype.getConditions = function () {
        if (!this.conditions) {
            this.conditions = new Nodelist(this);
        }
        return this.conditions;
    };
    return LessGuard;
}(Node$1));
var GuardCondition = /** @class */ (function (_super) {
    __extends(GuardCondition, _super);
    function GuardCondition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GuardCondition.prototype.setVariable = function (node) {
        return this.setNode('variable', node);
    };
    return GuardCondition;
}(Node$1));
var Level;
(function (Level) {
    Level[Level["Ignore"] = 1] = "Ignore";
    Level[Level["Warning"] = 2] = "Warning";
    Level[Level["Error"] = 4] = "Error";
})(Level || (Level = {}));
var Marker = /** @class */ (function () {
    function Marker(node, rule, level, message, offset, length) {
        if (offset === void 0) { offset = node.offset; }
        if (length === void 0) { length = node.length; }
        this.node = node;
        this.rule = rule;
        this.level = level;
        this.message = message || rule.message;
        this.offset = offset;
        this.length = length;
    }
    Marker.prototype.getRule = function () {
        return this.rule;
    };
    Marker.prototype.getLevel = function () {
        return this.level;
    };
    Marker.prototype.getOffset = function () {
        return this.offset;
    };
    Marker.prototype.getLength = function () {
        return this.length;
    };
    Marker.prototype.getNode = function () {
        return this.node;
    };
    Marker.prototype.getMessage = function () {
        return this.message;
    };
    return Marker;
}());
/*
export class DefaultVisitor implements IVisitor {

    public visitNode(node:Node):boolean {
        switch (node.type) {
            case NodeType.Stylesheet:
                return this.visitStylesheet(<Stylesheet> node);
            case NodeType.FontFace:
                return this.visitFontFace(<FontFace> node);
            case NodeType.Ruleset:
                return this.visitRuleSet(<RuleSet> node);
            case NodeType.Selector:
                return this.visitSelector(<Selector> node);
            case NodeType.SimpleSelector:
                return this.visitSimpleSelector(<SimpleSelector> node);
            case NodeType.Declaration:
                return this.visitDeclaration(<Declaration> node);
            case NodeType.Function:
                return this.visitFunction(<Function> node);
            case NodeType.FunctionDeclaration:
                return this.visitFunctionDeclaration(<FunctionDeclaration> node);
            case NodeType.FunctionParameter:
                return this.visitFunctionParameter(<FunctionParameter> node);
            case NodeType.FunctionArgument:
                return this.visitFunctionArgument(<FunctionArgument> node);
            case NodeType.Term:
                return this.visitTerm(<Term> node);
            case NodeType.Declaration:
                return this.visitExpression(<Expression> node);
            case NodeType.NumericValue:
                return this.visitNumericValue(<NumericValue> node);
            case NodeType.Page:
                return this.visitPage(<Page> node);
            case NodeType.PageBoxMarginBox:
                return this.visitPageBoxMarginBox(<PageBoxMarginBox> node);
            case NodeType.Property:
                return this.visitProperty(<Property> node);
            case NodeType.NumericValue:
                return this.visitNodelist(<Nodelist> node);
            case NodeType.Import:
                return this.visitImport(<Import> node);
            case NodeType.Namespace:
                return this.visitNamespace(<Namespace> node);
            case NodeType.Keyframe:
                return this.visitKeyframe(<Keyframe> node);
            case NodeType.KeyframeSelector:
                return this.visitKeyframeSelector(<KeyframeSelector> node);
            case NodeType.MixinDeclaration:
                return this.visitMixinDeclaration(<MixinDeclaration> node);
            case NodeType.MixinReference:
                return this.visitMixinReference(<MixinReference> node);
            case NodeType.Variable:
                return this.visitVariable(<Variable> node);
            case NodeType.VariableDeclaration:
                return this.visitVariableDeclaration(<VariableDeclaration> node);
        }
        return this.visitUnknownNode(node);
    }

    public visitFontFace(node:FontFace):boolean {
        return true;
    }

    public visitKeyframe(node:Keyframe):boolean {
        return true;
    }

    public visitKeyframeSelector(node:KeyframeSelector):boolean {
        return true;
    }

    public visitStylesheet(node:Stylesheet):boolean {
        return true;
    }

    public visitProperty(Node:Property):boolean {
        return true;
    }

    public visitRuleSet(node:RuleSet):boolean {
        return true;
    }

    public visitSelector(node:Selector):boolean {
        return true;
    }

    public visitSimpleSelector(node:SimpleSelector):boolean {
        return true;
    }

    public visitDeclaration(node:Declaration):boolean {
        return true;
    }

    public visitFunction(node:Function):boolean {
        return true;
    }

    public visitFunctionDeclaration(node:FunctionDeclaration):boolean {
        return true;
    }

    public visitInvocation(node:Invocation):boolean {
        return true;
    }

    public visitTerm(node:Term):boolean {
        return true;
    }

    public visitImport(node:Import):boolean {
        return true;
    }

    public visitNamespace(node:Namespace):boolean {
        return true;
    }

    public visitExpression(node:Expression):boolean {
        return true;
    }

    public visitNumericValue(node:NumericValue):boolean {
        return true;
    }

    public visitPage(node:Page):boolean {
        return true;
    }

    public visitPageBoxMarginBox(node:PageBoxMarginBox):boolean {
        return true;
    }

    public visitNodelist(node:Nodelist):boolean {
        return true;
    }

    public visitVariableDeclaration(node:VariableDeclaration):boolean {
        return true;
    }

    public visitVariable(node:Variable):boolean {
        return true;
    }

    public visitMixinDeclaration(node:MixinDeclaration):boolean {
        return true;
    }

    public visitMixinReference(node:MixinReference):boolean {
        return true;
    }

    public visitUnknownNode(node:Node):boolean {
        return true;
    }
}
*/
var ParseErrorCollector = /** @class */ (function () {
    function ParseErrorCollector() {
        this.entries = [];
    }
    ParseErrorCollector.entries = function (node) {
        var visitor = new ParseErrorCollector();
        node.acceptVisitor(visitor);
        return visitor.entries;
    };
    ParseErrorCollector.prototype.visitNode = function (node) {
        if (node.isErroneous()) {
            node.collectIssues(this.entries);
        }
        return true;
    };
    return ParseErrorCollector;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function format(message, args) {
    var result;
    if (args.length === 0) {
        result = message;
    }
    else {
        result = message.replace(/\{(\d+)\}/g, function (match, rest) {
            var index = rest[0];
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    }
    return result;
}
function localize(key, message) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return format(message, args);
}
function loadMessageBundle(file) {
    return localize;
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var localize$1 = loadMessageBundle();
var CSSIssueType = /** @class */ (function () {
    function CSSIssueType(id, message) {
        this.id = id;
        this.message = message;
    }
    return CSSIssueType;
}());
var ParseError = {
    NumberExpected: new CSSIssueType('css-numberexpected', localize$1('expected.number', "number expected")),
    ConditionExpected: new CSSIssueType('css-conditionexpected', localize$1('expected.condt', "condition expected")),
    RuleOrSelectorExpected: new CSSIssueType('css-ruleorselectorexpected', localize$1('expected.ruleorselector', "at-rule or selector expected")),
    DotExpected: new CSSIssueType('css-dotexpected', localize$1('expected.dot', "dot expected")),
    ColonExpected: new CSSIssueType('css-colonexpected', localize$1('expected.colon', "colon expected")),
    SemiColonExpected: new CSSIssueType('css-semicolonexpected', localize$1('expected.semicolon', "semi-colon expected")),
    TermExpected: new CSSIssueType('css-termexpected', localize$1('expected.term', "term expected")),
    ExpressionExpected: new CSSIssueType('css-expressionexpected', localize$1('expected.expression', "expression expected")),
    OperatorExpected: new CSSIssueType('css-operatorexpected', localize$1('expected.operator', "operator expected")),
    IdentifierExpected: new CSSIssueType('css-identifierexpected', localize$1('expected.ident', "identifier expected")),
    PercentageExpected: new CSSIssueType('css-percentageexpected', localize$1('expected.percentage', "percentage expected")),
    URIOrStringExpected: new CSSIssueType('css-uriorstringexpected', localize$1('expected.uriorstring', "uri or string expected")),
    URIExpected: new CSSIssueType('css-uriexpected', localize$1('expected.uri', "URI expected")),
    VariableNameExpected: new CSSIssueType('css-varnameexpected', localize$1('expected.varname', "variable name expected")),
    VariableValueExpected: new CSSIssueType('css-varvalueexpected', localize$1('expected.varvalue', "variable value expected")),
    PropertyValueExpected: new CSSIssueType('css-propertyvalueexpected', localize$1('expected.propvalue', "property value expected")),
    LeftCurlyExpected: new CSSIssueType('css-lcurlyexpected', localize$1('expected.lcurly', "{ expected")),
    RightCurlyExpected: new CSSIssueType('css-rcurlyexpected', localize$1('expected.rcurly', "} expected")),
    LeftSquareBracketExpected: new CSSIssueType('css-rbracketexpected', localize$1('expected.lsquare', "[ expected")),
    RightSquareBracketExpected: new CSSIssueType('css-lbracketexpected', localize$1('expected.rsquare', "] expected")),
    LeftParenthesisExpected: new CSSIssueType('css-lparentexpected', localize$1('expected.lparen', "( expected")),
    RightParenthesisExpected: new CSSIssueType('css-rparentexpected', localize$1('expected.rparent', ") expected")),
    CommaExpected: new CSSIssueType('css-commaexpected', localize$1('expected.comma', "comma expected")),
    PageDirectiveOrDeclarationExpected: new CSSIssueType('css-pagedirordeclexpected', localize$1('expected.pagedirordecl', "page directive or declaraton expected")),
    UnknownAtRule: new CSSIssueType('css-unknownatrule', localize$1('unknown.atrule', "at-rule unknown")),
    UnknownKeyword: new CSSIssueType('css-unknownkeyword', localize$1('unknown.keyword', "unknown keyword")),
    SelectorExpected: new CSSIssueType('css-selectorexpected', localize$1('expected.selector', "selector expected")),
    StringLiteralExpected: new CSSIssueType('css-stringliteralexpected', localize$1('expected.stringliteral', "string literal expected")),
    WhitespaceExpected: new CSSIssueType('css-whitespaceexpected', localize$1('expected.whitespace', "whitespace expected")),
    MediaQueryExpected: new CSSIssueType('css-mediaqueryexpected', localize$1('expected.mediaquery', "media query expected"))
};

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// file generated from css-schema.xml using css-exclude_generate_browserjs.js
var data = {
    "css": {
        "atdirectives": [
            {
                name: "@charset",
                desc: "Defines character set of the document."
            },
            {
                name: "@counter-style",
                desc: "Defines a custom counter style.",
                browsers: "FF33"
            },
            {
                name: "@font-face",
                desc: "Allows for linking to fonts that are automatically activated when needed. This permits authors to work around the limitation of 'web-safe' fonts, allowing for consistent rendering independent of the fonts available in a given user's environment."
            },
            {
                name: "@font-feature-values",
                desc: "Defines named values for the indices used to select alternate glyphs for a given font family.",
                browsers: "FF34"
            },
            {
                name: "@import",
                desc: "Includes content of another file."
            },
            {
                name: "@keyframes",
                desc: "Defines set of animation key frames.",
                browsers: "E,C43,FF16,IE10,O30,S9"
            },
            {
                name: "@media",
                desc: "Defines a stylesheet for a particular media type."
            },
            {
                name: "@-moz-document",
                desc: "Gecko-specific at-rule that restricts the style rules contained within it based on the URL of the document.",
                browsers: "FF1.8"
            },
            {
                name: "@-moz-keyframes",
                desc: "Defines set of animation key frames.",
                browsers: "FF5"
            },
            {
                name: "@-ms-viewport",
                desc: "Specifies the size, zoom factor, and orientation of the viewport.",
                browsers: "E,IE10"
            },
            {
                name: "@namespace",
                desc: "Declares a prefix and associates it with a namespace name.",
                browsers: "E,C,FF1,IE9,O8,S1"
            },
            {
                name: "@-o-keyframes",
                desc: "Defines set of animation key frames.",
                browsers: "O12"
            },
            {
                name: "@-o-viewport",
                desc: "Specifies the size, zoom factor, and orientation of the viewport.",
                browsers: "O11"
            },
            {
                name: "@page",
                desc: "Directive defines various page parameters."
            },
            {
                name: "@supports",
                desc: "A conditional group rule whose condition tests whether the user agent supports CSS property:value pairs.",
                browsers: "E,C28,FF22,O12.1,S9"
            },
            {
                name: "@-webkit-keyframes",
                desc: "Defines set of animation key frames.",
                browsers: "C,S4"
            }
        ],
        "pseudoclasses": [
            {
                name: ":active",
                desc: "Applies while an element is being activated by the user. For example, between the times the user presses the mouse button and releases it."
            },
            {
                name: ":any-link",
                desc: "Represents an element that acts as the source anchor of a hyperlink. Applies to both visited and unvisited links.",
                browsers: "S9"
            },
            {
                name: ":checked",
                desc: "Radio and checkbox elements can be toggled by the user. Some menu items are 'checked' when the user selects them. When such elements are toggled 'on' the :checked pseudo-class applies.",
                browsers: "E,C,FF1,IE9,O9,S3.13"
            },
            {
                name: ":corner-present",
                desc: "Non-standard. Indicates whether or not a scrollbar corner is present.",
                browsers: "C,S5"
            },
            {
                name: ":decrement",
                desc: "Non-standard. Applies to buttons and track pieces. Indicates whether or not the button or track piece will decrement the view’s position when used.",
                browsers: "C,S5"
            },
            {
                name: ":default",
                desc: "Applies to the one or more UI elements that are the default among a set of similar elements. Typically applies to context menu items, buttons, and select lists/menus.",
                browsers: "C,FF3,O10,S5"
            },
            {
                name: ":disabled",
                desc: "Represents user interface elements that are in a disabled state; such elements have a corresponding enabled state.",
                browsers: "E,C,FF1.5,IE9,O9,S3.1"
            },
            {
                name: ":double-button",
                desc: "Non-standard. Applies to buttons and track pieces. Applies when both buttons are displayed together at the same end of the scrollbar.",
                browsers: "C,S5"
            },
            {
                name: ":empty",
                desc: "Represents an element that has no children at all.",
                browsers: "E,C,FF1.5,IE9,O9,S3.1"
            },
            {
                name: ":enabled",
                desc: "Represents user interface elements that are in an enabled state; such elements have a corresponding disabled state.",
                browsers: "E,C,FF1.5,IE9,O9,S3.1"
            },
            {
                name: ":end",
                desc: "Non-standard. Applies to buttons and track pieces. Indicates whether the object is placed after the thumb.",
                browsers: "C,S5"
            },
            {
                name: ":first",
                desc: "When printing double-sided documents, the page boxes on left and right pages may be different. This can be expressed through CSS pseudo-classes defined in the  page context."
            },
            {
                name: ":first-child",
                desc: "Same as :nth-child(1). Represents an element that is the first child of some other element.",
                browsers: "E,C,FF3,IE7,O9.5,S3.1"
            },
            {
                name: ":first-of-type",
                desc: "Same as :nth-of-type(1). Represents an element that is the first sibling of its type in the list of children of its parent element.",
                browsers: "E,C,FF3.5,IE9,O9.5,S3.2"
            },
            {
                name: ":focus",
                desc: "Applies while an element has the focus (accepts keyboard or mouse events, or other forms of input)."
            },
            {
                name: ":fullscreen",
                desc: "Matches any element that has its fullscreen flag set.",
                browsers: "E"
            },
            {
                name: ":future",
                desc: "Represents any element that is defined to occur entirely after a :current element.",
                browsers: "C,O16,S6"
            },
            {
                name: ":horizontal",
                desc: "Non-standard. Applies to any scrollbar pieces that have a horizontal orientation.",
                browsers: "C,S5"
            },
            {
                name: ":host",
                desc: "When evaluated in the context of a shadow tree, matches the shadow tree’s host element.",
                browsers: "C35,O22"
            },
            {
                name: ":host()",
                desc: "When evaluated in the context of a shadow tree, it matches the shadow tree’s host element if the host element, in its normal context, matches the selector argument.",
                browsers: "C35,O22"
            },
            {
                name: ":host-context()",
                desc: "Tests whether there is an ancestor, outside the shadow tree, which matches a particular selector.",
                browsers: "C35,O22"
            },
            {
                name: ":hover",
                desc: "Applies while the user designates an element with a pointing device, but does not necessarily activate it. For example, a visual user agent could apply this pseudo-class when the cursor (mouse pointer) hovers over a box generated by the element."
            },
            {
                name: ":increment",
                desc: "Non-standard. Applies to buttons and track pieces. Indicates whether or not the button or track piece will increment the view’s position when used.",
                browsers: "C,S5"
            },
            {
                name: ":indeterminate",
                desc: "Applies to UI elements whose value is in an indeterminate state.",
                browsers: "E,C,FF3.6,IE9,O10.6,S3"
            },
            {
                name: ":in-range",
                desc: "Used in conjunction with the min and max attributes, whether on a range input, a number field, or any other types that accept those attributes.",
                browsers: "E13,C,FF10,O9.6,S5.1"
            },
            {
                name: ":invalid",
                desc: "An element is :valid or :invalid when it is, respectively, valid or invalid with respect to data validity semantics defined by a different specification.",
                browsers: "E,C,FF4,IE10,O10,S5"
            },
            {
                name: ":lang()",
                desc: "Represents an element that is in language specified.",
                browsers: "E,C,FF1,IE8,O8,S3"
            },
            {
                name: ":last-child",
                desc: "Same as :nth-last-child(1). Represents an element that is the last child of some other element.",
                browsers: "E,C,FF1,IE9,O9.5,S3.1"
            },
            {
                name: ":last-of-type",
                desc: "Same as :nth-last-of-type(1). Represents an element that is the last sibling of its type in the list of children of its parent element.",
                browsers: "E,C,FF3.5,IE9,O9.5,S3.1"
            },
            {
                name: ":left",
                desc: "When printing double-sided documents, the page boxes on left and right pages may be different. This can be expressed through CSS pseudo-classes defined in the  page context."
            },
            {
                name: ":link",
                desc: "Applies to links that have not yet been visited."
            },
            {
                name: ":matches()",
                desc: "Takes a selector list as its argument. It represents an element that is represented by its argument.",
                browsers: "S9"
            },
            {
                name: ":-moz-any()",
                desc: "Represents an element that is represented by the selector list passed as its argument. Standardized as :matches().",
                browsers: "FF4"
            },
            {
                name: ":-moz-any-link",
                desc: "Represents an element that acts as the source anchor of a hyperlink. Applies to both visited and unvisited links.",
                browsers: "FF1"
            },
            {
                name: ":-moz-broken",
                desc: "Non-standard. Matches elements representing broken images.",
                browsers: "FF3"
            },
            {
                name: ":-moz-drag-over",
                desc: "Non-standard. Matches elements when a drag-over event applies to it.",
                browsers: "FF1"
            },
            {
                name: ":-moz-first-node",
                desc: "Non-standard. Represents an element that is the first child node of some other element.",
                browsers: "FF1"
            },
            {
                name: ":-moz-focusring",
                desc: "Non-standard. Matches an element that has focus and focus ring drawing is enabled in the browser.",
                browsers: "FF4"
            },
            {
                name: ":-moz-full-screen",
                desc: "Matches any element that has its fullscreen flag set. Standardized as :fullscreen.",
                browsers: "FF9"
            },
            {
                name: ":-moz-last-node",
                desc: "Non-standard. Represents an element that is the last child node of some other element.",
                browsers: "FF1"
            },
            {
                name: ":-moz-loading",
                desc: "Non-standard. Matches elements, such as images, that haven’t started loading yet.",
                browsers: "FF3"
            },
            {
                name: ":-moz-only-whitespace",
                desc: "The same as :empty, except that it additionally matches elements that only contain code points affected by whitespace processing. Standardized as :blank.",
                browsers: "FF1.5"
            },
            {
                name: ":-moz-placeholder",
                desc: "Deprecated. Represents placeholder text in an input field. Use ::-moz-placeholder for Firefox 19+.",
                browsers: "FF4"
            },
            {
                name: ":-moz-submit-invalid",
                desc: "Non-standard. Represents any submit button when the contents of the associated form are not valid.",
                browsers: "FF4"
            },
            {
                name: ":-moz-suppressed",
                desc: "Non-standard. Matches elements representing images that have been blocked from loading.",
                browsers: "FF3"
            },
            {
                name: ":-moz-ui-invalid",
                desc: "Non-standard. Represents any validated form element whose value isn't valid ",
                browsers: "FF4"
            },
            {
                name: ":-moz-ui-valid",
                desc: "Non-standard. Represents any validated form element whose value is valid ",
                browsers: "FF4"
            },
            {
                name: ":-moz-user-disabled",
                desc: "Non-standard. Matches elements representing images that have been disabled due to the user’s preferences.",
                browsers: "FF3"
            },
            {
                name: ":-moz-window-inactive",
                desc: "Non-standard. Matches elements in an inactive window.",
                browsers: "FF4"
            },
            {
                name: ":-ms-fullscreen",
                desc: "Matches any element that has its fullscreen flag set.",
                browsers: "IE11"
            },
            {
                name: ":-ms-input-placeholder",
                desc: "Represents placeholder text in an input field. Note: for Edge use the pseudo-element ::-ms-input-placeholder. Standardized as ::placeholder.",
                browsers: "IE10"
            },
            {
                name: ":-ms-keyboard-active",
                desc: "Windows Store apps only. Applies one or more styles to an element when it has focus and the user presses the space bar.",
                browsers: "IE10"
            },
            {
                name: ":-ms-lang()",
                desc: "Represents an element that is in the language specified. Accepts a comma seperated list of language tokens.",
                browsers: "E,IE10"
            },
            {
                name: ":no-button",
                desc: "Non-standard. Applies to track pieces. Applies when there is no button at that end of the track.",
                browsers: "C,S5"
            },
            {
                name: ":not()",
                desc: "The negation pseudo-class, :not(X), is a functional notation taking a simple selector (excluding the negation pseudo-class itself) as an argument. It represents an element that is not represented by its argument.",
                browsers: "E,C,FF1,IE9,O9.5,S2"
            },
            {
                name: ":nth-child()",
                desc: "Represents an element that has an+b-1 siblings before it in the document tree, for any positive integer or zero value of n, and has a parent element.",
                browsers: "E,C,FF3.5,IE9,O9.5,S3.1"
            },
            {
                name: ":nth-last-child()",
                desc: "Represents an element that has an+b-1 siblings after it in the document tree, for any positive integer or zero value of n, and has a parent element.",
                browsers: "E,C,FF3.5,IE9,O9.5,S3.1"
            },
            {
                name: ":nth-last-of-type()",
                desc: "Represents an element that has an+b-1 siblings with the same expanded element name after it in the document tree, for any zero or positive integer value of n, and has a parent element.",
                browsers: "E,C,FF3.5,IE9,O9.5,S3.1"
            },
            {
                name: ":nth-of-type()",
                desc: "Represents an element that has an+b-1 siblings with the same expanded element name before it in the document tree, for any zero or positive integer value of n, and has a parent element.",
                browsers: "E,C,FF3.5,IE9,O9.5,S3.1"
            },
            {
                name: ":only-child",
                desc: "Represents an element that has a parent element and whose parent element has no other element children. Same as :first-child:last-child or :nth-child(1):nth-last-child(1), but with a lower specificity.",
                browsers: "E,C,FF1.5,IE9,O9.5,S3.1"
            },
            {
                name: ":only-of-type",
                desc: "Matches every element that is the only child of its type, of its parent. Same as :first-of-type:last-of-type or :nth-of-type(1):nth-last-of-type(1), but with a lower specificity.",
                browsers: "E,C,FF3.5,IE9,O9.5,S3.2"
            },
            {
                name: ":optional",
                desc: "A form element is :required or :optional if a value for it is, respectively, required or optional before the form it belongs to is submitted. Elements that are not form elements are neither required nor optional.",
                browsers: "E,C,FF4,IE10,O10,S5"
            },
            {
                name: ":out-of-range",
                desc: "Used in conjunction with the min and max attributes, whether on a range input, a number field, or any other types that accept those attributes.",
                browsers: "E13,C,FF10,O9.6,S5.1"
            },
            {
                name: ":past",
                desc: "Represents any element that is defined to occur entirely prior to a :current element.",
                browsers: "C,O16,S6"
            },
            {
                name: ":read-only",
                desc: "An element whose contents are not user-alterable is :read-only. However, elements whose contents are user-alterable (such as text input fields) are considered to be in a :read-write state. In typical documents, most elements are :read-only.",
                browsers: "E13,C,FF10,O9,S4"
            },
            {
                name: ":read-write",
                desc: "An element whose contents are not user-alterable is :read-only. However, elements whose contents are user-alterable (such as text input fields) are considered to be in a :read-write state. In typical documents, most elements are :read-only.",
                browsers: "E13,C,FF10,O9,S4"
            },
            {
                name: ":required",
                desc: "A form element is :required or :optional if a value for it is, respectively, required or optional before the form it belongs to is submitted. Elements that are not form elements are neither required nor optional.",
                browsers: "E,C,FF4,IE10,O10,S5"
            },
            {
                name: ":right",
                desc: "When printing double-sided documents, the page boxes on left and right pages may be different. This can be expressed through CSS pseudo-classes defined in the  page context."
            },
            {
                name: ":root",
                desc: "Represents an element that is the root of the document. In HTML 4, this is always the HTML element.",
                browsers: "E,C,FF1,IE9,O9.5,S1"
            },
            {
                name: ":scope",
                desc: "Represents any element that is in the contextual reference element set.",
                browsers: "FF32,S6"
            },
            {
                name: ":single-button",
                desc: "Non-standard. Applies to buttons and track pieces. Applies when both buttons are displayed separately at either end of the scrollbar.",
                browsers: "C,S5"
            },
            {
                name: ":start",
                desc: "Non-standard. Applies to buttons and track pieces. Indicates whether the object is placed before the thumb.",
                browsers: "C,S5"
            },
            {
                name: ":target",
                desc: "Some URIs refer to a location within a resource. This kind of URI ends with a 'number sign' (#) followed by an anchor identifier (called the fragment identifier).",
                browsers: "E,C,FF1,IE9,O9.5,S1"
            },
            {
                name: ":valid",
                desc: "An element is :valid or :invalid when it is, respectively, valid or invalid with respect to data validity semantics defined by a different specification.",
                browsers: "E,C,FF4,IE10,O10,S5"
            },
            {
                name: ":vertical",
                desc: "Non-standard. Applies to any scrollbar pieces that have a vertical orientation.",
                browsers: "C,S5"
            },
            {
                name: ":visited",
                desc: "Applies once the link has been visited by the user."
            },
            {
                name: ":-webkit-any()",
                desc: "Represents an element that is represented by the selector list passed as its argument. Standardized as :matches().",
                browsers: "C,S5"
            },
            {
                name: ":-webkit-full-screen",
                desc: "Matches any element that has its fullscreen flag set. Standardized as :fullscreen.",
                browsers: "C,S6"
            },
            {
                name: ":window-inactive",
                desc: "Non-standard. Applies to all scrollbar pieces. Indicates whether or not the window containing the scrollbar is currently active.",
                browsers: "C,S3"
            }
        ],
        "pseudoelements": [
            {
                name: "::after",
                desc: "Represents a styleable child pseudo-element immediately after the originating element’s actual content.",
                browsers: "E,C,FF1.5,IE9,O9,S4"
            },
            {
                name: "::backdrop",
                desc: "Used to create a backdrop that hides the underlying document for an element in a top layer (such as an element that is displayed fullscreen).",
                browsers: "E"
            },
            {
                name: "::before",
                desc: "Represents a styleable child pseudo-element immediately before the originating element’s actual content.",
                browsers: "E,C,FF1.5,IE9,O9,S4"
            },
            {
                name: "::content",
                desc: "Deprecated. Matches the distribution list itself, on elements that have one. Use ::slotted for forward compatibility.",
                browsers: "C35,O22"
            },
            {
                name: "::cue",
                browsers: "C,O16,S6"
            },
            {
                name: "::cue()",
                browsers: "C,O16,S6"
            },
            {
                name: "::cue-region",
                browsers: "C,O16,S6"
            },
            {
                name: "::cue-region()",
                browsers: "C,O16,S6"
            },
            {
                name: "::first-letter",
                desc: "Represents the first letter of an element, if it is not preceded by any other content (such as images or inline tables) on its line.",
                browsers: "E,C,FF1.5,IE9,O7,S1"
            },
            {
                name: "::first-line",
                desc: "Describes the contents of the first formatted line of its originating element.",
                browsers: "E,C,FF1.5,IE9,O7,S1"
            },
            {
                name: "::-moz-focus-inner",
                browsers: "FF4"
            },
            {
                name: "::-moz-focus-outer",
                browsers: "FF4"
            },
            {
                name: "::-moz-list-bullet",
                desc: "Used to style the bullet of a list element. Similar to the standardized ::marker.",
                browsers: "FF1"
            },
            {
                name: "::-moz-list-number",
                desc: "Used to style the numbers of a list element. Similar to the standardized ::marker.",
                browsers: "FF1"
            },
            {
                name: "::-moz-placeholder",
                desc: "Represents placeholder text in an input field",
                browsers: "FF19"
            },
            {
                name: "::-moz-progress-bar",
                desc: "Represents the bar portion of a progress bar.",
                browsers: "FF9"
            },
            {
                name: "::-moz-selection",
                desc: "Represents the portion of a document that has been highlighted by the user.",
                browsers: "FF1"
            },
            {
                name: "::-ms-backdrop",
                desc: "Used to create a backdrop that hides the underlying document for an element in a top layer (such as an element that is displayed fullscreen).",
                browsers: "IE11"
            },
            {
                name: "::-ms-browse",
                desc: "Represents the browse button of an input type=file control.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-check",
                desc: "Represents the check of a checkbox or radio button input control.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-clear",
                desc: "Represents the clear button of a text input control",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-expand",
                desc: "Represents the drop-down button of a select control.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-fill",
                desc: "Represents the bar portion of a progress bar.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-fill-lower",
                desc: "Represents the portion of the slider track from its smallest value up to the value currently selected by the thumb. In a left-to-right layout, this is the portion of the slider track to the left of the thumb.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-fill-upper",
                desc: "Represents the portion of the slider track from the value currently selected by the thumb up to the slider's largest value. In a left-to-right layout, this is the portion of the slider track to the right of the thumb.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-reveal",
                desc: "Represents the password reveal button of an input type=password control.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-thumb",
                desc: "Represents the portion of range input control (also known as a slider control) that the user drags.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-ticks-after",
                desc: "Represents the tick marks of a slider that begin just after the thumb and continue up to the slider's largest value. In a left-to-right layout, these are the ticks to the right of the thumb.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-ticks-before",
                desc: "Represents the tick marks of a slider that represent its smallest values up to the value currently selected by the thumb. In a left-to-right layout, these are the ticks to the left of the thumb.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-tooltip",
                desc: "Represents the tooltip of a slider (input type=range).",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-track",
                desc: "Represents the track of a slider.",
                browsers: "E,IE10"
            },
            {
                name: "::-ms-value",
                desc: "Represents the content of a text or password input control, or a select control.",
                browsers: "E,IE10"
            },
            {
                name: "::selection",
                desc: "Represents the portion of a document that has been highlighted by the user.",
                browsers: "E,C,IE9,O9.5,S1.1"
            },
            {
                name: "::shadow",
                desc: "Matches the shadow root if an element has a shadow tree.",
                browsers: "C35,O22"
            },
            {
                name: "::-webkit-file-upload-button",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-inner-spin-button",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-input-placeholder",
                browsers: "C,S4"
            },
            {
                name: "::-webkit-keygen-select",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-meter-bar",
                browsers: "E13,C,O15,S6"
            },
            {
                name: "::-webkit-meter-even-less-good-value",
                browsers: "E13,C,O15,S6"
            },
            {
                name: "::-webkit-meter-optimum-value",
                browsers: "E13,C,O15,S6"
            },
            {
                name: "::-webkit-meter-suboptimal-value",
                browsers: "E13,C,O15,S6"
            },
            {
                name: "::-webkit-outer-spin-button",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-progress-bar",
                browsers: "C,S3"
            },
            {
                name: "::-webkit-progress-inner-element",
                browsers: "C,S3"
            },
            {
                name: "::-webkit-progress-value",
                browsers: "C,S3"
            },
            {
                name: "::-webkit-resizer",
                browsers: "C,S5"
            },
            {
                name: "::-webkit-scrollbar",
                browsers: "C,S5"
            },
            {
                name: "::-webkit-scrollbar-button",
                browsers: "C,S5"
            },
            {
                name: "::-webkit-scrollbar-corner",
                browsers: "C,S5"
            },
            {
                name: "::-webkit-scrollbar-thumb",
                browsers: "C,S5"
            },
            {
                name: "::-webkit-scrollbar-track",
                browsers: "C,S5"
            },
            {
                name: "::-webkit-scrollbar-track-piece",
                browsers: "C,S5"
            },
            {
                name: "::-webkit-search-cancel-button",
                browsers: "C,S4"
            },
            {
                name: "::-webkit-search-decoration",
                browsers: "C,S4"
            },
            {
                name: "::-webkit-search-results-button",
                browsers: "C,S4"
            },
            {
                name: "::-webkit-search-results-decoration",
                browsers: "C,S4"
            },
            {
                name: "::-webkit-slider-runnable-track",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-slider-thumb",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-textfield-decoration-container",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-validation-bubble",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-validation-bubble-arrow",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-validation-bubble-arrow-clipper",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-validation-bubble-heading",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-validation-bubble-message",
                browsers: "C,O,S6"
            },
            {
                name: "::-webkit-validation-bubble-text-block",
                browsers: "C,O,S6"
            }
        ],
        "properties": [
            {
                name: "additive-symbols",
                desc: "@counter-style descriptor. Specifies the symbols used by the marker-construction algorithm specified by the system descriptor. Needs to be specified if the counter system is 'additive'.",
                browsers: "FF33",
                restriction: "integer, string, image, identifier"
            },
            {
                name: "align-content",
                desc: "Aligns a flex container’s lines within the flex container when there is extra space in the cross-axis, similar to how 'justify-content' aligns individual items within the main-axis.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "center",
                        desc: "Lines are packed toward the center of the flex container."
                    },
                    {
                        name: "flex-end",
                        desc: "Lines are packed toward the end of the flex container."
                    },
                    {
                        name: "flex-start",
                        desc: "Lines are packed toward the start of the flex container."
                    },
                    {
                        name: "space-around",
                        desc: "Lines are evenly distributed in the flex container, with half-size spaces on either end."
                    },
                    {
                        name: "space-between",
                        desc: "Lines are evenly distributed in the flex container."
                    },
                    {
                        name: "stretch",
                        desc: "Lines stretch to take up the remaining space."
                    }
                ]
            },
            {
                name: "align-items",
                desc: "Aligns flex items along the cross axis of the current line of the flex container.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "baseline",
                        desc: "If the flex item’s inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment."
                    },
                    {
                        name: "center",
                        desc: "The flex item’s margin box is centered in the cross axis within the line."
                    },
                    {
                        name: "flex-end",
                        desc: "The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line."
                    },
                    {
                        name: "flex-start",
                        desc: "The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line."
                    },
                    {
                        name: "stretch",
                        desc: "If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched."
                    }
                ]
            },
            {
                name: "justify-items",
                desc: "Defines the default justify-self for all items of the box, given them the default way of justifying each box along the appropriate axi",
                browsers: "FF45",
                restriction: "enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "normal"
                    },
                    {
                        name: "end"
                    },
                    {
                        name: "start"
                    },
                    {
                        name: "flex-end",
                        desc: "\"Flex items are packed toward the end of the line.\""
                    },
                    {
                        name: "flex-start",
                        desc: "\"Flex items are packed toward the start of the line.\""
                    },
                    {
                        name: "self-end"
                    },
                    {
                        name: "self-start"
                    },
                    {
                        name: "center",
                        desc: "The items are packed flush to each other toward the center of the of the alignment container."
                    },
                    {
                        name: "left"
                    },
                    {
                        name: "right"
                    },
                    {
                        name: "baseline"
                    },
                    {
                        name: "first baseline"
                    },
                    {
                        name: "last baseline"
                    },
                    {
                        name: "stretch",
                        desc: "If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched."
                    },
                    {
                        name: "save"
                    },
                    {
                        name: "unsave"
                    },
                    {
                        name: "legacy"
                    }
                ]
            },
            {
                name: "justify-self",
                desc: "Defines the way of justifying a box inside its container along the appropriate axis.",
                browsers: "FF45",
                restriction: "enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "normal"
                    },
                    {
                        name: "end"
                    },
                    {
                        name: "start"
                    },
                    {
                        name: "flex-end",
                        desc: "\"Flex items are packed toward the end of the line.\""
                    },
                    {
                        name: "flex-start",
                        desc: "\"Flex items are packed toward the start of the line.\""
                    },
                    {
                        name: "self-end"
                    },
                    {
                        name: "self-start"
                    },
                    {
                        name: "center",
                        desc: "The items are packed flush to each other toward the center of the of the alignment container."
                    },
                    {
                        name: "left"
                    },
                    {
                        name: "right"
                    },
                    {
                        name: "baseline"
                    },
                    {
                        name: "first baseline"
                    },
                    {
                        name: "last baseline"
                    },
                    {
                        name: "stretch",
                        desc: "If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched."
                    },
                    {
                        name: "save"
                    },
                    {
                        name: "unsave"
                    }
                ]
            },
            {
                name: "justify-items",
                desc: "Defines the default justify-self for all items of the box, given them the default way of justifying each box along the appropriate axi",
                browsers: "FF45",
                restriction: "enum"
            },
            {
                name: "align-self",
                desc: "Allows the default alignment along the cross axis to be overridden for individual flex items.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Computes to the value of 'align-items' on the element’s parent, or 'stretch' if the element has no parent. On absolutely positioned elements, it computes to itself."
                    },
                    {
                        name: "baseline",
                        desc: "If the flex item’s inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment."
                    },
                    {
                        name: "center",
                        desc: "The flex item’s margin box is centered in the cross axis within the line."
                    },
                    {
                        name: "flex-end",
                        desc: "The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line."
                    },
                    {
                        name: "flex-start",
                        desc: "The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line."
                    },
                    {
                        name: "stretch",
                        desc: "If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched."
                    }
                ]
            },
            {
                name: "all",
                desc: "Shorthand that resets all properties except 'direction' and 'unicode-bidi'.",
                browsers: "C37,FF27,O24",
                restriction: "enum",
                values: []
            },
            {
                name: "alt",
                desc: "Provides alternative text for assistive technology to replace the genenerated content of a ::before or ::after element.",
                browsers: "S9",
                restriction: "string, enum",
                values: []
            },
            {
                name: "animation",
                desc: "Shorthand property combines six of the animation properties into a single property.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "time, timing-function, enum, identifier, number",
                values: [
                    {
                        name: "alternate"
                    },
                    {
                        name: "alternate-reverse"
                    },
                    {
                        name: "backwards"
                    },
                    {
                        name: "both",
                        desc: "Both forwards and backwards fill modes are applied."
                    },
                    {
                        name: "forwards"
                    },
                    {
                        name: "infinite",
                        desc: "Causes the animation to repeat forever."
                    },
                    {
                        name: "none",
                        desc: "No animation is performed"
                    },
                    {
                        name: "normal",
                        desc: "Normal playback."
                    },
                    {
                        name: "reverse",
                        desc: "All iterations of the animation are played in the reverse direction from the way they were specified."
                    }
                ]
            },
            {
                name: "animation-delay",
                desc: "Defines when the animation will start.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "time"
            },
            {
                name: "animation-direction",
                desc: "Defines whether or not the animation should play in reverse on alternate cycles.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "alternate"
                    },
                    {
                        name: "alternate-reverse"
                    },
                    {
                        name: "normal",
                        desc: "Normal playback."
                    },
                    {
                        name: "reverse",
                        desc: "All iterations of the animation are played in the reverse direction from the way they were specified."
                    }
                ]
            },
            {
                name: "animation-duration",
                desc: "Defines the length of time that an animation takes to complete one cycle.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "time"
            },
            {
                name: "animation-fill-mode",
                desc: "Defines what values are applied by the animation outside the time it is executing.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "backwards"
                    },
                    {
                        name: "both",
                        desc: "Both forwards and backwards fill modes are applied."
                    },
                    {
                        name: "forwards"
                    },
                    {
                        name: "none",
                        desc: "There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes."
                    }
                ]
            },
            {
                name: "animation-iteration-count",
                desc: "Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "number, enum",
                values: [
                    {
                        name: "infinite",
                        desc: "Causes the animation to repeat forever."
                    }
                ]
            },
            {
                name: "animation-name",
                desc: "Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "identifier, enum",
                values: [
                    {
                        name: "none",
                        desc: "No animation is performed"
                    }
                ]
            },
            {
                name: "animation-play-state",
                desc: "Defines whether the animation is running or paused.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "paused"
                    },
                    {
                        name: "running"
                    }
                ]
            },
            {
                name: "animation-timing-function",
                desc: "Describes how the animation will progress over one cycle of its duration.",
                browsers: "E,C43,FF16,IE10,O12.1,S9",
                restriction: "timing-function"
            },
            {
                name: "backface-visibility",
                desc: "Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
                browsers: "E,C36,FF16,IE10,O23",
                restriction: "enum",
                values: [
                    {
                        name: "hidden",
                        desc: "Back side is hidden."
                    },
                    {
                        name: "visible",
                        desc: "Back side is visible."
                    }
                ]
            },
            {
                name: "background",
                desc: "Shorthand property for setting most background properties at the same place in the style sheet.",
                restriction: "enum, image, color, position, length, repeat, percentage, box",
                values: [
                    {
                        name: "fixed",
                        desc: "The background is fixed with regard to the viewport. In paged media where there is no viewport, a 'fixed' background is fixed with respect to the page box and therefore replicated on every page."
                    },
                    {
                        name: "local",
                        desc: "The background is fixed with regard to the element's contents: if the element has a scrolling mechanism, the background scrolls with the element's contents."
                    },
                    {
                        name: "scroll",
                        desc: "The background is fixed with regard to the element itself and does not scroll with its contents. (It is effectively attached to the element's border.)"
                    }
                ]
            },
            {
                name: "background-attachment",
                desc: "Specifies whether the background images are fixed with regard to the viewport ('fixed') or scroll along with the element ('scroll') or its contents ('local').",
                restriction: "enum",
                values: [
                    {
                        name: "fixed",
                        desc: "The background is fixed with regard to the viewport. In paged media where there is no viewport, a 'fixed' background is fixed with respect to the page box and therefore replicated on every page."
                    },
                    {
                        name: "local",
                        desc: "The background is fixed with regard to the element’s contents: if the element has a scrolling mechanism, the background scrolls with the element’s contents.",
                        browsers: "E,C,FF25,IE9,O11.5,S5"
                    },
                    {
                        name: "scroll",
                        desc: "The background is fixed with regard to the element itself and does not scroll with its contents. (It is effectively attached to the element’s border.)"
                    }
                ]
            },
            {
                name: "background-blend-mode",
                desc: "Defines the blending mode of each background layer.",
                browsers: "C35,FF30,O22,S7.1",
                restriction: "enum",
                values: [
                    {
                        name: "normal",
                        desc: "Default attribute which specifies no blending"
                    },
                    {
                        name: "multiply"
                    },
                    {
                        name: "screen"
                    },
                    {
                        name: "overlay"
                    },
                    {
                        name: "darken"
                    },
                    {
                        name: "lighten"
                    },
                    {
                        name: "color-dodge"
                    },
                    {
                        name: "color-burn"
                    },
                    {
                        name: "hard-light"
                    },
                    {
                        name: "soft-light"
                    },
                    {
                        name: "difference"
                    },
                    {
                        name: "exclusion"
                    },
                    {
                        name: "hue",
                        browsers: "C35,FF30,O22"
                    },
                    {
                        name: "saturation",
                        browsers: "C35,FF30,O22"
                    },
                    {
                        name: "color",
                        browsers: "C35,FF30,O22"
                    },
                    {
                        name: "luminosity",
                        browsers: "C35,FF30,O22"
                    }
                ]
            },
            {
                name: "background-clip",
                desc: "Determines the background painting area.",
                browsers: "E,C,FF4,IE9,O10.5,S3",
                restriction: "box"
            },
            {
                name: "background-color",
                desc: "Sets the background color of an element.",
                restriction: "color"
            },
            {
                name: "background-image",
                desc: "Sets the background image(s) of an element.",
                restriction: "image, enum",
                values: [
                    {
                        name: "none",
                        desc: "Counts as an image layer but draws nothing."
                    }
                ]
            },
            {
                name: "background-origin",
                desc: "For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
                browsers: "E,C,FF4,IE9,O10.5,S3",
                restriction: "box"
            },
            {
                name: "background-position",
                desc: "Specifies the initial position of the background image(s) (after any resizing) within their corresponding background positioning area.",
                restriction: "position, length, percentage"
            },
            {
                name: "background-position-x",
                desc: "If background images have been specified, this property specifies their initial position (after any resizing) within their corresponding background positioning area.",
                browsers: "E,IE6",
                restriction: "length, percentage",
                values: [
                    {
                        name: "center",
                        desc: "Equivalent to '50%' ('left 50%') for the horizontal position if the horizontal position is not otherwise specified, or '50%' ('top 50%') for the vertical position if it is."
                    },
                    {
                        name: "left",
                        desc: "Equivalent to '0%' for the horizontal position if one or two values are given, otherwise specifies the left edge as the origin for the next offset."
                    },
                    {
                        name: "right",
                        desc: "Equivalent to '100%' for the horizontal position if one or two values are given, otherwise specifies the right edge as the origin for the next offset."
                    }
                ]
            },
            {
                name: "background-position-y",
                desc: "If background images have been specified, this property specifies their initial position (after any resizing) within their corresponding background positioning area.",
                browsers: "E,IE6",
                restriction: "length, percentage",
                values: [
                    {
                        name: "bottom",
                        desc: "Equivalent to '100%' for the vertical position if one or two values are given, otherwise specifies the bottom edge as the origin for the next offset."
                    },
                    {
                        name: "center",
                        desc: "Equivalent to '50%' ('left 50%') for the horizontal position if the horizontal position is not otherwise specified, or '50%' ('top 50%') for the vertical position if it is."
                    },
                    {
                        name: "top",
                        desc: "Equivalent to '0%' for the vertical position if one or two values are given, otherwise specifies the top edge as the origin for the next offset."
                    }
                ]
            },
            {
                name: "background-repeat",
                desc: "Specifies how background images are tiled after they have been sized and positioned.",
                restriction: "repeat",
                values: []
            },
            {
                name: "background-size",
                desc: "Specifies the size of the background images.",
                browsers: "E,C,FF4,IE9,O10,S4.1",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Resolved by using the image’s intrinsic ratio and the size of the other dimension, or failing that, using the image’s intrinsic size, or failing that, treating it as 100%."
                    },
                    {
                        name: "contain",
                        desc: "Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area."
                    },
                    {
                        name: "cover",
                        desc: "Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area."
                    }
                ]
            },
            {
                name: "behavior",
                desc: "IE only. Used to extend behaviors of the browser.",
                browsers: "IE6",
                restriction: "url"
            },
            {
                name: "block-size",
                desc: "Logical 'width'. Mapping depends on the element’s 'writing-mode'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Depends on the values of other properties."
                    }
                ]
            },
            {
                name: "border",
                desc: "Shorthand property for setting border width, style, and color.",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-block-end",
                desc: "Logical 'border-bottom'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-block-start",
                desc: "Logical 'border-top'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-block-end-color",
                desc: "Logical 'border-bottom-color'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "color"
            },
            {
                name: "border-block-start-color",
                desc: "Logical 'border-top-color'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "color"
            },
            {
                name: "border-block-end-style",
                desc: "Logical 'border-bottom-style'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "line-style"
            },
            {
                name: "border-block-start-style",
                desc: "Logical 'border-top-style'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "lline-style"
            },
            {
                name: "border-block-end-width",
                desc: "Logical 'border-bottom-width'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, line-width"
            },
            {
                name: "border-block-start-width",
                desc: "Logical 'border-top-width'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, line-width"
            },
            {
                name: "border-bottom",
                desc: "Shorthand property for setting border width, style and color.",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-bottom-color",
                desc: "Sets the color of the bottom border.",
                restriction: "color"
            },
            {
                name: "border-bottom-left-radius",
                desc: "Defines the radii of the bottom left outer border edge.",
                browsers: "E,C,FF4,IE9,O10.5,S5",
                restriction: "length, percentage"
            },
            {
                name: "border-bottom-right-radius",
                desc: "Defines the radii of the bottom right outer border edge.",
                browsers: "E,C,FF4,IE9,O10.5,S5",
                restriction: "length, percentage"
            },
            {
                name: "border-bottom-style",
                desc: "Sets the style of the bottom border.",
                restriction: "line-style"
            },
            {
                name: "border-bottom-width",
                desc: "Sets the thickness of the bottom border.",
                restriction: "length, line-width"
            },
            {
                name: "border-collapse",
                desc: "Selects a table's border model.",
                restriction: "enum",
                values: [
                    {
                        name: "collapse",
                        desc: "Selects the collapsing borders model."
                    },
                    {
                        name: "separate",
                        desc: "Selects the separated borders border model."
                    }
                ]
            },
            {
                name: "border-color",
                desc: "The color of the border around all four edges of an element.",
                restriction: "color",
                values: []
            },
            {
                name: "border-image",
                desc: "Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
                browsers: "E,C16,FF15,IE11,O15,S6",
                restriction: "length, percentage, number, url, enum",
                values: [
                    {
                        name: "auto",
                        desc: "If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead."
                    },
                    {
                        name: "fill",
                        desc: "Causes the middle part of the border-image to be preserved."
                    },
                    {
                        name: "none",
                        desc: "Use the border styles."
                    },
                    {
                        name: "repeat"
                    },
                    {
                        name: "round",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does."
                    },
                    {
                        name: "space",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles."
                    },
                    {
                        name: "stretch",
                        desc: "The image is stretched to fill the area."
                    },
                    {
                        name: "url()"
                    }
                ]
            },
            {
                name: "border-image-outset",
                desc: "The values specify the amount by which the border image area extends beyond the border box on the top, right, bottom, and left sides respectively. If the fourth value is absent, it is the same as the second. If the third one is also absent, it is the same as the first. If the second one is also absent, it is the same as the first. Numbers represent multiples of the corresponding border-width.",
                browsers: "E,C16,FF15,IE11,O15,S6",
                restriction: "length, number"
            },
            {
                name: "border-image-repeat",
                desc: "Specifies how the images for the sides and the middle part of the border image are scaled and tiled. If the second keyword is absent, it is assumed to be the same as the first.",
                browsers: "E,C16,FF15,IE11,O15,S6",
                restriction: "enum",
                values: [
                    {
                        name: "repeat"
                    },
                    {
                        name: "round",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does."
                    },
                    {
                        name: "space",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles."
                    },
                    {
                        name: "stretch",
                        desc: "The image is stretched to fill the area."
                    }
                ]
            },
            {
                name: "border-image-slice",
                desc: "Specifies inward offsets from the top, right, bottom, and left edges of the image, dividing it into nine regions: four corners, four edges and a middle.",
                browsers: "E,C16,FF15,IE11,O15,S6",
                restriction: "number, percentage",
                values: [
                    {
                        name: "fill",
                        desc: "Causes the middle part of the border-image to be preserved."
                    }
                ]
            },
            {
                name: "border-image-source",
                desc: "Specifies an image to use instead of the border styles given by the 'border-style' properties and as an additional background layer for the element. If the value is 'none' or if the image cannot be displayed, the border styles will be used.",
                browsers: "E,C16,FF15,IE11,O15,S6",
                restriction: "image",
                values: [
                    {
                        name: "none",
                        desc: "Use the border styles."
                    }
                ]
            },
            {
                name: "border-image-width",
                desc: "The four values of 'border-image-width' specify offsets that are used to divide the border image area into nine parts. They represent inward distances from the top, right, bottom, and left sides of the area, respectively.",
                browsers: "E,C16,FF15,IE11,O15,S6",
                restriction: "length, percentage, number",
                values: [
                    {
                        name: "auto",
                        desc: "The border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead."
                    }
                ]
            },
            {
                name: "border-inline-end",
                desc: "Logical 'border-right'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-inline-start",
                desc: "Logical 'border-left'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-inline-end-color",
                desc: "Logical 'border-right-color'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "color"
            },
            {
                name: "border-inline-start-color",
                desc: "Logical 'border-left-color'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "color"
            },
            {
                name: "border-inline-end-style",
                desc: "Logical 'border-right-style'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "line-style"
            },
            {
                name: "border-inline-start-style",
                desc: "Logical 'border-left-style'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "lline-style"
            },
            {
                name: "border-inline-end-width",
                desc: "Logical 'border-right-width'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, line-width"
            },
            {
                name: "border-inline-start-width",
                desc: "Logical 'border-left-width'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, line-width"
            },
            {
                name: "border-left",
                desc: "Shorthand property for setting border width, style and color",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-left-color",
                desc: "Sets the color of the left border.",
                restriction: "color"
            },
            {
                name: "border-left-style",
                desc: "Sets the style of the left border.",
                restriction: "line-style"
            },
            {
                name: "border-left-width",
                desc: "Sets the thickness of the left border.",
                restriction: "length, line-width"
            },
            {
                name: "border-radius",
                desc: "Defines the radii of the outer border edge.",
                browsers: "E,C,FF4,IE9,O10.5,S5",
                restriction: "length, percentage"
            },
            {
                name: "border-right",
                desc: "Shorthand property for setting border width, style and color",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-right-color",
                desc: "Sets the color of the right border.",
                restriction: "color"
            },
            {
                name: "border-right-style",
                desc: "Sets the style of the right border.",
                restriction: "line-style"
            },
            {
                name: "border-right-width",
                desc: "Sets the thickness of the right border.",
                restriction: "length, line-width"
            },
            {
                name: "border-spacing",
                desc: "The lengths specify the distance that separates adjoining cell borders. If one length is specified, it gives both the horizontal and vertical spacing. If two are specified, the first gives the horizontal spacing and the second the vertical spacing. Lengths may not be negative.",
                browsers: "E,C,FF1,IE8,O7,S1.2",
                restriction: "length"
            },
            {
                name: "border-style",
                desc: "The style of the border around edges of an element.",
                restriction: "line-style",
                values: []
            },
            {
                name: "border-top",
                desc: "Shorthand property for setting border width, style and color",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "border-top-color",
                desc: "Sets the color of the top border.",
                restriction: "color"
            },
            {
                name: "border-top-left-radius",
                desc: "Defines the radii of the top left outer border edge.",
                browsers: "E,C,FF4,IE9,O10.5,S5",
                restriction: "length, percentage"
            },
            {
                name: "border-top-right-radius",
                desc: "Defines the radii of the top right outer border edge.",
                browsers: "E,C,FF4,IE9,O10.5,S5",
                restriction: "length, percentage"
            },
            {
                name: "border-top-style",
                desc: "Sets the style of the top border.",
                restriction: "line-style"
            },
            {
                name: "border-top-width",
                desc: "Sets the thickness of the top border.",
                restriction: "length, line-width"
            },
            {
                name: "border-width",
                desc: "Shorthand that sets the four 'border-*-width' properties. If it has four values, they set top, right, bottom and left in that order. If left is missing, it is the same as right; if bottom is missing, it is the same as top; if right is missing, it is the same as top.",
                restriction: "length, line-width",
                values: []
            },
            {
                name: "bottom",
                desc: "Specifies how far an absolutely positioned box's bottom margin edge is offset above the bottom edge of the box's 'containing block'.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well"
                    }
                ]
            },
            {
                name: "box-decoration-break",
                desc: "Specifies whether individual boxes are treated as broken pieces of one continuous box, or whether each box is individually wrapped with the border and padding.",
                browsers: "FF32,O11",
                restriction: "enum",
                values: [
                    {
                        name: "clone"
                    },
                    {
                        name: "slice"
                    }
                ]
            },
            {
                name: "box-shadow",
                desc: "Attaches one or more drop-shadows to the box. The property is a comma-separated list of shadows, each specified by 2-4 length values, an optional color, and an optional 'inset' keyword. Omitted lengths are 0; omitted colors are a user agent chosen color.",
                browsers: "E,C,FF4,IE9,O11.5,S5.1",
                restriction: "length, color, enum",
                values: [
                    {
                        name: "inset"
                    }
                ]
            },
            {
                name: "box-sizing",
                desc: "Specifies the behavior of the 'width' and 'height' properties.",
                browsers: "E,C10,FF29,IE8,O8,S5.1",
                restriction: "enum",
                values: [
                    {
                        name: "border-box"
                    },
                    {
                        name: "content-box"
                    }
                ]
            },
            {
                name: "break-after",
                desc: "Describes the page/column/region break behavior after the generated box.",
                browsers: "E,IE10,O11.5",
                restriction: "enum",
                values: [
                    {
                        name: "always",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page/column break before/after the principal box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a break before/after the principal box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break before/after the principal box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break before/after the principal box."
                    },
                    {
                        name: "column",
                        desc: "Always force a column break before/after the principal box."
                    },
                    {
                        name: "left",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a left page."
                    },
                    {
                        name: "page",
                        desc: "Always force a page break before/after the principal box."
                    },
                    {
                        name: "right",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a right page."
                    }
                ]
            },
            {
                name: "break-before",
                desc: "Describes the page/column/region break behavior before the generated box.",
                browsers: "E,IE10,O11.5",
                restriction: "enum",
                values: [
                    {
                        name: "always",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page/column break before/after the principal box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a break before/after the principal box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break before/after the principal box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break before/after the principal box."
                    },
                    {
                        name: "column",
                        desc: "Always force a column break before/after the principal box."
                    },
                    {
                        name: "left",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a left page."
                    },
                    {
                        name: "page",
                        desc: "Always force a page break before/after the principal box."
                    },
                    {
                        name: "right",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a right page."
                    }
                ]
            },
            {
                name: "break-inside",
                desc: "Describes the page/column/region break behavior inside the principal box.",
                browsers: "E,IE10,O11.5",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Impose no additional breaking constraints within the box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid breaks within the box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break within the box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break within the box."
                    }
                ]
            },
            {
                name: "caption-side",
                desc: "Specifies the position of the caption box with respect to the table box.",
                browsers: "E,C,FF,IE8,O,S",
                restriction: "enum",
                values: [
                    {
                        name: "bottom",
                        desc: "Positions the caption box below the table box."
                    },
                    {
                        name: "top",
                        desc: "Positions the caption box above the table box."
                    }
                ]
            },
            {
                name: "caret-color",
                desc: "Controls the color of the text insertion indicator.",
                browsers: "C60,FF55,O46",
                restriction: "color, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The user agent selects an appropriate color for the caret. This is generally currentcolor, but the user agent may choose a different color to ensure good visibility and contrast with the surrounding content, taking into account the value of currentcolor, the background, shadows, and other factors."
                    }
                ]
            },
            {
                name: "clear",
                desc: "Indicates which sides of an element's box(es) may not be adjacent to an earlier floating box. The 'clear' property does not consider floats inside the element itself or in other block formatting contexts.",
                restriction: "enum",
                values: [
                    {
                        name: "both",
                        desc: "The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any right-floating and left-floating boxes that resulted from elements earlier in the source document."
                    },
                    {
                        name: "left",
                        desc: "The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any left-floating boxes that resulted from elements earlier in the source document."
                    },
                    {
                        name: "none",
                        desc: "No constraint on the box's position with respect to floats."
                    },
                    {
                        name: "right",
                        desc: "The clearance of the generated box is set to the amount necessary to place the top border edge below the bottom outer edge of any right-floating boxes that resulted from elements earlier in the source document."
                    }
                ]
            },
            {
                name: "clip",
                desc: "Deprecated. Use the 'clip-path' property when support allows. Defines the visible portion of an element’s box.",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The element does not clip."
                    },
                    {
                        name: "rect()"
                    }
                ]
            },
            {
                name: "clip-path",
                desc: "Specifies a clipping path where everything inside the path is visable and everything outside is clipped out.",
                browsers: "FF3.5",
                restriction: "url, shape, geometry-box, enum",
                values: [
                    {
                        name: "none",
                        desc: "No clipping path gets created."
                    },
                    {
                        name: "url()",
                        desc: "References a <clipPath> element to create a clipping path."
                    }
                ]
            },
            {
                name: "clip-rule",
                desc: "Indicates the algorithm which is to be used to determine what parts of the canvas are included inside the shape.",
                browsers: "E,C5,FF3,IE10,O9,S6",
                restriction: "enum",
                values: [
                    {
                        name: "evenodd"
                    },
                    {
                        name: "nonzero"
                    }
                ]
            },
            {
                name: "color",
                desc: "Color of an element's text",
                restriction: "color"
            },
            {
                name: "color-interpolation-filters",
                desc: "Specifies the color space for imaging operations performed via filter effects.",
                browsers: "E,C5,FF3,IE10,O9,S6",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Color operations are not required to occur in a particular color space."
                    },
                    {
                        name: "linearRGB"
                    },
                    {
                        name: "sRGB"
                    }
                ]
            },
            {
                name: "column-count",
                desc: "Describes the optimal number of columns into which the content of the element will be flowed.",
                browsers: "E,IE10,O11.5,S9",
                restriction: "integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "Determines the number of columns by the 'column-width' property and the element width."
                    }
                ]
            },
            {
                name: "column-fill",
                desc: "In continuous media, this property will only be consulted if the length of columns has been constrained. Otherwise, columns will automatically be balanced.",
                browsers: "E,IE10,O11.5,S9",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Fills columns sequentially."
                    },
                    {
                        name: "balance"
                    }
                ]
            },
            {
                name: "column-gap",
                desc: "Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.",
                browsers: "E,IE10,O11.5,S9",
                restriction: "length, enum",
                values: [
                    {
                        name: "normal",
                        desc: "User agent specific and typically equivalent to 1em."
                    }
                ]
            },
            {
                name: "column-rule",
                desc: "Shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
                browsers: "E,IE10,O11.5,S9",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "column-rule-color",
                desc: "Sets the color of the column rule",
                browsers: "E,IE10,O11.6",
                restriction: "color"
            },
            {
                name: "column-rule-style",
                desc: "Sets the style of the rule between columns of an element.",
                browsers: "E,IE10,O11.5,S6",
                restriction: "line-style"
            },
            {
                name: "column-rule-width",
                desc: "Sets the width of the rule between columns. Negative values are not allowed.",
                browsers: "E,IE10,O11.5,S9",
                restriction: "length, line-width"
            },
            {
                name: "columns",
                desc: "A shorthand property which sets both 'column-width' and 'column-count'.",
                browsers: "E,IE10,O11.5,S9",
                restriction: "length, integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The width depends on the values of other properties."
                    }
                ]
            },
            {
                name: "column-span",
                desc: "Describes the page/column break behavior after the generated box.",
                browsers: "E,IE10,O11.5,S9",
                restriction: "enum",
                values: [
                    {
                        name: "all",
                        desc: "The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appear."
                    },
                    {
                        name: "none",
                        desc: "The element does not span multiple columns."
                    }
                ]
            },
            {
                name: "column-width",
                desc: "Describes the width of columns in multicol elements.",
                browsers: "E,IE10,O11.5,S9",
                restriction: "length, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The width depends on the values of other properties."
                    }
                ]
            },
            {
                name: "contain",
                desc: "Indicates that an element and its contents are, as much as possible, independent of the rest of the document tree.",
                browsers: "C52,O40",
                restriction: "enum",
                values: [
                    {
                        name: "none",
                        desc: "Indicates that the property has no effect."
                    },
                    {
                        name: "strict",
                        desc: "Turns on all forms of containment for the element."
                    },
                    {
                        name: "content",
                        desc: "All containment rules except size are applied to the element."
                    },
                    {
                        name: "size"
                    },
                    {
                        name: "layout"
                    },
                    {
                        name: "style",
                        desc: "Turns on style containment for the element."
                    },
                    {
                        name: "paint"
                    }
                ]
            },
            {
                name: "content",
                desc: "Determines which page-based occurrence of a given element is applied to a counter or string value.",
                browsers: "E,C,FF1,IE8,O4,S1",
                restriction: "string, url",
                values: [
                    {
                        name: "attr()"
                    },
                    {
                        name: "counter(name)"
                    },
                    {
                        name: "icon",
                        desc: "The (pseudo-)element is replaced in its entirety by the resource referenced by its 'icon' property, and treated as a replaced element."
                    },
                    {
                        name: "none",
                        desc: "On elements, this inhibits the children of the element from being rendered as children of this element, as if the element was empty. On pseudo-elements it causes the pseudo-element to have no content."
                    },
                    {
                        name: "normal",
                        desc: "See http://www.w3.org/TR/css3-content/#content for computation rules."
                    },
                    {
                        name: "url()"
                    }
                ]
            },
            {
                name: "counter-increment",
                desc: "Manipulate the value of existing counters.",
                browsers: "E,C,FF1.5,IE8,O10.5,S3",
                restriction: "identifier, integer",
                values: [
                    {
                        name: "none",
                        desc: "This element does not alter the value of any counters."
                    }
                ]
            },
            {
                name: "counter-reset",
                desc: "Property accepts one or more names of counters (identifiers), each one optionally followed by an integer. The integer gives the value that the counter is set to on each occurrence of the element.",
                browsers: "E,C,FF1.5,IE8,O10.5,S3",
                restriction: "identifier, integer",
                values: [
                    {
                        name: "none",
                        desc: "The counter is not modified."
                    }
                ]
            },
            {
                name: "cursor",
                desc: "Allows control over cursor appearance in an element",
                restriction: "url, number, enum",
                values: [
                    {
                        name: "alias"
                    },
                    {
                        name: "all-scroll"
                    },
                    {
                        name: "auto",
                        desc: "The UA determines the cursor to display based on the current context."
                    },
                    {
                        name: "cell"
                    },
                    {
                        name: "col-resize"
                    },
                    {
                        name: "context-menu"
                    },
                    {
                        name: "copy"
                    },
                    {
                        name: "crosshair"
                    },
                    {
                        name: "default",
                        desc: "The platform-dependent default cursor. Often rendered as an arrow."
                    },
                    {
                        name: "e-resize"
                    },
                    {
                        name: "ew-resize"
                    },
                    {
                        name: "grab",
                        browsers: "FF27"
                    },
                    {
                        name: "grabbing",
                        browsers: "FF27"
                    },
                    {
                        name: "help"
                    },
                    {
                        name: "move"
                    },
                    {
                        name: "-moz-grab",
                        browsers: "FF1.5"
                    },
                    {
                        name: "-moz-grabbing",
                        browsers: "FF1.5"
                    },
                    {
                        name: "-moz-zoom-in",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-zoom-out",
                        browsers: "FF"
                    },
                    {
                        name: "ne-resize"
                    },
                    {
                        name: "nesw-resize"
                    },
                    {
                        name: "no-drop"
                    },
                    {
                        name: "none",
                        desc: "No cursor is rendered for the element."
                    },
                    {
                        name: "not-allowed"
                    },
                    {
                        name: "n-resize"
                    },
                    {
                        name: "ns-resize"
                    },
                    {
                        name: "nw-resize"
                    },
                    {
                        name: "nwse-resize"
                    },
                    {
                        name: "pointer"
                    },
                    {
                        name: "progress"
                    },
                    {
                        name: "row-resize"
                    },
                    {
                        name: "se-resize"
                    },
                    {
                        name: "s-resize"
                    },
                    {
                        name: "sw-resize"
                    },
                    {
                        name: "text",
                        desc: "Indicates text that may be selected. Often rendered as a vertical I-beam."
                    },
                    {
                        name: "vertical-text"
                    },
                    {
                        name: "wait"
                    },
                    {
                        name: "-webkit-grab",
                        browsers: "C,S4"
                    },
                    {
                        name: "-webkit-grabbing",
                        browsers: "C,S4"
                    },
                    {
                        name: "-webkit-zoom-in",
                        browsers: "C,S1.2"
                    },
                    {
                        name: "-webkit-zoom-out",
                        browsers: "C,S1.2"
                    },
                    {
                        name: "w-resize"
                    },
                    {
                        name: "zoom-in",
                        browsers: "E,C37,FF24,O12.1,S9"
                    },
                    {
                        name: "zoom-out",
                        browsers: "E,C37,FF24,O12.1,S9"
                    }
                ]
            },
            {
                name: "direction",
                desc: "Specifies the inline base direction or directionality of any bidi paragraph, embedding, isolate, or override established by the box. Note: for HTML content use the 'dir' attribute and 'bdo' element rather than this property.",
                restriction: "enum",
                values: [
                    {
                        name: "ltr"
                    },
                    {
                        name: "rtl"
                    }
                ]
            },
            {
                name: "display",
                desc: "In combination with 'float' and 'position', determines the type of box or boxes that are generated for an element.",
                restriction: "enum",
                values: [
                    {
                        name: "block"
                    },
                    {
                        name: "contents",
                        desc: "The element itself does not generate any boxes, but its children and pseudo-elements still generate boxes as normal.",
                        browsers: "FF37"
                    },
                    {
                        name: "flex",
                        browsers: "E,C29,FF22,IE11,O12.1,S9"
                    },
                    {
                        name: "flexbox",
                        browsers: "O12.1"
                    },
                    {
                        name: "flow-root",
                        browsers: "C58,FF53,O45"
                    },
                    {
                        name: "grid",
                        browsers: "FF52,C57,S10.1,O44"
                    },
                    {
                        name: "inline",
                        desc: "The element generates an inline-level box."
                    },
                    {
                        name: "inline-block"
                    },
                    {
                        name: "inline-flex",
                        browsers: "E,C29,FF22,IE11,O12.1,S9"
                    },
                    {
                        name: "inline-flexbox",
                        browsers: "O12.1"
                    },
                    {
                        name: "inline-table"
                    },
                    {
                        name: "list-item"
                    },
                    {
                        name: "-moz-box",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-deck",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-grid",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-grid-group",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-grid-line",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-groupbox",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-inline-box",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-inline-grid",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-inline-stack",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-marker",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-popup",
                        browsers: "FF"
                    },
                    {
                        name: "-moz-stack",
                        browsers: "FF"
                    },
                    {
                        name: "-ms-flexbox",
                        browsers: "IE10"
                    },
                    {
                        name: "-ms-grid",
                        browsers: "E,IE10"
                    },
                    {
                        name: "-ms-inline-flexbox",
                        browsers: "IE10"
                    },
                    {
                        name: "-ms-inline-grid",
                        browsers: "E,IE10"
                    },
                    {
                        name: "none",
                        desc: "The element and its descendants generates no boxes."
                    },
                    {
                        name: "ruby",
                        desc: "The element generates a principal ruby container box, and establishes a ruby formatting context."
                    },
                    {
                        name: "ruby-base"
                    },
                    {
                        name: "ruby-base-container"
                    },
                    {
                        name: "ruby-text"
                    },
                    {
                        name: "ruby-text-container"
                    },
                    {
                        name: "run-in",
                        browsers: "IE8"
                    },
                    {
                        name: "table"
                    },
                    {
                        name: "table-caption"
                    },
                    {
                        name: "table-cell"
                    },
                    {
                        name: "table-column"
                    },
                    {
                        name: "table-column-group"
                    },
                    {
                        name: "table-footer-group"
                    },
                    {
                        name: "table-header-group"
                    },
                    {
                        name: "table-row"
                    },
                    {
                        name: "table-row-group"
                    },
                    {
                        name: "-webkit-box",
                        browsers: "C,S1"
                    },
                    {
                        name: "-webkit-flex",
                        browsers: "C21,O15,S6.1"
                    },
                    {
                        name: "-webkit-inline-box",
                        browsers: "C,S1"
                    },
                    {
                        name: "-webkit-inline-flex",
                        browsers: "C21,O15,S6.1"
                    }
                ]
            },
            {
                name: "empty-cells",
                desc: "In the separated borders model, this property controls the rendering of borders and backgrounds around cells that have no visible content.",
                browsers: "E,C,FF1,IE7,O4,S1.2",
                restriction: "enum",
                values: [
                    {
                        name: "hide"
                    },
                    {
                        name: "-moz-show-background",
                        browsers: "FF"
                    },
                    {
                        name: "show"
                    }
                ]
            },
            {
                name: "enable-background",
                desc: "Deprecated. Use 'isolation' property instead when support allows. Specifies how the accumulation of the background image is managed.",
                restriction: "integer, length, percentage, enum",
                values: [
                    {
                        name: "accumulate"
                    },
                    {
                        name: "new"
                    }
                ]
            },
            {
                name: "fallback",
                desc: "@counter-style descriptor. Specifies a fallback counter style to be used when the current counter style can’t create a representation for a given counter value.",
                browsers: "FF33",
                restriction: "identifier"
            },
            {
                name: "fill",
                desc: "Paints the interior of the given graphical element.",
                restriction: "color, enum, url",
                values: [
                    {
                        name: "url()",
                        desc: "A URL reference to a paint server element, which is an element that defines a paint server: ‘hatch’, ‘linearGradient’, ‘mesh’, ‘pattern’, ‘radialGradient’ and ‘solidcolor’."
                    }
                ]
            },
            {
                name: "fill-opacity",
                desc: "Specifies the opacity of the painting operation used to paint the interior the current object.",
                restriction: "number(0-1)"
            },
            {
                name: "fill-rule",
                desc: "Indicates the algorithm (or winding rule) which is to be used to determine what parts of the canvas are included inside the shape.",
                restriction: "enum",
                values: [
                    {
                        name: "evenodd"
                    },
                    {
                        name: "nonzero"
                    }
                ]
            },
            {
                name: "filter",
                desc: "Processes an element’s rendering before it is displayed in the document, by applying one or more filter effects.",
                browsers: "E13,FF35",
                restriction: "enum, url",
                values: [
                    {
                        name: "none",
                        desc: "No filter effects are applied."
                    },
                    {
                        name: "blur()"
                    },
                    {
                        name: "brightness()"
                    },
                    {
                        name: "contrast()"
                    },
                    {
                        name: "drop-shadow()"
                    },
                    {
                        name: "grayscale()"
                    },
                    {
                        name: "hue-rotate()"
                    },
                    {
                        name: "invert()"
                    },
                    {
                        name: "opacity()"
                    },
                    {
                        name: "saturate()"
                    },
                    {
                        name: "sepia()"
                    },
                    {
                        name: "url()",
                        desc: "A filter reference to a <filter> element.",
                        browsers: "FF3.6"
                    }
                ]
            },
            {
                name: "flex",
                desc: "Specifies the components of a flexible length: the flex grow factor and flex shrink factor, and the flex basis.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "length, number, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Retrieves the value of the main size property as the used 'flex-basis'."
                    },
                    {
                        name: "content",
                        desc: "Indicates automatic sizing, based on the flex item’s content.",
                        browsers: "E,IE11"
                    },
                    {
                        name: "none",
                        desc: "Expands to '0 0 auto'."
                    }
                ]
            },
            {
                name: "flex-basis",
                desc: "Sets the flex basis.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "length, number, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Retrieves the value of the main size property as the used 'flex-basis'."
                    },
                    {
                        name: "content",
                        desc: "Indicates automatic sizing, based on the flex item’s content.",
                        browsers: "E,IE11"
                    }
                ]
            },
            {
                name: "flex-direction",
                desc: "Specifies how flex items are placed in the flex container, by setting the direction of the flex container’s main axis.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "column",
                        desc: "The flex container’s main axis has the same orientation as the block axis of the current writing mode."
                    },
                    {
                        name: "column-reverse"
                    },
                    {
                        name: "row",
                        desc: "The flex container’s main axis has the same orientation as the inline axis of the current writing mode."
                    },
                    {
                        name: "row-reverse"
                    }
                ]
            },
            {
                name: "flex-flow",
                desc: "Specifies how flexbox items are placed in the flexbox.",
                browsers: "E,C29,FF28,IE11,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "column",
                        desc: "The flex container’s main axis has the same orientation as the block axis of the current writing mode."
                    },
                    {
                        name: "column-reverse"
                    },
                    {
                        name: "nowrap",
                        desc: "The flex container is single-line."
                    },
                    {
                        name: "row",
                        desc: "The flex container’s main axis has the same orientation as the inline axis of the current writing mode."
                    },
                    {
                        name: "row-reverse"
                    },
                    {
                        name: "wrap",
                        desc: "The flexbox is multi-line."
                    },
                    {
                        name: "wrap-reverse"
                    }
                ]
            },
            {
                name: "flex-grow",
                desc: "Sets the flex grow factor. Negative numbers are invalid.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "number"
            },
            {
                name: "flex-shrink",
                desc: "Sets the flex shrink factor. Negative numbers are invalid.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "number"
            },
            {
                name: "flex-wrap",
                desc: "Controls whether the flex container is single-line or multi-line, and the direction of the cross-axis, which determines the direction new lines are stacked in.",
                browsers: "E,C29,FF28,IE11,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "nowrap",
                        desc: "The flex container is single-line."
                    },
                    {
                        name: "wrap",
                        desc: "The flexbox is multi-line."
                    },
                    {
                        name: "wrap-reverse"
                    }
                ]
            },
            {
                name: "float",
                desc: "Specifies how a box should be floated. It may be set for any element, but only applies to elements that generate boxes that are not absolutely positioned.",
                restriction: "enum",
                values: [
                    {
                        name: "inline-end",
                        browsers: "FF55"
                    },
                    {
                        name: "inline-start",
                        browsers: "FF55"
                    },
                    {
                        name: "left",
                        desc: "The element generates a block box that is floated to the left. Content flows on the right side of the box, starting at the top (subject to the 'clear' property)."
                    },
                    {
                        name: "none",
                        desc: "The box is not floated."
                    },
                    {
                        name: "right",
                        desc: "Similar to 'left', except the box is floated to the right, and content flows on the left side of the box, starting at the top."
                    }
                ]
            },
            {
                name: "flood-color",
                desc: "Indicates what color to use to flood the current filter primitive subregion.",
                browsers: "E,C5,FF3,IE10,O9,S6",
                restriction: "color"
            },
            {
                name: "flood-opacity",
                desc: "Indicates what opacity to use to flood the current filter primitive subregion.",
                browsers: "E,C5,FF3,IE10,O9,S6",
                restriction: "number(0-1), percentage"
            },
            {
                name: "font",
                desc: "Shorthand property for setting 'font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', and 'font-family', at the same place in the style sheet. The syntax of this property is based on a traditional typographical shorthand notation to set multiple properties related to fonts.",
                restriction: "font",
                values: [
                    {
                        name: "100"
                    },
                    {
                        name: "200"
                    },
                    {
                        name: "300"
                    },
                    {
                        name: "400"
                    },
                    {
                        name: "500"
                    },
                    {
                        name: "600"
                    },
                    {
                        name: "700"
                    },
                    {
                        name: "800"
                    },
                    {
                        name: "900"
                    },
                    {
                        name: "bold"
                    },
                    {
                        name: "bolder"
                    },
                    {
                        name: "caption"
                    },
                    {
                        name: "icon",
                        desc: "The font used to label icons."
                    },
                    {
                        name: "italic",
                        desc: "Selects a font that is labeled 'italic', or, if that is not available, one labeled 'oblique'."
                    },
                    {
                        name: "large"
                    },
                    {
                        name: "larger"
                    },
                    {
                        name: "lighter"
                    },
                    {
                        name: "medium"
                    },
                    {
                        name: "menu"
                    },
                    {
                        name: "message-box"
                    },
                    {
                        name: "normal",
                        desc: "Specifies a face that is not labeled as a small-caps font."
                    },
                    {
                        name: "oblique",
                        desc: "Selects a font that is labeled 'oblique'."
                    },
                    {
                        name: "small"
                    },
                    {
                        name: "small-caps",
                        desc: "Specifies a font that is labeled as a small-caps font. If a genuine small-caps font is not available, user agents should simulate a small-caps font."
                    },
                    {
                        name: "small-caption"
                    },
                    {
                        name: "smaller"
                    },
                    {
                        name: "status-bar"
                    },
                    {
                        name: "x-large"
                    },
                    {
                        name: "x-small"
                    },
                    {
                        name: "xx-large"
                    },
                    {
                        name: "xx-small"
                    }
                ]
            },
            {
                name: "font-family",
                desc: "Specifies a prioritized list of font family names or generic family names. A user agent iterates through the list of family names until it matches an available font that contains a glyph for the character to be rendered.",
                restriction: "font",
                values: [
                    {
                        name: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
                    },
                    {
                        name: "Arial, Helvetica, sans-serif"
                    },
                    {
                        name: "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"
                    },
                    {
                        name: "'Courier New', Courier, monospace"
                    },
                    {
                        name: "cursive"
                    },
                    {
                        name: "fantasy"
                    },
                    {
                        name: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
                    },
                    {
                        name: "Georgia, 'Times New Roman', Times, serif"
                    },
                    {
                        name: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
                    },
                    {
                        name: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
                    },
                    {
                        name: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif"
                    },
                    {
                        name: "monospace"
                    },
                    {
                        name: "sans-serif"
                    },
                    {
                        name: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    },
                    {
                        name: "serif"
                    },
                    {
                        name: "'Times New Roman', Times, serif"
                    },
                    {
                        name: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
                    },
                    {
                        name: "Verdana, Geneva, Tahoma, sans-serif"
                    }
                ]
            },
            {
                name: "font-feature-settings",
                desc: "Provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.",
                browsers: "E,FF34,IE10",
                restriction: "string, integer",
                values: [
                    {
                        name: "\"aalt\""
                    },
                    {
                        name: "\"abvf\""
                    },
                    {
                        name: "\"abvm\""
                    },
                    {
                        name: "\"abvs\""
                    },
                    {
                        name: "\"afrc\""
                    },
                    {
                        name: "\"akhn\""
                    },
                    {
                        name: "\"blwf\""
                    },
                    {
                        name: "\"blwm\""
                    },
                    {
                        name: "\"blws\""
                    },
                    {
                        name: "\"calt\""
                    },
                    {
                        name: "\"case\""
                    },
                    {
                        name: "\"ccmp\""
                    },
                    {
                        name: "\"cfar\""
                    },
                    {
                        name: "\"cjct\""
                    },
                    {
                        name: "\"clig\""
                    },
                    {
                        name: "\"cpct\""
                    },
                    {
                        name: "\"cpsp\""
                    },
                    {
                        name: "\"cswh\""
                    },
                    {
                        name: "\"curs\""
                    },
                    {
                        name: "\"c2pc\""
                    },
                    {
                        name: "\"c2cs\"",
                        desc: "Small Capitals From Capitals. Applies only to bicameral scripts."
                    },
                    {
                        name: "\"dist\""
                    },
                    {
                        name: "\"dlig\"",
                        desc: "Discretionary ligatures."
                    },
                    {
                        name: "\"dnom\""
                    },
                    {
                        name: "\"dtls\""
                    },
                    {
                        name: "\"expt\""
                    },
                    {
                        name: "\"falt\""
                    },
                    {
                        name: "\"fin2\""
                    },
                    {
                        name: "\"fin3\""
                    },
                    {
                        name: "\"fina\""
                    },
                    {
                        name: "\"flac\""
                    },
                    {
                        name: "\"frac\""
                    },
                    {
                        name: "\"fwid\""
                    },
                    {
                        name: "\"half\""
                    },
                    {
                        name: "\"haln\""
                    },
                    {
                        name: "\"halt\""
                    },
                    {
                        name: "\"hist\""
                    },
                    {
                        name: "\"hkna\""
                    },
                    {
                        name: "\"hlig\""
                    },
                    {
                        name: "\"hngl\""
                    },
                    {
                        name: "\"hojo\""
                    },
                    {
                        name: "\"hwid\""
                    },
                    {
                        name: "\"init\""
                    },
                    {
                        name: "\"isol\""
                    },
                    {
                        name: "\"ital\""
                    },
                    {
                        name: "\"jalt\""
                    },
                    {
                        name: "\"jp78\""
                    },
                    {
                        name: "\"jp83\""
                    },
                    {
                        name: "\"jp90\""
                    },
                    {
                        name: "\"jp04\""
                    },
                    {
                        name: "\"kern\"",
                        desc: "Kerning."
                    },
                    {
                        name: "\"lfbd\""
                    },
                    {
                        name: "\"liga\"",
                        desc: "Standard Ligatures."
                    },
                    {
                        name: "\"ljmo\""
                    },
                    {
                        name: "\"lnum\"",
                        desc: "Lining Figures."
                    },
                    {
                        name: "\"locl\""
                    },
                    {
                        name: "\"ltra\""
                    },
                    {
                        name: "\"ltrm\""
                    },
                    {
                        name: "\"mark\""
                    },
                    {
                        name: "\"med2\""
                    },
                    {
                        name: "\"medi\""
                    },
                    {
                        name: "\"mgrk\""
                    },
                    {
                        name: "\"mkmk\""
                    },
                    {
                        name: "\"nalt\""
                    },
                    {
                        name: "\"nlck\""
                    },
                    {
                        name: "\"nukt\""
                    },
                    {
                        name: "\"numr\""
                    },
                    {
                        name: "\"onum\"",
                        desc: "Oldstyle Figures."
                    },
                    {
                        name: "\"opbd\""
                    },
                    {
                        name: "\"ordn\""
                    },
                    {
                        name: "\"ornm\""
                    },
                    {
                        name: "\"palt\""
                    },
                    {
                        name: "\"pcap\""
                    },
                    {
                        name: "\"pkna\""
                    },
                    {
                        name: "\"pnum\""
                    },
                    {
                        name: "\"pref\""
                    },
                    {
                        name: "\"pres\""
                    },
                    {
                        name: "\"pstf\""
                    },
                    {
                        name: "\"psts\""
                    },
                    {
                        name: "\"pwid\""
                    },
                    {
                        name: "\"qwid\""
                    },
                    {
                        name: "\"rand\""
                    },
                    {
                        name: "\"rclt\""
                    },
                    {
                        name: "\"rlig\""
                    },
                    {
                        name: "\"rkrf\""
                    },
                    {
                        name: "\"rphf\""
                    },
                    {
                        name: "\"rtbd\""
                    },
                    {
                        name: "\"rtla\""
                    },
                    {
                        name: "\"rtlm\""
                    },
                    {
                        name: "\"ruby\""
                    },
                    {
                        name: "\"salt\""
                    },
                    {
                        name: "\"sinf\""
                    },
                    {
                        name: "\"size\""
                    },
                    {
                        name: "\"smcp\"",
                        desc: "Small Capitals. Applies only to bicameral scripts."
                    },
                    {
                        name: "\"smpl\""
                    },
                    {
                        name: "\"ssty\""
                    },
                    {
                        name: "\"stch\""
                    },
                    {
                        name: "\"subs\""
                    },
                    {
                        name: "\"sups\""
                    },
                    {
                        name: "\"swsh\"",
                        desc: "Swash. Does not apply to ideographic scripts."
                    },
                    {
                        name: "\"titl\""
                    },
                    {
                        name: "\"tjmo\""
                    },
                    {
                        name: "\"tnam\""
                    },
                    {
                        name: "\"tnum\"",
                        desc: "Tabular Figures."
                    },
                    {
                        name: "\"trad\""
                    },
                    {
                        name: "\"twid\""
                    },
                    {
                        name: "\"unic\""
                    },
                    {
                        name: "\"valt\""
                    },
                    {
                        name: "\"vatu\""
                    },
                    {
                        name: "\"vert\""
                    },
                    {
                        name: "\"vhal\""
                    },
                    {
                        name: "\"vjmo\""
                    },
                    {
                        name: "\"vkna\""
                    },
                    {
                        name: "\"vkrn\""
                    },
                    {
                        name: "\"vpal\""
                    },
                    {
                        name: "\"vrt2\""
                    },
                    {
                        name: "\"zero\""
                    },
                    {
                        name: "normal",
                        desc: "No change in glyph substitution or positioning occurs."
                    },
                    {
                        name: "off",
                        desc: "Disable feature."
                    },
                    {
                        name: "on",
                        desc: "Enable feature."
                    }
                ]
            },
            {
                name: "font-kerning",
                desc: "Kerning is the contextual adjustment of inter-glyph spacing. This property controls metric kerning, kerning that utilizes adjustment data contained in the font.",
                browsers: "C33,FF34,O20",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Specifies that kerning is applied at the discretion of the user agent."
                    },
                    {
                        name: "none",
                        desc: "Specifies that kerning is not applied."
                    },
                    {
                        name: "normal",
                        desc: "Specifies that kerning is applied."
                    }
                ]
            },
            {
                name: "font-language-override",
                desc: "The value of 'normal' implies that when rendering with OpenType fonts the language of the document is used to infer the OpenType language system, used to select language specific features when rendering.",
                browsers: "FF34",
                restriction: "string",
                values: [
                    {
                        name: "normal",
                        desc: "Implies that when rendering with OpenType fonts the language of the document is used to infer the OpenType language system, used to select language specific features when rendering."
                    }
                ]
            },
            {
                name: "font-size",
                desc: "Indicates the desired height of glyphs from the font. For scalable fonts, the font-size is a scale factor applied to the EM unit of the font. (Note that certain glyphs may bleed outside their EM box.) For non-scalable fonts, the font-size is converted into absolute units and matched against the declared font-size of the font, using the same absolute coordinate space for both of the matched values.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "large"
                    },
                    {
                        name: "larger"
                    },
                    {
                        name: "medium"
                    },
                    {
                        name: "small"
                    },
                    {
                        name: "smaller"
                    },
                    {
                        name: "x-large"
                    },
                    {
                        name: "x-small"
                    },
                    {
                        name: "xx-large"
                    },
                    {
                        name: "xx-small"
                    }
                ]
            },
            {
                name: "font-size-adjust",
                desc: "Preserves the readability of text when font fallback occurs by adjusting the font-size so that the x-height is the same irregardless of the font used.",
                browsers: "E,FF3,IE10",
                restriction: "number",
                values: [
                    {
                        name: "none",
                        desc: "Do not preserve the font’s x-height."
                    }
                ]
            },
            {
                name: "font-stretch",
                desc: "Selects a normal, condensed, or expanded face from a font family.",
                browsers: "E,FF9,IE9",
                restriction: "enum",
                values: [
                    {
                        name: "condensed"
                    },
                    {
                        name: "expanded"
                    },
                    {
                        name: "extra-condensed"
                    },
                    {
                        name: "extra-expanded"
                    },
                    {
                        name: "narrower",
                        browsers: "E,IE10"
                    },
                    {
                        name: "normal"
                    },
                    {
                        name: "semi-condensed"
                    },
                    {
                        name: "semi-expanded"
                    },
                    {
                        name: "ultra-condensed"
                    },
                    {
                        name: "ultra-expanded"
                    },
                    {
                        name: "wider",
                        browsers: "E,IE10"
                    }
                ]
            },
            {
                name: "font-style",
                desc: "Allows italic or oblique faces to be selected. Italic forms are generally cursive in nature while oblique faces are typically sloped versions of the regular face.",
                restriction: "enum",
                values: [
                    {
                        name: "italic",
                        desc: "Selects a font that is labeled as an 'italic' face, or an 'oblique' face if one is not"
                    },
                    {
                        name: "normal",
                        desc: "Selects a face that is classified as 'normal'."
                    },
                    {
                        name: "oblique",
                        desc: "Selects a font that is labeled as an 'oblique' face, or an 'italic' face if one is not."
                    }
                ]
            },
            {
                name: "font-synthesis",
                desc: "Controls whether user agents are allowed to synthesize bold or oblique font faces when a font family lacks bold or italic faces.",
                browsers: "FF34,S9",
                restriction: "enum",
                values: [
                    {
                        name: "none",
                        desc: "Disallow all synthetic faces."
                    },
                    {
                        name: "style",
                        desc: "Allow synthetic italic faces."
                    },
                    {
                        name: "weight"
                    }
                ]
            },
            {
                name: "font-variant",
                desc: "Specifies variant representations of the font",
                restriction: "enum",
                values: [
                    {
                        name: "normal",
                        desc: "Specifies a face that is not labeled as a small-caps font."
                    },
                    {
                        name: "small-caps",
                        desc: "Specifies a font that is labeled as a small-caps font. If a genuine small-caps font is not available, user agents should simulate a small-caps font."
                    }
                ]
            },
            {
                name: "font-variant-alternates",
                desc: "For any given character, fonts can provide a variety of alternate glyphs in addition to the default glyph for that character. This property provides control over the selection of these alternate glyphs.",
                browsers: "FF34",
                restriction: "enum",
                values: [
                    {
                        name: "annotation()"
                    },
                    {
                        name: "character-variant()"
                    },
                    {
                        name: "historical-forms"
                    },
                    {
                        name: "normal",
                        desc: "None of the features are enabled."
                    },
                    {
                        name: "ornaments()"
                    },
                    {
                        name: "styleset()"
                    },
                    {
                        name: "stylistic()"
                    },
                    {
                        name: "swash()"
                    }
                ]
            },
            {
                name: "font-variant-caps",
                desc: "Specifies control over capitalized forms.",
                browsers: "FF34",
                restriction: "enum",
                values: [
                    {
                        name: "all-petite-caps"
                    },
                    {
                        name: "all-small-caps"
                    },
                    {
                        name: "normal",
                        desc: "None of the features are enabled."
                    },
                    {
                        name: "petite-caps"
                    },
                    {
                        name: "small-caps",
                        desc: "Enables display of small capitals. Small-caps glyphs typically use the form of uppercase letters but are reduced to the size of lowercase letters."
                    },
                    {
                        name: "titling-caps"
                    },
                    {
                        name: "unicase"
                    }
                ]
            },
            {
                name: "font-variant-east-asian",
                desc: "Allows control of glyph substitute and positioning in East Asian text.",
                browsers: "FF34",
                restriction: "enum",
                values: [
                    {
                        name: "full-width"
                    },
                    {
                        name: "jis04"
                    },
                    {
                        name: "jis78"
                    },
                    {
                        name: "jis83"
                    },
                    {
                        name: "jis90"
                    },
                    {
                        name: "normal",
                        desc: "None of the features are enabled."
                    },
                    {
                        name: "proportional-width"
                    },
                    {
                        name: "ruby",
                        desc: "Enables display of ruby variant glyphs."
                    },
                    {
                        name: "simplified"
                    },
                    {
                        name: "traditional"
                    }
                ]
            },
            {
                name: "font-variant-ligatures",
                desc: "Specifies control over which ligatures are enabled or disabled. A value of ‘normal’ implies that the defaults set by the font are used.",
                browsers: "C18,FF34,O15,S6",
                restriction: "enum",
                values: [
                    {
                        name: "additional-ligatures"
                    },
                    {
                        name: "common-ligatures"
                    },
                    {
                        name: "contextual",
                        browsers: "C35,F34,O22"
                    },
                    {
                        name: "discretionary-ligatures"
                    },
                    {
                        name: "historical-ligatures"
                    },
                    {
                        name: "no-additional-ligatures"
                    },
                    {
                        name: "no-common-ligatures"
                    },
                    {
                        name: "no-contextual",
                        browsers: "C35,F34,O22"
                    },
                    {
                        name: "no-discretionary-ligatures"
                    },
                    {
                        name: "no-historical-ligatures"
                    },
                    {
                        name: "none",
                        desc: "Disables all ligatures.",
                        browsers: "FF34"
                    },
                    {
                        name: "normal",
                        desc: "Implies that the defaults set by the font are used."
                    }
                ]
            },
            {
                name: "font-variant-numeric",
                desc: "Specifies control over numerical forms.",
                browsers: "FF34",
                restriction: "enum",
                values: [
                    {
                        name: "diagonal-fractions"
                    },
                    {
                        name: "lining-nums"
                    },
                    {
                        name: "normal",
                        desc: "None of the features are enabled."
                    },
                    {
                        name: "oldstyle-nums"
                    },
                    {
                        name: "ordinal"
                    },
                    {
                        name: "proportional-nums"
                    },
                    {
                        name: "slashed-zero"
                    },
                    {
                        name: "stacked-fractions"
                    },
                    {
                        name: "tabular-nums"
                    }
                ]
            },
            {
                name: "font-variant-position",
                desc: "Specifies the vertical position",
                browsers: "FF34",
                restriction: "enum",
                values: [
                    {
                        name: "normal",
                        desc: "None of the features are enabled."
                    },
                    {
                        name: "sub",
                        desc: "Enables display of subscript variants (OpenType feature: subs)."
                    },
                    {
                        name: "super",
                        desc: "Enables display of superscript variants (OpenType feature: sups)."
                    }
                ]
            },
            {
                name: "font-weight",
                desc: "Specifies weight of glyphs in the font, their degree of blackness or stroke thickness.",
                restriction: "enum",
                values: [
                    {
                        name: "100"
                    },
                    {
                        name: "200"
                    },
                    {
                        name: "300"
                    },
                    {
                        name: "400"
                    },
                    {
                        name: "500"
                    },
                    {
                        name: "600"
                    },
                    {
                        name: "700"
                    },
                    {
                        name: "800"
                    },
                    {
                        name: "900"
                    },
                    {
                        name: "bold"
                    },
                    {
                        name: "bolder"
                    },
                    {
                        name: "lighter"
                    },
                    {
                        name: "normal",
                        desc: "Same as 400"
                    }
                ]
            },
            {
                name: "glyph-orientation-horizontal",
                desc: "Controls glyph orientation when the inline-progression-direction is horizontal.",
                restriction: "angle, number"
            },
            {
                name: "glyph-orientation-vertical",
                desc: "Controls glyph orientation when the inline-progression-direction is vertical.",
                restriction: "angle, number, enum",
                values: [
                    {
                        name: "auto",
                        desc: "Sets the orientation based on the fullwidth or non-fullwidth characters and the most common orientation."
                    }
                ]
            },
            {
                name: "grid-area",
                desc: "Determine a grid item’s size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement. Shorthand for 'grid-row-start', 'grid-column-start', 'grid-row-end', and 'grid-column-end'.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, integer",
                values: [
                    {
                        name: "auto",
                        desc: "The property contributes nothing to the grid item’s placement, indicating auto-placement, an automatic span, or a default span of one."
                    },
                    {
                        name: "span"
                    }
                ]
            },
            {
                name: "grid",
                desc: "The grid CSS property is a shorthand property that sets all of the explicit grid properties ('grid-template-rows', 'grid-template-columns', and 'grid-template-areas'), and all the implicit grid properties ('grid-auto-rows', 'grid-auto-columns', and 'grid-auto-flow'), in a single declaration.",
                browsers: "FF52,C57,E16,S10.1,O44",
                restriction: "identifier, length, percentage, string, enum"
            },
            {
                name: "grid-auto-columns",
                desc: "Specifies the size of implicitly created columns.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "length, percentage",
                values: [
                    {
                        name: "min-content",
                        desc: "Represents the largest min-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "max-content",
                        desc: "Represents the largest max-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "auto",
                        desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track."
                    },
                    {
                        name: "minmax()"
                    }
                ]
            },
            {
                name: "grid-auto-flow",
                desc: "Controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "enum",
                values: [
                    {
                        name: "row",
                        desc: "The auto-placement algorithm places items by filling each row in turn, adding new rows as necessary."
                    },
                    {
                        name: "column",
                        desc: "The auto-placement algorithm places items by filling each column in turn, adding new columns as necessary."
                    },
                    {
                        name: "dense"
                    }
                ]
            },
            {
                name: "grid-auto-rows",
                desc: "Specifies the size of implicitly created rows.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "length, percentage",
                values: [
                    {
                        name: "min-content",
                        desc: "Represents the largest min-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "max-content",
                        desc: "Represents the largest max-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "auto",
                        desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track."
                    },
                    {
                        name: "minmax()"
                    }
                ]
            },
            {
                name: "grid-column",
                desc: "Shorthand for 'grid-column-start' and 'grid-column-end'.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The property contributes nothing to the grid item’s placement, indicating auto-placement, an automatic span, or a default span of one."
                    },
                    {
                        name: "span"
                    }
                ]
            },
            {
                name: "grid-column-end",
                desc: "Determine a grid item’s size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The property contributes nothing to the grid item’s placement, indicating auto-placement, an automatic span, or a default span of one."
                    },
                    {
                        name: "span"
                    }
                ]
            },
            {
                name: "grid-column-gap",
                desc: "Specifies the gutters between grid columns.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "length"
            },
            {
                name: "grid-column-start",
                desc: "Determine a grid item’s size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The property contributes nothing to the grid item’s placement, indicating auto-placement, an automatic span, or a default span of one."
                    },
                    {
                        name: "span"
                    }
                ]
            },
            {
                name: "grid-gap",
                desc: "Shorthand that specifies the gutters between grid columns and grid rows in one declaration.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "length"
            },
            {
                name: "grid-row",
                desc: "Shorthand for 'grid-row-start' and 'grid-row-end'.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The property contributes nothing to the grid item’s placement, indicating auto-placement, an automatic span, or a default span of one."
                    },
                    {
                        name: "span"
                    }
                ]
            },
            {
                name: "grid-row-end",
                desc: "Determine a grid item’s size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The property contributes nothing to the grid item’s placement, indicating auto-placement, an automatic span, or a default span of one."
                    },
                    {
                        name: "span"
                    }
                ]
            },
            {
                name: "grid-row-gap",
                desc: "Specifies the gutters between grid rows.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "length"
            },
            {
                name: "grid-row-start",
                desc: "Determine a grid item’s size and location within the grid by contributing a line, a span, or nothing (automatic) to its grid placement.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The property contributes nothing to the grid item’s placement, indicating auto-placement, an automatic span, or a default span of one."
                    },
                    {
                        name: "span"
                    }
                ]
            },
            {
                name: "grid-template",
                desc: "Shorthand for setting grid-template-columns, grid-template-rows, and grid-template-areas in a single declaration.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, length, percentage, string, enum",
                values: [
                    {
                        name: "none",
                        desc: "Sets all three properties to their initial values."
                    },
                    {
                        name: "min-content",
                        desc: "Represents the largest min-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "max-content",
                        desc: "Represents the largest max-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "auto",
                        desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track."
                    },
                    {
                        name: "subgrid",
                        desc: "Sets 'grid-template-rows' and 'grid-template-columns' to 'subgrid', and 'grid-template-areas' to its initial value."
                    },
                    {
                        name: "minmax()"
                    },
                    {
                        name: "repeat()",
                        desc: "Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form."
                    }
                ]
            },
            {
                name: "grid-template-areas",
                desc: "Specifies named grid areas, which are not associated with any particular grid item, but can be referenced from the grid-placement properties.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "string",
                values: [
                    {
                        name: "none",
                        desc: "The grid container doesn’t define any named grid areas."
                    }
                ]
            },
            {
                name: "grid-template-columns",
                desc: "specifies, as a space-separated track list, the line names and track sizing functions of the grid.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, length, percentage, enum",
                values: [
                    {
                        name: "none",
                        desc: "There is no explicit grid; any rows/columns will be implicitly generated."
                    },
                    {
                        name: "min-content",
                        desc: "Represents the largest min-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "max-content",
                        desc: "Represents the largest max-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "auto",
                        desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track."
                    },
                    {
                        name: "subgrid",
                        desc: "Indicates that the grid will align to its parent grid in that axis."
                    },
                    {
                        name: "minmax()"
                    },
                    {
                        name: "repeat()",
                        desc: "Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form."
                    }
                ]
            },
            {
                name: "grid-template-rows",
                desc: "specifies, as a space-separated track list, the line names and track sizing functions of the grid.",
                browsers: "FF52,C57,S10.1,O44",
                restriction: "identifier, length, percentage, string, enum",
                values: [
                    {
                        name: "none",
                        desc: "There is no explicit grid; any rows/columns will be implicitly generated."
                    },
                    {
                        name: "min-content",
                        desc: "Represents the largest min-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "max-content",
                        desc: "Represents the largest max-content contribution of the grid items occupying the grid track."
                    },
                    {
                        name: "auto",
                        desc: "As a maximum, identical to 'max-content'. As a minimum, represents the largest minimum size (as specified by min-width/min-height) of the grid items occupying the grid track."
                    },
                    {
                        name: "subgrid",
                        desc: "Indicates that the grid will align to its parent grid in that axis."
                    },
                    {
                        name: "minmax()"
                    },
                    {
                        name: "repeat()",
                        desc: "Represents a repeated fragment of the track list, allowing a large number of columns or rows that exhibit a recurring pattern to be written in a more compact form."
                    }
                ]
            },
            {
                name: "height",
                desc: "Specifies the height of the content area, padding area or border area (depending on 'box-sizing') of certain boxes.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "The height depends on the values of other properties."
                    },
                    {
                        name: "fit-content",
                        browsers: "C46,O33"
                    },
                    {
                        name: "max-content",
                        desc: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    },
                    {
                        name: "min-content",
                        desc: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    }
                ]
            },
            {
                name: "hyphens",
                desc: "Controls whether hyphenation is allowed to create more break opportunities within a line of text.",
                browsers: "C55,FF43,O44",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word."
                    },
                    {
                        name: "manual"
                    },
                    {
                        name: "none",
                        desc: "Words are not broken at line breaks, even if characters inside the word suggest line break points."
                    }
                ]
            },
            {
                name: "image-orientation",
                desc: "Specifies an orthogonal rotation to be applied to an image before it is laid out.",
                browsers: "FF26",
                restriction: "angle",
                values: [
                    {
                        name: "flip"
                    },
                    {
                        name: "from-image"
                    }
                ]
            },
            {
                name: "image-rendering",
                desc: "Provides a hint to the user-agent about what aspects of an image are most important to preserve when the image is scaled, to aid the user-agent in the choice of an appropriate scaling algorithm.",
                browsers: "C,FF3.6,O11.6,S",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The image should be scaled with an algorithm that maximizes the appearance of the image."
                    },
                    {
                        name: "crisp-edges"
                    },
                    {
                        name: "-moz-crisp-edges",
                        browsers: "FF"
                    },
                    {
                        name: "optimizeQuality"
                    },
                    {
                        name: "optimizeSpeed",
                        desc: "Deprecated."
                    },
                    {
                        name: "pixelated"
                    }
                ]
            },
            {
                name: "ime-mode",
                desc: "Controls the state of the input method editor for text fields.",
                browsers: "E,FF3,IE5",
                restriction: "enum",
                values: [
                    {
                        name: "active"
                    },
                    {
                        name: "auto",
                        desc: "No change is made to the current input method editor state. This is the default."
                    },
                    {
                        name: "disabled"
                    },
                    {
                        name: "inactive"
                    },
                    {
                        name: "normal",
                        desc: "The IME state should be normal; this value can be used in a user style sheet to override the page setting."
                    }
                ]
            },
            {
                name: "inline-size",
                desc: "Logical 'height'. Mapping depends on the element’s 'writing-mode'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Depends on the values of other properties."
                    }
                ]
            },
            {
                name: "isolation",
                desc: "In CSS setting to 'isolate' will turn the element into a stacking context. In SVG, it defines whether an element is isolated or not.",
                browsers: "C,FF,O,S",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Elements are not isolated unless an operation is applied that causes the creation of a stacking context."
                    },
                    {
                        name: "isolate",
                        desc: "In CSS will turn the element into a stacking context."
                    }
                ]
            },
            {
                name: "justify-content",
                desc: "Aligns flex items along the main axis of the current line of the flex container.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "start",
                        desc: "The items are packed flush to each other toward the start edge of the alignment container in the main axis."
                    },
                    {
                        name: "end",
                        desc: "The items are packed flush to each other toward the end edge of the alignment container in the main axis."
                    },
                    {
                        name: "left",
                        desc: "The items are packed flush to each other toward the left edge of the alignment container in the main axis."
                    },
                    {
                        name: "right",
                        desc: "The items are packed flush to each other toward the right edge of the alignment container in the main axis."
                    },
                    {
                        name: "safe"
                    },
                    {
                        name: "unsafe"
                    },
                    {
                        name: "stretch",
                        desc: "If the combined size of the alignment subjects is less than the size of the alignment container, any auto-sized alignment subjects have their size increased equally (not proportionally), while still respecting the constraints imposed by max-height/max-width (or equivalent functionality), so that the combined size exactly fills the alignment container."
                    },
                    {
                        name: "space-evenly"
                    },
                    {
                        name: "flex-end",
                        desc: "Flex items are packed toward the end of the line."
                    },
                    {
                        name: "flex-start",
                        desc: "Flex items are packed toward the start of the line."
                    },
                    {
                        name: "space-around",
                        desc: "Flex items are evenly distributed in the line, with half-size spaces on either end."
                    },
                    {
                        name: "space-between",
                        desc: "Flex items are evenly distributed in the line."
                    },
                    {
                        name: "unsafe"
                    },
                    {
                        name: "baseline",
                        desc: "Specifies participation in first-baseline alignment."
                    },
                    {
                        name: "first baseline",
                        desc: "Specifies participation in first-baseline alignment."
                    },
                    {
                        name: "last baseline",
                        desc: "Specifies participation in last-baseline alignment."
                    }
                ]
            },
            {
                name: "kerning",
                desc: "Indicates whether the user agent should adjust inter-glyph spacing based on kerning tables that are included in the relevant font or instead disable auto-kerning and set inter-character spacing to a specific length.",
                restriction: "length, enum",
                values: [
                    {
                        name: "auto",
                        desc: "Indicates that the user agent should adjust inter-glyph spacing based on kerning tables that are included in the font that will be used."
                    }
                ]
            },
            {
                name: "left",
                desc: "Specifies how far an absolutely positioned box's left margin edge is offset to the right of the left edge of the box's 'containing block'.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well"
                    }
                ]
            },
            {
                name: "letter-spacing",
                desc: "Specifies the minimum, maximum, and optimal spacing between grapheme clusters.",
                restriction: "length",
                values: [
                    {
                        name: "normal",
                        desc: "The spacing is the normal spacing for the current font. It is typically zero-length."
                    }
                ]
            },
            {
                name: "lighting-color",
                desc: "Defines the color of the light source for filter primitives 'feDiffuseLighting' and 'feSpecularLighting'.",
                browsers: "E,C5,FF3,IE10,O9,S6",
                restriction: "color"
            },
            {
                name: "line-break",
                desc: "Specifies what set of line breaking restrictions are in effect within the element.",
                browsers: "E,IE5.5,C58,O45,S",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The UA determines the set of line-breaking restrictions to use for CJK scripts, and it may vary the restrictions based on the length of the line; e.g., use a less restrictive set of line-break rules for short lines."
                    },
                    {
                        name: "loose",
                        desc: "Breaks text using the least restrictive set of line-breaking rules. Typically used for short lines, such as in newspapers."
                    },
                    {
                        name: "normal",
                        desc: "Breaks text using the most common set of line-breaking rules."
                    },
                    {
                        name: "strict",
                        desc: "Breaks CJK scripts using a more restrictive set of line-breaking rules than 'normal'."
                    }
                ]
            },
            {
                name: "line-height",
                desc: "Determines the block-progression dimension of the text content area of an inline box.",
                restriction: "number, length, percentage",
                values: [
                    {
                        name: "normal",
                        desc: "Tells user agents to set the computed value to a 'reasonable' value based on the font size of the element."
                    }
                ]
            },
            {
                name: "list-style",
                desc: "Shorthand for setting 'list-style-type', 'list-style-position' and 'list-style-image'",
                restriction: "image, enum, url",
                values: [
                    {
                        name: "armenian"
                    },
                    {
                        name: "circle"
                    },
                    {
                        name: "decimal"
                    },
                    {
                        name: "decimal-leading-zero"
                    },
                    {
                        name: "disc"
                    },
                    {
                        name: "georgian"
                    },
                    {
                        name: "inside"
                    },
                    {
                        name: "lower-alpha"
                    },
                    {
                        name: "lower-greek"
                    },
                    {
                        name: "lower-latin"
                    },
                    {
                        name: "lower-roman"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "outside"
                    },
                    {
                        name: "square",
                        desc: "A filled square."
                    },
                    {
                        name: "symbols()",
                        browsers: "FF35"
                    },
                    {
                        name: "upper-alpha"
                    },
                    {
                        name: "upper-latin"
                    },
                    {
                        name: "upper-roman"
                    },
                    {
                        name: "url()"
                    }
                ]
            },
            {
                name: "list-style-image",
                desc: "Sets the image that will be used as the list item marker. When the image is available, it will replace the marker set with the 'list-style-type' marker.",
                restriction: "image",
                values: [
                    {
                        name: "none",
                        desc: "The default contents of the of the list item’s marker are given by 'list-style-type' instead."
                    }
                ]
            },
            {
                name: "list-style-position",
                desc: "Specifies the position of the '::marker' pseudo-element's box in the list item.",
                restriction: "enum",
                values: [
                    {
                        name: "inside"
                    },
                    {
                        name: "outside"
                    }
                ]
            },
            {
                name: "list-style-type",
                desc: "Used to construct the default contents of a list item’s marker",
                restriction: "enum, string",
                values: [
                    {
                        name: "armenian",
                        desc: "Traditional uppercase Armenian numbering."
                    },
                    {
                        name: "circle"
                    },
                    {
                        name: "decimal",
                        desc: "Western decimal numbers."
                    },
                    {
                        name: "decimal-leading-zero",
                        desc: "Decimal numbers padded by initial zeros."
                    },
                    {
                        name: "disc"
                    },
                    {
                        name: "georgian",
                        desc: "Traditional Georgian numbering."
                    },
                    {
                        name: "lower-alpha",
                        desc: "Lowercase ASCII letters."
                    },
                    {
                        name: "lower-greek",
                        desc: "Lowercase classical Greek."
                    },
                    {
                        name: "lower-latin",
                        desc: "Lowercase ASCII letters."
                    },
                    {
                        name: "lower-roman",
                        desc: "Lowercase ASCII Roman numerals."
                    },
                    {
                        name: "none",
                        desc: "No marker"
                    },
                    {
                        name: "square",
                        desc: "A filled square."
                    },
                    {
                        name: "symbols()",
                        browsers: "FF35"
                    },
                    {
                        name: "upper-alpha",
                        desc: "Uppercase ASCII letters."
                    },
                    {
                        name: "upper-latin",
                        desc: "Uppercase ASCII letters."
                    },
                    {
                        name: "upper-roman",
                        desc: "Uppercase ASCII Roman numerals."
                    }
                ]
            },
            {
                name: "margin",
                desc: "Shorthand property to set values the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "margin-block-end",
                desc: "Logical 'margin-bottom'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "margin-block-start",
                desc: "Logical 'margin-top'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "margin-bottom",
                desc: "Shorthand property to set values the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "margin-inline-end",
                desc: "Logical 'margin-right'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "margin-inline-start",
                desc: "Logical 'margin-left'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "margin-left",
                desc: "Shorthand property to set values the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "margin-right",
                desc: "Shorthand property to set values the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "margin-top",
                desc: "Shorthand property to set values the thickness of the margin area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. Negative values for margin properties are allowed, but there may be implementation-specific limits..",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "marker",
                desc: "Specifies the marker symbol that shall be used for all points on the sets the value for all vertices on the given ‘path’ element or basic shape.",
                restriction: "url",
                values: [
                    {
                        name: "none",
                        desc: "Indicates that no marker symbol will be drawn at the given vertex or vertices."
                    },
                    {
                        name: "url()",
                        desc: "Indicates that the <marker> element referenced will be used."
                    }
                ]
            },
            {
                name: "marker-end",
                desc: "Specifies the marker that will be drawn at the last vertices of the given markable element.",
                restriction: "url",
                values: [
                    {
                        name: "none",
                        desc: "Indicates that no marker symbol will be drawn at the given vertex or vertices."
                    },
                    {
                        name: "url()",
                        desc: "Indicates that the <marker> element referenced will be used."
                    }
                ]
            },
            {
                name: "marker-mid",
                desc: "Specifies the marker that will be drawn at all vertices except the first and last.",
                restriction: "url",
                values: [
                    {
                        name: "none",
                        desc: "Indicates that no marker symbol will be drawn at the given vertex or vertices."
                    },
                    {
                        name: "url()",
                        desc: "Indicates that the <marker> element referenced will be used."
                    }
                ]
            },
            {
                name: "marker-start",
                desc: "Specifies the marker that will be drawn at the first vertices of the given markable element.",
                restriction: "url",
                values: [
                    {
                        name: "none",
                        desc: "Indicates that no marker symbol will be drawn at the given vertex or vertices."
                    },
                    {
                        name: "url()",
                        desc: "Indicates that the <marker> element referenced will be used."
                    }
                ]
            },
            {
                name: "mask-image",
                desc: "Sets the mask layer image of an element.",
                browsers: "E,FF53",
                restriction: "url, image, enum",
                values: [
                    {
                        name: "none",
                        desc: "Counts as a transparent black image layer."
                    },
                    {
                        name: "url()",
                        desc: "Reference to a <mask element or to a CSS image."
                    }
                ]
            },
            {
                name: "mask-mode",
                desc: "Indicates whether the mask layer image is treated as luminance mask or alpha mask.",
                browsers: "FF53",
                restriction: "url, image, enum",
                values: [
                    {
                        name: "alpha",
                        desc: "Alpha values of the mask layer image should be used as the mask values."
                    },
                    {
                        name: "auto",
                        desc: "Use alpha values if 'mask-image' is an image, luminance if a <mask> element or a CSS image."
                    },
                    {
                        name: "luminance",
                        desc: "Luminance values of the mask layer image should be used as the mask values."
                    }
                ]
            },
            {
                name: "mask-origin",
                desc: "Specifies the mask positioning area.",
                browsers: "FF53",
                restriction: "geometry-box, enum"
            },
            {
                name: "mask-position",
                desc: "Specifies how mask layer images are positioned.",
                browsers: "FF53",
                restriction: "position, length, percentage"
            },
            {
                name: "mask-repeat",
                desc: "Specifies how mask layer images are tiled after they have been sized and positioned.",
                browsers: "FF53",
                restriction: "repeat"
            },
            {
                name: "mask-size",
                desc: "Specifies the size of the mask layer images.",
                browsers: "F53",
                restriction: "length, percentage, enum",
                values: [
                    {
                        name: "auto",
                        desc: "Resolved by using the image’s intrinsic ratio and the size of the other dimension, or failing that, using the image’s intrinsic size, or failing that, treating it as 100%."
                    },
                    {
                        name: "contain",
                        desc: "Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area."
                    },
                    {
                        name: "cover",
                        desc: "Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area."
                    }
                ]
            },
            {
                name: "mask-type",
                desc: "Defines whether the content of the <mask> element is treated as as luminance mask or alpha mask.",
                browsers: "C24,FF35,O15,S7",
                restriction: "enum",
                values: [
                    {
                        name: "alpha",
                        desc: "Indicates that the alpha values of the mask should be used."
                    },
                    {
                        name: "luminance",
                        desc: "Indicates that the luminance values of the mask should be used."
                    }
                ]
            },
            {
                name: "max-block-size",
                desc: "Logical 'max-width'. Mapping depends on the element’s 'writing-mode'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "none",
                        desc: "No limit on the width of the box."
                    }
                ]
            },
            {
                name: "max-height",
                desc: "Allows authors to constrain content height to a certain range.",
                browsers: "E,C,FF1,IE7,O7,S1",
                restriction: "length, percentage",
                values: [
                    {
                        name: "none",
                        desc: "No limit on the height of the box."
                    },
                    {
                        name: "fit-content",
                        browsers: "C46,O33"
                    },
                    {
                        name: "max-content",
                        desc: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    },
                    {
                        name: "min-content",
                        desc: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    }
                ]
            },
            {
                name: "max-inline-size",
                desc: "Logical 'max-height'. Mapping depends on the element’s 'writing-mode'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "none",
                        desc: "No limit on the height of the box."
                    }
                ]
            },
            {
                name: "max-width",
                desc: "Allows authors to constrain content width to a certain range.",
                browsers: "E,C,FF1,IE7,O7,S1",
                restriction: "length, percentage",
                values: [
                    {
                        name: "none",
                        desc: "No limit on the width of the box."
                    },
                    {
                        name: "fit-content",
                        browsers: "C46,O33"
                    },
                    {
                        name: "max-content",
                        desc: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    },
                    {
                        name: "min-content",
                        desc: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    }
                ]
            },
            {
                name: "min-block-size",
                desc: "Logical 'min-width'. Mapping depends on the element’s 'writing-mode'.",
                browsers: "FF41",
                restriction: "length, percentage"
            },
            {
                name: "min-height",
                desc: "Allows authors to constrain content height to a certain range.",
                browsers: "E,C,FF1,IE7,O7,S1",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        browsers: "E,IE11"
                    },
                    {
                        name: "fit-content",
                        browsers: "C46,O33"
                    },
                    {
                        name: "max-content",
                        desc: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    },
                    {
                        name: "min-content",
                        desc: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    }
                ]
            },
            {
                name: "min-inline-size",
                desc: "Logical 'min-height'. Mapping depends on the element’s 'writing-mode'.",
                browsers: "FF41",
                restriction: "length, percentage"
            },
            {
                name: "min-width",
                desc: "Allows authors to constrain content width to a certain range.",
                browsers: "E,C,FF1,IE7,O7,S1",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        browsers: "E,IE11"
                    },
                    {
                        name: "fit-content",
                        browsers: "C46,O33"
                    },
                    {
                        name: "max-content",
                        desc: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    },
                    {
                        name: "min-content",
                        desc: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    }
                ]
            },
            {
                name: "mix-blend-mode",
                desc: "Defines the formula that must be used to mix the colors with the backdrop.",
                browsers: "C41,FF32,O29,S7.1",
                restriction: "enum",
                values: [
                    {
                        name: "normal",
                        desc: "Default attribute which specifies no blending"
                    },
                    {
                        name: "multiply"
                    },
                    {
                        name: "screen"
                    },
                    {
                        name: "overlay"
                    },
                    {
                        name: "darken"
                    },
                    {
                        name: "lighten"
                    },
                    {
                        name: "color-dodge"
                    },
                    {
                        name: "color-burn"
                    },
                    {
                        name: "hard-light"
                    },
                    {
                        name: "soft-light"
                    },
                    {
                        name: "difference"
                    },
                    {
                        name: "exclusion"
                    },
                    {
                        name: "hue",
                        browsers: "C41,FF32,O29"
                    },
                    {
                        name: "saturation",
                        browsers: "C41,FF32,O29"
                    },
                    {
                        name: "color",
                        browsers: "C41,FF32,O29"
                    },
                    {
                        name: "luminosity",
                        browsers: "C41,FF32,O29"
                    }
                ]
            },
            {
                name: "motion",
                desc: "Shorthand property for setting 'motion-path', 'motion-offset' and 'motion-rotation'.",
                browsers: "C46,O33",
                restriction: "url, length, percentage, angle, shape, geometry-box, enum",
                values: [
                    {
                        name: "none",
                        desc: "No motion path gets created."
                    },
                    {
                        name: "path()"
                    },
                    {
                        name: "auto",
                        desc: "Indicates that the object is rotated by the angle of the direction of the motion path."
                    },
                    {
                        name: "reverse",
                        desc: "Indicates that the object is rotated by the angle of the direction of the motion path plus 180 degrees."
                    }
                ]
            },
            {
                name: "motion-offset",
                desc: "A distance that describes the position along the specified motion path.",
                browsers: "C46,O33",
                restriction: "length, percentage"
            },
            {
                name: "motion-path",
                desc: "Specifies the motion path the element gets positioned at.",
                browsers: "C46,O33",
                restriction: "url, shape, geometry-box, enum",
                values: [
                    {
                        name: "none",
                        desc: "No motion path gets created."
                    },
                    {
                        name: "path()"
                    }
                ]
            },
            {
                name: "motion-rotation",
                desc: "Defines the direction of the element while positioning along the motion path.",
                browsers: "C46,O33",
                restriction: "angle",
                values: [
                    {
                        name: "auto",
                        desc: "Indicates that the object is rotated by the angle of the direction of the motion path."
                    },
                    {
                        name: "reverse",
                        desc: "Indicates that the object is rotated by the angle of the direction of the motion path plus 180 degrees."
                    }
                ]
            },
            {
                name: "-moz-animation",
                desc: "Shorthand property combines six of the animation properties into a single property.",
                browsers: "FF9",
                restriction: "time, enum, timing-function, identifier, number",
                values: [
                    {
                        name: "alternate"
                    },
                    {
                        name: "alternate-reverse"
                    },
                    {
                        name: "backwards"
                    },
                    {
                        name: "both",
                        desc: "Both forwards and backwards fill modes are applied."
                    },
                    {
                        name: "forwards"
                    },
                    {
                        name: "infinite",
                        desc: "Causes the animation to repeat forever."
                    },
                    {
                        name: "none",
                        desc: "No animation is performed"
                    },
                    {
                        name: "normal",
                        desc: "Normal playback."
                    },
                    {
                        name: "reverse",
                        desc: "All iterations of the animation are played in the reverse direction from the way they were specified."
                    }
                ]
            },
            {
                name: "-moz-animation-delay",
                desc: "Defines when the animation will start.",
                browsers: "FF9",
                restriction: "time"
            },
            {
                name: "-moz-animation-direction",
                desc: "Defines whether or not the animation should play in reverse on alternate cycles.",
                browsers: "FF9",
                restriction: "enum",
                values: [
                    {
                        name: "alternate"
                    },
                    {
                        name: "alternate-reverse"
                    },
                    {
                        name: "normal",
                        desc: "Normal playback."
                    },
                    {
                        name: "reverse",
                        desc: "All iterations of the animation are played in the reverse direction from the way they were specified."
                    }
                ]
            },
            {
                name: "-moz-animation-duration",
                desc: "Defines the length of time that an animation takes to complete one cycle.",
                browsers: "FF9",
                restriction: "time"
            },
            {
                name: "-moz-animation-iteration-count",
                desc: "Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.",
                browsers: "FF9",
                restriction: "number, enum",
                values: [
                    {
                        name: "infinite",
                        desc: "Causes the animation to repeat forever."
                    }
                ]
            },
            {
                name: "-moz-animation-name",
                desc: "Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.",
                browsers: "FF9",
                restriction: "identifier, enum",
                values: [
                    {
                        name: "none",
                        desc: "No animation is performed"
                    }
                ]
            },
            {
                name: "-moz-animation-play-state",
                desc: "Defines whether the animation is running or paused.",
                browsers: "FF9",
                restriction: "enum",
                values: [
                    {
                        name: "paused"
                    },
                    {
                        name: "running"
                    }
                ]
            },
            {
                name: "-moz-animation-timing-function",
                desc: "Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'.",
                browsers: "FF9",
                restriction: "timing-function"
            },
            {
                name: "-moz-appearance",
                desc: "Used in Gecko (Firefox) to display an element using a platform-native styling based on the operating system's theme.",
                browsers: "FF1",
                restriction: "enum",
                values: [
                    {
                        name: "button"
                    },
                    {
                        name: "button-arrow-down"
                    },
                    {
                        name: "button-arrow-next"
                    },
                    {
                        name: "button-arrow-previous"
                    },
                    {
                        name: "button-arrow-up"
                    },
                    {
                        name: "button-bevel"
                    },
                    {
                        name: "checkbox"
                    },
                    {
                        name: "checkbox-container"
                    },
                    {
                        name: "checkbox-label"
                    },
                    {
                        name: "dialog"
                    },
                    {
                        name: "groupbox"
                    },
                    {
                        name: "listbox"
                    },
                    {
                        name: "menuarrow"
                    },
                    {
                        name: "menuimage"
                    },
                    {
                        name: "menuitem"
                    },
                    {
                        name: "menuitemtext"
                    },
                    {
                        name: "menulist"
                    },
                    {
                        name: "menulist-button"
                    },
                    {
                        name: "menulist-text"
                    },
                    {
                        name: "menulist-textfield"
                    },
                    {
                        name: "menupopup"
                    },
                    {
                        name: "menuradio"
                    },
                    {
                        name: "menuseparator"
                    },
                    {
                        name: "-moz-mac-unified-toolbar"
                    },
                    {
                        name: "-moz-win-borderless-glass"
                    },
                    {
                        name: "-moz-win-browsertabbar-toolbox"
                    },
                    {
                        name: "-moz-win-communications-toolbox"
                    },
                    {
                        name: "-moz-win-glass"
                    },
                    {
                        name: "-moz-win-media-toolbox"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "progressbar"
                    },
                    {
                        name: "progresschunk"
                    },
                    {
                        name: "radio"
                    },
                    {
                        name: "radio-container"
                    },
                    {
                        name: "radio-label"
                    },
                    {
                        name: "radiomenuitem"
                    },
                    {
                        name: "resizer"
                    },
                    {
                        name: "resizerpanel"
                    },
                    {
                        name: "scrollbarbutton-down"
                    },
                    {
                        name: "scrollbarbutton-left"
                    },
                    {
                        name: "scrollbarbutton-right"
                    },
                    {
                        name: "scrollbarbutton-up"
                    },
                    {
                        name: "scrollbar-small"
                    },
                    {
                        name: "scrollbartrack-horizontal"
                    },
                    {
                        name: "scrollbartrack-vertical"
                    },
                    {
                        name: "separator"
                    },
                    {
                        name: "spinner"
                    },
                    {
                        name: "spinner-downbutton"
                    },
                    {
                        name: "spinner-textfield"
                    },
                    {
                        name: "spinner-upbutton"
                    },
                    {
                        name: "statusbar"
                    },
                    {
                        name: "statusbarpanel"
                    },
                    {
                        name: "tab"
                    },
                    {
                        name: "tabpanels"
                    },
                    {
                        name: "tab-scroll-arrow-back"
                    },
                    {
                        name: "tab-scroll-arrow-forward"
                    },
                    {
                        name: "textfield"
                    },
                    {
                        name: "textfield-multiline"
                    },
                    {
                        name: "toolbar"
                    },
                    {
                        name: "toolbox"
                    },
                    {
                        name: "tooltip"
                    },
                    {
                        name: "treeheadercell"
                    },
                    {
                        name: "treeheadersortarrow"
                    },
                    {
                        name: "treeitem"
                    },
                    {
                        name: "treetwistyopen"
                    },
                    {
                        name: "treeview"
                    },
                    {
                        name: "treewisty"
                    },
                    {
                        name: "window"
                    }
                ]
            },
            {
                name: "-moz-backface-visibility",
                desc: "Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
                browsers: "FF10",
                restriction: "enum",
                values: [
                    {
                        name: "hidden"
                    },
                    {
                        name: "visible"
                    }
                ]
            },
            {
                name: "-moz-background-clip",
                desc: "Determines the background painting area.",
                browsers: "FF1-3.6",
                restriction: "box, enum",
                values: [
                    {
                        name: "padding"
                    }
                ]
            },
            {
                name: "-moz-background-inline-policy",
                desc: "In Gecko-based applications like Firefox, the -moz-background-inline-policy CSS property specifies how the background image of an inline element is determined when the content of the inline element wraps onto multiple lines. The choice of position has significant effects on repetition.",
                browsers: "FF1",
                restriction: "enum",
                values: [
                    {
                        name: "bounding-box"
                    },
                    {
                        name: "continuous"
                    },
                    {
                        name: "each-box"
                    }
                ]
            },
            {
                name: "-moz-background-origin",
                desc: "For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
                browsers: "FF1",
                restriction: "box"
            },
            {
                name: "-moz-border-bottom-colors",
                desc: "Sets a list of colors for the bottom border.",
                browsers: "FF1",
                restriction: "color"
            },
            {
                name: "-moz-border-image",
                desc: "Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
                browsers: "FF3.6",
                restriction: "length, percentage, number, url, enum",
                values: [
                    {
                        name: "auto",
                        desc: "If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead."
                    },
                    {
                        name: "fill",
                        desc: "Causes the middle part of the border-image to be preserved."
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "repeat"
                    },
                    {
                        name: "round",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does."
                    },
                    {
                        name: "space",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles."
                    },
                    {
                        name: "stretch",
                        desc: "The image is stretched to fill the area."
                    },
                    {
                        name: "url()"
                    }
                ]
            },
            {
                name: "-moz-border-left-colors",
                desc: "Sets a list of colors for the bottom border.",
                browsers: "FF1",
                restriction: "color"
            },
            {
                name: "-moz-border-right-colors",
                desc: "Sets a list of colors for the bottom border.",
                browsers: "FF1",
                restriction: "color"
            },
            {
                name: "-moz-border-top-colors",
                desc: "Ske Firefox, -moz-border-bottom-colors sets a list of colors for the bottom border.",
                browsers: "FF1",
                restriction: "color"
            },
            {
                name: "-moz-box-align",
                desc: "Specifies how a XUL box aligns its contents across (perpendicular to) the direction of its layout. The effect of this is only visible if there is extra space in the box.",
                browsers: "FF1",
                restriction: "enum",
                values: [
                    {
                        name: "baseline",
                        desc: "If this box orientation is inline-axis or horizontal, all children are placed with their baselines aligned, and extra space placed before or after as necessary. For block flows, the baseline of the first non-empty line box located within the element is used. For tables, the baseline of the first cell is used."
                    },
                    {
                        name: "center",
                        desc: "Any extra space is divided evenly, with half placed above the child and the other half placed after the child."
                    },
                    {
                        name: "end",
                        desc: "For normal direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element. For reverse direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element."
                    },
                    {
                        name: "start",
                        desc: "For normal direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element. For reverse direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element."
                    },
                    {
                        name: "stretch",
                        desc: "The height of each child is adjusted to that of the containing block."
                    }
                ]
            },
            {
                name: "-moz-box-direction",
                desc: "Specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).",
                browsers: "FF1",
                restriction: "enum",
                values: [
                    {
                        name: "normal",
                        desc: "A box with a computed value of horizontal for box-orient displays its children from left to right. A box with a computed value of vertical displays its children from top to bottom."
                    },
                    {
                        name: "reverse",
                        desc: "A box with a computed value of horizontal for box-orient displays its children from right to left. A box with a computed value of vertical displays its children from bottom to top."
                    }
                ]
            },
            {
                name: "-moz-box-flex",
                desc: "Specifies how a box grows to fill the box that contains it, in the direction of the containing box's layout.",
                browsers: "FF1",
                restriction: "number"
            },
            {
                name: "-moz-box-flexgroup",
                desc: "Flexible elements can be assigned to flex groups using the 'box-flex-group' property.",
                browsers: "FF1",
                restriction: "integer"
            },
            {
                name: "-moz-box-ordinal-group",
                desc: "Indicates the ordinal group the element belongs to. Elements with a lower ordinal group are displayed before those with a higher ordinal group.",
                browsers: "FF1",
                restriction: "integer"
            },
            {
                name: "-moz-box-orient",
                desc: "In Mozilla applications, -moz-box-orient specifies whether a box lays out its contents horizontally or vertically.",
                browsers: "FF1",
                restriction: "enum",
                values: [
                    {
                        name: "block-axis"
                    },
                    {
                        name: "horizontal",
                        desc: "The box displays its children from left to right in a horizontal line."
                    },
                    {
                        name: "inline-axis"
                    },
                    {
                        name: "vertical",
                        desc: "The box displays its children from stacked from top to bottom vertically."
                    }
                ]
            },
            {
                name: "-moz-box-pack",
                desc: "Specifies how a box packs its contents in the direction of its layout. The effect of this is only visible if there is extra space in the box.",
                browsers: "FF1",
                restriction: "enum",
                values: [
                    {
                        name: "center",
                        desc: "The extra space is divided evenly, with half placed before the first child and the other half placed after the last child."
                    },
                    {
                        name: "end",
                        desc: "For normal direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child. For reverse direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child."
                    },
                    {
                        name: "justify",
                        desc: "The space is divided evenly in-between each child, with none of the extra space placed before the first child or after the last child. If there is only one child, treat the pack value as if it were start."
                    },
                    {
                        name: "start",
                        desc: "For normal direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child. For reverse direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child."
                    }
                ]
            },
            {
                name: "-moz-box-sizing",
                desc: "Box Model addition in CSS3.",
                browsers: "FF1",
                restriction: "enum",
                values: [
                    {
                        name: "border-box"
                    },
                    {
                        name: "content-box"
                    },
                    {
                        name: "padding-box"
                    }
                ]
            },
            {
                name: "-moz-column-count",
                desc: "Describes the optimal number of columns into which the content of the element will be flowed.",
                browsers: "FF3.5",
                restriction: "integer",
                values: [
                    {
                        name: "auto",
                        desc: "Determines the number of columns by the 'column-width' property and the element width."
                    }
                ]
            },
            {
                name: "-moz-column-gap",
                desc: "Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.",
                browsers: "FF3.5",
                restriction: "length",
                values: [
                    {
                        name: "normal",
                        desc: "User agent specific and typically equivalent to 1em."
                    }
                ]
            },
            {
                name: "-moz-column-rule",
                desc: "Shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
                browsers: "FF3.5",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "-moz-column-rule-color",
                desc: "Sets the color of the column rule",
                browsers: "FF3.5",
                restriction: "color"
            },
            {
                name: "-moz-column-rule-style",
                desc: "Sets the style of the rule between columns of an element.",
                browsers: "FF3.5",
                restriction: "line-style"
            },
            {
                name: "-moz-column-rule-width",
                desc: "Sets the width of the rule between columns. Negative values are not allowed.",
                browsers: "FF3.5",
                restriction: "length, line-width"
            },
            {
                name: "-moz-columns",
                desc: "A shorthand property which sets both 'column-width' and 'column-count'.",
                browsers: "FF9",
                restriction: "length, integer",
                values: [
                    {
                        name: "auto",
                        desc: "The width depends on the values of other properties."
                    }
                ]
            },
            {
                name: "-moz-column-width",
                desc: "This property describes the width of columns in multicol elements.",
                browsers: "FF3.5",
                restriction: "length",
                values: [
                    {
                        name: "auto",
                        desc: "The width depends on the values of other properties."
                    }
                ]
            },
            {
                name: "-moz-font-feature-settings",
                desc: "Provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.",
                browsers: "FF4",
                restriction: "string, integer",
                values: [
                    {
                        name: "\"c2cs\""
                    },
                    {
                        name: "\"dlig\""
                    },
                    {
                        name: "\"kern\""
                    },
                    {
                        name: "\"liga\""
                    },
                    {
                        name: "\"lnum\""
                    },
                    {
                        name: "\"onum\""
                    },
                    {
                        name: "\"smcp\""
                    },
                    {
                        name: "\"swsh\""
                    },
                    {
                        name: "\"tnum\""
                    },
                    {
                        name: "normal",
                        desc: "No change in glyph substitution or positioning occurs."
                    },
                    {
                        name: "off",
                        browsers: "FF15"
                    },
                    {
                        name: "on",
                        browsers: "FF15"
                    }
                ]
            },
            {
                name: "-moz-hyphens",
                desc: "Controls whether hyphenation is allowed to create more break opportunities within a line of text.",
                browsers: "FF9",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word."
                    },
                    {
                        name: "manual"
                    },
                    {
                        name: "none",
                        desc: "Words are not broken at line breaks, even if characters inside the word suggest line break points."
                    }
                ]
            },
            {
                name: "-moz-perspective",
                desc: "Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.",
                browsers: "FF10",
                restriction: "length",
                values: [
                    {
                        name: "none",
                        desc: "No perspective transform is applied."
                    }
                ]
            },
            {
                name: "-moz-perspective-origin",
                desc: "Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.",
                browsers: "FF10",
                restriction: "position, percentage, length"
            },
            {
                name: "-moz-text-align-last",
                desc: "Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'.",
                browsers: "FF12",
                restriction: "enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "center",
                        desc: "The inline contents are centered within the line box."
                    },
                    {
                        name: "justify",
                        desc: "The text is justified according to the method specified by the 'text-justify' property."
                    },
                    {
                        name: "left",
                        desc: "The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text."
                    },
                    {
                        name: "right",
                        desc: "The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text."
                    }
                ]
            },
            {
                name: "-moz-text-decoration-color",
                desc: "Specifies the color of text decoration (underlines overlines, and line-throughs) set on the element with text-decoration-line.",
                browsers: "FF6",
                restriction: "color"
            },
            {
                name: "-moz-text-decoration-line",
                desc: "Specifies what line decorations, if any, are added to the element.",
                browsers: "FF6",
                restriction: "enum",
                values: [
                    {
                        name: "line-through"
                    },
                    {
                        name: "none",
                        desc: "Neither produces nor inhibits text decoration."
                    },
                    {
                        name: "overline"
                    },
                    {
                        name: "underline"
                    }
                ]
            },
            {
                name: "-moz-text-decoration-style",
                desc: "Specifies the line style for underline, line-through and overline text decoration.",
                browsers: "FF6",
                restriction: "enum",
                values: [
                    {
                        name: "dashed"
                    },
                    {
                        name: "dotted"
                    },
                    {
                        name: "double"
                    },
                    {
                        name: "none",
                        desc: "Produces no line."
                    },
                    {
                        name: "solid"
                    },
                    {
                        name: "wavy"
                    }
                ]
            },
            {
                name: "-moz-text-size-adjust",
                desc: "Specifies a size adjustment for displaying text content in mobile browsers.",
                browsers: "FF",
                restriction: "enum, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Renderers must use the default size adjustment when displaying on a small device."
                    },
                    {
                        name: "none",
                        desc: "Renderers must not do size adjustment when displaying on a small device."
                    }
                ]
            },
            {
                name: "-moz-transform",
                desc: "A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
                browsers: "FF3.5",
                restriction: "enum",
                values: [
                    {
                        name: "matrix()"
                    },
                    {
                        name: "matrix3d()"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "perspective"
                    },
                    {
                        name: "rotate()"
                    },
                    {
                        name: "rotate3d()"
                    },
                    {
                        name: "rotateX('angle')"
                    },
                    {
                        name: "rotateY('angle')"
                    },
                    {
                        name: "rotateZ('angle')"
                    },
                    {
                        name: "scale()"
                    },
                    {
                        name: "scale3d()"
                    },
                    {
                        name: "scaleX()"
                    },
                    {
                        name: "scaleY()"
                    },
                    {
                        name: "scaleZ()"
                    },
                    {
                        name: "skew()"
                    },
                    {
                        name: "skewX()"
                    },
                    {
                        name: "skewY()"
                    },
                    {
                        name: "translate()"
                    },
                    {
                        name: "translate3d()"
                    },
                    {
                        name: "translateX()"
                    },
                    {
                        name: "translateY()"
                    },
                    {
                        name: "translateZ()"
                    }
                ]
            },
            {
                name: "-moz-transform-origin",
                desc: "Establishes the origin of transformation for an element.",
                browsers: "FF3.5",
                restriction: "position, length, percentage"
            },
            {
                name: "-moz-transition",
                desc: "Shorthand property combines four of the transition properties into a single property.",
                browsers: "FF4",
                restriction: "time, property, timing-function, enum",
                values: [
                    {
                        name: "all",
                        desc: "Every property that is able to undergo a transition will do so."
                    },
                    {
                        name: "none",
                        desc: "No property will transition."
                    }
                ]
            },
            {
                name: "-moz-transition-delay",
                desc: "Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.",
                browsers: "FF4",
                restriction: "time"
            },
            {
                name: "-moz-transition-duration",
                desc: "Specifies how long the transition from the old value to the new value should take.",
                browsers: "FF4",
                restriction: "time"
            },
            {
                name: "-moz-transition-property",
                desc: "Specifies the name of the CSS property to which the transition is applied.",
                browsers: "FF4",
                restriction: "property",
                values: [
                    {
                        name: "all",
                        desc: "Every property that is able to undergo a transition will do so."
                    },
                    {
                        name: "none",
                        desc: "No property will transition."
                    }
                ]
            },
            {
                name: "-moz-transition-timing-function",
                desc: "Describes how the intermediate values used during a transition will be calculated.",
                browsers: "FF4",
                restriction: "timing-function"
            },
            {
                name: "-moz-user-focus",
                desc: "Used to indicate whether the element can have focus.",
                browsers: "FF1.5",
                values: [
                    {
                        name: "ignore"
                    },
                    {
                        name: "normal"
                    }
                ]
            },
            {
                name: "-moz-user-select",
                desc: "Controls the appearance of selection.",
                browsers: "FF1.5",
                restriction: "enum",
                values: [
                    {
                        name: "all"
                    },
                    {
                        name: "element"
                    },
                    {
                        name: "elements"
                    },
                    {
                        name: "-moz-all"
                    },
                    {
                        name: "-moz-none"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "text"
                    },
                    {
                        name: "toggle"
                    }
                ]
            },
            {
                name: "-ms-accelerator",
                desc: "IE only. Has the ability to turn off its system underlines for accelerator keys until the ALT key is pressed",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "false"
                    },
                    {
                        name: "true"
                    }
                ]
            },
            {
                name: "-ms-behavior",
                desc: "IE only. Used to extend behaviors of the browser",
                browsers: "IE8",
                restriction: "url"
            },
            {
                name: "-ms-block-progression",
                desc: "Sets the block-progression value and the flow orientation",
                browsers: "IE8",
                restriction: "enum",
                values: [
                    {
                        name: "bt"
                    },
                    {
                        name: "lr"
                    },
                    {
                        name: "rl"
                    },
                    {
                        name: "tb"
                    }
                ]
            },
            {
                name: "-ms-content-zoom-chaining",
                desc: "Specifies the zoom behavior that occurs when a user hits the zoom limit during a manipulation.",
                browsers: "E,IE10",
                values: [
                    {
                        name: "chained",
                        desc: "The nearest zoomable parent element begins zooming when the user hits a zoom limit during a manipulation. No bounce effect is shown."
                    },
                    {
                        name: "none",
                        desc: "A bounce effect is shown when the user hits a zoom limit during a manipulation."
                    }
                ]
            },
            {
                name: "-ms-content-zooming",
                desc: "Specifies whether zooming is enabled.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "none",
                        desc: "The element is not zoomable."
                    },
                    {
                        name: "zoom"
                    }
                ]
            },
            {
                name: "-ms-content-zoom-limit",
                desc: "Shorthand property for the -ms-content-zoom-limit-min and -ms-content-zoom-limit-max properties.",
                browsers: "E,IE10",
                restriction: "percentage"
            },
            {
                name: "-ms-content-zoom-limit-max",
                desc: "Specifies the maximum zoom factor.",
                browsers: "E,IE10",
                restriction: "percentage"
            },
            {
                name: "-ms-content-zoom-limit-min",
                desc: "Specifies the minimum zoom factor.",
                browsers: "E,IE10",
                restriction: "percentage"
            },
            {
                name: "-ms-content-zoom-snap",
                desc: "Shorthand property for the -ms-content-zoom-snap-type and -ms-content-zoom-snap-points properties.",
                browsers: "E,IE10",
                values: [
                    {
                        name: "mandatory",
                        desc: "Indicates that the motion of the content after the contact is picked up is always adjusted so that it lands on a snap-point."
                    },
                    {
                        name: "none",
                        desc: "Indicates that zooming is unaffected by any defined snap-points."
                    },
                    {
                        name: "proximity",
                        desc: "Indicates that the motion of the content after the contact is picked up may be adjusted if the content would normally stop \"close enough\" to a snap-point."
                    },
                    {
                        name: "snapInterval(100%, 100%)",
                        desc: "Specifies where the snap-points will be placed."
                    },
                    {
                        name: "snapList()",
                        desc: "Specifies the position of individual snap-points as a comma-separated list of zoom factors."
                    }
                ]
            },
            {
                name: "-ms-content-zoom-snap-points",
                desc: "Defines where zoom snap-points are located.",
                browsers: "E,IE10",
                values: [
                    {
                        name: "snapInterval(100%, 100%)",
                        desc: "Specifies where the snap-points will be placed."
                    },
                    {
                        name: "snapList()",
                        desc: "Specifies the position of individual snap-points as a comma-separated list of zoom factors."
                    }
                ]
            },
            {
                name: "-ms-content-zoom-snap-type",
                desc: "Specifies how zooming is affected by defined snap-points.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "mandatory",
                        desc: "Indicates that the motion of the content after the contact is picked up is always adjusted so that it lands on a snap-point."
                    },
                    {
                        name: "none",
                        desc: "Indicates that zooming is unaffected by any defined snap-points."
                    },
                    {
                        name: "proximity",
                        desc: "Indicates that the motion of the content after the contact is picked up may be adjusted if the content would normally stop \"close enough\" to a snap-point."
                    }
                ]
            },
            {
                name: "-ms-filter",
                desc: "IE only. Used to produce visual effects.",
                browsers: "IE8-9",
                restriction: "string"
            },
            {
                name: "-ms-flex",
                desc: "specifies the parameters of a flexible length: the positive and negative flexibility, and the preferred size.",
                browsers: "IE10",
                restriction: "length, number, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Retrieves the value of the main size property as the used 'flex-basis'."
                    },
                    {
                        name: "none",
                        desc: "Expands to '0 0 auto'."
                    }
                ]
            },
            {
                name: "-ms-flex-align",
                desc: "Aligns flex items along the cross axis of the current line of the flex container.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "baseline",
                        desc: "If the flex item’s inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment."
                    },
                    {
                        name: "center",
                        desc: "The flex item’s margin box is centered in the cross axis within the line."
                    },
                    {
                        name: "end",
                        desc: "The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line."
                    },
                    {
                        name: "start",
                        desc: "The cross-start margin edge of the flexbox item is placed flush with the cross-start edge of the line."
                    },
                    {
                        name: "stretch",
                        desc: "If the cross size property of the flexbox item is anything other than 'auto', this value is identical to 'start'."
                    }
                ]
            },
            {
                name: "-ms-flex-direction",
                desc: "Specifies how flex items are placed in the flex container, by setting the direction of the flex container’s main axis.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "column",
                        desc: "The flex container’s main axis has the same orientation as the block axis of the current writing mode."
                    },
                    {
                        name: "column-reverse"
                    },
                    {
                        name: "row",
                        desc: "The flex container’s main axis has the same orientation as the inline axis of the current writing mode."
                    },
                    {
                        name: "row-reverse"
                    }
                ]
            },
            {
                name: "-ms-flex-flow",
                desc: "Specifies how flexbox items are placed in the flexbox.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "column",
                        desc: "The flex container’s main axis has the same orientation as the block axis of the current writing mode."
                    },
                    {
                        name: "column-reverse"
                    },
                    {
                        name: "nowrap",
                        desc: "The flex container is single-line."
                    },
                    {
                        name: "row",
                        desc: "The flex container’s main axis has the same orientation as the inline axis of the current writing mode."
                    },
                    {
                        name: "wrap",
                        desc: "The flexbox is multi-line."
                    },
                    {
                        name: "wrap-reverse"
                    }
                ]
            },
            {
                name: "-ms-flex-item-align",
                desc: "Allows the default alignment along the cross axis to be overridden for individual flex items.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Computes to the value of 'align-items' on the element’s parent, or 'stretch' if the element has no parent. On absolutely positioned elements, it computes to itself."
                    },
                    {
                        name: "baseline",
                        desc: "If the flex item’s inline axis is the same as the cross axis, this value is identical to 'flex-start'. Otherwise, it participates in baseline alignment."
                    },
                    {
                        name: "center",
                        desc: "The flex item’s margin box is centered in the cross axis within the line."
                    },
                    {
                        name: "end",
                        desc: "The cross-end margin edge of the flex item is placed flush with the cross-end edge of the line."
                    },
                    {
                        name: "start",
                        desc: "The cross-start margin edge of the flex item is placed flush with the cross-start edge of the line."
                    },
                    {
                        name: "stretch",
                        desc: "If the cross size property of the flex item computes to auto, and neither of the cross-axis margins are auto, the flex item is stretched."
                    }
                ]
            },
            {
                name: "-ms-flex-line-pack",
                desc: "Aligns a flex container’s lines within the flex container when there is extra space in the cross-axis, similar to how 'justify-content' aligns individual items within the main-axis.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "center",
                        desc: "Lines are packed toward the center of the flex container."
                    },
                    {
                        name: "distribute",
                        desc: "Lines are evenly distributed in the flex container, with half-size spaces on either end."
                    },
                    {
                        name: "end",
                        desc: "Lines are packed toward the end of the flex container."
                    },
                    {
                        name: "justify",
                        desc: "Lines are evenly distributed in the flex container."
                    },
                    {
                        name: "start",
                        desc: "Lines are packed toward the start of the flex container."
                    },
                    {
                        name: "stretch",
                        desc: "Lines stretch to take up the remaining space."
                    }
                ]
            },
            {
                name: "-ms-flex-order",
                desc: "Controls the order in which children of a flex container appear within the flex container, by assigning them to ordinal groups.",
                browsers: "IE10",
                restriction: "integer"
            },
            {
                name: "-ms-flex-pack",
                desc: "Aligns flex items along the main axis of the current line of the flex container.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "center",
                        desc: "Flex items are packed toward the center of the line."
                    },
                    {
                        name: "distribute",
                        desc: "Flex items are evenly distributed in the line, with half-size spaces on either end."
                    },
                    {
                        name: "end",
                        desc: "Flex items are packed toward the end of the line."
                    },
                    {
                        name: "justify",
                        desc: "Flex items are evenly distributed in the line."
                    },
                    {
                        name: "start",
                        desc: "Flex items are packed toward the start of the line."
                    }
                ]
            },
            {
                name: "-ms-flex-wrap",
                desc: "Controls whether the flex container is single-line or multi-line, and the direction of the cross-axis, which determines the direction new lines are stacked in.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "nowrap",
                        desc: "The flex container is single-line."
                    },
                    {
                        name: "wrap",
                        desc: "The flexbox is multi-line."
                    },
                    {
                        name: "wrap-reverse"
                    }
                ]
            },
            {
                name: "-ms-flow-from",
                desc: "Makes a block container a region and associates it with a named flow.",
                browsers: "E,IE10",
                restriction: "identifier",
                values: [
                    {
                        name: "none",
                        desc: "The block container is not a CSS Region."
                    }
                ]
            },
            {
                name: "-ms-flow-into",
                desc: "Places an element or its contents into a named flow.",
                browsers: "E,IE10",
                restriction: "identifier",
                values: [
                    {
                        name: "none",
                        desc: "The element is not moved to a named flow and normal CSS processing takes place."
                    }
                ]
            },
            {
                name: "-ms-grid-column",
                desc: "Used to place grid items and explicitly defined grid cells in the Grid.",
                browsers: "E,IE10",
                restriction: "integer, string, enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "end"
                    },
                    {
                        name: "start"
                    }
                ]
            },
            {
                name: "-ms-grid-column-align",
                desc: "Aligns the columns in a grid.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "center",
                        desc: "Places the center of the Grid Item's margin box at the center of the Grid Item's column."
                    },
                    {
                        name: "end",
                        desc: "Aligns the end edge of the Grid Item's margin box to the end edge of the Grid Item's column."
                    },
                    {
                        name: "start",
                        desc: "Aligns the starting edge of the Grid Item's margin box to the starting edge of the Grid Item's column."
                    },
                    {
                        name: "stretch",
                        desc: "Ensures that the Grid Item's margin box is equal to the size of the Grid Item's column."
                    }
                ]
            },
            {
                name: "-ms-grid-columns",
                desc: "Lays out the columns of the grid.",
                browsers: "E,IE10"
            },
            {
                name: "-ms-grid-column-span",
                desc: "Specifies the number of columns to span.",
                browsers: "E,IE10",
                restriction: "integer"
            },
            {
                name: "-ms-grid-layer",
                desc: "Grid-layer is similar in concept to z-index, but avoids overloading the meaning of the z-index property, which is applicable only to positioned elements.",
                browsers: "E,IE10",
                restriction: "integer"
            },
            {
                name: "-ms-grid-row",
                desc: "grid-row is used to place grid items and explicitly defined grid cells in the Grid.",
                browsers: "E,IE10",
                restriction: "integer, string, enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "end"
                    },
                    {
                        name: "start"
                    }
                ]
            },
            {
                name: "-ms-grid-row-align",
                desc: "Aligns the rows in a grid.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "center",
                        desc: "Places the center of the Grid Item's margin box at the center of the Grid Item's row."
                    },
                    {
                        name: "end",
                        desc: "Aligns the end edge of the Grid Item's margin box to the end edge of the Grid Item's row."
                    },
                    {
                        name: "start",
                        desc: "Aligns the starting edge of the Grid Item's margin box to the starting edge of the Grid Item's row."
                    },
                    {
                        name: "stretch",
                        desc: "Ensures that the Grid Item's margin box is equal to the size of the Grid Item's row."
                    }
                ]
            },
            {
                name: "-ms-grid-rows",
                desc: "Lays out the columns of the grid.",
                browsers: "E,IE10"
            },
            {
                name: "-ms-grid-row-span",
                desc: "Specifies the number of rows to span.",
                browsers: "E,IE10",
                restriction: "integer"
            },
            {
                name: "-ms-high-contrast-adjust",
                desc: "Specifies if properties should be adjusted in high contrast mode.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Properties will be adjusted as applicable."
                    },
                    {
                        name: "none",
                        desc: "No adjustments will be applied."
                    }
                ]
            },
            {
                name: "-ms-hyphenate-limit-chars",
                desc: "Specifies the minimum number of characters in a hyphenated word.",
                browsers: "E,IE10",
                restriction: "integer",
                values: [
                    {
                        name: "auto",
                        desc: "The user agent chooses a value that adapts to the current layout."
                    }
                ]
            },
            {
                name: "-ms-hyphenate-limit-lines",
                desc: "Indicates the maximum number of successive hyphenated lines in an element.",
                browsers: "E,IE10",
                restriction: "integer",
                values: [
                    {
                        name: "no-limit"
                    }
                ]
            },
            {
                name: "-ms-hyphenate-limit-zone",
                desc: "Specifies the maximum amount of unfilled space (before justification) that may be left in the line box before hyphenation is triggered to pull part of a word from the next line back up into the current line.",
                browsers: "E,IE10",
                restriction: "percentage, length"
            },
            {
                name: "-ms-hyphens",
                desc: "Controls whether hyphenation is allowed to create more break opportunities within a line of text.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word."
                    },
                    {
                        name: "manual"
                    },
                    {
                        name: "none",
                        desc: "Words are not broken at line breaks, even if characters inside the word suggest line break points."
                    }
                ]
            },
            {
                name: "-ms-ime-mode",
                desc: "Controls the state of the input method editor for text fields.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "active"
                    },
                    {
                        name: "auto",
                        desc: "No change is made to the current input method editor state. This is the default."
                    },
                    {
                        name: "disabled"
                    },
                    {
                        name: "inactive"
                    },
                    {
                        name: "normal",
                        desc: "The IME state should be normal; this value can be used in a user style sheet to override the page setting."
                    }
                ]
            },
            {
                name: "-ms-interpolation-mode",
                desc: "Gets or sets the interpolation (resampling) method used to stretch images.",
                browsers: "IE7",
                restriction: "enum",
                values: [
                    {
                        name: "bicubic"
                    },
                    {
                        name: "nearest-neighbor"
                    }
                ]
            },
            {
                name: "-ms-layout-grid",
                desc: "Sets or retrieves the composite document grid properties that specify the layout of text characters.",
                browsers: "E,IE10",
                values: [
                    {
                        name: "char",
                        desc: "Any of the range of character values available to the -ms-layout-grid-char property."
                    },
                    {
                        name: "line",
                        desc: "Any of the range of line values available to the -ms-layout-grid-line property."
                    },
                    {
                        name: "mode"
                    },
                    {
                        name: "type"
                    }
                ]
            },
            {
                name: "-ms-layout-grid-char",
                desc: "Sets or retrieves the size of the character grid used for rendering the text content of an element.",
                browsers: "E,IE10",
                restriction: "enum, length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Largest character in the font of the element is used to set the character grid."
                    },
                    {
                        name: "none",
                        desc: "Default. No character grid is set."
                    }
                ]
            },
            {
                name: "-ms-layout-grid-line",
                desc: "Sets or retrieves the gridline value used for rendering the text content of an element.",
                browsers: "E,IE10",
                restriction: "length",
                values: [
                    {
                        name: "auto",
                        desc: "Largest character in the font of the element is used to set the character grid."
                    },
                    {
                        name: "none",
                        desc: "Default. No grid line is set."
                    }
                ]
            },
            {
                name: "-ms-layout-grid-mode",
                desc: "Gets or sets whether the text layout grid uses two dimensions.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "both",
                        desc: "Default. Both the char and line grid modes are enabled. This setting is necessary to fully enable the layout grid on an element."
                    },
                    {
                        name: "char",
                        desc: "Only a character grid is used. This is recommended for use with block-level elements, such as a blockquote, where the line grid is intended to be disabled."
                    },
                    {
                        name: "line",
                        desc: "Only a line grid is used. This is recommended for use with inline elements, such as a span, to disable the horizontal grid on runs of text that act as a single entity in the grid layout."
                    },
                    {
                        name: "none",
                        desc: "No grid is used."
                    }
                ]
            },
            {
                name: "-ms-layout-grid-type",
                desc: "Sets or retrieves the type of grid used for rendering the text content of an element.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "fixed",
                        desc: "Grid used for monospaced layout. All noncursive characters are treated as equal; every character is centered within a single grid space by default."
                    },
                    {
                        name: "loose",
                        desc: "Default. Grid used for Japanese and Korean characters."
                    },
                    {
                        name: "strict",
                        desc: "Grid used for Chinese, as well as Japanese (Genko) and Korean characters. Only the ideographs, kanas, and wide characters are snapped to the grid."
                    }
                ]
            },
            {
                name: "-ms-line-break",
                desc: "Specifies what set of line breaking restrictions are in effect within the element.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The UA determines the set of line-breaking restrictions to use for CJK scripts, and it may vary the restrictions based on the length of the line; e.g., use a less restrictive set of line-break rules for short lines."
                    },
                    {
                        name: "keep-all",
                        desc: "Sequences of CJK characters can no longer break on implied break points. This option should only be used where the presence of word separator characters still creates line-breaking opportunities, as in Korean."
                    },
                    {
                        name: "newspaper",
                        desc: "Breaks CJK scripts using the least restrictive set of line-breaking rules. Typically used for short lines, such as in newspapers."
                    },
                    {
                        name: "normal",
                        desc: "Breaks CJK scripts using a normal set of line-breaking rules."
                    },
                    {
                        name: "strict",
                        desc: "Breaks CJK scripts using a more restrictive set of line-breaking rules than 'normal'."
                    }
                ]
            },
            {
                name: "-ms-overflow-style",
                desc: "Specify whether content is clipped when it overflows the element's content area.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "No preference, UA should use the first scrolling method in the list that it supports."
                    },
                    {
                        name: "-ms-autohiding-scrollbar"
                    },
                    {
                        name: "none",
                        desc: "Indicates the element does not display scrollbars or panning indicators, even when its content overflows."
                    },
                    {
                        name: "scrollbar"
                    }
                ]
            },
            {
                name: "-ms-perspective",
                desc: "Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.",
                browsers: "IE10",
                restriction: "length",
                values: [
                    {
                        name: "none",
                        desc: "No perspective transform is applied."
                    }
                ]
            },
            {
                name: "-ms-perspective-origin",
                desc: "Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.",
                browsers: "IE10",
                restriction: "position, percentage, length"
            },
            {
                name: "-ms-perspective-origin-x",
                desc: "Establishes the origin for the perspective property. It effectively sets the X  position at which the viewer appears to be looking at the children of the element.",
                browsers: "IE10",
                restriction: "position, percentage, length"
            },
            {
                name: "-ms-perspective-origin-y",
                desc: "Establishes the origin for the perspective property. It effectively sets the Y position at which the viewer appears to be looking at the children of the element.",
                browsers: "IE10",
                restriction: "position, percentage, length"
            },
            {
                name: "-ms-progress-appearance",
                desc: "Gets or sets a value that specifies whether a progress control displays as a bar or a ring.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "bar"
                    },
                    {
                        name: "ring"
                    }
                ]
            },
            {
                name: "-ms-scrollbar-3dlight-color",
                desc: "Determines the color of the top and left edges of the scroll box and scroll arrows of a scroll bar.",
                browsers: "IE8",
                restriction: "color"
            },
            {
                name: "-ms-scrollbar-arrow-color",
                desc: "Determines the color of the arrow elements of a scroll arrow.",
                browsers: "IE8",
                restriction: "color"
            },
            {
                name: "-ms-scrollbar-base-color",
                desc: "Determines the color of the main elements of a scroll bar, which include the scroll box, track, and scroll arrows.",
                browsers: "IE8",
                restriction: "color"
            },
            {
                name: "-ms-scrollbar-darkshadow-color",
                desc: "Determines the color of the gutter of a scroll bar.",
                browsers: "IE8",
                restriction: "color"
            },
            {
                name: "-ms-scrollbar-face-color",
                desc: "Determines the color of the scroll box and scroll arrows of a scroll bar.",
                browsers: "IE8",
                restriction: "color"
            },
            {
                name: "-ms-scrollbar-highlight-color",
                desc: "Determines the color of the top and left edges of the scroll box and scroll arrows of a scroll bar.",
                browsers: "IE8",
                restriction: "color"
            },
            {
                name: "-ms-scrollbar-shadow-color",
                desc: "Determines the color of the bottom and right edges of the scroll box and scroll arrows of a scroll bar.",
                browsers: "IE8",
                restriction: "color"
            },
            {
                name: "-ms-scrollbar-track-color",
                desc: "Determines the color of the track element of a scroll bar.",
                browsers: "IE8",
                restriction: "color"
            },
            {
                name: "-ms-scroll-chaining",
                desc: "Gets or sets a value that indicates the scrolling behavior that occurs when a user hits the content boundary during a manipulation.",
                browsers: "E,IE10",
                restriction: "enum, length",
                values: [
                    {
                        name: "chained"
                    },
                    {
                        name: "none"
                    }
                ]
            },
            {
                name: "-ms-scroll-limit",
                desc: "Gets or sets a shorthand value that sets values for the -ms-scroll-limit-x-min, -ms-scroll-limit-y-min, -ms-scroll-limit-x-max, and -ms-scroll-limit-y-max properties.",
                browsers: "E,IE10",
                restriction: "length",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "-ms-scroll-limit-x-max",
                desc: "Gets or sets a value that specifies the maximum value for the scrollLeft property.",
                browsers: "E,IE10",
                restriction: "length",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "-ms-scroll-limit-x-min",
                desc: "Gets or sets a value that specifies the minimum value for the scrollLeft property.",
                browsers: "E,IE10",
                restriction: "length"
            },
            {
                name: "-ms-scroll-limit-y-max",
                desc: "Gets or sets a value that specifies the maximum value for the scrollTop property.",
                browsers: "E,IE10",
                restriction: "length",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "-ms-scroll-limit-y-min",
                desc: "Gets or sets a value that specifies the minimum value for the scrollTop property.",
                browsers: "E,IE10",
                restriction: "length"
            },
            {
                name: "-ms-scroll-rails",
                desc: "Gets or sets a value that indicates whether or not small motions perpendicular to the primary axis of motion will result in either changes to both the scrollTop and scrollLeft properties or a change to the primary axis (for instance, either the scrollTop or scrollLeft properties will change, but not both).",
                browsers: "E,IE10",
                restriction: "enum, length",
                values: [
                    {
                        name: "none"
                    },
                    {
                        name: "railed"
                    }
                ]
            },
            {
                name: "-ms-scroll-snap-points-x",
                desc: "Gets or sets a value that defines where snap-points will be located along the x-axis.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "snapInterval(100%, 100%)"
                    },
                    {
                        name: "snapList()"
                    }
                ]
            },
            {
                name: "-ms-scroll-snap-points-y",
                desc: "Gets or sets a value that defines where snap-points will be located along the y-axis.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "snapInterval(100%, 100%)"
                    },
                    {
                        name: "snapList()"
                    }
                ]
            },
            {
                name: "-ms-scroll-snap-type",
                desc: "Gets or sets a value that defines what type of snap-point should be used for the current element. There are two type of snap-points, with the primary difference being whether or not the user is guaranteed to always stop on a snap-point.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "none",
                        desc: "The visual viewport of this scroll container must ignore snap points, if any, when scrolled."
                    },
                    {
                        name: "mandatory",
                        desc: "The visual viewport of this scroll container is guaranteed to rest on a snap point when there are no active scrolling operations."
                    },
                    {
                        name: "proximity",
                        desc: "The visual viewport of this scroll container may come to rest on a snap point at the termination of a scroll at the discretion of the UA given the parameters of the scroll."
                    }
                ]
            },
            {
                name: "-ms-scroll-snap-x",
                desc: "Gets or sets a shorthand value that sets values for the -ms-scroll-snap-type and -ms-scroll-snap-points-x properties.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "mandatory"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "proximity"
                    },
                    {
                        name: "snapInterval(100%, 100%)"
                    },
                    {
                        name: "snapList()"
                    }
                ]
            },
            {
                name: "-ms-scroll-snap-y",
                desc: "Gets or sets a shorthand value that sets values for the -ms-scroll-snap-type and -ms-scroll-snap-points-y properties.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "mandatory"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "proximity"
                    },
                    {
                        name: "snapInterval(100%, 100%)"
                    },
                    {
                        name: "snapList()"
                    }
                ]
            },
            {
                name: "-ms-scroll-translation",
                desc: "Gets or sets a value that specifies whether vertical-to-horizontal scroll wheel translation occurs on the specified element.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "none"
                    },
                    {
                        name: "vertical-to-horizontal"
                    }
                ]
            },
            {
                name: "-ms-text-align-last",
                desc: "Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'.",
                browsers: "E,IE8",
                restriction: "enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "center",
                        desc: "The inline contents are centered within the line box."
                    },
                    {
                        name: "justify",
                        desc: "The text is justified according to the method specified by the 'text-justify' property."
                    },
                    {
                        name: "left",
                        desc: "The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text."
                    },
                    {
                        name: "right",
                        desc: "The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text."
                    }
                ]
            },
            {
                name: "-ms-text-autospace",
                desc: "Determines whether or not a full-width punctuation mark character should be trimmed if it appears at the beginning of a line, so that its 'ink' lines up with the first glyph in the line above and below.",
                browsers: "E,IE8",
                restriction: "enum",
                values: [
                    {
                        name: "ideograph-alpha"
                    },
                    {
                        name: "ideograph-numeric"
                    },
                    {
                        name: "ideograph-parenthesis"
                    },
                    {
                        name: "ideograph-space"
                    },
                    {
                        name: "none",
                        desc: "No extra space is created."
                    },
                    {
                        name: "punctuation"
                    }
                ]
            },
            {
                name: "-ms-text-combine-horizontal",
                desc: "This property specifies the combination of multiple characters into the space of a single character.",
                browsers: "E,IE11",
                restriction: "enum, integer",
                values: [
                    {
                        name: "all",
                        desc: "Attempt to typeset horizontally all consecutive characters within the box such that they take up the space of a single character within the vertical line box."
                    },
                    {
                        name: "digits"
                    },
                    {
                        name: "none",
                        desc: "No special processing."
                    }
                ]
            },
            {
                name: "-ms-text-justify",
                desc: "Selects the justification algorithm used when 'text-align' is set to 'justify'. The property applies to block containers, but the UA may (but is not required to) also support it on inline elements.",
                browsers: "E,IE8",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The UA determines the justification algorithm to follow, based on a balance between performance and adequate presentation quality."
                    },
                    {
                        name: "distribute",
                        desc: "Justification primarily changes spacing both at word separators and at grapheme cluster boundaries in all scripts except those in the connected and cursive groups. This value is sometimes used in e.g. Japanese, often with the 'text-align-last' property."
                    },
                    {
                        name: "inter-cluster"
                    },
                    {
                        name: "inter-ideograph"
                    },
                    {
                        name: "inter-word"
                    },
                    {
                        name: "kashida"
                    }
                ]
            },
            {
                name: "-ms-text-kashida-space",
                desc: "Sets or retrieves the ratio of kashida expansion to white space expansion when justifying lines of text in the object.",
                browsers: "E,IE10",
                restriction: "percentage"
            },
            {
                name: "-ms-text-overflow",
                desc: "Text can overflow for example when it is prevented from wrapping",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "clip"
                    },
                    {
                        name: "ellipsis"
                    }
                ]
            },
            {
                name: "-ms-text-size-adjust",
                desc: "Specifies a size adjustment for displaying text content in mobile browsers.",
                browsers: "E,IE10",
                restriction: "enum, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Renderers must use the default size adjustment when displaying on a small device."
                    },
                    {
                        name: "none",
                        desc: "Renderers must not do size adjustment when displaying on a small device."
                    }
                ]
            },
            {
                name: "-ms-text-underline-position",
                desc: "Sets the position of an underline specified on the same element: it does not affect underlines specified by ancestor elements.This property is typically used in vertical writing contexts such as in Japanese documents where it often desired to have the underline appear 'over' (to the right of) the affected run of text",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "alphabetic",
                        desc: "The underline is aligned with the alphabetic baseline. In this case the underline is likely to cross some descenders."
                    },
                    {
                        name: "auto",
                        desc: "The user agent may use any algorithm to determine the underline's position. In horizontal line layout, the underline should be aligned as for alphabetic. In vertical line layout, if the language is set to Japanese or Korean, the underline should be aligned as for over."
                    },
                    {
                        name: "over"
                    },
                    {
                        name: "under"
                    }
                ]
            },
            {
                name: "-ms-touch-action",
                desc: "Gets or sets a value that indicates whether and how a given region can be manipulated by the user.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The element is a passive element, with several exceptions."
                    },
                    {
                        name: "double-tap-zoom",
                        desc: "The element will zoom on double-tap."
                    },
                    {
                        name: "manipulation",
                        desc: "The element is a manipulation-causing element."
                    },
                    {
                        name: "none",
                        desc: "The element is a manipulation-blocking element."
                    },
                    {
                        name: "pan-x",
                        desc: "The element permits touch-driven panning on the horizontal axis. The touch pan is performed on the nearest ancestor with horizontally scrollable content."
                    },
                    {
                        name: "pan-y",
                        desc: "The element permits touch-driven panning on the vertical axis. The touch pan is performed on the nearest ancestor with vertically scrollable content."
                    },
                    {
                        name: "pinch-zoom",
                        desc: "The element permits pinch-zooming. The pinch-zoom is performed on the nearest ancestor with zoomable content."
                    }
                ]
            },
            {
                name: "-ms-touch-select",
                desc: "Gets or sets a value that toggles the 'gripper' visual elements that enable touch text selection.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "grippers"
                    },
                    {
                        name: "none",
                        desc: "Grippers are always off."
                    }
                ]
            },
            {
                name: "-ms-transform",
                desc: "A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
                browsers: "IE9-9",
                restriction: "enum",
                values: [
                    {
                        name: "matrix()"
                    },
                    {
                        name: "matrix3d()"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "rotate()"
                    },
                    {
                        name: "rotate3d()"
                    },
                    {
                        name: "rotateX('angle')"
                    },
                    {
                        name: "rotateY('angle')"
                    },
                    {
                        name: "rotateZ('angle')"
                    },
                    {
                        name: "scale()"
                    },
                    {
                        name: "scale3d()"
                    },
                    {
                        name: "scaleX()"
                    },
                    {
                        name: "scaleY()"
                    },
                    {
                        name: "scaleZ()"
                    },
                    {
                        name: "skew()"
                    },
                    {
                        name: "skewX()"
                    },
                    {
                        name: "skewY()"
                    },
                    {
                        name: "translate()"
                    },
                    {
                        name: "translate3d()"
                    },
                    {
                        name: "translateX()"
                    },
                    {
                        name: "translateY()"
                    },
                    {
                        name: "translateZ()"
                    }
                ]
            },
            {
                name: "-ms-transform-origin",
                desc: "Establishes the origin of transformation for an element.",
                browsers: "IE9-9",
                restriction: "position, length, percentage"
            },
            {
                name: "-ms-transform-origin-x",
                desc: "The x coordinate of the origin for transforms applied to an element with respect to its border box.",
                browsers: "IE10",
                restriction: "length, percentage"
            },
            {
                name: "-ms-transform-origin-y",
                desc: "The y coordinate of the origin for transforms applied to an element with respect to its border box.",
                browsers: "IE10",
                restriction: "length, percentage"
            },
            {
                name: "-ms-transform-origin-z",
                desc: "The z coordinate of the origin for transforms applied to an element with respect to its border box.",
                browsers: "IE10",
                restriction: "length, percentage"
            },
            {
                name: "-ms-user-select",
                desc: "Controls the appearance of selection.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "element"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "text"
                    }
                ]
            },
            {
                name: "-ms-word-break",
                desc: "Specifies line break opportunities for non-CJK scripts.",
                browsers: "IE8",
                restriction: "enum",
                values: [
                    {
                        name: "break-all"
                    },
                    {
                        name: "keep-all",
                        desc: "Block characters can no longer create implied break points."
                    },
                    {
                        name: "normal",
                        desc: "Breaks non-CJK scripts according to their own rules."
                    }
                ]
            },
            {
                name: "-ms-word-wrap",
                desc: "Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit.",
                browsers: "IE8",
                restriction: "enum",
                values: [
                    {
                        name: "break-word",
                        desc: "An unbreakable 'word' may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line."
                    },
                    {
                        name: "normal",
                        desc: "Lines may break only at allowed break points."
                    }
                ]
            },
            {
                name: "-ms-wrap-flow",
                desc: "An element becomes an exclusion when its 'wrap-flow' property has a computed value other than 'auto'.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "For floats an exclusion is created, for all other elements an exclusion is not created."
                    },
                    {
                        name: "both",
                        desc: "Inline flow content can flow on all sides of the exclusion."
                    },
                    {
                        name: "clear"
                    },
                    {
                        name: "end",
                        desc: "Inline flow content can wrap on the end side of the exclusion area but must leave the area to the start edge of the exclusion area empty."
                    },
                    {
                        name: "maximum"
                    },
                    {
                        name: "minimum"
                    },
                    {
                        name: "start",
                        desc: "Inline flow content can wrap on the start edge of the exclusion area but must leave the area to end edge of the exclusion area empty."
                    }
                ]
            },
            {
                name: "-ms-wrap-margin",
                desc: "Gets or sets a value that is used to offset the inner wrap shape from other shapes.",
                browsers: "E,IE10",
                restriction: "length, percentage"
            },
            {
                name: "-ms-wrap-through",
                desc: "Specifies if an element inherits its parent wrapping context. In other words if it is subject to the exclusions defined outside the element.",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "none",
                        desc: "The exclusion element does not inherit its parent node's wrapping context. Its descendants are only subject to exclusion shapes defined inside the element."
                    },
                    {
                        name: "wrap",
                        desc: "The exclusion element inherits its parent node's wrapping context. Its descendant inline content wraps around exclusions defined outside the element."
                    }
                ]
            },
            {
                name: "-ms-writing-mode",
                desc: "Shorthand property for both 'direction' and 'block-progression'.",
                browsers: "IE8",
                restriction: "enum",
                values: [
                    {
                        name: "bt-lr"
                    },
                    {
                        name: "bt-rl"
                    },
                    {
                        name: "lr-bt"
                    },
                    {
                        name: "lr-tb"
                    },
                    {
                        name: "rl-bt"
                    },
                    {
                        name: "rl-tb"
                    },
                    {
                        name: "tb-lr"
                    },
                    {
                        name: "tb-rl"
                    }
                ]
            },
            {
                name: "-ms-zoom",
                desc: "Sets or retrieves the magnification scale of the object.",
                browsers: "IE8",
                restriction: "enum, integer, number, percentage",
                values: [
                    {
                        name: "normal"
                    }
                ]
            },
            {
                name: "-ms-zoom-animation",
                desc: "Gets or sets a value that indicates whether an animation is used when zooming.",
                browsers: "IE10",
                restriction: "enum",
                values: [
                    {
                        name: "default"
                    },
                    {
                        name: "none"
                    }
                ]
            },
            {
                name: "nav-down",
                desc: "Provides an way to control directional focus navigation.",
                browsers: "O9.5",
                restriction: "enum, identifier, string",
                values: [
                    {
                        name: "auto",
                        desc: "The user agent automatically determines which element to navigate the focus to in response to directional navigational input."
                    },
                    {
                        name: "current"
                    },
                    {
                        name: "root"
                    }
                ]
            },
            {
                name: "nav-index",
                desc: "Provides an input-method-neutral way of specifying the sequential navigation order (also known as 'tabbing order').",
                browsers: "O9.5",
                restriction: "number",
                values: [
                    {
                        name: "auto",
                        desc: "The element's sequential navigation order is assigned automatically by the user agent."
                    }
                ]
            },
            {
                name: "nav-left",
                desc: "Provides an way to control directional focus navigation.",
                browsers: "O9.5",
                restriction: "enum, identifier, string",
                values: [
                    {
                        name: "auto",
                        desc: "The user agent automatically determines which element to navigate the focus to in response to directional navigational input."
                    },
                    {
                        name: "current"
                    },
                    {
                        name: "root"
                    }
                ]
            },
            {
                name: "nav-right",
                desc: "Provides an way to control directional focus navigation.",
                browsers: "O9.5",
                restriction: "enum, identifier, string",
                values: [
                    {
                        name: "auto",
                        desc: "The user agent automatically determines which element to navigate the focus to in response to directional navigational input."
                    },
                    {
                        name: "current"
                    },
                    {
                        name: "root"
                    }
                ]
            },
            {
                name: "nav-up",
                desc: "Provides an way to control directional focus navigation.",
                browsers: "O9.5",
                restriction: "enum, identifier, string",
                values: [
                    {
                        name: "auto",
                        desc: "The user agent automatically determines which element to navigate the focus to in response to directional navigational input."
                    },
                    {
                        name: "current"
                    },
                    {
                        name: "root"
                    }
                ]
            },
            {
                name: "negative",
                desc: "@counter-style descriptor. Defines how to alter the representation when the counter value is negative.",
                browsers: "FF33",
                restriction: "image, identifier, string"
            },
            {
                name: "-o-animation",
                desc: "Shorthand property combines six of the animation properties into a single property.",
                browsers: "O12",
                restriction: "time, enum, timing-function, identifier, number",
                values: [
                    {
                        name: "alternate"
                    },
                    {
                        name: "alternate-reverse"
                    },
                    {
                        name: "backwards"
                    },
                    {
                        name: "both",
                        desc: "Both forwards and backwards fill modes are applied."
                    },
                    {
                        name: "forwards"
                    },
                    {
                        name: "infinite",
                        desc: "Causes the animation to repeat forever."
                    },
                    {
                        name: "none",
                        desc: "No animation is performed"
                    },
                    {
                        name: "normal",
                        desc: "Normal playback."
                    },
                    {
                        name: "reverse",
                        desc: "All iterations of the animation are played in the reverse direction from the way they were specified."
                    }
                ]
            },
            {
                name: "-o-animation-delay",
                desc: "Defines when the animation will start.",
                browsers: "O12",
                restriction: "time"
            },
            {
                name: "-o-animation-direction",
                desc: "Defines whether or not the animation should play in reverse on alternate cycles.",
                browsers: "O12",
                restriction: "enum",
                values: [
                    {
                        name: "alternate"
                    },
                    {
                        name: "alternate-reverse"
                    },
                    {
                        name: "normal",
                        desc: "Normal playback."
                    },
                    {
                        name: "reverse",
                        desc: "All iterations of the animation are played in the reverse direction from the way they were specified."
                    }
                ]
            },
            {
                name: "-o-animation-duration",
                desc: "Defines the length of time that an animation takes to complete one cycle.",
                browsers: "O12",
                restriction: "time"
            },
            {
                name: "-o-animation-fill-mode",
                desc: "Defines what values are applied by the animation outside the time it is executing.",
                browsers: "O12",
                restriction: "enum",
                values: [
                    {
                        name: "backwards"
                    },
                    {
                        name: "both",
                        desc: "Both forwards and backwards fill modes are applied."
                    },
                    {
                        name: "forwards"
                    },
                    {
                        name: "none",
                        desc: "There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes."
                    }
                ]
            },
            {
                name: "-o-animation-iteration-count",
                desc: "Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.",
                browsers: "O12",
                restriction: "number, enum",
                values: [
                    {
                        name: "infinite",
                        desc: "Causes the animation to repeat forever."
                    }
                ]
            },
            {
                name: "-o-animation-name",
                desc: "Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.",
                browsers: "O12",
                restriction: "identifier, enum",
                values: [
                    {
                        name: "none",
                        desc: "No animation is performed"
                    }
                ]
            },
            {
                name: "-o-animation-play-state",
                desc: "Defines whether the animation is running or paused.",
                browsers: "O12",
                restriction: "enum",
                values: [
                    {
                        name: "paused"
                    },
                    {
                        name: "running"
                    }
                ]
            },
            {
                name: "-o-animation-timing-function",
                desc: "Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'.",
                browsers: "O12",
                restriction: "timing-function"
            },
            {
                name: "object-fit",
                desc: "Specifies how the contents of a replaced element should be scaled relative to the box established by its used height and width.",
                browsers: "C32,FF36,O19,S7.1",
                restriction: "enum",
                values: [
                    {
                        name: "contain",
                        desc: "The replaced content is sized to maintain its aspect ratio while fitting within the element’s content box: its concrete object size is resolved as a contain constraint against the element's used width and height."
                    },
                    {
                        name: "cover",
                        desc: "The replaced content is sized to maintain its aspect ratio while filling the element's entire content box: its concrete object size is resolved as a cover constraint against the element’s used width and height."
                    },
                    {
                        name: "fill",
                        desc: "The replaced content is sized to fill the element’s content box: the object's concrete object size is the element's used width and height."
                    },
                    {
                        name: "none",
                        desc: "The replaced content is not resized to fit inside the element's content box"
                    },
                    {
                        name: "scale-down"
                    }
                ]
            },
            {
                name: "object-position",
                desc: "Determines the alignment of the replaced element inside its box.",
                browsers: "C32,FF36,O19",
                restriction: "position, length, percentage"
            },
            {
                name: "-o-border-image",
                desc: "Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
                browsers: "O11.6",
                restriction: "length, percentage, number, image, enum",
                values: [
                    {
                        name: "auto",
                        desc: "If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead."
                    },
                    {
                        name: "fill",
                        desc: "Causes the middle part of the border-image to be preserved."
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "repeat"
                    },
                    {
                        name: "round",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does."
                    },
                    {
                        name: "space",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles."
                    },
                    {
                        name: "stretch",
                        desc: "The image is stretched to fill the area."
                    }
                ]
            },
            {
                name: "-o-object-fit",
                desc: "Specifies how the contents of a replaced element should be scaled relative to the box established by its used height and width.",
                browsers: "O10.6",
                restriction: "enum",
                values: [
                    {
                        name: "contain",
                        desc: "The replaced content is sized to maintain its aspect ratio while fitting within the element’s content box: its concrete object size is resolved as a contain constraint against the element's used width and height."
                    },
                    {
                        name: "cover",
                        desc: "The replaced content is sized to maintain its aspect ratio while filling the element's entire content box: its concrete object size is resolved as a cover constraint against the element’s used width and height."
                    },
                    {
                        name: "fill",
                        desc: "The replaced content is sized to fill the element’s content box: the object's concrete object size is the element's used width and height."
                    },
                    {
                        name: "none",
                        desc: "The replaced content is not resized to fit inside the element's content box"
                    },
                    {
                        name: "scale-down"
                    }
                ]
            },
            {
                name: "-o-object-position",
                desc: "Determines the alignment of the replaced element inside its box.",
                browsers: "O10.6",
                restriction: "position, length, percentage"
            },
            {
                name: "opacity",
                desc: "Opacity of an element's text, where 1 is opaque and 0 is entirely transparent.",
                browsers: "C,FF3.6,IE9,O9,S1.2",
                restriction: "number(0-1)"
            },
            {
                name: "order",
                desc: "Controls the order in which children of a flex container appear within the flex container, by assigning them to ordinal groups.",
                browsers: "E,C29,FF22,IE11,O12.1,S9",
                restriction: "integer"
            },
            {
                name: "orphans",
                desc: "Specifies the minimum number of line boxes in a block container that must be left in a fragment before a fragmentation break.",
                browsers: "C,IE8,O7,S1.3",
                restriction: "integer"
            },
            {
                name: "-o-table-baseline",
                desc: "Determines which row of a inline-table should be used as baseline of inline-table.",
                browsers: "O9.6",
                restriction: "integer"
            },
            {
                name: "-o-tab-size",
                desc: "This property determines the width of the tab character (U+0009), in space characters (U+0020), when rendered.",
                browsers: "O10.6",
                restriction: "integer, length"
            },
            {
                name: "-o-text-overflow",
                desc: "Text can overflow for example when it is prevented from wrapping",
                browsers: "O10",
                restriction: "enum",
                values: [
                    {
                        name: "clip"
                    },
                    {
                        name: "ellipsis"
                    }
                ]
            },
            {
                name: "-o-transform",
                desc: "A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
                browsers: "O10.5",
                restriction: "enum",
                values: [
                    {
                        name: "matrix()"
                    },
                    {
                        name: "matrix3d()"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "rotate()"
                    },
                    {
                        name: "rotate3d()"
                    },
                    {
                        name: "rotateX('angle')"
                    },
                    {
                        name: "rotateY('angle')"
                    },
                    {
                        name: "rotateZ('angle')"
                    },
                    {
                        name: "scale()"
                    },
                    {
                        name: "scale3d()"
                    },
                    {
                        name: "scaleX()"
                    },
                    {
                        name: "scaleY()"
                    },
                    {
                        name: "scaleZ()"
                    },
                    {
                        name: "skew()"
                    },
                    {
                        name: "skewX()"
                    },
                    {
                        name: "skewY()"
                    },
                    {
                        name: "translate()"
                    },
                    {
                        name: "translate3d()"
                    },
                    {
                        name: "translateX()"
                    },
                    {
                        name: "translateY()"
                    },
                    {
                        name: "translateZ()"
                    }
                ]
            },
            {
                name: "-o-transform-origin",
                desc: "Establishes the origin of transformation for an element.",
                browsers: "O10.5",
                restriction: "positon, length, percentage"
            },
            {
                name: "-o-transition",
                desc: "Shorthand property combines four of the transition properties into a single property.",
                browsers: "O11.5",
                restriction: "time, property, timing-function, enum",
                values: [
                    {
                        name: "all",
                        desc: "Every property that is able to undergo a transition will do so."
                    },
                    {
                        name: "none",
                        desc: "No property will transition."
                    }
                ]
            },
            {
                name: "-o-transition-delay",
                desc: "Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.",
                browsers: "O11.5",
                restriction: "time"
            },
            {
                name: "-o-transition-duration",
                desc: "Specifies how long the transition from the old value to the new value should take.",
                browsers: "O11.5",
                restriction: "time"
            },
            {
                name: "-o-transition-property",
                desc: "Specifies the name of the CSS property to which the transition is applied.",
                browsers: "O11.5",
                restriction: "property",
                values: [
                    {
                        name: "all",
                        desc: "Every property that is able to undergo a transition will do so."
                    },
                    {
                        name: "none",
                        desc: "No property will transition."
                    }
                ]
            },
            {
                name: "-o-transition-timing-function",
                desc: "Describes how the intermediate values used during a transition will be calculated.",
                browsers: "O11.5",
                restriction: "timing-function"
            },
            {
                name: "offset-block-end",
                desc: "Logical 'bottom'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well."
                    }
                ]
            },
            {
                name: "offset-block-start",
                desc: "Logical 'top'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well."
                    }
                ]
            },
            {
                name: "offset-inline-end",
                desc: "Logical 'right'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well."
                    }
                ]
            },
            {
                name: "offset-inline-start",
                desc: "Logical 'left'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well."
                    }
                ]
            },
            {
                name: "outline",
                desc: "Shorthand property for 'outline-style', 'outline-width', and 'outline-color'.",
                browsers: "E,C,FF1.5,IE8,O8,S1.2",
                restriction: "length, line-width, line-style, color, enum",
                values: [
                    {
                        name: "auto",
                        desc: "Permits the user agent to render a custom outline style, typically the default platform style."
                    },
                    {
                        name: "invert",
                        browsers: "E,IE8,O"
                    }
                ]
            },
            {
                name: "outline-color",
                desc: "The color of the outline.",
                browsers: "E,C,FF1.5,IE8,O8,S1.2",
                restriction: "enum, color",
                values: [
                    {
                        name: "invert",
                        browsers: "E,IE8,O"
                    }
                ]
            },
            {
                name: "outline-offset",
                desc: "Offset the outline and draw it beyond the border edge.",
                browsers: "C,FF1.5,O9.5,S1.2",
                restriction: "length"
            },
            {
                name: "outline-style",
                desc: "Style of the outline.",
                browsers: "E,C,FF1.5,IE8,O8,S1.2",
                restriction: "line-style, enum",
                values: [
                    {
                        name: "auto",
                        desc: "Permits the user agent to render a custom outline style, typically the default platform style."
                    }
                ]
            },
            {
                name: "outline-width",
                desc: "Width of the outline.",
                browsers: "E,C,FF1.5,IE8,O8,S1.2",
                restriction: "length, line-width"
            },
            {
                name: "overflow",
                desc: "Shorthand for setting 'overflow-x' and 'overflow-y'.",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes."
                    },
                    {
                        name: "hidden",
                        desc: "Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region."
                    },
                    {
                        name: "-moz-hidden-unscrollable",
                        browsers: "FF"
                    },
                    {
                        name: "scroll",
                        desc: "Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped."
                    },
                    {
                        name: "visible",
                        desc: "Content is not clipped, i.e., it may be rendered outside the content box."
                    }
                ]
            },
            {
                name: "overflow-wrap",
                desc: "Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit within the line box.",
                browsers: "C23,O12.1,S6.1",
                restriction: "enum",
                values: [
                    {
                        name: "break-word",
                        desc: "An otherwise unbreakable sequence of characters may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line."
                    },
                    {
                        name: "normal",
                        desc: "Lines may break only at allowed break points."
                    }
                ]
            },
            {
                name: "overflow-x",
                desc: "Specifies the handling of overflow in the horizontal direction.",
                browsers: "E,C,FF1.5,IE5,O9.5,S3",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes."
                    },
                    {
                        name: "hidden",
                        desc: "Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region."
                    },
                    {
                        name: "scroll",
                        desc: "Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped."
                    },
                    {
                        name: "visible",
                        desc: "Content is not clipped, i.e., it may be rendered outside the content box."
                    }
                ]
            },
            {
                name: "overflow-y",
                desc: "Specifies the handling of overflow in the vertical direction.",
                browsers: "E,C,FF1.5,IE5,O9.5,S3",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The behavior of the 'auto' value is UA-dependent, but should cause a scrolling mechanism to be provided for overflowing boxes."
                    },
                    {
                        name: "hidden",
                        desc: "Content is clipped and no scrolling mechanism should be provided to view the content outside the clipping region."
                    },
                    {
                        name: "scroll",
                        desc: "Content is clipped and if the user agent uses a scrolling mechanism that is visible on the screen (such as a scroll bar or a panner), that mechanism should be displayed for a box whether or not any of its content is clipped."
                    },
                    {
                        name: "visible",
                        desc: "Content is not clipped, i.e., it may be rendered outside the content box."
                    }
                ]
            },
            {
                name: "pad",
                desc: "@counter-style descriptor. Specifies a “fixed-width” counter style, where representations shorter than the pad value are padded with a particular <symbol>",
                browsers: "FF33",
                restriction: "integer, image, string, identifier"
            },
            {
                name: "padding",
                desc: "Shorthand property to set values the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
                restriction: "length, percentage",
                values: []
            },
            {
                name: "padding-bottom",
                desc: "Shorthand property to set values the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
                restriction: "length, percentage"
            },
            {
                name: "padding-block-end",
                desc: "Logical 'padding-bottom'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage"
            },
            {
                name: "padding-block-start",
                desc: "Logical 'padding-top'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage"
            },
            {
                name: "padding-inline-end",
                desc: "Logical 'padding-right'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage"
            },
            {
                name: "padding-inline-start",
                desc: "Logical 'padding-left'. Mapping depends on the parent element’s 'writing-mode', 'direction', and 'text-orientation'.",
                browsers: "FF41",
                restriction: "length, percentage"
            },
            {
                name: "padding-left",
                desc: "Shorthand property to set values the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
                restriction: "length, percentage"
            },
            {
                name: "padding-right",
                desc: "Shorthand property to set values the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
                restriction: "length, percentage"
            },
            {
                name: "padding-top",
                desc: "Shorthand property to set values the thickness of the padding area. If left is omitted, it is the same as right. If bottom is omitted it is the same as top, if right is omitted it is the same as top. The value may not be negative.",
                restriction: "length, percentage"
            },
            {
                name: "page-break-after",
                desc: "Defines rules for page breaks after an element.",
                restriction: "enum",
                values: [
                    {
                        name: "always",
                        desc: "Always force a page break after the generated box."
                    },
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page break after generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page break after the generated box."
                    },
                    {
                        name: "left",
                        desc: "Force one or two page breaks after the generated box so that the next page is formatted as a left page."
                    },
                    {
                        name: "right",
                        desc: "Force one or two page breaks after the generated box so that the next page is formatted as a right page."
                    }
                ]
            },
            {
                name: "page-break-before",
                desc: "Defines rules for page breaks before an element.",
                restriction: "enum",
                values: [
                    {
                        name: "always",
                        desc: "Always force a page break before the generated box."
                    },
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page break before the generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page break before the generated box."
                    },
                    {
                        name: "left",
                        desc: "Force one or two page breaks before the generated box so that the next page is formatted as a left page."
                    },
                    {
                        name: "right",
                        desc: "Force one or two page breaks before the generated box so that the next page is formatted as a right page."
                    }
                ]
            },
            {
                name: "page-break-inside",
                desc: "Defines rules for page breaks inside an element.",
                browsers: "C,IE8,O7,S1.3",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page break inside the generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page break inside the generated box."
                    }
                ]
            },
            {
                name: "paint-order",
                desc: "Controls the order that the three paint operations that shapes and text are rendered with: their fill, their stroke and any markers they might have.",
                browsers: "C35,FF31,O22,S7.1",
                restriction: "enum",
                values: [
                    {
                        name: "fill"
                    },
                    {
                        name: "markers"
                    },
                    {
                        name: "normal",
                        desc: "The element is painted with the standard order of painting operations: the 'fill' is painted first, then its 'stroke' and finally its markers."
                    },
                    {
                        name: "stroke"
                    }
                ]
            },
            {
                name: "perspective",
                desc: "Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.",
                browsers: "E,C36,FF16,IE10,O23,S9",
                restriction: "length, enum",
                values: [
                    {
                        name: "none",
                        desc: "No perspective transform is applied."
                    }
                ]
            },
            {
                name: "perspective-origin",
                desc: "Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.",
                browsers: "E,C36,FF16,IE10,O23,S9",
                restriction: "position, percentage, length"
            },
            {
                name: "pointer-events",
                desc: "Specifies under what circumstances a given element can be the target element for a pointer event.",
                restriction: "enum",
                values: [
                    {
                        name: "all",
                        desc: "The given element can be the target element for pointer events whenever the pointer is over either the interior or the perimeter of the element."
                    },
                    {
                        name: "fill",
                        desc: "The given element can be the target element for pointer events whenever the pointer is over the interior of the element."
                    },
                    {
                        name: "none",
                        desc: "The given element does not receive pointer events."
                    },
                    {
                        name: "painted"
                    },
                    {
                        name: "stroke",
                        desc: "The given element can be the target element for pointer events whenever the pointer is over the perimeter of the element."
                    },
                    {
                        name: "visible",
                        desc: "The given element can be the target element for pointer events when the ‘visibility’ property is set to visible and the pointer is over either the interior or the perimete of the element."
                    },
                    {
                        name: "visibleFill"
                    },
                    {
                        name: "visiblePainted"
                    },
                    {
                        name: "visibleStroke"
                    }
                ]
            },
            {
                name: "position",
                restriction: "enum",
                values: [
                    {
                        name: "absolute"
                    },
                    {
                        name: "fixed",
                        desc: "The box's position is calculated according to the 'absolute' model, but in addition, the box is fixed with respect to some reference. As with the 'absolute' model, the box's margins do not collapse with any other margins."
                    },
                    {
                        name: "-ms-page",
                        browsers: "E,IE10"
                    },
                    {
                        name: "relative"
                    },
                    {
                        name: "static"
                    },
                    {
                        name: "sticky",
                        browsers: "C56,FF32"
                    },
                    {
                        name: "-webkit-sticky",
                        browsers: "S6.1"
                    }
                ]
            },
            {
                name: "prefix",
                desc: "@counter-style descriptor. Specifies a <symbol> that is prepended to the marker representation.",
                browsers: "FF33",
                restriction: "image, string, identifier"
            },
            {
                name: "quotes",
                desc: "Specifies quotation marks for any number of embedded quotations.",
                browsers: "E,C,FF1.5,IE8,O8,S5.1",
                restriction: "string",
                values: [
                    {
                        name: "none",
                        desc: "The 'open-quote' and 'close-quote' values of the 'content' property produce no quotations marks, as if they were 'no-open-quote' and 'no-close-quote' respectively."
                    }
                ]
            },
            {
                name: "range",
                desc: "@counter-style descriptor. Defines the ranges over which the counter style is defined.",
                browsers: "FF33",
                restriction: "integer, enum",
                values: [
                    {
                        name: "auto",
                        desc: "The range depends on the counter system."
                    },
                    {
                        name: "infinite",
                        desc: "If used as the first value in a range, it represents negative infinity; if used as the second value, it represents positive infinity."
                    }
                ]
            },
            {
                name: "resize",
                desc: "Specifies whether or not an element is resizable by the user, and if so, along which axis/axes.",
                browsers: "C,FF4,O15,S3",
                restriction: "enum",
                values: [
                    {
                        name: "both",
                        desc: "The UA presents a bidirectional resizing mechanism to allow the user to adjust both the height and the width of the element."
                    },
                    {
                        name: "horizontal",
                        desc: "The UA presents a unidirectional horizontal resizing mechanism to allow the user to adjust only the width of the element."
                    },
                    {
                        name: "none",
                        desc: "The UA does not present a resizing mechanism on the element, and the user is given no direct manipulation mechanism to resize the element."
                    },
                    {
                        name: "vertical",
                        desc: "The UA presents a unidirectional vertical resizing mechanism to allow the user to adjust only the height of the element."
                    }
                ]
            },
            {
                name: "right",
                desc: "Specifies how far an absolutely positioned box's right margin edge is offset to the left of the right edge of the box's 'containing block'.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well"
                    }
                ]
            },
            {
                name: "ruby-align",
                desc: "Specifies how text is distributed within the various ruby boxes when their contents do not exactly fill their respective boxes.",
                browsers: "FF10,IE5",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The user agent determines how the ruby contents are aligned. This is the initial value.",
                        browsers: "E,IE5"
                    },
                    {
                        name: "center",
                        desc: "The ruby content is centered within its box."
                    },
                    {
                        name: "distribute-letter",
                        browsers: "E,IE5"
                    },
                    {
                        name: "distribute-space",
                        browsers: "E,IE5"
                    },
                    {
                        name: "left",
                        desc: "The ruby text content is aligned with the start edge of the base."
                    },
                    {
                        name: "line-edge",
                        browsers: "E,IE5"
                    },
                    {
                        name: "right",
                        desc: "The ruby text content is aligned with the end edge of the base.",
                        browsers: "E,IE5"
                    },
                    {
                        name: "start",
                        desc: "The ruby text content is aligned with the start edge of the base.",
                        browsers: "FF10"
                    },
                    {
                        name: "space-between",
                        desc: "The ruby content expands as defined for normal text justification (as defined by 'text-justify'),",
                        browsers: "FF10"
                    },
                    {
                        name: "space-around",
                        desc: "As for 'space-between' except that there exists an extra justification opportunities whose space is distributed half before and half after the ruby content.",
                        browsers: "FF10"
                    }
                ]
            },
            {
                name: "ruby-overhang",
                desc: "Determines whether, and on which side, ruby text is allowed to partially overhang any adjacent text in addition to its own base, when the ruby text is wider than the ruby base.",
                browsers: "FF10,IE5",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The ruby text can overhang text adjacent to the base on either side. This is the initial value."
                    },
                    {
                        name: "end",
                        desc: "The ruby text can overhang the text that follows it."
                    },
                    {
                        name: "none",
                        desc: "The ruby text cannot overhang any text adjacent to its base, only its own base."
                    },
                    {
                        name: "start",
                        desc: "The ruby text can overhang the text that precedes it."
                    }
                ]
            },
            {
                name: "ruby-position",
                desc: "Used by the parent of elements with display: ruby-text to control the position of the ruby text with respect to its base.",
                browsers: "FF10,IE5",
                restriction: "enum",
                values: [
                    {
                        name: "after"
                    },
                    {
                        name: "before"
                    },
                    {
                        name: "inline"
                    },
                    {
                        name: "right",
                        desc: "The ruby text appears on the right of the base. Unlike 'before' and 'after', this value is not relative to the text flow direction."
                    }
                ]
            },
            {
                name: "ruby-span",
                desc: "Determines whether, and on which side, ruby text is allowed to partially overhang any adjacent text in addition to its own base, when the ruby text is wider than the ruby base.",
                browsers: "FF10",
                restriction: "enum",
                values: [
                    {
                        name: "attr(x)"
                    },
                    {
                        name: "none",
                        desc: "No spanning. The computed value is '1'."
                    }
                ]
            },
            {
                name: "scrollbar-3dlight-color",
                desc: "Determines the color of the top and left edges of the scroll box and scroll arrows of a scroll bar.",
                browsers: "IE6",
                restriction: "color"
            },
            {
                name: "scrollbar-arrow-color",
                desc: "Determines the color of the arrow elements of a scroll arrow.",
                browsers: "IE6",
                restriction: "color"
            },
            {
                name: "scrollbar-base-color",
                desc: "Determines the color of the main elements of a scroll bar, which include the scroll box, track, and scroll arrows.",
                browsers: "IE6",
                restriction: "color"
            },
            {
                name: "scrollbar-darkshadow-color",
                desc: "Determines the color of the gutter of a scroll bar.",
                browsers: "IE6",
                restriction: "color"
            },
            {
                name: "scrollbar-face-color",
                desc: "Determines the color of the scroll box and scroll arrows of a scroll bar.",
                browsers: "IE6",
                restriction: "color"
            },
            {
                name: "scrollbar-highlight-color",
                desc: "Determines the color of the top and left edges of the scroll box and scroll arrows of a scroll bar.",
                browsers: "IE6",
                restriction: "color"
            },
            {
                name: "scrollbar-shadow-color",
                desc: "Determines the color of the bottom and right edges of the scroll box and scroll arrows of a scroll bar.",
                browsers: "IE6",
                restriction: "color"
            },
            {
                name: "scrollbar-track-color",
                desc: "Determines the color of the track element of a scroll bar.",
                browsers: "IE6",
                restriction: "color"
            },
            {
                name: "scroll-behavior",
                desc: "Specifies the scrolling behavior for a scrolling box, when scrolling happens due to navigation or CSSOM scrolling APIs.",
                browsers: "FF36",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Scrolls in an instant fashion."
                    },
                    {
                        name: "smooth"
                    }
                ]
            },
            {
                name: "scroll-snap-coordinate",
                desc: "Defines the x and y coordinate within the element which will align with the nearest ancestor scroll container’s snap-destination for the respective axis.",
                browsers: "FF39",
                restriction: "position, length, percentage, enum",
                values: [
                    {
                        name: "none",
                        desc: "Specifies that this element does not contribute a snap point."
                    }
                ]
            },
            {
                name: "scroll-snap-destination",
                desc: "Define the x and y coordinate within the scroll container’s visual viewport which element snap points will align with.",
                browsers: "FF39",
                restriction: "position, length, percentage"
            },
            {
                name: "scroll-snap-points-x",
                desc: "Defines the positioning of snap points along the x axis of the scroll container it is applied to.",
                browsers: "FF39",
                restriction: "enum",
                values: [
                    {
                        name: "none",
                        desc: "No snap points are defined by this scroll container."
                    },
                    {
                        name: "repeat()",
                        desc: "Defines an interval at which snap points are defined, starting from the container’s relevant start edge."
                    }
                ]
            },
            {
                name: "scroll-snap-points-y",
                desc: "Defines the positioning of snap points alobg the y axis of the scroll container it is applied to.",
                browsers: "FF39",
                restriction: "enum",
                values: [
                    {
                        name: "none",
                        desc: "No snap points are defined by this scroll container."
                    },
                    {
                        name: "repeat()",
                        desc: "Defines an interval at which snap points are defined, starting from the container’s relevant start edge."
                    }
                ]
            },
            {
                name: "scroll-snap-type",
                desc: "Defines how strictly snap points are enforced on the scroll container.",
                browsers: "FF39",
                restriction: "enum",
                values: [
                    {
                        name: "none",
                        desc: "The visual viewport of this scroll container must ignore snap points, if any, when scrolled."
                    },
                    {
                        name: "mandatory",
                        desc: "The visual viewport of this scroll container is guaranteed to rest on a snap point when there are no active scrolling operations."
                    },
                    {
                        name: "proximity",
                        desc: "The visual viewport of this scroll container may come to rest on a snap point at the termination of a scroll at the discretion of the UA given the parameters of the scroll."
                    }
                ]
            },
            {
                name: "shape-image-threshold",
                desc: "Defines the alpha channel threshold used to extract the shape using an image. A value of 0.5 means that the shape will enclose all the pixels that are more than 50% opaque.",
                browsers: "C37,O24",
                restriction: "number"
            },
            {
                name: "shape-margin",
                desc: "Adds a margin to a 'shape-outside'. This defines a new shape that is the smallest contour that includes all the points that are the 'shape-margin' distance outward in the perpendicular direction from a point on the underlying shape.",
                browsers: "C37,O24",
                restriction: "url, length, percentage"
            },
            {
                name: "shape-outside",
                desc: "Specifies an orthogonal rotation to be applied to an image before it is laid out.",
                browsers: "C37,O24",
                restriction: "image, box, shape, enum",
                values: [
                    {
                        name: "margin-box"
                    },
                    {
                        name: "none",
                        desc: "The float area is unaffected."
                    }
                ]
            },
            {
                name: "shape-rendering",
                desc: "Provides hints about what tradeoffs to make as it renders vector graphics elements such as <path> elements and basic shapes such as circles and rectangles.",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Suppresses aural rendering."
                    },
                    {
                        name: "crispEdges"
                    },
                    {
                        name: "geometricPrecision",
                        desc: "Emphasize geometric precision over speed and crisp edges."
                    },
                    {
                        name: "optimizeSpeed",
                        desc: "Emphasize rendering speed over geometric precision and crisp edges."
                    }
                ]
            },
            {
                name: "size",
                browsers: "C,O8",
                restriction: "length"
            },
            {
                name: "src",
                desc: "@font-face descriptor. Specifies the resource containing font data. It is required, whether the font is downloadable or locally installed.",
                restriction: "enum, url, identifier",
                values: [
                    {
                        name: "url()",
                        desc: "Reference font by URL"
                    },
                    {
                        name: "format()"
                    },
                    {
                        name: "local()"
                    }
                ]
            },
            {
                name: "stop-color",
                desc: "Indicates what color to use at that gradient stop.",
                restriction: "color"
            },
            {
                name: "stop-opacity",
                desc: "Defines the opacity of a given gradient stop.",
                restriction: "number(0-1)"
            },
            {
                name: "stroke",
                desc: "Paints along the outline of the given graphical element.",
                restriction: "color, enum, url",
                values: [
                    {
                        name: "url()",
                        desc: "A URL reference to a paint server element, which is an element that defines a paint server: ‘hatch’, ‘linearGradient’, ‘mesh’, ‘pattern’, ‘radialGradient’ and ‘solidcolor’."
                    }
                ]
            },
            {
                name: "stroke-dasharray",
                desc: "Controls the pattern of dashes and gaps used to stroke paths.",
                restriction: "length, percentage, number, enum",
                values: [
                    {
                        name: "none",
                        desc: "Indicates that no dashing is used."
                    }
                ]
            },
            {
                name: "stroke-dashoffset",
                desc: "Specifies the distance into the dash pattern to start the dash.",
                restriction: "percentage, length"
            },
            {
                name: "stroke-linecap",
                desc: "Specifies the shape to be used at the end of open subpaths when they are stroked.",
                restriction: "enum",
                values: [
                    {
                        name: "butt"
                    },
                    {
                        name: "round",
                        desc: "Indicates that at each end of each subpath, the shape representing the stroke will be extended by a half circle with a radius equal to the stroke width."
                    },
                    {
                        name: "square",
                        desc: "Indicates that at the end of each subpath, the shape representing the stroke will be extended by a rectangle with the same width as the stroke width and whose length is half of the stroke width."
                    }
                ]
            },
            {
                name: "stroke-linejoin",
                desc: "Specifies the shape to be used at the corners of paths or basic shapes when they are stroked.",
                restriction: "enum",
                values: [
                    {
                        name: "bevel"
                    },
                    {
                        name: "miter"
                    },
                    {
                        name: "round",
                        desc: "Indicates that a round corner is to be used to join path segments."
                    }
                ]
            },
            {
                name: "stroke-miterlimit",
                desc: "When two line segments meet at a sharp angle and miter joins have been specified for 'stroke-linejoin', it is possible for the miter to extend far beyond the thickness of the line stroking the path.",
                restriction: "number"
            },
            {
                name: "stroke-opacity",
                desc: "Specifies the opacity of the painting operation used to stroke the current object.",
                restriction: "number(0-1)"
            },
            {
                name: "stroke-width",
                desc: "Specifies the width of the stroke on the current object.",
                restriction: "percentage, length"
            },
            {
                name: "suffix",
                desc: "@counter-style descriptor. Specifies a <symbol> that is appended to the marker representation.",
                browsers: "FF33",
                restriction: "image, string, identifier"
            },
            {
                name: "system",
                desc: "@counter-style descriptor. Specifies which algorithm will be used to construct the counter’s representation based on the counter value.",
                browsers: "FF33",
                restriction: "enum, integer",
                values: [
                    {
                        name: "additive"
                    },
                    {
                        name: "alphabetic",
                        desc: "Interprets the list of counter symbols as digits to an alphabetic numbering system, similar to the default lower-alpha counter style, which wraps from \"a\", \"b\", \"c\", to \"aa\", \"ab\", \"ac\"."
                    },
                    {
                        name: "cyclic"
                    },
                    {
                        name: "extends"
                    },
                    {
                        name: "fixed",
                        desc: "Runs through its list of counter symbols once, then falls back."
                    },
                    {
                        name: "numeric"
                    },
                    {
                        name: "symbolic"
                    }
                ]
            },
            {
                name: "symbols",
                desc: "@counter-style descriptor. Specifies the symbols used by the marker-construction algorithm specified by the system descriptor.",
                browsers: "FF33",
                restriction: "image, string, identifier"
            },
            {
                name: "table-layout",
                desc: "Controls the algorithm used to lay out the table cells, rows, and columns.",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Use any automatic table layout algorithm."
                    },
                    {
                        name: "fixed",
                        desc: "Use the fixed table layout algorithm."
                    }
                ]
            },
            {
                name: "tab-size",
                desc: "Determines the width of the tab character (U+0009), in space characters (U+0020), when rendered.",
                browsers: "C21,O15,S6.1",
                restriction: "integer, length"
            },
            {
                name: "text-align",
                desc: "Describes how inline contents of a block are horizontally aligned if the contents do not completely fill the line box.",
                restriction: "string",
                values: [
                    {
                        name: "center",
                        desc: "The inline contents are centered within the line box."
                    },
                    {
                        name: "end",
                        desc: "The inline contents are aligned to the end edge of the line box.",
                        browsers: "C,FF3.6,O15,S3.1"
                    },
                    {
                        name: "justify",
                        desc: "The text is justified according to the method specified by the 'text-justify' property."
                    },
                    {
                        name: "left",
                        desc: "The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text."
                    },
                    {
                        name: "right",
                        desc: "The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text."
                    },
                    {
                        name: "start",
                        desc: "The inline contents are aligned to the start edge of the line box.",
                        browsers: "C,FF1,O15,S3.1"
                    }
                ]
            },
            {
                name: "text-align-last",
                desc: "Describes how the last line of a block or a line right before a forced line break is aligned when 'text-align' is set to 'justify'.",
                browsers: "E,FF12,IE5",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Content on the affected line is aligned per 'text-align' unless 'text-align' is set to 'justify', in which case it is 'start-aligned'."
                    },
                    {
                        name: "center",
                        desc: "The inline contents are centered within the line box."
                    },
                    {
                        name: "justify",
                        desc: "The text is justified according to the method specified by the 'text-justify' property."
                    },
                    {
                        name: "left",
                        desc: "The inline contents are aligned to the left edge of the line box. In vertical text, 'left' aligns to the edge of the line box that would be the start edge for left-to-right text."
                    },
                    {
                        name: "right",
                        desc: "The inline contents are aligned to the right edge of the line box. In vertical text, 'right' aligns to the edge of the line box that would be the end edge for left-to-right text."
                    }
                ]
            },
            {
                name: "text-anchor",
                desc: "Used to align (start-, middle- or end-alignment) a string of text relative to a given point.",
                restriction: "enum",
                values: [
                    {
                        name: "end",
                        desc: "The rendered characters are aligned such that the end of the resulting rendered text is at the initial current text position."
                    },
                    {
                        name: "middle",
                        desc: "The rendered characters are aligned such that the geometric middle of the resulting rendered text is at the initial current text position."
                    },
                    {
                        name: "start",
                        desc: "The rendered characters are aligned such that the start of the resulting rendered text is at the initial current text position."
                    }
                ]
            },
            {
                name: "text-decoration",
                desc: "Decorations applied to font used for an element's text.",
                restriction: "enum, color",
                values: [
                    {
                        name: "dashed"
                    },
                    {
                        name: "dotted"
                    },
                    {
                        name: "double"
                    },
                    {
                        name: "line-through"
                    },
                    {
                        name: "overline"
                    },
                    {
                        name: "solid"
                    },
                    {
                        name: "underline"
                    },
                    {
                        name: "wavy"
                    }
                ]
            },
            {
                name: "text-decoration-color",
                desc: "Specifies the color of text decoration (underlines overlines, and line-throughs) set on the element with text-decoration-line.",
                browsers: "FF36,C57,O44",
                restriction: "color"
            },
            {
                name: "text-decoration-line",
                desc: "Specifies what line decorations, if any, are added to the element.",
                browsers: "FF36",
                restriction: "enum",
                values: [
                    {
                        name: "line-through"
                    },
                    {
                        name: "none",
                        desc: "Neither produces nor inhibits text decoration."
                    },
                    {
                        name: "overline"
                    },
                    {
                        name: "underline"
                    }
                ]
            },
            {
                name: "text-decoration-style",
                desc: "Specifies the line style for underline, line-through and overline text decoration.",
                browsers: "FF36",
                restriction: "enum",
                values: [
                    {
                        name: "dashed"
                    },
                    {
                        name: "dotted"
                    },
                    {
                        name: "double"
                    },
                    {
                        name: "none",
                        desc: "Produces no line."
                    },
                    {
                        name: "solid"
                    },
                    {
                        name: "wavy"
                    }
                ]
            },
            {
                name: "text-indent",
                desc: "Specifies the indentation applied to lines of inline content in a block. The indentation only affects the first line of inline content in the block unless the 'hanging' keyword is specified, in which case it affects all lines except the first.",
                restriction: "percentage, length",
                values: []
            },
            {
                name: "text-justify",
                desc: "Selects the justification algorithm used when 'text-align' is set to 'justify'. The property applies to block containers, but the UA may (but is not required to) also support it on inline elements.",
                browsers: "E,IE5.5",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The UA determines the justification algorithm to follow, based on a balance between performance and adequate presentation quality."
                    },
                    {
                        name: "distribute",
                        desc: "Justification primarily changes spacing both at word separators and at grapheme cluster boundaries in all scripts except those in the connected and cursive groups. This value is sometimes used in e.g. Japanese, often with the 'text-align-last' property."
                    },
                    {
                        name: "distribute-all-lines"
                    },
                    {
                        name: "inter-cluster"
                    },
                    {
                        name: "inter-ideograph"
                    },
                    {
                        name: "inter-word"
                    },
                    {
                        name: "kashida"
                    },
                    {
                        name: "newspaper"
                    }
                ]
            },
            {
                name: "text-orientation",
                desc: "Specifies the orientation of text within a line.",
                browsers: "C,O15,S5.1",
                restriction: "enum",
                values: [
                    {
                        name: "sideways",
                        browsers: "C25,O15,S6.1"
                    },
                    {
                        name: "sideways-right",
                        browsers: "C25,O15,S6.1"
                    },
                    {
                        name: "upright"
                    }
                ]
            },
            {
                name: "text-overflow",
                desc: "Text can overflow for example when it is prevented from wrapping.",
                browsers: "E,C,FF9,IE5.5,O11.6,S2",
                restriction: "enum, string",
                values: [
                    {
                        name: "clip"
                    },
                    {
                        name: "ellipsis"
                    }
                ]
            },
            {
                name: "text-rendering",
                desc: "The creator of SVG content might want to provide a hint to the implementation about what tradeoffs to make as it renders text. The ‘text-rendering’ property provides these hints.",
                browsers: "C,FF3,O9,S5",
                restriction: "enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "geometricPrecision",
                        desc: "Indicates that the user agent shall emphasize geometric precision over legibility and rendering speed."
                    },
                    {
                        name: "optimizeLegibility"
                    },
                    {
                        name: "optimizeSpeed",
                        desc: "Indicates that the user agent shall emphasize rendering speed over legibility and geometric precision."
                    }
                ]
            },
            {
                name: "text-shadow",
                desc: "Enables shadow effects to be applied to the text of the element.",
                browsers: "E,C,FF3.6,IE10,O9.5,S1.1",
                restriction: "length, color",
                values: []
            },
            {
                name: "text-transform",
                desc: "Controls capitalization effects of an element’s text.",
                restriction: "enum",
                values: [
                    {
                        name: "capitalize"
                    },
                    {
                        name: "lowercase"
                    },
                    {
                        name: "none",
                        desc: "No effects."
                    },
                    {
                        name: "uppercase"
                    }
                ]
            },
            {
                name: "text-underline-position",
                desc: "Sets the position of an underline specified on the same element: it does not affect underlines specified by ancestor elements. This property is typically used in vertical writing contexts such as in Japanese documents where it often desired to have the underline appear 'over' (to the right of) the affected run of text",
                browsers: "E,IE10",
                restriction: "enum",
                values: [
                    {
                        name: "above"
                    },
                    {
                        name: "auto",
                        desc: "The user agent may use any algorithm to determine the underline’s position. In horizontal line layout, the underline should be aligned as for alphabetic. In vertical line layout, if the language is set to Japanese or Korean, the underline should be aligned as for over."
                    },
                    {
                        name: "below",
                        desc: "The underline is aligned with the under edge of the element’s content box."
                    }
                ]
            },
            {
                name: "top",
                desc: "Specifies how far an absolutely positioned box's top margin edge is offset below the top edge of the box's 'containing block'.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "For non-replaced elements, the effect of this value depends on which of related properties have the value 'auto' as well"
                    }
                ]
            },
            {
                name: "touch-action",
                desc: "Determines whether touch input may trigger default behavior supplied by user agent.",
                browsers: "E,C36,IE11,O23",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "The user agent may determine any permitted touch behaviors for touches that begin on the element."
                    },
                    {
                        name: "cross-slide-x",
                        browsers: "E,IE11"
                    },
                    {
                        name: "cross-slide-y",
                        browsers: "E,IE11"
                    },
                    {
                        name: "double-tap-zoom",
                        browsers: "E,IE11"
                    },
                    {
                        name: "manipulation",
                        desc: "The user agent may consider touches that begin on the element only for the purposes of scrolling and continuous zooming."
                    },
                    {
                        name: "none",
                        desc: "Touches that begin on the element must not trigger default touch behaviors."
                    },
                    {
                        name: "pan-x",
                        desc: "The user agent may consider touches that begin on the element only for the purposes of horizontally scrolling the element’s nearest ancestor with horizontally scrollable content."
                    },
                    {
                        name: "pan-y",
                        desc: "The user agent may consider touches that begin on the element only for the purposes of vertically scrolling the element’s nearest ancestor with vertically scrollable content."
                    },
                    {
                        name: "pinch-zoom",
                        browsers: "E,IE11"
                    }
                ]
            },
            {
                name: "transform",
                desc: "A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
                browsers: "E,C36,FF16,IE10,O12.1,S9",
                restriction: "enum",
                values: [
                    {
                        name: "matrix()"
                    },
                    {
                        name: "matrix3d()"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "perspective()"
                    },
                    {
                        name: "rotate()"
                    },
                    {
                        name: "rotate3d()"
                    },
                    {
                        name: "rotateX('angle')"
                    },
                    {
                        name: "rotateY('angle')"
                    },
                    {
                        name: "rotateZ('angle')"
                    },
                    {
                        name: "scale()"
                    },
                    {
                        name: "scale3d()"
                    },
                    {
                        name: "scaleX()"
                    },
                    {
                        name: "scaleY()"
                    },
                    {
                        name: "scaleZ()"
                    },
                    {
                        name: "skew()"
                    },
                    {
                        name: "skewX()"
                    },
                    {
                        name: "skewY()"
                    },
                    {
                        name: "translate()"
                    },
                    {
                        name: "translate3d()"
                    },
                    {
                        name: "translateX()"
                    },
                    {
                        name: "translateY()"
                    },
                    {
                        name: "translateZ()"
                    }
                ]
            },
            {
                name: "transform-origin",
                desc: "Establishes the origin of transformation for an element.",
                browsers: "E,C36,FF16,IE10,O12.1,S9",
                restriction: "position, length, percentage"
            },
            {
                name: "transform-style",
                desc: "Defines how nested elements are rendered in 3D space.",
                browsers: "E,C36,FF16,IE10,O23,S9",
                restriction: "enum",
                values: [
                    {
                        name: "flat"
                    },
                    {
                        name: "preserve-3d",
                        browsers: "E,C36,FF16,O23,S9"
                    }
                ]
            },
            {
                name: "transition",
                desc: "Shorthand property combines four of the transition properties into a single property.",
                browsers: "E,FF16,IE10,O12.5",
                restriction: "time, property, timing-function, enum",
                values: [
                    {
                        name: "all",
                        desc: "Every property that is able to undergo a transition will do so."
                    },
                    {
                        name: "none",
                        desc: "No property will transition."
                    }
                ]
            },
            {
                name: "transition-delay",
                desc: "Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.",
                browsers: "E,FF16,IE10,O12.5",
                restriction: "time"
            },
            {
                name: "transition-duration",
                desc: "Specifies how long the transition from the old value to the new value should take.",
                browsers: "E,FF16,IE10,O12.5",
                restriction: "time"
            },
            {
                name: "transition-property",
                desc: "Specifies the name of the CSS property to which the transition is applied.",
                browsers: "E,FF16,IE10,O12.5",
                restriction: "property",
                values: [
                    {
                        name: "all",
                        desc: "Every property that is able to undergo a transition will do so."
                    },
                    {
                        name: "none",
                        desc: "No property will transition."
                    }
                ]
            },
            {
                name: "transition-timing-function",
                desc: "Describes how the intermediate values used during a transition will be calculated.",
                browsers: "E,FF16,IE10,O12.5",
                restriction: "timing-function"
            },
            {
                name: "unicode-bidi",
                desc: "The level of embedding with respect to the bidirectional algorithm.",
                restriction: "enum",
                values: [
                    {
                        name: "bidi-override"
                    },
                    {
                        name: "embed"
                    },
                    {
                        name: "isolate",
                        desc: "The contents of the element are considered to be inside a separate, independent paragraph.",
                        browsers: "C,FF10,O15,S5.1"
                    },
                    {
                        name: "isolate-override",
                        browsers: "C,FF17,O15,S6.1"
                    },
                    {
                        name: "normal",
                        desc: "The element does not open an additional level of embedding with respect to the bidirectional algorithm. For inline-level elements, implicit reordering works across element boundaries."
                    },
                    {
                        name: "plaintext",
                        browsers: "C,FF10,O15,S6"
                    }
                ]
            },
            {
                name: "unicode-range",
                desc: "@font-face descriptor. Defines the set of Unicode codepoints that may be supported by the font face for which it is declared.",
                restriction: "unicode-range",
                values: [
                    {
                        name: "U+26"
                    },
                    {
                        name: "U+20-24F, U+2B0-2FF, U+370-4FF, U+1E00-1EFF, U+2000-20CF, U+2100-23FF, U+2500-26FF, U+E000-F8FF, U+FB00–FB4F"
                    },
                    {
                        name: "U+20-17F, U+2B0-2FF, U+2000-206F, U+20A0-20CF, U+2100-21FF, U+2600-26FF"
                    },
                    {
                        name: "U+20-2FF, U+370-4FF, U+1E00-20CF, U+2100-23FF, U+2500-26FF, U+FB00-FB4F, U+FFF0-FFFD"
                    },
                    {
                        name: "U+20-4FF, U+530-58F, U+10D0-10FF, U+1E00-23FF, U+2440-245F, U+2500-26FF, U+FB00-FB4F, U+FE20-FE2F, U+FFF0-FFFD"
                    },
                    {
                        name: "U+00-7F"
                    },
                    {
                        name: "U+80-FF"
                    },
                    {
                        name: "U+100-17F"
                    },
                    {
                        name: "U+180-24F"
                    },
                    {
                        name: "U+1E00-1EFF"
                    },
                    {
                        name: "U+250-2AF"
                    },
                    {
                        name: "U+370-3FF"
                    },
                    {
                        name: "U+1F00-1FFF"
                    },
                    {
                        name: "U+400-4FF"
                    },
                    {
                        name: "U+500-52F"
                    },
                    {
                        name: "U+00-52F, U+1E00-1FFF, U+2200–22FF"
                    },
                    {
                        name: "U+530–58F"
                    },
                    {
                        name: "U+590–5FF"
                    },
                    {
                        name: "U+600–6FF"
                    },
                    {
                        name: "U+750–77F"
                    },
                    {
                        name: "U+8A0–8FF"
                    },
                    {
                        name: "U+700–74F"
                    },
                    {
                        name: "U+900–97F"
                    },
                    {
                        name: "U+980–9FF"
                    },
                    {
                        name: "U+A00–A7F"
                    },
                    {
                        name: "U+A80–AFF"
                    },
                    {
                        name: "U+B00–B7F"
                    },
                    {
                        name: "U+B80–BFF"
                    },
                    {
                        name: "U+C00–C7F"
                    },
                    {
                        name: "U+C80–CFF"
                    },
                    {
                        name: "U+D00–D7F"
                    },
                    {
                        name: "U+D80–DFF"
                    },
                    {
                        name: "U+118A0–118FF"
                    },
                    {
                        name: "U+E00–E7F"
                    },
                    {
                        name: "U+1A20–1AAF"
                    },
                    {
                        name: "U+AA80–AADF"
                    },
                    {
                        name: "U+E80–EFF"
                    },
                    {
                        name: "U+F00–FFF"
                    },
                    {
                        name: "U+1000–109F"
                    },
                    {
                        name: "U+10A0–10FF"
                    },
                    {
                        name: "U+1200–137F"
                    },
                    {
                        name: "U+1380–139F"
                    },
                    {
                        name: "U+2D80–2DDF"
                    },
                    {
                        name: "U+AB00–AB2F"
                    },
                    {
                        name: "U+1780–17FF"
                    },
                    {
                        name: "U+1800–18AF"
                    },
                    {
                        name: "U+1B80–1BBF"
                    },
                    {
                        name: "U+1CC0–1CCF"
                    },
                    {
                        name: "U+4E00–9FD5"
                    },
                    {
                        name: "U+3400–4DB5"
                    },
                    {
                        name: "U+2F00–2FDF"
                    },
                    {
                        name: "U+2E80–2EFF"
                    },
                    {
                        name: "U+1100–11FF"
                    },
                    {
                        name: "U+AC00–D7AF"
                    },
                    {
                        name: "U+3040–309F"
                    },
                    {
                        name: "U+30A0–30FF"
                    },
                    {
                        name: "U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F"
                    },
                    {
                        name: "U+A4D0–A4FF"
                    },
                    {
                        name: "U+A000–A48F"
                    },
                    {
                        name: "U+A490–A4CF"
                    },
                    {
                        name: "U+2000-206F"
                    },
                    {
                        name: "U+3000–303F"
                    },
                    {
                        name: "U+2070–209F"
                    },
                    {
                        name: "U+20A0–20CF"
                    },
                    {
                        name: "U+2100–214F"
                    },
                    {
                        name: "U+2150–218F"
                    },
                    {
                        name: "U+2190–21FF"
                    },
                    {
                        name: "U+2200–22FF"
                    },
                    {
                        name: "U+2300–23FF"
                    },
                    {
                        name: "U+E000-F8FF"
                    },
                    {
                        name: "U+FB00–FB4F"
                    },
                    {
                        name: "U+FB50–FDFF"
                    },
                    {
                        name: "U+1F600–1F64F"
                    },
                    {
                        name: "U+2600–26FF"
                    },
                    {
                        name: "U+1F300–1F5FF"
                    },
                    {
                        name: "U+1F900–1F9FF"
                    },
                    {
                        name: "U+1F680–1F6FF"
                    }
                ]
            },
            {
                name: "user-select",
                desc: "Controls the appearance of selection.",
                restriction: "enum",
                values: [
                    {
                        name: "all",
                        desc: "The content of the element must be selected atomically"
                    },
                    {
                        name: "auto"
                    },
                    {
                        name: "contain",
                        desc: "UAs must not allow a selection which is started in this element to be extended outside of this element."
                    },
                    {
                        name: "none",
                        desc: "The UA must not allow selections to be started in this element."
                    },
                    {
                        name: "text",
                        desc: "The element imposes no constraint on the selection."
                    }
                ]
            },
            {
                name: "vertical-align",
                desc: "Affects the vertical positioning of the inline boxes generated by an inline-level element inside a line box.",
                restriction: "percentage, length",
                values: [
                    {
                        name: "auto",
                        desc: "Align the dominant baseline of the parent box with the equivalent, or heuristically reconstructed, baseline of the element inline box."
                    },
                    {
                        name: "baseline",
                        desc: "Align the 'alphabetic' baseline of the element with the 'alphabetic' baseline of the parent element."
                    },
                    {
                        name: "bottom",
                        desc: "Align the after edge of the extended inline box with the after-edge of the line box."
                    },
                    {
                        name: "middle",
                        desc: "Align the 'middle' baseline of the inline element with the middle baseline of the parent."
                    },
                    {
                        name: "sub",
                        desc: "Lower the baseline of the box to the proper position for subscripts of the parent's box. (This value has no effect on the font size of the element's text.)"
                    },
                    {
                        name: "super",
                        desc: "Raise the baseline of the box to the proper position for superscripts of the parent's box. (This value has no effect on the font size of the element's text.)"
                    },
                    {
                        name: "text-bottom"
                    },
                    {
                        name: "text-top"
                    },
                    {
                        name: "top",
                        desc: "Align the before edge of the extended inline box with the before-edge of the line box."
                    },
                    {
                        name: "-webkit-baseline-middle",
                        browsers: "C,S1"
                    }
                ]
            },
            {
                name: "visibility",
                desc: "Specifies whether the boxes generated by an element are rendered. Invisible boxes still affect layout (set the ‘display’ property to ‘none’ to suppress box generation altogether).",
                restriction: "enum",
                values: [
                    {
                        name: "collapse",
                        desc: "Table-specific. If used on elements other than rows, row groups, columns, or column groups, 'collapse' has the same meaning as 'hidden'."
                    },
                    {
                        name: "hidden",
                        desc: "The generated box is invisible (fully transparent, nothing is drawn), but still affects layout."
                    },
                    {
                        name: "visible",
                        desc: "The generated box is visible."
                    }
                ]
            },
            {
                name: "-webkit-animation",
                desc: "Shorthand property combines six of the animation properties into a single property.",
                browsers: "C,S5",
                restriction: "time, enum, timing-function, identifier, number",
                values: [
                    {
                        name: "alternate"
                    },
                    {
                        name: "alternate-reverse"
                    },
                    {
                        name: "backwards"
                    },
                    {
                        name: "both",
                        desc: "Both forwards and backwards fill modes are applied."
                    },
                    {
                        name: "forwards"
                    },
                    {
                        name: "infinite",
                        desc: "Causes the animation to repeat forever."
                    },
                    {
                        name: "none",
                        desc: "No animation is performed"
                    },
                    {
                        name: "normal",
                        desc: "Normal playback."
                    },
                    {
                        name: "reverse",
                        desc: "All iterations of the animation are played in the reverse direction from the way they were specified."
                    }
                ]
            },
            {
                name: "-webkit-animation-delay",
                desc: "Defines when the animation will start.",
                browsers: "C,S5",
                restriction: "time"
            },
            {
                name: "-webkit-animation-direction",
                desc: "Defines whether or not the animation should play in reverse on alternate cycles.",
                browsers: "C,S5",
                restriction: "enum",
                values: [
                    {
                        name: "alternate"
                    },
                    {
                        name: "alternate-reverse"
                    },
                    {
                        name: "normal",
                        desc: "Normal playback."
                    },
                    {
                        name: "reverse",
                        desc: "All iterations of the animation are played in the reverse direction from the way they were specified."
                    }
                ]
            },
            {
                name: "-webkit-animation-duration",
                desc: "Defines the length of time that an animation takes to complete one cycle.",
                browsers: "C,S5",
                restriction: "time"
            },
            {
                name: "-webkit-animation-fill-mode",
                desc: "Defines what values are applied by the animation outside the time it is executing.",
                browsers: "C,S5",
                restriction: "enum",
                values: [
                    {
                        name: "backwards"
                    },
                    {
                        name: "both",
                        desc: "Both forwards and backwards fill modes are applied."
                    },
                    {
                        name: "forwards"
                    },
                    {
                        name: "none",
                        desc: "There is no change to the property value between the time the animation is applied and the time the animation begins playing or after the animation completes."
                    }
                ]
            },
            {
                name: "-webkit-animation-iteration-count",
                desc: "Defines the number of times an animation cycle is played. The default value is one, meaning the animation will play from beginning to end once.",
                browsers: "C,S5",
                restriction: "number, enum",
                values: [
                    {
                        name: "infinite",
                        desc: "Causes the animation to repeat forever."
                    }
                ]
            },
            {
                name: "-webkit-animation-name",
                desc: "Defines a list of animations that apply. Each name is used to select the keyframe at-rule that provides the property values for the animation.",
                browsers: "C,S5",
                restriction: "identifier, enum",
                values: [
                    {
                        name: "none",
                        desc: "No animation is performed"
                    }
                ]
            },
            {
                name: "-webkit-animation-play-state",
                desc: "Defines whether the animation is running or paused.",
                browsers: "C,S5",
                restriction: "enum",
                values: [
                    {
                        name: "paused"
                    },
                    {
                        name: "running"
                    }
                ]
            },
            {
                name: "-webkit-animation-timing-function",
                desc: "Describes how the animation will progress over one cycle of its duration. See the 'transition-timing-function'.",
                browsers: "C,S5",
                restriction: "timing-function"
            },
            {
                name: "-webkit-appearance",
                desc: "Changes the appearance of buttons and other controls to resemble native controls.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "button"
                    },
                    {
                        name: "button-bevel"
                    },
                    {
                        name: "caps-lock-indicator"
                    },
                    {
                        name: "caret"
                    },
                    {
                        name: "checkbox"
                    },
                    {
                        name: "default-button"
                    },
                    {
                        name: "listbox"
                    },
                    {
                        name: "listitem"
                    },
                    {
                        name: "media-fullscreen-button"
                    },
                    {
                        name: "media-mute-button"
                    },
                    {
                        name: "media-play-button"
                    },
                    {
                        name: "media-seek-back-button"
                    },
                    {
                        name: "media-seek-forward-button"
                    },
                    {
                        name: "media-slider"
                    },
                    {
                        name: "media-sliderthumb"
                    },
                    {
                        name: "menulist"
                    },
                    {
                        name: "menulist-button"
                    },
                    {
                        name: "menulist-text"
                    },
                    {
                        name: "menulist-textfield"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "push-button"
                    },
                    {
                        name: "radio"
                    },
                    {
                        name: "scrollbarbutton-down"
                    },
                    {
                        name: "scrollbarbutton-left"
                    },
                    {
                        name: "scrollbarbutton-right"
                    },
                    {
                        name: "scrollbarbutton-up"
                    },
                    {
                        name: "scrollbargripper-horizontal"
                    },
                    {
                        name: "scrollbargripper-vertical"
                    },
                    {
                        name: "scrollbarthumb-horizontal"
                    },
                    {
                        name: "scrollbarthumb-vertical"
                    },
                    {
                        name: "scrollbartrack-horizontal"
                    },
                    {
                        name: "scrollbartrack-vertical"
                    },
                    {
                        name: "searchfield"
                    },
                    {
                        name: "searchfield-cancel-button"
                    },
                    {
                        name: "searchfield-decoration"
                    },
                    {
                        name: "searchfield-results-button"
                    },
                    {
                        name: "searchfield-results-decoration"
                    },
                    {
                        name: "slider-horizontal"
                    },
                    {
                        name: "sliderthumb-horizontal"
                    },
                    {
                        name: "sliderthumb-vertical"
                    },
                    {
                        name: "slider-vertical"
                    },
                    {
                        name: "square-button"
                    },
                    {
                        name: "textarea"
                    },
                    {
                        name: "textfield"
                    }
                ]
            },
            {
                name: "-webkit-backdrop-filter",
                desc: "Applies a filter effect where the first filter in the list takes the element's background image as the input image.",
                browsers: "S9",
                restriction: "enum, url",
                values: [
                    {
                        name: "none",
                        desc: "No filter effects are applied."
                    },
                    {
                        name: "blur()"
                    },
                    {
                        name: "brightness()"
                    },
                    {
                        name: "contrast()"
                    },
                    {
                        name: "drop-shadow()"
                    },
                    {
                        name: "grayscale()"
                    },
                    {
                        name: "hue-rotate()"
                    },
                    {
                        name: "invert()"
                    },
                    {
                        name: "opacity()"
                    },
                    {
                        name: "saturate()"
                    },
                    {
                        name: "sepia()"
                    },
                    {
                        name: "url()",
                        desc: "A filter reference to a <filter> element."
                    }
                ]
            },
            {
                name: "-webkit-backface-visibility",
                desc: "Determines whether or not the 'back' side of a transformed element is visible when facing the viewer. With an identity transform, the front side of an element faces the viewer.",
                browsers: "C,S5",
                restriction: "enum",
                values: [
                    {
                        name: "hidden"
                    },
                    {
                        name: "visible"
                    }
                ]
            },
            {
                name: "-webkit-background-clip",
                desc: "Determines the background painting area.",
                browsers: "C,S3",
                restriction: "box"
            },
            {
                name: "-webkit-background-composite",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "border"
                    },
                    {
                        name: "padding"
                    }
                ]
            },
            {
                name: "-webkit-background-origin",
                desc: "For elements rendered as a single box, specifies the background positioning area. For elements rendered as multiple boxes (e.g., inline boxes on several lines, boxes on several pages) specifies which boxes 'box-decoration-break' operates on to determine the background positioning area(s).",
                browsers: "C,S3",
                restriction: "box"
            },
            {
                name: "-webkit-border-image",
                desc: "Shorthand property for setting 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset' and 'border-image-repeat'. Omitted values are set to their initial values.",
                browsers: "C,S5",
                restriction: "length, percentage, number, url, enum",
                values: [
                    {
                        name: "auto",
                        desc: "If 'auto' is specified then the border image width is the intrinsic width or height (whichever is applicable) of the corresponding image slice. If the image does not have the required intrinsic dimension then the corresponding border-width is used instead."
                    },
                    {
                        name: "fill",
                        desc: "Causes the middle part of the border-image to be preserved."
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "repeat"
                    },
                    {
                        name: "round",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the image is rescaled so that it does."
                    },
                    {
                        name: "space",
                        desc: "The image is tiled (repeated) to fill the area. If it does not fill the area with a whole number of tiles, the extra space is distributed around the tiles."
                    },
                    {
                        name: "stretch",
                        desc: "The image is stretched to fill the area."
                    },
                    {
                        name: "url()"
                    }
                ]
            },
            {
                name: "-webkit-box-align",
                desc: "Specifies the alignment of nested elements within an outer flexible box element.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "baseline",
                        desc: "If this box orientation is inline-axis or horizontal, all children are placed with their baselines aligned, and extra space placed before or after as necessary. For block flows, the baseline of the first non-empty line box located within the element is used. For tables, the baseline of the first cell is used."
                    },
                    {
                        name: "center",
                        desc: "Any extra space is divided evenly, with half placed above the child and the other half placed after the child."
                    },
                    {
                        name: "end",
                        desc: "For normal direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element. For reverse direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element."
                    },
                    {
                        name: "start",
                        desc: "For normal direction boxes, the top edge of each child is placed along the top of the box. Extra space is placed below the element. For reverse direction boxes, the bottom edge of each child is placed along the bottom of the box. Extra space is placed above the element."
                    },
                    {
                        name: "stretch",
                        desc: "The height of each child is adjusted to that of the containing block."
                    }
                ]
            },
            {
                name: "-webkit-box-direction",
                desc: "In webkit applications, -webkit-box-direction specifies whether a box lays out its contents normally (from the top or left edge), or in reverse (from the bottom or right edge).",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "normal",
                        desc: "A box with a computed value of horizontal for box-orient displays its children from left to right. A box with a computed value of vertical displays its children from top to bottom."
                    },
                    {
                        name: "reverse",
                        desc: "A box with a computed value of horizontal for box-orient displays its children from right to left. A box with a computed value of vertical displays its children from bottom to top."
                    }
                ]
            },
            {
                name: "-webkit-box-flex",
                desc: "Specifies an element's flexibility.",
                browsers: "C,S3",
                restriction: "number"
            },
            {
                name: "-webkit-box-flex-group",
                desc: "Flexible elements can be assigned to flex groups using the 'box-flex-group' property.",
                browsers: "C,S3",
                restriction: "integer"
            },
            {
                name: "-webkit-box-ordinal-group",
                desc: "Indicates the ordinal group the element belongs to. Elements with a lower ordinal group are displayed before those with a higher ordinal group.",
                browsers: "C,S3",
                restriction: "integer"
            },
            {
                name: "-webkit-box-orient",
                desc: "In webkit applications, -webkit-box-orient specifies whether a box lays out its contents horizontally or vertically.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "block-axis"
                    },
                    {
                        name: "horizontal",
                        desc: "The box displays its children from left to right in a horizontal line."
                    },
                    {
                        name: "inline-axis"
                    },
                    {
                        name: "vertical",
                        desc: "The box displays its children from stacked from top to bottom vertically."
                    }
                ]
            },
            {
                name: "-webkit-box-pack",
                desc: "Specifies alignment of child elements within the current element in the direction of orientation.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "center",
                        desc: "The extra space is divided evenly, with half placed before the first child and the other half placed after the last child."
                    },
                    {
                        name: "end",
                        desc: "For normal direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child. For reverse direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child."
                    },
                    {
                        name: "justify",
                        desc: "The space is divided evenly in-between each child, with none of the extra space placed before the first child or after the last child. If there is only one child, treat the pack value as if it were start."
                    },
                    {
                        name: "start",
                        desc: "For normal direction boxes, the left edge of the first child is placed at the left side, with all extra space placed after the last child. For reverse direction boxes, the right edge of the last child is placed at the right side, with all extra space placed before the first child."
                    }
                ]
            },
            {
                name: "-webkit-box-reflect",
                desc: "Defines a reflection of a border box.",
                browsers: "C,S4",
                values: [
                    {
                        name: "above",
                        desc: "The reflection appears above the border box."
                    },
                    {
                        name: "below",
                        desc: "The reflection appears below the border box."
                    },
                    {
                        name: "left",
                        desc: "The reflection appears to the left of the border box."
                    },
                    {
                        name: "right",
                        desc: "The reflection appears to the right of the border box."
                    }
                ]
            },
            {
                name: "-webkit-box-sizing",
                desc: "Box Model addition in CSS3.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "border-box"
                    },
                    {
                        name: "content-box"
                    }
                ]
            },
            {
                name: "-webkit-break-after",
                desc: "Describes the page/column break behavior before the generated box.",
                browsers: "S7",
                restriction: "enum",
                values: [
                    {
                        name: "always",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page/column break before/after the generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page/column break before/after the generated box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break before/after the generated box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break before/after the generated box."
                    },
                    {
                        name: "avoid-region"
                    },
                    {
                        name: "column",
                        desc: "Always force a column break before/after the generated box."
                    },
                    {
                        name: "left",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a left page."
                    },
                    {
                        name: "page",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "region"
                    },
                    {
                        name: "right",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a right page."
                    }
                ]
            },
            {
                name: "-webkit-break-before",
                desc: "Describes the page/column break behavior before the generated box.",
                browsers: "S7",
                restriction: "enum",
                values: [
                    {
                        name: "always",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page/column break before/after the generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page/column break before/after the generated box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break before/after the generated box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break before/after the generated box."
                    },
                    {
                        name: "avoid-region"
                    },
                    {
                        name: "column",
                        desc: "Always force a column break before/after the generated box."
                    },
                    {
                        name: "left",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a left page."
                    },
                    {
                        name: "page",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "region"
                    },
                    {
                        name: "right",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a right page."
                    }
                ]
            },
            {
                name: "-webkit-break-inside",
                desc: "Describes the page/column break behavior inside the generated box.",
                browsers: "S7",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page/column break inside the generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page/column break inside the generated box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break inside the generated box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break inside the generated box."
                    },
                    {
                        name: "avoid-region"
                    }
                ]
            },
            {
                name: "-webkit-column-break-after",
                desc: "Describes the page/column break behavior before the generated box.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "always",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page/column break before/after the generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page/column break before/after the generated box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break before/after the generated box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break before/after the generated box."
                    },
                    {
                        name: "avoid-region"
                    },
                    {
                        name: "column",
                        desc: "Always force a column break before/after the generated box."
                    },
                    {
                        name: "left",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a left page."
                    },
                    {
                        name: "page",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "region"
                    },
                    {
                        name: "right",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a right page."
                    }
                ]
            },
            {
                name: "-webkit-column-break-before",
                desc: "Describes the page/column break behavior before the generated box.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "always",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page/column break before/after the generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page/column break before/after the generated box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break before/after the generated box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break before/after the generated box."
                    },
                    {
                        name: "avoid-region"
                    },
                    {
                        name: "column",
                        desc: "Always force a column break before/after the generated box."
                    },
                    {
                        name: "left",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a left page."
                    },
                    {
                        name: "page",
                        desc: "Always force a page break before/after the generated box."
                    },
                    {
                        name: "region"
                    },
                    {
                        name: "right",
                        desc: "Force one or two page breaks before/after the generated box so that the next page is formatted as a right page."
                    }
                ]
            },
            {
                name: "-webkit-column-break-inside",
                desc: "Describes the page/column break behavior inside the generated box.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Neither force nor forbid a page/column break inside the generated box."
                    },
                    {
                        name: "avoid",
                        desc: "Avoid a page/column break inside the generated box."
                    },
                    {
                        name: "avoid-column",
                        desc: "Avoid a column break inside the generated box."
                    },
                    {
                        name: "avoid-page",
                        desc: "Avoid a page break inside the generated box."
                    },
                    {
                        name: "avoid-region"
                    }
                ]
            },
            {
                name: "-webkit-column-count",
                desc: "Describes the optimal number of columns into which the content of the element will be flowed.",
                browsers: "C,S3",
                restriction: "integer",
                values: [
                    {
                        name: "auto",
                        desc: "Determines the number of columns by the 'column-width' property and the element width."
                    }
                ]
            },
            {
                name: "-webkit-column-gap",
                desc: "Sets the gap between columns. If there is a column rule between columns, it will appear in the middle of the gap.",
                browsers: "C,S3",
                restriction: "length",
                values: [
                    {
                        name: "normal",
                        desc: "User agent specific and typically equivalent to 1em."
                    }
                ]
            },
            {
                name: "-webkit-column-rule",
                desc: "This property is a shorthand for setting 'column-rule-width', 'column-rule-style', and 'column-rule-color' at the same place in the style sheet. Omitted values are set to their initial values.",
                browsers: "C,S3",
                restriction: "length, line-width, line-style, color"
            },
            {
                name: "-webkit-column-rule-color",
                desc: "Sets the color of the column rule",
                browsers: "C,S3",
                restriction: "color"
            },
            {
                name: "-webkit-column-rule-style",
                desc: "Sets the style of the rule between columns of an element.",
                browsers: "C,S3",
                restriction: "line-style"
            },
            {
                name: "-webkit-column-rule-width",
                desc: "Sets the width of the rule between columns. Negative values are not allowed.",
                browsers: "C,S3",
                restriction: "length, line-width"
            },
            {
                name: "-webkit-columns",
                desc: "A shorthand property which sets both 'column-width' and 'column-count'.",
                browsers: "C,S3",
                restriction: "length, integer",
                values: [
                    {
                        name: "auto",
                        desc: "The width depends on the values of other properties."
                    }
                ]
            },
            {
                name: "-webkit-column-span",
                desc: "Describes the page/column break behavior after the generated box.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "all",
                        desc: "The element spans across all columns. Content in the normal flow that appears before the element is automatically balanced across all columns before the element appear."
                    },
                    {
                        name: "none",
                        desc: "The element does not span multiple columns."
                    }
                ]
            },
            {
                name: "-webkit-column-width",
                desc: "This property describes the width of columns in multicol elements.",
                browsers: "C,S3",
                restriction: "length",
                values: [
                    {
                        name: "auto",
                        desc: "The width depends on the values of other properties."
                    }
                ]
            },
            {
                name: "-webkit-filter",
                desc: "Processes an element’s rendering before it is displayed in the document, by applying one or more filter effects.",
                browsers: "C18,O15,S6",
                restriction: "enum, url",
                values: [
                    {
                        name: "none",
                        desc: "No filter effects are applied."
                    },
                    {
                        name: "blur()"
                    },
                    {
                        name: "brightness()"
                    },
                    {
                        name: "contrast()"
                    },
                    {
                        name: "drop-shadow()"
                    },
                    {
                        name: "grayscale()"
                    },
                    {
                        name: "hue-rotate()"
                    },
                    {
                        name: "invert()"
                    },
                    {
                        name: "opacity()"
                    },
                    {
                        name: "saturate()"
                    },
                    {
                        name: "sepia()"
                    },
                    {
                        name: "url()",
                        desc: "A filter reference to a <filter> element."
                    }
                ]
            },
            {
                name: "-webkit-flow-from",
                desc: "Makes a block container a region and associates it with a named flow.",
                browsers: "S6.1",
                restriction: "identifier",
                values: [
                    {
                        name: "none",
                        desc: "The block container is not a CSS Region."
                    }
                ]
            },
            {
                name: "-webkit-flow-into",
                desc: "Places an element or its contents into a named flow.",
                browsers: "S6.1",
                restriction: "identifier",
                values: [
                    {
                        name: "none",
                        desc: "The element is not moved to a named flow and normal CSS processing takes place."
                    }
                ]
            },
            {
                name: "-webkit-font-feature-settings",
                desc: "This property provides low-level control over OpenType font features. It is intended as a way of providing access to font features that are not widely used but are needed for a particular use case.",
                browsers: "C16",
                restriction: "string, integer",
                values: [
                    {
                        name: "\"c2cs\""
                    },
                    {
                        name: "\"dlig\""
                    },
                    {
                        name: "\"kern\""
                    },
                    {
                        name: "\"liga\""
                    },
                    {
                        name: "\"lnum\""
                    },
                    {
                        name: "\"onum\""
                    },
                    {
                        name: "\"smcp\""
                    },
                    {
                        name: "\"swsh\""
                    },
                    {
                        name: "\"tnum\""
                    },
                    {
                        name: "normal",
                        desc: "No change in glyph substitution or positioning occurs."
                    },
                    {
                        name: "off"
                    },
                    {
                        name: "on"
                    }
                ]
            },
            {
                name: "-webkit-hyphens",
                desc: "Controls whether hyphenation is allowed to create more break opportunities within a line of text.",
                browsers: "S5.1",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Conditional hyphenation characters inside a word, if present, take priority over automatic resources when determining hyphenation points within the word."
                    },
                    {
                        name: "manual"
                    },
                    {
                        name: "none",
                        desc: "Words are not broken at line breaks, even if characters inside the word suggest line break points."
                    }
                ]
            },
            {
                name: "-webkit-line-break",
                desc: "Specifies line-breaking rules for CJK (Chinese, Japanese, and Korean) text.",
                browsers: "C,S3",
                values: [
                    {
                        name: "after-white-space"
                    },
                    {
                        name: "normal"
                    }
                ]
            },
            {
                name: "-webkit-margin-bottom-collapse",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "collapse"
                    },
                    {
                        name: "discard"
                    },
                    {
                        name: "separate"
                    }
                ]
            },
            {
                name: "-webkit-margin-collapse",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "collapse"
                    },
                    {
                        name: "discard"
                    },
                    {
                        name: "separate"
                    }
                ]
            },
            {
                name: "-webkit-margin-start",
                browsers: "C,S3",
                restriction: "percentage, length",
                values: [
                    {
                        name: "auto"
                    }
                ]
            },
            {
                name: "-webkit-margin-top-collapse",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "collapse"
                    },
                    {
                        name: "discard"
                    },
                    {
                        name: "separate"
                    }
                ]
            },
            {
                name: "-webkit-mask-clip",
                desc: "Determines the mask painting area, which determines the area that is affected by the mask.",
                browsers: "C,O15,S4",
                restriction: "box"
            },
            {
                name: "-webkit-mask-image",
                desc: "Sets the mask layer image of an element.",
                browsers: "C,O15,S4",
                restriction: "url, image, enum",
                values: [
                    {
                        name: "none",
                        desc: "Counts as a transparent black image layer."
                    },
                    {
                        name: "url()",
                        desc: "Reference to a <mask element or to a CSS image."
                    }
                ]
            },
            {
                name: "-webkit-mask-origin",
                desc: "Specifies the mask positioning area.",
                browsers: "C,O15,S4",
                restriction: "box"
            },
            {
                name: "-webkit-mask-repeat",
                desc: "Specifies how mask layer images are tiled after they have been sized and positioned.",
                browsers: "C,O15,S4",
                restriction: "repeat"
            },
            {
                name: "-webkit-mask-size",
                desc: "Specifies the size of the mask layer images.",
                browsers: "C,O15,S4",
                restriction: "length, percentage, enum",
                values: [
                    {
                        name: "auto",
                        desc: "Resolved by using the image’s intrinsic ratio and the size of the other dimension, or failing that, using the image’s intrinsic size, or failing that, treating it as 100%."
                    },
                    {
                        name: "contain",
                        desc: "Scale the image, while preserving its intrinsic aspect ratio (if any), to the largest size such that both its width and its height can fit inside the background positioning area."
                    },
                    {
                        name: "cover",
                        desc: "Scale the image, while preserving its intrinsic aspect ratio (if any), to the smallest size such that both its width and its height can completely cover the background positioning area."
                    }
                ]
            },
            {
                name: "-webkit-nbsp-mode",
                desc: "Defines the behavior of nonbreaking spaces within text.",
                browsers: "C,S3",
                values: [
                    {
                        name: "normal"
                    },
                    {
                        name: "space"
                    }
                ]
            },
            {
                name: "-webkit-overflow-scrolling",
                desc: "Specifies whether to use native-style scrolling in an overflow:scroll element.",
                browsers: "C,S5",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "touch"
                    }
                ]
            },
            {
                name: "-webkit-padding-start",
                browsers: "C,S3",
                restriction: "percentage, length"
            },
            {
                name: "-webkit-perspective",
                desc: "Applies the same transform as the perspective(<number>) transform function, except that it applies only to the positioned or transformed children of the element, not to the transform on the element itself.",
                browsers: "C,S4",
                restriction: "length",
                values: [
                    {
                        name: "none",
                        desc: "No perspective transform is applied."
                    }
                ]
            },
            {
                name: "-webkit-perspective-origin",
                desc: "Establishes the origin for the perspective property. It effectively sets the X and Y position at which the viewer appears to be looking at the children of the element.",
                browsers: "C,S4",
                restriction: "position, percentage, length"
            },
            {
                name: "-webkit-region-fragment",
                desc: "The 'region-fragment' property controls the behavior of the last region associated with a named flow.",
                browsers: "S7",
                restriction: "enum",
                values: [
                    {
                        name: "auto",
                        desc: "Content flows as it would in a regular content box."
                    },
                    {
                        name: "break"
                    }
                ]
            },
            {
                name: "-webkit-tap-highlight-color",
                browsers: "E,C,S3.1",
                restriction: "color"
            },
            {
                name: "-webkit-text-fill-color",
                browsers: "E,C,S3",
                restriction: "color"
            },
            {
                name: "-webkit-text-size-adjust",
                desc: "Specifies a size adjustment for displaying text content in mobile browsers.",
                browsers: "E,C,S3",
                restriction: "percentage",
                values: [
                    {
                        name: "auto",
                        desc: "Renderers must use the default size adjustment when displaying on a small device."
                    },
                    {
                        name: "none",
                        desc: "Renderers must not do size adjustment when displaying on a small device."
                    }
                ]
            },
            {
                name: "-webkit-text-stroke",
                browsers: "S3",
                restriction: "length, line-width, color, percentage"
            },
            {
                name: "-webkit-text-stroke-color",
                browsers: "S3",
                restriction: "color"
            },
            {
                name: "-webkit-text-stroke-width",
                browsers: "S3",
                restriction: "length, line-width, percentage"
            },
            {
                name: "-webkit-touch-callout",
                browsers: "S3",
                restriction: "enum",
                values: [
                    {
                        name: "none"
                    }
                ]
            },
            {
                name: "-webkit-transform",
                desc: "A two-dimensional transformation is applied to an element through the 'transform' property. This property contains a list of transform functions similar to those allowed by SVG.",
                browsers: "C,O12,S3.1",
                restriction: "enum",
                values: [
                    {
                        name: "matrix()"
                    },
                    {
                        name: "matrix3d()"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "perspective()"
                    },
                    {
                        name: "rotate()"
                    },
                    {
                        name: "rotate3d()"
                    },
                    {
                        name: "rotateX('angle')"
                    },
                    {
                        name: "rotateY('angle')"
                    },
                    {
                        name: "rotateZ('angle')"
                    },
                    {
                        name: "scale()"
                    },
                    {
                        name: "scale3d()"
                    },
                    {
                        name: "scaleX()"
                    },
                    {
                        name: "scaleY()"
                    },
                    {
                        name: "scaleZ()"
                    },
                    {
                        name: "skew()"
                    },
                    {
                        name: "skewX()"
                    },
                    {
                        name: "skewY()"
                    },
                    {
                        name: "translate()"
                    },
                    {
                        name: "translate3d()"
                    },
                    {
                        name: "translateX()"
                    },
                    {
                        name: "translateY()"
                    },
                    {
                        name: "translateZ()"
                    }
                ]
            },
            {
                name: "-webkit-transform-origin",
                desc: "Establishes the origin of transformation for an element.",
                browsers: "C,O15,S3.1",
                restriction: "position, length, percentage"
            },
            {
                name: "-webkit-transform-origin-x",
                desc: "The x coordinate of the origin for transforms applied to an element with respect to its border box.",
                browsers: "C,S3.1",
                restriction: "length, percentage"
            },
            {
                name: "-webkit-transform-origin-y",
                desc: "The y coordinate of the origin for transforms applied to an element with respect to its border box.",
                browsers: "C,S3.1",
                restriction: "length, percentage"
            },
            {
                name: "-webkit-transform-origin-z",
                desc: "The z coordinate of the origin for transforms applied to an element with respect to its border box.",
                browsers: "C,S4",
                restriction: "length, percentage"
            },
            {
                name: "-webkit-transform-style",
                desc: "Defines how nested elements are rendered in 3D space.",
                browsers: "C,S4",
                restriction: "enum",
                values: [
                    {
                        name: "flat"
                    }
                ]
            },
            {
                name: "-webkit-transition",
                desc: "Shorthand property combines four of the transition properties into a single property.",
                browsers: "C,O12,S5",
                restriction: "time, property, timing-function, enum",
                values: [
                    {
                        name: "all",
                        desc: "Every property that is able to undergo a transition will do so."
                    },
                    {
                        name: "none",
                        desc: "No property will transition."
                    }
                ]
            },
            {
                name: "-webkit-transition-delay",
                desc: "Defines when the transition will start. It allows a transition to begin execution some period of time from when it is applied.",
                browsers: "C,O12,S5",
                restriction: "time"
            },
            {
                name: "-webkit-transition-duration",
                desc: "Specifies how long the transition from the old value to the new value should take.",
                browsers: "C,O12,S5",
                restriction: "time"
            },
            {
                name: "-webkit-transition-property",
                desc: "Specifies the name of the CSS property to which the transition is applied.",
                browsers: "C,O12,S5",
                restriction: "property",
                values: [
                    {
                        name: "all",
                        desc: "Every property that is able to undergo a transition will do so."
                    },
                    {
                        name: "none",
                        desc: "No property will transition."
                    }
                ]
            },
            {
                name: "-webkit-transition-timing-function",
                desc: "Describes how the intermediate values used during a transition will be calculated.",
                browsers: "C,O12,S5",
                restriction: "timing-function"
            },
            {
                name: "-webkit-user-drag",
                browsers: "S3",
                restriction: "enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "element"
                    },
                    {
                        name: "none"
                    }
                ]
            },
            {
                name: "-webkit-user-modify",
                desc: "Determines whether a user can edit the content of an element.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "read-only"
                    },
                    {
                        name: "read-write"
                    },
                    {
                        name: "read-write-plaintext-only"
                    }
                ]
            },
            {
                name: "-webkit-user-select",
                desc: "Controls the appearance of selection.",
                browsers: "C,S3",
                restriction: "enum",
                values: [
                    {
                        name: "auto"
                    },
                    {
                        name: "none"
                    },
                    {
                        name: "text"
                    }
                ]
            },
            {
                name: "white-space",
                desc: "Shorthand property for the 'white-space-collapsing' and 'text-wrap' properties.",
                restriction: "enum",
                values: [
                    {
                        name: "normal",
                        desc: "Sets 'white-space-collapsing' to 'collapse' and 'text-wrap' to 'normal'."
                    },
                    {
                        name: "nowrap",
                        desc: "Sets 'white-space-collapsing' to 'collapse' and 'text-wrap' to 'none'."
                    },
                    {
                        name: "pre"
                    },
                    {
                        name: "pre-line"
                    },
                    {
                        name: "pre-wrap"
                    }
                ]
            },
            {
                name: "widows",
                desc: "Specifies the minimum number of line boxes of a block container that must be left in a fragment after a break.",
                browsers: "C,IE8,O9.5,S1",
                restriction: "integer"
            },
            {
                name: "width",
                desc: "Specifies the width of the content area, padding area or border area (depending on 'box-sizing') of certain boxes.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "auto",
                        desc: "The width depends on the values of other properties."
                    },
                    {
                        name: "fit-content",
                        browsers: "C46,O33"
                    },
                    {
                        name: "max-content",
                        desc: "Use the max-content inline size or max-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    },
                    {
                        name: "min-content",
                        desc: "Use the min-content inline size or min-content block size, as appropriate to the writing mode.",
                        browsers: "C46,O33"
                    }
                ]
            },
            {
                name: "will-change",
                desc: "Provides a rendering hint to the user agent, stating what kinds of changes the author expects to perform on the element.",
                browsers: "C36,FF36,O24",
                restriction: "enum, identifier",
                values: [
                    {
                        name: "auto",
                        desc: "Expresses no particular intent."
                    },
                    {
                        name: "contents",
                        desc: "Indicates that the author expects to animate or change something about the element’s contents in the near future."
                    },
                    {
                        name: "scroll-position"
                    }
                ]
            },
            {
                name: "word-break",
                desc: "Specifies line break opportunities for non-CJK scripts.",
                browsers: "E,C,FF15,IE5,S3",
                restriction: "enum",
                values: [
                    {
                        name: "break-all"
                    },
                    {
                        name: "keep-all",
                        desc: "Block characters can no longer create implied break points."
                    },
                    {
                        name: "normal",
                        desc: "Breaks non-CJK scripts according to their own rules."
                    }
                ]
            },
            {
                name: "word-spacing",
                desc: "Specifies additional spacing between “words”.",
                restriction: "length, percentage",
                values: [
                    {
                        name: "normal",
                        desc: "No additional spacing is applied. Computes to zero."
                    }
                ]
            },
            {
                name: "word-wrap",
                desc: "Specifies whether the UA may break within a word to prevent overflow when an otherwise-unbreakable string is too long to fit.",
                restriction: "enum",
                values: [
                    {
                        name: "break-word",
                        desc: "An otherwise unbreakable sequence of characters may be broken at an arbitrary point if there are no otherwise-acceptable break points in the line."
                    },
                    {
                        name: "normal",
                        desc: "Lines may break only at allowed break points."
                    }
                ]
            },
            {
                name: "writing-mode",
                desc: "This is a shorthand property for both 'direction' and 'block-progression'.",
                browsers: "E,FF41",
                restriction: "enum",
                values: [
                    {
                        name: "horizontal-tb"
                    },
                    {
                        name: "sideways-lr",
                        browsers: "FF43"
                    },
                    {
                        name: "sideways-rl",
                        browsers: "FF43"
                    },
                    {
                        name: "vertical-lr"
                    },
                    {
                        name: "vertical-rl"
                    }
                ]
            },
            {
                name: "z-index",
                desc: "For a positioned box, the 'z-index' property specifies the stack level of the box in the current stacking context and whether the box establishes a local stacking context.",
                restriction: "integer",
                values: [
                    {
                        name: "auto",
                        desc: "The stack level of the generated box in the current stacking context is 0. The box does not establish a new stacking context unless it is the root element."
                    }
                ]
            },
            {
                name: "zoom",
                desc: "Non-standard. Specifies the magnification scale of the object. See 'transform: scale()' for a standards-based alternative.",
                browsers: "E,C,IE6,O15,S4",
                restriction: "enum, integer, number, percentage",
                values: [
                    {
                        name: "normal"
                    }
                ]
            }
        ]
    }
};
var descriptions = {
    "100": "Thin",
    "200": "Extra Light (Ultra Light)",
    "300": "Light",
    "400": "Normal",
    "500": "Medium",
    "600": "Semi Bold (Demi Bold)",
    "700": "Bold",
    "800": "Extra Bold (Ultra Bold)",
    "900": "Black (Heavy)",
    "self-end": "The item is packed flush to the edge of the alignment container of the end side of the item, in the appropriate axis.",
    "self-start": "The item is packed flush to the edge of the alignment container of the start side of the item, in the appropriate axis..",
    "alternate": "The animation cycle iterations that are odd counts are played in the normal direction, and the animation cycle iterations that are even counts are played in a reverse direction.",
    "alternate-reverse": "The animation cycle iterations that are odd counts are played in the reverse direction, and the animation cycle iterations that are even counts are played in a normal direction.",
    "backwards": "The beginning property value (as defined in the first @keyframes at-rule) is applied before the animation is displayed, during the period defined by 'animation-delay'.",
    "forwards": "The final property value (as defined in the last @keyframes at-rule) is maintained after the animation completes.",
    "paused": "A running animation will be paused.",
    "running": "Resume playback of a paused animation.",
    "multiply": "The source color is multiplied by the destination color and replaces the destination.",
    "screen": "Multiplies the complements of the backdrop and source color values, then complements the result.",
    "overlay": "Multiplies or screens the colors, depending on the backdrop color value.",
    "darken": "Selects the darker of the backdrop and source colors.",
    "lighten": "Selects the lighter of the backdrop and source colors.",
    "color-dodge": "Brightens the backdrop color to reflect the source color.",
    "color-burn": "Darkens the backdrop color to reflect the source color.",
    "hard-light": "Multiplies or screens the colors, depending on the source color value.",
    "soft-light": "Darkens or lightens the colors, depending on the source color value.",
    "difference": "Subtracts the darker of the two constituent colors from the lighter color..",
    "exclusion": "Produces an effect similar to that of the Difference mode but lower in contrast.",
    "hue": "Creates a color with the hue of the source color and the saturation and luminosity of the backdrop color.",
    "saturation": "Creates a color with the saturation of the source color and the hue and luminosity of the backdrop color.",
    "color": "Creates a color with the hue and saturation of the source color and the luminosity of the backdrop color.",
    "luminosity": "Creates a color with the luminosity of the source color and the hue and saturation of the backdrop color.",
    "repeat": "The image is tiled (repeated) to fill the area.",
    "clone": "Each box is independently wrapped with the border and padding.",
    "slice": "The effect is as though the element were rendered with no breaks present, and then sliced by the breaks afterward.",
    "inset": "Changes the drop shadow from an outer shadow (one that shadows the box onto the canvas, as if it were lifted above the canvas) to an inner shadow (one that shadows the canvas onto the box, as if the box were cut out of the canvas and shifted behind it).",
    "border-box": "The specified width and height (and respective min/max properties) on this element determine the border box of the element.",
    "content-box": "Behavior of width and height as specified by CSS2.1. The specified width and height (and respective min/max properties) apply to the width and height respectively of the content box of the element.",
    "rect()": "Specifies offsets from the edges of the border box.",
    "evenodd": "Determines the ‘insideness’ of a point on the canvas by drawing a ray from that point to infinity in any direction and counting the number of path segments from the given shape that the ray crosses.",
    "nonzero": "Determines the ‘insideness’ of a point on the canvas by drawing a ray from that point to infinity in any direction and then examining the places where a segment of the shape crosses the ray.",
    "linearRGB": "Color operations should occur in the linearized RGB color space.",
    "sRGB": "Color operations should occur in the sRGB color space.",
    "balance": "Balance content equally between columns, if possible.",
    "size": "For properties that can have effects on more than just an element and its descendants, those effects don't escape the containing element.",
    "layout": "Turns on layout containment for the element.",
    "paint": "Turns on paint containment for the element.",
    "attr()": "The attr(n) function returns as a string the value of attribute n for the subject of the selector.",
    "counter(name)": "Counters are denoted by identifiers (see the 'counter-increment' and 'counter-reset' properties).",
    "alias": "Indicates an alias of/shortcut to something is to be created. Often rendered as an arrow with a small curved arrow next to it.",
    "all-scroll": "Indicates that the something can be scrolled in any direction. Often rendered as arrows pointing up, down, left, and right with a dot in the middle.",
    "cell": "Indicates that a cell or set of cells may be selected. Often rendered as a thick plus-sign with a dot in the middle.",
    "col-resize": "Indicates that the item/column can be resized horizontally. Often rendered as arrows pointing left and right with a vertical bar separating them.",
    "context-menu": "A context menu is available for the object under the cursor. Often rendered as an arrow with a small menu-like graphic next to it.",
    "copy": "Indicates something is to be copied. Often rendered as an arrow with a small plus sign next to it.",
    "crosshair": "A simple crosshair (e.g., short line segments resembling a '+' sign). Often used to indicate a two dimensional bitmap selection mode.",
    "e-resize": "Indicates that east edge is to be moved.",
    "ew-resize": "Indicates a bidirectional east-west resize cursor.",
    "grab": "Indicates that something can be grabbed.",
    "grabbing": "Indicates that something is being grabbed.",
    "help": "Help is available for the object under the cursor. Often rendered as a question mark or a balloon.",
    "move": "Indicates something is to be moved.",
    "-moz-grab": "Indicates that something can be grabbed.",
    "-moz-grabbing": "Indicates that something is being grabbed.",
    "-moz-zoom-in": "Indicates that something can be zoomed (magnified) in.",
    "-moz-zoom-out": "Indicates that something can be zoomed (magnified) out.",
    "ne-resize": "Indicates that movement starts from north-east corner.",
    "nesw-resize": "Indicates a bidirectional north-east/south-west cursor.",
    "no-drop": "Indicates that the dragged item cannot be dropped at the current cursor location. Often rendered as a hand or pointer with a small circle with a line through it.",
    "not-allowed": "Indicates that the requested action will not be carried out. Often rendered as a circle with a line through it.",
    "n-resize": "Indicates that north edge is to be moved.",
    "ns-resize": "Indicates a bidirectional north-south cursor.",
    "nw-resize": "Indicates that movement starts from north-west corner.",
    "nwse-resize": "Indicates a bidirectional north-west/south-east cursor.",
    "pointer": "The cursor is a pointer that indicates a link.",
    "progress": "A progress indicator. The program is performing some processing, but is different from 'wait' in that the user may still interact with the program. Often rendered as a spinning beach ball, or an arrow with a watch or hourglass.",
    "row-resize": "Indicates that the item/row can be resized vertically. Often rendered as arrows pointing up and down with a horizontal bar separating them.",
    "se-resize": "Indicates that movement starts from south-east corner.",
    "s-resize": "Indicates that south edge is to be moved.",
    "sw-resize": "Indicates that movement starts from south-west corner.",
    "vertical-text": "Indicates vertical-text that may be selected. Often rendered as a horizontal I-beam.",
    "wait": "Indicates that the program is busy and the user should wait. Often rendered as a watch or hourglass.",
    "-webkit-grab": "Indicates that something can be grabbed.",
    "-webkit-grabbing": "Indicates that something is being grabbed.",
    "-webkit-zoom-in": "Indicates that something can be zoomed (magnified) in.",
    "-webkit-zoom-out": "Indicates that something can be zoomed (magnified) out.",
    "w-resize": "Indicates that west edge is to be moved.",
    "zoom-in": "Indicates that something can be zoomed (magnified) in.",
    "zoom-out": "Indicates that something can be zoomed (magnified) out.",
    "ltr": "Left-to-right direction.",
    "rtl": "Right-to-left direction.",
    "block": "The element generates a block-level box",
    "flex": "The element generates a principal flex container box and establishes a flex formatting context.",
    "flexbox": "The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
    "flow-root": "The element generates a block container box, and lays out its contents using flow layout.",
    "grid": "The element generates a principal grid container box, and establishes a grid formatting context.",
    "inline-block": "A block box, which itself is flowed as a single inline box, similar to a replaced element. The inside of an inline-block is formatted as a block box, and the box itself is formatted as an inline box.",
    "inline-flex": "Inline-level flex container.",
    "inline-flexbox": "Inline-level flex container. Standardized as 'inline-flex'",
    "inline-table": "Inline-level table wrapper box containing table box.",
    "list-item": "One or more block boxes and one marker box.",
    "-moz-box": "The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
    "-moz-inline-box": "Inline-level flex container. Standardized as 'inline-flex'",
    "-ms-flexbox": "The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
    "-ms-grid": "The element generates a principal grid container box, and establishes a grid formatting context.",
    "-ms-inline-flexbox": "Inline-level flex container. Standardized as 'inline-flex'",
    "-ms-inline-grid": "Inline-level grid container.",
    "run-in": "The element generates a run-in box. Run-in elements act like inlines or blocks, depending on the surrounding elements.",
    "table": "The element generates a principal table wrapper box containing an additionally-generated table box, and establishes a table formatting context.",
    "-webkit-box": "The element lays out its contents using flow layout (block-and-inline layout). Standardized as 'flex'.",
    "-webkit-flex": "The element lays out its contents using flow layout (block-and-inline layout).",
    "-webkit-inline-box": "Inline-level flex container. Standardized as 'inline-flex'",
    "-webkit-inline-flex": "Inline-level flex container.",
    "hide": "No borders or backgrounds are drawn around/behind empty cells.",
    "show": "Borders and backgrounds are drawn around/behind empty cells (like normal cells).",
    "accumulate": "If the ancestor container element has a property of new, then all graphics elements within the current container are rendered both on the parent's background image and onto the target.",
    "new": "Create a new background image canvas. All children of the current container element can access the background, and they will be rendered onto both the parent's background image canvas in addition to the target device.",
    "blur()": "Applies a Gaussian blur to the input image.",
    "brightness()": "Applies a linear multiplier to input image, making it appear more or less bright.",
    "contrast()": "Adjusts the contrast of the input.",
    "drop-shadow()": "Applies a drop shadow effect to the input image.",
    "grayscale()": "Converts the input image to grayscale.",
    "hue-rotate()": "Applies a hue rotation on the input image. ",
    "invert()": "Inverts the samples in the input image.",
    "opacity()": "Applies transparency to the samples in the input image.",
    "saturate()": "Saturates the input image.",
    "sepia()": "Converts the input image to sepia.",
    "column-reverse": "Same as 'column', except the main-start and main-end directions are swapped.",
    "row-reverse": "Same as 'row', except the main-start and main-end directions are swapped.",
    "wrap-reverse": "Same as 'wrap', except the cross-start and cross-end directions are swapped.",
    "inline-end": "A keyword indicating that the element must float on the end side of its containing block. That is the right side with ltr scripts, and the left side with rtl scripts.",
    "inline-start": "A keyword indicating that the element must float on the start side of its containing block. That is the left side with ltr scripts, and the right side with rtl scripts.",
    "bold": "Same as 700",
    "bolder": "Specifies the weight of the face bolder than the inherited value.",
    "caption": "The font used for captioned controls (e.g., buttons, drop-downs, etc.).",
    "lighter": "Specifies the weight of the face lighter than the inherited value.",
    "menu": "The font used in menus (e.g., dropdown menus and menu lists).",
    "message-box": "The font used in dialog boxes.",
    "small-caption": "The font used for labeling small controls.",
    "status-bar": "The font used in window status bars.",
    "\"aalt\"": "Access All Alternates.",
    "\"abvf\"": "Above-base Forms. Required in Khmer script.",
    "\"abvm\"": "Above-base Mark Positioning. Required in Indic scripts.",
    "\"abvs\"": "Above-base Substitutions. Required in Indic scripts.",
    "\"afrc\"": "Alternative Fractions.",
    "\"akhn\"": "Akhand. Required in most Indic scripts.",
    "\"blwf\"": "Below-base Form. Required in a number of Indic scripts.",
    "\"blwm\"": "Below-base Mark Positioning. Required in Indic scripts.",
    "\"blws\"": "Below-base Substitutions. Required in Indic scripts.",
    "\"calt\"": "Contextual Alternates.",
    "\"case\"": "Case-Sensitive Forms. Applies only to European scripts; particularly prominent in Spanish-language setting.",
    "\"ccmp\"": "Glyph Composition/Decomposition.",
    "\"cfar\"": "Conjunct Form After Ro. Required in Khmer scripts.",
    "\"cjct\"": "Conjunct Forms. Required in Indic scripts that show similarity to Devanagari.",
    "\"clig\"": "Contextual Ligatures.",
    "\"cpct\"": "Centered CJK Punctuation. Used primarily in Chinese fonts.",
    "\"cpsp\"": "Capital Spacing. Should not be used in connecting scripts (e.g. most Arabic).",
    "\"cswh\"": "Contextual Swash.",
    "\"curs\"": "Cursive Positioning. Can be used in any cursive script.",
    "\"c2pc\"": "Petite Capitals From Capitals. Applies only to bicameral scripts.",
    "\"dist\"": "Distances. Required in Indic scripts.",
    "\"dnom\"": "Denominators.",
    "\"dtls\"": "Dotless Forms. Applied to math formula layout.",
    "\"expt\"": "Expert Forms. Applies only to Japanese.",
    "\"falt\"": "Final Glyph on Line Alternates. Can be used in any cursive script.",
    "\"fin2\"": "Terminal Form #2. Used only with the Syriac script.",
    "\"fin3\"": "Terminal Form #3. Used only with the Syriac script.",
    "\"fina\"": "Terminal Forms. Can be used in any alphabetic script.",
    "\"flac\"": "Flattened ascent forms. Applied to math formula layout.",
    "\"frac\"": "Fractions.",
    "\"fwid\"": "Full Widths. Applies to any script which can use monospaced forms.",
    "\"half\"": "Half Forms. Required in Indic scripts that show similarity to Devanagari.",
    "\"haln\"": "Halant Forms. Required in Indic scripts.",
    "\"halt\"": "Alternate Half Widths. Used only in CJKV fonts.",
    "\"hist\"": "Historical Forms.",
    "\"hkna\"": "Horizontal Kana Alternates. Applies only to fonts that support kana (hiragana and katakana).",
    "\"hlig\"": "Historical Ligatures.",
    "\"hngl\"": "Hangul. Korean only.",
    "\"hojo\"": "Hojo Kanji Forms (JIS X 0212-1990 Kanji Forms). Used only with Kanji script.",
    "\"hwid\"": "Half Widths. Generally used only in CJKV fonts.",
    "\"init\"": "Initial Forms. Can be used in any alphabetic script.",
    "\"isol\"": "Isolated Forms. Can be used in any cursive script.",
    "\"ital\"": "Italics. Applies mostly to Latin; note that many non-Latin fonts contain Latin as well.",
    "\"jalt\"": "Justification Alternates. Can be used in any cursive script.",
    "\"jp78\"": "JIS78 Forms. Applies only to Japanese.",
    "\"jp83\"": "JIS83 Forms. Applies only to Japanese.",
    "\"jp90\"": "JIS90 Forms. Applies only to Japanese.",
    "\"jp04\"": "JIS2004 Forms. Applies only to Japanese.",
    "\"lfbd\"": "Left Bounds.",
    "\"ljmo\"": "Leading Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.",
    "\"locl\"": "Localized Forms.",
    "\"ltra\"": "Left-to-right glyph alternates.",
    "\"ltrm\"": "Left-to-right mirrored forms.",
    "\"mark\"": "Mark Positioning.",
    "\"med2\"": "Medial Form #2. Used only with the Syriac script.",
    "\"medi\"": "Medial Forms.",
    "\"mgrk\"": "Mathematical Greek.",
    "\"mkmk\"": "Mark to Mark Positioning.",
    "\"nalt\"": "Alternate Annotation Forms.",
    "\"nlck\"": "NLC Kanji Forms. Used only with Kanji script.",
    "\"nukt\"": "Nukta Forms. Required in Indic scripts..",
    "\"numr\"": "Numerators.",
    "\"opbd\"": "Optical Bounds.",
    "\"ordn\"": "Ordinals. Applies mostly to Latin script.",
    "\"ornm\"": "Ornaments.",
    "\"palt\"": "Proportional Alternate Widths. Used mostly in CJKV fonts.",
    "\"pcap\"": "Petite Capitals.",
    "\"pkna\"": "Proportional Kana. Generally used only in Japanese fonts.",
    "\"pnum\"": "Proportional Figures.",
    "\"pref\"": "Pre-base Forms. Required in Khmer and Myanmar (Burmese) scripts and southern Indic scripts that may display a pre-base form of Ra.",
    "\"pres\"": "Pre-base Substitutions. Required in Indic scripts.",
    "\"pstf\"": "Post-base Forms. Required in scripts of south and southeast Asia that have post-base forms for consonants eg: Gurmukhi, Malayalam, Khmer.",
    "\"psts\"": "Post-base Substitutions.",
    "\"pwid\"": "Proportional Widths.",
    "\"qwid\"": "Quarter Widths. Generally used only in CJKV fonts.",
    "\"rand\"": "Randomize.",
    "\"rclt\"": "Required Contextual Alternates. May apply to any script, but is especially important for many styles of Arabic.",
    "\"rlig\"": "Required Ligatures. Applies to Arabic and Syriac. May apply to some other scripts.",
    "\"rkrf\"": "Rakar Forms. Required in Devanagari and Gujarati scripts.",
    "\"rphf\"": "Reph Form. Required in Indic scripts. E.g. Devanagari, Kannada.",
    "\"rtbd\"": "Right Bounds.",
    "\"rtla\"": "Right-to-left alternates.",
    "\"rtlm\"": "Right-to-left mirrored forms.",
    "\"ruby\"": "Ruby Notation Forms. Applies only to Japanese.",
    "\"salt\"": "Stylistic Alternates.",
    "\"sinf\"": "Scientific Inferiors.",
    "\"size\"": "Optical size.",
    "\"smpl\"": "Simplified Forms. Applies only to Chinese and Japanese.",
    "\"ssty\"": "Math script style alternates.",
    "\"stch\"": "Stretching Glyph Decomposition.",
    "\"subs\"": "Subscript.",
    "\"sups\"": "Superscript.",
    "\"titl\"": "Titling.",
    "\"tjmo\"": "Trailing Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.",
    "\"tnam\"": "Traditional Name Forms. Applies only to Japanese.",
    "\"trad\"": "Traditional Forms. Applies only to Chinese and Japanese.",
    "\"twid\"": "Third Widths. Generally used only in CJKV fonts.",
    "\"unic\"": "Unicase.",
    "\"valt\"": "Alternate Vertical Metrics. Applies only to scripts with vertical writing modes.",
    "\"vatu\"": "Vattu Variants. Used for Indic scripts. E.g. Devanagari.",
    "\"vert\"": "Vertical Alternates. Applies only to scripts with vertical writing modes.",
    "\"vhal\"": "Alternate Vertical Half Metrics. Used only in CJKV fonts.",
    "\"vjmo\"": "Vowel Jamo Forms. Required for Hangul script when Ancient Hangul writing system is supported.",
    "\"vkna\"": "Vertical Kana Alternates. Applies only to fonts that support kana (hiragana and katakana).",
    "\"vkrn\"": "Vertical Kerning.",
    "\"vpal\"": "Proportional Alternate Vertical Metrics. Used mostly in CJKV fonts.",
    "\"vrt2\"": "Vertical Alternates and Rotation. Applies only to scripts with vertical writing modes.",
    "\"zero\"": "Slashed Zero.",
    "narrower": "Indicates a narrower value relative to the width of the parent element.",
    "wider": "Indicates a wider value relative to the width of the parent element.",
    "weight": "Allow synthetic bold faces.",
    "annotation()": "Enables display of alternate annotation forms.",
    "character-variant()": "Enables display of specific character variants.",
    "historical-forms": "Enables display of historical forms.",
    "ornaments()": "Enables replacement of default glyphs with ornaments, if provided in the font.",
    "styleset()": "Enables display with stylistic sets.",
    "stylistic()": "Enables display of stylistic alternates.",
    "swash()": "Enables display of swash glyphs.",
    "all-petite-caps": "Enables display of petite capitals for both upper and lowercase letters.",
    "all-small-caps": "Enables display of small capitals for both upper and lowercase letters.",
    "petite-caps": "Enables display of petite capitals.",
    "titling-caps": "Enables display of titling capitals.",
    "unicase": "Enables display of mixture of small capitals for uppercase letters with normal lowercase letters.",
    "full-width": "Enables rendering of full-width variants.",
    "jis04": "Enables rendering of JIS04 forms.",
    "jis78": "Enables rendering of JIS78 forms.",
    "jis83": "Enables rendering of JIS83 forms.",
    "jis90": "Enables rendering of JIS90 forms.",
    "proportional-width": "Enables rendering of proportionally-spaced variants.",
    "simplified": "Enables rendering of simplified forms.",
    "traditional": "Enables rendering of traditional forms.",
    "additional-ligatures": "Enables display of additional ligatures.",
    "common-ligatures": "Enables display of common ligatures.",
    "contextual": "Enables display of contextual alternates.",
    "discretionary-ligatures": "Enables display of discretionary ligatures.",
    "historical-ligatures": "Enables display of historical ligatures.",
    "no-additional-ligatures": "Disables display of additional ligatures.",
    "no-common-ligatures": "Disables display of common ligatures.",
    "no-contextual": "Disables display of contextual alternates.",
    "no-discretionary-ligatures": "Disables display of discretionary ligatures.",
    "no-historical-ligatures": "Disables display of historical ligatures.",
    "diagonal-fractions": "Enables display of lining diagonal fractions.",
    "lining-nums": "Enables display of lining numerals.",
    "oldstyle-nums": "Enables display of old-style numerals.",
    "ordinal": "Enables display of letter forms used with ordinal numbers.",
    "proportional-nums": "Enables display of proportional numerals.",
    "slashed-zero": "Enables display of slashed zeros.",
    "stacked-fractions": "Enables display of lining stacked fractions.",
    "tabular-nums": "Enables display of tabular numerals.",
    "span": "Contributes a grid span to the grid item’s placement such that the corresponding edge of the grid item’s grid area is N lines from its opposite edge.",
    "minmax()": "Defines a size range greater than or equal to min and less than or equal to max.",
    "dense": "If specified, the auto-placement algorithm uses a “dense” packing algorithm, which attempts to fill in holes earlier in the grid if smaller items come up later.",
    "fit-content": "Use the fit-content inline size or fit-content block size, as appropriate to the writing mode.",
    "manual": "Words are only broken at line breaks where there are characters inside the word that suggest line break opportunities",
    "flip": "After rotating by the precededing angle, the image is flipped horizontally. Defaults to 0deg if the angle is ommitted.",
    "from-image": "If the image has an orientation specified in its metadata, such as EXIF, this value computes to the angle that the metadata specifies is necessary to correctly orient the image.",
    "crisp-edges": "The image must be scaled with an algorithm that preserves contrast and edges in the image, and which does not smooth colors or introduce blur to the image in the process.",
    "optimizeQuality": "Deprecated.",
    "pixelated": "When scaling the image up, the 'nearest neighbor' or similar algorithm must be used, so that the image appears to be simply composed of very large pixels.",
    "active": "The input method editor is initially active; text entry is performed using it unless the user specifically dismisses it.",
    "disabled": "The input method editor is disabled and may not be activated by the user.",
    "inactive": "The input method editor is initially inactive, but the user may activate it if they wish.",
    "safe": "If the size of the item overflows the alignment container, the item is instead aligned as if the alignment mode were start.",
    "unsafe": "Regardless of the relative sizes of the item and alignment container, the given alignment value is honored.",
    "space-evenly": "The items are evenly distributed within the alignment container along the main axis.",
    "circle": "A hollow circle.",
    "disc": "A filled circle.",
    "inside": "The marker box is outside the principal block box, as described in the section on the ::marker pseudo-element below.",
    "outside": "The ::marker pseudo-element is an inline element placed immediately before all ::before pseudo-elements in the principal block box, after which the element's content flows.",
    "symbols()": "Allows a counter style to be defined inline.",
    "path()": "Defines an SVG path as a string, with optional 'fill-rule' as the first argument.",
    "block-axis": "Elements are oriented along the box's axis.",
    "inline-axis": "Elements are oriented vertically.",
    "padding-box": "The specified width and height (and respective min/max properties) on this element determine the padding box of the element.",
    "line-through": "Each line of text has a line through the middle.",
    "overline": "Each line of text has a line above it.",
    "underline": "Each line of text is underlined.",
    "dashed": "Produces a dashed line style.",
    "dotted": "Produces a dotted line.",
    "double": "Produces a double line.",
    "solid": "Produces a solid line.",
    "wavy": "Produces a wavy line.",
    "matrix()": "Specifies a 2D transformation in the form of a transformation matrix of six values. matrix(a,b,c,d,e,f) is equivalent to applying the transformation matrix [a b c d e f]",
    "matrix3d()": "Specifies a 3D transformation as a 4x4 homogeneous matrix of 16 values in column-major order.",
    "perspective": "Specifies a perspective projection matrix.",
    "rotate()": "Specifies a 2D rotation by the angle specified in the parameter about the origin of the element, as defined by the transform-origin property.",
    "rotate3d()": "Specifies a clockwise 3D rotation by the angle specified in last parameter about the [x,y,z] direction vector described by the first 3 parameters.",
    "rotateX('angle')": "Specifies a clockwise rotation by the given angle about the X axis.",
    "rotateY('angle')": "Specifies a clockwise rotation by the given angle about the Y axis.",
    "rotateZ('angle')": "Specifies a clockwise rotation by the given angle about the Z axis.",
    "scale()": "Specifies a 2D scale operation by the [sx,sy] scaling vector described by the 2 parameters. If the second parameter is not provided, it is takes a value equal to the first.",
    "scale3d()": "Specifies a 3D scale operation by the [sx,sy,sz] scaling vector described by the 3 parameters.",
    "scaleX()": "Specifies a scale operation using the [sx,1] scaling vector, where sx is given as the parameter.",
    "scaleY()": "Specifies a scale operation using the [sy,1] scaling vector, where sy is given as the parameter.",
    "scaleZ()": "Specifies a scale operation using the [1,1,sz] scaling vector, where sz is given as the parameter.",
    "skew()": "Specifies a skew transformation along the X and Y axes. The first angle parameter specifies the skew on the X axis. The second angle parameter specifies the skew on the Y axis. If the second parameter is not given then a value of 0 is used for the Y angle (ie: no skew on the Y axis).",
    "skewX()": "Specifies a skew transformation along the X axis by the given angle.",
    "skewY()": "Specifies a skew transformation along the Y axis by the given angle.",
    "translate()": "Specifies a 2D translation by the vector [tx, ty], where tx is the first translation-value parameter and ty is the optional second translation-value parameter.",
    "translate3d()": "Specifies a 3D translation by the vector [tx,ty,tz], with tx, ty and tz being the first, second and third translation-value parameters respectively.",
    "translateX()": "Specifies a translation by the given amount in the X direction.",
    "translateY()": "Specifies a translation by the given amount in the Y direction.",
    "translateZ()": "Specifies a translation by the given amount in the Z direction. Note that percentage values are not allowed in the translateZ translation-value, and if present are evaluated as 0.",
    "false": "The element does not contain an accelerator key sequence.",
    "true": "The element contains an accelerator key sequence.",
    "bt": "Bottom-to-top block flow. Layout is horizontal.",
    "lr": "Left-to-right direction. The flow orientation is vertical.",
    "rl": "Right-to-left direction. The flow orientation is vertical.",
    "tb": "Top-to-bottom direction. The flow orientation is horizontal.",
    "zoom": "The element is zoomable.",
    "no-limit": "There is no limit.",
    "mode": "Any of the range of mode values available to the -ms-layout-grid-mode property.",
    "type": "Any of the range of type values available to the -ms-layout-grid-type property.",
    "-ms-autohiding-scrollbar": "Indicates the element displays auto-hiding scrollbars during mouse interactions and panning indicators during touch and keyboard interactions.",
    "scrollbar": "Scrollbars are typically narrow strips inserted on one or two edges of an element and which often have arrows to click on and a \"thumb\" to drag up and down (or left and right) to move the contents of the element.",
    "ideograph-alpha": "Creates 1/4em extra spacing between runs of ideographic letters and non-ideographic letters, such as Latin-based, Cyrillic, Greek, Arabic or Hebrew.",
    "ideograph-numeric": "Creates 1/4em extra spacing between runs of ideographic letters and numeric glyphs.",
    "ideograph-parenthesis": "Creates extra spacing between normal (non wide) parenthesis and ideographs.",
    "ideograph-space": "Extends the width of the space character while surrounded by ideographs.",
    "punctuation": "Creates extra non-breaking spacing around punctuation as required by language-specific typographic conventions.",
    "digits": "Attempt to typeset horizontally each maximal sequence of consecutive ASCII digits (U+0030–U+0039) that has as many or fewer characters than the specified integer such that it takes up the space of a single character within the vertical line box.",
    "inter-cluster": "Justification primarily changes spacing at word separators and at grapheme cluster boundaries in clustered scripts. This value is typically used for Southeast Asian scripts such as Thai.",
    "inter-ideograph": "Justification primarily changes spacing at word separators and at inter-graphemic boundaries in scripts that use no word spaces. This value is typically used for CJK languages.",
    "inter-word": "Justification primarily changes spacing at word separators. This value is typically used for languages that separate words using spaces, like English or (sometimes) Korean.",
    "kashida": "Justification primarily stretches Arabic and related scripts through the use of kashida or other calligraphic elongation.",
    "clip": "Clip inline content that overflows. Characters may be only partially rendered.",
    "ellipsis": "Render an ellipsis character (U+2026) to represent clipped inline content.",
    "over": "The underline is aligned with the 'top' (right in vertical writing) edge of the element's em-box. In this mode, an overline also switches sides.",
    "under": "The underline is aligned with the 'bottom' (left in vertical writing) edge of the element's em-box. In this case the underline usually does not cross the descenders. This is sometimes called 'accounting' underline.",
    "grippers": "Grippers are always on.",
    "break-all": "Lines may break between any two grapheme clusters for non-CJK scripts.",
    "clear": "Inline flow content can only wrap on top and bottom of the exclusion and must leave the areas to the start and end edges of the exclusion box empty.",
    "maximum": "Inline flow content can wrap on the side of the exclusion with the largest available space for the given line, and must leave the other side of the exclusion empty.",
    "minimum": "Inline flow content can flow around the edge of the exclusion with the smallest available space within the flow content’s containing block, and must leave the other edge of the exclusion empty.",
    "current": "Indicates that the user agent should target the frame that the element is in.",
    "root": "Indicates that the user agent should target the full window.",
    "scale-down": "Size the content as if ‘none’ or ‘contain’ were specified, whichever would result in a smaller concrete object size.",
    "invert": "Performs a color inversion on the pixels on the screen.",
    "-moz-hidden-unscrollable": "Same as the standardized 'clip', except doesn’t establish a block formatting context.",
    "painted": "The given element can be the target element for pointer events when the pointer is over a \"painted\" area. ",
    "visibleFill": "The given element can be the target element for pointer events when the ‘visibility’ property is set to visible and when the pointer is over the interior of the element.",
    "visiblePainted": "The given element can be the target element for pointer events when the ‘visibility’ property is set to visible and when the pointer is over a ‘painted’ area.",
    "visibleStroke": "The given element can be the target element for pointer events when the ‘visibility’ property is set to visible and when the pointer is over the perimeter of the element.",
    "absolute": "The box's position (and possibly size) is specified with the 'top', 'right', 'bottom', and 'left' properties. These properties specify offsets with respect to the box's 'containing block'.",
    "-ms-page": "The box's position is calculated according to the 'absolute' model.",
    "relative": "The box's position is calculated according to the normal flow (this is called the position in normal flow). Then the box is offset relative to its normal position.",
    "static": "The box is a normal box, laid out according to the normal flow. The 'top', 'right', 'bottom', and 'left' properties do not apply.",
    "sticky": "The box's position is calculated according to the normal flow. Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes.",
    "-webkit-sticky": "The box's position is calculated according to the normal flow. Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes.",
    "distribute-letter": "If the width of the ruby text is smaller than that of the base, then the ruby text contents are evenly distributed across the width of the base, with the first and last ruby text glyphs lining up with the corresponding first and last base glyphs. If the width of the ruby text is at least the width of the base, then the letters of the base are evenly distributed across the width of the ruby text.",
    "distribute-space": "If the width of the ruby text is smaller than that of the base, then the ruby text contents are evenly distributed across the width of the base, with a certain amount of white space preceding the first and following the last character in the ruby text. That amount of white space is normally equal to half the amount of inter-character space of the ruby text.",
    "line-edge": "If the ruby text is not adjacent to a line edge, it is aligned as in 'auto'. If it is adjacent to a line edge, then it is still aligned as in auto, but the side of the ruby text that touches the end of the line is lined up with the corresponding edge of the base.",
    "after": "The ruby text appears after the base. This is a relatively rare setting used in ideographic East Asian writing systems, most easily found in educational text.",
    "before": "The ruby text appears before the base. This is the most common setting used in ideographic East Asian writing systems.",
    "attr(x)": "The value of attribute 'x' is a string value. The string value is evaluated as a <number> to determine the number of ruby base elements to be spanned by the annotation element.",
    "smooth": "Scrolls in a smooth fashion using a user-agent-defined timing function and time period.",
    "margin-box": "The background is painted within (clipped to) the margin box.",
    "crispEdges": "Emphasize the contrast between clean edges of artwork over rendering speed and geometric precision.",
    "format()": "Optional hint describing the format of the font resource.",
    "local()": "Format-specific string that identifies a locally available copy of a given font.",
    "butt": "Indicates that the stroke for each subpath does not extend beyond its two endpoints.",
    "bevel": "Indicates that a bevelled corner is to be used to join path segments.",
    "miter": "Indicates that a sharp corner is to be used to join path segments.",
    "additive": "Represents “sign-value” numbering systems, which, rather than using reusing digits in different positions to change their value, define additional digits with much larger values, so that the value of the number can be obtained by adding all the digits together.",
    "cyclic": "Cycles repeatedly through its provided symbols, looping back to the beginning when it reaches the end of the list.",
    "extends": "Use the algorithm of another counter style, but alter other aspects.",
    "numeric": "interprets the list of counter symbols as digits to a \"place-value\" numbering system, similar to the default 'decimal' counter style.",
    "symbolic": "Cycles repeatedly through its provided symbols, doubling, tripling, etc. the symbols on each successive pass through the list.",
    "sideways": "This value is equivalent to 'sideways-right' in 'vertical-rl' writing mode and equivalent to 'sideways-left' in 'vertical-lr' writing mode.",
    "sideways-right": "In vertical writing modes, this causes text to be set as if in a horizontal layout, but rotated 90° clockwise.",
    "upright": "In vertical writing modes, characters from horizontal-only scripts are rendered upright, i.e. in their standard horizontal orientation.",
    "optimizeLegibility": "Indicates that the user agent shall emphasize legibility over rendering speed and geometric precision.",
    "capitalize": "Puts the first typographic letter unit of each word in titlecase.",
    "lowercase": "Puts all letters in lowercase.",
    "uppercase": "Puts all letters in uppercase.",
    "perspective()": "Specifies a perspective projection matrix.",
    "flat": "All children of this element are rendered flattened into the 2D plane of the element.",
    "preserve-3d": "Flattening is not performed, so children maintain their position in 3D space.",
    "bidi-override": "Inside the element, reordering is strictly in sequence according to the 'direction' property; the implicit part of the bidirectional algorithm is ignored.",
    "embed": "If the element is inline-level, this value opens an additional level of embedding with respect to the bidirectional algorithm. The direction of this embedding level is given by the 'direction' property.",
    "isolate-override": "This combines the isolation behavior of 'isolate' with the directional override behavior of 'bidi-override'",
    "plaintext": "For the purposes of the Unicode bidirectional algorithm, the base directionality of each bidi paragraph for which the element forms the containing block is determined not by the element's computed 'direction'.",
    "U+26": "Ampersand.",
    "U+20-24F, U+2B0-2FF, U+370-4FF, U+1E00-1EFF, U+2000-20CF, U+2100-23FF, U+2500-26FF, U+E000-F8FF, U+FB00–FB4F": "WGL4 character set (Pan-European).",
    "U+20-17F, U+2B0-2FF, U+2000-206F, U+20A0-20CF, U+2100-21FF, U+2600-26FF": "The Multilingual European Subset No. 1. Latin. Covers ~44 languages.",
    "U+20-2FF, U+370-4FF, U+1E00-20CF, U+2100-23FF, U+2500-26FF, U+FB00-FB4F, U+FFF0-FFFD": "The Multilingual European Subset No. 2. Latin, Greek, and Cyrillic. Covers ~128 language.",
    "U+20-4FF, U+530-58F, U+10D0-10FF, U+1E00-23FF, U+2440-245F, U+2500-26FF, U+FB00-FB4F, U+FE20-FE2F, U+FFF0-FFFD": "The Multilingual European Subset No. 3. Covers all characters belonging to European scripts.",
    "U+00-7F": "Basic Latin (ASCII).",
    "U+80-FF": "Latin-1 Supplement. Accented characters for Western European languages, common punctuation characters, multiplication and division signs.",
    "U+100-17F": "Latin Extended-A. Accented characters for for Czech, Dutch, Polish, and Turkish.",
    "U+180-24F": "Latin Extended-B. Croatian, Slovenian, Romanian, Non-European and historic latin, Khoisan, Pinyin, Livonian, Sinology.",
    "U+1E00-1EFF": "Latin Extended Additional. Vietnamese, German captial sharp s, Medievalist, Latin general use.",
    "U+250-2AF": "International Phonetic Alphabet Extensions.",
    "U+370-3FF": "Greek and Coptic.",
    "U+1F00-1FFF": "Greek Extended. Accented characters for polytonic Greek.",
    "U+400-4FF": "Cyrillic.",
    "U+500-52F": "Cyrillic Supplement. Extra letters for Komi, Khanty, Chukchi, Mordvin, Kurdish, Aleut, Chuvash, Abkhaz, Azerbaijani, and Orok.",
    "U+00-52F, U+1E00-1FFF, U+2200–22FF": "Latin, Greek, Cyrillic, some punctuation and symbols.",
    "U+530–58F": "Armenian.",
    "U+590–5FF": "Hebrew.",
    "U+600–6FF": "Arabic.",
    "U+750–77F": "Arabic Supplement. Additional letters for African languages, Khowar, Torwali, Burushaski, and early Persian.",
    "U+8A0–8FF": "Arabic Extended-A. Additional letters for African languages, European and Central Asian languages, Rohingya, Tamazight, Arwi, and Koranic annotation signs.",
    "U+700–74F": "Syriac.",
    "U+900–97F": "Devanagari.",
    "U+980–9FF": "Bengali.",
    "U+A00–A7F": "Gurmukhi.",
    "U+A80–AFF": "Gujarati.",
    "U+B00–B7F": "Oriya.",
    "U+B80–BFF": "Tamil.",
    "U+C00–C7F": "Telugu.",
    "U+C80–CFF": "Kannada.",
    "U+D00–D7F": "Malayalam.",
    "U+D80–DFF": "Sinhala.",
    "U+118A0–118FF": "Warang Citi.",
    "U+E00–E7F": "Thai.",
    "U+1A20–1AAF": "Tai Tham.",
    "U+AA80–AADF": "Tai Viet.",
    "U+E80–EFF": "Lao.",
    "U+F00–FFF": "Tibetan.",
    "U+1000–109F": "Myanmar (Burmese).",
    "U+10A0–10FF": "Georgian.",
    "U+1200–137F": "Ethiopic.",
    "U+1380–139F": "Ethiopic Supplement. Extra Syllables for Sebatbeit, and Tonal marks",
    "U+2D80–2DDF": "Ethiopic Extended. Extra Syllables for Me'en, Blin, and Sebatbeit.",
    "U+AB00–AB2F": "Ethiopic Extended-A. Extra characters for Gamo-Gofa-Dawro, Basketo, and Gumuz.",
    "U+1780–17FF": "Khmer.",
    "U+1800–18AF": "Mongolian.",
    "U+1B80–1BBF": "Sundanese.",
    "U+1CC0–1CCF": "Sundanese Supplement. Punctuation.",
    "U+4E00–9FD5": "CJK (Chinese, Japanese, Korean) Unified Ideographs. Most common ideographs for modern Chinese and Japanese.",
    "U+3400–4DB5": "CJK Unified Ideographs Extension A. Rare ideographs.",
    "U+2F00–2FDF": "Kangxi Radicals.",
    "U+2E80–2EFF": "CJK Radicals Supplement. Alternative forms of Kangxi Radicals.",
    "U+1100–11FF": "Hangul Jamo.",
    "U+AC00–D7AF": "Hangul Syllables.",
    "U+3040–309F": "Hiragana.",
    "U+30A0–30FF": "Katakana.",
    "U+A5, U+4E00-9FFF, U+30??, U+FF00-FF9F": "Japanese Kanji, Hiragana and Katakana characters plus Yen/Yuan symbol.",
    "U+A4D0–A4FF": "Lisu.",
    "U+A000–A48F": "Yi Syllables.",
    "U+A490–A4CF": "Yi Radicals.",
    "U+2000-206F": "General Punctuation.",
    "U+3000–303F": "CJK Symbols and Punctuation.",
    "U+2070–209F": "Superscripts and Subscripts.",
    "U+20A0–20CF": "Currency Symbols.",
    "U+2100–214F": "Letterlike Symbols.",
    "U+2150–218F": "Number Forms.",
    "U+2190–21FF": "Arrows.",
    "U+2200–22FF": "Mathematical Operators.",
    "U+2300–23FF": "Miscellaneous Technical.",
    "U+E000-F8FF": "Private Use Area.",
    "U+FB00–FB4F": "Alphabetic Presentation Forms. Ligatures for latin, Armenian, and Hebrew.",
    "U+FB50–FDFF": "Arabic Presentation Forms-A. Contextual forms / ligatures for Persian, Urdu, Sindhi, Central Asian languages, etc, Arabic pedagogical symbols, word ligatures.",
    "U+1F600–1F64F": "Emoji: Emoticons.",
    "U+2600–26FF": "Emoji: Miscellaneous Symbols.",
    "U+1F300–1F5FF": "Emoji: Miscellaneous Symbols and Pictographs.",
    "U+1F900–1F9FF": "Emoji: Supplemental Symbols and Pictographs.",
    "U+1F680–1F6FF": "Emoji: Transport and Map Symbols.",
    "text-bottom": "Align the bottom of the box with the after-edge of the parent element's font.",
    "text-top": "Align the top of the box with the before-edge of the parent element's font.",
    "break": "If the content fits within the CSS Region, then this property has no effect.",
    "pre": "Sets 'white-space-collapsing' to 'preserve' and 'text-wrap' to 'none'.",
    "pre-line": "Sets 'white-space-collapsing' to 'preserve-breaks' and 'text-wrap' to 'normal'.",
    "pre-wrap": "Sets 'white-space-collapsing' to 'preserve' and 'text-wrap' to 'normal'.",
    "scroll-position": "Indicates that the author expects to animate or change the scroll position of the element in the near future.",
    "horizontal-tb": "Top-to-bottom block flow direction. The writing mode is horizontal.",
    "sideways-lr": "Left-to-right block flow direction. The writing mode is vertical, while the typographic mode is horizontal.",
    "sideways-rl": "Right-to-left block flow direction. The writing mode is vertical, while the typographic mode is horizontal.",
    "vertical-lr": "Left-to-right block flow direction. The writing mode is vertical.",
    "vertical-rl": "Right-to-left block flow direction. The writing mode is vertical."
};

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var localize$2 = loadMessageBundle();
var colors = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgrey: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    grey: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgrey: '#d3d3d3',
    lightgreen: '#90ee90',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370d8',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#d87093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    red: '#ff0000',
    rebeccapurple: '#663399',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
};
var colorKeywords = {
    'currentColor': 'The value of the \'color\' property. The computed value of the \'currentColor\' keyword is the computed value of the \'color\' property. If the \'currentColor\' keyword is set on the \'color\' property itself, it is treated as \'color:inherit\' at parse time.',
    'transparent': 'Fully transparent. This keyword can be considered a shorthand for rgba(0,0,0,0) which is its computed value.',
};
var positionKeywords = {
    'bottom': 'Computes to ‘100%’ for the vertical position if one or two values are given, otherwise specifies the bottom edge as the origin for the next offset.',
    'center': 'Computes to ‘50%’ (‘left 50%’) for the horizontal position if the horizontal position is not otherwise specified, or ‘50%’ (‘top 50%’) for the vertical position if it is.',
    'left': 'Computes to ‘0%’ for the horizontal position if one or two values are given, otherwise specifies the left edge as the origin for the next offset.',
    'right': 'Computes to ‘100%’ for the horizontal position if one or two values are given, otherwise specifies the right edge as the origin for the next offset.',
    'top': 'Computes to ‘0%’ for the vertical position if one or two values are given, otherwise specifies the top edge as the origin for the next offset.'
};
var repeatStyleKeywords = {
    'no-repeat': 'Placed once and not repeated in this direction.',
    'repeat': 'Repeated in this direction as often as needed to cover the background painting area.',
    'repeat-x': 'Computes to ‘repeat no-repeat’.',
    'repeat-y': 'Computes to ‘no-repeat repeat’.',
    'round': 'Repeated as often as will fit within the background positioning area. If it doesn’t fit a whole number of times, it is rescaled so that it does.',
    'space': 'Repeated as often as will fit within the background positioning area without being clipped and then the images are spaced out to fill the area.'
};
var lineStyleKeywords = {
    'dashed': 'A series of square-ended dashes.',
    'dotted': 'A series of round dots.',
    'double': 'Two parallel solid lines with some space between them.',
    'groove': 'Looks as if it were carved in the canvas.',
    'hidden': 'Same as ‘none’, but has different behavior in the border conflict resolution rules for border-collapsed tables.',
    'inset': 'Looks as if the content on the inside of the border is sunken into the canvas.',
    'none': 'No border. Color and width are ignored.',
    'outset': 'Looks as if the content on the inside of the border is coming out of the canvas.',
    'ridge': 'Looks as if it were coming out of the canvas.',
    'solid': 'A single line segment.'
};
var lineWidthKeywords = ['medium', 'thick', 'thin'];
var boxKeywords = {
    'border-box': 'The background is painted within (clipped to) the border box.',
    'content-box': 'The background is painted within (clipped to) the content box.',
    'padding-box': 'The background is painted within (clipped to) the padding box.'
};
var geometryBoxKeywords = {
    'margin-box': 'Uses the margin box as reference box.',
    'fill-box': 'Uses the object bounding box as reference box.',
    'stroke-box': 'Uses the stroke bounding box as reference box.',
    'view-box': 'Uses the nearest SVG viewport as reference box.'
};
var cssWideKeywords = {
    'initial': 'Represents the value specified as the property’s initial value.',
    'inherit': 'Represents the computed value of the property on the element’s parent.',
    'unset': 'Acts as either `inherit` or `initial`, depending on whether the property is inherited or not.'
};
var colorFunctions = [
    { func: 'rgb($red, $green, $blue)', desc: localize$2('css.builtin.rgb', 'Creates a Color from red, green, and blue values.') },
    { func: 'rgba($red, $green, $blue, $alpha)', desc: localize$2('css.builtin.rgba', 'Creates a Color from red, green, blue, and alpha values.') },
    { func: 'hsl($hue, $saturation, $lightness)', desc: localize$2('css.builtin.hsl', 'Creates a Color from hue, saturation, and lightness values.') },
    { func: 'hsla($hue, $saturation, $lightness, $alpha)', desc: localize$2('css.builtin.hsla', 'Creates a Color from hue, saturation, lightness, and alpha values.') }
];
var imageFunctions = {
    'url()': 'Reference an image file by URL',
    'image()': 'Provide image fallbacks and annotations.',
    '-webkit-image-set()': 'Provide multiple resolutions. Remember to use unprefixed image-set() in addition.',
    'image-set()': 'Provide multiple resolutions of an image and let the UA decide which is most appropriate in a given situation.',
    '-moz-element()': 'Use an element in the document as an image. Remember to use unprefixed element() in addition.',
    'element()': 'Use an element in the document as an image.',
    'cross-fade()': 'Indicates the two images to be combined and how far along in the transition the combination is.',
    '-webkit-gradient()': 'Deprecated. Use modern linear-gradient() or radial-gradient() instead.',
    '-webkit-linear-gradient()': 'Linear gradient. Remember to use unprefixed version in addition.',
    '-moz-linear-gradient()': 'Linear gradient. Remember to use unprefixed version in addition.',
    '-o-linear-gradient()': 'Linear gradient. Remember to use unprefixed version in addition.',
    'linear-gradient()': 'A linear gradient is created by specifying a straight gradient line, and then several colors placed along that line.',
    '-webkit-repeating-linear-gradient()': 'Repeating Linear gradient. Remember to use unprefixed version in addition.',
    '-moz-repeating-linear-gradient()': 'Repeating Linear gradient. Remember to use unprefixed version in addition.',
    '-o-repeating-linear-gradient()': 'RepeatingLinear gradient. Remember to use unprefixed version in addition.',
    'repeating-linear-gradient()': 'Same as linear-gradient, except the color-stops are repeated infinitely in both directions, with their positions shifted by multiples of the difference between the last specified color-stop’s position and the first specified color-stop’s position.',
    '-webkit-radial-gradient()': 'Radial gradient. Remember to use unprefixed version in addition.',
    '-moz-radial-gradient()': 'Radial gradient. Remember to use unprefixed version in addition.',
    'radial-gradient()': 'Colors emerge from a single point and smoothly spread outward in a circular or elliptical shape.',
    '-webkit-repeating-radial-gradient()': 'Repeating radial gradient. Remember to use unprefixed version in addition.',
    '-moz-repeating-radial-gradient()': 'Repeating radial gradient. Remember to use unprefixed version in addition.',
    'repeating-radial-gradient()': 'Same as radial-gradient, except the color-stops are repeated infinitely in both directions, with their positions shifted by multiples of the difference between the last specified color-stop’s position and the first specified color-stop’s position.'
};
var transitionTimingFunctions = {
    'ease': 'Equivalent to cubic-bezier(0.25, 0.1, 0.25, 1.0).',
    'ease-in': 'Equivalent to cubic-bezier(0.42, 0, 1.0, 1.0).',
    'ease-in-out': 'Equivalent to cubic-bezier(0.42, 0, 0.58, 1.0).',
    'ease-out': 'Equivalent to cubic-bezier(0, 0, 0.58, 1.0).',
    'linear': 'Equivalent to cubic-bezier(0.0, 0.0, 1.0, 1.0).',
    'step-end': 'Equivalent to steps(1, end).',
    'step-start': 'Equivalent to steps(1, start).',
    'steps()': 'The first parameter specifies the number of intervals in the function. The second parameter, which is optional, is either the value “start” or “end”.',
    'cubic-bezier()': 'Specifies a cubic-bezier curve. The four values specify points P1 and P2  of the curve as (x1, y1, x2, y2).',
    'cubic-bezier(0.6, -0.28, 0.735, 0.045)': 'Ease-in Back. Overshoots.',
    'cubic-bezier(0.68, -0.55, 0.265, 1.55)': 'Ease-in-out Back. Overshoots.',
    'cubic-bezier(0.175, 0.885, 0.32, 1.275)': 'Ease-out Back. Overshoots.',
    'cubic-bezier(0.6, 0.04, 0.98, 0.335)': 'Ease-in Circular. Based on half circle.',
    'cubic-bezier(0.785, 0.135, 0.15, 0.86)': 'Ease-in-out Circular. Based on half circle.',
    'cubic-bezier(0.075, 0.82, 0.165, 1)': 'Ease-out Circular. Based on half circle.',
    'cubic-bezier(0.55, 0.055, 0.675, 0.19)': 'Ease-in Cubic. Based on power of three.',
    'cubic-bezier(0.645, 0.045, 0.355, 1)': 'Ease-in-out Cubic. Based on power of three.',
    'cubic-bezier(0.215, 0.610, 0.355, 1)': 'Ease-out Cubic. Based on power of three.',
    'cubic-bezier(0.95, 0.05, 0.795, 0.035)': 'Ease-in Exponential. Based on two to the power ten.',
    'cubic-bezier(1, 0, 0, 1)': 'Ease-in-out Exponential. Based on two to the power ten.',
    'cubic-bezier(0.19, 1, 0.22, 1)': 'Ease-out Exponential. Based on two to the power ten.',
    'cubic-bezier(0.47, 0, 0.745, 0.715)': 'Ease-in Sine.',
    'cubic-bezier(0.445, 0.05, 0.55, 0.95)': 'Ease-in-out Sine.',
    'cubic-bezier(0.39, 0.575, 0.565, 1)': 'Ease-out Sine.',
    'cubic-bezier(0.55, 0.085, 0.68, 0.53)': 'Ease-in Quadratic. Based on power of two.',
    'cubic-bezier(0.455, 0.03, 0.515, 0.955)': 'Ease-in-out Quadratic. Based on power of two.',
    'cubic-bezier(0.25, 0.46, 0.45, 0.94)': 'Ease-out Quadratic. Based on power of two.',
    'cubic-bezier(0.895, 0.03, 0.685, 0.22)': 'Ease-in Quartic. Based on power of four.',
    'cubic-bezier(0.77, 0, 0.175, 1)': 'Ease-in-out Quartic. Based on power of four.',
    'cubic-bezier(0.165, 0.84, 0.44, 1)': 'Ease-out Quartic. Based on power of four.',
    'cubic-bezier(0.755, 0.05, 0.855, 0.06)': 'Ease-in Quintic. Based on power of five.',
    'cubic-bezier(0.86, 0, 0.07, 1)': 'Ease-in-out Quintic. Based on power of five.',
    'cubic-bezier(0.23, 1, 0.320, 1)': 'Ease-out Quintic. Based on power of five.'
};
var basicShapeFunctions = {
    'circle()': 'Defines a circle.',
    'ellipse()': 'Defines an ellipse.',
    'inset()': 'Defines an inset rectangle.',
    'polygon()': 'Defines a polygon.'
};
var units = {
    'length': ['em', 'rem', 'ex', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ch', 'vw', 'vh', 'vmin', 'vmax'],
    'angle': ['deg', 'rad', 'grad', 'turn'],
    'time': ['ms', 's'],
    'frequency': ['Hz', 'kHz'],
    'resolution': ['dpi', 'dpcm', 'dppx'],
    'percentage': ['%']
};
var html5Tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
    'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link',
    'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q',
    'rb', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td',
    'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'let', 'video', 'wbr'];
var svgElements = ['circle', 'clipPath', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
    'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
    'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'foreignObject', 'g', 'hatch', 'hatchpath', 'image', 'line', 'linearGradient',
    'marker', 'mask', 'mesh', 'meshpatch', 'meshrow', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'solidcolor', 'stop', 'svg', 'switch',
    'symbol', 'text', 'textPath', 'tspan', 'use', 'view'];
function isColorConstructor(node) {
    var name = node.getName();
    if (!name) {
        return false;
    }
    return /^(rgb|rgba|hsl|hsla)$/gi.test(name);
}
var Digit0 = 48;
var Digit9 = 57;
var A = 65;
var a = 97;
var f = 102;
function hexDigit(charCode) {
    if (charCode < Digit0) {
        return 0;
    }
    if (charCode <= Digit9) {
        return charCode - Digit0;
    }
    if (charCode < a) {
        charCode += (a - A);
    }
    if (charCode >= a && charCode <= f) {
        return charCode - a + 10;
    }
    return 0;
}
function colorFromHex(text) {
    if (text[0] !== '#') {
        return null;
    }
    switch (text.length) {
        case 4:
            return {
                red: (hexDigit(text.charCodeAt(1)) * 0x11) / 255.0,
                green: (hexDigit(text.charCodeAt(2)) * 0x11) / 255.0,
                blue: (hexDigit(text.charCodeAt(3)) * 0x11) / 255.0,
                alpha: 1
            };
        case 5:
            return {
                red: (hexDigit(text.charCodeAt(1)) * 0x11) / 255.0,
                green: (hexDigit(text.charCodeAt(2)) * 0x11) / 255.0,
                blue: (hexDigit(text.charCodeAt(3)) * 0x11) / 255.0,
                alpha: (hexDigit(text.charCodeAt(4)) * 0x11) / 255.0,
            };
        case 7:
            return {
                red: (hexDigit(text.charCodeAt(1)) * 0x10 + hexDigit(text.charCodeAt(2))) / 255.0,
                green: (hexDigit(text.charCodeAt(3)) * 0x10 + hexDigit(text.charCodeAt(4))) / 255.0,
                blue: (hexDigit(text.charCodeAt(5)) * 0x10 + hexDigit(text.charCodeAt(6))) / 255.0,
                alpha: 1
            };
        case 9:
            return {
                red: (hexDigit(text.charCodeAt(1)) * 0x10 + hexDigit(text.charCodeAt(2))) / 255.0,
                green: (hexDigit(text.charCodeAt(3)) * 0x10 + hexDigit(text.charCodeAt(4))) / 255.0,
                blue: (hexDigit(text.charCodeAt(5)) * 0x10 + hexDigit(text.charCodeAt(6))) / 255.0,
                alpha: (hexDigit(text.charCodeAt(7)) * 0x10 + hexDigit(text.charCodeAt(8))) / 255.0
            };
    }
    return null;
}
function colorFromHSL(hue, sat, light, alpha) {
    if (alpha === void 0) { alpha = 1.0; }
    hue = hue / 60.0;
    if (sat === 0) {
        return { red: light, green: light, blue: light, alpha: alpha };
    }
    else {
        var hueToRgb = function (t1, t2, hue) {
            while (hue < 0) {
                hue += 6;
            }
            while (hue >= 6) {
                hue -= 6;
            }
            if (hue < 1) {
                return (t2 - t1) * hue + t1;
            }
            if (hue < 3) {
                return t2;
            }
            if (hue < 4) {
                return (t2 - t1) * (4 - hue) + t1;
            }
            return t1;
        };
        var t2 = light <= 0.5 ? (light * (sat + 1)) : (light + sat - (light * sat));
        var t1 = light * 2 - t2;
        return { red: hueToRgb(t1, t2, hue + 2), green: hueToRgb(t1, t2, hue), blue: hueToRgb(t1, t2, hue - 2), alpha: alpha };
    }
}
function hslFromColor(rgba) {
    var r = rgba.red;
    var g = rgba.green;
    var b = rgba.blue;
    var a = rgba.alpha;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (min + max) / 2;
    var chroma = max - min;
    if (chroma > 0) {
        s = Math.min((l <= 0.5 ? chroma / (2 * l) : chroma / (2 - (2 * l))), 1);
        switch (max) {
            case r:
                h = (g - b) / chroma + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / chroma + 2;
                break;
            case b:
                h = (r - g) / chroma + 4;
                break;
        }
        h *= 60;
        h = Math.round(h);
    }
    return { h: h, s: s, l: l, a: a };
}
function getColorValue(node) {
    if (node.type === NodeType.HexColorValue) {
        var text = node.getText();
        return colorFromHex(text);
    }
    else if (node.type === NodeType.Function) {
        var functionNode = node;
        var name = functionNode.getName();
        var colorValues = functionNode.getArguments().getChildren();
        if (!name || colorValues.length < 3 || colorValues.length > 4) {
            return null;
        }
        try {
            var alpha = colorValues.length === 4 ? getNumericValue(colorValues[3], 1) : 1;
            if (name === 'rgb' || name === 'rgba') {
                return {
                    red: getNumericValue(colorValues[0], 255.0),
                    green: getNumericValue(colorValues[1], 255.0),
                    blue: getNumericValue(colorValues[2], 255.0),
                    alpha: alpha
                };
            }
            else if (name === 'hsl' || name === 'hsla') {
                var h = getAngle(colorValues[0]);
                var s = getNumericValue(colorValues[1], 100.0);
                var l = getNumericValue(colorValues[2], 100.0);
                return colorFromHSL(h, s, l, alpha);
            }
        }
        catch (e) {
            // parse error on numeric value
            return null;
        }
    }
    else if (node.type === NodeType.Identifier) {
        if (node.parent && node.parent.type !== NodeType.Term) {
            return null;
        }
        var candidateColor = node.getText().toLowerCase();
        if (candidateColor === 'none') {
            return null;
        }
        var colorHex = colors[candidateColor];
        if (colorHex) {
            return colorFromHex(colorHex);
        }
    }
    return null;
}
function getNumericValue(node, factor) {
    var val = node.getText();
    var m = val.match(/^([-+]?[0-9]*\.?[0-9]+)(%?)$/);
    if (m) {
        if (m[2]) {
            factor = 100.0;
        }
        var result = parseFloat(m[1]) / factor;
        if (result >= 0 && result <= 1) {
            return result;
        }
    }
    throw new Error();
}
function getAngle(node) {
    var val = node.getText();
    var m = val.match(/^([-+]?[0-9]*\.?[0-9]+)(deg)?$/);
    if (m) {
        return parseFloat(val) % 360;
    }
    throw new Error();
}
/**
 * Returns true if the given name is a known property.
 */
function isKnownProperty(name) {
    if (!name) {
        return false;
    }
    else {
        name = name.toLowerCase();
        return getProperties().hasOwnProperty(name);
    }
}
function isCommonValue(entry) {
    return entry.browsers.count > 1;
}
function getPageBoxDirectives() {
    return [
        '@bottom-center', '@bottom-left', '@bottom-left-corner', '@bottom-right', '@bottom-right-corner',
        '@left-bottom', '@left-middle', '@left-top', '@right-bottom', '@right-middle', '@right-top',
        '@top-center', '@top-left', '@top-left-corner', '@top-right', '@top-right-corner'
    ];
}
function getEntryDescription(entry) {
    var desc = entry.description || '';
    var browserLabel = getBrowserLabel(entry.browsers);
    if (browserLabel) {
        if (desc) {
            desc = desc + '\n';
        }
        desc = desc + '(' + browserLabel + ')';
    }
    return desc;
}
function getBrowserLabel(b) {
    var result = '';
    if (!b || b.all || b.count === 0) {
        return null;
    }
    for (var curr in browserNames) {
        if (typeof b[curr] === 'string') {
            if (result.length > 0) {
                result = result + ', ';
            }
            result = result + browserNames[curr];
            var version = b[curr];
            if (version.length > 0) {
                result = result + ' ' + version;
            }
        }
    }
    return result;
}
function evalBrowserEntry(browsers) {
    var browserEntry = { all: false, count: 0, onCodeComplete: false };
    var count = 0;
    if (browsers) {
        for (var _i = 0, _a = browsers.split(','); _i < _a.length; _i++) {
            var s = _a[_i];
            s = s.trim();
            if (s === 'all') {
                browserEntry.all = true;
                count = Number.MAX_VALUE;
            }
            else if (s !== 'none') {
                for (var key in browserNames) {
                    if (s.indexOf(key) === 0) {
                        browserEntry[key] = s.substring(key.length).trim();
                        count++;
                    }
                }
            }
        }
    }
    else {
        browserEntry.all = true;
        count = Number.MAX_VALUE;
    }
    browserEntry.count = count;
    browserEntry.onCodeComplete = count > 0; // to be refined
    return browserEntry;
}
var ValueImpl = /** @class */ (function () {
    function ValueImpl(data$$1) {
        this.data = data$$1;
    }
    Object.defineProperty(ValueImpl.prototype, "name", {
        get: function () {
            return this.data.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueImpl.prototype, "description", {
        get: function () {
            return this.data.desc || descriptions[this.data.name];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValueImpl.prototype, "browsers", {
        get: function () {
            if (!this.browserEntry) {
                this.browserEntry = evalBrowserEntry(this.data.browsers);
            }
            return this.browserEntry;
        },
        enumerable: true,
        configurable: true
    });
    return ValueImpl;
}());
var EntryImpl = /** @class */ (function () {
    function EntryImpl(data$$1) {
        this.data = data$$1;
    }
    Object.defineProperty(EntryImpl.prototype, "name", {
        get: function () {
            return this.data.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryImpl.prototype, "description", {
        get: function () {
            return this.data.desc || descriptions[this.data.name];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryImpl.prototype, "browsers", {
        get: function () {
            if (!this.browserEntry) {
                this.browserEntry = evalBrowserEntry(this.data.browsers);
            }
            return this.browserEntry;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryImpl.prototype, "restrictions", {
        get: function () {
            if (this.data.restriction) {
                return this.data.restriction.split(',').map(function (s) { return s.trim(); });
            }
            else {
                return [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EntryImpl.prototype, "values", {
        get: function () {
            if (!this.data.values) {
                return [];
            }
            if (!Array.isArray(this.data.values)) {
                return [new ValueImpl(this.data.values.value)];
            }
            return this.data.values.map(function (v) {
                return new ValueImpl(v);
            });
        },
        enumerable: true,
        configurable: true
    });
    return EntryImpl;
}());
var propertySet;
var properties = data.css.properties;
function getProperties() {
    if (!propertySet) {
        propertySet = {};
        for (var i = 0, len = properties.length; i < len; i++) {
            var rawEntry = properties[i];
            propertySet[rawEntry.name] = new EntryImpl(rawEntry);
        }
    }
    return propertySet;
}
var atDirectives = data.css.atdirectives;
var atDirectiveList;
function getAtDirectives() {
    if (!atDirectiveList) {
        atDirectiveList = [];
        for (var i = 0, len = atDirectives.length; i < len; i++) {
            var rawEntry = atDirectives[i];
            atDirectiveList.push(new EntryImpl(rawEntry));
        }
    }
    return atDirectiveList;
}
var pseudoElements = data.css.pseudoelements;
var pseudoElementList;
function getPseudoElements() {
    if (!pseudoElementList) {
        pseudoElementList = [];
        for (var i = 0, len = pseudoElements.length; i < len; i++) {
            var rawEntry = pseudoElements[i];
            pseudoElementList.push(new EntryImpl(rawEntry));
        }
    }
    return pseudoElementList;
}
var pseudoClasses = data.css.pseudoclasses;
var pseudoClassesList;
function getPseudoClasses() {
    if (!pseudoClassesList) {
        pseudoClassesList = [];
        for (var i = 0, len = pseudoClasses.length; i < len; i++) {
            var rawEntry = pseudoClasses[i];
            pseudoClassesList.push(new EntryImpl(rawEntry));
        }
    }
    return pseudoClassesList;
}
var browserNames = {
    E: 'Edge',
    FF: 'Firefox',
    S: 'Safari',
    C: 'Chrome',
    IE: 'IE',
    O: 'Opera'
};

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// <summary>
/// A parser for the css core specification. See for reference:
/// http://www.w3.org/TR/CSS21/syndata.html#tokenization
/// </summary>
var Parser = /** @class */ (function () {
    function Parser(scnr) {
        if (scnr === void 0) { scnr = new Scanner(); }
        this.keyframeRegex = /^@(\-(webkit|ms|moz|o)\-)?keyframes$/i;
        this.scanner = scnr;
        this.token = null;
        this.prevToken = null;
    }
    Parser.prototype.peekIdent = function (text) {
        return TokenType.Ident === this.token.type && text.length === this.token.text.length && text === this.token.text.toLowerCase();
    };
    Parser.prototype.peekKeyword = function (text) {
        return TokenType.AtKeyword === this.token.type && text.length === this.token.text.length && text === this.token.text.toLowerCase();
    };
    Parser.prototype.peekDelim = function (text) {
        return TokenType.Delim === this.token.type && text === this.token.text;
    };
    Parser.prototype.peek = function (type) {
        return type === this.token.type;
    };
    Parser.prototype.peekRegExp = function (type, regEx) {
        if (type !== this.token.type) {
            return false;
        }
        return regEx.test(this.token.text);
    };
    Parser.prototype.hasWhitespace = function () {
        return this.prevToken && (this.prevToken.offset + this.prevToken.len !== this.token.offset);
    };
    Parser.prototype.consumeToken = function () {
        this.prevToken = this.token;
        this.token = this.scanner.scan();
    };
    Parser.prototype.mark = function () {
        return {
            prev: this.prevToken,
            curr: this.token,
            pos: this.scanner.pos()
        };
    };
    Parser.prototype.restoreAtMark = function (mark) {
        this.prevToken = mark.prev;
        this.token = mark.curr;
        this.scanner.goBackTo(mark.pos);
    };
    Parser.prototype.try = function (func) {
        var pos = this.mark();
        var node = func();
        if (!node) {
            this.restoreAtMark(pos);
            return null;
        }
        return node;
    };
    Parser.prototype.acceptOneKeyword = function (keywords) {
        if (TokenType.AtKeyword === this.token.type) {
            for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
                var keyword = keywords_1[_i];
                if (keyword.length === this.token.text.length && keyword === this.token.text.toLowerCase()) {
                    this.consumeToken();
                    return true;
                }
            }
        }
        return false;
    };
    Parser.prototype.accept = function (type) {
        if (type === this.token.type) {
            this.consumeToken();
            return true;
        }
        return false;
    };
    Parser.prototype.acceptIdent = function (text) {
        if (this.peekIdent(text)) {
            this.consumeToken();
            return true;
        }
        return false;
    };
    Parser.prototype.acceptKeyword = function (text) {
        if (this.peekKeyword(text)) {
            this.consumeToken();
            return true;
        }
        return false;
    };
    Parser.prototype.acceptDelim = function (text) {
        if (this.peekDelim(text)) {
            this.consumeToken();
            return true;
        }
        return false;
    };
    Parser.prototype.acceptUnquotedString = function () {
        var pos = this.scanner.pos();
        this.scanner.goBackTo(this.token.offset);
        var unquoted = this.scanner.scanUnquotedString();
        if (unquoted) {
            this.token = unquoted;
            this.consumeToken();
            return true;
        }
        this.scanner.goBackTo(pos);
        return false;
    };
    Parser.prototype.resync = function (resyncTokens, resyncStopTokens) {
        while (true) {
            if (resyncTokens && resyncTokens.indexOf(this.token.type) !== -1) {
                this.consumeToken();
                return true;
            }
            else if (resyncStopTokens && resyncStopTokens.indexOf(this.token.type) !== -1) {
                return true;
            }
            else {
                if (this.token.type === TokenType.EOF) {
                    return false;
                }
                this.token = this.scanner.scan();
            }
        }
    };
    Parser.prototype.createNode = function (nodeType) {
        return new Node$1(this.token.offset, this.token.len, nodeType);
    };
    Parser.prototype.create = function (ctor) {
        var obj = Object.create(ctor.prototype);
        ctor.apply(obj, [this.token.offset, this.token.len]);
        return obj;
    };
    Parser.prototype.finish = function (node, error, resyncTokens, resyncStopTokens) {
        // parseNumeric misuses error for boolean flagging (however the real error mustn't be a false)
        // + nodelist offsets mustn't be modified, because there is a offset hack in rulesets for smartselection
        if (!(node instanceof Nodelist)) {
            if (error) {
                this.markError(node, error, resyncTokens, resyncStopTokens);
            }
            // set the node end position
            if (this.prevToken !== null) {
                // length with more elements belonging together
                var prevEnd = this.prevToken.offset + this.prevToken.len;
                node.length = prevEnd > node.offset ? prevEnd - node.offset : 0; // offset is taken from current token, end from previous: Use 0 for empty nodes
            }
        }
        return node;
    };
    Parser.prototype.markError = function (node, error, resyncTokens, resyncStopTokens) {
        if (this.token !== this.lastErrorToken) {
            node.addIssue(new Marker(node, error, Level.Error, null, this.token.offset, this.token.len));
            this.lastErrorToken = this.token;
        }
        if (resyncTokens || resyncStopTokens) {
            this.resync(resyncTokens, resyncStopTokens);
        }
    };
    Parser.prototype.parseStylesheet = function (textDocument) {
        var versionId = textDocument.version;
        var textProvider = function (offset, length) {
            if (textDocument.version !== versionId) {
                throw new Error('Underlying model has changed, AST is no longer valid');
            }
            return textDocument.getText().substr(offset, length);
        };
        return this.internalParse(textDocument.getText(), this._parseStylesheet, textProvider);
    };
    Parser.prototype.internalParse = function (input, parseFunc, textProvider) {
        this.scanner.setSource(input);
        this.token = this.scanner.scan();
        var node = parseFunc.bind(this)();
        if (node) {
            if (textProvider) {
                node.textProvider = textProvider;
            }
            else {
                node.textProvider = function (offset, length) { return input.substr(offset, length); };
            }
        }
        return node;
    };
    Parser.prototype._parseStylesheet = function () {
        var node = this.create(Stylesheet);
        node.addChild(this._parseCharset());
        var inRecovery = false;
        do {
            var hasMatch = false;
            do {
                hasMatch = false;
                var statement = this._parseStylesheetStatement();
                if (statement) {
                    node.addChild(statement);
                    hasMatch = true;
                    inRecovery = false;
                    if (!this.peek(TokenType.EOF) && this._needsSemicolonAfter(statement) && !this.accept(TokenType.SemiColon)) {
                        this.markError(node, ParseError.SemiColonExpected);
                    }
                }
                while (this.accept(TokenType.SemiColon) || this.accept(TokenType.CDO) || this.accept(TokenType.CDC)) {
                    // accept empty statements
                    hasMatch = true;
                    inRecovery = false;
                }
            } while (hasMatch);
            if (this.peek(TokenType.EOF)) {
                break;
            }
            if (!inRecovery) {
                if (this.peek(TokenType.AtKeyword)) {
                    this.markError(node, ParseError.UnknownAtRule);
                }
                else {
                    this.markError(node, ParseError.RuleOrSelectorExpected);
                }
                inRecovery = true;
            }
            this.consumeToken();
        } while (!this.peek(TokenType.EOF));
        return this.finish(node);
    };
    Parser.prototype._parseStylesheetStatement = function () {
        if (this.peek(TokenType.AtKeyword)) {
            return this._parseImport()
                || this._parseMedia()
                || this._parsePage()
                || this._parseFontFace()
                || this._parseKeyframe()
                || this._parseSupports()
                || this._parseViewPort()
                || this._parseNamespace()
                || this._parseDocument();
        }
        return this._parseRuleset(false);
    };
    Parser.prototype._tryParseRuleset = function (isNested) {
        var mark = this.mark();
        if (this._parseSelector(isNested)) {
            while (this.accept(TokenType.Comma) && this._parseSelector(isNested)) {
                // loop
            }
            if (this.accept(TokenType.CurlyL)) {
                this.restoreAtMark(mark);
                return this._parseRuleset(isNested);
            }
        }
        this.restoreAtMark(mark);
        return null;
    };
    Parser.prototype._parseRuleset = function (isNested) {
        if (isNested === void 0) { isNested = false; }
        var node = this.create(RuleSet);
        if (!node.getSelectors().addChild(this._parseSelector(isNested))) {
            return null;
        }
        while (this.accept(TokenType.Comma) && node.getSelectors().addChild(this._parseSelector(isNested))) {
            // loop
        }
        return this._parseBody(node, this._parseRuleSetDeclaration.bind(this));
    };
    Parser.prototype._parseRuleSetDeclaration = function () {
        return this._parseAtApply() || this._tryParseCustomPropertyDeclaration() || this._parseDeclaration();
    };
    /**
     * Parses declarations like:
     *   @apply --my-theme;
     *
     * Follows https://tabatkins.github.io/specs/css-apply-rule/#using
     */
    Parser.prototype._parseAtApply = function () {
        if (!this.peekKeyword('@apply')) {
            return null;
        }
        var node = this.create(AtApplyRule);
        this.consumeToken();
        if (!node.setIdentifier(this._parseIdent([ReferenceType.Variable]))) {
            return this.finish(node, ParseError.IdentifierExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._needsSemicolonAfter = function (node) {
        switch (node.type) {
            case NodeType.Keyframe:
            case NodeType.ViewPort:
            case NodeType.Media:
            case NodeType.Ruleset:
            case NodeType.Namespace:
            case NodeType.If:
            case NodeType.For:
            case NodeType.Each:
            case NodeType.While:
            case NodeType.MixinDeclaration:
            case NodeType.FunctionDeclaration:
                return false;
            case NodeType.VariableDeclaration:
            case NodeType.ExtendsReference:
            case NodeType.MixinContent:
            case NodeType.ReturnStatement:
            case NodeType.MediaQuery:
            case NodeType.Debug:
            case NodeType.Import:
            case NodeType.AtApplyRule:
            case NodeType.CustomPropertyDeclaration:
                return true;
            case NodeType.MixinReference:
                return !node.getContent();
            case NodeType.Declaration:
                return !node.getNestedProperties();
        }
        return false;
    };
    Parser.prototype._parseDeclarations = function (parseDeclaration) {
        var node = this.create(Declarations);
        if (!this.accept(TokenType.CurlyL)) {
            return null;
        }
        var decl = parseDeclaration();
        while (node.addChild(decl)) {
            if (this.peek(TokenType.CurlyR)) {
                break;
            }
            if (this._needsSemicolonAfter(decl) && !this.accept(TokenType.SemiColon)) {
                return this.finish(node, ParseError.SemiColonExpected, [TokenType.SemiColon, TokenType.CurlyR]);
            }
            while (this.accept(TokenType.SemiColon)) {
                // accept empty statements
            }
            decl = parseDeclaration();
        }
        if (!this.accept(TokenType.CurlyR)) {
            return this.finish(node, ParseError.RightCurlyExpected, [TokenType.CurlyR, TokenType.SemiColon]);
        }
        return this.finish(node);
    };
    Parser.prototype._parseBody = function (node, parseDeclaration) {
        if (!node.setDeclarations(this._parseDeclarations(parseDeclaration))) {
            return this.finish(node, ParseError.LeftCurlyExpected, [TokenType.CurlyR, TokenType.SemiColon]);
        }
        return this.finish(node);
    };
    Parser.prototype._parseSelector = function (isNested) {
        var node = this.create(Selector);
        var hasContent = false;
        if (isNested) {
            // nested selectors can start with a combinator
            hasContent = node.addChild(this._parseCombinator());
        }
        while (node.addChild(this._parseSimpleSelector())) {
            hasContent = true;
            node.addChild(this._parseCombinator()); // optional
        }
        return hasContent ? this.finish(node) : null;
    };
    Parser.prototype._parseDeclaration = function (resyncStopTokens) {
        var node = this.create(Declaration);
        if (!node.setProperty(this._parseProperty())) {
            return null;
        }
        if (!this.accept(TokenType.Colon)) {
            return this.finish(node, ParseError.ColonExpected, [TokenType.Colon], resyncStopTokens);
        }
        node.colonPosition = this.prevToken.offset;
        if (!node.setValue(this._parseExpr())) {
            return this.finish(node, ParseError.PropertyValueExpected);
        }
        node.addChild(this._parsePrio());
        if (this.peek(TokenType.SemiColon)) {
            node.semicolonPosition = this.token.offset; // not part of the declaration, but useful information for code assist
        }
        return this.finish(node);
    };
    Parser.prototype._tryParseCustomPropertyDeclaration = function () {
        if (!this.peekRegExp(TokenType.Ident, /^--/)) {
            return null;
        }
        var node = this.create(CustomPropertyDeclaration);
        if (!node.setProperty(this._parseProperty())) {
            return null;
        }
        if (!this.accept(TokenType.Colon)) {
            return this.finish(node, ParseError.ColonExpected, [TokenType.Colon]);
        }
        node.colonPosition = this.prevToken.offset;
        var mark = this.mark();
        if (this.peek(TokenType.CurlyL)) {
            // try to parse it as nested declaration
            var propertySet = this.create(CustomPropertySet);
            var declarations = this._parseDeclarations(this._parseRuleSetDeclaration.bind(this));
            if (propertySet.setDeclarations(declarations) && !declarations.isErroneous(true)) {
                propertySet.addChild(this._parsePrio());
                if (this.peek(TokenType.SemiColon)) {
                    this.finish(propertySet);
                    node.setPropertySet(propertySet);
                    node.semicolonPosition = this.token.offset; // not part of the declaration, but useful information for code assist
                    return this.finish(node);
                }
            }
            this.restoreAtMark(mark);
        }
        // try tp parse as expression
        var expression = this._parseExpr();
        if (expression && !expression.isErroneous(true)) {
            this._parsePrio();
            if (this.peek(TokenType.SemiColon)) {
                node.setValue(expression);
                node.semicolonPosition = this.token.offset; // not part of the declaration, but useful information for code assist
                return this.finish(node);
            }
        }
        this.restoreAtMark(mark);
        node.addChild(this._parseCustomPropertyValue());
        node.addChild(this._parsePrio());
        if (this.token.offset === node.colonPosition + 1) {
            return this.finish(node, ParseError.PropertyValueExpected);
        }
        return this.finish(node);
    };
    /**
     * Parse custom property values.
     *
     * Based on https://www.w3.org/TR/css-variables/#syntax
     *
     * This code is somewhat unusual, as the allowed syntax is incredibly broad,
     * parsing almost any sequence of tokens, save for a small set of exceptions.
     * Unbalanced delimitors, invalid tokens, and declaration
     * terminators like semicolons and !important directives (when not inside
     * of delimitors).
     */
    Parser.prototype._parseCustomPropertyValue = function () {
        var node = this.create(Node$1);
        var isTopLevel = function () { return curlyDepth === 0 && parensDepth === 0 && bracketsDepth === 0; };
        var curlyDepth = 0;
        var parensDepth = 0;
        var bracketsDepth = 0;
        done: while (true) {
            switch (this.token.type) {
                case TokenType.SemiColon:
                    // A semicolon only ends things if we're not inside a delimitor.
                    if (isTopLevel()) {
                        break done;
                    }
                    break;
                case TokenType.Exclamation:
                    // An exclamation ends the value if we're not inside delims.
                    if (isTopLevel()) {
                        break done;
                    }
                    break;
                case TokenType.CurlyL:
                    curlyDepth++;
                    break;
                case TokenType.CurlyR:
                    curlyDepth--;
                    if (curlyDepth < 0) {
                        // The property value has been terminated without a semicolon, and
                        // this is the last declaration in the ruleset.
                        if (parensDepth === 0 && bracketsDepth === 0) {
                            break done;
                        }
                        return this.finish(node, ParseError.LeftCurlyExpected);
                    }
                    break;
                case TokenType.ParenthesisL:
                    parensDepth++;
                    break;
                case TokenType.ParenthesisR:
                    parensDepth--;
                    if (parensDepth < 0) {
                        return this.finish(node, ParseError.LeftParenthesisExpected);
                    }
                    break;
                case TokenType.BracketL:
                    bracketsDepth++;
                    break;
                case TokenType.BracketR:
                    bracketsDepth--;
                    if (bracketsDepth < 0) {
                        return this.finish(node, ParseError.LeftSquareBracketExpected);
                    }
                    break;
                case TokenType.BadString:// fall through
                    break done;
                case TokenType.EOF:
                    // We shouldn't have reached the end of input, something is
                    // unterminated.
                    var error = ParseError.RightCurlyExpected;
                    if (bracketsDepth > 0) {
                        error = ParseError.RightSquareBracketExpected;
                    }
                    else if (parensDepth > 0) {
                        error = ParseError.RightParenthesisExpected;
                    }
                    return this.finish(node, error);
            }
            this.consumeToken();
        }
        return this.finish(node);
    };
    Parser.prototype._tryToParseDeclaration = function () {
        var mark = this.mark();
        if (this._parseProperty() && this.accept(TokenType.Colon)) {
            // looks like a declaration, go ahead
            this.restoreAtMark(mark);
            return this._parseDeclaration();
        }
        this.restoreAtMark(mark);
        return null;
    };
    Parser.prototype._parseProperty = function () {
        var node = this.create(Property);
        var mark = this.mark();
        if (this.acceptDelim('*') || this.acceptDelim('_')) {
            // support for  IE 5.x, 6 and 7 star hack: see http://en.wikipedia.org/wiki/CSS_filter#Star_hack
            if (this.hasWhitespace()) {
                this.restoreAtMark(mark);
                return null;
            }
        }
        if (node.setIdentifier(this._parsePropertyIdentifier())) {
            return this.finish(node);
        }
        return null;
    };
    Parser.prototype._parsePropertyIdentifier = function () {
        return this._parseIdent();
    };
    Parser.prototype._parseCharset = function () {
        if (!this.peek(TokenType.Charset)) {
            return null;
        }
        var node = this.create(Node$1);
        this.consumeToken(); // charset
        if (!this.accept(TokenType.String)) {
            return this.finish(node, ParseError.IdentifierExpected);
        }
        if (!this.accept(TokenType.SemiColon)) {
            return this.finish(node, ParseError.SemiColonExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._parseImport = function () {
        if (!this.peekKeyword('@import')) {
            return null;
        }
        var node = this.create(Import);
        this.consumeToken(); // @import
        if (!node.addChild(this._parseURILiteral()) && !node.addChild(this._parseStringLiteral())) {
            return this.finish(node, ParseError.URIOrStringExpected);
        }
        if (!this.peek(TokenType.SemiColon) && !this.peek(TokenType.EOF)) {
            node.setMedialist(this._parseMediaQueryList());
        }
        return this.finish(node);
    };
    Parser.prototype._parseNamespace = function () {
        // http://www.w3.org/TR/css3-namespace/
        // namespace  : NAMESPACE_SYM S* [IDENT S*]? [STRING|URI] S* ';' S*
        if (!this.peekKeyword('@namespace')) {
            return null;
        }
        var node = this.create(Namespace);
        this.consumeToken(); // @namespace
        if (!node.addChild(this._parseURILiteral())) {
            node.addChild(this._parseIdent()); // optional prefix
            if (!node.addChild(this._parseURILiteral()) && !node.addChild(this._parseStringLiteral())) {
                return this.finish(node, ParseError.URIExpected, [TokenType.SemiColon]);
            }
        }
        if (!this.accept(TokenType.SemiColon)) {
            return this.finish(node, ParseError.SemiColonExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._parseFontFace = function () {
        if (!this.peekKeyword('@font-face')) {
            return null;
        }
        var node = this.create(FontFace);
        this.consumeToken(); // @font-face
        return this._parseBody(node, this._parseRuleSetDeclaration.bind(this));
    };
    Parser.prototype._parseViewPort = function () {
        if (!this.peekKeyword('@-ms-viewport') &&
            !this.peekKeyword('@-o-viewport') &&
            !this.peekKeyword('@viewport')) {
            return null;
        }
        var node = this.create(ViewPort);
        this.consumeToken(); // @-ms-viewport
        return this._parseBody(node, this._parseRuleSetDeclaration.bind(this));
    };
    Parser.prototype._parseKeyframe = function () {
        if (!this.peekRegExp(TokenType.AtKeyword, this.keyframeRegex)) {
            return null;
        }
        var node = this.create(Keyframe);
        var atNode = this.create(Node$1);
        this.consumeToken(); // atkeyword
        node.setKeyword(this.finish(atNode));
        if (atNode.getText() === '@-ms-keyframes') {
            this.markError(atNode, ParseError.UnknownKeyword);
        }
        if (!node.setIdentifier(this._parseKeyframeIdent())) {
            return this.finish(node, ParseError.IdentifierExpected, [TokenType.CurlyR]);
        }
        return this._parseBody(node, this._parseKeyframeSelector.bind(this));
    };
    Parser.prototype._parseKeyframeIdent = function () {
        return this._parseIdent([ReferenceType.Keyframe]);
    };
    Parser.prototype._parseKeyframeSelector = function () {
        var node = this.create(KeyframeSelector);
        if (!node.addChild(this._parseIdent()) && !this.accept(TokenType.Percentage)) {
            return null;
        }
        while (this.accept(TokenType.Comma)) {
            if (!node.addChild(this._parseIdent()) && !this.accept(TokenType.Percentage)) {
                return this.finish(node, ParseError.PercentageExpected);
            }
        }
        return this._parseBody(node, this._parseRuleSetDeclaration.bind(this));
    };
    Parser.prototype._tryParseKeyframeSelector = function () {
        var node = this.create(KeyframeSelector);
        var pos = this.mark();
        if (!node.addChild(this._parseIdent()) && !this.accept(TokenType.Percentage)) {
            return null;
        }
        while (this.accept(TokenType.Comma)) {
            if (!node.addChild(this._parseIdent()) && !this.accept(TokenType.Percentage)) {
                this.restoreAtMark(pos);
                return null;
            }
        }
        if (!this.peek(TokenType.CurlyL)) {
            this.restoreAtMark(pos);
            return null;
        }
        return this._parseBody(node, this._parseRuleSetDeclaration.bind(this));
    };
    Parser.prototype._parseSupports = function (isNested) {
        if (isNested === void 0) { isNested = false; }
        // SUPPORTS_SYM S* supports_condition '{' S* ruleset* '}' S*
        if (!this.peekKeyword('@supports')) {
            return null;
        }
        var node = this.create(Supports);
        this.consumeToken(); // @supports
        node.addChild(this._parseSupportsCondition());
        return this._parseBody(node, this._parseSupportsDeclaration.bind(this, isNested));
    };
    Parser.prototype._parseSupportsDeclaration = function (isNested) {
        if (isNested === void 0) { isNested = false; }
        if (isNested) {
            // if nested, the body can contain rulesets, but also declarations
            return this._tryParseRuleset(isNested)
                || this._tryToParseDeclaration()
                || this._parseStylesheetStatement();
        }
        return this._parseStylesheetStatement();
    };
    Parser.prototype._parseSupportsCondition = function () {
        // supports_condition : supports_negation | supports_conjunction | supports_disjunction | supports_condition_in_parens ;
        // supports_condition_in_parens: ( '(' S* supports_condition S* ')' ) | supports_declaration_condition | general_enclosed ;
        // supports_negation: NOT S+ supports_condition_in_parens ;
        // supports_conjunction: supports_condition_in_parens ( S+ AND S+ supports_condition_in_parens )+;
        // supports_disjunction: supports_condition_in_parens ( S+ OR S+ supports_condition_in_parens )+;
        // supports_declaration_condition: '(' S* declaration ')';
        // general_enclosed: ( FUNCTION | '(' ) ( any | unused )* ')' ;
        var node = this.create(SupportsCondition);
        if (this.acceptIdent('not')) {
            node.addChild(this._parseSupportsConditionInParens());
        }
        else {
            node.addChild(this._parseSupportsConditionInParens());
            if (this.peekRegExp(TokenType.Ident, /^(and|or)$/i)) {
                var text = this.token.text;
                while (this.acceptIdent(text)) {
                    node.addChild(this._parseSupportsConditionInParens());
                }
            }
        }
        return this.finish(node);
    };
    Parser.prototype._parseSupportsConditionInParens = function () {
        var node = this.create(SupportsCondition);
        if (this.accept(TokenType.ParenthesisL)) {
            node.lParent = this.prevToken.offset;
            if (!node.addChild(this._tryToParseDeclaration())) {
                if (!this._parseSupportsCondition()) {
                    return this.finish(node, ParseError.ConditionExpected);
                }
            }
            if (!this.accept(TokenType.ParenthesisR)) {
                return this.finish(node, ParseError.RightParenthesisExpected, [TokenType.ParenthesisR], []);
            }
            node.rParent = this.prevToken.offset;
            return this.finish(node);
        }
        else if (this.peek(TokenType.Ident)) {
            var pos = this.mark();
            this.consumeToken();
            if (!this.hasWhitespace() && this.accept(TokenType.ParenthesisL)) {
                var openParentCount = 1;
                while (this.token.type !== TokenType.EOF && openParentCount !== 0) {
                    if (this.token.type === TokenType.ParenthesisL) {
                        openParentCount++;
                    }
                    else if (this.token.type === TokenType.ParenthesisR) {
                        openParentCount--;
                    }
                    this.consumeToken();
                }
                return this.finish(node);
            }
            else {
                this.restoreAtMark(pos);
            }
        }
        return this.finish(node, ParseError.LeftParenthesisExpected, [], [TokenType.ParenthesisL]);
    };
    Parser.prototype._parseMediaDeclaration = function (isNested) {
        if (isNested === void 0) { isNested = false; }
        return this._tryParseRuleset(isNested)
            || this._tryToParseDeclaration()
            || this._parseStylesheetStatement();
    };
    Parser.prototype._parseMedia = function (isNested) {
        if (isNested === void 0) { isNested = false; }
        // MEDIA_SYM S* media_query_list '{' S* ruleset* '}' S*
        // media_query_list : S* [media_query [ ',' S* media_query ]* ]?
        if (!this.peekKeyword('@media')) {
            return null;
        }
        var node = this.create(Media);
        this.consumeToken(); // @media
        if (!node.addChild(this._parseMediaQueryList())) {
            return this.finish(node, ParseError.MediaQueryExpected);
        }
        return this._parseBody(node, this._parseMediaDeclaration.bind(this, isNested));
    };
    Parser.prototype._parseMediaQueryList = function () {
        var node = this.create(Medialist);
        if (!node.addChild(this._parseMediaQuery([TokenType.CurlyL]))) {
            return this.finish(node, ParseError.MediaQueryExpected);
        }
        while (this.accept(TokenType.Comma)) {
            if (!node.addChild(this._parseMediaQuery([TokenType.CurlyL]))) {
                return this.finish(node, ParseError.MediaQueryExpected);
            }
        }
        return this.finish(node);
    };
    Parser.prototype._parseMediaQuery = function (resyncStopToken) {
        // http://www.w3.org/TR/css3-mediaqueries/
        // media_query : [ONLY | NOT]? S* IDENT S* [ AND S* expression ]* | expression [ AND S* expression ]*
        // expression : '(' S* IDENT S* [ ':' S* expr ]? ')' S*
        var node = this.create(MediaQuery);
        var parseExpression = true;
        var hasContent = false;
        if (!this.peek(TokenType.ParenthesisL)) {
            if (this.acceptIdent('only') || this.acceptIdent('not')) ;
            if (!node.addChild(this._parseIdent())) {
                return null;
            }
            hasContent = true;
            parseExpression = this.acceptIdent('and');
        }
        while (parseExpression) {
            if (!this.accept(TokenType.ParenthesisL)) {
                if (hasContent) {
                    return this.finish(node, ParseError.LeftParenthesisExpected, [], resyncStopToken);
                }
                return null;
            }
            if (!node.addChild(this._parseMediaFeatureName())) {
                return this.finish(node, ParseError.IdentifierExpected, [], resyncStopToken);
            }
            if (this.accept(TokenType.Colon)) {
                if (!node.addChild(this._parseExpr())) {
                    return this.finish(node, ParseError.TermExpected, [], resyncStopToken);
                }
            }
            if (!this.accept(TokenType.ParenthesisR)) {
                return this.finish(node, ParseError.RightParenthesisExpected, [], resyncStopToken);
            }
            parseExpression = this.acceptIdent('and');
        }
        return this.finish(node);
    };
    Parser.prototype._parseMediaFeatureName = function () {
        return this._parseIdent();
    };
    Parser.prototype._parseMedium = function () {
        var node = this.create(Node$1);
        if (node.addChild(this._parseIdent())) {
            return this.finish(node);
        }
        else {
            return null;
        }
    };
    Parser.prototype._parsePageDeclaration = function () {
        return this._parsePageMarginBox() || this._parseRuleSetDeclaration();
    };
    Parser.prototype._parsePage = function () {
        // http://www.w3.org/TR/css3-page/
        // page_rule : PAGE_SYM S* page_selector_list '{' S* page_body '}' S*
        // page_body :  /* Can be empty */ declaration? [ ';' S* page_body ]? | page_margin_box page_body
        if (!this.peekKeyword('@page')) {
            return null;
        }
        var node = this.create(Page);
        this.consumeToken();
        if (node.addChild(this._parsePageSelector())) {
            while (this.accept(TokenType.Comma)) {
                if (!node.addChild(this._parsePageSelector())) {
                    return this.finish(node, ParseError.IdentifierExpected);
                }
            }
        }
        return this._parseBody(node, this._parsePageDeclaration.bind(this));
    };
    Parser.prototype._parsePageMarginBox = function () {
        // page_margin_box :  margin_sym S* '{' S* declaration? [ ';' S* declaration? ]* '}' S*
        if (!this.peek(TokenType.AtKeyword)) {
            return null;
        }
        var node = this.create(PageBoxMarginBox);
        if (!this.acceptOneKeyword(getPageBoxDirectives())) {
            this.markError(node, ParseError.UnknownAtRule, [], [TokenType.CurlyL]);
        }
        return this._parseBody(node, this._parseRuleSetDeclaration.bind(this));
    };
    Parser.prototype._parsePageSelector = function () {
        // page_selector : pseudo_page+ | IDENT pseudo_page*
        // pseudo_page :  ':' [ "left" | "right" | "first" | "blank" ];
        if (!this.peek(TokenType.Ident) && !this.peek(TokenType.Colon)) {
            return null;
        }
        var node = this.create(Node$1);
        node.addChild(this._parseIdent()); // optional ident
        if (this.accept(TokenType.Colon)) {
            if (!node.addChild(this._parseIdent())) {
                return this.finish(node, ParseError.IdentifierExpected);
            }
        }
        return this.finish(node);
    };
    Parser.prototype._parseDocument = function () {
        // -moz-document is experimental but has been pushed to css4
        if (!this.peekKeyword('@-moz-document')) {
            return null;
        }
        var node = this.create(Document);
        this.consumeToken(); // @-moz-document
        this.resync([], [TokenType.CurlyL]); // ignore all the rules
        return this._parseBody(node, this._parseStylesheetStatement.bind(this));
    };
    Parser.prototype._parseOperator = function () {
        // these are operators for binary expressions
        if (this.peekDelim('/') ||
            this.peekDelim('*') ||
            this.peekDelim('+') ||
            this.peekDelim('-') ||
            this.peek(TokenType.Dashmatch) ||
            this.peek(TokenType.Includes) ||
            this.peek(TokenType.SubstringOperator) ||
            this.peek(TokenType.PrefixOperator) ||
            this.peek(TokenType.SuffixOperator) ||
            this.peekDelim('=')) {
            var node = this.createNode(NodeType.Operator);
            this.consumeToken();
            return this.finish(node);
        }
        else {
            return null;
        }
    };
    Parser.prototype._parseUnaryOperator = function () {
        if (!this.peekDelim('+') && !this.peekDelim('-')) {
            return null;
        }
        var node = this.create(Node$1);
        this.consumeToken();
        return this.finish(node);
    };
    Parser.prototype._parseCombinator = function () {
        if (this.peekDelim('>')) {
            var node = this.create(Node$1);
            this.consumeToken();
            var mark = this.mark();
            if (!this.hasWhitespace() && this.acceptDelim('>')) {
                if (!this.hasWhitespace() && this.acceptDelim('>')) {
                    node.type = NodeType.SelectorCombinatorShadowPiercingDescendant;
                    return this.finish(node);
                }
                this.restoreAtMark(mark);
            }
            node.type = NodeType.SelectorCombinatorParent;
            return this.finish(node);
        }
        else if (this.peekDelim('+')) {
            var node = this.create(Node$1);
            this.consumeToken();
            node.type = NodeType.SelectorCombinatorSibling;
            return this.finish(node);
        }
        else if (this.peekDelim('~')) {
            var node = this.create(Node$1);
            this.consumeToken();
            node.type = NodeType.SelectorCombinatorAllSiblings;
            return this.finish(node);
        }
        else if (this.peekDelim('/')) {
            var node = this.create(Node$1);
            this.consumeToken();
            var mark = this.mark();
            if (!this.hasWhitespace() && this.acceptIdent('deep') && !this.hasWhitespace() && this.acceptDelim('/')) {
                node.type = NodeType.SelectorCombinatorShadowPiercingDescendant;
                return this.finish(node);
            }
            this.restoreAtMark(mark);
        }
        else {
            return null;
        }
    };
    Parser.prototype._parseSimpleSelector = function () {
        // simple_selector
        //  : element_name [ HASH | class | attrib | pseudo ]* | [ HASH | class | attrib | pseudo ]+ ;
        var node = this.create(SimpleSelector);
        var c = 0;
        if (node.addChild(this._parseElementName())) {
            c++;
        }
        while ((c === 0 || !this.hasWhitespace()) && node.addChild(this._parseSimpleSelectorBody())) {
            c++;
        }
        return c > 0 ? this.finish(node) : null;
    };
    Parser.prototype._parseSimpleSelectorBody = function () {
        return this._parsePseudo() || this._parseHash() || this._parseClass() || this._parseAttrib();
    };
    Parser.prototype._parseSelectorIdent = function () {
        return this._parseIdent();
    };
    Parser.prototype._parseHash = function () {
        if (!this.peek(TokenType.Hash) && !this.peekDelim('#')) {
            return null;
        }
        var node = this.createNode(NodeType.IdentifierSelector);
        if (this.acceptDelim('#')) {
            if (this.hasWhitespace() || !node.addChild(this._parseSelectorIdent())) {
                return this.finish(node, ParseError.IdentifierExpected);
            }
        }
        else {
            this.consumeToken(); // TokenType.Hash
        }
        return this.finish(node);
    };
    Parser.prototype._parseClass = function () {
        // class: '.' IDENT ;
        if (!this.peekDelim('.')) {
            return null;
        }
        var node = this.createNode(NodeType.ClassSelector);
        this.consumeToken(); // '.'
        if (this.hasWhitespace() || !node.addChild(this._parseSelectorIdent())) {
            return this.finish(node, ParseError.IdentifierExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._parseElementName = function () {
        // element_name: (ns? '|')? IDENT | '*';
        var pos = this.mark();
        var node = this.createNode(NodeType.ElementNameSelector);
        node.addChild(this._parseNamespacePrefix());
        if (!node.addChild(this._parseSelectorIdent()) && !this.acceptDelim('*')) {
            this.restoreAtMark(pos);
            return null;
        }
        return this.finish(node);
    };
    Parser.prototype._parseNamespacePrefix = function () {
        var pos = this.mark();
        var node = this.createNode(NodeType.NamespacePrefix);
        if (!node.addChild(this._parseIdent()) && !this.acceptDelim('*')) ;
        if (!this.acceptDelim('|')) {
            this.restoreAtMark(pos);
            return null;
        }
        return this.finish(node);
    };
    Parser.prototype._parseAttrib = function () {
        // attrib : '[' S* IDENT S* [ [ '=' | INCLUDES | DASHMATCH ] S*   [ IDENT | STRING ] S* ]? ']'
        if (!this.peek(TokenType.BracketL)) {
            return null;
        }
        var node = this.create(AttributeSelector);
        this.consumeToken(); // BracketL
        // Optional attrib namespace
        node.setNamespacePrefix(this._parseNamespacePrefix());
        if (!node.setExpression(this._parseBinaryExpr())) ;
        if (!this.accept(TokenType.BracketR)) {
            return this.finish(node, ParseError.RightSquareBracketExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._parsePseudo = function () {
        var _this = this;
        // pseudo: ':' [ IDENT | FUNCTION S* [IDENT S*]? ')' ]
        if (!this.peek(TokenType.Colon)) {
            return null;
        }
        var pos = this.mark();
        var node = this.createNode(NodeType.PseudoSelector);
        this.consumeToken(); // Colon
        if (!this.hasWhitespace()) {
            // optional, support ::
            if (this.accept(TokenType.Colon) && this.hasWhitespace()) {
                return this.finish(node, ParseError.IdentifierExpected);
            }
            if (!node.addChild(this._parseIdent())) {
                return this.finish(node, ParseError.IdentifierExpected);
            }
            if (!this.hasWhitespace() && this.accept(TokenType.ParenthesisL)) {
                var tryAsSelector = function () {
                    var selector = _this._parseSimpleSelector();
                    if (selector && _this.peek(TokenType.ParenthesisR)) {
                        return selector;
                    }
                    return null;
                };
                node.addChild(this.try(tryAsSelector) || this._parseBinaryExpr());
                if (!this.accept(TokenType.ParenthesisR)) {
                    return this.finish(node, ParseError.RightParenthesisExpected);
                }
            }
            return this.finish(node);
        }
        this.restoreAtMark(pos);
        return null;
    };
    Parser.prototype._tryParsePrio = function () {
        var mark = this.mark();
        var prio = this._parsePrio();
        if (prio) {
            return prio;
        }
        this.restoreAtMark(mark);
        return null;
    };
    Parser.prototype._parsePrio = function () {
        if (!this.peek(TokenType.Exclamation)) {
            return null;
        }
        var node = this.createNode(NodeType.Prio);
        if (this.accept(TokenType.Exclamation) && this.acceptIdent('important')) {
            return this.finish(node);
        }
        return null;
    };
    Parser.prototype._parseExpr = function (stopOnComma) {
        if (stopOnComma === void 0) { stopOnComma = false; }
        var node = this.create(Expression);
        if (!node.addChild(this._parseNamedLine() || this._parseBinaryExpr())) {
            return null;
        }
        while (true) {
            if (this.peek(TokenType.Comma)) {
                if (stopOnComma) {
                    return this.finish(node);
                }
                this.consumeToken();
            }
            if (!node.addChild(this._parseNamedLine() || this._parseBinaryExpr())) {
                break;
            }
        }
        return this.finish(node);
    };
    Parser.prototype._parseNamedLine = function () {
        // https://www.w3.org/TR/css-grid-1/#named-lines
        if (!this.peek(TokenType.BracketL)) {
            return null;
        }
        var node = this.createNode(NodeType.GridLine);
        this.consumeToken();
        while (node.addChild(this._parseIdent())) {
            // repeat
        }
        if (!this.accept(TokenType.BracketR)) {
            return this.finish(node, ParseError.RightSquareBracketExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._parseBinaryExpr = function (preparsedLeft, preparsedOper) {
        var node = this.create(BinaryExpression);
        if (!node.setLeft((preparsedLeft || this._parseTerm()))) {
            return null;
        }
        if (!node.setOperator(preparsedOper || this._parseOperator())) {
            return this.finish(node);
        }
        if (!node.setRight(this._parseTerm())) {
            return this.finish(node, ParseError.TermExpected);
        }
        // things needed for multiple binary expressions
        node = this.finish(node);
        var operator = this._parseOperator();
        if (operator) {
            node = this._parseBinaryExpr(node, operator);
        }
        return this.finish(node);
    };
    Parser.prototype._parseTerm = function () {
        var node = this.create(Term);
        node.setOperator(this._parseUnaryOperator()); // optional
        if (node.setExpression(this._parseURILiteral()) || // url before function
            node.setExpression(this._parseFunction()) || // function before ident
            node.setExpression(this._parseIdent()) ||
            node.setExpression(this._parseStringLiteral()) ||
            node.setExpression(this._parseNumeric()) ||
            node.setExpression(this._parseHexColor()) ||
            node.setExpression(this._parseOperation())) {
            return this.finish(node);
        }
        return null;
    };
    Parser.prototype._parseOperation = function () {
        if (!this.peek(TokenType.ParenthesisL)) {
            return null;
        }
        var node = this.create(Node$1);
        this.consumeToken(); // ParenthesisL
        node.addChild(this._parseExpr());
        if (!this.accept(TokenType.ParenthesisR)) {
            return this.finish(node, ParseError.RightParenthesisExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._parseNumeric = function () {
        if (this.peek(TokenType.Num) ||
            this.peek(TokenType.Percentage) ||
            this.peek(TokenType.Resolution) ||
            this.peek(TokenType.Length) ||
            this.peek(TokenType.EMS) ||
            this.peek(TokenType.EXS) ||
            this.peek(TokenType.Angle) ||
            this.peek(TokenType.Time) ||
            this.peek(TokenType.Dimension) ||
            this.peek(TokenType.Freq)) {
            var node = this.create(NumericValue);
            this.consumeToken();
            return this.finish(node);
        }
        return null;
    };
    Parser.prototype._parseStringLiteral = function () {
        if (!this.peek(TokenType.String) && !this.peek(TokenType.BadString)) {
            return null;
        }
        var node = this.createNode(NodeType.StringLiteral);
        this.consumeToken();
        return this.finish(node);
    };
    Parser.prototype._parseURILiteral = function () {
        if (!this.peekRegExp(TokenType.Ident, /^url(-prefix)?$/i)) {
            return null;
        }
        var pos = this.mark();
        var node = this.createNode(NodeType.URILiteral);
        this.accept(TokenType.Ident);
        if (this.hasWhitespace() || !this.peek(TokenType.ParenthesisL)) {
            this.restoreAtMark(pos);
            return null;
        }
        this.scanner.inURL = true;
        this.consumeToken(); // consume ()
        node.addChild(this._parseURLArgument()); // argument is optional
        this.scanner.inURL = false;
        if (!this.accept(TokenType.ParenthesisR)) {
            return this.finish(node, ParseError.RightParenthesisExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._parseURLArgument = function () {
        var node = this.create(Node$1);
        if (!this.accept(TokenType.String) && !this.accept(TokenType.BadString) && !this.acceptUnquotedString()) {
            return null;
        }
        return this.finish(node);
    };
    Parser.prototype._parseIdent = function (referenceTypes) {
        if (!this.peek(TokenType.Ident)) {
            return null;
        }
        var node = this.create(Identifier);
        if (referenceTypes) {
            node.referenceTypes = referenceTypes;
        }
        node.isCustomProperty = this.peekRegExp(TokenType.Ident, /^--/);
        this.consumeToken();
        return this.finish(node);
    };
    Parser.prototype._parseFunction = function () {
        var pos = this.mark();
        var node = this.create(Function$1);
        if (!node.setIdentifier(this._parseFunctionIdentifier())) {
            return null;
        }
        if (this.hasWhitespace() || !this.accept(TokenType.ParenthesisL)) {
            this.restoreAtMark(pos);
            return null;
        }
        if (node.getArguments().addChild(this._parseFunctionArgument())) {
            while (this.accept(TokenType.Comma)) {
                if (!node.getArguments().addChild(this._parseFunctionArgument())) {
                    this.markError(node, ParseError.ExpressionExpected);
                }
            }
        }
        if (!this.accept(TokenType.ParenthesisR)) {
            return this.finish(node, ParseError.RightParenthesisExpected);
        }
        return this.finish(node);
    };
    Parser.prototype._parseFunctionIdentifier = function () {
        if (!this.peek(TokenType.Ident)) {
            return null;
        }
        var node = this.create(Identifier);
        node.referenceTypes = [ReferenceType.Function];
        if (this.acceptIdent('progid')) {
            // support for IE7 specific filters: 'progid:DXImageTransform.Microsoft.MotionBlur(strength=13, direction=310)'
            if (this.accept(TokenType.Colon)) {
                while (this.accept(TokenType.Ident) && this.acceptDelim('.')) {
                    // loop
                }
            }
            return this.finish(node);
        }
        this.consumeToken();
        return this.finish(node);
    };
    Parser.prototype._parseFunctionArgument = function () {
        var node = this.create(FunctionArgument);
        if (node.setValue(this._parseExpr(true))) {
            return this.finish(node);
        }
        return null;
    };
    Parser.prototype._parseHexColor = function () {
        if (this.peekRegExp(TokenType.Hash, /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/g)) {
            var node = this.create(HexColorValue);
            this.consumeToken();
            return this.finish(node);
        }
        else {
            return null;
        }
    };
    return Parser;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
 * are located before all elements where p(x) is true.
 * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
 */
function findFirst(array, p) {
    var low = 0, high = array.length;
    if (high === 0) {
        return 0; // no children
    }
    while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (p(array[mid])) {
            high = mid;
        }
        else {
            low = mid + 1;
        }
    }
    return low;
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Scope = /** @class */ (function () {
    function Scope(offset, length) {
        this.offset = offset;
        this.length = length;
        this.symbols = [];
        this.parent = null;
        this.children = [];
    }
    Scope.prototype.addChild = function (scope) {
        this.children.push(scope);
        scope.setParent(this);
    };
    Scope.prototype.setParent = function (scope) {
        this.parent = scope;
    };
    Scope.prototype.findScope = function (offset, length) {
        if (length === void 0) { length = 0; }
        if (this.offset <= offset && this.offset + this.length > offset + length || this.offset === offset && this.length === length) {
            return this.findInScope(offset, length);
        }
        return null;
    };
    Scope.prototype.findInScope = function (offset, length) {
        if (length === void 0) { length = 0; }
        // find the first scope child that has an offset larger than offset + length
        var end = offset + length;
        var idx = findFirst(this.children, function (s) { return s.offset > end; });
        if (idx === 0) {
            // all scopes have offsets larger than our end
            return this;
        }
        var res = this.children[idx - 1];
        if (res.offset <= offset && res.offset + res.length >= offset + length) {
            return res.findInScope(offset, length);
        }
        return this;
    };
    Scope.prototype.addSymbol = function (symbol) {
        this.symbols.push(symbol);
    };
    Scope.prototype.getSymbol = function (name, type) {
        for (var index = 0; index < this.symbols.length; index++) {
            var symbol = this.symbols[index];
            if (symbol.name === name && symbol.type === type) {
                return symbol;
            }
        }
        return null;
    };
    Scope.prototype.getSymbols = function () {
        return this.symbols;
    };
    return Scope;
}());
var GlobalScope = /** @class */ (function (_super) {
    __extends$1(GlobalScope, _super);
    function GlobalScope() {
        return _super.call(this, 0, Number.MAX_VALUE) || this;
    }
    return GlobalScope;
}(Scope));
var Symbol$1 = /** @class */ (function () {
    function Symbol(name, value, node, type) {
        this.name = name;
        this.value = value;
        this.node = node;
        this.type = type;
    }
    return Symbol;
}());
var ScopeBuilder = /** @class */ (function () {
    function ScopeBuilder(scope) {
        this.scope = scope;
    }
    ScopeBuilder.prototype.addSymbol = function (node, name, value, type) {
        if (node.offset !== -1) {
            var current = this.scope.findScope(node.offset, node.length);
            current.addSymbol(new Symbol$1(name, value, node, type));
        }
    };
    ScopeBuilder.prototype.addScope = function (node) {
        if (node.offset !== -1) {
            var current = this.scope.findScope(node.offset, node.length);
            if (current.offset !== node.offset || current.length !== node.length) {
                var newScope = new Scope(node.offset, node.length);
                current.addChild(newScope);
                return newScope;
            }
            return current;
        }
        return null;
    };
    ScopeBuilder.prototype.addSymbolToChildScope = function (scopeNode, node, name, value, type) {
        if (scopeNode && scopeNode.offset !== -1) {
            var current = this.addScope(scopeNode); // create the scope or gets the existing one
            current.addSymbol(new Symbol$1(name, value, node, type));
        }
    };
    ScopeBuilder.prototype.visitNode = function (node) {
        switch (node.type) {
            case NodeType.Keyframe:
                this.addSymbol(node, node.getName(), null, ReferenceType.Keyframe);
                return true;
            case NodeType.CustomPropertyDeclaration:
                return this.visitCustomPropertyDeclarationNode(node);
            case NodeType.VariableDeclaration:
                return this.visitVariableDeclarationNode(node);
            case NodeType.Ruleset:
                return this.visitRuleSet(node);
            case NodeType.MixinDeclaration:
                this.addSymbol(node, node.getName(), null, ReferenceType.Mixin);
                return true;
            case NodeType.FunctionDeclaration:
                this.addSymbol(node, node.getName(), null, ReferenceType.Function);
                return true;
            case NodeType.FunctionParameter: {
                return this.visitFunctionParameterNode(node);
            }
            case NodeType.Declarations:
                this.addScope(node);
                return true;
            case NodeType.For:
                var forNode = node;
                var scopeNode = forNode.getDeclarations();
                if (scopeNode) {
                    this.addSymbolToChildScope(scopeNode, forNode.variable, forNode.variable.getName(), null, ReferenceType.Variable);
                }
                return true;
            case NodeType.Each: {
                var eachNode = node;
                var scopeNode_1 = eachNode.getDeclarations();
                if (scopeNode_1) {
                    var variables = eachNode.getVariables().getChildren();
                    for (var _i = 0, variables_1 = variables; _i < variables_1.length; _i++) {
                        var variable = variables_1[_i];
                        this.addSymbolToChildScope(scopeNode_1, variable, variable.getName(), null, ReferenceType.Variable);
                    }
                }
                return true;
            }
        }
        return true;
    };
    ScopeBuilder.prototype.visitRuleSet = function (node) {
        var current = this.scope.findScope(node.offset, node.length);
        for (var _i = 0, _a = node.getSelectors().getChildren(); _i < _a.length; _i++) {
            var child = _a[_i];
            if (child instanceof Selector) {
                if (child.getChildren().length === 1) {
                    current.addSymbol(new Symbol$1(child.getChild(0).getText(), null, child, ReferenceType.Rule));
                }
            }
        }
        return true;
    };
    ScopeBuilder.prototype.visitVariableDeclarationNode = function (node) {
        var value = node.getValue() ? node.getValue().getText() : null;
        this.addSymbol(node, node.getName(), value, ReferenceType.Variable);
        return true;
    };
    ScopeBuilder.prototype.visitFunctionParameterNode = function (node) {
        // parameters are part of the body scope
        var scopeNode = node.getParent().getDeclarations();
        if (scopeNode) {
            var valueNode = node.getDefaultValue();
            var value = valueNode ? valueNode.getText() : null;
            this.addSymbolToChildScope(scopeNode, node, node.getName(), value, ReferenceType.Variable);
        }
        return true;
    };
    ScopeBuilder.prototype.visitCustomPropertyDeclarationNode = function (node) {
        var value = node.getValue() ? node.getValue().getText() : '';
        this.addCSSVariable(node.getProperty(), node.getProperty().getName(), value, ReferenceType.Variable);
        return true;
    };
    ScopeBuilder.prototype.addCSSVariable = function (node, name, value, type) {
        if (node.offset !== -1) {
            var globalScope = this.getGlobalScope(node, name, type);
            globalScope.addSymbol(new Symbol$1(name, value, node, type));
        }
    };
    ScopeBuilder.prototype.getGlobalScope = function (node, name, type) {
        var current = this.scope.findScope(node.offset, node.length);
        while (current.parent !== null) {
            current = current.parent;
        }
        return current;
    };
    return ScopeBuilder;
}());
var Symbols = /** @class */ (function () {
    function Symbols(node) {
        this.global = new GlobalScope();
        node.acceptVisitor(new ScopeBuilder(this.global));
    }
    Symbols.prototype.findSymbolsAtOffset = function (offset, referenceType) {
        var scope = this.global.findScope(offset, 0);
        var result = [];
        var names = {};
        while (scope) {
            var symbols = scope.getSymbols();
            for (var i = 0; i < symbols.length; i++) {
                var symbol = symbols[i];
                if (symbol.type === referenceType && !names[symbol.name]) {
                    result.push(symbol);
                    names[symbol.name] = true;
                }
            }
            scope = scope.parent;
        }
        return result;
    };
    Symbols.prototype.internalFindSymbol = function (node, referenceTypes) {
        var scopeNode = node;
        if (node.parent instanceof FunctionParameter && node.parent.getParent() instanceof BodyDeclaration) {
            scopeNode = node.parent.getParent().getDeclarations();
        }
        if (node.parent instanceof FunctionArgument && node.parent.getParent() instanceof Function$1) {
            var funcId = node.parent.getParent().getIdentifier();
            if (funcId) {
                var functionSymbol = this.internalFindSymbol(funcId, [ReferenceType.Function]);
                if (functionSymbol) {
                    scopeNode = functionSymbol.node.getDeclarations();
                }
            }
        }
        if (!scopeNode) {
            return null;
        }
        var name = node.getText();
        var scope = this.global.findScope(scopeNode.offset, scopeNode.length);
        while (scope) {
            for (var index = 0; index < referenceTypes.length; index++) {
                var type = referenceTypes[index];
                var symbol = scope.getSymbol(name, type);
                if (symbol) {
                    return symbol;
                }
            }
            scope = scope.parent;
        }
        return null;
    };
    Symbols.prototype.evaluateReferenceTypes = function (node) {
        if (node instanceof Identifier) {
            var referenceTypes = node.referenceTypes;
            if (referenceTypes) {
                return referenceTypes;
            }
            else {
                if (node.isCustomProperty) {
                    return [ReferenceType.Variable];
                }
                // are a reference to a keyframe?
                var decl = getParentDeclaration(node);
                if (decl) {
                    var propertyName = decl.getNonPrefixedPropertyName();
                    if ((propertyName === 'animation' || propertyName === 'animation-name')
                        && decl.getValue() && decl.getValue().offset === node.offset) {
                        return [ReferenceType.Keyframe];
                    }
                }
            }
        }
        else if (node instanceof Variable) {
            return [ReferenceType.Variable];
        }
        var selector = node.findParent(NodeType.Selector);
        if (selector) {
            return [ReferenceType.Rule];
        }
        var extendsRef = node.findParent(NodeType.ExtendsReference);
        if (extendsRef) {
            return [ReferenceType.Rule];
        }
        return null;
    };
    Symbols.prototype.findSymbolFromNode = function (node) {
        if (!node) {
            return null;
        }
        while (node.type === NodeType.Interpolation) {
            node = node.getParent();
        }
        var referenceTypes = this.evaluateReferenceTypes(node);
        if (referenceTypes) {
            return this.internalFindSymbol(node, referenceTypes);
        }
        return null;
    };
    Symbols.prototype.matchesSymbol = function (node, symbol) {
        if (!node) {
            return null;
        }
        while (node.type === NodeType.Interpolation) {
            node = node.getParent();
        }
        if (symbol.name.length !== node.length || symbol.name !== node.getText()) {
            return false;
        }
        var referenceTypes = this.evaluateReferenceTypes(node);
        if (!referenceTypes || referenceTypes.indexOf(symbol.type) === -1) {
            return false;
        }
        var nodeSymbol = this.internalFindSymbol(node, referenceTypes);
        return nodeSymbol === symbol;
    };
    Symbols.prototype.findSymbol = function (name, type, offset) {
        var scope = this.global.findScope(offset);
        while (scope) {
            var symbol = scope.getSymbol(name, type);
            if (symbol) {
                return symbol;
            }
            scope = scope.parent;
        }
        return null;
    };
    return Symbols;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function startsWith(haystack, needle) {
    if (haystack.length < needle.length) {
        return false;
    }
    for (var i = 0; i < needle.length; i++) {
        if (haystack[i] !== needle[i]) {
            return false;
        }
    }
    return true;
}
/**
 * Determines if haystack ends with needle.
 */
function endsWith(haystack, needle) {
    var diff = haystack.length - needle.length;
    if (diff > 0) {
        return haystack.lastIndexOf(needle) === diff;
    }
    else if (diff === 0) {
        return haystack === needle;
    }
    else {
        return false;
    }
}
/**
 * Computes the difference score for two strings. More similar strings have a higher score.
 * We use largest common subsequence dynamic programming approach but penalize in the end for length differences.
 * Strings that have a large length difference will get a bad default score 0.
 * Complexity - both time and space O(first.length * second.length)
 * Dynamic programming LCS computation http://en.wikipedia.org/wiki/Longest_common_subsequence_problem
 *
 * @param first a string
 * @param second a string
 */
function difference(first, second, maxLenDelta) {
    if (maxLenDelta === void 0) { maxLenDelta = 4; }
    var lengthDifference = Math.abs(first.length - second.length);
    // We only compute score if length of the currentWord and length of entry.name are similar.
    if (lengthDifference > maxLenDelta) {
        return 0;
    }
    // Initialize LCS (largest common subsequence) matrix.
    var LCS = [];
    var zeroArray = [];
    var i, j;
    for (i = 0; i < second.length + 1; ++i) {
        zeroArray.push(0);
    }
    for (i = 0; i < first.length + 1; ++i) {
        LCS.push(zeroArray);
    }
    for (i = 1; i < first.length + 1; ++i) {
        for (j = 1; j < second.length + 1; ++j) {
            if (first[i - 1] === second[j - 1]) {
                LCS[i][j] = LCS[i - 1][j - 1] + 1;
            }
            else {
                LCS[i][j] = Math.max(LCS[i - 1][j], LCS[i][j - 1]);
            }
        }
    }
    return LCS[first.length][second.length] - Math.sqrt(lengthDifference);
}
/**
 * Limit of string length.
 */
function getLimitedString(str, ellipsis) {
    if (ellipsis === void 0) { ellipsis = true; }
    if (!str) {
        return '';
    }
    if (str.length < 140) {
        return str;
    }
    return str.slice(0, 140) + (ellipsis ? '\u2026' : '');
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var localize$3 = loadMessageBundle();
var SnippetFormat = InsertTextFormat.Snippet;
var CSSCompletion = /** @class */ (function () {
    function CSSCompletion(variablePrefix) {
        if (variablePrefix === void 0) { variablePrefix = null; }
        this.completionParticipants = [];
        this.valueTypes = [
            NodeType.Identifier, NodeType.Value, NodeType.StringLiteral, NodeType.URILiteral, NodeType.NumericValue,
            NodeType.HexColorValue, NodeType.VariableName, NodeType.Prio
        ];
        this.variablePrefix = variablePrefix;
    }
    CSSCompletion.prototype.getSymbolContext = function () {
        if (!this.symbolContext) {
            this.symbolContext = new Symbols(this.styleSheet);
        }
        return this.symbolContext;
    };
    CSSCompletion.prototype.setCompletionParticipants = function (registeredCompletionParticipants) {
        this.completionParticipants = registeredCompletionParticipants || [];
    };
    CSSCompletion.prototype.doComplete = function (document, position, styleSheet) {
        this.offset = document.offsetAt(position);
        this.position = position;
        this.currentWord = getCurrentWord(document, this.offset);
        this.defaultReplaceRange = Range.create(Position.create(this.position.line, this.position.character - this.currentWord.length), this.position);
        this.textDocument = document;
        this.styleSheet = styleSheet;
        try {
            var result = { isIncomplete: false, items: [] };
            this.nodePath = getNodePath(this.styleSheet, this.offset);
            for (var i = this.nodePath.length - 1; i >= 0; i--) {
                var node = this.nodePath[i];
                if (node instanceof Property) {
                    this.getCompletionsForDeclarationProperty(node.getParent(), result);
                }
                else if (node instanceof Expression) {
                    this.getCompletionsForExpression(node, result);
                }
                else if (node instanceof SimpleSelector) {
                    var parentExtRef = node.findParent(NodeType.ExtendsReference);
                    if (parentExtRef) {
                        this.getCompletionsForExtendsReference(parentExtRef, node, result);
                    }
                    else {
                        var parentRuleSet = node.findParent(NodeType.Ruleset);
                        this.getCompletionsForSelector(parentRuleSet, parentRuleSet && parentRuleSet.isNested(), result);
                    }
                }
                else if (node instanceof FunctionArgument) {
                    this.getCompletionsForFunctionArgument(node, node.getParent(), result);
                }
                else if (node instanceof Declarations) {
                    this.getCompletionsForDeclarations(node, result);
                }
                else if (node instanceof VariableDeclaration) {
                    this.getCompletionsForVariableDeclaration(node, result);
                }
                else if (node instanceof RuleSet) {
                    this.getCompletionsForRuleSet(node, result);
                }
                else if (node instanceof Interpolation) {
                    this.getCompletionsForInterpolation(node, result);
                }
                else if (node instanceof FunctionDeclaration) {
                    this.getCompletionsForFunctionDeclaration(node, result);
                }
                else if (node instanceof MixinReference) {
                    this.getCompletionsForMixinReference(node, result);
                }
                else if (node instanceof Function$1) {
                    this.getCompletionsForFunctionArgument(null, node, result);
                }
                else if (node instanceof Supports) {
                    this.getCompletionsForSupports(node, result);
                }
                else if (node instanceof SupportsCondition) {
                    this.getCompletionsForSupportsCondition(node, result);
                }
                else if (node instanceof ExtendsReference) {
                    this.getCompletionsForExtendsReference(node, null, result);
                }
                if (result.items.length > 0) {
                    return this.finalize(result);
                }
            }
            this.getCompletionsForStylesheet(result);
            if (result.items.length === 0) {
                if (this.variablePrefix && this.currentWord.indexOf(this.variablePrefix) === 0) {
                    this.getVariableProposals(null, result);
                }
            }
            return this.finalize(result);
        }
        finally {
            // don't hold on any state, clear symbolContext
            this.position = null;
            this.currentWord = null;
            this.textDocument = null;
            this.styleSheet = null;
            this.symbolContext = null;
            this.defaultReplaceRange = null;
            this.nodePath = null;
        }
    };
    CSSCompletion.prototype.finalize = function (result) {
        var needsSortText = result.items.some(function (i) { return !!i.sortText; });
        if (needsSortText) {
            for (var _i = 0, _a = result.items; _i < _a.length; _i++) {
                var i = _a[_i];
                if (!i.sortText) {
                    i.sortText = 'd';
                }
            }
        }
        return result;
    };
    CSSCompletion.prototype.findInNodePath = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        for (var i = this.nodePath.length - 1; i >= 0; i--) {
            var node = this.nodePath[i];
            if (types.indexOf(node.type) !== -1) {
                return node;
            }
        }
        return null;
    };
    CSSCompletion.prototype.getCompletionsForDeclarationProperty = function (declaration, result) {
        return this.getPropertyProposals(declaration, result);
    };
    CSSCompletion.prototype.getPropertyProposals = function (declaration, result) {
        var _this = this;
        var properties = getProperties();
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                var entry = properties[key];
                if (entry.browsers.onCodeComplete) {
                    var range = void 0;
                    var insertText = void 0;
                    if (declaration) {
                        range = this.getCompletionRange(declaration.getProperty());
                        insertText = entry.name + (!isDefined(declaration.colonPosition) ? ': ' : '');
                    }
                    else {
                        range = this.getCompletionRange(null);
                        insertText = entry.name + ': ';
                    }
                    var item = {
                        label: entry.name,
                        documentation: getEntryDescription(entry),
                        textEdit: TextEdit.replace(range, insertText),
                        kind: CompletionItemKind.Property,
                        command: {
                            title: 'Suggest',
                            command: 'editor.action.triggerSuggest'
                        }
                    };
                    if (startsWith(entry.name, '-')) {
                        item.sortText = 'x';
                    }
                    result.items.push(item);
                }
            }
        }
        this.completionParticipants.forEach(function (participant) {
            participant.onCssProperty({
                propertyName: _this.currentWord,
                range: _this.defaultReplaceRange
            });
        });
        return result;
    };
    CSSCompletion.prototype.getCompletionsForDeclarationValue = function (node, result) {
        var _this = this;
        var propertyName = node.getFullPropertyName();
        var entry = getProperties()[propertyName];
        var existingNode = node.getValue();
        while (existingNode && existingNode.hasChildren()) {
            existingNode = existingNode.findChildAtOffset(this.offset, false);
        }
        this.completionParticipants.forEach(function (participant) {
            participant.onCssPropertyValue({
                propertyName: propertyName,
                propertyValue: _this.currentWord,
                range: _this.getCompletionRange(existingNode)
            });
        });
        if (entry) {
            for (var _i = 0, _a = entry.restrictions; _i < _a.length; _i++) {
                var restriction = _a[_i];
                switch (restriction) {
                    case 'color':
                        this.getColorProposals(entry, existingNode, result);
                        break;
                    case 'position':
                        this.getPositionProposals(entry, existingNode, result);
                        break;
                    case 'repeat':
                        this.getRepeatStyleProposals(entry, existingNode, result);
                        break;
                    case 'line-style':
                        this.getLineStyleProposals(entry, existingNode, result);
                        break;
                    case 'line-width':
                        this.getLineWidthProposals(entry, existingNode, result);
                        break;
                    case 'geometry-box':
                        this.getGeometryBoxProposals(entry, existingNode, result);
                        break;
                    case 'box':
                        this.getBoxProposals(entry, existingNode, result);
                        break;
                    case 'image':
                        this.getImageProposals(entry, existingNode, result);
                        break;
                    case 'timing-function':
                        this.getTimingFunctionProposals(entry, existingNode, result);
                        break;
                    case 'shape':
                        this.getBasicShapeProposals(entry, existingNode, result);
                        break;
                }
            }
            this.getValueEnumProposals(entry, existingNode, result);
            this.getCSSWideKeywordProposals(entry, existingNode, result);
            this.getUnitProposals(entry, existingNode, result);
        }
        else {
            var existingValues = collectValues(this.styleSheet, node);
            for (var _b = 0, _c = existingValues.getEntries(); _b < _c.length; _b++) {
                var existingValue = _c[_b];
                result.items.push({
                    label: existingValue,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), existingValue),
                    kind: CompletionItemKind.Value
                });
            }
        }
        this.getVariableProposals(existingNode, result);
        this.getTermProposals(entry, existingNode, result);
        return result;
    };
    CSSCompletion.prototype.getValueEnumProposals = function (entry, existingNode, result) {
        if (entry.values) {
            for (var _i = 0, _a = entry.values; _i < _a.length; _i++) {
                var value = _a[_i];
                if (isCommonValue(value)) {
                    var insertString = value.name;
                    var insertTextFormat = void 0;
                    if (endsWith(insertString, ')')) {
                        var from = insertString.lastIndexOf('(');
                        if (from !== -1) {
                            insertString = insertString.substr(0, from) + '($1)';
                            insertTextFormat = SnippetFormat;
                        }
                    }
                    var item = {
                        label: value.name,
                        documentation: getEntryDescription(value),
                        textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertString),
                        kind: CompletionItemKind.Value,
                        insertTextFormat: insertTextFormat
                    };
                    result.items.push(item);
                }
            }
        }
        return result;
    };
    CSSCompletion.prototype.getCSSWideKeywordProposals = function (entry, existingNode, result) {
        for (var keywords in cssWideKeywords) {
            result.items.push({
                label: keywords,
                documentation: cssWideKeywords[keywords],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), keywords),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForInterpolation = function (node, result) {
        if (this.offset >= node.offset + 2) {
            this.getVariableProposals(null, result);
        }
        return result;
    };
    CSSCompletion.prototype.getVariableProposals = function (existingNode, result) {
        var symbols = this.getSymbolContext().findSymbolsAtOffset(this.offset, ReferenceType.Variable);
        for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
            var symbol = symbols_1[_i];
            var insertText = startsWith(symbol.name, '--') ? "var(" + symbol.name + ")" : symbol.name;
            var suggest = {
                label: symbol.name,
                documentation: symbol.value ? getLimitedString(symbol.value) : symbol.value,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                kind: CompletionItemKind.Variable,
                sortText: 'z'
            };
            if (symbol.node.type === NodeType.FunctionParameter) {
                var mixinNode = (symbol.node.getParent());
                if (mixinNode.type === NodeType.MixinDeclaration) {
                    suggest.detail = localize$3('completion.argument', 'argument from \'{0}\'', mixinNode.getName());
                }
            }
            result.items.push(suggest);
        }
        return result;
    };
    CSSCompletion.prototype.getVariableProposalsForCSSVarFunction = function (result) {
        var symbols = this.getSymbolContext().findSymbolsAtOffset(this.offset, ReferenceType.Variable);
        symbols = symbols.filter(function (symbol) {
            return startsWith(symbol.name, '--');
        });
        for (var _i = 0, symbols_2 = symbols; _i < symbols_2.length; _i++) {
            var symbol = symbols_2[_i];
            result.items.push({
                label: symbol.name,
                documentation: symbol.value ? getLimitedString(symbol.value) : symbol.value,
                textEdit: TextEdit.replace(this.getCompletionRange(null), symbol.name),
                kind: CompletionItemKind.Variable
            });
        }
        return result;
    };
    CSSCompletion.prototype.getUnitProposals = function (entry, existingNode, result) {
        var currentWord = '0';
        if (this.currentWord.length > 0) {
            var numMatch = this.currentWord.match(/^-?\d[\.\d+]*/);
            if (numMatch) {
                currentWord = numMatch[0];
                result.isIncomplete = currentWord.length === this.currentWord.length;
            }
        }
        else if (this.currentWord.length === 0) {
            result.isIncomplete = true;
        }
        if (existingNode && existingNode.parent && existingNode.parent.type === NodeType.Term) {
            existingNode = existingNode.getParent(); // include the unary operator
        }
        for (var _i = 0, _a = entry.restrictions; _i < _a.length; _i++) {
            var restriction = _a[_i];
            var units$$1 = units[restriction];
            if (units$$1) {
                for (var _b = 0, units_1 = units$$1; _b < units_1.length; _b++) {
                    var unit = units_1[_b];
                    var insertText = currentWord + unit;
                    result.items.push({
                        label: insertText,
                        textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                        kind: CompletionItemKind.Unit
                    });
                }
            }
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionRange = function (existingNode) {
        if (existingNode && existingNode.offset <= this.offset) {
            var end = existingNode.end !== -1 ? this.textDocument.positionAt(existingNode.end) : this.position;
            return Range.create(this.textDocument.positionAt(existingNode.offset), end);
        }
        return this.defaultReplaceRange;
    };
    CSSCompletion.prototype.getColorProposals = function (entry, existingNode, result) {
        for (var color in colors) {
            result.items.push({
                label: color,
                documentation: colors[color],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), color),
                kind: CompletionItemKind.Color
            });
        }
        for (var color in colorKeywords) {
            result.items.push({
                label: color,
                documentation: colorKeywords[color],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), color),
                kind: CompletionItemKind.Value
            });
        }
        var colorValues = new Set$1();
        this.styleSheet.acceptVisitor(new ColorValueCollector(colorValues));
        for (var _i = 0, _a = colorValues.getEntries(); _i < _a.length; _i++) {
            var color = _a[_i];
            result.items.push({
                label: color,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), color),
                kind: CompletionItemKind.Color
            });
        }
        var _loop_1 = function (p) {
            var tabStop = 1;
            var replaceFunction = function (match, p1) { return '${' + tabStop++ + ':' + p1 + '}'; };
            var insertText = p.func.replace(/\[?\$(\w+)\]?/g, replaceFunction);
            result.items.push({
                label: p.func.substr(0, p.func.indexOf('(')),
                detail: p.func,
                documentation: p.desc,
                textEdit: TextEdit.replace(this_1.getCompletionRange(existingNode), insertText),
                insertTextFormat: SnippetFormat,
                kind: CompletionItemKind.Function
            });
        };
        var this_1 = this;
        for (var _b = 0, _c = colorFunctions; _b < _c.length; _b++) {
            var p = _c[_b];
            _loop_1(p);
        }
        return result;
    };
    CSSCompletion.prototype.getPositionProposals = function (entry, existingNode, result) {
        for (var position in positionKeywords) {
            result.items.push({
                label: position,
                documentation: positionKeywords[position],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), position),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getRepeatStyleProposals = function (entry, existingNode, result) {
        for (var repeat in repeatStyleKeywords) {
            result.items.push({
                label: repeat,
                documentation: repeatStyleKeywords[repeat],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), repeat),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getLineStyleProposals = function (entry, existingNode, result) {
        for (var lineStyle in lineStyleKeywords) {
            result.items.push({
                label: lineStyle,
                documentation: lineStyleKeywords[lineStyle],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), lineStyle),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getLineWidthProposals = function (entry, existingNode, result) {
        for (var _i = 0, _a = lineWidthKeywords; _i < _a.length; _i++) {
            var lineWidth = _a[_i];
            result.items.push({
                label: lineWidth,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), lineWidth),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getGeometryBoxProposals = function (entry, existingNode, result) {
        for (var box in geometryBoxKeywords) {
            result.items.push({
                label: box,
                documentation: geometryBoxKeywords[box],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), box),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getBoxProposals = function (entry, existingNode, result) {
        for (var box in boxKeywords) {
            result.items.push({
                label: box,
                documentation: boxKeywords[box],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), box),
                kind: CompletionItemKind.Value
            });
        }
        return result;
    };
    CSSCompletion.prototype.getImageProposals = function (entry, existingNode, result) {
        for (var image in imageFunctions) {
            var insertText = moveCursorInsideParenthesis(image);
            result.items.push({
                label: image,
                documentation: imageFunctions[image],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                kind: CompletionItemKind.Function,
                insertTextFormat: image !== insertText ? SnippetFormat : void 0
            });
        }
        return result;
    };
    CSSCompletion.prototype.getTimingFunctionProposals = function (entry, existingNode, result) {
        for (var timing in transitionTimingFunctions) {
            var insertText = moveCursorInsideParenthesis(timing);
            result.items.push({
                label: timing,
                documentation: transitionTimingFunctions[timing],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                kind: CompletionItemKind.Function,
                insertTextFormat: timing !== insertText ? SnippetFormat : void 0
            });
        }
        return result;
    };
    CSSCompletion.prototype.getBasicShapeProposals = function (entry, existingNode, result) {
        for (var shape in basicShapeFunctions) {
            var insertText = moveCursorInsideParenthesis(shape);
            result.items.push({
                label: shape,
                documentation: basicShapeFunctions[shape],
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                kind: CompletionItemKind.Function,
                insertTextFormat: shape !== insertText ? SnippetFormat : void 0
            });
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForStylesheet = function (result) {
        var node = this.styleSheet.findFirstChildBeforeOffset(this.offset);
        if (!node) {
            return this.getCompletionForTopLevel(result);
        }
        if (node instanceof RuleSet) {
            return this.getCompletionsForRuleSet(node, result);
        }
        if (node instanceof Supports) {
            return this.getCompletionsForSupports(node, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionForTopLevel = function (result) {
        for (var _i = 0, _a = getAtDirectives(); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.browsers.count > 0) {
                result.items.push({
                    label: entry.name,
                    textEdit: TextEdit.replace(this.getCompletionRange(null), entry.name),
                    documentation: getEntryDescription(entry),
                    kind: CompletionItemKind.Keyword
                });
            }
        }
        this.getCompletionsForSelector(null, false, result);
        return result;
    };
    CSSCompletion.prototype.getCompletionsForRuleSet = function (ruleSet, result) {
        var declarations = ruleSet.getDeclarations();
        var isAfter = declarations && declarations.endsWith('}') && this.offset >= declarations.end;
        if (isAfter) {
            return this.getCompletionForTopLevel(result);
        }
        var isInSelectors = !declarations || this.offset <= declarations.offset;
        if (isInSelectors) {
            return this.getCompletionsForSelector(ruleSet, ruleSet.isNested(), result);
        }
        ruleSet.findParent(NodeType.Ruleset);
        return this.getCompletionsForDeclarations(ruleSet.getDeclarations(), result);
    };
    CSSCompletion.prototype.getCompletionsForSelector = function (ruleSet, isNested, result) {
        var _this = this;
        var existingNode = this.findInNodePath(NodeType.PseudoSelector, NodeType.IdentifierSelector, NodeType.ClassSelector, NodeType.ElementNameSelector);
        if (!existingNode && this.offset - this.currentWord.length > 0 && this.textDocument.getText()[this.offset - this.currentWord.length - 1] === ':') {
            // after the ':' of a pseudo selector, no node generated for just ':'
            this.currentWord = ':' + this.currentWord;
            this.defaultReplaceRange = Range.create(Position.create(this.position.line, this.position.character - this.currentWord.length), this.position);
        }
        for (var _i = 0, _a = getPseudoClasses(); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (entry.browsers.onCodeComplete) {
                var insertText = moveCursorInsideParenthesis(entry.name);
                var item = {
                    label: entry.name,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                    documentation: getEntryDescription(entry),
                    kind: CompletionItemKind.Function,
                    insertTextFormat: entry.name !== insertText ? SnippetFormat : void 0
                };
                if (startsWith(entry.name, ':-')) {
                    item.sortText = 'x';
                }
                result.items.push(item);
            }
        }
        for (var _b = 0, _c = getPseudoElements(); _b < _c.length; _b++) {
            var entry = _c[_b];
            if (entry.browsers.onCodeComplete) {
                var insertText = moveCursorInsideParenthesis(entry.name);
                var item = {
                    label: entry.name,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                    documentation: getEntryDescription(entry),
                    kind: CompletionItemKind.Function,
                    insertTextFormat: entry.name !== insertText ? SnippetFormat : void 0
                };
                if (startsWith(entry.name, '::-')) {
                    item.sortText = 'x';
                }
                result.items.push(item);
            }
        }
        if (!isNested) {
            for (var _d = 0, _e = html5Tags; _d < _e.length; _d++) {
                var entry = _e[_d];
                result.items.push({
                    label: entry,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), entry),
                    kind: CompletionItemKind.Keyword
                });
            }
            for (var _f = 0, _g = svgElements; _f < _g.length; _f++) {
                var entry = _g[_f];
                result.items.push({
                    label: entry,
                    textEdit: TextEdit.replace(this.getCompletionRange(existingNode), entry),
                    kind: CompletionItemKind.Keyword
                });
            }
        }
        var visited = {};
        visited[this.currentWord] = true;
        var textProvider = this.styleSheet.getTextProvider();
        this.styleSheet.accept(function (n) {
            if (n.type === NodeType.SimpleSelector && n.length > 0) {
                var selector = textProvider(n.offset, n.length);
                if (selector.charAt(0) === '.' && !visited[selector]) {
                    visited[selector] = true;
                    result.items.push({
                        label: selector,
                        textEdit: TextEdit.replace(_this.getCompletionRange(existingNode), selector),
                        kind: CompletionItemKind.Keyword
                    });
                }
                return false;
            }
            return true;
        });
        if (ruleSet && ruleSet.isNested()) {
            var selector = ruleSet.getSelectors().findFirstChildBeforeOffset(this.offset);
            if (selector && ruleSet.getSelectors().getChildren().indexOf(selector) === 0) {
                this.getPropertyProposals(null, result);
            }
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForDeclarations = function (declarations, result) {
        if (!declarations || this.offset === declarations.offset) {
            return result;
        }
        var node = declarations.findFirstChildBeforeOffset(this.offset);
        if (!node) {
            return this.getCompletionsForDeclarationProperty(null, result);
        }
        if (node instanceof AbstractDeclaration) {
            var declaration = node;
            if (!isDefined(declaration.colonPosition) || this.offset <= declaration.colonPosition) {
                // complete property
                return this.getCompletionsForDeclarationProperty(declaration, result);
            }
            else if ((isDefined(declaration.semicolonPosition) && declaration.semicolonPosition < this.offset)) {
                if (this.offset === declaration.semicolonPosition + 1) {
                    return result; // don't show new properties right after semicolon (see Bug 15421:[intellisense] [css] Be less aggressive when manually typing CSS)
                }
                // complete next property
                return this.getCompletionsForDeclarationProperty(null, result);
            }
            if (declaration instanceof Declaration) {
                // complete value
                return this.getCompletionsForDeclarationValue(declaration, result);
            }
        }
        else if (node instanceof ExtendsReference) {
            this.getCompletionsForExtendsReference(node, null, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForVariableDeclaration = function (declaration, result) {
        if (this.offset > declaration.colonPosition) {
            this.getVariableProposals(declaration.getValue(), result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForExpression = function (expression, result) {
        if (expression.getParent() instanceof FunctionArgument) {
            this.getCompletionsForFunctionArgument(expression.getParent(), expression.getParent().getParent(), result);
            return result;
        }
        var declaration = expression.findParent(NodeType.Declaration);
        if (!declaration) {
            this.getTermProposals(null, null, result);
            return result;
        }
        var node = expression.findChildAtOffset(this.offset, true);
        if (!node) {
            return this.getCompletionsForDeclarationValue(declaration, result);
        }
        if (node instanceof NumericValue || node instanceof Identifier) {
            return this.getCompletionsForDeclarationValue(declaration, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForFunctionArgument = function (arg, func, result) {
        if (func.getIdentifier().getText() === 'var') {
            if (!func.getArguments().hasChildren() || func.getArguments().getChild(0) === arg) {
                this.getVariableProposalsForCSSVarFunction(result);
            }
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForFunctionDeclaration = function (decl, result) {
        var declarations = decl.getDeclarations();
        if (declarations && this.offset > declarations.offset && this.offset < declarations.end) {
            this.getTermProposals(null, null, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForMixinReference = function (ref, result) {
        var allMixins = this.getSymbolContext().findSymbolsAtOffset(this.offset, ReferenceType.Mixin);
        for (var _i = 0, allMixins_1 = allMixins; _i < allMixins_1.length; _i++) {
            var mixinSymbol = allMixins_1[_i];
            if (mixinSymbol.node instanceof MixinDeclaration) {
                result.items.push(this.makeTermProposal(mixinSymbol, mixinSymbol.node.getParameters(), null));
            }
        }
        return result;
    };
    CSSCompletion.prototype.getTermProposals = function (entry, existingNode, result) {
        var allFunctions = this.getSymbolContext().findSymbolsAtOffset(this.offset, ReferenceType.Function);
        for (var _i = 0, allFunctions_1 = allFunctions; _i < allFunctions_1.length; _i++) {
            var functionSymbol = allFunctions_1[_i];
            if (functionSymbol.node instanceof FunctionDeclaration) {
                result.items.push(this.makeTermProposal(functionSymbol, functionSymbol.node.getParameters(), existingNode));
            }
        }
        return result;
    };
    CSSCompletion.prototype.makeTermProposal = function (symbol, parameters, existingNode) {
        var decl = symbol.node;
        var params = parameters.getChildren().map(function (c) {
            return (c instanceof FunctionParameter) ? c.getName() : c.getText();
        });
        var insertText = symbol.name + '(' + params.map(function (p, index) { return '${' + (index + 1) + ':' + p + '}'; }).join(', ') + ')';
        return {
            label: symbol.name,
            detail: symbol.name + '(' + params.join(', ') + ')',
            textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
            insertTextFormat: SnippetFormat,
            kind: CompletionItemKind.Function,
            sortText: 'z'
        };
    };
    CSSCompletion.prototype.getCompletionsForSupportsCondition = function (supportsCondition, result) {
        var child = supportsCondition.findFirstChildBeforeOffset(this.offset);
        if (child) {
            if (child instanceof Declaration) {
                if (!isDefined(child.colonPosition || this.offset <= child.colonPosition)) {
                    return this.getCompletionsForDeclarationProperty(child, result);
                }
                else {
                    return this.getCompletionsForDeclarationValue(child, result);
                }
            }
            else if (child instanceof SupportsCondition) {
                return this.getCompletionsForSupportsCondition(child, result);
            }
        }
        if (isDefined(supportsCondition.lParent) && this.offset > supportsCondition.lParent && (!isDefined(supportsCondition.rParent) || this.offset <= supportsCondition.rParent)) {
            return this.getCompletionsForDeclarationProperty(null, result);
        }
        return result;
    };
    CSSCompletion.prototype.getCompletionsForSupports = function (supports, result) {
        var declarations = supports.getDeclarations();
        var inInCondition = !declarations || this.offset <= declarations.offset;
        if (inInCondition) {
            var child = supports.findFirstChildBeforeOffset(this.offset);
            if (child instanceof SupportsCondition) {
                return this.getCompletionsForSupportsCondition(child, result);
            }
            return result;
        }
        return this.getCompletionForTopLevel(result);
    };
    CSSCompletion.prototype.getCompletionsForExtendsReference = function (extendsRef, existingNode, result) {
        return result;
    };
    return CSSCompletion;
}());
var Set$1 = /** @class */ (function () {
    function Set() {
        this.entries = {};
    }
    Set.prototype.add = function (entry) {
        this.entries[entry] = true;
    };
    Set.prototype.getEntries = function () {
        return Object.keys(this.entries);
    };
    return Set;
}());
function moveCursorInsideParenthesis(text) {
    return text.replace(/\(\)$/, "($1)");
}
function collectValues(styleSheet, declaration) {
    var fullPropertyName = declaration.getFullPropertyName();
    var entries = new Set$1();
    function visitValue(node) {
        if (node instanceof Identifier || node instanceof NumericValue || node instanceof HexColorValue) {
            entries.add(node.getText());
        }
        return true;
    }
    function matchesProperty(decl) {
        var propertyName = decl.getFullPropertyName();
        return fullPropertyName === propertyName;
    }
    function vistNode(node) {
        if (node instanceof Declaration && node !== declaration) {
            if (matchesProperty(node)) {
                var value = node.getValue();
                if (value) {
                    value.accept(visitValue);
                }
            }
        }
        return true;
    }
    styleSheet.accept(vistNode);
    return entries;
}
var ColorValueCollector = /** @class */ (function () {
    function ColorValueCollector(entries) {
        this.entries = entries;
        // nothing to do
    }
    ColorValueCollector.prototype.visitNode = function (node) {
        if (node instanceof HexColorValue || (node instanceof Function$1 && isColorConstructor(node))) {
            this.entries.add(node.getText());
        }
        return true;
    };
    return ColorValueCollector;
}());
function isDefined(obj) {
    return typeof obj !== 'undefined';
}
function getCurrentWord(document, offset) {
    var i = offset - 1;
    var text = document.getText();
    while (i >= 0 && ' \t\n\r":{[()]},*>+'.indexOf(text.charAt(i)) === -1) {
        i--;
    }
    return text.substring(i + 1, offset);
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Element = /** @class */ (function () {
    function Element() {
    }
    Element.prototype.findAttribute = function (name) {
        if (this.attributes) {
            for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
                var attribute = _a[_i];
                if (attribute.name === name) {
                    return attribute.value;
                }
            }
        }
        return null;
    };
    Element.prototype.addChild = function (child) {
        if (child instanceof Element) {
            child.parent = this;
        }
        if (!this.children) {
            this.children = [];
        }
        this.children.push(child);
    };
    Element.prototype.append = function (text) {
        if (this.attributes) {
            var last = this.attributes[this.attributes.length - 1];
            last.value = last.value + text;
        }
    };
    Element.prototype.prepend = function (text) {
        if (this.attributes) {
            var first = this.attributes[0];
            first.value = text + first.value;
        }
    };
    Element.prototype.findRoot = function () {
        var curr = this;
        while (curr.parent && !(curr.parent instanceof RootElement)) {
            curr = curr.parent;
        }
        return curr;
    };
    Element.prototype.removeChild = function (child) {
        if (this.children) {
            var index = this.children.indexOf(child);
            if (index !== -1) {
                this.children.splice(index, 1);
                return true;
            }
        }
        return false;
    };
    Element.prototype.addAttr = function (name, value) {
        if (!this.attributes) {
            this.attributes = [];
        }
        for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
            var attribute = _a[_i];
            if (attribute.name === name) {
                attribute.value += ' ' + value;
                return;
            }
        }
        this.attributes.push({ name: name, value: value });
    };
    Element.prototype.clone = function (cloneChildren) {
        if (cloneChildren === void 0) { cloneChildren = true; }
        var elem = new Element();
        if (this.attributes) {
            elem.attributes = [];
            for (var _i = 0, _a = this.attributes; _i < _a.length; _i++) {
                var attribute = _a[_i];
                elem.addAttr(attribute.name, attribute.value);
            }
        }
        if (cloneChildren && this.children) {
            elem.children = [];
            for (var index = 0; index < this.children.length; index++) {
                elem.addChild(this.children[index].clone());
            }
        }
        return elem;
    };
    Element.prototype.cloneWithParent = function () {
        var clone = this.clone(false);
        if (this.parent && !(this.parent instanceof RootElement)) {
            var parentClone = this.parent.cloneWithParent();
            parentClone.addChild(clone);
        }
        return clone;
    };
    return Element;
}());
var RootElement = /** @class */ (function (_super) {
    __extends$2(RootElement, _super);
    function RootElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RootElement;
}(Element));
var LabelElement = /** @class */ (function (_super) {
    __extends$2(LabelElement, _super);
    function LabelElement(label) {
        var _this = _super.call(this) || this;
        _this.addAttr('name', label);
        return _this;
    }
    return LabelElement;
}(Element));
var MarkedStringPrinter = /** @class */ (function () {
    function MarkedStringPrinter(quote) {
        this.quote = quote;
        // empty
    }
    MarkedStringPrinter.prototype.print = function (element) {
        this.result = [];
        if (element instanceof RootElement) {
            this.doPrint(element.children, 0);
        }
        else {
            this.doPrint([element], 0);
        }
        var value = this.result.join('\n');
        return [{ language: 'html', value: value }];
    };
    MarkedStringPrinter.prototype.doPrint = function (elements, indent) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            this.doPrintElement(element, indent);
            if (element.children) {
                this.doPrint(element.children, indent + 1);
            }
        }
    };
    MarkedStringPrinter.prototype.writeLine = function (level, content) {
        var indent = new Array(level + 1).join('  ');
        this.result.push(indent + content);
    };
    MarkedStringPrinter.prototype.doPrintElement = function (element, indent) {
        var name = element.findAttribute('name');
        // special case: a simple label
        if (element instanceof LabelElement || name === '\u2026') {
            this.writeLine(indent, name);
            return;
        }
        // the real deal
        var content = ['<'];
        // element name
        if (name) {
            content.push(name);
        }
        else {
            content.push('element');
        }
        // attributes
        if (element.attributes) {
            for (var _i = 0, _a = element.attributes; _i < _a.length; _i++) {
                var attr = _a[_i];
                if (attr.name !== 'name') {
                    content.push(' ');
                    content.push(attr.name);
                    var value = attr.value;
                    if (value) {
                        content.push('=');
                        content.push(quotes.ensure(value, this.quote));
                    }
                }
            }
        }
        content.push('>');
        this.writeLine(indent, content.join(''));
    };
    return MarkedStringPrinter;
}());
var quotes;
(function (quotes) {
    function ensure(value, which) {
        return which + remove(value) + which;
    }
    quotes.ensure = ensure;
    function remove(value) {
        var match = value.match(/^['"](.*)["']$/);
        if (match) {
            return match[1];
        }
        return value;
    }
    quotes.remove = remove;
})(quotes || (quotes = {}));
function toElement(node, parentElement) {
    var result = new Element();
    for (var _i = 0, _a = node.getChildren(); _i < _a.length; _i++) {
        var child = _a[_i];
        switch (child.type) {
            case NodeType.SelectorCombinator:
                if (parentElement) {
                    var segments = child.getText().split('&');
                    if (segments.length === 1) {
                        // should not happen
                        result.addAttr('name', segments[0]);
                        break;
                    }
                    result = parentElement.cloneWithParent();
                    if (segments[0]) {
                        var root = result.findRoot();
                        root.prepend(segments[0]);
                    }
                    for (var i = 1; i < segments.length; i++) {
                        if (i > 1) {
                            var clone = parentElement.cloneWithParent();
                            result.addChild(clone.findRoot());
                            result = clone;
                        }
                        result.append(segments[i]);
                    }
                }
                break;
            case NodeType.SelectorPlaceholder:
                if (child.getText() === '@at-root') {
                    return result;
                }
            // fall through
            case NodeType.ElementNameSelector:
                var text = child.getText();
                result.addAttr('name', text === '*' ? 'element' : unescape(text));
                break;
            case NodeType.ClassSelector:
                result.addAttr('class', unescape(child.getText().substring(1)));
                break;
            case NodeType.IdentifierSelector:
                result.addAttr('id', unescape(child.getText().substring(1)));
                break;
            case NodeType.MixinDeclaration:
                result.addAttr('class', child.getName());
                break;
            case NodeType.PseudoSelector:
                result.addAttr(unescape(child.getText()), '');
                break;
            case NodeType.AttributeSelector:
                var expr = child.getExpression();
                if (expr) {
                    var value = void 0;
                    if (expr.getRight()) {
                        switch (unescape(expr.getOperator().getText())) {
                            case '|=':
                                // excatly or followed by -words
                                value = quotes.remove(unescape(expr.getRight().getText())) + "-\u2026";
                                break;
                            case '^=':
                                // prefix
                                value = quotes.remove(unescape(expr.getRight().getText())) + "\u2026";
                                break;
                            case '$=':
                                // suffix
                                value = "\u2026" + quotes.remove(unescape(expr.getRight().getText()));
                                break;
                            case '~=':
                                // one of a list of words
                                value = " \u2026 " + quotes.remove(unescape(expr.getRight().getText())) + " \u2026 ";
                                break;
                            case '*=':
                                // substring
                                value = "\u2026" + quotes.remove(unescape(expr.getRight().getText())) + "\u2026";
                                break;
                            default:
                                value = quotes.remove(unescape(expr.getRight().getText()));
                                break;
                        }
                    }
                    result.addAttr(unescape(expr.getLeft().getText()), value);
                }
                break;
        }
    }
    return result;
}
function unescape(content) {
    var scanner = new Scanner();
    scanner.setSource(content);
    var token = scanner.scanUnquotedString();
    if (token) {
        return token.text;
    }
    return content;
}
function selectorToMarkedString(node) {
    var root = selectorToElement(node);
    return new MarkedStringPrinter('"').print(root);
}
function simpleSelectorToMarkedString(node) {
    var element = toElement(node);
    return new MarkedStringPrinter('"').print(element);
}
var SelectorElementBuilder = /** @class */ (function () {
    function SelectorElementBuilder(element) {
        this.prev = null;
        this.element = element;
    }
    SelectorElementBuilder.prototype.processSelector = function (selector) {
        var parentElement = null;
        if (!(this.element instanceof RootElement)) {
            if (selector.getChildren().some(function (c) { return c.hasChildren() && c.getChild(0).type === NodeType.SelectorCombinator; })) {
                var curr = this.element.findRoot();
                if (curr.parent instanceof RootElement) {
                    parentElement = this.element;
                    this.element = curr.parent;
                    this.element.removeChild(curr);
                    this.prev = null;
                }
            }
        }
        for (var _i = 0, _a = selector.getChildren(); _i < _a.length; _i++) {
            var selectorChild = _a[_i];
            if (selectorChild instanceof SimpleSelector) {
                if (this.prev instanceof SimpleSelector) {
                    var labelElement = new LabelElement('\u2026');
                    this.element.addChild(labelElement);
                    this.element = labelElement;
                }
                else if (this.prev && (this.prev.matches('+') || this.prev.matches('~'))) {
                    this.element = this.element.parent;
                }
                if (this.prev && this.prev.matches('~')) {
                    this.element.addChild(toElement(selectorChild));
                    this.element.addChild(new LabelElement('\u22EE'));
                }
                var thisElement = toElement(selectorChild, parentElement);
                var root = thisElement.findRoot();
                this.element.addChild(root);
                this.element = thisElement;
            }
            if (selectorChild instanceof SimpleSelector ||
                selectorChild.type === NodeType.SelectorCombinatorParent ||
                selectorChild.type === NodeType.SelectorCombinatorShadowPiercingDescendant ||
                selectorChild.type === NodeType.SelectorCombinatorSibling ||
                selectorChild.type === NodeType.SelectorCombinatorAllSiblings) {
                this.prev = selectorChild;
            }
        }
    };
    return SelectorElementBuilder;
}());
function isNewSelectorContext(node) {
    switch (node.type) {
        case NodeType.MixinDeclaration:
        case NodeType.Stylesheet:
            return true;
    }
    return false;
}
function selectorToElement(node) {
    if (node.matches('@at-root')) {
        return null;
    }
    var root = new RootElement();
    var parentRuleSets = [];
    if (node.getParent() instanceof RuleSet) {
        var parent = node.getParent().getParent(); // parent of the selector's ruleset
        while (parent && !isNewSelectorContext(parent)) {
            if (parent instanceof RuleSet) {
                if (parent.getSelectors().matches('@at-root')) {
                    break;
                }
                parentRuleSets.push(parent);
            }
            parent = parent.getParent();
        }
    }
    var builder = new SelectorElementBuilder(root);
    for (var i = parentRuleSets.length - 1; i >= 0; i--) {
        var selector = parentRuleSets[i].getSelectors().getChild(0);
        if (selector) {
            builder.processSelector(selector);
        }
    }
    builder.processSelector(node);
    return root;
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var CSSHover = /** @class */ (function () {
    function CSSHover() {
    }
    CSSHover.prototype.doHover = function (document, position, stylesheet) {
        function getRange(node) {
            return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
        }
        var offset = document.offsetAt(position);
        var nodepath = getNodePath(stylesheet, offset);
        for (var i = 0; i < nodepath.length; i++) {
            var node = nodepath[i];
            if (node instanceof Selector) {
                return {
                    contents: selectorToMarkedString(node),
                    range: getRange(node)
                };
            }
            if (node instanceof SimpleSelector) {
                return {
                    contents: simpleSelectorToMarkedString(node),
                    range: getRange(node)
                };
            }
            if (node instanceof Declaration) {
                var propertyName = node.getFullPropertyName();
                var entry = getProperties()[propertyName];
                if (entry) {
                    var contents = [];
                    if (entry.description) {
                        contents.push(MarkedString.fromPlainText(entry.description));
                    }
                    var browserLabel = getBrowserLabel(entry.browsers);
                    if (browserLabel) {
                        contents.push(MarkedString.fromPlainText(browserLabel));
                    }
                    if (contents.length) {
                        return {
                            contents: contents,
                            range: getRange(node)
                        };
                    }
                }
            }
        }
        return null;
    };
    return CSSHover;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var localize$4 = loadMessageBundle();
var CSSNavigation = /** @class */ (function () {
    function CSSNavigation() {
    }
    CSSNavigation.prototype.findDefinition = function (document, position, stylesheet) {
        var symbols = new Symbols(stylesheet);
        var offset = document.offsetAt(position);
        var node = getNodeAtOffset(stylesheet, offset);
        if (!node) {
            return null;
        }
        var symbol = symbols.findSymbolFromNode(node);
        if (!symbol) {
            return null;
        }
        return {
            uri: document.uri,
            range: getRange(symbol.node, document)
        };
    };
    CSSNavigation.prototype.findReferences = function (document, position, stylesheet) {
        var highlights = this.findDocumentHighlights(document, position, stylesheet);
        return highlights.map(function (h) {
            return {
                uri: document.uri,
                range: h.range
            };
        });
    };
    CSSNavigation.prototype.findDocumentHighlights = function (document, position, stylesheet) {
        var result = [];
        var offset = document.offsetAt(position);
        var node = getNodeAtOffset(stylesheet, offset);
        if (!node || node.type === NodeType.Stylesheet || node.type === NodeType.Declarations) {
            return result;
        }
        var symbols = new Symbols(stylesheet);
        var symbol = symbols.findSymbolFromNode(node);
        var name = node.getText();
        stylesheet.accept(function (candidate) {
            if (symbol) {
                if (symbols.matchesSymbol(candidate, symbol)) {
                    result.push({
                        kind: getHighlightKind(candidate),
                        range: getRange(candidate, document)
                    });
                    return false;
                }
            }
            else if (node.type === candidate.type && node.length === candidate.length && name === candidate.getText()) {
                // Same node type and data
                result.push({
                    kind: getHighlightKind(candidate),
                    range: getRange(candidate, document)
                });
            }
            return true;
        });
        return result;
    };
    CSSNavigation.prototype.findDocumentSymbols = function (document, stylesheet) {
        var result = [];
        stylesheet.accept(function (node) {
            var entry = {
                name: null,
                kind: SymbolKind.Class,
                location: null
            };
            var locationNode = node;
            if (node instanceof Selector) {
                entry.name = node.getText();
                locationNode = node.findParent(NodeType.Ruleset);
            }
            else if (node instanceof VariableDeclaration) {
                entry.name = node.getName();
                entry.kind = SymbolKind.Variable;
            }
            else if (node instanceof MixinDeclaration) {
                entry.name = node.getName();
                entry.kind = SymbolKind.Method;
            }
            else if (node instanceof FunctionDeclaration) {
                entry.name = node.getName();
                entry.kind = SymbolKind.Function;
            }
            else if (node instanceof Keyframe) {
                entry.name = localize$4('literal.keyframes', "@keyframes {0}", node.getName());
            }
            else if (node instanceof FontFace) {
                entry.name = localize$4('literal.fontface', "@font-face");
            }
            if (entry.name) {
                entry.location = Location.create(document.uri, getRange(locationNode, document));
                result.push(entry);
            }
            return true;
        });
        return result;
    };
    CSSNavigation.prototype.findDocumentColors = function (document, stylesheet) {
        var result = [];
        stylesheet.accept(function (node) {
            var colorInfo = getColorInformation(node, document);
            if (colorInfo) {
                result.push(colorInfo);
            }
            return true;
        });
        return result;
    };
    CSSNavigation.prototype.getColorPresentations = function (document, stylesheet, color, range) {
        var result = [];
        var red256 = Math.round(color.red * 255), green256 = Math.round(color.green * 255), blue256 = Math.round(color.blue * 255);
        var label;
        if (color.alpha === 1) {
            label = "rgb(" + red256 + ", " + green256 + ", " + blue256 + ")";
        }
        else {
            label = "rgba(" + red256 + ", " + green256 + ", " + blue256 + ", " + color.alpha + ")";
        }
        result.push({ label: label, textEdit: TextEdit.replace(range, label) });
        if (color.alpha === 1) {
            label = "#" + toTwoDigitHex(red256) + toTwoDigitHex(green256) + toTwoDigitHex(blue256);
        }
        else {
            label = "#" + toTwoDigitHex(red256) + toTwoDigitHex(green256) + toTwoDigitHex(blue256) + toTwoDigitHex(Math.round(color.alpha * 255));
        }
        result.push({ label: label, textEdit: TextEdit.replace(range, label) });
        var hsl = hslFromColor(color);
        if (hsl.a === 1) {
            label = "hsl(" + hsl.h + ", " + Math.round(hsl.s * 100) + "%, " + Math.round(hsl.l * 100) + "%)";
        }
        else {
            label = "hsla(" + hsl.h + ", " + Math.round(hsl.s * 100) + "%, " + Math.round(hsl.l * 100) + "%, " + hsl.a + ")";
        }
        result.push({ label: label, textEdit: TextEdit.replace(range, label) });
        return result;
    };
    CSSNavigation.prototype.doRename = function (document, position, newName, stylesheet) {
        var highlights = this.findDocumentHighlights(document, position, stylesheet);
        var edits = highlights.map(function (h) { return TextEdit.replace(h.range, newName); });
        return {
            changes: (_a = {}, _a[document.uri] = edits, _a)
        };
        var _a;
    };
    return CSSNavigation;
}());
function getColorInformation(node, document) {
    var color = getColorValue(node);
    if (color) {
        var range = getRange(node, document);
        return { color: color, range: range };
    }
    return null;
}
function getRange(node, document) {
    return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
}
function getHighlightKind(node) {
    if (node.type === NodeType.Selector) {
        return DocumentHighlightKind.Write;
    }
    if (node instanceof Identifier) {
        if (node.parent && node.parent instanceof Property) {
            if (node.isCustomProperty) {
                return DocumentHighlightKind.Write;
            }
        }
    }
    if (node.parent) {
        switch (node.parent.type) {
            case NodeType.FunctionDeclaration:
            case NodeType.MixinDeclaration:
            case NodeType.Keyframe:
            case NodeType.VariableDeclaration:
            case NodeType.FunctionParameter:
                return DocumentHighlightKind.Write;
        }
    }
    return DocumentHighlightKind.Read;
}
function toTwoDigitHex(n) {
    var r = n.toString(16);
    return r.length !== 2 ? '0' + r : r;
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var localize$5 = loadMessageBundle();
var Warning = Level.Warning;
var Error$1 = Level.Error;
var Ignore = Level.Ignore;
var Rule = /** @class */ (function () {
    function Rule(id, message, defaultValue) {
        this.id = id;
        this.message = message;
        this.defaultValue = defaultValue;
        // nothing to do
    }
    return Rule;
}());
var Rules = {
    AllVendorPrefixes: new Rule('compatibleVendorPrefixes', localize$5('rule.vendorprefixes.all', "When using a vendor-specific prefix make sure to also include all other vendor-specific properties"), Ignore),
    IncludeStandardPropertyWhenUsingVendorPrefix: new Rule('vendorPrefix', localize$5('rule.standardvendorprefix.all', "When using a vendor-specific prefix also include the standard property"), Warning),
    DuplicateDeclarations: new Rule('duplicateProperties', localize$5('rule.duplicateDeclarations', "Do not use duplicate style definitions"), Ignore),
    EmptyRuleSet: new Rule('emptyRules', localize$5('rule.emptyRuleSets', "Do not use empty rulesets"), Warning),
    ImportStatemement: new Rule('importStatement', localize$5('rule.importDirective', "Import statements do not load in parallel"), Ignore),
    BewareOfBoxModelSize: new Rule('boxModel', localize$5('rule.bewareOfBoxModelSize', "Do not use width or height when using padding or border"), Ignore),
    UniversalSelector: new Rule('universalSelector', localize$5('rule.universalSelector', "The universal selector (*) is known to be slow"), Ignore),
    ZeroWithUnit: new Rule('zeroUnits', localize$5('rule.zeroWidthUnit', "No unit for zero needed"), Ignore),
    RequiredPropertiesForFontFace: new Rule('fontFaceProperties', localize$5('rule.fontFaceProperties', "@font-face rule must define 'src' and 'font-family' properties"), Warning),
    HexColorLength: new Rule('hexColorLength', localize$5('rule.hexColor', "Hex colors must consist of three, four, six or eight hex numbers"), Error$1),
    ArgsInColorFunction: new Rule('argumentsInColorFunction', localize$5('rule.colorFunction', "Invalid number of parameters"), Error$1),
    UnknownProperty: new Rule('unknownProperties', localize$5('rule.unknownProperty', "Unknown property."), Warning),
    IEStarHack: new Rule('ieHack', localize$5('rule.ieHack', "IE hacks are only necessary when supporting IE7 and older"), Ignore),
    UnknownVendorSpecificProperty: new Rule('unknownVendorSpecificProperties', localize$5('rule.unknownVendorSpecificProperty', "Unknown vendor specific property."), Ignore),
    PropertyIgnoredDueToDisplay: new Rule('propertyIgnoredDueToDisplay', localize$5('rule.propertyIgnoredDueToDisplay', "Property is ignored due to the display."), Warning),
    AvoidImportant: new Rule('important', localize$5('rule.avoidImportant', "Avoid using !important. It is an indication that the specificity of the entire CSS has gotten out of control and needs to be refactored."), Ignore),
    AvoidFloat: new Rule('float', localize$5('rule.avoidFloat', "Avoid using 'float'. Floats lead to fragile CSS that is easy to break if one aspect of the layout changes."), Ignore),
    AvoidIdSelector: new Rule('idSelector', localize$5('rule.avoidIdSelector', "Selectors should not contain IDs because these rules are too tightly coupled with the HTML."), Ignore),
};
var LintConfigurationSettings = /** @class */ (function () {
    function LintConfigurationSettings(conf) {
        if (conf === void 0) { conf = {}; }
        this.conf = conf;
    }
    LintConfigurationSettings.prototype.get = function (rule) {
        if (this.conf.hasOwnProperty(rule.id)) {
            var level = toLevel(this.conf[rule.id]);
            if (level) {
                return level;
            }
        }
        return rule.defaultValue;
    };
    return LintConfigurationSettings;
}());
function toLevel(level) {
    switch (level) {
        case 'ignore': return Level.Ignore;
        case 'warning': return Level.Warning;
        case 'error': return Level.Error;
    }
    return null;
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var localize$6 = loadMessageBundle();
var CSSCodeActions = /** @class */ (function () {
    function CSSCodeActions() {
    }
    CSSCodeActions.prototype.doCodeActions = function (document, range, context, stylesheet) {
        var result = [];
        if (context.diagnostics) {
            for (var _i = 0, _a = context.diagnostics; _i < _a.length; _i++) {
                var diagnostic = _a[_i];
                this.appendFixesForMarker(document, stylesheet, diagnostic, result);
            }
        }
        return result;
    };
    CSSCodeActions.prototype.getFixesForUnknownProperty = function (document, property, marker, result) {
        var propertyName = property.getName();
        var candidates = [];
        for (var p in getProperties()) {
            var score = difference(propertyName, p);
            if (score >= propertyName.length / 2 /*score_lim*/) {
                candidates.push({ property: p, score: score });
            }
        }
        // Sort in descending order.
        candidates.sort(function (a, b) {
            return b.score - a.score;
        });
        var maxActions = 3;
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var candidate = candidates_1[_i];
            var propertyName_1 = candidate.property;
            var title = localize$6('css.codeaction.rename', "Rename to '{0}'", propertyName_1);
            var edit = TextEdit.replace(marker.range, propertyName_1);
            result.push(Command.create(title, '_css.applyCodeAction', document.uri, document.version, [edit]));
            if (--maxActions <= 0) {
                return;
            }
        }
    };
    CSSCodeActions.prototype.appendFixesForMarker = function (document, stylesheet, marker, result) {
        if (marker.code !== Rules.UnknownProperty.id) {
            return;
        }
        var offset = document.offsetAt(marker.range.start);
        var end = document.offsetAt(marker.range.end);
        var nodepath = getNodePath(stylesheet, offset);
        for (var i = nodepath.length - 1; i >= 0; i--) {
            var node = nodepath[i];
            if (node instanceof Declaration) {
                var property = node.getProperty();
                if (property && property.offset === offset && property.end === end) {
                    this.getFixesForUnknownProperty(document, property, marker, result);
                    return;
                }
            }
        }
    };
    return CSSCodeActions;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var localize$7 = loadMessageBundle();
var Element$1 = /** @class */ (function () {
    function Element(text, data) {
        this.name = text;
        this.node = data;
    }
    return Element;
}());
var NodesByRootMap = /** @class */ (function () {
    function NodesByRootMap() {
        this.data = {};
    }
    NodesByRootMap.prototype.add = function (root, name, node) {
        var entry = this.data[root];
        if (!entry) {
            entry = { nodes: [], names: [] };
            this.data[root] = entry;
        }
        entry.names.push(name);
        if (node) {
            entry.nodes.push(node);
        }
    };
    return NodesByRootMap;
}());
var LintVisitor = /** @class */ (function () {
    function LintVisitor(document, settings) {
        this.warnings = [];
        this.settings = settings;
        this.documentText = document.getText();
        this.keyframes = new NodesByRootMap();
    }
    LintVisitor.entries = function (node, document, settings, entryFilter) {
        var visitor = new LintVisitor(document, settings);
        node.acceptVisitor(visitor);
        visitor.completeValidations();
        return visitor.getEntries(entryFilter);
    };
    LintVisitor.prototype.fetch = function (input, s) {
        var elements = [];
        for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
            var curr = input_1[_i];
            if (curr.name === s) {
                elements.push(curr);
            }
        }
        return elements;
    };
    LintVisitor.prototype.fetchWithValue = function (input, s, v) {
        var elements = [];
        for (var _i = 0, input_2 = input; _i < input_2.length; _i++) {
            var inputElement = input_2[_i];
            if (inputElement.name === s) {
                var expression = inputElement.node.getValue();
                if (expression && this.findValueInExpression(expression, v)) {
                    elements.push(inputElement);
                }
            }
        }
        return elements;
    };
    LintVisitor.prototype.findValueInExpression = function (expression, v) {
        var found = false;
        expression.accept(function (node) {
            if (node.type === NodeType.Identifier && node.getText() === v) {
                found = true;
            }
            return !found;
        });
        return found;
    };
    LintVisitor.prototype.getEntries = function (filter) {
        if (filter === void 0) { filter = (Level.Warning | Level.Error); }
        return this.warnings.filter(function (entry) {
            return (entry.getLevel() & filter) !== 0;
        });
    };
    LintVisitor.prototype.addEntry = function (node, rule, details) {
        var entry = new Marker(node, rule, this.settings.get(rule), details);
        this.warnings.push(entry);
    };
    LintVisitor.prototype.getMissingNames = function (expected, actual) {
        expected = expected.slice(0); // clone
        for (var i = 0; i < actual.length; i++) {
            var k = expected.indexOf(actual[i]);
            if (k !== -1) {
                expected[k] = null;
            }
        }
        var result = null;
        for (var i = 0; i < expected.length; i++) {
            var curr = expected[i];
            if (curr) {
                if (result === null) {
                    result = localize$7('namelist.single', "'{0}'", curr);
                }
                else {
                    result = localize$7('namelist.concatenated', "{0}, '{1}'", result, curr);
                }
            }
        }
        return result;
    };
    LintVisitor.prototype.visitNode = function (node) {
        switch (node.type) {
            case NodeType.Keyframe:
                return this.visitKeyframe(node);
            case NodeType.FontFace:
                return this.visitFontFace(node);
            case NodeType.Ruleset:
                return this.visitRuleSet(node);
            case NodeType.SimpleSelector:
                return this.visitSimpleSelector(node);
            case NodeType.Function:
                return this.visitFunction(node);
            case NodeType.NumericValue:
                return this.visitNumericValue(node);
            case NodeType.Import:
                return this.visitImport(node);
            case NodeType.HexColorValue:
                return this.visitHexColorValue(node);
            case NodeType.Prio:
                return this.visitPrio(node);
        }
        return true;
    };
    LintVisitor.prototype.completeValidations = function () {
        this.validateKeyframes();
    };
    LintVisitor.prototype.visitKeyframe = function (node) {
        var keyword = node.getKeyword();
        var text = keyword.getText();
        this.keyframes.add(node.getName(), text, (text !== '@keyframes') ? keyword : null);
        return true;
    };
    LintVisitor.prototype.validateKeyframes = function () {
        // @keyframe and it's vendor specific alternatives
        // @keyframe should be included
        var expected = ['@-webkit-keyframes', '@-moz-keyframes', '@-o-keyframes'];
        for (var name in this.keyframes.data) {
            var actual = this.keyframes.data[name].names;
            var needsStandard = (actual.indexOf('@keyframes') === -1);
            if (!needsStandard && actual.length === 1) {
                continue; // only the non-vendor specific keyword is used, that's fine, no warning
            }
            var missingVendorSpecific = this.getMissingNames(expected, actual);
            if (missingVendorSpecific || needsStandard) {
                for (var _i = 0, _a = this.keyframes.data[name].nodes; _i < _a.length; _i++) {
                    var node = _a[_i];
                    if (needsStandard) {
                        var message = localize$7('keyframes.standardrule.missing', "Always define standard rule '@keyframes' when defining keyframes.");
                        this.addEntry(node, Rules.IncludeStandardPropertyWhenUsingVendorPrefix, message);
                    }
                    if (missingVendorSpecific) {
                        var message = localize$7('keyframes.vendorspecific.missing', "Always include all vendor specific rules: Missing: {0}", missingVendorSpecific);
                        this.addEntry(node, Rules.AllVendorPrefixes, message);
                    }
                }
            }
        }
        return true;
    };
    LintVisitor.prototype.visitSimpleSelector = function (node) {
        var firstChar = this.documentText.charAt(node.offset);
        /////////////////////////////////////////////////////////////
        //	Lint - The universal selector (*) is known to be slow.
        /////////////////////////////////////////////////////////////
        if (node.length === 1 && firstChar === '*') {
            this.addEntry(node, Rules.UniversalSelector);
        }
        /////////////////////////////////////////////////////////////
        //	Lint - Avoid id selectors
        /////////////////////////////////////////////////////////////
        if (firstChar === '#') {
            this.addEntry(node, Rules.AvoidIdSelector);
        }
        return true;
    };
    LintVisitor.prototype.visitImport = function (node) {
        /////////////////////////////////////////////////////////////
        //	Lint - Import statements shouldn't be used, because they aren't offering parallel downloads.
        /////////////////////////////////////////////////////////////
        this.addEntry(node, Rules.ImportStatemement);
        return true;
    };
    LintVisitor.prototype.visitRuleSet = function (node) {
        /////////////////////////////////////////////////////////////
        //	Lint - Don't use empty rulesets.
        /////////////////////////////////////////////////////////////
        var declarations = node.getDeclarations();
        if (!declarations) {
            // syntax error
            return false;
        }
        if (!declarations.hasChildren()) {
            this.addEntry(node.getSelectors(), Rules.EmptyRuleSet);
        }
        var self = this;
        var propertyTable = [];
        for (var _i = 0, _a = declarations.getChildren(); _i < _a.length; _i++) {
            var element = _a[_i];
            if (element instanceof Declaration) {
                var decl = element;
                propertyTable.push(new Element$1(decl.getFullPropertyName().toLowerCase(), decl));
            }
        }
        /////////////////////////////////////////////////////////////
        // the rule warns when it finds:
        // width being used with border, border-left, border-right, padding, padding-left, or padding-right
        // height being used with border, border-top, border-bottom, padding, padding-top, or padding-bottom
        // No error when box-sizing property is specified, as it assumes the user knows what he's doing.
        // see https://github.com/CSSLint/csslint/wiki/Beware-of-box-model-size
        /////////////////////////////////////////////////////////////
        if (this.fetch(propertyTable, 'box-sizing').length === 0) {
            var widthEntries = this.fetch(propertyTable, 'width');
            if (widthEntries.length > 0) {
                var problemDetected = false;
                for (var _b = 0, _c = ['border', 'border-left', 'border-right', 'padding', 'padding-left', 'padding-right']; _b < _c.length; _b++) {
                    var p = _c[_b];
                    var elements_1 = this.fetch(propertyTable, p);
                    for (var _d = 0, elements_2 = elements_1; _d < elements_2.length; _d++) {
                        var element = elements_2[_d];
                        var value = element.node.getValue();
                        if (value && !value.matches('none')) {
                            this.addEntry(element.node, Rules.BewareOfBoxModelSize);
                            problemDetected = true;
                        }
                    }
                }
                if (problemDetected) {
                    for (var _e = 0, widthEntries_1 = widthEntries; _e < widthEntries_1.length; _e++) {
                        var widthEntry = widthEntries_1[_e];
                        this.addEntry(widthEntry.node, Rules.BewareOfBoxModelSize);
                    }
                }
            }
            var heightEntries = this.fetch(propertyTable, 'height');
            if (heightEntries.length > 0) {
                var problemDetected = false;
                for (var _f = 0, _g = ['border', 'border-top', 'border-bottom', 'padding', 'padding-top', 'padding-bottom']; _f < _g.length; _f++) {
                    var p = _g[_f];
                    var elements_3 = this.fetch(propertyTable, p);
                    for (var _h = 0, elements_4 = elements_3; _h < elements_4.length; _h++) {
                        var element = elements_4[_h];
                        var value = element.node.getValue();
                        if (value && !value.matches('none')) {
                            this.addEntry(element.node, Rules.BewareOfBoxModelSize);
                            problemDetected = true;
                        }
                    }
                }
                if (problemDetected) {
                    for (var _j = 0, heightEntries_1 = heightEntries; _j < heightEntries_1.length; _j++) {
                        var heightEntry = heightEntries_1[_j];
                        this.addEntry(heightEntry.node, Rules.BewareOfBoxModelSize);
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////////
        //	Properties ignored due to display
        /////////////////////////////////////////////////////////////
        // With 'display: inline', the width, height, margin-top, margin-bottom, and float properties have no effect
        var displayElems = this.fetchWithValue(propertyTable, 'display', 'inline');
        if (displayElems.length > 0) {
            for (var _k = 0, _l = ['width', 'height', 'margin-top', 'margin-bottom', 'float']; _k < _l.length; _k++) {
                var prop = _l[_k];
                var elem = self.fetch(propertyTable, prop);
                for (var index = 0; index < elem.length; index++) {
                    var node_1 = elem[index].node;
                    var value = node_1.getValue();
                    if (prop === 'float' && (!value || value.matches('none'))) {
                        continue;
                    }
                    self.addEntry(node_1, Rules.PropertyIgnoredDueToDisplay, localize$7('rule.propertyIgnoredDueToDisplayInline', "Property is ignored due to the display. With 'display: inline', the width, height, margin-top, margin-bottom, and float properties have no effect."));
                }
            }
        }
        // With 'display: inline-block', 'float' has no effect
        displayElems = this.fetchWithValue(propertyTable, 'display', 'inline-block');
        if (displayElems.length > 0) {
            var elem = this.fetch(propertyTable, 'float');
            for (var index = 0; index < elem.length; index++) {
                var node_2 = elem[index].node;
                var value = node_2.getValue();
                if (value && !value.matches('none')) {
                    this.addEntry(node_2, Rules.PropertyIgnoredDueToDisplay, localize$7('rule.propertyIgnoredDueToDisplayInlineBlock', "inline-block is ignored due to the float. If 'float' has a value other than 'none', the box is floated and 'display' is treated as 'block'"));
                }
            }
        }
        // With 'display: block', 'vertical-align' has no effect
        displayElems = this.fetchWithValue(propertyTable, 'display', 'block');
        if (displayElems.length > 0) {
            var elem = this.fetch(propertyTable, 'vertical-align');
            for (var index = 0; index < elem.length; index++) {
                this.addEntry(elem[index].node, Rules.PropertyIgnoredDueToDisplay, localize$7('rule.propertyIgnoredDueToDisplayBlock', "Property is ignored due to the display. With 'display: block', vertical-align should not be used."));
            }
        }
        /////////////////////////////////////////////////////////////
        //	Avoid 'float'
        /////////////////////////////////////////////////////////////
        var elements = this.fetch(propertyTable, 'float');
        for (var index = 0; index < elements.length; index++) {
            this.addEntry(elements[index].node, Rules.AvoidFloat);
        }
        /////////////////////////////////////////////////////////////
        //	Don't use duplicate declarations.
        /////////////////////////////////////////////////////////////
        for (var i = 0; i < propertyTable.length; i++) {
            var element = propertyTable[i];
            if (element.name !== 'background') {
                var value = element.node.getValue();
                if (value && this.documentText.charAt(value.offset) !== '-') {
                    var elements_5 = this.fetch(propertyTable, element.name);
                    if (elements_5.length > 1) {
                        for (var k = 0; k < elements_5.length; k++) {
                            var value_1 = elements_5[k].node.getValue();
                            if (value_1 && this.documentText.charAt(value_1.offset) !== '-' && elements_5[k] !== element) {
                                this.addEntry(element.node, Rules.DuplicateDeclarations);
                            }
                        }
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////////
        //	Unknown propery & When using a vendor-prefixed gradient, make sure to use them all.
        /////////////////////////////////////////////////////////////
        var propertiesBySuffix = new NodesByRootMap();
        var containsUnknowns = false;
        for (var _m = 0, _o = declarations.getChildren(); _m < _o.length; _m++) {
            var node_3 = _o[_m];
            if (this.isCSSDeclaration(node_3)) {
                var decl = node_3;
                var name = decl.getFullPropertyName();
                var firstChar = name.charAt(0);
                if (firstChar === '-') {
                    if (name.charAt(1) !== '-') {
                        if (!isKnownProperty(name)) {
                            this.addEntry(decl.getProperty(), Rules.UnknownVendorSpecificProperty);
                        }
                        var nonPrefixedName = decl.getNonPrefixedPropertyName();
                        propertiesBySuffix.add(nonPrefixedName, name, decl.getProperty());
                    }
                }
                else {
                    if (firstChar === '*' || firstChar === '_') {
                        this.addEntry(decl.getProperty(), Rules.IEStarHack);
                        name = name.substr(1);
                    }
                    if (!isKnownProperty(name)) {
                        this.addEntry(decl.getProperty(), Rules.UnknownProperty, localize$7('property.unknownproperty.detailed', "Unknown property: '{0}'", name));
                    }
                    propertiesBySuffix.add(name, name, null); // don't pass the node as we don't show errors on the standard
                }
            }
            else {
                containsUnknowns = true;
            }
        }
        if (!containsUnknowns) {
            for (var suffix in propertiesBySuffix.data) {
                var entry = propertiesBySuffix.data[suffix];
                var actual = entry.names;
                var needsStandard = isKnownProperty(suffix) && (actual.indexOf(suffix) === -1);
                if (!needsStandard && actual.length === 1) {
                    continue; // only the non-vendor specific rule is used, that's fine, no warning
                }
                var expected = [];
                for (var i = 0, len = LintVisitor.prefixes.length; i < len; i++) {
                    var prefix = LintVisitor.prefixes[i];
                    if (isKnownProperty(prefix + suffix)) {
                        expected.push(prefix + suffix);
                    }
                }
                var missingVendorSpecific = this.getMissingNames(expected, actual);
                if (missingVendorSpecific || needsStandard) {
                    for (var _p = 0, _q = entry.nodes; _p < _q.length; _p++) {
                        var node_4 = _q[_p];
                        if (needsStandard) {
                            var message = localize$7('property.standard.missing', "Also define the standard property '{0}' for compatibility", suffix);
                            this.addEntry(node_4, Rules.IncludeStandardPropertyWhenUsingVendorPrefix, message);
                        }
                        if (missingVendorSpecific) {
                            var message = localize$7('property.vendorspecific.missing', "Always include all vendor specific properties: Missing: {0}", missingVendorSpecific);
                            this.addEntry(node_4, Rules.AllVendorPrefixes, message);
                        }
                    }
                }
            }
        }
        return true;
    };
    LintVisitor.prototype.visitPrio = function (node) {
        /////////////////////////////////////////////////////////////
        //	Don't use !important
        /////////////////////////////////////////////////////////////
        this.addEntry(node, Rules.AvoidImportant);
        return true;
    };
    LintVisitor.prototype.visitNumericValue = function (node) {
        /////////////////////////////////////////////////////////////
        //	0 has no following unit
        /////////////////////////////////////////////////////////////
        var value = node.getValue();
        if (!value.unit || units.length.indexOf(value.unit.toLowerCase()) === -1) {
            return true;
        }
        if (parseFloat(value.value) === 0.0 && !!value.unit) {
            this.addEntry(node, Rules.ZeroWithUnit);
        }
        return true;
    };
    LintVisitor.prototype.visitFontFace = function (node) {
        var declarations = node.getDeclarations();
        if (!declarations) {
            // syntax error
            return;
        }
        var definesSrc = false, definesFontFamily = false;
        var containsUnknowns = false;
        for (var _i = 0, _a = declarations.getChildren(); _i < _a.length; _i++) {
            var node_5 = _a[_i];
            if (this.isCSSDeclaration(node_5)) {
                var name = (node_5.getProperty().getName().toLowerCase());
                if (name === 'src') {
                    definesSrc = true;
                }
                if (name === 'font-family') {
                    definesFontFamily = true;
                }
            }
            else {
                containsUnknowns = true;
            }
        }
        if (!containsUnknowns && (!definesSrc || !definesFontFamily)) {
            this.addEntry(node, Rules.RequiredPropertiesForFontFace);
        }
        return true;
    };
    LintVisitor.prototype.isCSSDeclaration = function (node) {
        if (node instanceof Declaration) {
            if (!node.getValue()) {
                return false;
            }
            var property = node.getProperty();
            if (!property || property.getIdentifier().containsInterpolation()) {
                return false;
            }
            return true;
        }
        return false;
    };
    LintVisitor.prototype.visitHexColorValue = function (node) {
        // Rule: #eeff0011 or #eeff00 or #ef01 or #ef0 
        var length = node.length;
        if (length !== 9 && length !== 7 && length !== 5 && length !== 4) {
            this.addEntry(node, Rules.HexColorLength);
        }
        return false;
    };
    LintVisitor.prototype.visitFunction = function (node) {
        var fnName = node.getName().toLowerCase();
        var expectedAttrCount = -1;
        var actualAttrCount = 0;
        switch (fnName) {
            case 'rgb(':
            case 'hsl(':
                expectedAttrCount = 3;
                break;
            case 'rgba(':
            case 'hsla(':
                expectedAttrCount = 4;
                break;
        }
        if (expectedAttrCount !== -1) {
            node.getArguments().accept(function (n) {
                if (n instanceof BinaryExpression) {
                    actualAttrCount += 1;
                    return false;
                }
                return true;
            });
            if (actualAttrCount !== expectedAttrCount) {
                this.addEntry(node, Rules.ArgsInColorFunction);
            }
        }
        return true;
    };
    LintVisitor.prefixes = [
        '-ms-', '-moz-', '-o-', '-webkit-',
    ];
    return LintVisitor;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var CSSValidation = /** @class */ (function () {
    function CSSValidation() {
    }
    CSSValidation.prototype.configure = function (settings) {
        this.settings = settings;
    };
    CSSValidation.prototype.doValidation = function (document, stylesheet, settings) {
        if (settings === void 0) { settings = this.settings; }
        if (settings && settings.validate === false) {
            return [];
        }
        var entries = [];
        entries.push.apply(entries, ParseErrorCollector.entries(stylesheet));
        entries.push.apply(entries, LintVisitor.entries(stylesheet, document, new LintConfigurationSettings(settings && settings.lint)));
        function toDiagnostic(marker) {
            var range = Range.create(document.positionAt(marker.getOffset()), document.positionAt(marker.getOffset() + marker.getLength()));
            return {
                code: marker.getRule().id,
                source: document.languageId,
                message: marker.getMessage(),
                severity: marker.getLevel() === Level.Warning ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
                range: range
            };
        }
        return entries.filter(function (entry) { return entry.getLevel() !== Level.Ignore; }).map(toDiagnostic);
    };
    return CSSValidation;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _FSL$1 = '/'.charCodeAt(0);
var _NWL$1 = '\n'.charCodeAt(0);
var _CAR$1 = '\r'.charCodeAt(0);
var _LFD$1 = '\f'.charCodeAt(0);
var _DLR$1 = '$'.charCodeAt(0);
var _HSH$1 = '#'.charCodeAt(0);
var _CUL$1 = '{'.charCodeAt(0);
var _EQS$1 = '='.charCodeAt(0);
var _BNG$1 = '!'.charCodeAt(0);
var _LAN$1 = '<'.charCodeAt(0);
var _RAN$1 = '>'.charCodeAt(0);
var _DOT$1 = '.'.charCodeAt(0);
var customTokenValue = TokenType.CustomToken;
var VariableName = customTokenValue++;
var InterpolationFunction = customTokenValue++;
var Default = customTokenValue++;
var EqualsOperator = customTokenValue++;
var NotEqualsOperator = customTokenValue++;
var GreaterEqualsOperator = customTokenValue++;
var SmallerEqualsOperator = customTokenValue++;
var Ellipsis = customTokenValue++;
var SCSSScanner = /** @class */ (function (_super) {
    __extends$3(SCSSScanner, _super);
    function SCSSScanner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SCSSScanner.prototype.scanNext = function (offset) {
        // scss variable
        if (this.stream.advanceIfChar(_DLR$1)) {
            var content = ['$'];
            if (this.ident(content)) {
                return this.finishToken(offset, VariableName, content.join(''));
            }
            else {
                this.stream.goBackTo(offset);
            }
        }
        // scss: interpolation function #{..})
        if (this.stream.advanceIfChars([_HSH$1, _CUL$1])) {
            return this.finishToken(offset, InterpolationFunction);
        }
        // operator ==
        if (this.stream.advanceIfChars([_EQS$1, _EQS$1])) {
            return this.finishToken(offset, EqualsOperator);
        }
        // operator !=
        if (this.stream.advanceIfChars([_BNG$1, _EQS$1])) {
            return this.finishToken(offset, NotEqualsOperator);
        }
        // operators <, <=
        if (this.stream.advanceIfChar(_LAN$1)) {
            if (this.stream.advanceIfChar(_EQS$1)) {
                return this.finishToken(offset, SmallerEqualsOperator);
            }
            return this.finishToken(offset, TokenType.Delim);
        }
        // ooperators >, >=
        if (this.stream.advanceIfChar(_RAN$1)) {
            if (this.stream.advanceIfChar(_EQS$1)) {
                return this.finishToken(offset, GreaterEqualsOperator);
            }
            return this.finishToken(offset, TokenType.Delim);
        }
        // ellipis
        if (this.stream.advanceIfChars([_DOT$1, _DOT$1, _DOT$1])) {
            return this.finishToken(offset, Ellipsis);
        }
        return _super.prototype.scanNext.call(this, offset);
    };
    SCSSScanner.prototype.comment = function () {
        if (_super.prototype.comment.call(this)) {
            return true;
        }
        if (!this.inURL && this.stream.advanceIfChars([_FSL$1, _FSL$1])) {
            this.stream.advanceWhileChar(function (ch) {
                switch (ch) {
                    case _NWL$1:
                    case _CAR$1:
                    case _LFD$1:
                        return false;
                    default:
                        return true;
                }
            });
            return true;
        }
        else {
            return false;
        }
    };
    return SCSSScanner;
}(Scanner));

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var localize$8 = loadMessageBundle();
var SCSSIssueType = /** @class */ (function () {
    function SCSSIssueType(id, message) {
        this.id = id;
        this.message = message;
    }
    return SCSSIssueType;
}());
var SCSSParseError = {
    FromExpected: new SCSSIssueType('scss-fromexpected', localize$8('expected.from', "'from' expected")),
    ThroughOrToExpected: new SCSSIssueType('scss-throughexpected', localize$8('expected.through', "'through' or 'to' expected")),
    InExpected: new SCSSIssueType('scss-fromexpected', localize$8('expected.in', "'in' expected")),
};

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <summary>
/// A parser for scss
/// http://sass-lang.com/documentation/file.SASS_REFERENCE.html
/// </summary>
var SCSSParser = /** @class */ (function (_super) {
    __extends$4(SCSSParser, _super);
    function SCSSParser() {
        return _super.call(this, new SCSSScanner()) || this;
    }
    SCSSParser.prototype._parseStylesheetStatement = function () {
        var node = _super.prototype._parseStylesheetStatement.call(this);
        if (node) {
            return node;
        }
        if (this.peek(TokenType.AtKeyword)) {
            return this._parseWarnAndDebug()
                || this._parseControlStatement()
                || this._parseMixinDeclaration()
                || this._parseMixinContent()
                || this._parseMixinReference() // @include
                || this._parseFunctionDeclaration();
        }
        return this._parseVariableDeclaration();
    };
    SCSSParser.prototype._parseImport = function () {
        if (!this.peekKeyword('@import')) {
            return null;
        }
        var node = this.create(Import);
        this.consumeToken();
        if (!node.addChild(this._parseURILiteral()) && !node.addChild(this._parseStringLiteral())) {
            return this.finish(node, ParseError.URIOrStringExpected);
        }
        while (this.accept(TokenType.Comma)) {
            if (!node.addChild(this._parseURILiteral()) && !node.addChild(this._parseStringLiteral())) {
                return this.finish(node, ParseError.URIOrStringExpected);
            }
        }
        if (!this.peek(TokenType.SemiColon) && !this.peek(TokenType.EOF)) {
            node.setMedialist(this._parseMediaQueryList());
        }
        return this.finish(node);
    };
    // scss variables: $font-size: 12px;
    SCSSParser.prototype._parseVariableDeclaration = function (panic) {
        if (panic === void 0) { panic = []; }
        if (!this.peek(VariableName)) {
            return null;
        }
        var node = this.create(VariableDeclaration);
        if (!node.setVariable(this._parseVariable())) {
            return null;
        }
        if (!this.accept(TokenType.Colon)) {
            return this.finish(node, ParseError.ColonExpected);
        }
        node.colonPosition = this.prevToken.offset;
        if (!node.setValue(this._parseExpr())) {
            return this.finish(node, ParseError.VariableValueExpected, [], panic);
        }
        while (this.accept(TokenType.Exclamation)) {
            if (!this.peekRegExp(TokenType.Ident, /^(default|global)$/)) {
                return this.finish(node, ParseError.UnknownKeyword);
            }
            this.consumeToken();
        }
        if (this.peek(TokenType.SemiColon)) {
            node.semicolonPosition = this.token.offset; // not part of the declaration, but useful information for code assist
        }
        return this.finish(node);
    };
    SCSSParser.prototype._parseMediaFeatureName = function () {
        return this._parseFunction() || this._parseIdent() || this._parseVariable(); // first function, the indent
    };
    SCSSParser.prototype._parseKeyframeSelector = function () {
        return this._tryParseKeyframeSelector() || this._parseControlStatement(this._parseKeyframeSelector.bind(this)) || this._parseMixinContent();
    };
    SCSSParser.prototype._parseVariable = function () {
        if (!this.peek(VariableName)) {
            return null;
        }
        var node = this.create(Variable);
        this.consumeToken();
        return node;
    };
    SCSSParser.prototype._parseIdent = function (referenceTypes) {
        var _this = this;
        if (!this.peek(TokenType.Ident) && !this.peek(InterpolationFunction) && !this.peekDelim('-')) {
            return null;
        }
        var node = this.create(Identifier);
        node.referenceTypes = referenceTypes;
        var hasContent = false;
        var delimWithInterpolation = function () {
            if (!_this.acceptDelim('-')) {
                return null;
            }
            if (!_this.hasWhitespace() && _this.acceptDelim('-')) {
                node.isCustomProperty = true;
            }
            if (!_this.hasWhitespace()) {
                return _this._parseInterpolation();
            }
            return null;
        };
        while (this.accept(TokenType.Ident) || node.addChild(this._parseInterpolation() || this.try(delimWithInterpolation))) {
            hasContent = true;
            if (!this.hasWhitespace() && this.acceptDelim('-')) ;
            if (this.hasWhitespace()) {
                break;
            }
        }
        return hasContent ? this.finish(node) : null;
    };
    SCSSParser.prototype._parseTerm = function () {
        var term = _super.prototype._parseTerm.call(this);
        if (term) {
            return term;
        }
        term = this.create(Term);
        if (term.setExpression(this._parseVariable())
            || term.setExpression(this._parseSelectorCombinator())
            || term.setExpression(this._tryParsePrio())) {
            return this.finish(term);
        }
        return null;
    };
    SCSSParser.prototype._parseInterpolation = function () {
        if (this.peek(InterpolationFunction)) {
            var node = this.create(Interpolation);
            this.consumeToken();
            if (!node.addChild(this._parseBinaryExpr()) && !this._parseSelectorCombinator()) {
                return this.finish(node, ParseError.ExpressionExpected);
            }
            if (!this.accept(TokenType.CurlyR)) {
                return this.finish(node, ParseError.RightCurlyExpected);
            }
            return this.finish(node);
        }
        return null;
    };
    SCSSParser.prototype._parseOperator = function () {
        if (this.peek(EqualsOperator) || this.peek(NotEqualsOperator)
            || this.peek(GreaterEqualsOperator) || this.peek(SmallerEqualsOperator)
            || this.peekDelim('>') || this.peekDelim('<')
            || this.peekIdent('and') || this.peekIdent('or')
            || this.peekDelim('%')) {
            var node = this.createNode(NodeType.Operator);
            this.consumeToken();
            return this.finish(node);
        }
        return _super.prototype._parseOperator.call(this);
    };
    SCSSParser.prototype._parseUnaryOperator = function () {
        if (this.peekIdent('not')) {
            var node = this.create(Node$1);
            this.consumeToken();
            return this.finish(node);
        }
        return _super.prototype._parseUnaryOperator.call(this);
    };
    SCSSParser.prototype._parseRuleSetDeclaration = function () {
        if (this.peek(TokenType.AtKeyword)) {
            return this._parseKeyframe() // nested @keyframe
                || this._parseImport() // nested @import
                || this._parseMedia(true) // nested @media
                || this._parseFontFace() // nested @font-face
                || this._parseWarnAndDebug() // @warn, @debug and @error statements
                || this._parseControlStatement() // @if, @while, @for, @each
                || this._parseFunctionDeclaration() // @function
                || this._parseExtends() // @extends
                || this._parseMixinReference() // @include
                || this._parseMixinContent() // @content
                || this._parseMixinDeclaration() // nested @mixin
                || this._parseRuleset(true) // @at-rule
                || this._parseSupports(true); // @supports
        }
        return this._parseVariableDeclaration() // variable declaration
            || this._tryParseRuleset(true) // nested ruleset
            || _super.prototype._parseRuleSetDeclaration.call(this); // try css ruleset declaration as last so in the error case, the ast will contain a declaration
    };
    SCSSParser.prototype._parseDeclaration = function (resyncStopTokens) {
        var node = this.create(Declaration);
        if (!node.setProperty(this._parseProperty())) {
            return null;
        }
        if (!this.accept(TokenType.Colon)) {
            return this.finish(node, ParseError.ColonExpected, [TokenType.Colon], resyncStopTokens);
        }
        node.colonPosition = this.prevToken.offset;
        var hasContent = false;
        if (node.setValue(this._parseExpr())) {
            hasContent = true;
            node.addChild(this._parsePrio());
        }
        if (this.peek(TokenType.CurlyL)) {
            node.setNestedProperties(this._parseNestedProperties());
        }
        else {
            if (!hasContent) {
                return this.finish(node, ParseError.PropertyValueExpected);
            }
        }
        if (this.peek(TokenType.SemiColon)) {
            node.semicolonPosition = this.token.offset; // not part of the declaration, but useful information for code assist
        }
        return this.finish(node);
    };
    SCSSParser.prototype._parseNestedProperties = function () {
        var node = this.create(NestedProperties);
        return this._parseBody(node, this._parseDeclaration.bind(this));
    };
    SCSSParser.prototype._parseExtends = function () {
        if (this.peekKeyword('@extend')) {
            var node = this.create(ExtendsReference);
            this.consumeToken();
            if (!node.getSelectors().addChild(this._parseSimpleSelector())) {
                return this.finish(node, ParseError.SelectorExpected);
            }
            while (this.accept(TokenType.Comma)) {
                node.getSelectors().addChild(this._parseSimpleSelector());
            }
            if (this.accept(TokenType.Exclamation)) {
                if (!this.acceptIdent('optional')) {
                    return this.finish(node, ParseError.UnknownKeyword);
                }
            }
            return this.finish(node);
        }
        return null;
    };
    SCSSParser.prototype._parseSimpleSelectorBody = function () {
        return this._parseSelectorCombinator() || this._parseSelectorPlaceholder() || _super.prototype._parseSimpleSelectorBody.call(this);
    };
    SCSSParser.prototype._parseSelectorCombinator = function () {
        if (this.peekDelim('&')) {
            var node = this.createNode(NodeType.SelectorCombinator);
            this.consumeToken();
            while (!this.hasWhitespace() && (this.acceptDelim('-') || this.accept(TokenType.Num) || this.accept(TokenType.Dimension) || node.addChild(this._parseIdent()) || this.acceptDelim('&'))) {
                //  support &-foo-1
            }
            return this.finish(node);
        }
        return null;
    };
    SCSSParser.prototype._parseSelectorPlaceholder = function () {
        if (this.peekDelim('%')) {
            var node = this.createNode(NodeType.SelectorPlaceholder);
            this.consumeToken();
            this._parseIdent();
            return this.finish(node);
        }
        else if (this.peekKeyword('@at-root')) {
            var node = this.createNode(NodeType.SelectorPlaceholder);
            this.consumeToken();
            return this.finish(node);
        }
        return null;
    };
    SCSSParser.prototype._parseWarnAndDebug = function () {
        if (!this.peekKeyword('@debug')
            && !this.peekKeyword('@warn')
            && !this.peekKeyword('@error')) {
            return null;
        }
        var node = this.createNode(NodeType.Debug);
        this.consumeToken(); // @debug, @warn or @error
        node.addChild(this._parseExpr()); // optional
        return this.finish(node);
    };
    SCSSParser.prototype._parseControlStatement = function (parseStatement) {
        if (parseStatement === void 0) { parseStatement = this._parseRuleSetDeclaration.bind(this); }
        if (!this.peek(TokenType.AtKeyword)) {
            return null;
        }
        return this._parseIfStatement(parseStatement) || this._parseForStatement(parseStatement)
            || this._parseEachStatement(parseStatement) || this._parseWhileStatement(parseStatement);
    };
    SCSSParser.prototype._parseIfStatement = function (parseStatement) {
        if (!this.peekKeyword('@if')) {
            return null;
        }
        return this._internalParseIfStatement(parseStatement);
    };
    SCSSParser.prototype._internalParseIfStatement = function (parseStatement) {
        var node = this.create(IfStatement);
        this.consumeToken(); // @if or if
        if (!node.setExpression(this._parseExpr(true))) {
            return this.finish(node, ParseError.ExpressionExpected);
        }
        this._parseBody(node, parseStatement);
        if (this.acceptKeyword('@else')) {
            if (this.peekIdent('if')) {
                node.setElseClause(this._internalParseIfStatement(parseStatement));
            }
            else if (this.peek(TokenType.CurlyL)) {
                var elseNode = this.create(ElseStatement);
                this._parseBody(elseNode, parseStatement);
                node.setElseClause(elseNode);
            }
        }
        return this.finish(node);
    };
    SCSSParser.prototype._parseForStatement = function (parseStatement) {
        if (!this.peekKeyword('@for')) {
            return null;
        }
        var node = this.create(ForStatement);
        this.consumeToken(); // @for
        if (!node.setVariable(this._parseVariable())) {
            return this.finish(node, ParseError.VariableNameExpected, [TokenType.CurlyR]);
        }
        if (!this.acceptIdent('from')) {
            return this.finish(node, SCSSParseError.FromExpected, [TokenType.CurlyR]);
        }
        if (!node.addChild(this._parseBinaryExpr())) {
            return this.finish(node, ParseError.ExpressionExpected, [TokenType.CurlyR]);
        }
        if (!this.acceptIdent('to') && !this.acceptIdent('through')) {
            return this.finish(node, SCSSParseError.ThroughOrToExpected, [TokenType.CurlyR]);
        }
        if (!node.addChild(this._parseBinaryExpr())) {
            return this.finish(node, ParseError.ExpressionExpected, [TokenType.CurlyR]);
        }
        return this._parseBody(node, parseStatement);
    };
    SCSSParser.prototype._parseEachStatement = function (parseStatement) {
        if (!this.peekKeyword('@each')) {
            return null;
        }
        var node = this.create(EachStatement);
        this.consumeToken(); // @each
        var variables = node.getVariables();
        if (!variables.addChild(this._parseVariable())) {
            return this.finish(node, ParseError.VariableNameExpected, [TokenType.CurlyR]);
        }
        while (this.accept(TokenType.Comma)) {
            if (!variables.addChild(this._parseVariable())) {
                return this.finish(node, ParseError.VariableNameExpected, [TokenType.CurlyR]);
            }
        }
        this.finish(variables);
        if (!this.acceptIdent('in')) {
            return this.finish(node, SCSSParseError.InExpected, [TokenType.CurlyR]);
        }
        if (!node.addChild(this._parseExpr())) {
            return this.finish(node, ParseError.ExpressionExpected, [TokenType.CurlyR]);
        }
        return this._parseBody(node, parseStatement);
    };
    SCSSParser.prototype._parseWhileStatement = function (parseStatement) {
        if (!this.peekKeyword('@while')) {
            return null;
        }
        var node = this.create(WhileStatement);
        this.consumeToken(); // @while
        if (!node.addChild(this._parseBinaryExpr())) {
            return this.finish(node, ParseError.ExpressionExpected, [TokenType.CurlyR]);
        }
        return this._parseBody(node, parseStatement);
    };
    SCSSParser.prototype._parseFunctionBodyDeclaration = function () {
        return this._parseVariableDeclaration() || this._parseReturnStatement() || this._parseWarnAndDebug()
            || this._parseControlStatement(this._parseFunctionBodyDeclaration.bind(this));
    };
    SCSSParser.prototype._parseFunctionDeclaration = function () {
        if (!this.peekKeyword('@function')) {
            return null;
        }
        var node = this.create(FunctionDeclaration);
        this.consumeToken(); // @function
        if (!node.setIdentifier(this._parseIdent([ReferenceType.Function]))) {
            return this.finish(node, ParseError.IdentifierExpected, [TokenType.CurlyR]);
        }
        if (!this.accept(TokenType.ParenthesisL)) {
            return this.finish(node, ParseError.LeftParenthesisExpected, [TokenType.CurlyR]);
        }
        if (node.getParameters().addChild(this._parseParameterDeclaration())) {
            while (this.accept(TokenType.Comma)) {
                if (!node.getParameters().addChild(this._parseParameterDeclaration())) {
                    return this.finish(node, ParseError.VariableNameExpected);
                }
            }
        }
        if (!this.accept(TokenType.ParenthesisR)) {
            return this.finish(node, ParseError.RightParenthesisExpected, [TokenType.CurlyR]);
        }
        return this._parseBody(node, this._parseFunctionBodyDeclaration.bind(this));
    };
    SCSSParser.prototype._parseReturnStatement = function () {
        if (!this.peekKeyword('@return')) {
            return null;
        }
        var node = this.createNode(NodeType.ReturnStatement);
        this.consumeToken(); // @function
        if (!node.addChild(this._parseExpr())) {
            return this.finish(node, ParseError.ExpressionExpected);
        }
        return this.finish(node);
    };
    SCSSParser.prototype._parseMixinDeclaration = function () {
        if (!this.peekKeyword('@mixin')) {
            return null;
        }
        var node = this.create(MixinDeclaration);
        this.consumeToken();
        if (!node.setIdentifier(this._parseIdent([ReferenceType.Mixin]))) {
            return this.finish(node, ParseError.IdentifierExpected, [TokenType.CurlyR]);
        }
        if (this.accept(TokenType.ParenthesisL)) {
            if (node.getParameters().addChild(this._parseParameterDeclaration())) {
                while (this.accept(TokenType.Comma)) {
                    if (!node.getParameters().addChild(this._parseParameterDeclaration())) {
                        return this.finish(node, ParseError.VariableNameExpected);
                    }
                }
            }
            if (!this.accept(TokenType.ParenthesisR)) {
                return this.finish(node, ParseError.RightParenthesisExpected, [TokenType.CurlyR]);
            }
        }
        return this._parseBody(node, this._parseRuleSetDeclaration.bind(this));
    };
    SCSSParser.prototype._parseParameterDeclaration = function () {
        var node = this.create(FunctionParameter);
        if (!node.setIdentifier(this._parseVariable())) {
            return null;
        }
        if (this.accept(Ellipsis)) ;
        if (this.accept(TokenType.Colon)) {
            if (!node.setDefaultValue(this._parseExpr(true))) {
                return this.finish(node, ParseError.VariableValueExpected, [], [TokenType.Comma, TokenType.ParenthesisR]);
            }
        }
        return this.finish(node);
    };
    SCSSParser.prototype._parseMixinContent = function () {
        if (!this.peekKeyword('@content')) {
            return null;
        }
        var node = this.createNode(NodeType.MixinContent);
        this.consumeToken();
        return this.finish(node);
    };
    SCSSParser.prototype._parseMixinReference = function () {
        if (!this.peekKeyword('@include')) {
            return null;
        }
        var node = this.create(MixinReference);
        this.consumeToken();
        if (!node.setIdentifier(this._parseIdent([ReferenceType.Mixin]))) {
            return this.finish(node, ParseError.IdentifierExpected, [TokenType.CurlyR]);
        }
        if (this.accept(TokenType.ParenthesisL)) {
            if (node.getArguments().addChild(this._parseFunctionArgument())) {
                while (this.accept(TokenType.Comma)) {
                    if (!node.getArguments().addChild(this._parseFunctionArgument())) {
                        return this.finish(node, ParseError.ExpressionExpected);
                    }
                }
            }
            if (!this.accept(TokenType.ParenthesisR)) {
                return this.finish(node, ParseError.RightParenthesisExpected);
            }
        }
        if (this.peek(TokenType.CurlyL)) {
            var content = this.create(BodyDeclaration);
            this._parseBody(content, this._parseMixinReferenceBodyStatement.bind(this));
            node.setContent(content);
        }
        return this.finish(node);
    };
    SCSSParser.prototype._parseMixinReferenceBodyStatement = function () {
        return this._tryParseKeyframeSelector() || this._parseRuleSetDeclaration();
    };
    SCSSParser.prototype._parseFunctionArgument = function () {
        // [variableName ':'] expression | variableName '...'
        var node = this.create(FunctionArgument);
        var pos = this.mark();
        var argument = this._parseVariable();
        if (argument) {
            if (!this.accept(TokenType.Colon)) {
                if (this.accept(Ellipsis)) {
                    node.setValue(argument);
                    return this.finish(node);
                }
                else {
                    this.restoreAtMark(pos);
                }
            }
            else {
                node.setIdentifier(argument);
            }
        }
        if (node.setValue(this._parseExpr(true))) {
            this.accept(Ellipsis); // #43746
            node.addChild(this._parsePrio()); // #9859
            return this.finish(node);
        }
        return null;
    };
    SCSSParser.prototype._parseURLArgument = function () {
        var pos = this.mark();
        var node = _super.prototype._parseURLArgument.call(this);
        if (!node || !this.peek(TokenType.ParenthesisR)) {
            this.restoreAtMark(pos);
            var node_1 = this.create(Node$1);
            node_1.addChild(this._parseBinaryExpr());
            return this.finish(node_1);
        }
        return node;
    };
    SCSSParser.prototype._parseOperation = function () {
        if (!this.peek(TokenType.ParenthesisL)) {
            return null;
        }
        var node = this.create(Node$1);
        this.consumeToken();
        while (node.addChild(this._parseListElement())) {
            this.accept(TokenType.Comma); // optional
        }
        if (!this.accept(TokenType.ParenthesisR)) {
            return this.finish(node, ParseError.RightParenthesisExpected);
        }
        return this.finish(node);
    };
    SCSSParser.prototype._parseListElement = function () {
        var node = this.createNode(NodeType.ListEntry);
        if (!node.addChild(this._parseBinaryExpr())) {
            return null;
        }
        if (this.accept(TokenType.Colon)) {
            if (!node.addChild(this._parseBinaryExpr())) {
                return this.finish(node, ParseError.ExpressionExpected);
            }
        }
        return this.finish(node);
    };
    return SCSSParser;
}(Parser));

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var localize$9 = loadMessageBundle();
var SCSSCompletion = /** @class */ (function (_super) {
    __extends$5(SCSSCompletion, _super);
    function SCSSCompletion() {
        return _super.call(this, '$') || this;
    }
    SCSSCompletion.prototype.createReplaceFunction = function () {
        var tabStopCounter = 1;
        return function (match, p1) {
            return '\\' + p1 + ': ${' + tabStopCounter++ + ':' + (SCSSCompletion.variableDefaults[p1] || '') + '}';
        };
    };
    SCSSCompletion.prototype.createFunctionProposals = function (proposals, existingNode, sortToEnd, result) {
        for (var _i = 0, proposals_1 = proposals; _i < proposals_1.length; _i++) {
            var p = proposals_1[_i];
            var insertText = p.func.replace(/\[?(\$\w+)\]?/g, this.createReplaceFunction());
            var label = p.func.substr(0, p.func.indexOf('('));
            var item = {
                label: label,
                detail: p.func,
                documentation: p.desc,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), insertText),
                insertTextFormat: InsertTextFormat.Snippet,
                kind: CompletionItemKind.Function
            };
            if (sortToEnd) {
                item.sortText = 'z';
            }
            result.items.push(item);
        }
        return result;
    };
    SCSSCompletion.prototype.getCompletionsForSelector = function (ruleSet, isNested, result) {
        this.createFunctionProposals(SCSSCompletion.selectorFuncs, void 0, true, result);
        return _super.prototype.getCompletionsForSelector.call(this, ruleSet, isNested, result);
    };
    SCSSCompletion.prototype.getTermProposals = function (entry, existingNode, result) {
        var functions = SCSSCompletion.builtInFuncs;
        if (entry) {
            functions = functions.filter(function (f) { return !f.type || entry.restrictions.indexOf(f.type) !== -1; });
        }
        this.createFunctionProposals(functions, existingNode, true, result);
        return _super.prototype.getTermProposals.call(this, entry, existingNode, result);
    };
    SCSSCompletion.prototype.getColorProposals = function (entry, existingNode, result) {
        this.createFunctionProposals(SCSSCompletion.colorProposals, existingNode, false, result);
        return _super.prototype.getColorProposals.call(this, entry, existingNode, result);
    };
    SCSSCompletion.prototype.getCompletionsForDeclarationProperty = function (declaration, result) {
        this.getCompletionsForSelector(null, true, result);
        return _super.prototype.getCompletionsForDeclarationProperty.call(this, declaration, result);
    };
    SCSSCompletion.prototype.getCompletionsForExtendsReference = function (extendsRef, existingNode, result) {
        var symbols = this.getSymbolContext().findSymbolsAtOffset(this.offset, ReferenceType.Rule);
        for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
            var symbol = symbols_1[_i];
            var suggest = {
                label: symbol.name,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), symbol.name),
                kind: CompletionItemKind.Function,
            };
            result.items.push(suggest);
        }
        return result;
    };
    SCSSCompletion.variableDefaults = {
        '$red': '1',
        '$green': '2',
        '$blue': '3',
        '$alpha': '1.0',
        '$color': '#000000',
        '$weight': '0.5',
        '$hue': '0',
        '$saturation': '0%',
        '$lightness': '0%',
        '$degrees': '0',
        '$amount': '0',
        '$string': '""',
        '$substring': '"s"',
        '$number': '0',
        '$limit': '1'
    };
    SCSSCompletion.colorProposals = [
        { func: 'red($color)', desc: localize$9('scss.builtin.red', 'Gets the red component of a color.') },
        { func: 'green($color)', desc: localize$9('scss.builtin.green', 'Gets the green component of a color.') },
        { func: 'blue($color)', desc: localize$9('scss.builtin.blue', 'Gets the blue component of a color.') },
        { func: 'mix($color, $color, [$weight])', desc: localize$9('scss.builtin.mix', 'Mixes two colors together.') },
        { func: 'hue($color)', desc: localize$9('scss.builtin.hue', 'Gets the hue component of a color.') },
        { func: 'saturation($color)', desc: localize$9('scss.builtin.saturation', 'Gets the saturation component of a color.') },
        { func: 'lightness($color)', desc: localize$9('scss.builtin.lightness', 'Gets the lightness component of a color.') },
        { func: 'adjust-hue($color, $degrees)', desc: localize$9('scss.builtin.adjust-hue', 'Changes the hue of a color.') },
        { func: 'lighten($color, $amount)', desc: localize$9('scss.builtin.lighten', 'Makes a color lighter.') },
        { func: 'darken($color, $amount)', desc: localize$9('scss.builtin.darken', 'Makes a color darker.') },
        { func: 'saturate($color, $amount)', desc: localize$9('scss.builtin.saturate', 'Makes a color more saturated.') },
        { func: 'desaturate($color, $amount)', desc: localize$9('scss.builtin.desaturate', 'Makes a color less saturated.') },
        { func: 'grayscale($color)', desc: localize$9('scss.builtin.grayscale', 'Converts a color to grayscale.') },
        { func: 'complement($color)', desc: localize$9('scss.builtin.complement', 'Returns the complement of a color.') },
        { func: 'invert($color)', desc: localize$9('scss.builtin.invert', 'Returns the inverse of a color.') },
        { func: 'alpha($color)', desc: localize$9('scss.builtin.alpha', 'Gets the opacity component of a color.') },
        { func: 'opacity($color)', desc: 'Gets the alpha component (opacity) of a color.' },
        { func: 'rgba($color, $alpha)', desc: localize$9('scss.builtin.rgba', 'Changes the alpha component for a color.') },
        { func: 'opacify($color, $amount)', desc: localize$9('scss.builtin.opacify', 'Makes a color more opaque.') },
        { func: 'fade-in($color, $amount)', desc: localize$9('scss.builtin.fade-in', 'Makes a color more opaque.') },
        { func: 'transparentize($color, $amount)', desc: localize$9('scss.builtin.transparentize', 'Makes a color more transparent.') },
        { func: 'fade-out($color, $amount)', desc: localize$9('scss.builtin.fade-out', 'Makes a color more transparent.') },
        { func: 'adjust-color($color, [$red], [$green], [$blue], [$hue], [$saturation], [$lightness], [$alpha])', desc: localize$9('scss.builtin.adjust-color', 'Increases or decreases one or more components of a color.') },
        { func: 'scale-color($color, [$red], [$green], [$blue], [$saturation], [$lightness], [$alpha])', desc: localize$9('scss.builtin.scale-color', 'Fluidly scales one or more properties of a color.') },
        { func: 'change-color($color, [$red], [$green], [$blue], [$hue], [$saturation], [$lightness], [$alpha])', desc: localize$9('scss.builtin.change-color', 'Changes one or more properties of a color.') },
        { func: 'ie-hex-str($color)', desc: localize$9('scss.builtin.ie-hex-str', 'Converts a color into the format understood by IE filters.') }
    ];
    SCSSCompletion.selectorFuncs = [
        { func: 'selector-nest($selectors…)', desc: localize$9('scss.builtin.selector-nest', 'Nests selector beneath one another like they would be nested in the stylesheet.') },
        { func: 'selector-append($selectors…)', desc: localize$9('scss.builtin.selector-append', 'Appends selectors to one another without spaces in between.') },
        { func: 'selector-extend($selector, $extendee, $extender)', desc: localize$9('scss.builtin.selector-extend', 'Extends $extendee with $extender within $selector.') },
        { func: 'selector-replace($selector, $original, $replacement)', desc: localize$9('scss.builtin.selector-replace', 'Replaces $original with $replacement within $selector.') },
        { func: 'selector-unify($selector1, $selector2)', desc: localize$9('scss.builtin.selector-unify', 'Unifies two selectors to produce a selector that matches elements matched by both.') },
        { func: 'is-superselector($super, $sub)', desc: localize$9('scss.builtin.is-superselector', 'Returns whether $super matches all the elements $sub does, and possibly more.') },
        { func: 'simple-selectors($selector)', desc: localize$9('scss.builtin.simple-selectors', 'Returns the simple selectors that comprise a compound selector.') },
        { func: 'selector-parse($selector)', desc: localize$9('scss.builtin.selector-parse', 'Parses a selector into the format returned by &.') }
    ];
    SCSSCompletion.builtInFuncs = [
        { func: 'unquote($string)', desc: localize$9('scss.builtin.unquote', 'Removes quotes from a string.') },
        { func: 'quote($string)', desc: localize$9('scss.builtin.quote', 'Adds quotes to a string.') },
        { func: 'str-length($string)', desc: localize$9('scss.builtin.str-length', 'Returns the number of characters in a string.') },
        { func: 'str-insert($string, $insert, $index)', desc: localize$9('scss.builtin.str-insert', 'Inserts $insert into $string at $index.') },
        { func: 'str-index($string, $substring)', desc: localize$9('scss.builtin.str-index', 'Returns the index of the first occurance of $substring in $string.') },
        { func: 'str-slice($string, $start-at, [$end-at])', desc: localize$9('scss.builtin.str-slice', 'Extracts a substring from $string.') },
        { func: 'to-upper-case($string)', desc: localize$9('scss.builtin.to-upper-case', 'Converts a string to upper case.') },
        { func: 'to-lower-case($string)', desc: localize$9('scss.builtin.to-lower-case', 'Converts a string to lower case.') },
        { func: 'percentage($number)', desc: localize$9('scss.builtin.percentage', 'Converts a unitless number to a percentage.'), type: 'percentage' },
        { func: 'round($number)', desc: localize$9('scss.builtin.round', 'Rounds a number to the nearest whole number.') },
        { func: 'ceil($number)', desc: localize$9('scss.builtin.ceil', 'Rounds a number up to the next whole number.') },
        { func: 'floor($number)', desc: localize$9('scss.builtin.floor', 'Rounds a number down to the previous whole number.') },
        { func: 'abs($number)', desc: localize$9('scss.builtin.abs', 'Returns the absolute value of a number.') },
        { func: 'min($numbers)', desc: localize$9('scss.builtin.min', 'Finds the minimum of several numbers.') },
        { func: 'max($numbers)', desc: localize$9('scss.builtin.max', 'Finds the maximum of several numbers.') },
        { func: 'random([$limit])', desc: localize$9('scss.builtin.random', 'Returns a random number.') },
        { func: 'length($list)', desc: localize$9('scss.builtin.length', 'Returns the length of a list.') },
        { func: 'nth($list, $n)', desc: localize$9('scss.builtin.nth', 'Returns a specific item in a list.') },
        { func: 'set-nth($list, $n, $value)', desc: localize$9('scss.builtin.set-nth', 'Replaces the nth item in a list.') },
        { func: 'join($list1, $list2, [$separator])', desc: localize$9('scss.builtin.join', 'Joins together two lists into one.') },
        { func: 'append($list1, $val, [$separator])', desc: localize$9('scss.builtin.append', 'Appends a single value onto the end of a list.') },
        { func: 'zip($lists)', desc: localize$9('scss.builtin.zip', 'Combines several lists into a single multidimensional list.') },
        { func: 'index($list, $value)', desc: localize$9('scss.builtin.index', 'Returns the position of a value within a list.') },
        { func: 'list-separator(#list)', desc: localize$9('scss.builtin.list-separator', 'Returns the separator of a list.') },
        { func: 'map-get($map, $key)', desc: localize$9('scss.builtin.map-get', 'Returns the value in a map associated with a given key.') },
        { func: 'map-merge($map1, $map2)', desc: localize$9('scss.builtin.map-merge', 'Merges two maps together into a new map.') },
        { func: 'map-remove($map, $keys)', desc: localize$9('scss.builtin.map-remove', 'Returns a new map with keys removed.') },
        { func: 'map-keys($map)', desc: localize$9('scss.builtin.map-keys', 'Returns a list of all keys in a map.') },
        { func: 'map-values($map)', desc: localize$9('scss.builtin.map-values', 'Returns a list of all values in a map.') },
        { func: 'map-has-key($map, $key)', desc: localize$9('scss.builtin.map-has-key', 'Returns whether a map has a value associated with a given key.') },
        { func: 'keywords($args)', desc: localize$9('scss.builtin.keywords', 'Returns the keywords passed to a function that takes variable arguments.') },
        { func: 'feature-exists($feature)', desc: localize$9('scss.builtin.feature-exists', 'Returns whether a feature exists in the current Sass runtime.') },
        { func: 'variable-exists($name)', desc: localize$9('scss.builtin.variable-exists', 'Returns whether a variable with the given name exists in the current scope.') },
        { func: 'global-variable-exists($name)', desc: localize$9('scss.builtin.global-variable-exists', 'Returns whether a variable with the given name exists in the global scope.') },
        { func: 'function-exists($name)', desc: localize$9('scss.builtin.function-exists', 'Returns whether a function with the given name exists.') },
        { func: 'mixin-exists($name)', desc: localize$9('scss.builtin.mixin-exists', 'Returns whether a mixin with the given name exists.') },
        { func: 'inspect($value)', desc: localize$9('scss.builtin.inspect', 'Returns the string representation of a value as it would be represented in Sass.') },
        { func: 'type-of($value)', desc: localize$9('scss.builtin.type-of', 'Returns the type of a value.') },
        { func: 'unit($number)', desc: localize$9('scss.builtin.unit', 'Returns the unit(s) associated with a number.') },
        { func: 'unitless($number)', desc: localize$9('scss.builtin.unitless', 'Returns whether a number has units.') },
        { func: 'comparable($number1, $number2)', desc: localize$9('scss.builtin.comparable', 'Returns whether two numbers can be added, subtracted, or compared.') },
        { func: 'call($name, $args…)', desc: localize$9('scss.builtin.call', 'Dynamically calls a Sass function.') }
    ];
    return SCSSCompletion;
}(CSSCompletion));

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _FSL$2 = '/'.charCodeAt(0);
var _NWL$2 = '\n'.charCodeAt(0);
var _CAR$2 = '\r'.charCodeAt(0);
var _LFD$2 = '\f'.charCodeAt(0);
var _TIC = '`'.charCodeAt(0);
var _DOT$2 = '.'.charCodeAt(0);
var customTokenValue$1 = TokenType.CustomToken;
var Ellipsis$1 = customTokenValue$1++;
var LESSScanner = /** @class */ (function (_super) {
    __extends$6(LESSScanner, _super);
    function LESSScanner() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LESSScanner.prototype.scanNext = function (offset) {
        // LESS: escaped JavaScript code `let a = "dddd"`
        var tokenType = this.escapedJavaScript();
        if (tokenType !== null) {
            return this.finishToken(offset, tokenType);
        }
        if (this.stream.advanceIfChars([_DOT$2, _DOT$2, _DOT$2])) {
            return this.finishToken(offset, Ellipsis$1);
        }
        return _super.prototype.scanNext.call(this, offset);
    };
    LESSScanner.prototype.comment = function () {
        if (_super.prototype.comment.call(this)) {
            return true;
        }
        if (!this.inURL && this.stream.advanceIfChars([_FSL$2, _FSL$2])) {
            this.stream.advanceWhileChar(function (ch) {
                switch (ch) {
                    case _NWL$2:
                    case _CAR$2:
                    case _LFD$2:
                        return false;
                    default:
                        return true;
                }
            });
            return true;
        }
        else {
            return false;
        }
    };
    LESSScanner.prototype.escapedJavaScript = function () {
        var ch = this.stream.peekChar();
        if (ch === _TIC) {
            this.stream.advance(1);
            this.stream.advanceWhileChar(function (ch) { return ch !== _TIC; });
            return this.stream.advanceIfChar(_TIC) ? TokenType.EscapedJavaScript : TokenType.BadEscapedJavaScript;
        }
        return null;
    };
    return LESSScanner;
}(Scanner));

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <summary>
/// A parser for LESS
/// http://lesscss.org/
/// </summary>
var LESSParser = /** @class */ (function (_super) {
    __extends$7(LESSParser, _super);
    function LESSParser() {
        return _super.call(this, new LESSScanner()) || this;
    }
    LESSParser.prototype._parseStylesheetStatement = function () {
        return this._tryParseMixinDeclaration()
            || this._tryParseMixinReference(true)
            || _super.prototype._parseStylesheetStatement.call(this)
            || this._parseVariableDeclaration()
            || this._parsePlugin();
    };
    LESSParser.prototype._parseImport = function () {
        if (!this.peekKeyword('@import') && !this.peekKeyword('@import-once') /* deprecated in less 1.4.1 */) {
            return null;
        }
        var node = this.create(Import);
        this.consumeToken();
        // less 1.4.1: @import (css) "lib"
        if (this.accept(TokenType.ParenthesisL)) {
            if (!this.accept(TokenType.Ident)) {
                return this.finish(node, ParseError.IdentifierExpected, [TokenType.SemiColon]);
            }
            do {
                if (!this.accept(TokenType.Comma)) {
                    break;
                }
            } while (this.accept(TokenType.Ident));
            if (!this.accept(TokenType.ParenthesisR)) {
                return this.finish(node, ParseError.RightParenthesisExpected, [TokenType.SemiColon]);
            }
        }
        if (!node.addChild(this._parseURILiteral()) && !node.addChild(this._parseStringLiteral())) {
            return this.finish(node, ParseError.URIOrStringExpected, [TokenType.SemiColon]);
        }
        if (!this.peek(TokenType.SemiColon) && !this.peek(TokenType.EOF)) {
            node.setMedialist(this._parseMediaQueryList());
        }
        return this.finish(node);
    };
    LESSParser.prototype._parsePlugin = function () {
        if (!this.peekKeyword('@plugin')) {
            return null;
        }
        var node = this.createNode(NodeType.Plugin);
        this.consumeToken(); // @import
        if (!node.addChild(this._parseStringLiteral())) {
            return this.finish(node, ParseError.StringLiteralExpected);
        }
        if (!this.accept(TokenType.SemiColon)) {
            return this.finish(node, ParseError.SemiColonExpected);
        }
        return this.finish(node);
    };
    LESSParser.prototype._parseMediaQuery = function (resyncStopToken) {
        var node = _super.prototype._parseMediaQuery.call(this, resyncStopToken);
        if (!node) {
            var node_1 = this.create(MediaQuery);
            if (node_1.addChild(this._parseVariable())) {
                return this.finish(node_1);
            }
            return null;
        }
        return node;
    };
    LESSParser.prototype._parseMediaDeclaration = function (isNested) {
        if (isNested === void 0) { isNested = false; }
        return this._tryParseRuleset(isNested)
            || this._tryToParseDeclaration()
            || this._tryParseMixinDeclaration()
            || this._tryParseMixinReference()
            || this._parseDetachedRuleSetMixin()
            || this._parseStylesheetStatement();
    };
    LESSParser.prototype._parseMediaFeatureName = function () {
        return this._parseIdent() || this._parseVariable();
    };
    LESSParser.prototype._parseVariableDeclaration = function (panic) {
        if (panic === void 0) { panic = []; }
        var node = this.create(VariableDeclaration);
        var mark = this.mark();
        if (!node.setVariable(this._parseVariable())) {
            return null;
        }
        if (this.accept(TokenType.Colon)) {
            node.colonPosition = this.prevToken.offset;
            if (!node.setValue(this._parseDetachedRuleSet() || this._parseExpr())) {
                return this.finish(node, ParseError.VariableValueExpected, [], panic);
            }
            node.addChild(this._parsePrio());
        }
        else {
            this.restoreAtMark(mark);
            return null; // at keyword, but no ':', not a variable declaration but some at keyword
        }
        if (this.peek(TokenType.SemiColon)) {
            node.semicolonPosition = this.token.offset; // not part of the declaration, but useful information for code assist
        }
        return this.finish(node);
    };
    LESSParser.prototype._parseDetachedRuleSet = function () {
        if (!this.peek(TokenType.CurlyL)) {
            return null;
        }
        var content = this.create(BodyDeclaration);
        this._parseBody(content, this._parseDetachedRuleSetBody.bind(this));
        return this.finish(content);
    };
    LESSParser.prototype._parseDetachedRuleSetBody = function () {
        return this._tryParseKeyframeSelector() || _super.prototype._parseRuleSetDeclaration.call(this);
    };
    LESSParser.prototype._parseVariable = function () {
        if (!this.peekDelim('@') && !this.peek(TokenType.AtKeyword)) {
            return null;
        }
        var node = this.create(Variable);
        var mark = this.mark();
        while (this.acceptDelim('@')) {
            if (this.hasWhitespace()) {
                this.restoreAtMark(mark);
                return null;
            }
        }
        if (!this.accept(TokenType.AtKeyword)) {
            this.restoreAtMark(mark);
            return null;
        }
        return node;
    };
    LESSParser.prototype._parseTerm = function () {
        var term = _super.prototype._parseTerm.call(this);
        if (term) {
            return term;
        }
        term = this.create(Term);
        if (term.setExpression(this._parseVariable()) ||
            term.setExpression(this._parseEscaped())) {
            return this.finish(term);
        }
        return null;
    };
    LESSParser.prototype._parseEscaped = function () {
        if (this.peek(TokenType.EscapedJavaScript) ||
            this.peek(TokenType.BadEscapedJavaScript)) {
            var node = this.createNode(NodeType.EscapedValue);
            this.consumeToken();
            return this.finish(node);
        }
        if (this.peekDelim('~')) {
            var node = this.createNode(NodeType.EscapedValue);
            this.consumeToken();
            return this.finish(node, this.accept(TokenType.String) ? null : ParseError.TermExpected);
        }
        return null;
    };
    LESSParser.prototype._parseOperator = function () {
        var node = this._parseGuardOperator();
        if (node) {
            return node;
        }
        else {
            return _super.prototype._parseOperator.call(this);
        }
    };
    LESSParser.prototype._parseGuardOperator = function () {
        if (this.peekDelim('>')) {
            var node = this.createNode(NodeType.Operator);
            this.consumeToken();
            this.acceptDelim('=');
            return node;
        }
        else if (this.peekDelim('=')) {
            var node = this.createNode(NodeType.Operator);
            this.consumeToken();
            this.acceptDelim('<');
            return node;
        }
        else if (this.peekDelim('<')) {
            var node = this.createNode(NodeType.Operator);
            this.consumeToken();
            this.acceptDelim('=');
            return node;
        }
        return null;
    };
    LESSParser.prototype._parseRuleSetDeclaration = function () {
        if (this.peek(TokenType.AtKeyword)) {
            return this._parseKeyframe()
                || this._parseMedia(true)
                || this._parseImport()
                || this._parseSupports(true) // @supports
                || this._parseDetachedRuleSetMixin() // less detached ruleset mixin
                || this._parseVariableDeclaration(); // Variable declarations
        }
        return this._tryParseMixinDeclaration()
            || this._tryParseRuleset(true) // nested ruleset
            || this._tryParseMixinReference() // less mixin reference
            || this._parseExtend() // less extend declaration
            || _super.prototype._parseRuleSetDeclaration.call(this); // try css ruleset declaration as the last option
    };
    LESSParser.prototype._parseKeyframeIdent = function () {
        return this._parseIdent([ReferenceType.Keyframe]) || this._parseVariable();
    };
    LESSParser.prototype._parseKeyframeSelector = function () {
        return this._parseDetachedRuleSetMixin() // less detached ruleset mixin
            || _super.prototype._parseKeyframeSelector.call(this);
    };
    LESSParser.prototype._parseSimpleSelectorBody = function () {
        return this._parseSelectorCombinator() || _super.prototype._parseSimpleSelectorBody.call(this);
    };
    LESSParser.prototype._parseSelector = function (isNested) {
        // CSS Guards
        var node = this.create(Selector);
        var hasContent = false;
        if (isNested) {
            // nested selectors can start with a combinator
            hasContent = node.addChild(this._parseCombinator());
        }
        while (node.addChild(this._parseSimpleSelector())) {
            hasContent = true;
            var mark = this.mark();
            if (node.addChild(this._parseGuard()) && this.peek(TokenType.CurlyL)) {
                break;
            }
            this.restoreAtMark(mark);
            node.addChild(this._parseCombinator()); // optional
        }
        return hasContent ? this.finish(node) : null;
    };
    LESSParser.prototype._parseSelectorCombinator = function () {
        if (this.peekDelim('&')) {
            var node = this.createNode(NodeType.SelectorCombinator);
            this.consumeToken();
            while (!this.hasWhitespace() && (this.acceptDelim('-') || this.accept(TokenType.Num) || this.accept(TokenType.Dimension) || node.addChild(this._parseIdent()) || this.acceptDelim('&'))) {
                //  support &-foo
            }
            return this.finish(node);
        }
        return null;
    };
    LESSParser.prototype._parseSelectorIdent = function () {
        if (!this.peekInterpolatedIdent()) {
            return null;
        }
        var node = this.createNode(NodeType.SelectorInterpolation);
        var hasContent = this._acceptInterpolatedIdent(node);
        return hasContent ? this.finish(node) : null;
    };
    LESSParser.prototype._parsePropertyIdentifier = function () {
        if (!this.peekInterpolatedIdent()) {
            return null;
        }
        var node = this.create(Identifier);
        node.isCustomProperty = this.peekRegExp(TokenType.Ident, /^--/);
        var hasContent = this._acceptInterpolatedIdent(node);
        if (hasContent && !this.hasWhitespace()) {
            this.acceptDelim('+');
            if (!this.hasWhitespace()) {
                this.acceptIdent('_');
            }
        }
        return hasContent ? this.finish(node) : null;
    };
    LESSParser.prototype.peekInterpolatedIdent = function () {
        return this.peek(TokenType.Ident) || this.peekDelim('@') || this.peekDelim('-');
    };
    LESSParser.prototype._acceptInterpolatedIdent = function (node) {
        var _this = this;
        var hasContent = false;
        var delimWithInterpolation = function () {
            if (!_this.acceptDelim('-')) {
                return null;
            }
            if (!_this.hasWhitespace() && _this.acceptDelim('-')) ;
            if (!_this.hasWhitespace()) {
                return _this._parseInterpolation();
            }
            return null;
        };
        while (this.accept(TokenType.Ident) || node.addChild(this._parseInterpolation() || this.try(delimWithInterpolation))) {
            hasContent = true;
            if (!this.hasWhitespace() && this.acceptDelim('-')) ;
            if (this.hasWhitespace()) {
                break;
            }
        }
        return hasContent;
    };
    LESSParser.prototype._parseInterpolation = function () {
        //  @{name}
        var mark = this.mark();
        if (this.peekDelim('@')) {
            var node = this.createNode(NodeType.Interpolation);
            this.consumeToken();
            if (this.hasWhitespace() || !this.accept(TokenType.CurlyL)) {
                this.restoreAtMark(mark);
                return null;
            }
            if (!node.addChild(this._parseIdent())) {
                return this.finish(node, ParseError.IdentifierExpected);
            }
            if (!this.accept(TokenType.CurlyR)) {
                return this.finish(node, ParseError.RightCurlyExpected);
            }
            return this.finish(node);
        }
        return null;
    };
    LESSParser.prototype._tryParseMixinDeclaration = function () {
        var mark = this.mark();
        var node = this.create(MixinDeclaration);
        if (!node.setIdentifier(this._parseMixinDeclarationIdentifier()) || !this.accept(TokenType.ParenthesisL)) {
            this.restoreAtMark(mark);
            return null;
        }
        if (node.getParameters().addChild(this._parseMixinParameter())) {
            while (this.accept(TokenType.Comma) || this.accept(TokenType.SemiColon)) {
                if (this.peek(TokenType.ParenthesisR)) {
                    break;
                }
                if (!node.getParameters().addChild(this._parseMixinParameter())) {
                    this.markError(node, ParseError.IdentifierExpected, [], [TokenType.ParenthesisR]);
                }
            }
        }
        if (!this.accept(TokenType.ParenthesisR)) {
            this.restoreAtMark(mark);
            return null;
        }
        node.setGuard(this._parseGuard());
        if (!this.peek(TokenType.CurlyL)) {
            this.restoreAtMark(mark);
            return null;
        }
        return this._parseBody(node, this._parseMixInBodyDeclaration.bind(this));
    };
    LESSParser.prototype._parseMixInBodyDeclaration = function () {
        return this._parseFontFace() || this._parseRuleSetDeclaration();
    };
    LESSParser.prototype._parseMixinDeclarationIdentifier = function () {
        var identifier;
        if (this.peekDelim('#') || this.peekDelim('.')) {
            identifier = this.create(Identifier);
            this.consumeToken(); // # or .
            if (this.hasWhitespace() || !identifier.addChild(this._parseIdent())) {
                return null;
            }
        }
        else if (this.peek(TokenType.Hash)) {
            identifier = this.create(Identifier);
            this.consumeToken(); // TokenType.Hash
        }
        else {
            return null;
        }
        identifier.referenceTypes = [ReferenceType.Mixin];
        return this.finish(identifier);
    };
    LESSParser.prototype._parsePseudo = function () {
        if (!this.peek(TokenType.Colon)) {
            return null;
        }
        var mark = this.mark();
        var node = this.create(ExtendsReference);
        this.consumeToken(); // :
        if (this.acceptIdent('extend')) {
            return this._completeExtends(node);
        }
        this.restoreAtMark(mark);
        return _super.prototype._parsePseudo.call(this);
    };
    LESSParser.prototype._parseExtend = function () {
        if (!this.peekDelim('&')) {
            return null;
        }
        var mark = this.mark();
        var node = this.create(ExtendsReference);
        this.consumeToken(); // &
        if (this.hasWhitespace() || !this.accept(TokenType.Colon) || !this.acceptIdent('extend')) {
            this.restoreAtMark(mark);
            return null;
        }
        return this._completeExtends(node);
    };
    LESSParser.prototype._completeExtends = function (node) {
        if (!this.accept(TokenType.ParenthesisL)) {
            return this.finish(node, ParseError.LeftParenthesisExpected);
        }
        var selectors = node.getSelectors();
        if (!selectors.addChild(this._parseSelector(true))) {
            return this.finish(node, ParseError.SelectorExpected);
        }
        while (this.accept(TokenType.Comma)) {
            if (!selectors.addChild(this._parseSelector(true))) {
                return this.finish(node, ParseError.SelectorExpected);
            }
        }
        if (!this.accept(TokenType.ParenthesisR)) {
            return this.finish(node, ParseError.RightParenthesisExpected);
        }
        return this.finish(node);
    };
    LESSParser.prototype._parseDetachedRuleSetMixin = function () {
        if (!this.peek(TokenType.AtKeyword)) {
            return null;
        }
        var mark = this.mark();
        var node = this.create(MixinReference);
        if (!node.addChild(this._parseVariable()) || !this.accept(TokenType.ParenthesisL)) {
            this.restoreAtMark(mark);
            return null;
        }
        if (!this.accept(TokenType.ParenthesisR)) {
            return this.finish(node, ParseError.RightParenthesisExpected);
        }
        return this.finish(node);
    };
    LESSParser.prototype._tryParseMixinReference = function (atRoot) {
        if (atRoot === void 0) { atRoot = false; }
        var mark = this.mark();
        var node = this.create(MixinReference);
        var identifier = this._parseMixinDeclarationIdentifier();
        while (identifier) {
            this.acceptDelim('>');
            var nextId = this._parseMixinDeclarationIdentifier();
            if (nextId) {
                node.getNamespaces().addChild(identifier);
                identifier = nextId;
            }
            else {
                break;
            }
        }
        if (!node.setIdentifier(identifier)) {
            this.restoreAtMark(mark);
            return null;
        }
        var hasArguments = false;
        if (!this.hasWhitespace() && this.accept(TokenType.ParenthesisL)) {
            hasArguments = true;
            if (node.getArguments().addChild(this._parseMixinArgument())) {
                while (this.accept(TokenType.Comma) || this.accept(TokenType.SemiColon)) {
                    if (this.peek(TokenType.ParenthesisR)) {
                        break;
                    }
                    if (!node.getArguments().addChild(this._parseMixinArgument())) {
                        return this.finish(node, ParseError.ExpressionExpected);
                    }
                }
            }
            if (!this.accept(TokenType.ParenthesisR)) {
                return this.finish(node, ParseError.RightParenthesisExpected);
            }
            identifier.referenceTypes = [ReferenceType.Mixin];
        }
        else {
            identifier.referenceTypes = [ReferenceType.Mixin, ReferenceType.Rule];
        }
        node.addChild(this._parsePrio());
        if (!hasArguments && !this.peek(TokenType.SemiColon) && !this.peek(TokenType.CurlyR) && !this.peek(TokenType.EOF)) {
            this.restoreAtMark(mark);
            return null;
        }
        return this.finish(node);
    };
    LESSParser.prototype._parseMixinArgument = function () {
        // [variableName ':'] expression | variableName '...'
        var node = this.create(FunctionArgument);
        var pos = this.mark();
        var argument = this._parseVariable();
        if (argument) {
            if (!this.accept(TokenType.Colon)) {
                this.restoreAtMark(pos);
            }
            else {
                node.setIdentifier(argument);
            }
        }
        if (node.setValue(this._parseDetachedRuleSet() || this._parseExpr(true))) {
            return this.finish(node);
        }
        this.restoreAtMark(pos);
        return null;
    };
    LESSParser.prototype._parseMixinParameter = function () {
        var node = this.create(FunctionParameter);
        // special rest variable: @rest...
        if (this.peekKeyword('@rest')) {
            var restNode = this.create(Node$1);
            this.consumeToken();
            if (!this.accept(Ellipsis$1)) {
                return this.finish(node, ParseError.DotExpected, [], [TokenType.Comma, TokenType.ParenthesisR]);
            }
            node.setIdentifier(this.finish(restNode));
            return this.finish(node);
        }
        // special let args: ...
        if (this.peek(Ellipsis$1)) {
            var varargsNode = this.create(Node$1);
            this.consumeToken();
            node.setIdentifier(this.finish(varargsNode));
            return this.finish(node);
        }
        var hasContent = false;
        // default variable declaration: @param: 12 or @name
        if (node.setIdentifier(this._parseVariable())) {
            this.accept(TokenType.Colon);
            hasContent = true;
        }
        if (!node.setDefaultValue(this._parseExpr(true)) && !hasContent) {
            return null;
        }
        return this.finish(node);
    };
    LESSParser.prototype._parseGuard = function () {
        if (!this.peekIdent('when')) {
            return null;
        }
        var node = this.create(LessGuard);
        this.consumeToken(); // when
        node.isNegated = this.acceptIdent('not');
        if (!node.getConditions().addChild(this._parseGuardCondition())) {
            return this.finish(node, ParseError.ConditionExpected);
        }
        while (this.acceptIdent('and') || this.accept(TokenType.Comma)) {
            if (!node.getConditions().addChild(this._parseGuardCondition())) {
                return this.finish(node, ParseError.ConditionExpected);
            }
        }
        return this.finish(node);
    };
    LESSParser.prototype._parseGuardCondition = function () {
        if (!this.peek(TokenType.ParenthesisL)) {
            return null;
        }
        var node = this.create(GuardCondition);
        this.consumeToken(); // ParenthesisL
        if (!node.addChild(this._parseExpr())) ;
        if (!this.accept(TokenType.ParenthesisR)) {
            return this.finish(node, ParseError.RightParenthesisExpected);
        }
        return this.finish(node);
    };
    LESSParser.prototype._parseFunctionIdentifier = function () {
        if (this.peekDelim('%')) {
            var node = this.create(Identifier);
            node.referenceTypes = [ReferenceType.Function];
            this.consumeToken();
            return this.finish(node);
        }
        return _super.prototype._parseFunctionIdentifier.call(this);
    };
    LESSParser.prototype._parseURLArgument = function () {
        var pos = this.mark();
        var node = _super.prototype._parseURLArgument.call(this);
        if (!node || !this.peek(TokenType.ParenthesisR)) {
            this.restoreAtMark(pos);
            var node_2 = this.create(Node$1);
            node_2.addChild(this._parseBinaryExpr());
            return this.finish(node_2);
        }
        return node;
    };
    return LESSParser;
}(Parser));

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var localize$a = loadMessageBundle();
var LESSCompletion = /** @class */ (function (_super) {
    __extends$8(LESSCompletion, _super);
    function LESSCompletion() {
        return _super.call(this, '@') || this;
    }
    LESSCompletion.prototype.createFunctionProposals = function (proposals, existingNode, sortToEnd, result) {
        for (var _i = 0, proposals_1 = proposals; _i < proposals_1.length; _i++) {
            var p = proposals_1[_i];
            var item = {
                label: p.name,
                detail: p.example,
                documentation: p.description,
                textEdit: TextEdit.replace(this.getCompletionRange(existingNode), p.name + '($0)'),
                insertTextFormat: InsertTextFormat.Snippet,
                kind: CompletionItemKind.Function
            };
            if (sortToEnd) {
                item.sortText = 'z';
            }
            result.items.push(item);
        }
        return result;
    };
    LESSCompletion.prototype.getTermProposals = function (entry, existingNode, result) {
        var functions = LESSCompletion.builtInProposals;
        if (entry) {
            functions = functions.filter(function (f) { return !f.type || entry.restrictions.indexOf(f.type) !== -1; });
        }
        this.createFunctionProposals(functions, existingNode, true, result);
        return _super.prototype.getTermProposals.call(this, entry, existingNode, result);
    };
    LESSCompletion.prototype.getColorProposals = function (entry, existingNode, result) {
        this.createFunctionProposals(LESSCompletion.colorProposals, existingNode, false, result);
        return _super.prototype.getColorProposals.call(this, entry, existingNode, result);
    };
    LESSCompletion.prototype.getCompletionsForDeclarationProperty = function (declaration, result) {
        this.getCompletionsForSelector(null, true, result);
        return _super.prototype.getCompletionsForDeclarationProperty.call(this, declaration, result);
    };
    LESSCompletion.builtInProposals = [
        {
            'name': 'escape',
            'example': 'escape(@string);',
            'description': localize$a('less.builtin.escape', 'URL encodes a string')
        },
        {
            'name': 'e',
            'example': 'e(@string);',
            'description': localize$a('less.builtin.e', 'escape string content')
        },
        {
            'name': 'replace',
            'example': 'replace(@string, @pattern, @replacement[, @flags]);',
            'description': localize$a('less.builtin.replace', 'string replace')
        },
        {
            'name': 'unit',
            'example': 'unit(@dimension, [@unit: \'\']);',
            'description': localize$a('less.builtin.unit', 'remove or change the unit of a dimension')
        },
        {
            'name': 'color',
            'example': 'color(@string);',
            'description': localize$a('less.builtin.color', 'parses a string to a color'),
            'type': 'color'
        },
        {
            'name': 'convert',
            'example': 'convert(@value, unit);',
            'description': localize$a('less.builtin.convert', 'converts numbers from one type into another')
        },
        {
            'name': 'data-uri',
            'example': 'data-uri([mimetype,] url);',
            'description': localize$a('less.builtin.data-uri', 'inlines a resource and falls back to `url()`'),
            'type': 'url'
        },
        {
            'name': 'length',
            'example': 'length(@list);',
            'description': localize$a('less.builtin.length', 'returns the number of elements in a value list')
        },
        {
            'name': 'extract',
            'example': 'extract(@list, index);',
            'description': localize$a('less.builtin.extract', 'returns a value at the specified position in the list')
        },
        {
            'name': 'abs',
            'description': localize$a('less.builtin.abs', 'absolute value of a number'),
            'example': 'abs(number);'
        },
        {
            'name': 'acos',
            'description': localize$a('less.builtin.acos', 'arccosine - inverse of cosine function'),
            'example': 'acos(number);'
        },
        {
            'name': 'asin',
            'description': localize$a('less.builtin.asin', 'arcsine - inverse of sine function'),
            'example': 'asin(number);'
        },
        {
            'name': 'ceil',
            'example': 'ceil(@number);',
            'description': localize$a('less.builtin.ceil', 'rounds up to an integer')
        },
        {
            'name': 'cos',
            'description': localize$a('less.builtin.cos', 'cosine function'),
            'example': 'cos(number);'
        },
        {
            'name': 'floor',
            'description': localize$a('less.builtin.floor', 'rounds down to an integer'),
            'example': 'floor(@number);'
        },
        {
            'name': 'percentage',
            'description': localize$a('less.builtin.percentage', 'converts to a %, e.g. 0.5 > 50%'),
            'example': 'percentage(@number);',
            'type': 'percentage'
        },
        {
            'name': 'round',
            'description': localize$a('less.builtin.round', 'rounds a number to a number of places'),
            'example': 'round(number, [places: 0]);'
        },
        {
            'name': 'sqrt',
            'description': localize$a('less.builtin.sqrt', 'calculates square root of a number'),
            'example': 'sqrt(number);'
        },
        {
            'name': 'sin',
            'description': localize$a('less.builtin.sin', 'sine function'),
            'example': 'sin(number);'
        },
        {
            'name': 'tan',
            'description': localize$a('less.builtin.tan', 'tangent function'),
            'example': 'tan(number);'
        },
        {
            'name': 'atan',
            'description': localize$a('less.builtin.atan', 'arctangent - inverse of tangent function'),
            'example': 'atan(number);'
        },
        {
            'name': 'pi',
            'description': localize$a('less.builtin.pi', 'returns pi'),
            'example': 'pi();'
        },
        {
            'name': 'pow',
            'description': localize$a('less.builtin.pow', 'first argument raised to the power of the second argument'),
            'example': 'pow(@base, @exponent);'
        },
        {
            'name': 'mod',
            'description': localize$a('less.builtin.mod', 'first argument modulus second argument'),
            'example': 'mod(number, number);'
        },
        {
            'name': 'min',
            'description': localize$a('less.builtin.min', 'returns the lowest of one or more values'),
            'example': 'min(@x, @y);'
        },
        {
            'name': 'max',
            'description': localize$a('less.builtin.max', 'returns the lowest of one or more values'),
            'example': 'max(@x, @y);'
        }
    ];
    LESSCompletion.colorProposals = [
        {
            'name': 'argb',
            'example': 'argb(@color);',
            'description': localize$a('less.builtin.argb', 'creates a #AARRGGBB')
        },
        {
            'name': 'hsl',
            'example': 'hsl(@hue, @saturation, @lightness);',
            'description': localize$a('less.builtin.hsl', 'creates a color')
        },
        {
            'name': 'hsla',
            'example': 'hsla(@hue, @saturation, @lightness, @alpha);',
            'description': localize$a('less.builtin.hsla', 'creates a color')
        },
        {
            'name': 'hsv',
            'example': 'hsv(@hue, @saturation, @value);',
            'description': localize$a('less.builtin.hsv', 'creates a color')
        },
        {
            'name': 'hsva',
            'example': 'hsva(@hue, @saturation, @value, @alpha);',
            'description': localize$a('less.builtin.hsva', 'creates a color')
        },
        {
            'name': 'hue',
            'example': 'hue(@color);',
            'description': localize$a('less.builtin.hue', 'returns the `hue` channel of `@color` in the HSL space')
        },
        {
            'name': 'saturation',
            'example': 'saturation(@color);',
            'description': localize$a('less.builtin.saturation', 'returns the `saturation` channel of `@color` in the HSL space')
        },
        {
            'name': 'lightness',
            'example': 'lightness(@color);',
            'description': localize$a('less.builtin.lightness', 'returns the `lightness` channel of `@color` in the HSL space')
        },
        {
            'name': 'hsvhue',
            'example': 'hsvhue(@color);',
            'description': localize$a('less.builtin.hsvhue', 'returns the `hue` channel of `@color` in the HSV space')
        },
        {
            'name': 'hsvsaturation',
            'example': 'hsvsaturation(@color);',
            'description': localize$a('less.builtin.hsvsaturation', 'returns the `saturation` channel of `@color` in the HSV space')
        },
        {
            'name': 'hsvvalue',
            'example': 'hsvvalue(@color);',
            'description': localize$a('less.builtin.hsvvalue', 'returns the `value` channel of `@color` in the HSV space')
        },
        {
            'name': 'red',
            'example': 'red(@color);',
            'description': localize$a('less.builtin.red', 'returns the `red` channel of `@color`')
        },
        {
            'name': 'green',
            'example': 'green(@color);',
            'description': localize$a('less.builtin.green', 'returns the `green` channel of `@color`')
        },
        {
            'name': 'blue',
            'example': 'blue(@color);',
            'description': localize$a('less.builtin.blue', 'returns the `blue` channel of `@color`')
        },
        {
            'name': 'alpha',
            'example': 'alpha(@color);',
            'description': localize$a('less.builtin.alpha', 'returns the `alpha` channel of `@color`')
        },
        {
            'name': 'luma',
            'example': 'luma(@color);',
            'description': localize$a('less.builtin.luma', 'returns the `luma` value (perceptual brightness) of `@color`')
        },
        {
            'name': 'saturate',
            'example': 'saturate(@color, 10%);',
            'description': localize$a('less.builtin.saturate', 'return `@color` 10% points more saturated')
        },
        {
            'name': 'desaturate',
            'example': 'desaturate(@color, 10%);',
            'description': localize$a('less.builtin.desaturate', 'return `@color` 10% points less saturated')
        },
        {
            'name': 'lighten',
            'example': 'lighten(@color, 10%);',
            'description': localize$a('less.builtin.lighten', 'return `@color` 10% points lighter')
        },
        {
            'name': 'darken',
            'example': 'darken(@color, 10%);',
            'description': localize$a('less.builtin.darken', 'return `@color` 10% points darker')
        },
        {
            'name': 'fadein',
            'example': 'fadein(@color, 10%);',
            'description': localize$a('less.builtin.fadein', 'return `@color` 10% points less transparent')
        },
        {
            'name': 'fadeout',
            'example': 'fadeout(@color, 10%);',
            'description': localize$a('less.builtin.fadeout', 'return `@color` 10% points more transparent')
        },
        {
            'name': 'fade',
            'example': 'fade(@color, 50%);',
            'description': localize$a('less.builtin.fade', 'return `@color` with 50% transparency')
        },
        {
            'name': 'spin',
            'example': 'spin(@color, 10);',
            'description': localize$a('less.builtin.spin', 'return `@color` with a 10 degree larger in hue')
        },
        {
            'name': 'mix',
            'example': 'mix(@color1, @color2, [@weight: 50%]);',
            'description': localize$a('less.builtin.mix', 'return a mix of `@color1` and `@color2`')
        },
        {
            'name': 'greyscale',
            'example': 'greyscale(@color);',
            'description': localize$a('less.builtin.greyscale', 'returns a grey, 100% desaturated color'),
        },
        {
            'name': 'contrast',
            'example': 'contrast(@color1, [@darkcolor: black], [@lightcolor: white], [@threshold: 43%]);',
            'description': localize$a('less.builtin.contrast', 'return `@darkcolor` if `@color1 is> 43% luma` otherwise return `@lightcolor`, see notes')
        },
        {
            'name': 'multiply',
            'example': 'multiply(@color1, @color2);'
        },
        {
            'name': 'screen',
            'example': 'screen(@color1, @color2);'
        },
        {
            'name': 'overlay',
            'example': 'overlay(@color1, @color2);'
        },
        {
            'name': 'softlight',
            'example': 'softlight(@color1, @color2);'
        },
        {
            'name': 'hardlight',
            'example': 'hardlight(@color1, @color2);'
        },
        {
            'name': 'difference',
            'example': 'difference(@color1, @color2);'
        },
        {
            'name': 'exclusion',
            'example': 'exclusion(@color1, @color2);'
        },
        {
            'name': 'average',
            'example': 'average(@color1, @color2);'
        },
        {
            'name': 'negation',
            'example': 'negation(@color1, @color2);'
        }
    ];
    return LESSCompletion;
}(CSSCompletion));

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function createFacade(parser, completion, hover, navigation, codeActions, validation) {
    return {
        configure: validation.configure.bind(validation),
        doValidation: validation.doValidation.bind(validation),
        parseStylesheet: parser.parseStylesheet.bind(parser),
        doComplete: completion.doComplete.bind(completion),
        setCompletionParticipants: completion.setCompletionParticipants.bind(completion),
        doHover: hover.doHover.bind(hover),
        findDefinition: navigation.findDefinition.bind(navigation),
        findReferences: navigation.findReferences.bind(navigation),
        findDocumentHighlights: navigation.findDocumentHighlights.bind(navigation),
        findDocumentSymbols: navigation.findDocumentSymbols.bind(navigation),
        doCodeActions: codeActions.doCodeActions.bind(codeActions),
        findColorSymbols: function (d, s) { return navigation.findDocumentColors(d, s).map(function (s) { return s.range; }); },
        findDocumentColors: navigation.findDocumentColors.bind(navigation),
        getColorPresentations: navigation.getColorPresentations.bind(navigation),
        doRename: navigation.doRename.bind(navigation),
    };
}
function getCSSLanguageService() {
    return createFacade(new Parser(), new CSSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}
function getSCSSLanguageService() {
    return createFacade(new SCSSParser(), new SCSSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}
function getLESSLanguageService() {
    return createFacade(new LESSParser(), new LESSCompletion(), new CSSHover(), new CSSNavigation(), new CSSCodeActions(), new CSSValidation());
}

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var Promise$1 = monaco.Promise;
var CSSWorker = /** @class */ (function () {
    function CSSWorker(ctx, createData) {
        this._ctx = ctx;
        this._languageSettings = createData.languageSettings;
        this._languageId = createData.languageId;
        switch (this._languageId) {
            case 'css':
                this._languageService = getCSSLanguageService();
                break;
            case 'less':
                this._languageService = getLESSLanguageService();
                break;
            case 'scss':
                this._languageService = getSCSSLanguageService();
                break;
            default:
                throw new Error('Invalid language id: ' + this._languageId);
        }
        this._languageService.configure(this._languageSettings);
    }
    // --- language service host ---------------
    CSSWorker.prototype.doValidation = function (uri) {
        var document = this._getTextDocument(uri);
        if (document) {
            var stylesheet = this._languageService.parseStylesheet(document);
            var diagnostics = this._languageService.doValidation(document, stylesheet);
            return Promise$1.as(diagnostics);
        }
        return Promise$1.as([]);
    };
    CSSWorker.prototype.doComplete = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var completions = this._languageService.doComplete(document, position, stylesheet);
        return Promise$1.as(completions);
    };
    CSSWorker.prototype.doHover = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var hover = this._languageService.doHover(document, position, stylesheet);
        return Promise$1.as(hover);
    };
    CSSWorker.prototype.findDefinition = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var definition = this._languageService.findDefinition(document, position, stylesheet);
        return Promise$1.as(definition);
    };
    CSSWorker.prototype.findReferences = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var references = this._languageService.findReferences(document, position, stylesheet);
        return Promise$1.as(references);
    };
    CSSWorker.prototype.findDocumentHighlights = function (uri, position) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var highlights = this._languageService.findDocumentHighlights(document, position, stylesheet);
        return Promise$1.as(highlights);
    };
    CSSWorker.prototype.findDocumentSymbols = function (uri) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var symbols = this._languageService.findDocumentSymbols(document, stylesheet);
        return Promise$1.as(symbols);
    };
    CSSWorker.prototype.doCodeActions = function (uri, range, context) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var actions = this._languageService.doCodeActions(document, range, context, stylesheet);
        return Promise$1.as(actions);
    };
    CSSWorker.prototype.findDocumentColors = function (uri) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var colorSymbols = this._languageService.findDocumentColors(document, stylesheet);
        return Promise$1.as(colorSymbols);
    };
    CSSWorker.prototype.getColorPresentations = function (uri, color, range) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var colorPresentations = this._languageService.getColorPresentations(document, stylesheet, color, range);
        return Promise$1.as(colorPresentations);
    };
    CSSWorker.prototype.doRename = function (uri, position, newName) {
        var document = this._getTextDocument(uri);
        var stylesheet = this._languageService.parseStylesheet(document);
        var renames = this._languageService.doRename(document, position, newName, stylesheet);
        return Promise$1.as(renames);
    };
    CSSWorker.prototype._getTextDocument = function (uri) {
        var models = this._ctx.getMirrorModels();
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            if (model.uri.toString() === uri) {
                return TextDocument.create(uri, this._languageId, model.version, model.getValue());
            }
        }
        return null;
    };
    return CSSWorker;
}());

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
self.onmessage = function () {
    // ignore the first message
    initialize(function (ctx, createData) {
        return new CSSWorker(ctx, createData);
    });
};
//# sourceMappingURL=css.worker.js.map
