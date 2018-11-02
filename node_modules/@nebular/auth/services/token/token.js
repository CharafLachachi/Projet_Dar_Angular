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
import { urlBase64Decode } from '../../helpers';
var NbAuthToken = /** @class */ (function () {
    function NbAuthToken() {
    }
    NbAuthToken.prototype.getName = function () {
        return this.constructor.NAME;
    };
    return NbAuthToken;
}());
export { NbAuthToken };
export function nbAuthCreateToken(tokenClass, token, ownerStrategyName, createdAt) {
    return new tokenClass(token, ownerStrategyName, createdAt);
}
export function decodeJwtPayload(payload) {
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
    __extends(NbAuthSimpleToken, _super);
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
export { NbAuthSimpleToken };
/**
 * Wrapper for JWT token with additional methods.
 */
var NbAuthJWTToken = /** @class */ (function (_super) {
    __extends(NbAuthJWTToken, _super);
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
export { NbAuthJWTToken };
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
    __extends(NbAuthOAuth2Token, _super);
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
export { NbAuthOAuth2Token };
/**
 * Wrapper for OAuth2 token
 */
var NbAuthOAuth2JWTToken = /** @class */ (function (_super) {
    __extends(NbAuthOAuth2JWTToken, _super);
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
export { NbAuthOAuth2JWTToken };
export { ɵ0 };
//# sourceMappingURL=token.js.map