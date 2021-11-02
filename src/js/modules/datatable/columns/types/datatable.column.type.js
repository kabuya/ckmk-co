const DatatableColumnAction = require("../actions/datatable.column.action");
const DatatableColumnBooleanAction = require("../actions/datatable.column.boolean.action");
const DatatableColumnDateAction = require("../actions/datatable.column.date.action");
const DatatableColumnDatetimeAction = require("../actions/datatable.column.datetime.action");
const DatatableColumnEntityAction = require("../actions/datatable.column.entity.action");
const DatatableColumnFloatAction = require("../actions/datatable.column.float.action");
const DatatableColumnImageAction = require("../actions/datatable.column.image.action");
const DatatableColumnIntegerAction = require("../actions/datatable.column.integer.action");
const DatatableColumnLongtextAction = require("../actions/datatable.column.longtext.action");
const DatatableColumnTextAction = require("../actions/datatable.column.text.action");
const DatatableColumnTimeAction = require("../actions/datatable.column.time.action");
const DatatableColumnActionsAction = require("../actions/datatable.column.actions.action");


/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {boolean} order
 * @property {boolean} hidden
 */
class DatatableColumnType {

    static TYPE_TEXT = "text";
    static TYPE_LONGTEXT = "longtext";
    static TYPE_INTEGER = "integer";
    static TYPE_FLOAT = "float";
    static TYPE_TIME = "time";
    static TYPE_DATE = "date";
    static TYPE_DATETIME = "datetime";
    static TYPE_IMAGE = "image";
    static TYPE_BOOLEAN = "boolean";
    static TYPE_ENTITY = "entity";
    static TYPE_ACTION = "action";
    static TYPE_VOID = "void";

    static NAME = DatatableColumnType.TYPE_TEXT;

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        /** @type {DatatableColumn} column */
        this.column = column;
        /** @type {string} name */
        this.name = data.name;
        /** @type {boolean} visible */
        this.visible = !!column.datatable.getActionRouteOrBoolean(data.visible);
        /** @type {Route|undefined} editable */
        this.editable = column.datatable.getActionRouteOrBoolean(data.editable);
        /** @type {Route|boolean|undefined} searchable */
        this.searchable = column.datatable.getActionRouteOrBoolean(data.searchable);
        /** @type {boolean} order */
        this.order = !!data.order;
        /** @type {boolean} hidden */
        this.hidden = !!data.hidden;
    }

    /**
     * @param {DatatableRowColumn} column
     * @return {
     *      DatatableColumnBooleanAction
     *      |DatatableColumnDateAction
     *      |DatatableColumnDatetimeAction
     *      |DatatableColumnEntityAction
     *      |DatatableColumnFloatAction
     *      |DatatableColumnImageAction
     *      |DatatableColumnIntegerAction
     *      |DatatableColumnLongtextAction
     *      |DatatableColumnTextAction
     *      |DatatableColumnTimeAction
     *      |DatatableColumnActionsAction
     *      |DatatableColumnAction
     * }
     */
    getAction(column) {
        if(this.isBoolean()) {
            return new DatatableColumnBooleanAction(this, column);
        } else if(this.isDate()) {
            return new DatatableColumnDateAction(this, column);
        } else if(this.isDateTime()) {
            return new DatatableColumnDatetimeAction(this, column);
        } else if(this.isEntity()) {
            return new DatatableColumnEntityAction(this, column);
        } else if(this.isFloat()) {
            return new DatatableColumnFloatAction(this, column);
        } else if(this.isImage()) {
            return new DatatableColumnImageAction(this, column);
        } else if(this.isInteger()) {
            return new DatatableColumnIntegerAction(this, column);
        } else if(this.isLongText()) {
            return new DatatableColumnLongtextAction(this, column);
        } else if(this.isText()) {
            return new DatatableColumnTextAction(this, column);
        } else if(this.isTime()) {
            return new DatatableColumnTimeAction(this, column);
        } else if(this.isAction()) {
            return new DatatableColumnActionsAction(this, column);
        } else {
            return new DatatableColumnAction(this, column);
        }
    }

    /**
     * @return {boolean}
     */
    isText() {
        return this.name.in(DatatableColumnType.TYPE_TEXT);
    }

    /**
     * @return {boolean}
     */
    isLongText() {
        return this.name.in(DatatableColumnType.TYPE_LONGTEXT);
    }

    /**
     * @return {boolean}
     */
    isInteger() {
        return this.name.in(DatatableColumnType.TYPE_INTEGER);
    }

    /**
     * @return {boolean}
     */
    isFloat() {
        return this.name.in(DatatableColumnType.TYPE_FLOAT);
    }

    /**
     * @return {boolean}
     */
    isTime() {
        return this.name.in(DatatableColumnType.TYPE_TIME);
    }

    /**
     * @return {boolean}
     */
    isDate() {
        return this.name.in(DatatableColumnType.TYPE_DATE);
    }

    /**
     * @return {boolean}
     */
    isDateTime() {
        return this.name.in(DatatableColumnType.TYPE_DATETIME);
    }

    /**
     * @return {boolean}
     */
    isImage() {
        return this.name.in(DatatableColumnType.TYPE_IMAGE);
    }

    /**
     * @return {boolean}
     */
    isBoolean() {
        return this.name.in(DatatableColumnType.TYPE_BOOLEAN);
    }

    /**
     * @return {boolean}
     */
    isEntity() {
        return this.name.in(DatatableColumnType.TYPE_ENTITY);
    }

    /**
     * @return {boolean}
     */
    isAction() {
        return this.name.in(DatatableColumnType.TYPE_ACTION);
    }

    /**
     * @return {boolean}
     */
    isVoid() {
        return this.name.in(DatatableColumnType.TYPE_VOID);
    }

    /**
     * @return {boolean}
     */
    isHidden() {
        return this.hidden;
    }

    checkValue(value) {
        if(co.isString(value) || co.isNumber(value)) return value;
    }

    getCompareValue(value, rawValue) {
        return value;
    }

}

module.exports = DatatableColumnType;