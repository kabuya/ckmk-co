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

const TYPE_TEXT = "text";
const TYPE_LONGTEXT = "longtext";
const TYPE_INTEGER = "integer";
const TYPE_FLOAT = "float";
const TYPE_TIME = "time";
const TYPE_DATE = "date";
const TYPE_DATETIME = "datetime";
const TYPE_IMAGE = "image";
const TYPE_BOOLEAN = "boolean";
const TYPE_ENTITY = "entity";
const TYPE_ACTION = "action";
const TYPE_VOID = "void";

const NOT_ORDERED = [
    TYPE_IMAGE,
    TYPE_ACTION,
    TYPE_VOID,
];

const NOT_EDITABLE = [
    TYPE_IMAGE,
    TYPE_ACTION,
    TYPE_VOID,
];

const NOT_SEARCHABLE = [
    TYPE_IMAGE,
    TYPE_BOOLEAN,
    TYPE_ACTION,
    TYPE_VOID,
];

const NOT_USE_FORM_TYPES = [
    TYPE_IMAGE,
    TYPE_BOOLEAN,
    TYPE_ACTION,
    TYPE_VOID,
];

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {boolean} order
 * @property {boolean} hidden
 */
class DatatableColumnType {

    static TYPE_TEXT = TYPE_TEXT;
    static TYPE_LONGTEXT = TYPE_LONGTEXT;
    static TYPE_INTEGER = TYPE_INTEGER;
    static TYPE_FLOAT = TYPE_FLOAT;
    static TYPE_TIME = TYPE_TIME;
    static TYPE_DATE = TYPE_DATE;
    static TYPE_DATETIME = TYPE_DATETIME;
    static TYPE_IMAGE = TYPE_IMAGE;
    static TYPE_BOOLEAN = TYPE_BOOLEAN;
    static TYPE_ENTITY = TYPE_ENTITY;
    static TYPE_ACTION = TYPE_ACTION;
    static TYPE_VOID = TYPE_VOID;

    static NOT_ORDERED = NOT_ORDERED;

    static NOT_EDITABLE = NOT_EDITABLE;

    static NOT_SEARCHABLE = NOT_SEARCHABLE;

    static NOT_USE_FORM_TYPES = NOT_USE_FORM_TYPES;

    static NAME = TYPE_TEXT;

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        /** @type {DatatableColumn} column */
        this.column = column;
        /** @type {string} name */
        this.name = (this.name || data.name);
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
            co.log(column);
            console.error("Ici quelque chose");
            //return new DatatableColumnAction(this, column);
        }
    }

    /**
     * @return {boolean}
     */
    isText() {
        return this.name.in(TYPE_TEXT);
    }

    /**
     * @return {boolean}
     */
    isLongText() {
        return this.name.in(TYPE_LONGTEXT);
    }

    /**
     * @return {boolean}
     */
    isInteger() {
        return this.name.in(TYPE_INTEGER);
    }

    /**
     * @return {boolean}
     */
    isFloat() {
        return this.name.in(TYPE_FLOAT);
    }

    /**
     * @return {boolean}
     */
    isTime() {
        return this.name.in(TYPE_TIME);
    }

    /**
     * @return {boolean}
     */
    isDate() {
        return this.name.in(TYPE_DATE);
    }

    /**
     * @return {boolean}
     */
    isDateTime() {
        return this.name.in(TYPE_DATETIME);
    }

    /**
     * @return {boolean}
     */
    isImage() {
        return this.name.in(TYPE_IMAGE);
    }

    /**
     * @return {boolean}
     */
    isBoolean() {
        return this.name.in(TYPE_BOOLEAN);
    }

    /**
     * @return {boolean}
     */
    isEntity() {
        return this.name.in(TYPE_ENTITY);
    }

    /**
     * @return {boolean}
     */
    isAction() {
        return this.name.in(TYPE_ACTION);
    }

    /**
     * @return {boolean}
     */
    isVoid() {
        return this.name.in(TYPE_VOID);
    }

    /**
     * @return {boolean}
     */
    isHidden() {
        return this.hidden;
    }

    /**
     * @return {boolean}
     */
    isNotOrderAble() {
        return this.name.in(...NOT_ORDERED);
    }

    /**
     * @return {boolean}
     */
    isNotEditable() {
        return this.name.in(...NOT_EDITABLE);
    }

    /**
     * @return {boolean}
     */
    isNotSearchable() {
        return this.name.in(...NOT_SEARCHABLE);
    }

    /**
     * @return {boolean}
     */
    isNotUsePopupForm() {
        return this.name.in(...NOT_USE_FORM_TYPES);
    }

    checkValue(value) {
        if(co.isString(value) || co.isNumber(value)) return value;
    }

    getRawValue(value) {
        return value;
    }

    getCompareValue(value, rawValue) {
        return value;
    }

}

module.exports = DatatableColumnType;