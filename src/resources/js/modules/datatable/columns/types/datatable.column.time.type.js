const DatatableColumnDatetimeParent = require("./datatable.column.datetime.parent");
const DatatableColumnTimeAction = require("../actions/datatable.column.time.action");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} format
 * @property {string} defaultFormat
 */
class DatatableColumnTimeType extends DatatableColumnDatetimeParent {


    static NAME = DatatableColumnDatetimeParent.TYPE_TIME;

    getAction(column) {
        return new DatatableColumnTimeAction(this, column);
    }

}

module.exports = DatatableColumnTimeType;