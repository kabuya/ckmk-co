/**
 * @property {boolean} appended
 * @property {jQuery|HTMLElement} dom
 */
class DatatableSelected {


    /**
     * @return {boolean}
     */
    isAppended() {
        return this.appended;
    }

    /**
     * @return {boolean}
     */
    isChecked() {
        return this.dom
            .find("div.datatable-row-selected")
            .hasClass("datatable-row-selected-checked")
        ;
    }

    /**
     * @return {boolean}
     */
    check() {
        if(this.isChecked()) return false;
        this.dom
            .find("div.datatable-row-selected")
            .addClass("datatable-row-selected-checked")
        ;
        return true;
    }

    /**
     * @return {boolean}
     */
    uncheck() {
        if(!this.isChecked()) return false;
        this.dom
            .find("div.datatable-row-selected")
            .removeClass("datatable-row-selected-checked")
        ;
        return true;
    }

}

module.exports = DatatableSelected;