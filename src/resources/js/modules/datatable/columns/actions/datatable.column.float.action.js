const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnFloatType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnFloatAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnFloatType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnFloatAction;