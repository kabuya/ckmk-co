const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnDatetimeType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnDatetimeAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnDatetimeType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnDatetimeAction;