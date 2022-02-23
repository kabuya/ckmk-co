const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} format
 * @property {string} defaultFormat
 */
class DatatableColumnDatetimeParent extends DatatableColumnType {



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

    checkValue(value) {
        return Date.format(this.format, value);
    }

    getRawValue(value) {
        return Date.format(this.defaultFormat, value);
    }

    getCompareValue(value, rawValue) {
        return Date.format(this.defaultFormat, rawValue);
    }

}

module.exports = DatatableColumnDatetimeParent;