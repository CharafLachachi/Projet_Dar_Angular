(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/router'), require('@angular/forms'), require('@angular/common/http'), require('@nebular/theme'), require('rxjs'), require('rxjs/operators')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/router', '@angular/forms', '@angular/common/http', '@nebular/theme', 'rxjs', 'rxjs/operators'], factory) :
	(factory((global.nb = global.nb || {}, global.nb.auth = global.nb.auth || {}),global.ng.core,global.ng.common,global.ng.router,global.ng.forms,global.ng.common.http,global.nb.theme,global.Rx,global.Rx.operators));
}(this, (function (exports,_angular_core,_angular_common,_angular_router,_angular_forms,_angular_common_http,_nebular_theme,rxjs,rxjs_operators) { 'use strict';

var socialLinks = [];
var defaultAuthOptions = {
    strategies: [],
    forms: {
        login: {
            redirectDelay: 500,
            // delay before redirect after a successful login, while success message is shown to the user
            strategy: 'email',
            // provider id key. If you have multiple strategies, or what to use your own
            rememberMe: true,
            // whether to show or not the `rememberMe` checkbox
            showMessages: {
                // show/not show success/error messages
                success: true,
                error: true,
            },
            socialLinks: socialLinks,
        },
        register: {
            redirectDelay: 500,
            strategy: 'email',
            showMessages: {
                success: true,
                error: true,
            },
            terms: true,
            socialLinks: socialLinks,
        },
        requestPassword: {
            redirectDelay: 500,
            strategy: 'email',
            showMessages: {
                success: true,
                error: true,
            },
            socialLinks: socialLinks,
        },
        resetPassword: {
            redirectDelay: 500,
            strategy: 'email',
            showMessages: {
                success: true,
                error: true,
            },
            socialLinks: socialLinks,
        },
        logout: {
            redirectDelay: 500,
            strategy: 'email',
        },
        validation: {
            password: {
                required: true,
                minLength: 4,
                maxLength: 50,
            },
            email: {
                required: true,
            },
            fullName: {
                required: false,
                minLength: 4,
                maxLength: 50,
            },
        },
    },
};
var NB_AUTH_OPTIONS = new _angular_core.InjectionToken('Nebular Auth Options');
var NB_AUTH_USER_OPTIONS = new _angular_core.InjectionToken('Nebular User Auth Options');
var NB_AUTH_STRATEGIES = new _angular_core.InjectionToken('Nebular Auth Strategies');
var NB_AUTH_TOKENS = new _angular_core.InjectionToken('Nebular Auth Tokens');
var NB_AUTH_INTERCEPTOR_HEADER = new _angular_core.InjectionToken('Nebular Simple Interceptor Header');

/**
 * Extending object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
var deepExtend = function () {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    if (arguments.length < 1 || typeof arguments[0] !== 'object') {
        return false;
    }
    if (arguments.length < 2) {
        return arguments[0];
    }
    var target = arguments[0];
    // convert arguments to array and cut off target object
    var args = Array.prototype.slice.call(arguments, 1);
    var val, src;
    args.forEach(function (obj) {
        // skip argument if it is array or isn't object
        if (typeof obj !== 'object' || Array.isArray(obj)) {
            return;
        }
        Object.keys(obj).forEach(function (key) {
            src = target[key]; // source value
            val = obj[key]; // new value
            // recursion prevention
            if (val === target) {
                return;
                /**
                         * if new value isn't object then just overwrite by new value
                         * instead of extending.
                         */
            }
            else if (typeof val !== 'object' || val === null) {
                target[key] = val;
                return;
                // just clone arrays (and recursive clone objects inside)
            }
            else if (Array.isArray(val)) {
                target[key] = deepCloneArray(val);
                return;
                // custom cloning and overwrite for specific objects
            }
            else if (isSpecificValue(val)) {
                target[key] = cloneSpecificValue(val);
                return;
                // overwrite by new value if source isn't object or array
            }
            else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
                target[key] = deepExtend({}, val);
                return;
                // source value and new value is objects both, extending...
            }
            else {
                target[key] = deepExtend(src, val);
                return;
            }
        });
    });
    return target;
};
function isSpecificValue(val) {
    return (val instanceof Date
        || val instanceof RegExp) ? true : false;
}
function cloneSpecificValue(val) {
    if (val instanceof Date) {
        return new Date(val.getTime());
    }
    else if (val instanceof RegExp) {
        return new RegExp(val);
    }
    else {
        throw new Error('cloneSpecificValue: Unexpected situation');
    }
}
/**
 * Recursive cloning array.
 */
function deepCloneArray(arr) {
    var clone = [];
    arr.forEach(function (item, index) {
        if (typeof item === 'object' && item !== null) {
            if (Array.isArray(item)) {
                clone[index] = deepCloneArray(item);
            }
            else if (isSpecificValue(item)) {
                clone[index] = cloneSpecificValue(item);
            }
            else {
                clone[index] = deepExtend({}, item);
            }
        }
        else {
            clone[index] = item;
        }
    });
    return clone;
}
// getDeepFromObject({result: {data: 1}}, 'result.data', 2); // returns 1
function getDeepFromObject(object, name, defaultValue) {
    if (object === void 0) { object = {}; }
    var keys = name.split('.');
    // clone the object
    var level = deepExtend({}, object || {});
    keys.forEach(function (k) {
        if (level && typeof level[k] !== 'undefined') {
            level = level[k];
        }
        else {
            level = undefined;
        }
    });
    return typeof level === 'undefined' ? defaultValue : level;
}
function urlBase64Decode(str) {
    var output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: {
            break;
        }
        case 2: {
            output += '==';
            break;
        }
        case 3: {
            output += '=';
            break;
        }
        default: {
            throw new Error('Illegal base64url string!');
        }
    }
    return b64DecodeUnicode(output);
}
function b64decode(str) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = '';
    str = String(str).replace(/=+$/, '');
    if (str.length % 4 === 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
    // initialize result and counters
    var bc = 0, bs = void 0, buffer = void 0, idx = 0; 
    // get next character
    buffer = str.charAt(idx++); 
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    return output;
}
// https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(b64decode(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

var __extends$1 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NbAuthToken = /** @class */ (function () {
    function NbAuthToken() {
    }
    NbAuthToken.prototype.getName = function () {
        return this.constructor.NAME;
    };
    return NbAuthToken;
}());
function nbAuthCreateToken(tokenClass, token, ownerStrategyName, createdAt) {
    return new tokenClass(token, ownerStrategyName, createdAt);
}
function decodeJwtPayload(payload) {
    if (!payload) {
        throw new Error('Cannot extract payload from an empty token.');
    }
    var parts = payload.split('.');
    if (parts.length !== 3) {
        throw new Error("The payload " + payload + " is not valid JWT payload and must consist of three parts.");
    }
    var decoded;
    try {
        decoded = urlBase64Decode(parts[1]);
    }
    catch (e) {
        throw new Error("The payload " + payload + " is not valid JWT payload and cannot be parsed.");
    }
    if (!decoded) {
        throw new Error("The payload " + payload + " is not valid JWT payload and cannot be decoded.");
    }
    return JSON.parse(decoded);
}
/**
 * Wrapper for simple (text) token
 */
var NbAuthSimpleToken = /** @class */ (function (_super) {
    __extends$1(NbAuthSimpleToken, _super);
    function NbAuthSimpleToken(token, ownerStrategyName, createdAt) {
        var _this = _super.call(this) || this;
        _this.token = token;
        _this.ownerStrategyName = ownerStrategyName;
        _this.createdAt = createdAt;
        _this.createdAt = _this.prepareCreatedAt(createdAt);
        return _this;
    }
    NbAuthSimpleToken.prototype.prepareCreatedAt = function (date) {
        return date ? date : new Date();
    };
    /**
     * Returns the token's creation date
     * @returns {Date}
     */
    /**
       * Returns the token's creation date
       * @returns {Date}
       */
    NbAuthSimpleToken.prototype.getCreatedAt = /**
       * Returns the token's creation date
       * @returns {Date}
       */
    function () {
        return this.createdAt;
    };
    /**
     * Returns the token value
     * @returns string
     */
    /**
       * Returns the token value
       * @returns string
       */
    NbAuthSimpleToken.prototype.getValue = /**
       * Returns the token value
       * @returns string
       */
    function () {
        return this.token;
    };
    NbAuthSimpleToken.prototype.getOwnerStrategyName = function () {
        return this.ownerStrategyName;
    };
    NbAuthSimpleToken.prototype.getPayload = function () {
        return null;
    };
    /**
     * Is non empty and valid
     * @returns {boolean}
     */
    /**
       * Is non empty and valid
       * @returns {boolean}
       */
    NbAuthSimpleToken.prototype.isValid = /**
       * Is non empty and valid
       * @returns {boolean}
       */
    function () {
        return !!this.getValue();
    };
    /**
     * Validate value and convert to string, if value is not valid return empty string
     * @returns {string}
     */
    /**
       * Validate value and convert to string, if value is not valid return empty string
       * @returns {string}
       */
    NbAuthSimpleToken.prototype.toString = /**
       * Validate value and convert to string, if value is not valid return empty string
       * @returns {string}
       */
    function () {
        return !!this.token ? this.token : '';
    };
    NbAuthSimpleToken.NAME = 'nb:auth:simple:token';
    return NbAuthSimpleToken;
}(NbAuthToken));
/**
 * Wrapper for JWT token with additional methods.
 */
var NbAuthJWTToken = /** @class */ (function (_super) {
    __extends$1(NbAuthJWTToken, _super);
    function NbAuthJWTToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * for JWT token, the iat (issued at) field of the token payload contains the creation Date
     */
    /**
       * for JWT token, the iat (issued at) field of the token payload contains the creation Date
       */
    NbAuthJWTToken.prototype.prepareCreatedAt = /**
       * for JWT token, the iat (issued at) field of the token payload contains the creation Date
       */
    function (date) {
        var decoded;
        try {
            decoded = this.getPayload();
        }
        finally {
            return decoded && decoded.iat ? new Date(Number(decoded.iat) * 1000) : _super.prototype.prepareCreatedAt.call(this, date);
        }
    };
    /**
     * Returns payload object
     * @returns any
     */
    /**
       * Returns payload object
       * @returns any
       */
    NbAuthJWTToken.prototype.getPayload = /**
       * Returns payload object
       * @returns any
       */
    function () {
        return decodeJwtPayload(this.token);
    };
    /**
     * Returns expiration date
     * @returns Date
     */
    /**
       * Returns expiration date
       * @returns Date
       */
    NbAuthJWTToken.prototype.getTokenExpDate = /**
       * Returns expiration date
       * @returns Date
       */
    function () {
        var decoded = this.getPayload();
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        var date = new Date(0);
        date.setUTCSeconds(decoded.exp); // 'cause jwt token are set in seconds
        return date;
    };
    /**
     * Is data expired
     * @returns {boolean}
     */
    /**
       * Is data expired
       * @returns {boolean}
       */
    NbAuthJWTToken.prototype.isValid = /**
       * Is data expired
       * @returns {boolean}
       */
    function () {
        return _super.prototype.isValid.call(this) && (!this.getTokenExpDate() || new Date() < this.getTokenExpDate());
    };
    NbAuthJWTToken.NAME = 'nb:auth:jwt:token';
    return NbAuthJWTToken;
}(NbAuthSimpleToken));
var prepareOAuth2Token = function (data) {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        }
        catch (e) { }
    }
    return data;
};
var ɵ0 = prepareOAuth2Token;
/**
 * Wrapper for OAuth2 token whose access_token is a JWT Token
 */
var NbAuthOAuth2Token = /** @class */ (function (_super) {
    __extends$1(NbAuthOAuth2Token, _super);
    function NbAuthOAuth2Token(data, ownerStrategyName, createdAt) {
        if (data === void 0) { data = {}; }
        // we may get it as string when retrieving from a storage
        return _super.call(this, prepareOAuth2Token(data), ownerStrategyName, createdAt) || this;
    }
    /**
     * Returns the token value
     * @returns string
     */
    /**
       * Returns the token value
       * @returns string
       */
    NbAuthOAuth2Token.prototype.getValue = /**
       * Returns the token value
       * @returns string
       */
    function () {
        return this.token.access_token;
    };
    /**
     * Returns the refresh token
     * @returns string
     */
    /**
       * Returns the refresh token
       * @returns string
       */
    NbAuthOAuth2Token.prototype.getRefreshToken = /**
       * Returns the refresh token
       * @returns string
       */
    function () {
        return this.token.refresh_token;
    };
    /**
     *  put refreshToken in the token payload
      * @param refreshToken
     */
    /**
       *  put refreshToken in the token payload
        * @param refreshToken
       */
    NbAuthOAuth2Token.prototype.setRefreshToken = /**
       *  put refreshToken in the token payload
        * @param refreshToken
       */
    function (refreshToken) {
        this.token.refresh_token = refreshToken;
    };
    /**
     * Returns token payload
     * @returns any
     */
    /**
       * Returns token payload
       * @returns any
       */
    NbAuthOAuth2Token.prototype.getPayload = /**
       * Returns token payload
       * @returns any
       */
    function () {
        if (!this.token || !Object.keys(this.token).length) {
            throw new Error('Cannot extract payload from an empty token.');
        }
        return this.token;
    };
    /**
     * Returns the token type
     * @returns string
     */
    /**
       * Returns the token type
       * @returns string
       */
    NbAuthOAuth2Token.prototype.getType = /**
       * Returns the token type
       * @returns string
       */
    function () {
        return this.token.token_type;
    };
    /**
     * Is data expired
     * @returns {boolean}
     */
    /**
       * Is data expired
       * @returns {boolean}
       */
    NbAuthOAuth2Token.prototype.isValid = /**
       * Is data expired
       * @returns {boolean}
       */
    function () {
        return _super.prototype.isValid.call(this) && (!this.getTokenExpDate() || new Date() < this.getTokenExpDate());
    };
    /**
     * Returns expiration date
     * @returns Date
     */
    /**
       * Returns expiration date
       * @returns Date
       */
    NbAuthOAuth2Token.prototype.getTokenExpDate = /**
       * Returns expiration date
       * @returns Date
       */
    function () {
        if (!this.token.hasOwnProperty('expires_in')) {
            return null;
        }
        return new Date(this.createdAt.getTime() + Number(this.token.expires_in) * 1000);
    };
    /**
     * Convert to string
     * @returns {string}
     */
    /**
       * Convert to string
       * @returns {string}
       */
    NbAuthOAuth2Token.prototype.toString = /**
       * Convert to string
       * @returns {string}
       */
    function () {
        return JSON.stringify(this.token);
    };
    NbAuthOAuth2Token.NAME = 'nb:auth:oauth2:token';
    return NbAuthOAuth2Token;
}(NbAuthSimpleToken));
/**
 * Wrapper for OAuth2 token
 */
var NbAuthOAuth2JWTToken = /** @class */ (function (_super) {
    __extends$1(NbAuthOAuth2JWTToken, _super);
    function NbAuthOAuth2JWTToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * for Oauth2 JWT token, the iat (issued at) field of the access_token payload
     */
    /**
       * for Oauth2 JWT token, the iat (issued at) field of the access_token payload
       */
    NbAuthOAuth2JWTToken.prototype.prepareCreatedAt = /**
       * for Oauth2 JWT token, the iat (issued at) field of the access_token payload
       */
    function (date) {
        var decoded;
        try {
            decoded = this.getAccessTokenPayload();
        }
        finally {
            return decoded && decoded.iat ? new Date(Number(decoded.iat) * 1000) : _super.prototype.prepareCreatedAt.call(this, date);
        }
    };
    /**
     * Returns access token payload
     * @returns any
     */
    /**
       * Returns access token payload
       * @returns any
       */
    NbAuthOAuth2JWTToken.prototype.getAccessTokenPayload = /**
       * Returns access token payload
       * @returns any
       */
    function () {
        return decodeJwtPayload(this.getValue());
    };
    /**
     * Returns expiration date :
     * - exp if set,
     * - super.getExpDate() otherwise
     * @returns Date
     */
    /**
       * Returns expiration date :
       * - exp if set,
       * - super.getExpDate() otherwise
       * @returns Date
       */
    NbAuthOAuth2JWTToken.prototype.getTokenExpDate = /**
       * Returns expiration date :
       * - exp if set,
       * - super.getExpDate() otherwise
       * @returns Date
       */
    function () {
        var accessTokenPayload = this.getAccessTokenPayload();
        if (accessTokenPayload.hasOwnProperty('exp')) {
            var date = new Date(0);
            date.setUTCSeconds(accessTokenPayload.exp);
            return date;
        }
        else {
            return _super.prototype.getTokenExpDate.call(this);
        }
    };
    NbAuthOAuth2JWTToken.NAME = 'nb:auth:oauth2:jwt:token';
    return NbAuthOAuth2JWTToken;
}(NbAuthOAuth2Token));

var NB_AUTH_FALLBACK_TOKEN = new _angular_core.InjectionToken('Nebular Auth Options');
/**
 * Creates a token parcel which could be stored/restored
 */
var NbAuthTokenParceler = /** @class */ (function () {
    function NbAuthTokenParceler(fallbackClass, tokenClasses) {
        this.fallbackClass = fallbackClass;
        this.tokenClasses = tokenClasses;
    }
    NbAuthTokenParceler.prototype.wrap = function (token) {
        return JSON.stringify({
            name: token.getName(),
            ownerStrategyName: token.getOwnerStrategyName(),
            createdAt: token.getCreatedAt().getTime(),
            value: token.toString(),
        });
    };
    NbAuthTokenParceler.prototype.unwrap = function (value) {
        var tokenClass = this.fallbackClass;
        var tokenValue = '';
        var tokenOwnerStrategyName = '';
        var tokenCreatedAt = null;
        var tokenPack = this.parseTokenPack(value);
        if (tokenPack) {
            tokenClass = this.getClassByName(tokenPack.name) || this.fallbackClass;
            tokenValue = tokenPack.value;
            tokenOwnerStrategyName = tokenPack.ownerStrategyName;
            tokenCreatedAt = new Date(Number(tokenPack.createdAt));
        }
        return nbAuthCreateToken(tokenClass, tokenValue, tokenOwnerStrategyName, tokenCreatedAt);
    };
    // TODO: this could be moved to a separate token registry
    // TODO: this could be moved to a separate token registry
    NbAuthTokenParceler.prototype.getClassByName = 
    // TODO: this could be moved to a separate token registry
    function (name) {
        return this.tokenClasses.find(function (tokenClass) { return tokenClass.NAME === name; });
    };
    NbAuthTokenParceler.prototype.parseTokenPack = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (e) { }
        return null;
    };
    NbAuthTokenParceler.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    NbAuthTokenParceler.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_FALLBACK_TOKEN,] },] },
        { type: Array, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_TOKENS,] },] },
    ]; };
    return NbAuthTokenParceler;
}());

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NbTokenStorage = /** @class */ (function () {
    function NbTokenStorage() {
    }
    return NbTokenStorage;
}());
/**
 * Service that uses browser localStorage as a storage.
 *
 * The token storage is provided into auth module the following way:
 * ```ts
 * { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
 * ```
 *
 * If you need to change the storage behaviour or provide your own - just extend your class from basic `NbTokenStorage`
 * or `NbTokenLocalStorage` and provide in your `app.module`:
 * ```ts
 * { provide: NbTokenStorage, useClass: NbTokenCustomStorage },
 * ```
 *
 */
var NbTokenLocalStorage = /** @class */ (function (_super) {
    __extends(NbTokenLocalStorage, _super);
    function NbTokenLocalStorage(parceler) {
        var _this = _super.call(this) || this;
        _this.parceler = parceler;
        _this.key = 'auth_app_token';
        return _this;
    }
    /**
     * Returns token from localStorage
     * @returns {NbAuthToken}
     */
    /**
       * Returns token from localStorage
       * @returns {NbAuthToken}
       */
    NbTokenLocalStorage.prototype.get = /**
       * Returns token from localStorage
       * @returns {NbAuthToken}
       */
    function () {
        var raw = localStorage.getItem(this.key);
        return this.parceler.unwrap(raw);
    };
    /**
     * Sets token to localStorage
     * @param {NbAuthToken} token
     */
    /**
       * Sets token to localStorage
       * @param {NbAuthToken} token
       */
    NbTokenLocalStorage.prototype.set = /**
       * Sets token to localStorage
       * @param {NbAuthToken} token
       */
    function (token) {
        var raw = this.parceler.wrap(token);
        localStorage.setItem(this.key, raw);
    };
    /**
     * Clears token from localStorage
     */
    /**
       * Clears token from localStorage
       */
    NbTokenLocalStorage.prototype.clear = /**
       * Clears token from localStorage
       */
    function () {
        localStorage.removeItem(this.key);
    };
    NbTokenLocalStorage.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    NbTokenLocalStorage.ctorParameters = function () { return [
        { type: NbAuthTokenParceler, },
    ]; };
    return NbTokenLocalStorage;
}(NbTokenStorage));

/**
 * Service that allows you to manage authentication token - get, set, clear and also listen to token changes over time.
 */
var NbTokenService = /** @class */ (function () {
    function NbTokenService(tokenStorage) {
        this.tokenStorage = tokenStorage;
        this.token$ = new rxjs.BehaviorSubject(null);
        this.publishStoredToken();
    }
    /**
     * Publishes token when it changes.
     * @returns {Observable<NbAuthToken>}
     */
    /**
       * Publishes token when it changes.
       * @returns {Observable<NbAuthToken>}
       */
    NbTokenService.prototype.tokenChange = /**
       * Publishes token when it changes.
       * @returns {Observable<NbAuthToken>}
       */
    function () {
        return this.token$
            .pipe(rxjs_operators.filter(function (value) { return !!value; }), rxjs_operators.share());
    };
    /**
     * Sets a token into the storage. This method is used by the NbAuthService automatically.
     *
     * @param {NbAuthToken} token
     * @returns {Observable<any>}
     */
    /**
       * Sets a token into the storage. This method is used by the NbAuthService automatically.
       *
       * @param {NbAuthToken} token
       * @returns {Observable<any>}
       */
    NbTokenService.prototype.set = /**
       * Sets a token into the storage. This method is used by the NbAuthService automatically.
       *
       * @param {NbAuthToken} token
       * @returns {Observable<any>}
       */
    function (token) {
        this.tokenStorage.set(token);
        this.publishStoredToken();
        return rxjs.of(null);
    };
    /**
     * Returns observable of current token
     * @returns {Observable<NbAuthToken>}
     */
    /**
       * Returns observable of current token
       * @returns {Observable<NbAuthToken>}
       */
    NbTokenService.prototype.get = /**
       * Returns observable of current token
       * @returns {Observable<NbAuthToken>}
       */
    function () {
        var token = this.tokenStorage.get();
        return rxjs.of(token);
    };
    /**
     * Removes the token and published token value
     *
     * @returns {Observable<any>}
     */
    /**
       * Removes the token and published token value
       *
       * @returns {Observable<any>}
       */
    NbTokenService.prototype.clear = /**
       * Removes the token and published token value
       *
       * @returns {Observable<any>}
       */
    function () {
        this.tokenStorage.clear();
        this.publishStoredToken();
        return rxjs.of(null);
    };
    NbTokenService.prototype.publishStoredToken = function () {
        this.token$.next(this.tokenStorage.get());
    };
    NbTokenService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    NbTokenService.ctorParameters = function () { return [
        { type: NbTokenStorage, },
    ]; };
    return NbTokenService;
}());

/**
 * Common authentication service.
 * Should be used to as an interlayer between UI Components and Auth Strategy.
 */
var NbAuthService = /** @class */ (function () {
    function NbAuthService(tokenService, strategies) {
        this.tokenService = tokenService;
        this.strategies = strategies;
    }
    /**
     * Retrieves current authenticated token stored
     * @returns {Observable<any>}
     */
    /**
       * Retrieves current authenticated token stored
       * @returns {Observable<any>}
       */
    NbAuthService.prototype.getToken = /**
       * Retrieves current authenticated token stored
       * @returns {Observable<any>}
       */
    function () {
        return this.tokenService.get();
    };
    /**
     * Returns true if auth token is presented in the token storage
     * @returns {Observable<any>}
     */
    /**
       * Returns true if auth token is presented in the token storage
       * @returns {Observable<any>}
       */
    NbAuthService.prototype.isAuthenticated = /**
       * Returns true if auth token is presented in the token storage
       * @returns {Observable<any>}
       */
    function () {
        return this.getToken()
            .pipe(rxjs_operators.map(function (token) { return token.isValid(); }));
    };
    /**
     * Returns tokens stream
     * @returns {Observable<NbAuthSimpleToken>}
     */
    /**
       * Returns tokens stream
       * @returns {Observable<NbAuthSimpleToken>}
       */
    NbAuthService.prototype.onTokenChange = /**
       * Returns tokens stream
       * @returns {Observable<NbAuthSimpleToken>}
       */
    function () {
        return this.tokenService.tokenChange();
    };
    /**
     * Returns authentication status stream
     * @returns {Observable<boolean>}
     */
    /**
       * Returns authentication status stream
       * @returns {Observable<boolean>}
       */
    NbAuthService.prototype.onAuthenticationChange = /**
       * Returns authentication status stream
       * @returns {Observable<boolean>}
       */
    function () {
        return this.onTokenChange()
            .pipe(rxjs_operators.map(function (token) { return token.isValid(); }));
    };
    /**
     * Authenticates with the selected strategy
     * Stores received token in the token storage
     *
     * Example:
     * authenticate('email', {email: 'email@example.com', password: 'test'})
     *
     * @param strategyName
     * @param data
     * @returns {Observable<NbAuthResult>}
     */
    /**
       * Authenticates with the selected strategy
       * Stores received token in the token storage
       *
       * Example:
       * authenticate('email', {email: 'email@example.com', password: 'test'})
       *
       * @param strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    NbAuthService.prototype.authenticate = /**
       * Authenticates with the selected strategy
       * Stores received token in the token storage
       *
       * Example:
       * authenticate('email', {email: 'email@example.com', password: 'test'})
       *
       * @param strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    function (strategyName, data) {
        var _this = this;
        return this.getStrategy(strategyName).authenticate(data)
            .pipe(rxjs_operators.switchMap(function (result) {
            return _this.processResultToken(result);
        }));
    };
    /**
     * Registers with the selected strategy
     * Stores received token in the token storage
     *
     * Example:
     * register('email', {email: 'email@example.com', name: 'Some Name', password: 'test'})
     *
     * @param strategyName
     * @param data
     * @returns {Observable<NbAuthResult>}
     */
    /**
       * Registers with the selected strategy
       * Stores received token in the token storage
       *
       * Example:
       * register('email', {email: 'email@example.com', name: 'Some Name', password: 'test'})
       *
       * @param strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    NbAuthService.prototype.register = /**
       * Registers with the selected strategy
       * Stores received token in the token storage
       *
       * Example:
       * register('email', {email: 'email@example.com', name: 'Some Name', password: 'test'})
       *
       * @param strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    function (strategyName, data) {
        var _this = this;
        return this.getStrategy(strategyName).register(data)
            .pipe(rxjs_operators.switchMap(function (result) {
            return _this.processResultToken(result);
        }));
    };
    /**
     * Sign outs with the selected strategy
     * Removes token from the token storage
     *
     * Example:
     * logout('email')
     *
     * @param strategyName
     * @returns {Observable<NbAuthResult>}
     */
    /**
       * Sign outs with the selected strategy
       * Removes token from the token storage
       *
       * Example:
       * logout('email')
       *
       * @param strategyName
       * @returns {Observable<NbAuthResult>}
       */
    NbAuthService.prototype.logout = /**
       * Sign outs with the selected strategy
       * Removes token from the token storage
       *
       * Example:
       * logout('email')
       *
       * @param strategyName
       * @returns {Observable<NbAuthResult>}
       */
    function (strategyName) {
        var _this = this;
        return this.getStrategy(strategyName).logout()
            .pipe(rxjs_operators.switchMap(function (result) {
            if (result.isSuccess()) {
                _this.tokenService.clear()
                    .pipe(rxjs_operators.map(function () { return result; }));
            }
            return rxjs.of(result);
        }));
    };
    /**
     * Sends forgot password request to the selected strategy
     *
     * Example:
     * requestPassword('email', {email: 'email@example.com'})
     *
     * @param strategyName
     * @param data
     * @returns {Observable<NbAuthResult>}
     */
    /**
       * Sends forgot password request to the selected strategy
       *
       * Example:
       * requestPassword('email', {email: 'email@example.com'})
       *
       * @param strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    NbAuthService.prototype.requestPassword = /**
       * Sends forgot password request to the selected strategy
       *
       * Example:
       * requestPassword('email', {email: 'email@example.com'})
       *
       * @param strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    function (strategyName, data) {
        return this.getStrategy(strategyName).requestPassword(data);
    };
    /**
     * Tries to reset password with the selected strategy
     *
     * Example:
     * resetPassword('email', {newPassword: 'test'})
     *
     * @param strategyName
     * @param data
     * @returns {Observable<NbAuthResult>}
     */
    /**
       * Tries to reset password with the selected strategy
       *
       * Example:
       * resetPassword('email', {newPassword: 'test'})
       *
       * @param strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    NbAuthService.prototype.resetPassword = /**
       * Tries to reset password with the selected strategy
       *
       * Example:
       * resetPassword('email', {newPassword: 'test'})
       *
       * @param strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    function (strategyName, data) {
        return this.getStrategy(strategyName).resetPassword(data);
    };
    /**
     * Sends a refresh token request
     * Stores received token in the token storage
     *
     * Example:
     * refreshToken('email', {token: token})
     *
     * @param {string} strategyName
     * @param data
     * @returns {Observable<NbAuthResult>}
     */
    /**
       * Sends a refresh token request
       * Stores received token in the token storage
       *
       * Example:
       * refreshToken('email', {token: token})
       *
       * @param {string} strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    NbAuthService.prototype.refreshToken = /**
       * Sends a refresh token request
       * Stores received token in the token storage
       *
       * Example:
       * refreshToken('email', {token: token})
       *
       * @param {string} strategyName
       * @param data
       * @returns {Observable<NbAuthResult>}
       */
    function (strategyName, data) {
        var _this = this;
        return this.getStrategy(strategyName).refreshToken(data)
            .pipe(rxjs_operators.switchMap(function (result) {
            return _this.processResultToken(result);
        }));
    };
    /**
     * Get registered strategy by name
     *
     * Example:
     * getStrategy('email')
     *
     * @param {string} provider
     * @returns {NbAbstractAuthProvider}
     */
    /**
       * Get registered strategy by name
       *
       * Example:
       * getStrategy('email')
       *
       * @param {string} provider
       * @returns {NbAbstractAuthProvider}
       */
    NbAuthService.prototype.getStrategy = /**
       * Get registered strategy by name
       *
       * Example:
       * getStrategy('email')
       *
       * @param {string} provider
       * @returns {NbAbstractAuthProvider}
       */
    function (strategyName) {
        var found = this.strategies.find(function (strategy) { return strategy.getName() === strategyName; });
        if (!found) {
            throw new TypeError("There is no Auth Strategy registered under '" + strategyName + "' name");
        }
        return found;
    };
    NbAuthService.prototype.processResultToken = function (result) {
        if (result.isSuccess() && result.getToken()) {
            return this.tokenService.set(result.getToken())
                .pipe(rxjs_operators.map(function (token) {
                return result;
            }));
        }
        return rxjs.of(result);
    };
    NbAuthService.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    NbAuthService.ctorParameters = function () { return [
        { type: NbTokenService, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_STRATEGIES,] },] },
    ]; };
    return NbAuthService;
}());

var NbAuthResult = /** @class */ (function () {
    // TODO: better pass object
    function NbAuthResult(success, response, redirect, errors, messages, token) {
        if (token === void 0) { token = null; }
        this.success = success;
        this.response = response;
        this.redirect = redirect;
        this.errors = [];
        this.messages = [];
        this.errors = this.errors.concat([errors]);
        if (errors instanceof Array) {
            this.errors = errors;
        }
        this.messages = this.messages.concat([messages]);
        if (messages instanceof Array) {
            this.messages = messages;
        }
        this.token = token;
    }
    NbAuthResult.prototype.getResponse = function () {
        return this.response;
    };
    NbAuthResult.prototype.getToken = function () {
        return this.token;
    };
    NbAuthResult.prototype.getRedirect = function () {
        return this.redirect;
    };
    NbAuthResult.prototype.getErrors = function () {
        return this.errors.filter(function (val) { return !!val; });
    };
    NbAuthResult.prototype.getMessages = function () {
        return this.messages.filter(function (val) { return !!val; });
    };
    NbAuthResult.prototype.isSuccess = function () {
        return this.success;
    };
    NbAuthResult.prototype.isFailure = function () {
        return !this.success;
    };
    return NbAuthResult;
}());

var NbAuthJWTInterceptor = /** @class */ (function () {
    function NbAuthJWTInterceptor(injector) {
        this.injector = injector;
    }
    NbAuthJWTInterceptor.prototype.intercept = function (req, next) {
        return this.authService.getToken()
            .pipe(rxjs_operators.switchMap(function (token) {
            if (token.isValid()) {
                var JWT = "Bearer " + token.getValue();
                req = req.clone({
                    setHeaders: {
                        Authorization: JWT,
                    },
                });
            }
            return next.handle(req);
        }));
    };
    Object.defineProperty(NbAuthJWTInterceptor.prototype, "authService", {
        get: function () {
            return this.injector.get(NbAuthService);
        },
        enumerable: true,
        configurable: true
    });
    NbAuthJWTInterceptor.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    NbAuthJWTInterceptor.ctorParameters = function () { return [
        { type: _angular_core.Injector, },
    ]; };
    return NbAuthJWTInterceptor;
}());

var NbAuthSimpleInterceptor = /** @class */ (function () {
    function NbAuthSimpleInterceptor(injector, headerName) {
        if (headerName === void 0) { headerName = 'Authorization'; }
        this.injector = injector;
        this.headerName = headerName;
    }
    NbAuthSimpleInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        return this.authService.getToken()
            .pipe(rxjs_operators.switchMap(function (token) {
            if (token && token.getValue()) {
                req = req.clone({
                    setHeaders: (_a = {},
                        _a[_this.headerName] = token.getValue(),
                        _a),
                });
            }
            return next.handle(req);
            var _a;
        }));
    };
    Object.defineProperty(NbAuthSimpleInterceptor.prototype, "authService", {
        get: function () {
            return this.injector.get(NbAuthService);
        },
        enumerable: true,
        configurable: true
    });
    NbAuthSimpleInterceptor.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    NbAuthSimpleInterceptor.ctorParameters = function () { return [
        { type: _angular_core.Injector, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_INTERCEPTOR_HEADER,] },] },
    ]; };
    return NbAuthSimpleInterceptor;
}());

var NbAuthStrategy = /** @class */ (function () {
    function NbAuthStrategy() {
    }
    // we should keep this any and validation should be done in `register` method instead
    // otherwise it won't be possible to pass an empty object
    // we should keep this any and validation should be done in `register` method instead
    // otherwise it won't be possible to pass an empty object
    NbAuthStrategy.prototype.setOptions = 
    // we should keep this any and validation should be done in `register` method instead
    // otherwise it won't be possible to pass an empty object
    function (options) {
        this.options = deepExtend({}, this.defaultOptions, options);
    };
    NbAuthStrategy.prototype.getOption = function (key) {
        return getDeepFromObject(this.options, key, null);
    };
    NbAuthStrategy.prototype.createToken = function (value) {
        return nbAuthCreateToken(this.getOption('token.class'), value, this.getName());
    };
    NbAuthStrategy.prototype.getName = function () {
        return this.getOption('name');
    };
    NbAuthStrategy.prototype.createFailResponse = function (data) {
        return new _angular_common_http.HttpResponse({ body: {}, status: 401 });
    };
    NbAuthStrategy.prototype.createSuccessResponse = function (data) {
        return new _angular_common_http.HttpResponse({ body: {}, status: 200 });
    };
    NbAuthStrategy.prototype.getActionEndpoint = function (action) {
        var actionEndpoint = this.getOption(action + ".endpoint");
        var baseEndpoint = this.getOption('baseEndpoint');
        return baseEndpoint + actionEndpoint;
    };
    return NbAuthStrategy;
}());

var NbAuthStrategyOptions = /** @class */ (function () {
    function NbAuthStrategyOptions() {
    }
    return NbAuthStrategyOptions;
}());

var __extends$3 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NbDummyAuthStrategyOptions = /** @class */ (function (_super) {
    __extends$3(NbDummyAuthStrategyOptions, _super);
    function NbDummyAuthStrategyOptions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.token = {
            class: NbAuthSimpleToken,
        };
        _this.delay = 1000;
        _this.alwaysFail = false;
        return _this;
    }
    return NbDummyAuthStrategyOptions;
}(NbAuthStrategyOptions));
var dummyStrategyOptions = new NbDummyAuthStrategyOptions();

var __extends$2 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Dummy auth strategy. Could be useful for auth setup when backend is not available yet.
 *
 *
 * Strategy settings.
 *
 * ```ts
 * export class NbDummyAuthStrategyOptions extends NbAuthStrategyOptions {
 *   name = 'dummy';
 *   token = {
 *     class: NbAuthSimpleToken,
 *   };
 *   delay? = 1000;
 *   alwaysFail? = false;
 * }
 * ```
 */
var NbDummyAuthStrategy = /** @class */ (function (_super) {
    __extends$2(NbDummyAuthStrategy, _super);
    function NbDummyAuthStrategy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultOptions = dummyStrategyOptions;
        return _this;
    }
    NbDummyAuthStrategy.setup = function (options) {
        return [NbDummyAuthStrategy, options];
    };
    NbDummyAuthStrategy.prototype.authenticate = function (data) {
        return rxjs.of(this.createDummyResult(data))
            .pipe(rxjs_operators.delay(this.getOption('delay')));
    };
    NbDummyAuthStrategy.prototype.register = function (data) {
        return rxjs.of(this.createDummyResult(data))
            .pipe(rxjs_operators.delay(this.getOption('delay')));
    };
    NbDummyAuthStrategy.prototype.requestPassword = function (data) {
        return rxjs.of(this.createDummyResult(data))
            .pipe(rxjs_operators.delay(this.getOption('delay')));
    };
    NbDummyAuthStrategy.prototype.resetPassword = function (data) {
        return rxjs.of(this.createDummyResult(data))
            .pipe(rxjs_operators.delay(this.getOption('delay')));
    };
    NbDummyAuthStrategy.prototype.logout = function (data) {
        return rxjs.of(this.createDummyResult(data))
            .pipe(rxjs_operators.delay(this.getOption('delay')));
    };
    NbDummyAuthStrategy.prototype.refreshToken = function (data) {
        return rxjs.of(this.createDummyResult(data))
            .pipe(rxjs_operators.delay(this.getOption('delay')));
    };
    NbDummyAuthStrategy.prototype.createDummyResult = function (data) {
        if (this.getOption('alwaysFail')) {
            return new NbAuthResult(false, this.createFailResponse(data), null, ['Something went wrong.']);
        }
        return new NbAuthResult(true, this.createSuccessResponse(data), '/', [], ['Successfully logged in.'], this.createToken('test token'));
    };
    NbDummyAuthStrategy.decorators = [
        { type: _angular_core.Injectable },
    ];
    return NbDummyAuthStrategy;
}(NbAuthStrategy));

var __extends$5 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
var NbPasswordAuthStrategyOptions = /** @class */ (function (_super) {
    __extends$5(NbPasswordAuthStrategyOptions, _super);
    function NbPasswordAuthStrategyOptions() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.baseEndpoint = '/api/auth/';
        _this.login = {
            alwaysFail: false,
            endpoint: 'login',
            method: 'post',
            failWhenNoToken: true,
            redirect: {
                success: '/',
                failure: null,
            },
            defaultErrors: ['Login/Email combination is not correct, please try again.'],
            defaultMessages: ['You have been successfully logged in.'],
        };
        _this.register = {
            alwaysFail: false,
            rememberMe: true,
            endpoint: 'register',
            method: 'post',
            failWhenNoToken: true,
            redirect: {
                success: '/',
                failure: null,
            },
            defaultErrors: ['Something went wrong, please try again.'],
            defaultMessages: ['You have been successfully registered.'],
        };
        _this.requestPass = {
            endpoint: 'request-pass',
            method: 'post',
            redirect: {
                success: '/',
                failure: null,
            },
            defaultErrors: ['Something went wrong, please try again.'],
            defaultMessages: ['Reset password instructions have been sent to your email.'],
        };
        _this.resetPass = {
            endpoint: 'reset-pass',
            method: 'put',
            redirect: {
                success: '/',
                failure: null,
            },
            resetPasswordTokenKey: 'reset_password_token',
            defaultErrors: ['Something went wrong, please try again.'],
            defaultMessages: ['Your password has been successfully changed.'],
        };
        _this.logout = {
            alwaysFail: false,
            endpoint: 'logout',
            method: 'delete',
            redirect: {
                success: '/',
                failure: null,
            },
            defaultErrors: ['Something went wrong, please try again.'],
            defaultMessages: ['You have been successfully logged out.'],
        };
        _this.refreshToken = {
            endpoint: 'refresh-token',
            method: 'post',
            failWhenNoToken: true,
            redirect: {
                success: null,
                failure: null,
            },
            defaultErrors: ['Something went wrong, please try again.'],
            defaultMessages: ['Your token has been successfully refreshed.'],
        };
        _this.token = {
            class: NbAuthSimpleToken,
            key: 'data.token',
            getter: function (module, res, options) {
                return getDeepFromObject(res.body, options.token.key);
            },
        };
        _this.errors = {
            key: 'data.errors',
            getter: function (module, res, options) {
                return getDeepFromObject(res.error, options.errors.key, options[module].defaultErrors);
            },
        };
        _this.messages = {
            key: 'data.messages',
            getter: function (module, res, options) {
                return getDeepFromObject(res.body, options.messages.key, options[module].defaultMessages);
            },
        };
        return _this;
    }
    return NbPasswordAuthStrategyOptions;
}(NbAuthStrategyOptions));
var passwordStrategyOptions = new NbPasswordAuthStrategyOptions();

var __extends$4 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * The most common authentication provider for email/password strategy.
 *
 * Strategy settings. Note, there is no need to copy over the whole object to change the settings you need.
 * Also, this.getOption call won't work outside of the default options declaration
 * (which is inside of the `NbPasswordAuthStrategy` class), so you have to replace it with a custom helper function
 * if you need it.
 *
 * ```ts
 *export class NbPasswordAuthStrategyOptions extends NbAuthStrategyOptions {
 *  name: string;
 *  baseEndpoint? = '/api/auth/';
 *  login?: boolean | NbPasswordStrategyModule = {
 *    alwaysFail: false,
 *    endpoint: 'login',
 *    method: 'post',
 *    failWhenNoToken: true,
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Login/Email combination is not correct, please try again.'],
 *    defaultMessages: ['You have been successfully logged in.'],
 *  };
 *  register?: boolean | NbPasswordStrategyModule = {
 *    alwaysFail: false,
 *    rememberMe: true,
 *    endpoint: 'register',
 *    method: 'post',
 *    failWhenNoToken: true,
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['You have been successfully registered.'],
 *  };
 *  requestPass?: boolean | NbPasswordStrategyModule = {
 *    endpoint: 'request-pass',
 *    method: 'post',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Reset password instructions have been sent to your email.'],
 *  };
 *  resetPass?: boolean | NbPasswordStrategyReset = {
 *    endpoint: 'reset-pass',
 *    method: 'put',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    resetPasswordTokenKey: 'reset_password_token',
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Your password has been successfully changed.'],
 *  };
 *  logout?: boolean | NbPasswordStrategyReset = {
 *    alwaysFail: false,
 *    endpoint: 'logout',
 *    method: 'delete',
 *    redirect: {
 *      success: '/',
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['You have been successfully logged out.'],
 *  };
 *  refreshToken?: boolean | NbPasswordStrategyModule = {
 *    endpoint: 'refresh-token',
 *    method: 'post',
 *    failWhenNoToken: true,
 *    redirect: {
 *      success: null,
 *      failure: null,
 *    },
 *    defaultErrors: ['Something went wrong, please try again.'],
 *    defaultMessages: ['Your token has been successfully refreshed.'],
 *  };
 *  token?: NbPasswordStrategyToken = {
 *    class: NbAuthSimpleToken,
 *    key: 'data.token',
 *    getter: (module: string, res: HttpResponse<Object>, options: NbPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.body,
 *      options.token.key,
 *    ),
 *  };
 *  errors?: NbPasswordStrategyMessage = {
 *    key: 'data.errors',
 *    getter: (module: string, res: HttpErrorResponse, options: NbPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.error,
 *      options.errors.key,
 *      options[module].defaultErrors,
 *    ),
 *  };
 *  messages?: NbPasswordStrategyMessage = {
 *    key: 'data.messages',
 *    getter: (module: string, res: HttpResponse<Object>, options: NbPasswordAuthStrategyOptions) => getDeepFromObject(
 *      res.body,
 *      options.messages.key,
 *      options[module].defaultMessages,
 *    ),
 *  };
 *  validation?: {
 *    password?: {
 *      required?: boolean;
 *      minLength?: number | null;
 *      maxLength?: number | null;
 *      regexp?: string | null;
 *    };
 *    email?: {
 *      required?: boolean;
 *      regexp?: string | null;
 *    };
 *    fullName?: {
 *      required?: boolean;
 *      minLength?: number | null;
 *      maxLength?: number | null;
 *      regexp?: string | null;
 *    };
 *  };
 *}
 * ```
 */
var NbPasswordAuthStrategy = /** @class */ (function (_super) {
    __extends$4(NbPasswordAuthStrategy, _super);
    function NbPasswordAuthStrategy(http, route) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.route = route;
        _this.defaultOptions = passwordStrategyOptions;
        return _this;
    }
    NbPasswordAuthStrategy.setup = function (options) {
        return [NbPasswordAuthStrategy, options];
    };
    NbPasswordAuthStrategy.prototype.authenticate = function (data) {
        var _this = this;
        var method = this.getOption('login.method');
        var url = this.getActionEndpoint('login');
        return this.http.request(method, url, { body: data, observe: 'response' })
            .pipe(rxjs_operators.map(function (res) {
            if (_this.getOption('login.alwaysFail')) {
                throw _this.createFailResponse(data);
            }
            return res;
        }), this.validateToken('login'), rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('login.redirect.success'), [], _this.getOption('messages.getter')('login', res, _this.options), _this.createToken(_this.getOption('token.getter')('login', res, _this.options)));
        }), rxjs_operators.catchError(function (res) {
            var errors = [];
            if (res instanceof _angular_common_http.HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('login', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return rxjs.of(new NbAuthResult(false, res, _this.getOption('login.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.register = function (data) {
        var _this = this;
        var method = this.getOption('register.method');
        var url = this.getActionEndpoint('register');
        return this.http.request(method, url, { body: data, observe: 'response' })
            .pipe(rxjs_operators.map(function (res) {
            if (_this.getOption('register.alwaysFail')) {
                throw _this.createFailResponse(data);
            }
            return res;
        }), this.validateToken('register'), rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('register.redirect.success'), [], _this.getOption('messages.getter')('register', res, _this.options), _this.createToken(_this.getOption('token.getter')('login', res, _this.options)));
        }), rxjs_operators.catchError(function (res) {
            var errors = [];
            if (res instanceof _angular_common_http.HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('register', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return rxjs.of(new NbAuthResult(false, res, _this.getOption('register.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.requestPassword = function (data) {
        var _this = this;
        var method = this.getOption('requestPass.method');
        var url = this.getActionEndpoint('requestPass');
        return this.http.request(method, url, { body: data, observe: 'response' })
            .pipe(rxjs_operators.map(function (res) {
            if (_this.getOption('requestPass.alwaysFail')) {
                throw _this.createFailResponse();
            }
            return res;
        }), rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('requestPass.redirect.success'), [], _this.getOption('messages.getter')('requestPass', res, _this.options));
        }), rxjs_operators.catchError(function (res) {
            var errors = [];
            if (res instanceof _angular_common_http.HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('requestPass', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return rxjs.of(new NbAuthResult(false, res, _this.getOption('requestPass.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.resetPassword = function (data) {
        var _this = this;
        if (data === void 0) { data = {}; }
        var tokenKey = this.getOption('resetPass.resetPasswordTokenKey');
        data[tokenKey] = this.route.snapshot.queryParams[tokenKey];
        var method = this.getOption('resetPass.method');
        var url = this.getActionEndpoint('resetPass');
        return this.http.request(method, url, { body: data, observe: 'response' })
            .pipe(rxjs_operators.map(function (res) {
            if (_this.getOption('resetPass.alwaysFail')) {
                throw _this.createFailResponse();
            }
            return res;
        }), rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('resetPass.redirect.success'), [], _this.getOption('messages.getter')('resetPass', res, _this.options));
        }), rxjs_operators.catchError(function (res) {
            var errors = [];
            if (res instanceof _angular_common_http.HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('resetPass', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return rxjs.of(new NbAuthResult(false, res, _this.getOption('resetPass.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.logout = function () {
        var _this = this;
        var method = this.getOption('logout.method');
        var url = this.getActionEndpoint('logout');
        return rxjs.of({})
            .pipe(rxjs_operators.switchMap(function (res) {
            if (!url) {
                return rxjs.of(res);
            }
            return _this.http.request(method, url, { observe: 'response' });
        }), rxjs_operators.map(function (res) {
            if (_this.getOption('logout.alwaysFail')) {
                throw _this.createFailResponse();
            }
            return res;
        }), rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('logout.redirect.success'), [], _this.getOption('messages.getter')('logout', res, _this.options));
        }), rxjs_operators.catchError(function (res) {
            var errors = [];
            if (res instanceof _angular_common_http.HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('logout', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return rxjs.of(new NbAuthResult(false, res, _this.getOption('logout.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.refreshToken = function (data) {
        var _this = this;
        var method = this.getOption('refreshToken.method');
        var url = this.getActionEndpoint('refreshToken');
        return this.http.request(method, url, { body: data, observe: 'response' })
            .pipe(rxjs_operators.map(function (res) {
            if (_this.getOption('refreshToken.alwaysFail')) {
                throw _this.createFailResponse(data);
            }
            return res;
        }), this.validateToken('refreshToken'), rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('refreshToken.redirect.success'), [], _this.getOption('messages.getter')('refreshToken', res, _this.options), _this.createToken(_this.getOption('token.getter')('login', res, _this.options)));
        }), rxjs_operators.catchError(function (res) {
            var errors = [];
            if (res instanceof _angular_common_http.HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('refreshToken', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return rxjs.of(new NbAuthResult(false, res, _this.getOption('refreshToken.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.validateToken = function (module) {
        var _this = this;
        return rxjs_operators.map(function (res) {
            var token = _this.getOption('token.getter')(module, res, _this.options);
            if (!token && _this.getOption(module + ".failWhenNoToken")) {
                var key = _this.getOption('token.key');
                console.warn("NbPasswordAuthStrategy:\n                          Token is not provided under '" + key + "' key\n                          with getter '" + _this.getOption('token.getter') + "', check your auth configuration.");
                throw new Error('Could not extract token from the response.');
            }
            return res;
        });
    };
    NbPasswordAuthStrategy.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    NbPasswordAuthStrategy.ctorParameters = function () { return [
        { type: _angular_common_http.HttpClient, },
        { type: _angular_router.ActivatedRoute, },
    ]; };
    return NbPasswordAuthStrategy;
}(NbAuthStrategy));

/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

(function (NbOAuth2ResponseType) {
    NbOAuth2ResponseType["CODE"] = "code";
    NbOAuth2ResponseType["TOKEN"] = "token";
})(exports.NbOAuth2ResponseType || (exports.NbOAuth2ResponseType = {}));
// TODO: client_credentials
// TODO: client_credentials

// TODO: client_credentials
(function (NbOAuth2GrantType) {
    NbOAuth2GrantType["AUTHORIZATION_CODE"] = "authorization_code";
    NbOAuth2GrantType["PASSWORD"] = "password";
    NbOAuth2GrantType["REFRESH_TOKEN"] = "refresh_token";
})(exports.NbOAuth2GrantType || (exports.NbOAuth2GrantType = {}));

(function (NbOAuth2ClientAuthMethod) {
    NbOAuth2ClientAuthMethod["NONE"] = "none";
    NbOAuth2ClientAuthMethod["BASIC"] = "basic";
    NbOAuth2ClientAuthMethod["REQUEST_BODY"] = "request-body";
})(exports.NbOAuth2ClientAuthMethod || (exports.NbOAuth2ClientAuthMethod = {}));
var NbOAuth2AuthStrategyOptions = /** @class */ (function () {
    function NbOAuth2AuthStrategyOptions() {
        this.baseEndpoint = '';
        this.clientId = '';
        this.clientSecret = '';
        this.clientAuthMethod = exports.NbOAuth2ClientAuthMethod.NONE;
        this.redirect = {
            success: '/',
            failure: null,
        };
        this.defaultErrors = ['Something went wrong, please try again.'];
        this.defaultMessages = ['You have been successfully authenticated.'];
        this.authorize = {
            endpoint: 'authorize',
            responseType: exports.NbOAuth2ResponseType.CODE,
        };
        this.token = {
            endpoint: 'token',
            grantType: exports.NbOAuth2GrantType.AUTHORIZATION_CODE,
            class: NbAuthOAuth2Token,
        };
        this.refresh = {
            endpoint: 'token',
            grantType: exports.NbOAuth2GrantType.REFRESH_TOKEN,
        };
    }
    return NbOAuth2AuthStrategyOptions;
}());
var auth2StrategyOptions = new NbOAuth2AuthStrategyOptions();

var __extends$6 = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * OAuth2 authentication strategy.
 *
 * Strategy settings:
 *
 * ```ts
 * export enum NbOAuth2ResponseType {
 *   CODE = 'code',
 *   TOKEN = 'token',
 * }
 *
 * export enum NbOAuth2GrantType {
 *   AUTHORIZATION_CODE = 'authorization_code',
 *   PASSWORD = 'password',
 *   REFRESH_TOKEN = 'refresh_token',
 * }
 *
 * export class NbOAuth2AuthStrategyOptions {
 *   name: string;
 *   baseEndpoint?: string = '';
 *   clientId: string = '';
 *   clientSecret: string = '';
 *   clientAuthMethod: string = NbOAuth2ClientAuthMethod.NONE;
 *   redirect?: { success?: string; failure?: string } = {
 *     success: '/',
 *     failure: null,
 *   };
 *   defaultErrors?: any[] = ['Something went wrong, please try again.'];
 *   defaultMessages?: any[] = ['You have been successfully authenticated.'];
 *   authorize?: {
 *     endpoint?: string;
 *     redirectUri?: string;
 *     responseType?: string;
 *     scope?: string;
 *     state?: string;
 *     params?: { [key: string]: string };
 *   } = {
 *     endpoint: 'authorize',
 *     responseType: NbOAuth2ResponseType.CODE,
 *   };
 *   token?: {
 *     endpoint?: string;
 *     grantType?: string;
 *     redirectUri?: string;
 *     class: NbAuthTokenClass,
 *   } = {
 *     endpoint: 'token',
 *     grantType: NbOAuth2GrantType.AUTHORIZATION_CODE,
 *     class: NbAuthOAuth2Token,
 *   };
 *   refresh?: {
 *     endpoint?: string;
 *     grantType?: string;
 *     scope?: string;
 *   } = {
 *     endpoint: 'token',
 *     grantType: NbOAuth2GrantType.REFRESH_TOKEN,
 *   };
 * }
 * ```
 *
 */
var NbOAuth2AuthStrategy = /** @class */ (function (_super) {
    __extends$6(NbOAuth2AuthStrategy, _super);
    function NbOAuth2AuthStrategy(http, route, window) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.route = route;
        _this.window = window;
        _this.redirectResultHandlers = (_a = {},
            _a[exports.NbOAuth2ResponseType.CODE] = function () {
                return rxjs.of(_this.route.snapshot.queryParams).pipe(rxjs_operators.switchMap(function (params) {
                    if (params.code) {
                        return _this.requestToken(params.code);
                    }
                    return rxjs.of(new NbAuthResult(false, params, _this.getOption('redirect.failure'), _this.getOption('defaultErrors'), []));
                }));
            },
            _a[exports.NbOAuth2ResponseType.TOKEN] = function () {
                return rxjs.of(_this.route.snapshot.fragment).pipe(rxjs_operators.map(function (fragment) { return _this.parseHashAsQueryParams(fragment); }), rxjs_operators.map(function (params) {
                    if (!params.error) {
                        return new NbAuthResult(true, params, _this.getOption('redirect.success'), [], _this.getOption('defaultMessages'), _this.createToken(params));
                    }
                    return new NbAuthResult(false, params, _this.getOption('redirect.failure'), _this.getOption('defaultErrors'), []);
                }));
            },
            _a);
        _this.redirectResults = (_b = {},
            _b[exports.NbOAuth2ResponseType.CODE] = function () {
                return rxjs.of(_this.route.snapshot.queryParams).pipe(rxjs_operators.map(function (params) { return !!(params && (params.code || params.error)); }));
            },
            _b[exports.NbOAuth2ResponseType.TOKEN] = function () {
                return rxjs.of(_this.route.snapshot.fragment).pipe(rxjs_operators.map(function (fragment) { return _this.parseHashAsQueryParams(fragment); }), rxjs_operators.map(function (params) { return !!(params && (params.access_token || params.error)); }));
            },
            _b);
        _this.defaultOptions = auth2StrategyOptions;
        return _this;
        var _a, _b;
    }
    NbOAuth2AuthStrategy.setup = function (options) {
        return [NbOAuth2AuthStrategy, options];
    };
    Object.defineProperty(NbOAuth2AuthStrategy.prototype, "responseType", {
        get: function () {
            return this.getOption('authorize.responseType');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NbOAuth2AuthStrategy.prototype, "clientAuthMethod", {
        get: function () {
            return this.getOption('clientAuthMethod');
        },
        enumerable: true,
        configurable: true
    });
    NbOAuth2AuthStrategy.prototype.authenticate = function (data) {
        var _this = this;
        if (this.getOption('token.grantType') === exports.NbOAuth2GrantType.PASSWORD) {
            return this.passwordToken(data.email, data.password);
        }
        else {
            return this.isRedirectResult()
                .pipe(rxjs_operators.switchMap(function (result) {
                if (!result) {
                    _this.authorizeRedirect();
                    return rxjs.of(new NbAuthResult(true));
                }
                return _this.getAuthorizationResult();
            }));
        }
    };
    NbOAuth2AuthStrategy.prototype.getAuthorizationResult = function () {
        var redirectResultHandler = this.redirectResultHandlers[this.responseType];
        if (redirectResultHandler) {
            return redirectResultHandler.call(this);
        }
        throw new Error("'" + this.responseType + "' responseType is not supported,\n                      only 'token' and 'code' are supported now");
    };
    NbOAuth2AuthStrategy.prototype.refreshToken = function (token) {
        var _this = this;
        var url = this.getActionEndpoint('refresh');
        return this.http.post(url, this.buildRefreshRequestData(token), this.buildAuthHeader())
            .pipe(rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('redirect.success'), [], _this.getOption('defaultMessages'), _this.createRefreshedToken(res, token));
        }), rxjs_operators.catchError(function (res) { return _this.handleResponseError(res); }));
    };
    NbOAuth2AuthStrategy.prototype.passwordToken = function (email, password) {
        var _this = this;
        var url = this.getActionEndpoint('token');
        return this.http.post(url, this.buildPasswordRequestData(email, password), this.buildAuthHeader())
            .pipe(rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('redirect.success'), [], _this.getOption('defaultMessages'), _this.createToken(res));
        }), rxjs_operators.catchError(function (res) { return _this.handleResponseError(res); }));
    };
    NbOAuth2AuthStrategy.prototype.authorizeRedirect = function () {
        this.window.location.href = this.buildRedirectUrl();
    };
    NbOAuth2AuthStrategy.prototype.isRedirectResult = function () {
        return this.redirectResults[this.responseType].call(this);
    };
    NbOAuth2AuthStrategy.prototype.requestToken = function (code) {
        var _this = this;
        var url = this.getActionEndpoint('token');
        return this.http.post(url, this.buildCodeRequestData(code), this.buildAuthHeader())
            .pipe(rxjs_operators.map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('redirect.success'), [], _this.getOption('defaultMessages'), _this.createToken(res));
        }), rxjs_operators.catchError(function (res) { return _this.handleResponseError(res); }));
    };
    NbOAuth2AuthStrategy.prototype.buildCodeRequestData = function (code) {
        var params = {
            grant_type: this.getOption('token.grantType'),
            code: code,
            redirect_uri: this.getOption('token.redirectUri'),
            client_id: this.getOption('clientId'),
        };
        return this.cleanParams(this.addCredentialsToParams(params));
    };
    NbOAuth2AuthStrategy.prototype.buildRefreshRequestData = function (token) {
        var params = {
            grant_type: this.getOption('refresh.grantType'),
            refresh_token: token.getRefreshToken(),
            scope: this.getOption('refresh.scope'),
        };
        return this.cleanParams(this.addCredentialsToParams(params));
    };
    NbOAuth2AuthStrategy.prototype.buildPasswordRequestData = function (email, password) {
        var params = {
            grant_type: this.getOption('token.grantType'),
            email: email,
            password: password,
        };
        return this.cleanParams(this.addCredentialsToParams(params));
    };
    NbOAuth2AuthStrategy.prototype.buildAuthHeader = function () {
        if (this.clientAuthMethod === exports.NbOAuth2ClientAuthMethod.BASIC) {
            if (this.getOption('clientId') && this.getOption('clientSecret')) {
                return {
                    headers: new _angular_common_http.HttpHeaders({
                        'Authorization': 'Basic ' + btoa(this.getOption('clientId') + ':' + this.getOption('clientSecret')),
                    }),
                };
            }
            else {
                throw Error('For basic client authentication method, please provide both clientId & clientSecret.');
            }
        }
    };
    NbOAuth2AuthStrategy.prototype.cleanParams = function (params) {
        Object.entries(params)
            .forEach(function (_a) {
            var key = _a[0], val = _a[1];
            return !val && delete params[key];
        });
        return params;
    };
    NbOAuth2AuthStrategy.prototype.addCredentialsToParams = function (params) {
        if (this.clientAuthMethod === exports.NbOAuth2ClientAuthMethod.REQUEST_BODY) {
            if (this.getOption('clientId') && this.getOption('clientSecret')) {
                return __assign({}, params, { client_id: this.getOption('clientId'), client_secret: this.getOption('clientSecret') });
            }
            else {
                throw Error('For request body client authentication method, please provide both clientId & clientSecret.');
            }
        }
        return params;
    };
    NbOAuth2AuthStrategy.prototype.handleResponseError = function (res) {
        var errors = [];
        if (res instanceof _angular_common_http.HttpErrorResponse) {
            if (res.error.error_description) {
                errors.push(res.error.error_description);
            }
            else {
                errors = this.getOption('defaultErrors');
            }
        }
        else {
            errors.push('Something went wrong.');
        }
        return rxjs.of(new NbAuthResult(false, res, this.getOption('redirect.failure'), errors, []));
    };
    NbOAuth2AuthStrategy.prototype.buildRedirectUrl = function () {
        var params = __assign({ response_type: this.getOption('authorize.responseType'), client_id: this.getOption('clientId'), redirect_uri: this.getOption('authorize.redirectUri'), scope: this.getOption('authorize.scope'), state: this.getOption('authorize.state') }, this.getOption('authorize.params'));
        var endpoint = this.getActionEndpoint('authorize');
        var query = Object.entries(params)
            .filter(function (_a) {
            var key = _a[0], val = _a[1];
            return !!val;
        })
            .map(function (_a) {
            var key = _a[0], val = _a[1];
            return key + "=" + encodeURIComponent(val);
        })
            .join('&');
        return endpoint + "?" + query;
    };
    NbOAuth2AuthStrategy.prototype.parseHashAsQueryParams = function (hash) {
        return hash ? hash.split('&').reduce(function (acc, part) {
            var item = part.split('=');
            acc[item[0]] = decodeURIComponent(item[1]);
            return acc;
        }, {}) : {};
    };
    NbOAuth2AuthStrategy.prototype.createRefreshedToken = function (res, existingToken) {
        var refreshedToken = this.createToken(res);
        if (!refreshedToken.getRefreshToken() && existingToken.getRefreshToken()) {
            refreshedToken.setRefreshToken(existingToken.getRefreshToken());
        }
        return refreshedToken;
    };
    NbOAuth2AuthStrategy.prototype.register = function (data) {
        throw new Error('`register` is not supported by `NbOAuth2AuthStrategy`, use `authenticate`.');
    };
    NbOAuth2AuthStrategy.prototype.requestPassword = function (data) {
        throw new Error('`requestPassword` is not supported by `NbOAuth2AuthStrategy`, use `authenticate`.');
    };
    NbOAuth2AuthStrategy.prototype.resetPassword = function (data) {
        if (data === void 0) { data = {}; }
        throw new Error('`resetPassword` is not supported by `NbOAuth2AuthStrategy`, use `authenticate`.');
    };
    NbOAuth2AuthStrategy.prototype.logout = function () {
        return rxjs.of(new NbAuthResult(true));
    };
    NbOAuth2AuthStrategy.decorators = [
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    NbOAuth2AuthStrategy.ctorParameters = function () { return [
        { type: _angular_common_http.HttpClient, },
        { type: _angular_router.ActivatedRoute, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_nebular_theme.NB_WINDOW,] },] },
    ]; };
    return NbOAuth2AuthStrategy;
}(NbAuthStrategy));

var NbAuthComponent = /** @class */ (function () {
    // showcase of how to use the onAuthenticationChange method
    function NbAuthComponent(auth, location) {
        var _this = this;
        this.auth = auth;
        this.location = location;
        this.alive = true;
        this.authenticated = false;
        this.token = '';
        this.subscription = auth.onAuthenticationChange()
            .pipe(rxjs_operators.takeWhile(function () { return _this.alive; }))
            .subscribe(function (authenticated) {
            _this.authenticated = authenticated;
        });
    }
    NbAuthComponent.prototype.back = function () {
        this.location.back();
        return false;
    };
    NbAuthComponent.prototype.ngOnDestroy = function () {
        this.alive = false;
    };
    NbAuthComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'nb-auth',
                    styles: [":host /deep/ nb-layout .layout .layout-container .content .columns nb-layout-column{padding:2.5rem}:host /deep/ nb-card{height:calc(100vh - 2 * 2.5rem)}:host /deep/ nb-card-header a{text-decoration:none}:host /deep/ nb-card-header a i{font-size:2rem;font-weight:bold}:host /deep/ nb-card{margin:0}:host /deep/ .flex-centered{margin:auto}:host /deep/ nb-card-body{display:flex}@media (max-width: 550px){:host /deep/ /deep/ nb-layout .layout .layout-container .content .columns nb-layout-column{padding:0}:host /deep/ nb-card{border-radius:0;height:100vh}} "],
                    template: "\n    <nb-layout>\n      <nb-layout-column>\n        <nb-card>\n          <nb-card-header>\n            <a href=\"#\" (click)=\"back()\"><i class=\"nb-arrow-thin-left\"></i></a>\n          </nb-card-header>\n          <nb-card-body>\n            <div class=\"flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12\">\n              <router-outlet></router-outlet>\n            </div>\n          </nb-card-body>\n        </nb-card>\n      </nb-layout-column>\n    </nb-layout>\n  ",
                },] },
    ];
    /** @nocollapse */
    NbAuthComponent.ctorParameters = function () { return [
        { type: NbAuthService, },
        { type: _angular_common.Location, },
    ]; };
    return NbAuthComponent;
}());

var NbAuthBlockComponent = /** @class */ (function () {
    function NbAuthBlockComponent() {
    }
    NbAuthBlockComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'nb-auth-block',
                    styles: ["@media (max-width: 550px){:host /deep/ .accept-group{font-size:12px;padding:0}}:host /deep/ form{width:100%}:host /deep/ .alert{text-align:center}:host /deep/ .title{margin-bottom:0.75rem;text-align:center}:host /deep/ .sub-title{margin-bottom:2rem;text-align:center}:host /deep/ .checkbox{display:flex;justify-content:space-between;margin-bottom:10px;font-weight:normal}:host /deep/ .form-group.accept-group{display:flex;justify-content:space-between;margin:2rem 0}:host /deep/ .form-group.accept-group .forgot-password{line-height:2}:host /deep/ .links{text-align:center;margin-top:1.75rem}:host /deep/ .links .socials{margin:1.5rem 0 2.5rem}:host /deep/ .links .socials a{margin:0 1rem;text-decoration:none;font-size:1rem;vertical-align:middle}:host /deep/ .links .socials a.with-icon{font-size:2rem} "],
                    template: "\n    <ng-content></ng-content>\n  ",
                },] },
    ];
    return NbAuthBlockComponent;
}());

var NbLoginComponent = /** @class */ (function () {
    function NbLoginComponent(service, options, cd, router) {
        if (options === void 0) { options = {}; }
        this.service = service;
        this.options = options;
        this.cd = cd;
        this.router = router;
        this.redirectDelay = 0;
        this.showMessages = {};
        this.strategy = '';
        this.errors = [];
        this.messages = [];
        this.user = {};
        this.submitted = false;
        this.socialLinks = [];
        this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
        this.showMessages = this.getConfigValue('forms.login.showMessages');
        this.strategy = this.getConfigValue('forms.login.strategy');
        this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    }
    NbLoginComponent.prototype.login = function () {
        var _this = this;
        this.errors = this.messages = [];
        this.submitted = true;
        this.service.authenticate(this.strategy, this.user).subscribe(function (result) {
            _this.submitted = false;
            if (result.isSuccess()) {
                _this.messages = result.getMessages();
            }
            else {
                _this.errors = result.getErrors();
            }
            var redirect = result.getRedirect();
            if (redirect) {
                setTimeout(function () {
                    return _this.router.navigateByUrl(redirect);
                }, _this.redirectDelay);
            }
            _this.cd.detectChanges();
        });
    };
    NbLoginComponent.prototype.getConfigValue = function (key) {
        return getDeepFromObject(this.options, key, null);
    };
    NbLoginComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'nb-login',
                    template: "\n    <nb-auth-block>\n      <h2 class=\"title\">Sign In</h2>\n      <small class=\"form-text sub-title\">Hello! Sign in with your username or email</small>\n\n      <form (ngSubmit)=\"login()\" #form=\"ngForm\" autocomplete=\"nope\">\n\n        <nb-alert *ngIf=\"showMessages.error && errors?.length && !submitted\" outline=\"danger\">\n          <div><strong>Oh snap!</strong></div>\n          <div *ngFor=\"let error of errors\">{{ error }}</div>\n        </nb-alert>\n\n        <nb-alert *ngIf=\"showMessages.success && messages?.length && !submitted\" outline=\"success\">\n          <div><strong>Hooray!</strong></div>\n          <div *ngFor=\"let message of messages\">{{ message }}</div>\n        </nb-alert>\n\n        <div class=\"form-group\">\n          <label for=\"input-email\" class=\"sr-only\">Email address</label>\n          <input nbInput\n                 [(ngModel)]=\"user.email\"\n                 #email=\"ngModel\"\n                 name=\"email\"\n                 id=\"input-email\"\n                 pattern=\".+@.+..+\"\n                 placeholder=\"Email address\"\n                 autofocus\n                 fullWidth\n                 [status]=\"email.dirty ? (email.invalid  ? 'danger' : 'success') : ''\"\n                 [required]=\"getConfigValue('forms.validation.email.required')\">\n          <small class=\"form-text error\" *ngIf=\"email.invalid && email.touched && email.errors?.required\">\n            Email is required!\n          </small>\n          <small class=\"form-text error\"\n                 *ngIf=\"email.invalid && email.touched && email.errors?.pattern\">\n            Email should be the real one!\n          </small>\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"input-password\" class=\"sr-only\">Password</label>\n          <input nbInput\n                 [(ngModel)]=\"user.password\"\n                 #password=\"ngModel\"\n                 name=\"password\"\n                 type=\"password\"\n                 id=\"input-password\"\n                 placeholder=\"Password\"\n                 fullWidth\n                 [status]=\"password.dirty ? (password.invalid  ? 'danger' : 'success') : ''\"\n                 [required]=\"getConfigValue('forms.validation.password.required')\"\n                 [minlength]=\"getConfigValue('forms.validation.password.minLength')\"\n                 [maxlength]=\"getConfigValue('forms.validation.password.maxLength')\">\n          <small class=\"form-text error\" *ngIf=\"password.invalid && password.touched && password.errors?.required\">\n            Password is required!\n          </small>\n          <small\n            class=\"form-text error\"\n            *ngIf=\"password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)\">\n            Password should contains\n            from {{ getConfigValue('forms.validation.password.minLength') }}\n            to {{ getConfigValue('forms.validation.password.maxLength') }}\n            characters\n          </small>\n        </div>\n\n        <div class=\"form-group accept-group col-sm-12\">\n          <nb-checkbox name=\"rememberMe\" [(ngModel)]=\"user.rememberMe\">Remember me</nb-checkbox>\n          <a class=\"forgot-password\" routerLink=\"../request-password\">Forgot Password?</a>\n        </div>\n\n        <button nbButton\n                status=\"success\"\n                fullWidth\n                [disabled]=\"submitted || !form.valid\"\n                [class.btn-pulse]=\"submitted\">\n          Sign In\n        </button>\n      </form>\n\n      <div class=\"links\">\n\n        <ng-container *ngIf=\"socialLinks && socialLinks.length > 0\">\n          <small class=\"form-text\">Or connect with:</small>\n\n          <div class=\"socials\">\n            <ng-container *ngFor=\"let socialLink of socialLinks\">\n              <a *ngIf=\"socialLink.link\"\n                 [routerLink]=\"socialLink.link\"\n                 [attr.target]=\"socialLink.target\"\n                 [attr.class]=\"socialLink.icon\"\n                 [class.with-icon]=\"socialLink.icon\">{{ socialLink.title }}</a>\n              <a *ngIf=\"socialLink.url\"\n                 [attr.href]=\"socialLink.url\"\n                 [attr.target]=\"socialLink.target\"\n                 [attr.class]=\"socialLink.icon\"\n                 [class.with-icon]=\"socialLink.icon\">{{ socialLink.title }}</a>\n            </ng-container>\n          </div>\n        </ng-container>\n\n        <small class=\"form-text\">\n          Don't have an account? <a routerLink=\"../register\"><strong>Sign Up</strong></a>\n        </small>\n      </div>\n    </nb-auth-block>\n  ",
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /** @nocollapse */
    NbLoginComponent.ctorParameters = function () { return [
        { type: NbAuthService, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_OPTIONS,] },] },
        { type: _angular_core.ChangeDetectorRef, },
        { type: _angular_router.Router, },
    ]; };
    return NbLoginComponent;
}());

var NbRegisterComponent = /** @class */ (function () {
    function NbRegisterComponent(service, options, cd, router) {
        if (options === void 0) { options = {}; }
        this.service = service;
        this.options = options;
        this.cd = cd;
        this.router = router;
        this.redirectDelay = 0;
        this.showMessages = {};
        this.strategy = '';
        this.submitted = false;
        this.errors = [];
        this.messages = [];
        this.user = {};
        this.socialLinks = [];
        this.redirectDelay = this.getConfigValue('forms.register.redirectDelay');
        this.showMessages = this.getConfigValue('forms.register.showMessages');
        this.strategy = this.getConfigValue('forms.register.strategy');
        this.socialLinks = this.getConfigValue('forms.login.socialLinks');
    }
    NbRegisterComponent.prototype.register = function () {
        var _this = this;
        this.errors = this.messages = [];
        this.submitted = true;
        this.service.register(this.strategy, this.user).subscribe(function (result) {
            _this.submitted = false;
            if (result.isSuccess()) {
                _this.messages = result.getMessages();
            }
            else {
                _this.errors = result.getErrors();
            }
            var redirect = result.getRedirect();
            if (redirect) {
                setTimeout(function () {
                    return _this.router.navigateByUrl(redirect);
                }, _this.redirectDelay);
            }
            _this.cd.detectChanges();
        });
    };
    NbRegisterComponent.prototype.getConfigValue = function (key) {
        return getDeepFromObject(this.options, key, null);
    };
    NbRegisterComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'nb-register',
                    styles: [":host .title{margin-bottom:2rem} "],
                    template: "\n    <nb-auth-block>\n      <h2 class=\"title\">Sign Up</h2>\n      <form (ngSubmit)=\"register()\" #form=\"ngForm\">\n\n        <nb-alert *ngIf=\"showMessages.error && errors?.length && !submitted\" outline=\"danger\">\n          <div><strong>Oh snap!</strong></div>\n          <div *ngFor=\"let error of errors\">{{ error }}</div>\n        </nb-alert>\n\n        <nb-alert *ngIf=\"showMessages.success && messages?.length && !submitted\" outline=\"success\">\n          <div><strong>Hooray!</strong></div>\n          <div *ngFor=\"let message of messages\">{{ message }}</div>\n        </nb-alert>\n\n        <div class=\"form-group\">\n          <label for=\"input-name\" class=\"sr-only\">Full name</label>\n          <input nbInput\n                 [(ngModel)]=\"user.fullName\"\n                 #fullName=\"ngModel\"\n                 id=\"input-name\"\n                 name=\"fullName\"\n                 placeholder=\"Full name\"\n                 autofocus\n                 fullWidth\n                 [status]=\"email.dirty ? (email.invalid  ? 'danger' : 'success') : ''\"\n                 [required]=\"getConfigValue('forms.validation.fullName.required')\"\n                 [minlength]=\"getConfigValue('forms.validation.fullName.minLength')\"\n                 [maxlength]=\"getConfigValue('forms.validation.fullName.maxLength')\">\n          <small class=\"form-text error\" *ngIf=\"fullName.invalid && fullName.touched && fullName.errors?.required\">\n            Full name is required!\n          </small>\n          <small\n            class=\"form-text error\"\n            *ngIf=\"fullName.invalid && fullName.touched && (fullName.errors?.minlength || fullName.errors?.maxlength)\">\n            Full name should contains\n            from {{getConfigValue('forms.validation.fullName.minLength')}}\n            to {{getConfigValue('forms.validation.fullName.maxLength')}}\n            characters\n          </small>\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"input-email\" class=\"sr-only\">Email address</label>\n          <input nbInput\n                 [(ngModel)]=\"user.email\"\n                 #email=\"ngModel\"\n                 id=\"input-email\"\n                 name=\"email\"\n                 pattern=\".+@.+..+\"\n                 placeholder=\"Email address\"\n                 fullWidth\n                 [status]=\"email.dirty ? (email.invalid  ? 'danger' : 'success') : ''\"\n                 [required]=\"getConfigValue('forms.validation.email.required')\">\n          <small class=\"form-text error\" *ngIf=\"email.invalid && email.touched && email.errors?.required\">\n            Email is required!\n          </small>\n          <small class=\"form-text error\"\n                 *ngIf=\"email.invalid && email.touched && email.errors?.pattern\">\n            Email should be the real one!\n          </small>\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"input-password\" class=\"sr-only\">Password</label>\n          <input nbInput\n                 [(ngModel)]=\"user.password\"\n                 #password=\"ngModel\"\n                 type=\"password\"\n                 id=\"input-password\"\n                 name=\"password\"\n                 placeholder=\"Password\"\n                 fullWidth\n                 [status]=\"email.dirty ? (email.invalid  ? 'danger' : 'success') : ''\"\n                 [required]=\"getConfigValue('forms.validation.password.required')\"\n                 [minlength]=\"getConfigValue('forms.validation.password.minLength')\"\n                 [maxlength]=\"getConfigValue('forms.validation.password.maxLength')\">\n          <small class=\"form-text error\" *ngIf=\"password.invalid && password.touched && password.errors?.required\">\n            Password is required!\n          </small>\n          <small\n            class=\"form-text error\"\n            *ngIf=\"password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)\">\n            Password should contains\n            from {{ getConfigValue('forms.validation.password.minLength') }}\n            to {{ getConfigValue('forms.validation.password.maxLength') }}\n            characters\n          </small>\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"input-re-password\" class=\"sr-only\">Repeat password</label>\n          <input nbInput\n                 [(ngModel)]=\"user.confirmPassword\"\n                 #rePass=\"ngModel\"\n                 type=\"password\"\n                 id=\"input-re-password\"\n                 name=\"rePass\"\n                 placeholder=\"Confirm Password\"\n                 fullWidth\n                 [status]=\"email.dirty ? (email.invalid || password.value != rePass.value  ? 'danger' : 'success') : ''\"\n                 [required]=\"getConfigValue('forms.validation.password.required')\">\n          <small class=\"form-text error\"\n                 *ngIf=\"rePass.invalid && rePass.touched && rePass.errors?.required\">\n            Password confirmation is required!\n          </small>\n          <small\n            class=\"form-text error\"\n            *ngIf=\"rePass.touched && password.value != rePass.value && !rePass.errors?.required\">\n            Password does not match the confirm password.\n          </small>\n        </div>\n\n        <div class=\"form-group accept-group col-sm-12\" *ngIf=\"getConfigValue('forms.register.terms')\">\n          <nb-checkbox name=\"terms\" [(ngModel)]=\"user.terms\" [required]=\"getConfigValue('forms.register.terms')\">\n            Agree to <a href=\"#\" target=\"_blank\"><strong>Terms & Conditions</strong></a>\n          </nb-checkbox>\n        </div>\n\n        <button nbButton\n                status=\"success\"\n                fullWidth\n                [disabled]=\"submitted || !form.valid\"\n                [class.btn-pulse]=\"submitted\">\n          Register\n        </button>\n      </form>\n\n      <div class=\"links\">\n\n        <ng-container *ngIf=\"socialLinks && socialLinks.length > 0\">\n          <small class=\"form-text\">Or connect with:</small>\n\n          <div class=\"socials\">\n            <ng-container *ngFor=\"let socialLink of socialLinks\">\n              <a *ngIf=\"socialLink.link\"\n                 [routerLink]=\"socialLink.link\"\n                 [attr.target]=\"socialLink.target\"\n                 [attr.class]=\"socialLink.icon\"\n                 [class.with-icon]=\"socialLink.icon\">{{ socialLink.title }}</a>\n              <a *ngIf=\"socialLink.url\"\n                 [attr.href]=\"socialLink.url\"\n                 [attr.target]=\"socialLink.target\"\n                 [attr.class]=\"socialLink.icon\"\n                 [class.with-icon]=\"socialLink.icon\">{{ socialLink.title }}</a>\n            </ng-container>\n          </div>\n        </ng-container>\n\n        <small class=\"form-text\">\n          Already have an account? <a routerLink=\"../login\"><strong>Sign in</strong></a>\n        </small>\n      </div>\n    </nb-auth-block>\n  ",
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /** @nocollapse */
    NbRegisterComponent.ctorParameters = function () { return [
        { type: NbAuthService, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_OPTIONS,] },] },
        { type: _angular_core.ChangeDetectorRef, },
        { type: _angular_router.Router, },
    ]; };
    return NbRegisterComponent;
}());

var NbLogoutComponent = /** @class */ (function () {
    function NbLogoutComponent(service, options, router) {
        if (options === void 0) { options = {}; }
        this.service = service;
        this.options = options;
        this.router = router;
        this.redirectDelay = 0;
        this.strategy = '';
        this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
        this.strategy = this.getConfigValue('forms.logout.strategy');
    }
    NbLogoutComponent.prototype.ngOnInit = function () {
        this.logout(this.strategy);
    };
    NbLogoutComponent.prototype.logout = function (strategy) {
        var _this = this;
        this.service.logout(strategy).subscribe(function (result) {
            var redirect = result.getRedirect();
            if (redirect) {
                setTimeout(function () {
                    return _this.router.navigateByUrl(redirect);
                }, _this.redirectDelay);
            }
        });
    };
    NbLogoutComponent.prototype.getConfigValue = function (key) {
        return getDeepFromObject(this.options, key, null);
    };
    NbLogoutComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'nb-logout',
                    template: "\n    <div>Logging out, please wait...</div>\n  ",
                },] },
    ];
    /** @nocollapse */
    NbLogoutComponent.ctorParameters = function () { return [
        { type: NbAuthService, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_OPTIONS,] },] },
        { type: _angular_router.Router, },
    ]; };
    return NbLogoutComponent;
}());

var NbRequestPasswordComponent = /** @class */ (function () {
    function NbRequestPasswordComponent(service, options, cd, router) {
        if (options === void 0) { options = {}; }
        this.service = service;
        this.options = options;
        this.cd = cd;
        this.router = router;
        this.redirectDelay = 0;
        this.showMessages = {};
        this.strategy = '';
        this.submitted = false;
        this.errors = [];
        this.messages = [];
        this.user = {};
        this.redirectDelay = this.getConfigValue('forms.requestPassword.redirectDelay');
        this.showMessages = this.getConfigValue('forms.requestPassword.showMessages');
        this.strategy = this.getConfigValue('forms.requestPassword.strategy');
    }
    NbRequestPasswordComponent.prototype.requestPass = function () {
        var _this = this;
        this.errors = this.messages = [];
        this.submitted = true;
        this.service.requestPassword(this.strategy, this.user).subscribe(function (result) {
            _this.submitted = false;
            if (result.isSuccess()) {
                _this.messages = result.getMessages();
            }
            else {
                _this.errors = result.getErrors();
            }
            var redirect = result.getRedirect();
            if (redirect) {
                setTimeout(function () {
                    return _this.router.navigateByUrl(redirect);
                }, _this.redirectDelay);
            }
            _this.cd.detectChanges();
        });
    };
    NbRequestPasswordComponent.prototype.getConfigValue = function (key) {
        return getDeepFromObject(this.options, key, null);
    };
    NbRequestPasswordComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'nb-request-password-page',
                    styles: [":host .links{display:flex;justify-content:space-between}:host .form-group:last-of-type{margin-bottom:3rem} "],
                    template: "\n    <nb-auth-block>\n      <h2 class=\"title\">Forgot Password</h2>\n      <small class=\"form-text sub-title\">Enter your email address and we\u2019ll send a link to reset your password</small>\n      <form (ngSubmit)=\"requestPass()\" #requestPassForm=\"ngForm\">\n\n        <nb-alert *ngIf=\"showMessages.error && errors?.length && !submitted\" outline=\"danger\">\n          <div><strong>Oh snap!</strong></div>\n          <div *ngFor=\"let error of errors\">{{ error }}</div>\n        </nb-alert>\n\n        <nb-alert *ngIf=\"showMessages.success && messages.length && !submitted\" outline=\"success\">\n          <div><strong>Hooray!</strong></div>\n          <div *ngFor=\"let message of messages\">{{ message }}</div>\n        </nb-alert>\n\n        <div class=\"form-group\">\n          <label for=\"input-email\" class=\"sr-only\">Enter your email address</label>\n          <input nbInput\n                 #email=\"ngModel\"\n                 [(ngModel)]=\"user.email\"\n                 id=\"input-email\"\n                 name=\"email\"\n                 placeholder=\"Email address\"\n                 autofocus\n                 fullWidth\n                 pattern=\".+@.+..+\"\n                 [status]=\"email.dirty ? (email.invalid  ? 'danger' : 'success') : ''\"\n                 [required]=\"getConfigValue('forms.validation.email.required')\">\n          <small class=\"form-text error\" *ngIf=\"email.invalid && email.touched && email.errors?.required\">\n            Email is required!\n          </small>\n          <small class=\"form-text error\"\n                 *ngIf=\"email.invalid && email.touched && email.errors?.pattern\">\n            Email should be the real one!\n          </small>\n        </div>\n\n        <button nbButton\n                status=\"success\"\n                fullWidth\n                [disabled]=\"submitted || !requestPassForm.valid\"\n                [class.btn-pulse]=\"submitted\">\n          Request password\n        </button>\n      </form>\n\n      <div class=\"links col-sm-12\">\n        <small class=\"form-text\">\n          Already have an account? <a routerLink=\"../login\"><strong>Sign In</strong></a>\n        </small>\n        <small class=\"form-text\">\n          <a routerLink=\"../register\"><strong>Sign Up</strong></a>\n        </small>\n      </div>\n    </nb-auth-block>\n  ",
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /** @nocollapse */
    NbRequestPasswordComponent.ctorParameters = function () { return [
        { type: NbAuthService, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_OPTIONS,] },] },
        { type: _angular_core.ChangeDetectorRef, },
        { type: _angular_router.Router, },
    ]; };
    return NbRequestPasswordComponent;
}());

var NbResetPasswordComponent = /** @class */ (function () {
    function NbResetPasswordComponent(service, options, cd, router) {
        if (options === void 0) { options = {}; }
        this.service = service;
        this.options = options;
        this.cd = cd;
        this.router = router;
        this.redirectDelay = 0;
        this.showMessages = {};
        this.strategy = '';
        this.submitted = false;
        this.errors = [];
        this.messages = [];
        this.user = {};
        this.redirectDelay = this.getConfigValue('forms.resetPassword.redirectDelay');
        this.showMessages = this.getConfigValue('forms.resetPassword.showMessages');
        this.strategy = this.getConfigValue('forms.resetPassword.strategy');
    }
    NbResetPasswordComponent.prototype.resetPass = function () {
        var _this = this;
        this.errors = this.messages = [];
        this.submitted = true;
        this.service.resetPassword(this.strategy, this.user).subscribe(function (result) {
            _this.submitted = false;
            if (result.isSuccess()) {
                _this.messages = result.getMessages();
            }
            else {
                _this.errors = result.getErrors();
            }
            var redirect = result.getRedirect();
            if (redirect) {
                setTimeout(function () {
                    return _this.router.navigateByUrl(redirect);
                }, _this.redirectDelay);
            }
            _this.cd.detectChanges();
        });
    };
    NbResetPasswordComponent.prototype.getConfigValue = function (key) {
        return getDeepFromObject(this.options, key, null);
    };
    NbResetPasswordComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'nb-reset-password-page',
                    styles: [":host .links{display:flex;justify-content:space-between}:host .form-group:last-of-type{margin-bottom:3rem} "],
                    template: "\n    <nb-auth-block>\n      <h2 class=\"title\">Change password</h2>\n      <small class=\"form-text sub-title\">Please enter a new password</small>\n      <form (ngSubmit)=\"resetPass()\" #resetPassForm=\"ngForm\">\n\n        <nb-alert *ngIf=\"showMessages.error && errors?.length && !submitted\" outline=\"danger\">\n          <div><strong>Oh snap!</strong></div>\n          <div *ngFor=\"let error of errors\">{{ error }}</div>\n        </nb-alert>\n\n        <nb-alert *ngIf=\"showMessages.success && messages?.length && !submitted\" outline=\"success\">\n          <div><strong>Hooray!</strong></div>\n          <div *ngFor=\"let message of messages\">{{ message }}</div>\n        </nb-alert>\n\n        <div class=\"form-group\">\n          <label for=\"input-password\" class=\"sr-only\">New Password</label>\n          <input nbInput\n                 [(ngModel)]=\"user.password\"\n                 #password=\"ngModel\"\n                 type=\"password\"\n                 id=\"input-password\"\n                 name=\"password\"\n                 class=\"first\"\n                 placeholder=\"New Password\"\n                 autofocus\n                 fullWidth\n                 [status]=\"password.dirty ? (password.invalid  ? 'danger' : 'success') : ''\"\n                 [required]=\"getConfigValue('forms.validation.password.required')\"\n                 [minlength]=\"getConfigValue('forms.validation.password.minLength')\"\n                 [maxlength]=\"getConfigValue('forms.validation.password.maxLength')\">\n          <small class=\"form-text error\" *ngIf=\"password.invalid && password.touched && password.errors?.required\">\n            Password is required!\n          </small>\n          <small\n            class=\"form-text error\"\n            *ngIf=\"password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)\">\n            Password should contains\n            from {{getConfigValue('forms.validation.password.minLength')}}\n            to {{getConfigValue('forms.validation.password.maxLength')}}\n            characters\n          </small>\n        </div>\n\n        <div class=\"form-group\">\n          <label for=\"input-re-password\" class=\"sr-only\">Confirm Password</label>\n          <input nbInput\n                 [(ngModel)]=\"user.confirmPassword\"\n                 #rePass=\"ngModel\"\n                 id=\"input-re-password\"\n                 name=\"rePass\"\n                 type=\"password\"\n                 class=\"last\"\n                 placeholder=\"Confirm Password\"\n                 fullWidth\n                 [status]=\"rePass.touched\n                 ? (rePass.invalid || password.value != rePass.value ? 'danger' : 'success')\n                 : ''\"\n                 [required]=\"getConfigValue('forms.validation.password.required')\">\n          <small class=\"form-text error\"\n                 *ngIf=\"rePass.invalid && rePass.touched && rePass.errors?.required\">\n            Password confirmation is required!\n          </small>\n          <small\n            class=\"form-text error\"\n            *ngIf=\"rePass.touched && password.value != rePass.value && !rePass.errors?.required\">\n            Password does not match the confirm password.\n          </small>\n        </div>\n\n        <button nbButton\n                status=\"success\"\n                fullWidth\n                [disabled]=\"submitted || !resetPassForm.valid\"\n                [class.btn-pulse]=\"submitted\">\n          Change password\n        </button>\n      </form>\n\n      <div class=\"links col-sm-12\">\n        <small class=\"form-text\">\n          Already have an account? <a routerLink=\"../login\"><strong>Sign In</strong></a>\n        </small>\n        <small class=\"form-text\">\n          <a routerLink=\"../register\"><strong>Sign Up</strong></a>\n        </small>\n      </div>\n    </nb-auth-block>\n  ",
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /** @nocollapse */
    NbResetPasswordComponent.ctorParameters = function () { return [
        { type: NbAuthService, },
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [NB_AUTH_OPTIONS,] },] },
        { type: _angular_core.ChangeDetectorRef, },
        { type: _angular_router.Router, },
    ]; };
    return NbResetPasswordComponent;
}());

var routes = [
    {
        path: 'auth',
        component: NbAuthComponent,
        children: [
            {
                path: '',
                component: NbLoginComponent,
            },
            {
                path: 'login',
                component: NbLoginComponent,
            },
            {
                path: 'register',
                component: NbRegisterComponent,
            },
            {
                path: 'logout',
                component: NbLogoutComponent,
            },
            {
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: NbResetPasswordComponent,
            },
        ],
    },
];

function nbStrategiesFactory(options, injector) {
    var strategies = [];
    options.strategies
        .forEach(function (_a) {
        var strategyClass = _a[0], strategyOptions = _a[1];
        var strategy = injector.get(strategyClass);
        strategy.setOptions(strategyOptions);
        strategies.push(strategy);
    });
    return strategies;
}
function nbTokensFactory(strategies) {
    var tokens = [];
    strategies
        .forEach(function (strategy) {
        tokens.push(strategy.getOption('token.class'));
    });
    return tokens;
}
function nbOptionsFactory(options) {
    return deepExtend(defaultAuthOptions, options);
}
var NbAuthModule = /** @class */ (function () {
    function NbAuthModule() {
    }
    NbAuthModule.forRoot = function (nbAuthOptions) {
        return {
            ngModule: NbAuthModule,
            providers: [
                { provide: NB_AUTH_USER_OPTIONS, useValue: nbAuthOptions },
                { provide: NB_AUTH_OPTIONS, useFactory: nbOptionsFactory, deps: [NB_AUTH_USER_OPTIONS] },
                { provide: NB_AUTH_STRATEGIES, useFactory: nbStrategiesFactory, deps: [NB_AUTH_OPTIONS, _angular_core.Injector] },
                { provide: NB_AUTH_TOKENS, useFactory: nbTokensFactory, deps: [NB_AUTH_STRATEGIES] },
                { provide: NB_AUTH_FALLBACK_TOKEN, useValue: NbAuthSimpleToken },
                { provide: NB_AUTH_INTERCEPTOR_HEADER, useValue: 'Authorization' },
                { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
                NbAuthTokenParceler,
                NbAuthService,
                NbTokenService,
                NbDummyAuthStrategy,
                NbPasswordAuthStrategy,
                NbOAuth2AuthStrategy,
            ],
        };
    };
    NbAuthModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_common.CommonModule,
                        _nebular_theme.NbLayoutModule,
                        _nebular_theme.NbCardModule,
                        _nebular_theme.NbCheckboxModule,
                        _nebular_theme.NbAlertModule,
                        _nebular_theme.NbInputModule,
                        _nebular_theme.NbButtonModule,
                        _angular_router.RouterModule.forChild(routes),
                        _angular_forms.FormsModule,
                        _angular_common_http.HttpClientModule,
                    ],
                    declarations: [
                        NbAuthComponent,
                        NbAuthBlockComponent,
                        NbLoginComponent,
                        NbRegisterComponent,
                        NbRequestPasswordComponent,
                        NbResetPasswordComponent,
                        NbLogoutComponent,
                    ],
                    exports: [
                        NbAuthComponent,
                        NbAuthBlockComponent,
                        NbLoginComponent,
                        NbRegisterComponent,
                        NbRequestPasswordComponent,
                        NbResetPasswordComponent,
                        NbLogoutComponent,
                    ],
                },] },
    ];
    return NbAuthModule;
}());

exports.defaultAuthOptions = defaultAuthOptions;
exports.NB_AUTH_OPTIONS = NB_AUTH_OPTIONS;
exports.NB_AUTH_USER_OPTIONS = NB_AUTH_USER_OPTIONS;
exports.NB_AUTH_STRATEGIES = NB_AUTH_STRATEGIES;
exports.NB_AUTH_TOKENS = NB_AUTH_TOKENS;
exports.NB_AUTH_INTERCEPTOR_HEADER = NB_AUTH_INTERCEPTOR_HEADER;
exports.nbStrategiesFactory = nbStrategiesFactory;
exports.nbTokensFactory = nbTokensFactory;
exports.nbOptionsFactory = nbOptionsFactory;
exports.NbAuthModule = NbAuthModule;
exports.NbAuthComponent = NbAuthComponent;
exports.NbAuthBlockComponent = NbAuthBlockComponent;
exports.NbLoginComponent = NbLoginComponent;
exports.NbLogoutComponent = NbLogoutComponent;
exports.NbRegisterComponent = NbRegisterComponent;
exports.NbRequestPasswordComponent = NbRequestPasswordComponent;
exports.NbResetPasswordComponent = NbResetPasswordComponent;
exports.NbAuthService = NbAuthService;
exports.NbAuthResult = NbAuthResult;
exports.NbAuthJWTInterceptor = NbAuthJWTInterceptor;
exports.NbAuthSimpleInterceptor = NbAuthSimpleInterceptor;
exports.NbAuthToken = NbAuthToken;
exports.nbAuthCreateToken = nbAuthCreateToken;
exports.decodeJwtPayload = decodeJwtPayload;
exports.NbAuthSimpleToken = NbAuthSimpleToken;
exports.NbAuthJWTToken = NbAuthJWTToken;
exports.NbAuthOAuth2Token = NbAuthOAuth2Token;
exports.NbAuthOAuth2JWTToken = NbAuthOAuth2JWTToken;
exports.ɵ0 = ɵ0;
exports.NbTokenStorage = NbTokenStorage;
exports.NbTokenLocalStorage = NbTokenLocalStorage;
exports.NbTokenService = NbTokenService;
exports.NB_AUTH_FALLBACK_TOKEN = NB_AUTH_FALLBACK_TOKEN;
exports.NbAuthTokenParceler = NbAuthTokenParceler;
exports.NbAuthStrategy = NbAuthStrategy;
exports.NbAuthStrategyOptions = NbAuthStrategyOptions;
exports.NbDummyAuthStrategy = NbDummyAuthStrategy;
exports.NbDummyAuthStrategyOptions = NbDummyAuthStrategyOptions;
exports.dummyStrategyOptions = dummyStrategyOptions;
exports.NbPasswordAuthStrategy = NbPasswordAuthStrategy;
exports.NbPasswordAuthStrategyOptions = NbPasswordAuthStrategyOptions;
exports.passwordStrategyOptions = passwordStrategyOptions;
exports.NbOAuth2AuthStrategy = NbOAuth2AuthStrategy;
exports.NbOAuth2AuthStrategyOptions = NbOAuth2AuthStrategyOptions;
exports.auth2StrategyOptions = auth2StrategyOptions;

Object.defineProperty(exports, '__esModule', { value: true });

})));
