const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 */
class DatatableColumnImageType extends DatatableColumnType {


    static NAME = DatatableColumnType.TYPE_IMAGE;
    

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
    }




}

module.exports = DatatableColumnImageType;