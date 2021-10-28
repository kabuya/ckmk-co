const DatatableActionColumn = require("./datatable.action.column");
const DatatableActionItemCore = require("./datatable.action.item.core");

/**
 * @property {DatatableActionColumns} parent
 * @property {jQuery|HTMLElement} dom
 * @property {DatatableColumnsGroup} group
 * @property {DatatableActionColumn[]} children
 */
class DatatableActionGroupColumn extends DatatableActionItemCore {

    /**
     * @param {DatatableActionColumns} parent
     * @param {jQuery|HTMLElement} dom
     */
    constructor(parent, dom) {
        super();
        this.parent = parent;
        this.dom = $(dom);
        /** @type {DatatableActionColumn[]} children */
        this.children = [];
        /** @type {DatatableColumnsGroup} group */
        this.group = this.parent
            .actions
            .datatable
            .getColumnsGroup(co.data(this.dom, "group"))
        ;
        this.setChildren();
        this.setEvents();
    }


    setChildren() {
        let
            this_o = this
        ;
        this.dom.parent().find(".datatable-columns-visibility-list-item")
            .each((k, elem) => {
                let child = new DatatableActionColumn(this_o.parent, elem);
                child.setGroup(this_o);
                this_o.children.push(child);
            })
        ;
    }

    checkToggleActive() {
        let
            disable = true
        ;
        this.children.forEach((_child) => {
            if(_child.isActive() && disable) {
                disable = false;
                return true;
            }
        });
        if(disable) {
            this.disable();
        } else {
            this.enable();
        }
    }


    enable() {
        if(super.enable()) {
            this.group.show();
            this.datatable().run(this.datatable().EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN, true);
            return true;
        }
        return false;
    }

    disable() {
        if(super.disable()) {
            this.group.hide();
            this.datatable().run(this.datatable().EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN, false);
            return true;
        }
        return false;
    }

    /**
     * @return {boolean}
     */
    isFullActive() {
        return (
            this.isActive()
            &&
            (
                this.children.filter((_child) => {
                    return _child.isActive();
                }).length
                ===
                this.children.length
            )
        );
    }

    /**
     * @param {Event} e
     */
    toggleActive(e) {
        super.toggleActive(e);
        let
            isActive = this.isActive()
        ;
        this.children.forEach((_child) => {
            if(isActive) {
                _child.enable();
            } else {
                _child.disable();
            }
        });
    }

    setEvents() {
        super.setEvents();
        this.datatable().on(this.datatable().EVENT_ON_TOGGLE_COLUMN_DISPLAY, [this, "toggleActiveByAll"]);
    }

}

module.exports = DatatableActionGroupColumn;