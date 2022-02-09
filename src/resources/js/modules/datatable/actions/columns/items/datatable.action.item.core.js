
/**
 * @property {DatatableActionColumns} parent
 * @property {jQuery|HTMLElement} dom
 */
class DatatableActionItemCore {

    /**
     * @return {boolean}
     */
    isGroup() {
        return this.dom.hasClass("datatable-columns-group-visibility-item");
    }

    /**
     * @return {Datatable}
     */
    datatable() {
        return this.parent.actions.datatable;
    }

    isActive() {
        return this.dom
            .find(".datatable-columns-visibility-list-item-checkbox")
            .hasClass("column-checked")
        ;
    }

    enable() {
        if(this.isActive()) return false;
        this.dom
            .find(".datatable-columns-visibility-list-item-checkbox")
            .addClass("column-checked")
        ;
        return true;
    }

    disable() {
        if(!this.isActive()) return false;
        this.dom
            .find(".datatable-columns-visibility-list-item-checkbox")
            .removeClass("column-checked")
        ;
        return true;
    }

    /**
     * @param {Event} e
     */
    toggleActive(e) {
        if(this.isActive()) {
            this.disable();
        } else {
            this.enable();
        }
    }

    /**
     * @param {boolean} value
     */
    toggleActiveByAll(value) {
        if(value) {
            return this.enable();
        }
        return this.disable();
    }

    setEvents() {
        this.dom.on("click", this.toggleActive.bind(this));
    }


}

module.exports = DatatableActionItemCore;