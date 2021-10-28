const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnBooleanType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnBooleanAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnBooleanType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnBooleanAction;