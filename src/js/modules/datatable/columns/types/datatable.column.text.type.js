const DatatableColumnType = require("./datatable.column.type");
const DatatableColumnTranslatorParentType = require("./datatable.column.translator.parent.type");


/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {boolean} translator
 * @property {TranslatorText|string|undefined} text
 */
class DatatableColumnTextType extends DatatableColumnTranslatorParentType {


    static NAME = DatatableColumnType.TYPE_TEXT;

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
    }


    getCompareValue(value, rawValue) {
        return rawValue.noAccent();
    }


}

module.exports = DatatableColumnTextType;