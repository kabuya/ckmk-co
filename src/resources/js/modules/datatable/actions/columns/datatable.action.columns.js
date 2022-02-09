const DatatableActionAllColumn = require("./items/datatable.action.all.column");
const DatatableActionColumn = require("./items/datatable.action.column");
const DatatableActionGroupColumn = require("./items/datatable.action.group.column");

const HTML_CLASS_LIST = "datatable-columns-visibility-list";
const HTML_CLASS_LIST_OPEN = "datatable-list-open";
const HTML_CLASS_LIST_BLOCK = "datatable-list-block";
const HTML_CLASS_LIST_SHOW = "datatable-list-show";
const HTML_CLASS_COLUMN_HIDDEN = "datatable-item-hidden";
const HTML_CLASS_ITEM_COLUMN = "datatable-columns-visibility-list-item";
const HTML_CLASS_ITEM_GROUP = "datatable-columns-visibility-list-item-container";

/**
 * @property {DatatableActions} actions
 * @property {jQuery|HTMLElement} dom
 * @property {(
 * DatatableActionAllColumn
 * |DatatableActionColumn
 * |DatatableActionGroupColumn
 * )[]} items
 */
class DatatableActionColumns {



    /**
     * @param {DatatableActions} actions
     */
    constructor(actions) {
        this.actions = actions;
        /** @type {jQuery|HTMLElement} dom */
        this.dom = this
            .actions
            .dom
            .find(".datatable-columns-visibility")
        ;
        /** @type {(
         * DatatableActionAllColumn
         * |DatatableActionColumn
         * |DatatableActionGroupColumn
         * )[]} items */
        this.items = [];
        this.setItems();
        this.setEvents();
    }

    open() {
        if(this.isOpen()) return false;
        let
            this_o = this,
            list = this_o.dom.find("." + HTML_CLASS_LIST)
        ;
        co.timeOutChain(50,
            () => {
                list
                    .addClass(HTML_CLASS_LIST_OPEN)
                    .addClass(HTML_CLASS_LIST_BLOCK)
                ;
            },
            () => {
                list
                    .addClass(HTML_CLASS_LIST_SHOW)
                ;
            }
        );
        return true;
    }

    close() {
        if(this.isClose()) return false;
        let
            this_o = this,
            list = this_o.dom.find("." + HTML_CLASS_LIST)
        ;
        co.timeOutChain(300,
            () => {
                list
                    .removeClass(HTML_CLASS_LIST_SHOW)
                ;
            },
            () => {
                list
                    .removeClass(HTML_CLASS_LIST_OPEN)
                    .removeClass(HTML_CLASS_LIST_BLOCK)
                ;
            }
        );
        return true;
    }

    isOpen() {
        return this.dom
            .find("." + HTML_CLASS_LIST)
            .hasClass(HTML_CLASS_LIST_OPEN)
        ;
    }

    isClose() {
        return !this.isOpen();
    }

    setItems() {
        let
            this_o = this
        ;
        this.dom
            .find("." + HTML_CLASS_LIST)
            .find("> ." + HTML_CLASS_ITEM_COLUMN + ", > ." + HTML_CLASS_ITEM_GROUP)
            .each((k, elem) => {
                elem = $(elem);
                if(elem.data("column") === "all") {
                    this_o.items.push(new DatatableActionAllColumn(this_o, elem));
                } else if(elem.hasClass(HTML_CLASS_ITEM_GROUP)) {
                    this_o.items.push(new DatatableActionGroupColumn(this_o, elem.find("> .datatable-columns-group-visibility-item")));
                } else {
                    this_o.items.push(new DatatableActionColumn(this_o, elem));
                }
            })
        ;
    }

    /**
     * @param {Event} e
     */
    toggleOpen(e) {
        if(this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * @param {jQuery.Event} e
     */
    toggleOpenByKey(e) {
        if(e.originalEvent && (e.originalEvent.code.in("space", "enter") || e.originalEvent.key.in("enter"))) {
            this.toggleOpen(e);
            return true;
        }
        return false;
    }

    setEvents() {
        this.dom.on("keyup", this.toggleOpenByKey.bind(this));
        this.dom.on("focusout", this.close.bind(this));
        this.dom.find(".datatable-columns-visibility-title").on("click", this.toggleOpen.bind(this));
    }

}

module.exports = DatatableActionColumns;