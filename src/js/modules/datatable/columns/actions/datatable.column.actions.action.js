const DatatableColumnAction = require("./datatable.column.action");
const DatatableRow = require("../../rows/datatable.row");

/**
 * @property {DatatableColumnTimeType} type
 * @property {DatatableRowColumn} column
 * @property {jQuery|HTMLElement} visible
 * @property {jQuery|HTMLElement} copyable
 * @property {jQuery|HTMLElement} editable
 * @property {jQuery|HTMLElement} deletable
 * @property {{
 *     visible: Route|undefined,
 *     editable: Route|undefined,
 *     deletable: Route|undefined,
 * }} routes
 */
class DatatableColumnActionsAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
        let
            isVisible = column.row.isVisible(column.row.VISIBILITY_VISIBLE),
            isCopyable = column.row.isVisible(column.row.VISIBILITY_COPYABLE),
            isEditable = column.row.isVisible(column.row.VISIBILITY_EDITABLE),
            isDeletable = column.row.isVisible(column.row.VISIBILITY_DELETABLE)
        ;
        if(isVisible) {
            /** @type {jQuery|HTMLElement} */
            this.visible = this.column.dom.find(".datatable-action-visible");
        }
        if(isCopyable) {
            /** @type {jQuery|HTMLElement} */
            this.copyable = this.column.dom.find(".datatable-action-copyable");
        }
        if(isEditable) {
            /** @type {jQuery|HTMLElement} */
            this.editable = this.column.dom.find(".datatable-action-editable");
        }
        if(isDeletable) {
            /** @type {jQuery|HTMLElement} */
            this.deletable = this.column.dom.find(".datatable-action-deletable");
        }
        /** @type {{
         *     visible: Route|undefined,
         *     copyable: Route|undefined,
         *     editable: Route|undefined,
         *     deletable: Route|undefined,
         * }} routes */
        this.routes = {
            visible: DatatableColumnActionsAction.getActionRoute(this.visible, isVisible),
            copyable: DatatableColumnActionsAction.getActionRoute(this.copyable, isCopyable),
            editable: DatatableColumnActionsAction.getActionRoute(this.editable, isEditable),
            deletable: DatatableColumnActionsAction.getActionRoute(this.deletable, isDeletable),
        };

        this.setActionsEvents();
    }

    /**
     * @param {jQuery|HTMLElement} actionDOM
     * @param {boolean} accessible
     * @return {Route|undefined}
     */
    static getActionRoute(actionDOM, accessible) {
        if(actionDOM && actionDOM.length && accessible) {
            return co.router.get(
                co.data(actionDOM, "route"),
                co.data(actionDOM, "route-method")
            );
        }
    }

    /**
     * @param {Event} e
     */
    openVisibleCard(e) {
        co.popup.card("Show element")
            .load(
                this.routes.visible.getAbsolutePath(),
                {
                    datatable: this.column.column.datatable.name,
                    id: this.column.row.ID,
                    row: this.column.row.position,
                },
                this.routes.visible.method,
            )
            .open()
        ;
    }

    /**
     * @param {Event} e
     */
    openEditableCard(e) {
        this.openManageCard(
            "Edit item",
            this.routes.editable,
            [this, "updateRowAfterEdit"]
        );
    }

    /**
     * @param {Event} e
     */
    openCopyableCard(e) {
        this.openManageCard(
            "Copy item",
            this.routes.copyable,
            [this, "addRowAfterCopy"]
        );
    }

    /**
     * @param {string} title
     * @param {Route} route
     * @param {Function|Array} cb
     */
    openManageCard(title, route, cb) {
        co.popup.form(title)
            .setCb(cb)
            .load(
                route.getAbsolutePath(),
                {
                    datatable: this.column.column.datatable.name,
                    id: this.column.row.ID,
                    row: this.column.row.position,
                },
                route.method,
            )
            .open()
        ;
    }

    /**
     * @param {Event} e
     */
    openDeletableCard(e) {
        co.popup.confirm(
            "Confirm deleting",
            co.concat(
                "Are you sure, you want to delete ",
                this.column.row.title,
                " ?"
            ),
            [this, "deleteItem"]
        )
            .open()
        ;
    }

    /**
     * @param {boolean} confirm
     */
    deleteItem(confirm) {
        if(confirm) {
            co.ajax.build()
                .setUrl(this.routes.deletable.getAbsolutePath())
                .setType(this.routes.deletable.method)
                .setData({
                    datatable:this.column.column.datatable.name,
                    id:this.column.row.ID
                })
                .setSuccess([this, "updateRowAfterDelete"])
                .execute()
            ;
        }
    }

    updateRowAfterDelete(response) {
        if(response.success) {
            this.column.row.destroy();
            this.column.column.datatable.alert.success(
                co.concat(
                    "The element ",
                    this.column.row.title,
                    " is deleted"
                )
            );
            this.column.column.datatable.removeRow([this.column.row]);
        }
    }

    updateRowAfterEdit(response) {
        if(response.success) {
            this.column.column.datatable.alert.success(response.messages);
            this.column.row.updateColumns(response.item);
        }
    }

    addRowAfterCopy(response) {
        if(response.success) {
            this.column.column.datatable.alert.success(response.messages);
            DatatableRow.createFromData(this.column.row.datatable, response.item);
        }
        this.column.row.datatable.on(
            this.column.row.datatable.EVENT_ON_AFTER_ADDING_ITEM,
            response.success
        );
    }

    setActionsEvents() {
        let
            this_o = this
        ;
        if(this.visible && this.visible.length) {
            this.visible.on("click", (e) => {
                this_o.openVisibleCard(e);
            });
        }
        if(this.copyable && this.copyable.length) {
            this.copyable.on("click", (e) => {
                this_o.openCopyableCard(e);
            });
        }
        if(this.editable && this.editable.length) {
            this.editable.on("click", (e) => {
                this_o.openEditableCard(e);
            });
        }
        if(this.deletable && this.deletable.length) {
            this.deletable.on("click", (e) => {
                this_o.openDeletableCard(e);
            });
        }
    }

}

module.exports = DatatableColumnActionsAction;