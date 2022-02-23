const DatatableActionAddable = require("./manage/datatable.action.addable");
const DatatableActionDeletable = require("./manage/datatable.action.deletable");
const DatatableActionLines = require("./lines/datatable.action.lines");
const DatatableActionTypes = require("./types/datatable.action.types");
const DatatableActionColumns = require("./columns/datatable.action.columns");
const DatatableActionSearch = require("./search/datatable.action.search");


/**
 * @property {Datatable} datatable
 * @property {jQuery|HTMLElement} dom
 * @property {DatatableActionAddable} addable
 * @property {DatatableActionDeletable} deletable
 * @property {DatatableActionLines} lines
 * @property {DatatableActionTypes} types
 * @property {DatatableActionColumns} columns
 * @property {DatatableActionSearch} search
 */
class DatatableActions {


    /**
     * @param {Datatable} datatable
     */
    constructor(datatable) {
        let enable = false;
        this.datatable = datatable;

        /** @type {jQuery|HTMLElement} dom */
        this.dom = datatable.dom.find(".datatable-actions");

        if(datatable.isVisible(co.datatable.VISIBILITY_ADDABLE_TOP)) {
            if(!enable) enable = true;
            /** @type {DatatableActionAddable} addable */
            this.addable = new DatatableActionAddable(this);
        }
        if(datatable.isVisible(co.datatable.VISIBILITY_DELETABLE_TOP)) {
            if(!enable) enable = true;
            /** @type {DatatableActionDeletable} deletable */
            this.deletable = new DatatableActionDeletable(this);
        }
        if(datatable.isVisible(co.datatable.VISIBILITY_LINES_TOP)) {
            if(!enable) enable = true;
            /** @type {DatatableActionLines} lines */
            this.lines = new DatatableActionLines(this);
        }
        if(datatable.isVisible(co.datatable.VISIBILITY_TYPES_TOP)) {
            if(!enable) enable = true;
            /** @type {DatatableActionTypes} types */
            this.types = new DatatableActionTypes(this);
        }
        if(datatable.isVisible(co.datatable.VISIBILITY_COLUMNS_TOP)) {
            if(!enable) enable = true;
            /** @type {DatatableActionColumns} columns */
            this.columns = new DatatableActionColumns(this);
        }

        /** @type {DatatableActionSearch} search */
        this.search = new DatatableActionSearch(this);
        //if(!enable) this.dom.hide();
    }


}

module.exports = DatatableActions;