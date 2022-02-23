const HTML_CLASS_DISPLAY_REMOVE_TEXT = "datatable-remove-search-text-display";
const HTML_CLASS_INPUT_ERROR = "input-error";
const HTML_CLASS_INPUT_ACTIVE = "input-active";
const HASH_JOIN = "###########################################################";

const DISABLE_HIDDEN_SEARCH_DOM = "<div class='datatable-hidden-search-input'></div>";
const HTML_DISABLE_CLASS_HIDDEN = "datatable-hidden-search-input";
const HTML_DISABLE_CLASS_SEARCH = "datatable-search-disable";
const HTML_DISABLE_CLASS_ROWS = "datatable-rows-count-0";
const HTML_DISABLE_CLASS_EMPTY = "datatable-empty-data";

/**
 * @property {DatatableActionSearch} parent
 * @property {jQuery|HTMLElement} dom
 * @property {DatatableColumn[]} columns
 * @property {Route|boolean} method
 * @property {string|undefined} value
 * @property {boolean} __isDisable__
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
        this.__isDisable__ = this.isDisable();
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
        this.disable();
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

    /**
     * @return {boolean}
     */
    isDisable() {
        if(this.__isDisable__) return true;
        return (
            this.dom.hasClass(HTML_DISABLE_CLASS_SEARCH)
            ||
            this.dom.hasClass(HTML_DISABLE_CLASS_ROWS)
            ||
            this.dom.hasClass(HTML_DISABLE_CLASS_EMPTY)
            ||
            !!this.dom.find(co.concat(".", HTML_DISABLE_CLASS_HIDDEN)).length
        );
    }

    disable() {
        if(this.isDisable()) return false;
        this.__isDisable__ = true;
        if(!this.dom.find(co.concat(".", HTML_DISABLE_CLASS_HIDDEN)).length) {
            this.dom.append(DISABLE_HIDDEN_SEARCH_DOM);
        }
        this.dom.addClass(HTML_DISABLE_CLASS_SEARCH);
        this.dom.addClass(HTML_DISABLE_CLASS_ROWS);
        this.dom.addClass(HTML_DISABLE_CLASS_EMPTY);
        return true;
    }

    enable() {
        if(!this.isDisable()) return false;
        this.__isDisable__ = false;
        this.dom.find(co.concat(".", HTML_DISABLE_CLASS_HIDDEN)).remove();
        this.dom.removeClass(HTML_DISABLE_CLASS_SEARCH);
        this.dom.removeClass(HTML_DISABLE_CLASS_ROWS);
        this.dom.removeClass(HTML_DISABLE_CLASS_EMPTY);
        return true;
    }

    /**
     * @param {Event} e
     */
    checkDisable(e) {
        return !this.__isDisable__;
    }

    setEvents() {
        let
            input = this.dom.find("input"),
            close = this.dom.find("i.fa-close")
        ;
        this.dom.on("click", this.checkDisable.bind(this));
        input.on("keyup", this.editValue.bind(this));
        input.on("change", this.editValue.bind(this));
        input.on("focusout", this.toggleActive.bind(this));
        close.on("click", this.resetValue.bind(this));
    }

}

module.exports = DatatableActionSearchItem;