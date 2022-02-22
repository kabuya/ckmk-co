/**
 * @property {string} local
 * @property {string[]} locals
 * @property {string[]} texts
 */
class Translation {


    constructor() {
        this.local = "";
        this.locals = this.texts = [];
    }

    initJsData() {
        if(window.jsData && window.jsData.translation) {
            this.local = window.jsData.translation.local;
            this.locals = window.jsData.translation.locals;
            this.texts = window.jsData.translation.texts;
            delete window.jsData.translation;
        }
    }

    /**
     * @param {string} id
     * @param {{}|null} parameters
     */
    trans(id, parameters) {
        let text = this.texts[id];
        parameters = parameters || {};
        if(co.isString(text)) {
           for(const _key in parameters) {
               const _keyValue = parameters[_key];
               text = text.replace(_key, _keyValue);
           }
           return text;
        }
    }

}

module.exports = new Translation();