const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 */
class DatatableColumnBooleanType extends DatatableColumnType {


    static NAME = DatatableColumnType.TYPE_BOOLEAN;
    

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
    }

    checkValue(value) {
        return [
            "<div class='datatable-boolean datatable-boolean-"+ (value ? "enable" : "disable") +" datatable"+ (this.column.type.editable ? "-editable" : "") +"-boolean'>",
                "<div class='datatable-circle'><div class='datatable-circle-core'></div></div>",
            "</div>",
        ].join("");
    }

    getRawValue(value) {
        return value ? 1 : 0;
    }

    getCompareValue(value, rawValue) {
        return rawValue ? 1 : 0;
    }

}

module.exports = DatatableColumnBooleanType;