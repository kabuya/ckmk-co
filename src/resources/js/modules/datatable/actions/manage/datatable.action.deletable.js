
/**
 * @property {DatatableActions} actions
 * @property {jQuery|HTMLElement} dom
 * @property {Route|undefined} route
 * @property {DatatableRow[]} rows
 * @property {DatatableRow|undefined} firstSelectedRow
 * @property {boolean} started
 */
class DatatableActionDeletable {



    /**
     * @param {DatatableActions} actions
     */
    constructor(actions) {
        this.actions = actions;
        /** @type {jQuery|HTMLElement} */
        this.dom = this.actions.dom.find(".datatable-global-manage-item.datatable-global-delete");
        this.route = co.router.get(co.data(this.dom, "route"), co.ajax.METHOD_POST);
        /** @type {DatatableRow[]} */
        this.rows = [];
        /** @type {boolean} */
        this.started = false;
        this.setEvents();
    }

    /**
     * @return {boolean}
     */
    isStarted() {
        return this.started;
    }

    /**
     * @return {boolean}
     */
    abortEvent() {
        if(this.isStarted()) {
            this.started = false;
            this.removeAllSelected();
            return true;
        }
        return false;
    }

    /**
     * @param {Event} e
     */
    openDeleteCheckbox(e) {
        if(!this.actions.datatable.hasItems()) return;
        if(!this.isStarted()) {
            this.started = true;
            this.appendAllSelected();
        } else {
            if(this.rows.length) {
                co.popup.confirm(
                        "Confirm deleting",
                        this.getConfirmContent(),
                    [this, "deleteItems"]
                    )
                    .open()
                ;
            } else {
                this.abortEvent();
                this.actions.datatable.alert.warning(
                    "No lines have been selected."
                );
            }
        }
    }

    openCheckboxAgain(success) {
        if(success && this.isStarted()) this.appendAllSelected();
    }

    /**
     * @param {boolean} confirm
     */
    deleteItems(confirm) {
        if(confirm) {
            this.started = false;
            co.ajax.build()
                .setUrl(this.route.getAbsolutePath())
                .setType(this.route.getDefaultMethod())
                .setData({
                    datatable:this.actions.datatable.name,
                    all: (this.rows.length === this.actions.datatable.rows.length),
                    id: this.getRowsIDs(),
                })
                .setSuccess([this, "updateRowAfterDelete"])
                .execute()
            ;
        }
    }


    updateRowAfterDelete(response) {
        if(response.success) {
            let
                total = this.rows.length,
                rows = this.rows
            ;
            this.rows.forEach((_row) => {
                _row.destroy();
            });
            this.rows = [];
            this.removeAllSelected();
            this.actions.datatable.alert.success(
                co.concat(
                    "The (<b>",
                        total,
                    "</b>) elements are deleted"
                )
            );
            this.actions.datatable.removeRow(rows);
        }
        this.actions.datatable.run(co.datatable.EVENT_ON_AFTER_REMOVING_ITEM, response.success);
    }

    appendAllSelected() {
        this.actions.datatable.appendSelected();
        this.actions.datatable.rows.forEach((_row) => {
            _row.appendSelected();
        });
    }

    removeAllSelected() {
        this.actions.datatable.removeSelected();
        this.actions.datatable.rows.forEach((_row) => {
            _row.removeSelected();
        });
    }

    /**
     * @return {*[]}
     */
    getRowsIDs() {
        let ids = [];
        this.rows.forEach((_row) => {
            ids.push(_row.ID);
        });
        return ids;
    }

    getConfirmContent() {
        let
            content = co.concat(
                "<div>",
                    "Are you sure you want to delete (<b>",
                        this.rows.length,
                    "</b>)",
                " element(s)</div>"
            ),
            items = $("<div class='datatable-confirm-delete-items'></div>")
        ;
        this.rows.forEach((_row) => {
            items.append(co.concat(
                "<div>",
                    _row.title,
                "</div>",
            ));
        });
        return co.concat(content, items.prop("outerHTML"));
    }

    /**
     * @param {DatatableRow} row
     */
    addRow(row) {
        if(!this.hasRow(row)) {
            this.rows.push(row);
            return true;
        }
        return false;
    }

    /**
     * @param {DatatableRow} row
     */
    removeRow(row) {
        if(this.hasRow(row)) {
            let newList = this.rows.filter((_row) => {
                return _row !== row;
            });
            if(newList.length !== this.rows.length) {
                this.rows = newList;
                return true;
            }
        }
        return false;
    }

    /**
     * @param {DatatableRow} row
     */
    hasRow(row) {
        return (this.rows.filter((_row) => {
            return _row === row;
        }).length > 0);
    }

    /**
     * @param {Event} e
     * @param {function} cb
     */
    initSelectRows(e, cb) {
        if(this.isStarted()) {
            e.preventDefault();
            let
                this_o = this,
                elem = $(e.currentTarget)
            ;
            elem.on("pointermove", cb);
            elem.one("pointerup", (e) => {
                this_o.firstSelectedRow = undefined;
                elem.off("pointermove", cb);
            });
        }
    }

    /**
     * @param {Event} e
     */
    selectRows(e) {
        let
            elemTarget = $(e.target),
            row
        ;
        while (
            elemTarget.prop("localName") !== "td"
            &&
            elemTarget.prop("localName") !== "table"
        ) {
            elemTarget = elemTarget.parent();
        }
        if(elemTarget.hasClass("datatable-selected-column")) {
            elemTarget = elemTarget.parent();
            row = this.actions.datatable.getRow(elemTarget);
            if(row && row.selected.isAppended()) {
                if(!this.firstSelectedRow) {
                    this.firstSelectedRow = row;
                    if(row.selected.isChecked()) {
                        row.selected.uncheck();
                    } else {
                        row.selected.check();
                    }
                } else if(row !== this.firstSelectedRow) {
                    if(this.firstSelectedRow.selected.isChecked()) {
                        row.selected.check();
                    } else {
                        row.selected.uncheck();
                    }
                }
            }
        }
    }

    setEvents() {
        if(this.route) {
            let
                this_o = this
            ;
            this.dom.on("click", this.openDeleteCheckbox.bind(this));
            this.actions.datatable.dom.find(".datatable-body").on("pointerdown", (e) => {
                this_o.initSelectRows(e, this_o.selectRows.bind(this_o));
            });

            this.actions.datatable.on(
                co.datatable.EVENT_ON_SELECTED_ROW_ADD,
                [this, "addRow"]
            );
            this.actions.datatable.on(
                co.datatable.EVENT_ON_SELECTED_ROW_REMOVE,
                [this, "removeRow"]
            );
            this.actions.datatable.on(
                co.datatable.EVENT_ON_AFTER_ADDING_ITEM,
                [this, "openCheckboxAgain"]
            );

            this.actions.datatable.onAfter(
                co.datatable.EVENT_ON_AFTER_REMOVING_ITEM,
                [this, "abortEvent"]
            );
        }
    }

}

module.exports = DatatableActionDeletable;