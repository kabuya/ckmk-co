const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnDateType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnDateAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnDateType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnDateAction;