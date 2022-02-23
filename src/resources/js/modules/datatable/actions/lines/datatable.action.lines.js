const DatatableActionLinesItem = require("./items/datatable.action.lines.item");

const HTML_CLASS_LIST = "datatable-count-lines-list";
const HTML_CLASS_LIST_OPEN = "datatable-list-open";
const HTML_CLASS_LIST_BLOCK = "datatable-list-block";
const HTML_CLASS_LIST_SHOW = "datatable-list-show";


/**
 * @property {DatatableActions} actions
 * @property {jQuery|HTMLElement} dom
 * @property {DatatableActionLinesItem[]} items
 * @property {number} currentValue
 */
class DatatableActionLines {


    /**
     * @param {DatatableActions} actions
     */
    constructor(actions) {
        this.actions = actions;
        /** @type {jQuery|HTMLElement} dom */
        this.dom = this
            .actions
            .dom
            .find(".datatable-count-lines")
        ;
        /** @type {DatatableActionLinesItem[]} items */
        this.items = [];
        this.setItems();
        this.setEvents();
    }

    /**
     * @return {boolean}
     */
    isOpen() {
        return this.dom
            .find("." + HTML_CLASS_LIST)
            .hasClass(HTML_CLASS_LIST_OPEN)
            ;
    }

    /**
     * @return {boolean}
     */
    isClose() {
        return !this.isOpen();
    }

    /**
     * @return {boolean}
     */
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

    /**
     * @return {boolean}
     */
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

    /**
     * @param {number} value
     * @return {boolean}
     */
    change(value) {
        if(this.currentValue === value) return false;
        let
            this_o = this,
            currentDom = this.dom.find(".datatable-count-lines-result-current"),
            success = false
        ;
        this.items.forEach((_item) => {
            if(_item.value === value) {
                if(!success) success = true;
                _item.enable();
            } else {
                _item.disable();
            }
        });
        if(success) {
            this.currentValue = value;
            currentDom.text(value).attr("title", value);
            this.actions.datatable
                .run(co.datatable.EVENT_ON_CHANGE_COUNT_LINE, value)
            ;
        }
        this.close();
        return success;
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

    setItems() {
        let
            this_o = this
        ;
        this.dom.find(".datatable-count-lines-list-item").each((k, elem) => {
            let item = new DatatableActionLinesItem(this_o, elem);
            if(item.isActive()) this_o.currentValue = item.value;
            this_o.items.push(item);
        });
    }

    setEvents() {
        this.dom.on("keyup", this.toggleOpenByKey.bind(this));
        this.dom.on("focusout", this.close.bind(this));
        this.dom.find(".datatable-count-lines-result").on("click", this.toggleOpen.bind(this));
    }


}

module.exports = DatatableActionLines;