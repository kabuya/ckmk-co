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
                .onSuccess([this.column, "parseResponse"])
                .onSecurityTokenUpdate([this.column, "updateSecurityTokenForm"])
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
            "Edit value ",
            "<b class='three-point' style='max-width: 300px;'>",
                this.column.value,
            "</b>",
            " off column ",
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
            if(this.type.editable && this.datatable.grants.isUpdate() && this.column.grantEditable) {
                this.column.dom.on("dblclick", this.setEditPopUp.bind(this));
            }
        }
    }

}

module.exports = DatatableColumnAction;