const DatatableSelected = require("../../selected/datatable.selected");


/**
 * @property {Datatable} datatable
 * @property {jQuery|HTMLElement} dom
 * @property {boolean} appended
 */
class DatatableSelectedColumns extends DatatableSelected {

    /**
     * @param {Datatable} datatable
     */
    constructor(datatable) {
        super();

        this.datatable = datatable;
        /** @type {jQuery|HTMLElement} dom */
        this.dom = $(co.datatable.HTML_SELECTE_DOM)
            .addClass("datatable-header-column")
        ;
        /** @type {jQuery|HTMLElement} dom */
        this.searchDom = $("<td></td>")
            .addClass("datatable-header-column datatable-header-column-search")
        ;

        if(datatable.columnsGroups.length) {
            this.dom.attr("rowspan", 2);
        }
    }

    /**
     * @return {boolean}
     */
    append() {
        if(this.isAppended()) return false;
        this.appended = true;
        this.datatable.dom
            .find("thead tr:first-child")
            .prepend(this.dom)
        ;
        if(this.datatableHasSearchableColumn()) {
            this.datatable.dom.find("thead tr:last-child")
                .prepend(this.searchDom)
            ;
        }
        let this_o = this;
        this.dom.on("click", this.addOnDeletingList.bind(this));
        return true;
    }

    /**
     * @return {boolean}
     */
    remove() {
        if(!this.isAppended()) return false;
        this.uncheck();
        this.appended = false;
        this.dom.remove();
        this.searchDom.remove();
        return true;
    }

    /**
     * @param {Event} e
     */
    addOnDeletingList(e) {
        if(this.isChecked()) {
            this.uncheck();
            this.uncheckRows();
        } else {
            this.check();
            this.checkRows();
        }
    }

    /**
     * @return {boolean}
     */
    toggleCheckByRowClick() {
        let check = true;
        this.datatable.rows.forEach((_row) => {
            if(_row.selected && !_row.selected.isChecked()) {
                if(check) check = false;
            }
        });
        if(check) {
            return this.check();
        }
        return this.uncheck();
    }

    uncheckRows() {
        this.datatable.rows.forEach((_row) => {
            if(_row.selected) _row.selected.uncheck();
        });
    }

    checkRows() {
        this.datatable.rows.forEach((_row) => {
            if(_row.selected) _row.selected.check();
        });
    }

    datatableHasSearchableColumn() {
        let
            success = false
        ;
        this.datatable.columns.forEach((_column) => {
            if(_column.type.searchable && !success) {
                success = true;
            }
        });
        return success;
    }

}

module.exports = DatatableSelectedColumns;