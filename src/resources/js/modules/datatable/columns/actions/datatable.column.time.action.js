const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnTimeType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnTimeAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnTimeType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnTimeAction;