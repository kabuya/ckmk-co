const DatatableColumnType = require("./datatable.column.type");
const DatatableColumnIntegerAction = require("../actions/datatable.column.integer.action");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 */
class DatatableColumnIntegerType extends DatatableColumnType {


    static NAME = DatatableColumnType.TYPE_INTEGER;
    

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
    }


    getAction(column) {
        return new DatatableColumnIntegerAction(this, column);
    }


}

module.exports = DatatableColumnIntegerType;