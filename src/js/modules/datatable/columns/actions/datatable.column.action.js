/**
 * @property {Datatable} datatable
 * @property {
 *   DatatableColumnBooleanType
 *  |DatatableColumnDatetimeType
 *  |DatatableColumnDateType
 *  |DatatableColumnEntityType
 *  |DatatableColumnFloatType
 *  |DatatableColumnImageType
 *  |DatatableColumnIntegerType
 *  |DatatableColumnLongtextType
 *  |DatatableColumnTextType
 *  |DatatableColumnTimeType
 *  |DatatableColumnType
 * } type
 * @property {DatatableRowColumn} column
 * @property {PopupFormCard|undefined} popup
 */
class DatatableColumnAction {

    /**
     * @param {
     *   DatatableColumnBooleanType
     *  |DatatableColumnDatetimeType
     *  |DatatableColumnDateType
     *  |DatatableColumnEntityType
     *  |DatatableColumnFloatType
     *  |DatatableColumnImageType
     *  |DatatableColumnIntegerType
     *  |DatatableColumnLongtextType
     *  |DatatableColumnTextType
     *  |DatatableColumnTimeType
     *  |DatatableColumnType
     *  |undefined
     * } type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        this.type = type;
        this.column = column;
        /** @type {Datatable} datatable */
        this.datatable = this.column.column.datatable;
        this.setEvents();
    }

    /**
     * @param {Event} e
     */
    setEditPopUp(e) {
        let
            title = this.getPopupTitle(),
            content = this.column.formTemplate
        ;
        if(!this.popup) {
            this.popup = co.popup
                .form(title, content)
                .setCb([this.column, "parseResponse"])
            ;
        } else {
            this.popup
                .setTitle(title)
                .setContent(content)
            ;
        }
        this.openPopup();
    }

    openPopup() {
        if(this.popup) {
            this.popup.open();
        }
    }

    getPopupTitle() {
        return co.concat(
            "Edit value off column ",
            "<b>",
            this.column.column.title,
            "</b>",
            " at row ",
            "<b>",
            this.column.row.position,
            "</b>"
        );
    }

    destroy() {
        return true;
    }

    setEvents() {
        if(!this.type.isVoid()) {
            if(this.type.editable && this.datatable.grants.isUpdate() && this.column.row.isVisible(this.column.row.VISIBILITY_COLUMN_EDITABLE)) {
                let
                    this_o = this
                ;
                this.column.dom.on("dblclick", (e) => {e.stopPropagation(); this_o.setEditPopUp(e);});
            }
        }
    }

}

module.exports = DatatableColumnAction;