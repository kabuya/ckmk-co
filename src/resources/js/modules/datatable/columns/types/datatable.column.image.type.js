const DatatableColumnType = require("./datatable.column.type");
const DatatableColumnImageAction = require("../actions/datatable.column.image.action");

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


    getAction(column) {
        return new DatatableColumnImageAction(this, column);
    }


}

module.exports = DatatableColumnImageType;