const DatatableColumnType = require("./types/datatable.column.type");
const DatatableColumnBooleanType = require("./types/datatable.column.boolean.type");
const DatatableColumnDatetimeType = require("./types/datatable.column.datetime.type");
const DatatableColumnDateType = require("./types/datatable.column.date.type");
const DatatableColumnEntityType = require("./types/datatable.column.entity.type");
const DatatableColumnFloatType = require("./types/datatable.column.float.type");
const DatatableColumnImageType = require("./types/datatable.column.image.type");
const DatatableColumnIntegerType = require("./types/datatable.column.integer.type");
const DatatableColumnLongtextType = require("./types/datatable.column.longtext.type");
const DatatableColumnTextType = require("./types/datatable.column.text.type");
const DatatableColumnTimeType = require("./types/datatable.column.time.type");
const DatatableColumnActionType = require("./types/datatable.column.action.type");
const DatatableColumnVoidType = require("./types/datatable.column.void.type");

const COLUMNS_TYPES = [
    DatatableColumnType,
    DatatableColumnBooleanType,
    DatatableColumnDatetimeType,
    DatatableColumnDateType,
    DatatableColumnEntityType,
    DatatableColumnFloatType,
    DatatableColumnImageType,
    DatatableColumnIntegerType,
    DatatableColumnLongtextType,
    DatatableColumnTextType,
    DatatableColumnTimeType,
    DatatableColumnActionType,
    DatatableColumnVoidType,
];

const HTML_CLASS_HIDDEN = "datatable-item-hidden";

/**
 * @property {Datatable} datatable
 * @property {jQuery|HTMLElement} dom
 * @property {string} name
 * @property {string} title
 * @property {number} position
 * @property {DatatableColumnsGroup|undefined} group
 * @property {string|undefined} formTemplate
 * @property {
 *   DatatableColumnBooleanType
 *  |DatatableColumnDatetimeType
 *  |DatatableColumnDateType
 *  |DatatableColumnEntityType
 *  |DatatableColumnFloatType
 *  |DatatableColumnImageType
 *  |DatatableColumnIntegerType
 *  |DatatableColumnLongtextType
 *  |DatatableColumnTextType
 *  |DatatableColumnTimeType
 *  |DatatableColumnType
 * } type
 * @property {DatatableRowColumn} columns
 * @property {jQuery|HTMLElement|undefined} searchROW
 */
class DatatableColumn {

    /**
     * @param {Datatable} datatable
     * @param {jQuery|HTMLElement} dom
     */
    constructor(datatable, dom) {
        this.datatable = datatable;
        this.dom = $(dom);
        /** @type {string} name */
        this.name = co.data(this.dom, "name");
        /** @type {string} title */
        this.title = co.data(this.dom, "title");
        /** @type {number} position */
        this.position = co.data(this.dom, "position");
        /** @type {DatatableColumnsGroup|undefined} group */
        this.group = this.datatable.getColumnsGroup(co.data(this.dom, "group"));
        if(this.group) this.group.addColumn(this);
        /** @type {
         *   DatatableColumnBooleanType
         *  |DatatableColumnDatetimeType
         *  |DatatableColumnDateType
         *  |DatatableColumnEntityType
         *  |DatatableColumnFloatType
         *  |DatatableColumnImageType
         *  |DatatableColumnIntegerType
         *  |DatatableColumnLongtextType
         *  |DatatableColumnTextType
         *  |DatatableColumnTimeType
         *  |DatatableColumnActionType
         *  |DatatableColumnVoidType
         *  |DatatableColumnType
         *  |undefined
        } type */
        this.type = DatatableColumn.buildColumnType(this, co.data(this.dom, "type"));
        /** @type {string|undefined} formTemplate */
        this.formTemplate = this.getFormTemplate();
        /** @type {DatatableRowColumn[]} columns */
        this.columns = [];
        /** @type {jQuery|HTMLElement|undefined} searchROW */
        this.searchROW = this
            .datatable
            .dom
            .find("th[data-search-column-target="+ this.name +"]")
            .removeAttr("data-search-column-target")
        ;
        if(this.isHidden()) {
            this.dom.remove();
            if(this.searchROW) this.searchROW.remove();
        }
        this.setEvents();
    }

    /**
     * @return {DatatableRowColumn[]}
     */
    getColumns() {
        return this.columns;
    }

    /**
     * @param {DatatableRowColumn} column
     * @return {boolean}
     */
    addColumn(column) {
        if(!this.hasColumn(column)) {
            this.columns.push(column);
            return true;
        }
        return false;
    }

    /**
     * @param {DatatableRowColumn} column
     * @return {boolean}
     */
    removeColumn(column) {
        if(this.hasColumn(column)) {
            this.columns = this.columns.filter((_column) => {
                return _column !== column;
            });
            return true;
        }
        return false;
    }

    /**
     * @param {DatatableRowColumn} column
     * @return {boolean}
     */
    hasColumn(column) {
        return (this.columns.filter((_column) => {
            return _column === column;
        }).length > 0);
    }

    /**
     * @return {boolean}
     */
    show() {
        if(this.isVisible()) return false;
        this.dom.removeClass(HTML_CLASS_HIDDEN);
        if(this.searchROW) this.searchROW.removeClass(HTML_CLASS_HIDDEN);
        this.columns.forEach((_column) => {
            _column.show();
        });
        this.resetColspanByGroup();
        return true;
    }

    /**
     * @return {boolean}
     */
    hide() {
        if(!this.isVisible()) return false;
        this.dom.addClass(HTML_CLASS_HIDDEN);
        if(this.searchROW) this.searchROW.addClass(HTML_CLASS_HIDDEN);
        this.columns.forEach((_column) => {
            _column.hide();
        });
        this.resetColspanByGroup();
        return true;
    }

    /**
     * @return {boolean}
     */
    isVisible() {
        return !this.dom.hasClass(HTML_CLASS_HIDDEN);
    }

    /**
     * @return {boolean}
     */
    isHidden() {
        return this.type.hidden;
    }

    /**
     * @return {boolean}
     */
    isColumnAction() {
        return this.type.isAction();
    }

    /**
     * @return {boolean}
     */
    isColumnRowsCount() {
        return (!!this.name.match(/number/i));
    }

    /**
     * @return {boolean}
     */
    hasGroup() {
        return co.isObject(this.group);
    }

    resetColspanByGroup() {
        if(this.group) this.group.resetColspanForColumnChild();
    }

    /**
     * @param {number} colspan
     * @return {DatatableColumn}
     */
    setColspan(colspan) {
        if(co.isNumber(colspan)) {
            this.dom.attr("colspan", colspan);
            if(this.searchROW) this.searchROW.attr("colspan", colspan);
            this.columns.forEach((_column) => {
                _column.dom.attr("colspan", colspan);
            });
        }
        return this;
    }

    /**
     * @return {DatatableColumn}
     */
    removeColspan() {
        if(this.dom.attr("colspan")) {
            this.dom.removeAttr("colspan");
            if(this.searchROW) this.searchROW.removeAttr("colspan");
            this.columns.forEach((_column) => {
                _column.dom.removeAttr("colspan");
            });
        }
        return this;
    }

    /**
     * @return {string|undefined}
     */
    getFormTemplate() {
        if(!this.type.isNotUsePopupForm()) {
            let
                formTemplate = this.dom.find(".form-template"),
                template = formTemplate.text().trim()
            ;
            formTemplate.remove();
            return template
                ? template
                : undefined
            ;
        }
    }

    /**
     * @return {boolean}
     */
    hasFormTemplate() {
        return (!this.type.isNotUsePopupForm() && !!this.formTemplate);
    }

    /**
     * @return {boolean}
     */
    isOrdered() {
        return this.type.order;
    }

    /**
     * @return {boolean}
     */
    isTargetOrder() {
        return this.datatable.isOrderedByColumn(this);
    }

    /**
     * @return {boolean}
     */
    isDescOrder() {
        if(this.isTargetOrder()) {
            return this.datatable.isDescOrder();
        }
        return false;
    }

    isAscOrder() {
        if(this.isTargetOrder()) {
            return this.datatable.isAscOrder();
        }
        return false;
    }

    /**
     * @param {Event} e
     */
    changerOrder(e) {
        this.datatable.run(
            this.datatable.EVENT_ON_COLUMN_REORDER_ROWS,
            this
        );
        if(this.isAscOrder()) {
            this.setDescIconOrder();
            return this.datatable.sort(this, "desc");
        } else if(this.isDescOrder()) {
            this.setFixedIconOrder();
            return this.datatable.resetOrder();
        }
        this.setAscIconOrder();
        return this.datatable.sort(this, "asc");
    }

    /**
     * @return {jQuery|HTMLElement}
     */
    setDescIconOrder() {
        return this.setIconOrder("fa-sort-desc");
    }

    /**
     * @return {jQuery|HTMLElement}
     */
    setAscIconOrder() {
        return this.setIconOrder("fa-sort-asc");
    }

    /**
     * @return {jQuery|HTMLElement}
     */
    setFixedIconOrder() {
        return this.setIconOrder("fa-sort");
    }

    /**
     * @param {DatatableColumn} column
     * @return {jQuery|HTMLElement|undefined}
     */
    removeOrderIcon(column) {
        if(this.isOrdered() && this !== column) return this.setFixedIconOrder();
    }

    /**
     * @param {string} type
     * @return {jQuery|HTMLElement}
     */
    setIconOrder(type) {
        return this.dom.find(".datatable-order-icon")
            .removeClass("fa-sort")
            .removeClass("fa-sort-asc")
            .removeClass("fa-sort-desc")
            .addClass(type)
        ;
    }

    setEvents() {
        let
            this_o = this
        ;
        if(this.isOrdered()) {
            this.dom.on("click", (e) => {
                return this_o.changerOrder(e);
            });
            this.datatable.on(
                this.datatable.EVENT_ON_COLUMN_REORDER_ROWS,
                [this, "removeOrderIcon"]
            );
        }
    }

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     * @return {
     *   DatatableColumnBooleanType
     *  |DatatableColumnDatetimeType
     *  |DatatableColumnDateType
     *  |DatatableColumnEntityType
     *  |DatatableColumnFloatType
     *  |DatatableColumnImageType
     *  |DatatableColumnIntegerType
     *  |DatatableColumnLongtextType
     *  |DatatableColumnTextType
     *  |DatatableColumnTimeType
     *  |DatatableColumnType
     *  |undefined
     * }
     */
    static buildColumnType(column, data) {
        if(co.isObject(data)) {
            let type;
            COLUMNS_TYPES.forEach((_type) => {
                if(data.name === _type.NAME && !type) {
                    type = new _type(column, data);
                }
            });
            return type;
        }
        return new DatatableColumnVoidType(column, {});
    }

}

DatatableColumn.prototype.HTML_CLASS_HIDDEN = HTML_CLASS_HIDDEN;

module.exports = DatatableColumn;