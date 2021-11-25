const EventTypes = require("../events/listener/event.types");
const DatatableColumnsGroup = require("./columns/groups/datatable.columns.group");
const DatatableColumn = require("./columns/datatable.column");
const DatatableRow = require("./rows/datatable.row");
const DatatablePagination = require("./paginations/datatable.pagination");
const DatatableActions = require("./actions/datatable.actions");
const DatatableAlert = require("./alert/datatable.alert");
const DatatableSelectedColumns = require("./columns/selected/datatable.selected.columns");
const DatatableGrants = require("./grants/datatable.grants");

const EVENT_ON_SEARCH = "search";
const EVENT_ON_SEARCH_RESULT_COUNT = "search.result.count";
const EVENT_ON_TOGGLE_COLUMN_DISPLAY = "toggle.column.display";
const EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN = "toggle.active.all.column";
const EVENT_ON_CLICK_ON_TABLE_DOM = "click.on.table.dom";
const EVENT_ON_CHANGE_COUNT_LINE = "change.count.line";
const EVENT_ON_CHANGE_ROWS_TARGET = "change.rows.target";
const EVENT_ON_SELECTED_ROW_ADD = "selected.row.add";
const EVENT_ON_SELECTED_ROW_REMOVE = "selected.row.remove";
const EVENT_ON_COLUMN_REORDER_ROWS = "column.reorder.rows";
const EVENT_ON_AFTER_ADDING_ITEM = "after.adding.item";
const EVENT_ON_AFTER_REMOVING_ITEM = "after.removing.item";

const EVENTS = [
    EVENT_ON_SEARCH,
    EVENT_ON_SEARCH_RESULT_COUNT,
    EVENT_ON_TOGGLE_COLUMN_DISPLAY,
    EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN,
    EVENT_ON_CLICK_ON_TABLE_DOM,
    EVENT_ON_CHANGE_COUNT_LINE,
    EVENT_ON_CHANGE_ROWS_TARGET,
    EVENT_ON_SELECTED_ROW_ADD,
    EVENT_ON_SELECTED_ROW_REMOVE,
    EVENT_ON_COLUMN_REORDER_ROWS,
    EVENT_ON_AFTER_ADDING_ITEM,
    EVENT_ON_AFTER_REMOVING_ITEM,
];

const VISIBILITY_CONTENT_STYLE = "contentStyle";
const VISIBILITY_ADDABLE_TOP = "addableTop";
const VISIBILITY_DELETABLE_TOP = "deletableTop";
const VISIBILITY_LINES_TOP = "linesTop";
const VISIBILITY_TYPES_TOP = "typesTop";
const VISIBILITY_COLUMNS_TOP = "columnsTop";
const VISIBILITY_SEARCH_TOP = "searchTop";
const VISIBILITY_PAGINATION_TOP = "paginationTop";
const VISIBILITY_PAGINATION_DOWN = "paginationDown";

const VISIBILITIES_KEYS = [
    VISIBILITY_CONTENT_STYLE,
    VISIBILITY_ADDABLE_TOP,
    VISIBILITY_DELETABLE_TOP,
    VISIBILITY_LINES_TOP,
    VISIBILITY_TYPES_TOP,
    VISIBILITY_COLUMNS_TOP,
    VISIBILITY_SEARCH_TOP,
    VISIBILITY_PAGINATION_TOP,
    VISIBILITY_PAGINATION_DOWN,
];

const ROW_MODEL_KEY = "__model";

const HTML_SELECTE_DOM = [
    "<td class='datatable-body-column datatable-selected-column'>",
        "<div class='datatable-row-selected'><div></div></div>",
    "</td>"
].join("");

const EMPTY_DATA_ROW = "<td title='' class='datatable-data-empty' colspan=''></td>";

let
    /** @type {Datatable[]} datatables */
    datatables = []
;

/**
 * @property {string} ID
 * @property {string} name
 * @property {{
 *     contentStyle: boolean,
 *     addableTop: boolean,
 *     deletableTop: boolean,
 *     lineTop: boolean,
 *     typesTop: boolean,
 *     columnsTop: boolean,
 *     searchTop: boolean,
 *     paginationTop: boolean,
 *     paginationDown: boolean,
 * }} visibility
 * @property {DatatableColumnsGroup[]} columnsGroups
 * @property {DatatableColumn[]} columns
 * @property {DatatableRow[]} rows
 * @property {number} countLine
 * @property {object} modelRow
 * @property {string} rowsID
 * @property {string} rowsTitle
 * @property {string} rowsType
 * @property {[DatatableColumn, ("asc"|"desc")]} order
 * @property {DatatableActions} actions
 * @property {DatatablePagination} pagination
 * @property {DatatableAlert} alert
 * @property {DatatableSelectedColumns} selected
 * @property {Route|undefined} visible
 * @property {Route|undefined} addable
 * @property {Route|undefined} copyable
 * @property {Route|undefined} editable
 * @property {Route|undefined} deletable
 * @property {Route|boolean|undefined} searchable
 * @property {DatatableGrants} grants
 * @property {jQuery|HTMLElement} emptyDataDom
 */
class Datatable extends EventTypes {

    static EVENT_ON_SEARCH = EVENT_ON_SEARCH;
    static EVENT_ON_SEARCH_RESULT_COUNT = EVENT_ON_SEARCH_RESULT_COUNT;
    static EVENT_ON_TOGGLE_COLUMN_DISPLAY = EVENT_ON_TOGGLE_COLUMN_DISPLAY;
    static EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN = EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN;
    static EVENT_ON_CLICK_ON_TABLE_DOM = EVENT_ON_CLICK_ON_TABLE_DOM;
    static EVENT_ON_CHANGE_COUNT_LINE = EVENT_ON_CHANGE_COUNT_LINE;
    static EVENT_ON_CHANGE_ROWS_TARGET = EVENT_ON_CHANGE_ROWS_TARGET;
    static EVENT_ON_SELECTED_ROW_ADD = EVENT_ON_SELECTED_ROW_ADD;
    static EVENT_ON_SELECTED_ROW_REMOVE = EVENT_ON_SELECTED_ROW_REMOVE;
    static EVENT_ON_COLUMN_REORDER_ROWS = EVENT_ON_COLUMN_REORDER_ROWS;
    static EVENT_ON_AFTER_ADDING_ITEM = EVENT_ON_AFTER_ADDING_ITEM;
    static EVENT_ON_AFTER_REMOVING_ITEM = EVENT_ON_AFTER_REMOVING_ITEM;
    static EVENTS = EVENTS;
    static VISIBILITY_CONTENT_STYLE = VISIBILITY_CONTENT_STYLE;
    static VISIBILITY_ADDABLE_TOP = VISIBILITY_ADDABLE_TOP;
    static VISIBILITY_DELETABLE_TOP = VISIBILITY_DELETABLE_TOP;
    static VISIBILITY_LINES_TOP = VISIBILITY_LINES_TOP;
    static VISIBILITY_TYPES_TOP = VISIBILITY_TYPES_TOP;
    static VISIBILITY_COLUMNS_TOP = VISIBILITY_COLUMNS_TOP;
    static VISIBILITY_SEARCH_TOP = VISIBILITY_SEARCH_TOP;
    static VISIBILITY_PAGINATION_TOP = VISIBILITY_PAGINATION_TOP;
    static VISIBILITY_PAGINATION_DOWN = VISIBILITY_PAGINATION_DOWN;
    static VISIBILITIES_KEYS = VISIBILITIES_KEYS;
    static HTML_SELECTE_DOM = HTML_SELECTE_DOM;
    static ROW_MODEL_KEY = ROW_MODEL_KEY;

    /**
     * @param {jQuery|HTMLElement} dom
     */
    constructor(dom) {
        super();
        this.addAcceptedEvents(EVENTS);
        dom = $(dom);
        this.dom = dom;
        /** @type {string} ID */
        this.ID = co.data(dom, "id");
        /** @type {string} name */
        this.name = co.data(dom, "name");
        /** @type {number} countLine */
        this.countLine = co.data(dom, "count-line");
        /** @type {object} modelRow */
        this.modelRow = co.data(dom, "model-row");
        /** @type {{
         *     contentStyle: boolean,
         *     addableTop: boolean,
         *     deletableTop: boolean,
         *     lineTop: boolean,
         *     typesTop: boolean,
         *     columnsTop: boolean,
         *     searchTop: boolean,
         *     paginationTop: boolean,
         *     paginationDown: boolean,
         * }} visibility */
        this.visibility = co.data(dom, "visibility");
        /** @type {string} rowsID */
        this.rowsID = co.data(dom, "rows-id");
        /** @type {string} rowsTitle */
        this.rowsTitle = co.data(dom, "rows-title");
        /** @type {string} rowsType */
        this.rowsType = co.data(dom, "rows-type");
        this.grants = new DatatableGrants(this, co.data(dom, "grants"));
        /** @type {DatatableColumnsGroup[]} columnsGroups */
        this.columnsGroups = [];
        /** @type {DatatableColumn[]} columns */
        this.columns = [];
        /** @type {DatatableRow[]} rows */
        this.rows = [];
        /** @type {Route|undefined} visible */
        this.visible = this.getActionRouteOrBoolean(co.data(dom, "visible"));
        /** @type {Route|undefined} addable */
        this.addable = this.getActionRouteOrBoolean(co.data(dom, "addable"));
        /** @type {Route|undefined} copyable */
        this.copyable = this.getActionRouteOrBoolean(co.data(dom, "copyable"));
        /** @type {Route|undefined} editable */
        this.editable = this.getActionRouteOrBoolean(co.data(dom, "editable"));
        /** @type {Route|undefined} deletable */
        this.deletable = this.getActionRouteOrBoolean(co.data(dom, "deletable"));
        /** @type {Route|boolean|undefined} searchable */
        this.searchable = this.getActionRouteOrBoolean(co.data(dom, "searchable"));

        this.initColumnsAndRows();

        this.emptyDataDom = Datatable.getEmptyDataDom(this);
        /** @type {[DatatableColumn, ("asc"|"desc")]} order */
        this.order = co.data(dom, "order");
        if(this.order.length) this.order[0] = this.getColumn(this.order[0]);
        /** @type {DatatableActions} actions */
        this.actions = new DatatableActions(this);
        if(this.isVisible(Datatable.VISIBILITY_PAGINATION_TOP) || this.isVisible(Datatable.VISIBILITY_PAGINATION_DOWN)) {
            /** @type DatatablePagination pagination */
            this.pagination = new DatatablePagination(this);
        }
        /** @type DatatableAlert alert */
        this.alert = new DatatableAlert(this);
        if(this.isVisible(Datatable.VISIBILITY_DELETABLE_TOP)) {
            /** @type DatatableSelectedColumns selected */
            this.selected = new DatatableSelectedColumns(this);
        }
        this.setEvents();
        co.log(this);
    }

    /**
     * @param {DatatableColumnsGroup|string|number} columnsGroup
     * @return {DatatableColumnsGroup|undefined}
     */
    getColumnsGroup(columnsGroup) {
        return this.columnsGroups.filter((_columnsGroup) => {
            return (
                _columnsGroup === columnsGroup
                ||
                _columnsGroup.name === columnsGroup
                ||
                _columnsGroup.position === columnsGroup
            );
        })[0];
    }

    /**
     * @param {DatatableColumn|string|number} column
     * @return {DatatableColumn|undefined}
     */
    getColumn(column) {
        if(co.instanceOf(column, DatatableColumn)) return column;
        return this.columns.filter((_column) => {
            return (
                _column.name === column
                ||
                _column.position === column
            );
        })[0];
    }

    /**
     * @param {DatatableRow|string|number|jQuery|HTMLElement} row
     * @return {DatatableRow|undefined}
     */
    getRow(row) {
        return this.rows.filter((_row) => {
            return (
                _row === row
                ||
                _row.ID === row
                ||
                _row.position === row
                ||
                _row.dom === row
                ||
                _row.dom[0] === row[0]
            );
        })[0];
    }

    /**
     * @return {boolean}
     */
    hasItems() {
        return !!this.rows.length;
    }

    initColumnsAndRows() {
        let
            this_o = this
        ;
        this.dom.find(".datatable-header-column-group").each((k, groupDom) => {
            this_o.columnsGroups.push(new DatatableColumnsGroup(this_o, groupDom));
        });

        this.dom.find(".datatable-header-column").each((k, columnDom) => {
            columnDom = $(columnDom);
            if(!columnDom.hasClass("datatable-header-column-group") && !columnDom.hasClass("datatable-header-column-search")) {
                this_o.columns.push(new DatatableColumn(this_o, columnDom));
            }
        });

        this.dom.find("tr.datatable-body-row").each((k, rowDom) => {
            this_o.rows.push(new DatatableRow(this_o, rowDom));
        });

        this.columns.sort((a, b) => {
            return co.ascendingResult(a.position, b.position);
        });
    }

    /**
     * @param {number} countLine
     */
    changeCountLine(countLine) {
        this.countLine = countLine;
    }

    /**
     * @param {DatatableRow[]} removedRows
     * @param {DatatableRow[]} remainingRows
     */
    updateRowPosition(removedRows, remainingRows) {
        let
            rowsTarget,
            removedPosition
        ;
        removedRows.forEach((_row) => {
            if(!removedPosition) {
                removedPosition = _row.position;
            } else {
                if(removedPosition > _row.position) removedPosition = _row.position;
            }
        });
        rowsTarget = remainingRows
            .filter((_row) => {
                return _row.position > removedPosition;
            })
        ;
        rowsTarget
            .sort((_rowA, _rowB) => {
                return co.ascendingResult(_rowA.position, _rowB.position);
            })
            .forEach((_row) => {
                _row.setPosition(removedPosition);
                removedPosition++;
            })
        ;
        return true;
    }

    /**
     * @param {DatatableRow[]} removedRows
     * @return {boolean}
     */
    removeRow(removedRows) {
        let
            remainingRows = this.rows.filter((_row) => {
                return !removedRows.includes(_row);
            })
        ;
        if(remainingRows.length !== this.rows.length && this.updateRowPosition(removedRows, remainingRows)) {
            this.rows = remainingRows;
            this.pagination.updateTotalItems();
            this.pagination.updateRows();
            return true;
        }
        return false;
    }

    appendSelected() {
        if(this.selected) this.selected.append();
    }

    removeSelected() {
        if(this.selected) this.selected.remove();
    }

    /**
     * @return {boolean}
     */
    isRowType() {
        return this.actions.types.isRowType();
    }

    /**
     * @return {boolean}
     */
    isGridType() {
        return this.actions.types.isGridType();
    }

    /**
     * @return {boolean}
     */
    isInOrder() {
        return (this.order.length > 0);
    }

    /**
     * @return {boolean}
     */
    isDescOrder() {
        return this.order[1] === "desc";
    }

    isAscOrder() {
        return this.order[1] === "asc";
    }

    /**
     * @param {DatatableColumn} column
     * @return {boolean}
     */
    isOrderedByColumn(column) {
        return this.order[0] === column;
    }

    /**
     * @param {DatatableColumn|string} column
     * @param {"asc"|"desc"|undefined} order
     * @return {boolean}
     */
    sort(column, order = undefined) {
        order = order || "desc";
        if(!co.isString(order)) return false;
        if(!order.in("asc", "desc")) order = "desc";
        order = order.lower();
        let
            _column = this.getColumn(column)
        ;
        if(_column && !_column.isColumnAction() && _column.isOrdered()) {
            this.order[0] = _column;
            this.order[1] = order;
            this.rows.sort((a, b) => {
                let
                    a_res = a.getColumn(_column).compareValue,
                    b_res = b.getColumn(_column).compareValue
                ;
                return order.in("asc")
                    ? co.ascendingResult(a_res, b_res)
                    : co.descendingResult(a_res, b_res)
                ;
            });
            this.appendRowsAfterSort();
            this.pagination.updateRows();
            return true;
        }
        this.order = [];
        return false;
    }

    /**
     * @return {boolean}
     */
    resetOrder() {
        if(this.isInOrder()) {
            this.order = [];
            this.rows.sort((a, b) => {
                return co.ascendingResult(a.position, b.position);
            });
            this.appendRowsAfterSort();
            this.pagination.updateRows();
            return true;
        }
        return false;
    }

    appendRowsAfterSort() {
        this.rows.forEach((_row, _rowKey) => {
            _row.appendAfterSort((_rowKey + 1));
        });
    }

    /**
     * @param {boolean} success
     */
    addEmptyRow(success) {
        if(success) {
            if(!this.hasItems()) {
                this.dom.find(".datatable-body").append(this.emptyDataDom);
            }
        }
    }

    /**
     * @param {boolean} success
     */
    removeEmptyRow(success) {
        if(success) {
            this.dom.find(".datatable-data-empty").remove();
        }
    }

    destroy() {
        this.dom.remove();
    }

    /**
     * @param {string} key
     * @return {boolean}
     */
    isVisible(key) {
        if(co.isString(key) && key.in(...VISIBILITIES_KEYS)) {
            return this.visibility[key];
        }
        return false;
    }

    /**
     * @return {boolean}
     */
    isManagingItems() {
        return ((this.addable || this.editable || this.copyable) && (this.grants.isCreate() || this.grants.isUpdate()));
    }

    /**
     * @return {boolean}
     */
    isDeletableItems() {
        return (this.deletable && this.grants.isDelete());
    }

    /**
     * @param {Route|string[]|string|boolean} action
     * @return {Route|boolean|undefined}
     */
    getActionRouteOrBoolean(action) {
        if(co.router.isRouteInstance(action)) return action;
        if(co.isArray(action)) {
            return co.router.get(action[0], action[1]);
        } else if(co.isString(action)) {
            return co.router.get(action, co.ajax.METHOD_POST);
        } else if(co.isBool(action)) {
            return action;
        }
    }

    setEvents() {
        let
            this_o = this
        ;
        this.dom.on("click", (e) => {
            this_o.run(Datatable.EVENT_ON_CLICK_ON_TABLE_DOM, e);
        });

        if(this.isVisible(Datatable.VISIBILITY_LINES_TOP)) {
            this.on(Datatable.EVENT_ON_CHANGE_COUNT_LINE, [this,"changeCountLine"]);
        }

        if(this.isManagingItems()) {
            this.onBefore(Datatable.EVENT_ON_AFTER_ADDING_ITEM, [this, "removeEmptyRow"]);
        }

        if(this.isDeletableItems()) {
            this.onAfter(Datatable.EVENT_ON_AFTER_REMOVING_ITEM, [this, "addEmptyRow"]);
        }
    }

    /**
     * @param {Datatable} datatable
     * @return {jQuery|HTMLElement}
     */
    static getEmptyDataDom(datatable) {
        if(co.instanceOf(datatable, Datatable)) {
            let emptyDom = datatable.dom.find(".datatable-data-empty");
            if(!emptyDom.length) {
                let
                    title = co.texts.get("datatable:rows:empty")?.getValue()
                ;
                emptyDom = $(EMPTY_DATA_ROW);
                emptyDom.attr("title", title);
                emptyDom.attr("colspan", datatable.columns.length);
                emptyDom.html(title);
            }
            return emptyDom;
        }
    }

    /**
     * @param {jQuery|HTMLElement} dom
     * @param {boolean} force
     */
    static init(dom, force = false) {
        dom = $(dom);
        dom.each((k, datatable) => {
            datatable = $(datatable);
            if(!datatable.hasClass("datatable-content")) return false;
            let
                dtID = datatable.attr("id")
            ;
            if(dtID) {
                if(!Datatable.hasDatatable(dtID) || force) {
                    let _oldDT = Datatable.getDatatable(dtID);
                    if(_oldDT) {
                        Datatable.destroyDatatable(_oldDT);
                    }
                    datatables.push(new Datatable(datatable));
                }
            }
        });
    }

    /**
     * @param {string|Datatable} datatable
     * @return {boolean}
     */
    static destroyDatatable(datatable) {
        let newDatatables = datatables.filter((_datatable) => {
            if(!(datatable !== _datatable && datatable !== _datatable.ID)) {
                _datatable.destroy();
                return false;
            }
            return true;
        });
        if(newDatatables.length !== datatables.length) {
            datatables = newDatatables;
            return true;
        }
        return false;
    }

    /**
     * @return {Datatable[]}
     */
    static getDatatables() {
        return datatables;
    }

    /**
     * @param {jQuery|HTMLElement} dom
     * @return {Datatable[]}
     */
    static getDatatablesByDom(dom) {
        let
            __datatables = []
        ;
        if(co.isElementDom(dom)) {
            if(co.isHtmlDom(dom)) dom = $(dom);
            datatables.forEach((d) => {
                if(dom.find(co.concat("#", d.ID)).length) __datatables.push(d);
            });
        }
        return __datatables;
    }

    /**
     * @param {string|Datatable} datatable
     * @return {Datatable|undefined}
     */
    static getDatatable(datatable) {
        return datatables.filter((_datatable) => {
            return (
                _datatable === datatable
                ||
                _datatable.ID === (datatable + "-datatable")
                ||
                _datatable.name === datatable
            );
        })[0];
    }

    /**
     * @param {string|Datatable} datatable
     * @return {boolean}
     */
    static hasDatatable(datatable) {
        return co.isObject(this.getDatatable(datatable));
    }

}

module.exports = Datatable;