const DatatableColumnType = require("./datatable.column.type");
const DatatableColumnFloatAction = require("../actions/datatable.column.float.action");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {number} round
 */
class DatatableColumnFloatType extends DatatableColumnType {


    static NAME = DatatableColumnType.TYPE_FLOAT;
    

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
        /** @type {number} round */
        this.round = data.round;
    }

    getAction(column) {
        return new DatatableColumnFloatAction(this, column);
    }


}

module.exports = DatatableColumnFloatType;