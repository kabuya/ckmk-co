const NO_VALUE = "unset";
const REGEXP_REGEXP = "\\[[a-z0-9\\-\\_\\.\\\\ \\%\\+]+\\](\\+|\\{[0-9]+(\\,[0-9]+){0,1}\\}){0,1}";
const REGEXP_TEXTS_VARIABLES = "\\@\\{[a-z0-9\\_\\-\\:\\.]+\\}";
const REGEXP_TESTS = [
    "^"+REGEXP_REGEXP+"$",
    "^"+REGEXP_TEXTS_VARIABLES+"$",
].join("|");

/**
 * @property {Route} Route
 * @property {string} name
 * @property {string|undefined} value
 * @property {string|undefined} userValue
 * @property {string} string
 * @property {string|undefined} regexp
 * @property {string|undefined} translatorKey
 */
class RouteParameter {

    /**
     * @param {Route} Route
     * @param {{
     *    name:string,
     *    value:(string|undefined),
     *    userValue:(string|undefined),
     *    string:string
     * }} data
     */
    constructor(Route, data) {
        this.regexp = this.translatorKey = undefined;
        this.Route = Route;
        this.name = data.name;
        this.value = this.initValue(data.value);
        this.userValue = data.userValue;
        this.string = data.string;
    }

    /**
     * @return {string|undefined}
     */
    getName() {
        return this.name;
    }

    /**
     * @return {string|undefined}
     */
    getValue() {
        return this.value;
    }

    /**
     * @return {string|undefined}
     */
    getUserValue() {
        return this.userValue;
    }

    /**
     * @param {string} userValue
     */
    setUserValue(userValue) {
        if(!this.isTranslatorParameter()) {
            if(this.isRegexpParameter() && !this.isMatchedByRegexp(userValue)) {
                throw new TypeError("The value of " + this.getName() + " parameter isn't correct. No match by regexp : " + this.getValue());
            }
            this.userValue = userValue;
        }
    }

    /**
     * @param {string} type
     * @return {string}
     */
    getTranslatorValue(type) {
        if(this.isTranslatorParameter()) {
            let
                textName = this.translatorKey.substr(2, this.translatorKey.length - 3),
                text = co.texts.get(textName)
            ;
            if(text) {
                let
                    textValue = text.getValue(),
                    jqDom = $(textValue)
                ;
                if(jqDom.length) return jqDom.text().kebab();
                return textValue.kebab();
            }
        }
    }

    /**
     * @return {string|undefined}
     */
    getString() {
        return this.string;
    }

    /**
     * @return {boolean}
     */
    requireUserParams() {
        return !this.value || (new RegExp("^" + REGEXP_REGEXP + "$", "i")).test(this.value);
    }

    /**
     * @return {boolean}
     */
    hasUserValue() {
        return !!this.userValue;
    }

    /**
     * @return {boolean}
     */
    isTranslatorParameter() {
        return !!this.translatorKey;
    }

    /**
     * @return {boolean}
     */
    isRegexpParameter() {
        return !!this.regexp;
    }

    /**
     * @param {string} value
     * @return {boolean}
     */
    isMatchedByRegexp(value) {
        if(this.isRegexpParameter()) {
            return (new RegExp("^"+this.regexp+"$", "i")).test(value);
        }
        return false;
    }

    /**
     * @param {string|undefined} value
     * @return {string|undefined}
     */
    initValue(value) {
        if(RouteParameter.isValidRegexp(value)) {
            this.regexp = value;
            return;
        } else if(RouteParameter.isValidTranslatorKey(value)) {
            this.translatorKey = value;
            return;
        }
        return value;
    }

    /**
     * @param {string} regexp
     * @return {boolean}
     */
    static isValidRegexp(regexp) {
        return (new RegExp("^"+REGEXP_REGEXP+"$", "i")).test(regexp);
    }

    static isValidTranslatorKey(translatorKey) {
        return (new RegExp("^"+REGEXP_TEXTS_VARIABLES+"$", "i")).test(translatorKey);
    }

}

module.exports = RouteParameter;