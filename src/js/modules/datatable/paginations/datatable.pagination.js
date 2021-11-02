
/**
 * @property {Datatable} datatable
 * @property {jQuery|HTMLElement} dom
 * @property {number} items
 * @property {number} total
 * @property {number} current
 * @property {number|undefined} next
 * @property {number|undefined} previous
 * @property {number[]} rowsTarget
 * @property {number|undefined} timeOutInt
 */
class DatatablePagination {


    /**
     * @param {Datatable} datatable
     */
    constructor(datatable) {
        this.datatable = datatable;
        /** @type {jQuery|HTMLElement} dom */
        this.dom = this.datatable.dom.find(".datatable-pagination");
        /** @type {number} items */
        this.items = co.data(this.dom, "items");
        /** @type {number} total */
        this.total = co.data(this.dom, "total");
        /** @type {number} current */
        this.current = co.data(this.dom, "current");
        /** @type {number|undefined} next */
        this.next = co.data(this.dom, "next");
        /** @type {number|undefined} previous */
        this.previous = co.data(this.dom, "previous");
        /** @type {number[]} rowsTarget */
        this.rowsTarget = co.data(this.dom, "rows-target");
        this.changePagesCount();
        this.setEvents();
        //co.log(this);
    }

    /**
     * @param {number} current
     * @return {DatatablePagination}
     */
    setCurrent(current) {
        this.current = current;
        this.changePagesCount();
        return this;
    }

    /**
     * @param {number} countLine
     */
    changeTarget(countLine) {
        this.changePagesCount(countLine);
        this.updateRows();
    }

    /**
     * @param {number|undefined} countLine
     */
    changePagesCount(countLine = undefined) {
        countLine = countLine || this.datatable.countLine;
        let rowsTarget = [], total, next, prev, targetMax, targetMin;

        // Define total items
        total = this.items / countLine;
        if(co.isFloat(total)) total = parseInt(total + 1);
        if(total < 1) total = 1;
        this.total = ((isNaN(total)) ? 1 : total);

        // Define current
        this.current = this.getCurrentView();

        // Define next
        next = this.current + 1;
        if(next > this.total) next = 1;
        this.next = next;

        // Define prev
        prev = this.current - 1;
        if(prev < 1) prev = this.total;
        this.previous = prev;

        // Define rows target
        targetMax = countLine * this.current;
        targetMin = ((targetMax - countLine) + 1);
        for(let i = targetMin; i <= targetMax; i++) {
            rowsTarget.push(i);
            if(i >= this.items) break;
        }
        this.rowsTarget = rowsTarget;
        this.updateHtml();
    }

    updateHtml() {
        let
            input = this.dom.find(".datatable-pagination-page-input"),
            current = this.dom.find(".datatable-view-current"),
            items = this.dom.find(".datatable-items-total"),
            total = this.dom.find(".datatable-view-total")
        ;

        input
            .val(this.current)
            .attr("min", 1)
            .attr("max", this.total)
        ;

        current
            .text(this.current)
            .attr("title", this.current)
        ;

        items
            .text(this.items)
            .attr("title", this.items)
        ;

        total
            .text(this.total)
            .attr("title", this.total)
        ;
    }

    /**
     * @param {Event} e
     * @return {DatatablePagination}
     */
    goToPrev(e) {
        let prev = this.previous;
        //if(this.canChange(prev)) {
        //    prev = this.getCurrentView() - 1;
        //    if(prev < 1) prev = this.total;
        //}
        return this
            .setCurrent(prev)
            .updateRows()
        ;
    }

    /**
     * @param {Event} e
     * @return {DatatablePagination}
     */
    goToNext(e) {
        let next = this.next;
        //if(this.canChange(next)) {
        //    next = this.getCurrentView() + 1;
        //    if(next > this.total) next = 1;
        //}
        return this
            .setCurrent(next)
            .updateRows()
        ;
    }

    /**
     * @param {Event} e
     * @return {DatatablePagination}
     */
    changeCurrentByKeyUp(e) {
        if(this.timeOutInt) clearTimeout(this.timeOutInt);
        let
            this_o = this,
            elem = $(e.currentTarget)
        ;
        this.timeOutInt = setTimeout(() => {
            this_o
                .setCurrent(parseInt(elem.val()))
                .updateRows()
            ;
            this_o.timeOutInt = undefined;
        }, co.sec(1));
        return this;
    }

    /**
     * @param {number|undefined} value
     * @return {boolean}
     */
    canChange(value) {
        if(this.total === 1) return false;
        return (!value || value === this.current);

    }

    /**
     * @return {number}
     */
    getCurrentView() {
        let current = this.current || 1;
        if(current > this.total || current < 1) current = 1;
        return current;
    }

    /**
     * @return {DatatablePagination}
     */
    updateTotalItems() {
        this.items = this.datatable.rows.length;
        this.changePagesCount();
        return this;
    }

    /**
     * @param {number} page
     * @return {DatatablePagination}
     */
    goTo(page) {
        if(co.isInt(page)) {
            this.setCurrent(page);
            return this.updateRows();
        }
        return this;
    }

    /**
     * @return {DatatablePagination}
     */
    first() {
        this.setCurrent(1);
        return this.updateRows();
    }

    /**
     * @return {DatatablePagination}
     */
    last() {
        this.setCurrent(this.total);
        return this.updateRows();
    }

    /**
     * @return {DatatablePagination}
     */
    updateRows() {
        if(this.datatable.isInOrder()) {
            this.datatable.run(this.datatable.EVENT_ON_CHANGE_ROWS_TARGET, []);
        } else {
            this.datatable.run(this.datatable.EVENT_ON_CHANGE_ROWS_TARGET, this.rowsTarget);
        }
        return this;
    }

    /**
     * @param {DatatableRow[]} targetRows
     */
    changeTargetByFilter(targetRows) {
        if(this.datatable.isInOrder()) {
            let this_o = this;
            this.rowsTarget.forEach((_key) => {
                let _row = this_o.datatable.rows[(_key - 1)];
                if(_row) _row.show();
            });
        }
    }

    setEvents() {
        let
            this_o = this
        ;
        this.datatable.on(
            this.datatable.EVENT_ON_CHANGE_COUNT_LINE,
            [this,"changeTarget"]
        );
        this.datatable.onAfter(
            this.datatable.EVENT_ON_CHANGE_ROWS_TARGET,
            [this,"changeTargetByFilter"]
        );
        this.dom.find(".datatable-pagination-page-prev")
            .on("click", (e) => {return this_o.goToPrev(e);})
        ;
        this.dom.find(".datatable-pagination-page-next")
            .on("click", (e) => {return this_o.goToNext(e);})
        ;
        this.dom.find(".datatable-pagination-page-input")
            .on("keyup", (e) => {return this_o.changeCurrentByKeyUp(e);})
        ;
    }

}

module.exports = DatatablePagination;