const HTML_CLASS_DISPLAY_REMOVE_TEXT = "datatable-remove-search-text-display";
const HTML_CLASS_INPUT_ERROR = "input-error";
const HTML_CLASS_INPUT_ACTIVE = "input-active";
const HASH_JOIN = "###########################################################";


/**
 * @property {DatatableActionSearch} parent
 * @property {jQuery|HTMLElement} dom
 * @property {DatatableColumn[]} columns
 * @property {Route|boolean} method
 * @property {string|undefined} value
 */
class DatatableActionSearchItem {


    /**
     * @param {DatatableActionSearch} parent
     * @param {jQuery|HTMLElement} dom
     */
    constructor(parent, dom) {
        this.parent = parent;
        this.dom = $(dom);
        /** @type {DatatableColumn[]} columns */
        this.columns = this.getColumnTarget(co.data(this.dom, "column-target"));
        /** @type {Route|boolean} columns */
        this.method = this.getMethod(co.data(this.dom, "search"));

        this.setEvents();
    }

    /**
     * @return {boolean}
     */
    isGlobal() {
        return (this.columns.length > 1);
    }

    /**
     * @param {Event} e
     */
    editValue(e) {
        this.value = $(e.currentTarget).val();
        if(!this.value) {
            this.value = undefined;
            if(this.dom.hasClass(HTML_CLASS_DISPLAY_REMOVE_TEXT)) {
                this.dom.removeClass(HTML_CLASS_DISPLAY_REMOVE_TEXT);
            }
        } else {
            if(!this.dom.hasClass(HTML_CLASS_DISPLAY_REMOVE_TEXT)) {
                this.dom.addClass(HTML_CLASS_DISPLAY_REMOVE_TEXT);
            }
        }
        this.parent.buildSearch();
        return true;
    }

    empty() {
        let
            input = this.dom.find("input")
        ;
        this.value = undefined;
        input.val("");
        input.removeClass(HTML_CLASS_INPUT_ACTIVE);
        input.removeClass(HTML_CLASS_INPUT_ERROR);
        if(this.dom.hasClass(HTML_CLASS_DISPLAY_REMOVE_TEXT)) {
            this.dom.removeClass(HTML_CLASS_DISPLAY_REMOVE_TEXT);
        }
    }

    /**
     * @param {Event} e
     */
    toggleActive(e) {
        let
            elem = $(e.currentTarget)
        ;
        if(elem.val()) {
            elem.addClass(HTML_CLASS_INPUT_ACTIVE);
        } else {
            elem.removeClass(HTML_CLASS_INPUT_ACTIVE);
            elem.removeClass(HTML_CLASS_INPUT_ERROR);
        }
    }

    /**
     * @param {Event} e
     */
    resetValue(e) {
        let
            elem = $(e.currentTarget),
            input = elem.parent().parent().find("input")
        ;
        input.val("");
        input.trigger("change");
    }

    /**
     * @param {string|boolean|number} method
     * @return {boolean|Route}
     */
    getMethod(method) {
        if(co.isInt(method)) return !!method;
        return co.router.get(method, co.ajax.METHOD_POST);
    }

    /**
     * @param {string} columnTarget
     * @return {DatatableColumn[]}
     */
    getColumnTarget(columnTarget) {
        let columns = [];
        if(columnTarget.in("all")) {
            columns = this
                .parent
                .actions
                .datatable
                .columns.filter((_column) => {
                    return !_column.isColumnAction();
                })
            ;
        } else {
            columns.push(this.parent.actions.datatable.getColumn(columnTarget));
        }
        return columns;
    }

    /**
     * @param {string|DatatableColumn} column
     * @return {boolean}
     */
    hasColumn(column) {
        return (this.columns.filter((_column) => {
            return (
                _column === column
                ||
                _column.name === column
            );
        }).length > 0);
    }

    setEvents() {
        let
            this_o = this,
            input = this.dom.find("input"),
            close = this.dom.find("i.fa-close")
        ;
        input.on("keyup", (e) => {this_o.editValue(e);});
        input.on("change", (e) => {this_o.editValue(e);});
        input.on("focusout", (e) => {this_o.toggleActive(e);});
        close.on("click", (e) => {this_o.resetValue(e);});
    }

}

module.exports = DatatableActionSearchItem;