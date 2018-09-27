import '../../monaco/basic-languages.js';
import '../../monaco/base.js';
import '../../monaco/editor.js';
import '../../monaco/workers.js';

var Emitter = monaco.Emitter;
// --- JSON configuration and defaults ---------
var LanguageServiceDefaultsImpl = /** @class */ (function () {
    function LanguageServiceDefaultsImpl(languageId, diagnosticsOptions) {
        this._onDidChange = new Emitter();
        this._languageId = languageId;
        this.setDiagnosticsOptions(diagnosticsOptions);
    }
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "languageId", {
        get: function () {
            return this._languageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "diagnosticsOptions", {
        get: function () {
            return this._diagnosticsOptions;
        },
        enumerable: true,
        configurable: true
    });
    LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
        this._diagnosticsOptions = options || Object.create(null);
        this._onDidChange.fire(this);
    };
    return LanguageServiceDefaultsImpl;
}());
var diagnosticDefault = {
    validate: true,
    allowComments: true,
    schemas: []
};
var jsonDefaults = new LanguageServiceDefaultsImpl('json', diagnosticDefault);
// Export API
function createAPI() {
    return {
        jsonDefaults: jsonDefaults,
    };
}
monaco.languages.json = createAPI();
// --- Registration to monaco editor ---
function getMode() {
    return monaco.Promise.wrap(import("./jsonMode.js"));
}
monaco.languages.register({
    id: 'json',
    extensions: ['.json', '.bowerrc', '.jshintrc', '.jscsrc', '.eslintrc', '.babelrc'],
    aliases: ['JSON', 'json'],
    mimetypes: ['application/json'],
});
monaco.languages.onLanguage('json', function () {
    getMode().then(function (mode) { return mode.setupMode(jsonDefaults); });
});

export { LanguageServiceDefaultsImpl };
//# sourceMappingURL=json.js.map
