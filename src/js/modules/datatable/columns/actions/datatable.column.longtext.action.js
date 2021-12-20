const DatatableColumnAction = require("./datatable.column.action");

const HTML_DOM_MORE_CONTENT = [
    "<button class='datatable-body-column-longtext-more-content'>",
        "<i class='fa fa-close datatable-body-column-longtext-more-close'></i>",
    "</button>"
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
            this.moreContent.focus();
            this.moreContent.on("focusout", this.removeMoreContent.bind(this));
            this.moreContent.find(".datatable-body-column-longtext-more-close")
                .on("click", this.removeMoreContent.bind(this))
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
        this.showMore(e);
    }

    resetClickMoreContent() {
        this.column.dom.find(".datatable-body-column-longtext-more")
            .on("click", this.showMoreOnClick.bind(this))
        ;
    }

    setEvents() {
        super.setEvents();
        this.setEventReadMore();
        this.datatable.onAfter(
            co.datatable.EVENT_ON_SEARCH,
            [this, "resetClickMoreContent"]
        );
    }

    destroy() {
        super.destroy();
        this.datatable.removeAfter(
            co.datatable.EVENT_ON_SEARCH,
            [this, "resetClickMoreContent"]
        );
    }

    setEventReadMore() {
        this.column.dom.find(".datatable-body-column-longtext-more")
            .on("click", this.showMoreOnClick.bind(this))
        ;
    }

}

module.exports = DatatableColumnLongtextAction;