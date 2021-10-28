const TranslatorText = require("./texts/text");

let
    lang,
    langTitle,
    texts,
    emptyTexts,
    checker,
    system = {}
;

class Translator {


    constructor() {
        if(window.jsData) {
            lang = window.jsData.lang;
            langTitle = window.jsData.langTitle;
            texts = window.jsData.texts || {};
            emptyTexts = window.jsData.emptyTexts || [];
            if(window.jsData.systemTrans) {
                system.lang = window.jsData.systemTrans.lang;
                system.langTitle = window.jsData.systemTrans.langTitle;
                system.texts = window.jsData.systemTrans.texts || {};
            } else {
                system.texts = {};
            }
            delete window.jsData.lang;
            delete window.jsData.langTitle;
            delete window.jsData.texts;
            delete window.jsData.emptyTexts;
            delete window.jsData.systemTrans;
        } else {
            texts = {};
            emptyTexts = [];
        }

        checker = require("./texts/texts.checker").init(this);
    }

    /**
     * @param {string} index
     * @param {string} args
     * @return {TranslatorText|undefined}
     */
    get(index, ...args) {
        index = this.perfectIndex(index);
        let value = texts[index];
        if(value) {
            return new TranslatorText(this, lang, index, value, false,  ...args);
        } else {
            value = system.texts[index];
            if(value) {
                return new TranslatorText(this, lang, index, value, true, ...args);
            }
            emptyTexts.push(index);
        }
    }

    /**
     * @param {string} index
     * @return {boolean}
     */
    has(index) {
        index = this.perfectIndex(index);
        return !!texts[index];
    }

    /**
     * @param {string} name
     * @param {string} value
     */
    add(name, value) {
        name = this.perfectIndex(name);
        if(co.isString(name, value)) {
            texts[name] = value;
        }
    }

    /**
     * @param {string} name
     * @param {string} value
     */
    edit(name, value) {
        name = this.perfectIndex(name);
        if(texts[name] && co.isString(value)) {
            texts[name] = value;
        }
    }

    /**
     * @param {string} name
     */
    remove(name) {
        name = this.perfectIndex(name);
        if(texts[name]) {
            delete texts[name];
        }
    }

    /**
     * @return {string|undefined}
     */
    getLang() {
        return lang;
    }

    /**
     * @return {string|undefined}
     */
    getLangTitle() {
        return langTitle;
    }

    /**
     * @return {{}}
     */
    getTexts() {
        return texts;
    }

    /**
     * @return {string|undefined}
     */
    getSystemLang() {
        return system.lang;
    }

    /**
     * @return {string|undefined}
     */
    getSystemLangTitle() {
        return system.langTitle;
    }

    /**
     * @return {{}}
     */
    getSystemTexts() {
        return system.texts;
    }

    /**
     * @param {string} index
     */
    perfectIndex(index) {
        if(co.isString(index)) {
            index = index.replace(/[-.:]+/g, "_");
            return index.upper();
        }
    }

    /**
     * @return {string[]}
     */
    getEmptyTexts() {
        return emptyTexts;
    }

}

module.exports = new Translator();
