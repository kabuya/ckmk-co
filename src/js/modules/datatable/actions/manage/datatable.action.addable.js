const DatatableRow = require("../../rows/datatable.row");

/**
 * @property {DatatableActions} actions
 * @property {jQuery|HTMLElement} dom
 * @property {Route|undefined} route
 * @property {PopupFormCard} popup
 */
class DatatableActionAddable {



    /**
     * @param {DatatableActions} actions
     */
    constructor(actions) {
        this.actions = actions;
        /** @type {jQuery|HTMLElement} */
        this.dom = this.actions.dom.find(".datatable-global-manage-item.datatable-global-add");
        this.route = co.router.get(co.data(this.dom, "route"), co.ajax.METHOD_POST);
        this.popup = co.popup
            .form("Add new item")
            .setCb([this, "updateRowAfterAdd"])
        ;
        this.setEvents();
        // co.log(this);
    }

    /**
     * @param {Event} e
     */
    addNewItem(e) {
        let
            data = {datatable: this.actions.datatable.name}
        ;
        data[co.datatable.ROW_MODEL_KEY] = this.actions.datatable.modelRow;
        this.popup
            .load(this.route.getAbsolutePath(), data, this.route.getDefaultMethod())
            .open()
        ;
    }

    updateRowAfterAdd(response) {
        if(response.success) {
            this.actions.datatable.alert.success(response.messages);
            DatatableRow.createFromData(this.actions.datatable, response[co.datatable.ROW_MODEL_KEY]);
        }
        this.actions.datatable.run(
            co.datatable.EVENT_ON_AFTER_ADDING_ITEM,
            response.success
        );
    }

    setEvents() {
        let
            this_o = this
        ;
        this.dom.on("click", (e) => {
            //e.stopPropagation();
            this_o.addNewItem(e);
        });
    }


}

module.exports = DatatableActionAddable;