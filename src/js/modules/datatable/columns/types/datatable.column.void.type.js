const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} format
 * @property {string} defaultFormat
 */
class DatatableColumnVoidType extends DatatableColumnType {

    static NAME = DatatableColumnType.TYPE_VOID;



}

module.exports = DatatableColumnVoidType;