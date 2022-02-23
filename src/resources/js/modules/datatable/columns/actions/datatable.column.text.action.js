const DatatableColumnAction = require("./datatable.column.action");

/**
 * @property {DatatableColumnTextType} type
 * @property {DatatableRowColumn} column
 */
class DatatableColumnTextAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnTextType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
    }

}

module.exports = DatatableColumnTextAction;