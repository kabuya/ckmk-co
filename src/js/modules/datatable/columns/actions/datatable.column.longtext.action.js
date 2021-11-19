const DatatableColumnAction = require("./datatable.column.action");

const HTML_DOM_MORE_CONTENT = [
    "<div class='datatable-body-column-longtext-more-content'>",
        "<i class='fa fa-close datatable-body-column-longtext-more-close'></i>",
    "</div>"
].join("");

/**
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
 * @property {{
 *      id: *,
 *      datatable: string,
 *      row: number,
 *      column: string,
 *      column_position: number,
 *      old_value: string|number,
 * }} data
 * @property {PopupFormCard|undefined} popup
 * @property {DatatableColumnLongtextType} type
 * @property {DatatableRowColumn} column
 * @property {jQuery|HTMLElement} moreContent
 */
class DatatableColumnLongtextAction extends DatatableColumnAction {

    /**
     * @param {DatatableColumnLongtextType} type
     * @param {DatatableRowColumn} column
     */
    constructor(type, column) {
        super(type, column);
        this.updateShowMore();
    }

    updateShowMore() {
        /** @type {jQuery|HTMLElement} moreContent */
        this.moreContent = $(HTML_DOM_MORE_CONTENT).append(this.column.rawValue);
    }

    /**
     * @param {Event} e
     */
    showMore(e) {
        this.datatable.dom.find(".datatable-body-column-longtext-more-content").remove();
        if(!this.column.dom.find(".datatable-body-column-longtext-more-content").length) {
            this.column.dom.append(this.moreContent);
            let this_o = this;
            this.moreContent.on("click", (e) => {e.stopPropagation();});
            this.moreContent.find(".datatable-body-column-longtext-more-close")
                .on("click", (e) => {e.stopPropagation(); return this_o.removeMoreContent();})
            ;
        }
    }

    removeMoreContent() {
        this.moreContent.remove();
    }

    /**
     * @param {Event} e
     */
    showMoreOnClick(e) {
        e.stopPropagation();
        this.showMore(e);
    }

    resetClickMoreContent() {
        let
            this_o = this
        ;
        this.column.dom.find(".datatable-body-column-longtext-more")
            .on("click", (e) => {this_o.showMoreOnClick(e);})
        ;
    }

    setEvents() {
        super.setEvents();
        this.setEventReadMore();
        this.datatable.onAfter(
            co.datatable.EVENT_ON_SEARCH,
            [this, "resetClickMoreContent"]
        );
        this.datatable.on(
            co.datatable.EVENT_ON_CLICK_ON_TABLE_DOM,
            [this, "removeMoreContent"]
        );
    }

    destroy() {
        super.destroy();
        this.datatable.removeAfter(
            co.datatable.EVENT_ON_SEARCH,
            [this, "resetClickMoreContent"]
        );
        this.datatable.removeAfter(
            co.datatable.EVENT_ON_CLICK_ON_TABLE_DOM,
            [this, "removeMoreContent"]
        );
    }

    setEventReadMore() {
        let
            this_o = this
        ;
        this.column.dom.find(".datatable-body-column-longtext-more")
            .on("click", (e) => {this_o.showMoreOnClick(e);})
        ;
    }

}

module.exports = DatatableColumnLongtextAction;