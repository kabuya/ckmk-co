let
    /** @type {string} */
    local,
    /** @type {string[]} */
    locals,
    /** @type {string[]} */
    texts
;

class Translation {


    constructor() {

    }

    initJsData() {
        const translation = co.getJsData("translation");
        if(translation) {
            local = translation.local;
            locals = translation.locals;
            texts = translation.texts;
        }
    }

    /**
     * @return {string}
     */
    local() {
        return local;
    }

    /**
     * @return {string[]}
     */
    locals() {
        return locals;
    }

    /**
     * @return {string[]}
     */
    texts() {
        return texts;
    }

    /**
     * @param {string} id
     * @param {{}|null} parameters
     */
    trans(id, parameters = {}) {
        let text = texts[id];
        parameters = parameters || {};
        if(co.isString(text)) {
           for(const _key in parameters) {
               const _keyValue = parameters[_key];
               text = text.replace(_key, _keyValue);
           }
           return text;
        }
        return id;
    }

}

module.exports = new Translation();