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
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { NbAuthResult } from '../../services/auth-result';
import { NbAuthStrategy } from '../auth-strategy';
import { passwordStrategyOptions } from './password-strategy-options';
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
    __extends(NbPasswordAuthStrategy, _super);
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
            .pipe(map(function (res) {
            if (_this.getOption('login.alwaysFail')) {
                throw _this.createFailResponse(data);
            }
            return res;
        }), this.validateToken('login'), map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('login.redirect.success'), [], _this.getOption('messages.getter')('login', res, _this.options), _this.createToken(_this.getOption('token.getter')('login', res, _this.options)));
        }), catchError(function (res) {
            var errors = [];
            if (res instanceof HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('login', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return observableOf(new NbAuthResult(false, res, _this.getOption('login.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.register = function (data) {
        var _this = this;
        var method = this.getOption('register.method');
        var url = this.getActionEndpoint('register');
        return this.http.request(method, url, { body: data, observe: 'response' })
            .pipe(map(function (res) {
            if (_this.getOption('register.alwaysFail')) {
                throw _this.createFailResponse(data);
            }
            return res;
        }), this.validateToken('register'), map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('register.redirect.success'), [], _this.getOption('messages.getter')('register', res, _this.options), _this.createToken(_this.getOption('token.getter')('login', res, _this.options)));
        }), catchError(function (res) {
            var errors = [];
            if (res instanceof HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('register', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return observableOf(new NbAuthResult(false, res, _this.getOption('register.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.requestPassword = function (data) {
        var _this = this;
        var method = this.getOption('requestPass.method');
        var url = this.getActionEndpoint('requestPass');
        return this.http.request(method, url, { body: data, observe: 'response' })
            .pipe(map(function (res) {
            if (_this.getOption('requestPass.alwaysFail')) {
                throw _this.createFailResponse();
            }
            return res;
        }), map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('requestPass.redirect.success'), [], _this.getOption('messages.getter')('requestPass', res, _this.options));
        }), catchError(function (res) {
            var errors = [];
            if (res instanceof HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('requestPass', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return observableOf(new NbAuthResult(false, res, _this.getOption('requestPass.redirect.failure'), errors));
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
            .pipe(map(function (res) {
            if (_this.getOption('resetPass.alwaysFail')) {
                throw _this.createFailResponse();
            }
            return res;
        }), map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('resetPass.redirect.success'), [], _this.getOption('messages.getter')('resetPass', res, _this.options));
        }), catchError(function (res) {
            var errors = [];
            if (res instanceof HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('resetPass', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return observableOf(new NbAuthResult(false, res, _this.getOption('resetPass.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.logout = function () {
        var _this = this;
        var method = this.getOption('logout.method');
        var url = this.getActionEndpoint('logout');
        return observableOf({})
            .pipe(switchMap(function (res) {
            if (!url) {
                return observableOf(res);
            }
            return _this.http.request(method, url, { observe: 'response' });
        }), map(function (res) {
            if (_this.getOption('logout.alwaysFail')) {
                throw _this.createFailResponse();
            }
            return res;
        }), map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('logout.redirect.success'), [], _this.getOption('messages.getter')('logout', res, _this.options));
        }), catchError(function (res) {
            var errors = [];
            if (res instanceof HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('logout', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return observableOf(new NbAuthResult(false, res, _this.getOption('logout.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.refreshToken = function (data) {
        var _this = this;
        var method = this.getOption('refreshToken.method');
        var url = this.getActionEndpoint('refreshToken');
        return this.http.request(method, url, { body: data, observe: 'response' })
            .pipe(map(function (res) {
            if (_this.getOption('refreshToken.alwaysFail')) {
                throw _this.createFailResponse(data);
            }
            return res;
        }), this.validateToken('refreshToken'), map(function (res) {
            return new NbAuthResult(true, res, _this.getOption('refreshToken.redirect.success'), [], _this.getOption('messages.getter')('refreshToken', res, _this.options), _this.createToken(_this.getOption('token.getter')('login', res, _this.options)));
        }), catchError(function (res) {
            var errors = [];
            if (res instanceof HttpErrorResponse) {
                errors = _this.getOption('errors.getter')('refreshToken', res, _this.options);
            }
            else {
                errors.push('Something went wrong.');
            }
            return observableOf(new NbAuthResult(false, res, _this.getOption('refreshToken.redirect.failure'), errors));
        }));
    };
    NbPasswordAuthStrategy.prototype.validateToken = function (module) {
        var _this = this;
        return map(function (res) {
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
        { type: Injectable },
    ];
    /** @nocollapse */
    NbPasswordAuthStrategy.ctorParameters = function () { return [
        { type: HttpClient, },
        { type: ActivatedRoute, },
    ]; };
    return NbPasswordAuthStrategy;
}(NbAuthStrategy));
export { NbPasswordAuthStrategy };
//# sourceMappingURL=password-strategy.js.map