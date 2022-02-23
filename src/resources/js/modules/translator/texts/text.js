const REGEXP_TEXTS_VARIABLES = "\\@\\{[a-z0-9\\_\\-\\:\\.]+\\}";
const REGEXP_VARIABLES = "\\{[a-z0-9\\_\\-\\:\\.]+\\}";
const TEXTS_VARIABLES_EXTRA_TEXT = [
    "@", "{", "}"
];

class TranslatorText {


    /**
     * @param {Translator} Translator
     * @param {string} lang
     * @param {string} name
     * @param {string} value
     * @param {boolean} fromSystem
     * @param {string} args
     * @constructor
     */
    constructor(Translator, lang, name, value, fromSystem = false, ...args) {
        this.Translator = Translator;
        this.lang = lang;
        this.name = name;
        this.value = value;
        this.fromSystem = fromSystem;
        this.args = this.parseArgs(args);
        this.textsVariables = {};
        this.variables = {};
        this.setTextsVariables();
        this.setVariables();
    }


    /**
     * @return {string}
     */
    toString() {
        return this.getValue() || "";
    }

    /**
     * @param {string} name
     * @param {string|number} value
     * @return {TranslatorText}
     */
    addArgument(name, value) {
        if(co.isString(name, value)) {
            this.args[name] = value;
        }
        return this;
    }

    /**
     * @return {string}
     */
    getValue() {
        let
            this_o = this,
            value = this.value,
            index = 0
        ;
        $.each(this.textsVariables, function (variable, text) {
            value = value.replace(variable, text);
        });
        $.each(this.variables, function (name, variable) {
            let variableValue = this_o.args[name] || this_o.args[index];
            if(variableValue) {
                value = value.replace(variable, variableValue);
            }
            index++;
        });
        return value;
    }

    /**
     * @return {string}
     */
    getOriginalValue() {
        return this.value;
    }

    setTextsVariables() {
        let
            this_o = this,
            variables = this.value.match(new RegExp(REGEXP_TEXTS_VARIABLES, "gi"))
        ;
        $.each(variables, function (i, value) {
            let rewriteVariable = this_o.rewriteVariable(value);
            this_o.textsVariables[value] = this_o.Translator.get(rewriteVariable);
        });
    }

    setVariables() {
        let
            this_o = this,
            variables = this.value.match(new RegExp(REGEXP_VARIABLES, "gi"))
        ;
        $.each(variables, function (i, value) {
            if(!this_o.textsVariables["@" + value]) {
                let rewriteVariable = this_o.rewriteVariable(value);
                this_o.variables[rewriteVariable] = value;
            }
        });
    }

    /**
     * @param {string[]} args
     */
    parseArgs(args) {
        let argsObj = {};
        $.each(args, function (i, value) {
            argsObj[i] = value;
        });
        return argsObj;
    }

    /**
     * @param {string} variable
     */
    rewriteVariable(variable) {
        if(co.isString(variable)) {
            return variable.replace(new RegExp("["+ TEXTS_VARIABLES_EXTRA_TEXT +"]+", "gi"), "");
        }
    }


}

module.exports = TranslatorText;
