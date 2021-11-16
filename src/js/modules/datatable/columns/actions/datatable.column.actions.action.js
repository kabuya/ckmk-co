const DatatableColumnAction = require("./datatable.column.action");
const DatatableRow = require("../../rows/datatable.row");

/**
 * @property {DatatableColumnActionType} type
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
 * @property {{
 *     visible : PopUpCard,
 *     manage  : PopupFormCard,
 *     delete  : PopupConfirmCard,
 * }} popups
 */
class DatatableColumnActionsAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnActionType} type
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
        this.type.popups.visible
            .setTitle("Show element")
            .load(
                this.routes.visible.getAbsolutePath(),
                {
                    datatable: this.column.column.datatable.name,
                    id: this.column.row.ID,
                    row: this.column.row.position,
                },
                this.routes.visible.method
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
        let
            data = {
                datatable: this.column.column.datatable.name,
                id: this.column.row.ID,
                row: this.column.row.position,
            }
        ;
        data[this.column.row.datatable.ROW_MODEL_KEY] = this.column.row.modelRow;
        this.type.popups.manage
            .setCb(cb)
            .setTitle(title)
            .load(
                route.getAbsolutePath(),
                data,
                route.getDefaultMethod(),
            )
            .open()
        ;
    }

    /**
     * @param {Event} e
     */
    openDeletableCard(e) {
        this.type.popups.confirm
            .setCb([this, "deleteItem"])
            .setTitle("Confirm deleting")
            .setContent(co.concat(
                "Are you sure, you want to delete ",
                this.column.row.title,
                " ?"
            ))
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
                .setType(this.routes.deletable.getDefaultMethod())
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
        this.column.column.datatable.run(this.column.column.datatable.EVENT_ON_AFTER_REMOVING_ITEM, response.success);
    }

    updateRowAfterEdit(response) {
        if(response.success) {
            this.column.column.datatable.alert.success(response.messages);
            this.column.row.updateColumns(response[this.datatable.ROW_MODEL_KEY]);
        }
    }

    addRowAfterCopy(response) {
        if(response.success) {
            this.column.column.datatable.alert.success(response.messages);
            let
                data = response[this.column.row.datatable.ROW_MODEL_KEY]
            ;
            DatatableRow.createFromData(this.column.row.datatable, data);
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