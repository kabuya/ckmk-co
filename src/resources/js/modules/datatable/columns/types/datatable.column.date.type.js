const DatatableColumnDatetimeParent = require("./datatable.column.datetime.parent");
const DatatableColumnDateAction = require("../actions/datatable.column.date.action");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} format
 * @property {string} defaultFormat
 */
class DatatableColumnDateType extends DatatableColumnDatetimeParent {


    static NAME = DatatableColumnDatetimeParent.TYPE_DATE;

    getAction(column) {
        return new DatatableColumnDateAction(this, column);
    }

}

module.exports = DatatableColumnDateType;