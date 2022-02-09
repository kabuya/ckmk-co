const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnIntegerType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnIntegerAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnIntegerType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnIntegerAction;