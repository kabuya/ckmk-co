const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 */
class DatatableColumnBooleanType extends DatatableColumnType {


    static NAME = DatatableColumnType.TYPE_BOOLEAN;
    

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
    }


    getCompareValue(value, rawValue) {
        return rawValue ? 1 : 0;
    }


}

module.exports = DatatableColumnBooleanType;