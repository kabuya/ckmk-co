const DatatableRowColumn = require("./columns/datatable.row.column");
const DatatableRowSelectedColumn = require("./columns/datatable.row.selected.column");

const HTML_CLASS_SEARCH_FAILED = "datatable-search-failed";
const HTML_CLASS_SEARCH_SUCCESS = "datatable-search-success";
const HTML_CLASS_ROW_NO_TARGET = "datatable-body-row-no-target";

const VISIBILITY_VISIBLE = "visible";
const VISIBILITY_EDITABLE = "editable";
const VISIBILITY_COLUMN_EDITABLE = "columnEditable";
const VISIBILITY_COPYABLE = "copyable";
const VISIBILITY_DELETABLE = "deletable";

const VISIBILITIES_KEYS = [
    VISIBILITY_VISIBLE,
    VISIBILITY_EDITABLE,
    VISIBILITY_COLUMN_EDITABLE,
    VISIBILITY_COPYABLE,
    VISIBILITY_DELETABLE,
];

const VISIBILITIES_DEFAULT = {};
VISIBILITIES_DEFAULT[VISIBILITY_VISIBLE] = true;
VISIBILITIES_DEFAULT[VISIBILITY_EDITABLE] = true;
VISIBILITIES_DEFAULT[VISIBILITY_COLUMN_EDITABLE] = true;
VISIBILITIES_DEFAULT[VISIBILITY_COPYABLE] = true;
VISIBILITIES_DEFAULT[VISIBILITY_DELETABLE] = true;


/**
 * @property {Datatable} datatable
 * @property {jQuery|HTMLElement} dom
 * @property {string|number} ID
 * @property {string} title
 * @property {number} position
 * @property {{
 *     visible: boolean,
 *     editable: boolean,
 *     columnEditable: boolean,
 *     copyable: boolean,
 *     deletable: boolean,
 * }} visibility
 * @property {DatatableRowSelectedColumn} selected
 * @property {DatatableRowColumn[]} columns
 */
class DatatableRow {


    /**
     * @param {Datatable} datatable
     * @param {jQuery|HTMLElement} dom
     */
    constructor(datatable, dom) {
        this.datatable = datatable;
        this.dom = $(dom);
        /** @type {string|number} ID */
        this.ID = co.data(dom, "id");
        /** @type {string} title */
        this.title = co.data(dom, "title");
        /** @type {number} position */
        this.position = co.data(dom, "position");
        /** @type {{
         *     visible: boolean,
         *     editable: boolean,
         *     columnEditable: boolean,
         *     copyable: boolean,
         *     deletable: boolean,
         * }} visibility */
        this.visibility = co.data(dom, "visibility") || VISIBILITIES_DEFAULT;
        /** @type {DatatableRowSelectedColumn} selected */
        this.selected = new DatatableRowSelectedColumn(this);
        /** @type {DatatableRowColumn[]} columns */
        this.columns = [];

        this.initColumns();

        this.setEvents();
        // co.log(this);
    }

    /**
     * @param {DatatableColumn|DatatableRowColumn|string|number} column
     * @return {DatatableRowColumn|undefined}
     */
    getColumn(column) {
        return this.columns.filter((_column) => {
            return (
                _column === column
                ||
                _column.position === column
                ||
                _column.column === column
                ||
                _column.column.name === column
                ||
                _column.column.position === column
            );
        })[0];
    }

    /**
     * @param {({
     *     column: string,
     *     value: string[]
     * })[]} values
     * @param {boolean} _hasValue
     */
    toggleShow(values, _hasValue) {
        let
            this_o = this,
            _matched = false,
            _column
        ;
        values.forEach((_item) => {
            _column = this_o.getColumn(_item.column);
            if(_column) {
                if(_column.match(_item.value)) {
                    _item.result++;
                    if(!_matched) _matched = true;
                } else {
                    _column.resetMatch();
                }
            }
        });
        if(_matched) {
            this.dom
                .removeClass(HTML_CLASS_SEARCH_FAILED)
                .addClass(HTML_CLASS_SEARCH_SUCCESS)
            ;
            this.datatable.run(this.datatable.EVENT_ON_SEARCH_RESULT_COUNT, 1);
        } else {
            if(_hasValue) {
                this.dom
                    .removeClass(HTML_CLASS_SEARCH_SUCCESS)
                    .addClass(HTML_CLASS_SEARCH_FAILED)
                ;
            } else {
                this.dom
                    .removeClass(HTML_CLASS_SEARCH_SUCCESS)
                    .removeClass(HTML_CLASS_SEARCH_FAILED)
                ;
            }
            this.datatable.run(this.datatable.EVENT_ON_SEARCH_RESULT_COUNT, 0);
        }
    }

    /**
     * @param {number[]} rowsTarget
     */
    toggleDisplayByTargetLines(rowsTarget) {
        if(rowsTarget.includes(this.position)) {
            return this.show();
        }
        return this.hide();
    }

    /**
     * @return {boolean}
     */
    isDisplayed() {
        return !this.dom.hasClass(HTML_CLASS_ROW_NO_TARGET);
    }

    show() {
        if(this.isDisplayed()) return false;
        this.dom.removeClass(HTML_CLASS_ROW_NO_TARGET);
        return true;
    }

    hide() {
        if(!this.isDisplayed()) return false;
        this.dom.addClass(HTML_CLASS_ROW_NO_TARGET);
        return true;
    }

    appendSelected() {
        if(this.selected) this.selected.append();
    }

    removeSelected() {
        if(this.selected) this.selected.remove();
    }

    /**
     * @param {number} position
     */
    setPosition(position) {
        this.position = position;
        this.getColumn('number')?.updateValue(position);
    }

    /**
     * @param {number} rowNumber
     */
    appendAfterSort(rowNumber) {
        this.datatable.dom.find("table > tbody").append(this.dom);
        //this.getColumn('number')?.updateValue(rowNumber);
    }

    /**
     * @return {boolean}
     */
    isOnSearch() {
        return (
            this.dom.hasClass(HTML_CLASS_SEARCH_FAILED)
            ||
            this.dom.hasClass(HTML_CLASS_SEARCH_SUCCESS)
        );
    }

    initColumns() {
        let this_o = this;
        this.dom.find("td").each((k, column) => {
            this_o.columns.push(new DatatableRowColumn(this_o, column));
        });
    }

    updateColumns(item) {
        this.columns.forEach((column) => {
            column.updateValue(item[column.column.name]);
        });
    }

    /**
     * @return {boolean}
     */
    destroy() {
        this.columns.forEach((_column) => {
            _column.destroy();
        });
        this.datatable.remove(this.datatable.EVENT_ON_SEARCH, [this, "toggleShow"]);
        this.datatable.remove(this.datatable.EVENT_ON_CHANGE_ROWS_TARGET, [this, "toggleDisplayByTargetLines"]);
        this.dom.remove();
        return true;
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

    setEvents() {
        this.datatable.on(this.datatable.EVENT_ON_SEARCH, [this, "toggleShow"]);
        this.datatable.on(this.datatable.EVENT_ON_CHANGE_ROWS_TARGET, [this, "toggleDisplayByTargetLines"]);
    }

    /**
     * @param {Datatable} datatable
     * @param {object} data
     */
    static createFromData(datatable, data) {
        if(data && data[datatable.rowsID]) {
            let
                append = true,
                row = $("<tr></tr>")
                    .addClass("datatable-body-row")
                    .attr("data-id", data[datatable.rowsID])
                    .attr("data-title", data.title || data[datatable.rowsID])
                    .attr("data-position", datatable.rows.length + 1)
                    .attr("data-visibility", co.objectToJson(data.visibility, true)),
                actionColumn,
                visibility = data.visibility || VISIBILITIES_DEFAULT
            ;
            datatable.columns.forEach((_column) => {
                if(!_column.isColumnAction()) {
                    let columnDom = DatatableRowColumn.createFromData(row, _column, data[_column.name]);
                    if(columnDom) {
                        row.append(columnDom);
                    } else {
                        if(append) append = false;
                    }
                }
            });
            actionColumn = datatable.getColumn("action");
            if(actionColumn) {
                let columnDom = DatatableRowColumn.generateActionColumn(row, actionColumn, visibility);
                if(columnDom) {
                    row.append(columnDom);
                } else {
                    if(append) append = false;
                }
            }
            if(append) {
                datatable.dom.find("tbody").append(row);
                datatable.rows.push(new DatatableRow(datatable, row));
                datatable.pagination.updateTotalItems();
                datatable.pagination.last();
            } else {
                if(co.isDev()) datatable.alert.warning("Invalid data. An error in columns.");
            }
        } else {
            if(co.isDev()) datatable.alert.warning("No data returned.");
        }
    }

}

DatatableRow.prototype.VISIBILITY_VISIBLE = VISIBILITY_VISIBLE;
DatatableRow.prototype.VISIBILITY_EDITABLE = VISIBILITY_EDITABLE;
DatatableRow.prototype.VISIBILITY_COLUMN_EDITABLE = VISIBILITY_COLUMN_EDITABLE;
DatatableRow.prototype.VISIBILITY_COPYABLE = VISIBILITY_COPYABLE;
DatatableRow.prototype.VISIBILITY_DELETABLE = VISIBILITY_DELETABLE;
DatatableRow.prototype.VISIBILITIES_KEYS = VISIBILITIES_KEYS;
DatatableRow.prototype.VISIBILITIES_DEFAULT = VISIBILITIES_DEFAULT;

module.exports = DatatableRow;