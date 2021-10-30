const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {boolean} translator
 * @property {TranslatorText|string|undefined} text
 */
class DatatableColumnTranslatorParentType extends DatatableColumnType {


    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
        /** @type {boolean} translator */
        this.translator = data.translator;
        /** @type {TranslatorText|undefined} translator */
        this.text = co.texts.get(data.text);
    }




}

module.exports = DatatableColumnTranslatorParentType;