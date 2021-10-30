const HTML_CLASS_ITEM_ACTIVE = "datatable-count-lines-list-item-active";

/**
 * @property {DatatableActionLines} parent
 * @property {jQuery|HTMLElement} dom
 * @property {number} value
 */
class DatatableActionLinesItem {


    /**
     * @param {DatatableActionLines} parent
     * @param {jQuery|HTMLElement} dom
     */
    constructor(parent, dom) {
        this.parent = parent;
        this.dom = $(dom);
        this.value = parseInt(this.dom.text().trim());
        this.setEvents();
    }

    /**
     * @return {boolean}
     */
    isActive() {
        return this.dom.hasClass(HTML_CLASS_ITEM_ACTIVE);
    }

    /**
     * @return {boolean}
     */
    enable() {
        if(this.isActive()) return false;
        this.dom.addClass(HTML_CLASS_ITEM_ACTIVE);
        return true;
    }

    /**
     * @return {boolean}
     */
    disable() {
        if(!this.isActive()) return false;
        this.dom.removeClass(HTML_CLASS_ITEM_ACTIVE);
        return true;
    }

    /**
     * @param {Event} e
     * @return {boolean}
     */
    change(e) {
        return this.parent.change(this.value);
    }

    setEvents() {
        let
            this_o = this
        ;
        this.dom.on("click", (e) => {e.stopPropagation(); this_o.change(e);})
    }

}

module.exports = DatatableActionLinesItem;