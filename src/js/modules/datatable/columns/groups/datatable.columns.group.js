const HTML_CLASS_HIDDEN = "datatable-item-hidden";


/**
 * @property {Datatable} datatable
 * @property {jQuery|HTMLElement} dom
 * @property {string} name
 * @property {string} title
 * @property {number} position
 * @property {DatatableColumn[]} columns
 */
class DatatableColumnsGroup {


    /**
     * @param {Datatable} datatable
     * @param {jQuery|HTMLElement} dom
     */
    constructor(datatable, dom) {
        this.datatable = datatable;
        this.dom = $(dom);
        /** @type {string} name */
        this.name = co.data(this.dom, "name");
        /** @type {string} title */
        this.title = co.data(this.dom, "title");
        /** @type {number} position */
        this.position = co.data(this.dom, "position");
        /** @type {DatatableColumn[]} columns */
        this.columns = [];
    }

    /**
     * @return {boolean}
     */
    show() {
        if(!this.isHidden()) return false;
        this.dom.removeClass(HTML_CLASS_HIDDEN);
        return true;
    }

    /**
     * @return {boolean}
     */
    hide() {
        if(this.isHidden()) return false;
        this.dom.addClass(HTML_CLASS_HIDDEN);
        return true;
    }

    /**
     * @return {boolean}
     */
    isHidden() {
        return this.dom.hasClass(HTML_CLASS_HIDDEN);
    }


    resetColspanForColumnChild() {
        let
            newList = this.columns.filter((_column) => {
                _column.removeColspan();
                return !_column.isHidden();
            }),
            colspan = newList.length,
            moreCount = this.columns.length + 1
        ;
        if(colspan > 0 && colspan < this.columns.length) {
            newList[(colspan - 1)].setColspan(moreCount - colspan);
        }
    }

    /**
     * @param {DatatableColumn} column
     */
    addColumn(column) {
        let exist = this.columns.filter((_column) => {
            return _column === column;
        }).length === 1;
        if(column.group !== this) column.group = this;
        if(!exist) this.columns.push(column);
    }


}

module.exports = DatatableColumnsGroup;