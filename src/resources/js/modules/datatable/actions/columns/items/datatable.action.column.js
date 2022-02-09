const DatatableActionItemCore = require("./datatable.action.item.core");

/**
 * @property {DatatableActionColumns} parent
 * @property {jQuery|HTMLElement} dom
 * @property {DatatableActionGroupColumn|undefined} group
 * @property {DatatableColumn} column
 */
class DatatableActionColumn extends DatatableActionItemCore {


    /**
     * @param {DatatableActionColumns} parent
     * @param {jQuery|HTMLElement} dom
     */
    constructor(parent, dom) {
        super();
        this.parent = parent;
        this.dom = $(dom);
        /** @type {DatatableColumn} column */
        this.column = this.parent
            .actions
            .datatable
            .getColumn(co.data(this.dom, "column"))
        ;
        this.setEvents();
    }

    enable() {
        if(super.enable()) {
            this.column.show();
            this.datatable().run(co.datatable.EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN, true);
            return true;
        }
        return false;
    }

    disable() {
        if(super.disable()) {
            this.column.hide();
            this.datatable().run(co.datatable.EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN, false);
            return true;
        }
        return false;
    }

    toggleActive(e) {
        super.toggleActive(e);
        if(this.group) this.group.checkToggleActive();
    }

    /**
     * @param {DatatableActionGroupColumn|undefined} group
     */
    setGroup(group) {
        this.group = group;
    }

    setEvents() {
        super.setEvents();
        this.datatable().on(co.datatable.EVENT_ON_TOGGLE_COLUMN_DISPLAY, [this, "toggleActiveByAll"]);
    }

}

module.exports = DatatableActionColumn;