const DatatableColumnType = require("./datatable.column.type");
const DatatableColumnBooleanAction = require("../actions/datatable.column.boolean.action");

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

    getAction(column) {
        return new DatatableColumnBooleanAction(this, column);
    }

    checkValue(value) {
        return [
            "<div class='datatable-boolean datatable-boolean-"+ (value ? "enable" : "disable") +" datatable"+ (this.column.type.editable ? "-editable" : "") +"-boolean'>",
                "<div class='datatable-circle'><div class='datatable-circle-core'></div></div>",
            "</div>",
        ].join("");
    }

    getRawValue(value) {
        if(co.isString(value)) value = (value !== "false");
        return (value) ? 1 : 0;
    }

    getCompareValue(value, rawValue) {
        if(co.isString(rawValue)) rawValue = (rawValue !== "false");
        return (rawValue) ? 1 : 0;
    }

}

module.exports = DatatableColumnBooleanType;