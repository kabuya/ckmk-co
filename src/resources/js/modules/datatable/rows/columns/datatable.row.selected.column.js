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
        this.dom = $(co.datatable.HTML_SELECTE_DOM);
        /** @type {boolean} */
        this.appended = false;
        if(!this.isDisplayAble()) this.dom.html("");
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
        if(this.isDisplayAble()) {
            this.dom.on("click", this.toggleCheck.bind(this));
        }
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
        if(!this.isDisplayAble()) return false;
        if(super.check()) {
            this.row.datatable.run(
                co.datatable.EVENT_ON_SELECTED_ROW_ADD,
                this.row
            );
            return true;
        }
        return false;
    }

    uncheck() {
        if(!this.isDisplayAble()) return false;
        if(super.uncheck()) {
            this.row.datatable.run(
                co.datatable.EVENT_ON_SELECTED_ROW_REMOVE,
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
        if(!this.isDisplayAble()) return false;
        if(this.isChecked()) {
            this.uncheck();
        } else {
            this.check();
        }
        return this.row.datatable.selected.toggleCheckByRowClick();
    }

    /**
     * @return {boolean}
     */
    isDisplayAble() {
        return this.row.isVisible(this.row.VISIBILITY_DELETABLE);
    }

}



module.exports = DatatableRowSelectedColumn;