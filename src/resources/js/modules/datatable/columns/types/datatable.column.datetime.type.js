const DatatableColumnDatetimeParent = require("./datatable.column.datetime.parent");
const DatatableColumnDatetimeAction = require("../actions/datatable.column.datetime.action");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} format
 * @property {string} defaultFormat
 */
class DatatableColumnDatetimeType extends DatatableColumnDatetimeParent {


    static NAME = DatatableColumnDatetimeParent.TYPE_DATETIME;

    getAction(column) {
        return new DatatableColumnDatetimeAction(this, column);
    }

}

module.exports = DatatableColumnDatetimeType;