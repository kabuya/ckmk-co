const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnEmailType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnEmailAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnEmailType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnEmailAction;