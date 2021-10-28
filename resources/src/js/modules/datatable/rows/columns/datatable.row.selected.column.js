const DatatableSelected = require("../../selected/datatable.selected");

/**
 * @property {DatatableRow} row
 * @property {jQuery|HTMLElement} dom
 * @property {boolean} appended
 */
class DatatableRowSelectedColumn extends DatatableSelected {

    /**
     * @param {DatatableRow} row
     */
    constructor(row) {
        super();

        this.row = row;
        /** @type {jQuery|HTMLElement} dom */
        this.dom = $(row.datatable.HTML_SELECTE_DOM);
        /** @type {boolean} */
        this.appended = false;
    }

    /**
     * @return {boolean}
     */
    append() {
        if(this.isAppended()) return false;
        this.appended = true;
        this.row.dom
            .prepend(this.dom)
            .addClass("datatable-body-row")
        ;
        let this_o = this;
        this.dom.on("click", (e) => {
            return this_o.toggleCheck(e);
        });
        return true;
    }

    /**
     * @return {boolean}
     */
    remove() {
        if(!this.isAppended()) return false;
        this.appended = false;
        this.dom.remove();
        return true;
    }

    check() {
        if(super.check()) {
            this.row.datatable.run(
                this.row.datatable.EVENT_ON_SELECTED_ROW_ADD,
                this.row
            );
            return true;
        }
        return false;
    }

    uncheck() {
        if(super.uncheck()) {
            this.row.datatable.run(
                this.row.datatable.EVENT_ON_SELECTED_ROW_REMOVE,
                this.row
            );
            return true;
        }
        return false;
    }

    /**
     * @param {Event} e
     */
    toggleCheck(e) {
        if(this.isChecked()) {
            this.uncheck();
        } else {
            this.check();
        }
        return this.row.datatable.selected.toggleCheckByRowClick();
    }

}



module.exports = DatatableRowSelectedColumn;