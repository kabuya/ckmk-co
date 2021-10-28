const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} format
 * @property {string} defaultFormat
 */
class DatatableColumnDateType extends DatatableColumnType {



    static NAME = DatatableColumnType.TYPE_DATE;
    

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
        /** @type {string} format */
        this.format = data.format;
        /** @type {string} defaultFormat */
        this.defaultFormat = data.defaultFormat;
    }


    getCompareValue(value, rawValue) {
        return Date.format(this.defaultFormat, rawValue);
    }

}

module.exports = DatatableColumnDateType;