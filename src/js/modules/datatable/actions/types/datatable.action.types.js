const HTML_CLASS_ROW_TYPE = "datatable-row-type-row";
const HTML_CLASS_GRID_TYPE = "datatable-row-type-grid";

/**
 * @property {DatatableActions} actions
 */
class DatatableActionTypes {



    /**
     * @param {DatatableActions} actions
     */
    constructor(actions) {
        this.actions = actions;
        this.row = this.actions.datatable.dom.find(".datatable-types-item.datatable-type-row");
        this.grid = this.actions.datatable.dom.find(".datatable-types-item.datatable-type-grid");

        this.setEvents();
        //co.log(this);
    }

    /**
     * @param {Event} e
     * @return {boolean}
     */
    setRowType(e) {
        if(this.isRowType()) return false;
        this.actions.datatable.dom
            .removeClass(HTML_CLASS_GRID_TYPE)
            .addClass(HTML_CLASS_ROW_TYPE)
        ;
        this.row.addClass("active");
        this.grid.removeClass("active");
        return true;
    }

    /**
     * @param {Event} e
     * @return {boolean}
     */
    setGridType(e) {
        if(this.isGridType()) return false;
        this.actions.datatable.dom
            .removeClass(HTML_CLASS_ROW_TYPE)
            .addClass(HTML_CLASS_GRID_TYPE)
        ;
        this.grid.addClass("active");
        this.row.removeClass("active");
        return true;
    }

    /**
     * @return {boolean}
     */
    isRowType() {
        return this.actions.datatable.dom.hasClass(HTML_CLASS_ROW_TYPE);
    }

    /**
     * @return {boolean}
     */
    isGridType() {
        return this.actions.datatable.dom.hasClass(HTML_CLASS_GRID_TYPE);
    }

    setEvents() {
        let
            this_o = this
        ;

        this.row.on("click", (e) => {
            return this_o.setRowType(e);
        });

        this.grid.on("click", (e) => {
            return this_o.setGridType(e);
        });
    }


}

module.exports = DatatableActionTypes;