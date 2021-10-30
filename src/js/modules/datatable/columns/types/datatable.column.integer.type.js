const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 */
class DatatableColumnIntegerType extends DatatableColumnType {


    static NAME = DatatableColumnType.TYPE_INTEGER;
    

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
    }




}

module.exports = DatatableColumnIntegerType;