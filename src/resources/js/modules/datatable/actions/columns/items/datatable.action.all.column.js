const DatatableActionItemCore = require("./datatable.action.item.core");

/**
 * @property {DatatableActionColumns} parent
 * @property {jQuery|HTMLElement} dom
 * @property {DatatableActionGroupColumn|undefined} group
 * @property {string} column
 */
class DatatableActionAllColumn extends DatatableActionItemCore {


    /**
     * @param {DatatableActionColumns} parent
     * @param {jQuery|HTMLElement} dom
     */
    constructor(parent, dom) {
        super();
        this.parent = parent;
        this.dom = $(dom);
        /** @type {string} column */
        this.column = co.data(this.dom, "column");
        this.setEvents();
    }


    toggleActive(e) {
        super.toggleActive(e);
        if(this.isActive()) {
            this.datatable().run(co.datatable.EVENT_ON_TOGGLE_COLUMN_DISPLAY, true);
        } else {
            this.datatable().run(co.datatable.EVENT_ON_TOGGLE_COLUMN_DISPLAY, false);
        }
    }

    /**
     * @param {boolean} value
     */
    toggleActiveByColumnDisplay(value) {
        if(value) {
            let
                this_o = this,
                disableList = this.parent.items.filter((_column) => {
                    if(_column !== this_o) {
                        if(_column.isGroup()) {
                            return !_column.isFullActive();
                        } else {
                            return !_column.isActive();
                        }
                    }
                })
            ;
            if(!disableList.length) return this.enable();
        }
        return this.disable();
    }

    setEvents() {
        super.setEvents();
        this.datatable().on(co.datatable.EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN, [this, "toggleActiveByColumnDisplay"])
    }

}

module.exports = DatatableActionAllColumn;