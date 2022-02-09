const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnEntityType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnEntityAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnEntityType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnEntityAction;