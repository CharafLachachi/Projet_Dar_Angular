import { HttpResponse } from '@angular/common/http';
import { deepExtend, getDeepFromObject } from '../helpers';
import { nbAuthCreateToken } from '../services/token/token';
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
        return new HttpResponse({ body: {}, status: 401 });
    };
    NbAuthStrategy.prototype.createSuccessResponse = function (data) {
        return new HttpResponse({ body: {}, status: 200 });
    };
    NbAuthStrategy.prototype.getActionEndpoint = function (action) {
        var actionEndpoint = this.getOption(action + ".endpoint");
        var baseEndpoint = this.getOption('baseEndpoint');
        return baseEndpoint + actionEndpoint;
    };
    return NbAuthStrategy;
}());
export { NbAuthStrategy };
//# sourceMappingURL=auth-strategy.js.map