const RouteParameter = require("./params/parameter");
const NO_VALUE = "unset";
const SLASH_NO_HASH = "/";
const SLASH_HASH = "@slash@";
const DOT_NO_HASH = ".";
const DOT_HASH = "@dot@";

/**
 * @property {Router} Router
 * @property {string} name
 * @property {string} method
 * @property {string[]} methods
 * @property {string} path
 * @property {boolean} current
 * @property {boolean} apacheServer
 * @property {boolean} adminRoute
 * @property {RouteParameter[]} params
 */
class Route {

    /**
     * @param {Router} Router
     * @param {{
     *     name:string,
     *     method:string,
     *     path:string
     * }} data
     */
    constructor(Router, data) {
        this.Router = Router;
        Object.assign(this, data);
        /** @type {RouteParameter[]} */
        this.params = [];
        this.setParams();
        // co.log(this);
    }

    /**
     * @return {boolean}
     */
    isApacheServer() {
        return this.apacheServer;
    }

    /**
     * @return {boolean}
     */
    isCurrent() {
        return this.current;
    }

    /**
     * @return {boolean}
     */
    isAdminRoute() {
        return this.adminRoute;
    }

    /**
     * @param {string} route
     * @return {boolean}
     */
    isRoute(route) {
        return (this.name === route);
    }

    /**
     * @param {string} method
     * @return {string|undefined}
     */
    getMethod(method = co.ajax.METHOD_GET) {
        if(("" + method).in(...this.methods)) {
            return method;
        }
    }

    /**
     * @return {string}
     */
    getDefaultMethod() {
        return this.methods[0];
    }

    /**
     * @param {string} values
     * @return {string}
     */
    getPath(...values) {
        let
            this_o = this,
            path = this.path,
            valueParam = 0
        ;
        this.params.forEach((_param) => {
            if(_param.isTranslatorParameter()) {
                path = path.replace(_param.string, _param.getTranslatorValue("translator"));
            } else if(_param.requireUserParams()) {
                let value = _param.getUserValue() || values[valueParam];
                if(!value) {
                    throw new TypeError("You have not defined a value for the " + _param.getName() + " parameter");
                }
                if(_param.isRegexpParameter()) {
                    if(!_param.isMatchedByRegexp(value)) {
                        throw new TypeError("The value of " + _param.getName() + " parameter isn't correct. No match by regexp : " + _param.getValue());
                    }
                    path = path.replace(_param.string, this_o.hashValue(value));
                } else {
                    path = path.replace(_param.string, this_o.hashValue(value));
                }
                valueParam++;
            }
        });
        return path;
    }

    /**
     * @param {string} values
     * @return {string}
     */
    getAbsolutePath(...values) {
        return window.location.origin + this.getPath(...values);
    }

    /**
     * @return {string}
     */
    getOriginalPath() {
        return this.path;
    }

    /**
     * @return {boolean}
     */
    requireUserParams() {
        let
            this_o = this,
            response = false
        ;
        $.each(this.params, (i, _param) => {
            if(_param.requireUserParams() && !response) {
                response = true;
                return false;
            }
        });
        return response;
    }

    /**
     * @param {string} name
     * @param {string} value
     */
    setParamValue(name, value) {
        let _param = this.getParam(name);
        if(_param) {
            _param.setUserValue(value);
        }
    }

    /**
     * @param {string} name
     * @return {RouteParameter}
     */
    getParam(name) {
        let paramFound;
        $.each(this.params, function (i, _param) {
            if(_param.name === name && !paramFound) {
                paramFound = _param;
                return false;
            }
        });
        return paramFound;
    }

    setParams() {
        if(!this.path.in("/") && !this.params.length) {
            let
                this_o = this,
                split = this.path.split("/"),
                paramCount = 1
            ;
            split.forEach((_part, i) => {
                if(_part) {
                    if(!this_o.params.length) {
                        if(_part) {
                            this_o.params.push(new RouteParameter(this_o, {
                                name : "page",
                                value : _part,
                                userValue : NO_VALUE,
                                string : _part,
                            }));
                        }
                    } else {
                        if(_part.match(/^\{/)) {
                            let
                                name, value, _partSplit = [],
                                _subPart = _part.substr(1, (_part.length - 2)),
                                _prefixPart = _subPart.match(/[a-z0-9\_\-]+\:/gi)
                            ;
                            if(_prefixPart) {
                                _prefixPart = _prefixPart[0];
                                _partSplit.push(_prefixPart.substr(0, (_prefixPart.length - 1)));
                                _partSplit.push(_subPart.replace(_prefixPart, ""));
                            }
                            if(_partSplit.length > 1) {
                                name = _partSplit[0];
                                value = _partSplit[1];
                            } else {
                                name = _subPart;
                                value = undefined;
                                paramCount++;
                            }
                            this_o.params.push(new RouteParameter(this_o, {
                                name : name,
                                value : value,
                                userValue : undefined,
                                string : _part,
                            }));
                        } else {
                            this_o.params.push(new RouteParameter(this_o, {
                                name : "param" + paramCount,
                                value : _part,
                                userValue : NO_VALUE,
                                string : _part,
                            }));
                            paramCount++;
                        }
                    }
                }
            });
        }
    }

    /**
     * @param value
     * @return {string}
     */
    hashValue(value) {
        if(!this.isApacheServer()) {
            let
                regexpDot = new RegExp("\\" + DOT_NO_HASH, "g"),
                regexpSlash = new RegExp("\\" + SLASH_NO_HASH, "g")
            ;
            value = "" + value + "";
            value = value.replace(regexpDot, DOT_HASH);
            value = value.replace(regexpSlash, SLASH_HASH);
        }
        return value;
    }

    /**
     * @param {string} name
     * @param {string|undefined} method
     * @return {boolean}
     */
    matchNameAndMethod(name, method) {
        return (this.name.in(name) && (!co.isSet(method) || ("" + method).in(...this.methods)));
    }

}

module.exports = Route;