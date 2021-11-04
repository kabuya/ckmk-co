const DatatableColumnDatetimeParent = require("./datatable.column.datetime.parent");

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

}

module.exports = DatatableColumnTimeType;