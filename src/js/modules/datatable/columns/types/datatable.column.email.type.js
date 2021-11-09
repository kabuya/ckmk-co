const DatatableColumnType = require("./datatable.column.type");
const DatatableColumnTranslatorParentType = require("./datatable.column.translator.parent.type");
const DatatableColumnEmailAction = require("../actions/datatable.column.email.action");


/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {boolean} translator
 * @property {TranslatorText|string|undefined} text
 */
class DatatableColumnEmailType extends DatatableColumnTranslatorParentType {


    static NAME = DatatableColumnType.TYPE_EMAIL;

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
    }

    getAction(column) {
        return new DatatableColumnEmailAction(this, column);
    }

    parseTemplate(template, rowColumn) {
        return template.replace(new RegExp("email\@void\.com", "gi"), (rowColumn.rawValue || ""));
    }

    checkValue(value) {
        if(!co.isString(value) || value === "email@void.com") return;
        return super.checkValue(value);
    }

    getCompareValue(value, rawValue) {
        return rawValue.noAccent();
    }


}

module.exports = DatatableColumnEmailType;