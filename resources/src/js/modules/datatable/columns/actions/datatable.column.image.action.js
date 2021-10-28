const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnImageType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnImageAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnImageType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnImageAction;