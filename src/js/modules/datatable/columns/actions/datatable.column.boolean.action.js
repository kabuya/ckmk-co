const DatatableColumnAction = require("./datatable.column.action");
const HTML_CLASS_CONTAINER = "datatable-boolean";
const HTML_CLASS_ENABLE = "datatable-boolean-enable";
const HTML_CLASS_DISABLE = "datatable-boolean-disable";
const HTML_CLASS_LOADING = "datatable-loading-editable";

/**
 * @property {DatatableColumnBooleanType} type
 * @property {DatatableRowColumn} column
 * @property {jQuery|HTMLElement} dom
 * @property {boolean} onRequest
 */
class DatatableColumnBooleanAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnBooleanType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
        this.dom = this.column.dom.find("> div");
        this.onRequest = false;
    }

    /**
     * @return {boolean}
     */
    isEnable() {
        return (this.dom.hasClass(HTML_CLASS_ENABLE) && !this.onRequest);
    }

    /**
     * @return {boolean}
     */
    isDisable() {
        return (this.dom.hasClass(HTML_CLASS_DISABLE) && !this.onRequest);
    }

    /**
     * @return {boolean}
     */
    enable() {
        if(this.isEnable()) return false;
        this.dom
            .removeClass(HTML_CLASS_DISABLE)
            .addClass(HTML_CLASS_ENABLE)
        ;
        return true;
    }

    /**
     * @return {boolean}
     */
    disable() {
        if(this.isDisable()) return false;
        this.dom
            .removeClass(HTML_CLASS_ENABLE)
            .addClass(HTML_CLASS_DISABLE)
        ;
        return true;
    }

    /**
     * @return {boolean}
     */
    toggleAble() {
        return this.isEnable()
            ? this.disable()
            : this.enable()
        ;
    }

    /**
     * @param {boolean} value
     */
    doRequest(value) {
        let
            route = this.column.column.type.editable
        ;
        this.dom.addClass(HTML_CLASS_LOADING);
        this.onRequest = true;
        co.ajax.build()
            .setUrl(route.getAbsolutePath())
            .setType(route.method)
            .setData({
                datatable: this.column.column.datatable.name,
                id: this.column.row.ID,
                row: this.column.row.position,
                value: value,
            })
            .setSuccess([this, "applyResult"])
            .execute()
        ;
        return true;
    }

    applyResult(response) {
        this.onRequest = false;
        this.dom.removeClass(HTML_CLASS_LOADING);
        if(response.success) {
            this.column.column.datatable.alert.success(response.messages || this.getDefaultReturnedMessages());
        } else {
            this.column.column.datatable.alert.warning(response.messages || "Error on request");
            this.toggleAble();
        }
    }

    getDefaultReturnedMessages() {
        return co.concat(
            "The ",
            "<b>",
            this.column.row.title,
            "</b>",
            " is ",
            (this.isEnable() ? "enable" : "disable"),
        );
    }

    setEditPopUp(e) {
        let elem = $(e.target);
        if(elem.prop("localName") !== "td") {
            this.dom = $(e.currentTarget).find("> div");
            this.toggleAble();
            this.doRequest(this.isEnable());
            return true;
        }
        return false;
    }

}

module.exports = DatatableColumnBooleanAction;