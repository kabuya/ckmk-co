const DatatableActionSearchItem = require("./items/datatable.action.search.item");

/**
 * @property {DatatableActions} actions
 * @property {DatatableActionSearchItem[]} items
 * @property {number} resultCount
 * @property {jQuery|HTMLElement} resultRow
 * @property {boolean} resultAppended
 */
class DatatableActionSearch {

    //Trouvez le moyer de capter l'avant et l'après
    //Évênnement exécuté...

    /**
     * @param {DatatableActions} actions
     */
    constructor(actions) {
        this.actions = actions;
        /** @type {DatatableActionSearchItem[]} items */
        this.items = [];
        this.resultAppended = false;
        this.resultCount = 0;
        this.resultRow = $([
            "<tr>",
                "<td class='datatable-search-row-count-error'",
                    "colspan='"+ this.actions.datatable.columns.length +"'",
                ">",
                "</td>",
            "</tr>"
        ].join(""));
        this.initItems();
        this.setEvents();
    }

    buildSearch() {
        let
            /** @type {({
             *     column: string,
             *     value: string[]
             * })[]} values */
            values = [],
            method
        ;
        this.items.forEach((item) => {
            if(!method) method = item.method;
            item.columns.forEach((column) => {
                let
                    _value = values.filter((__value) => {return column.name === __value.column})[0]
                ;
                if(!_value) {
                    _value = {
                        column : column.name,
                        value : [],
                    };
                    values.push(_value);
                }
                if(item.value && _value.value.indexOf(item.value) === -1) {
                    _value.value.push(item.value);
                }
            });
        });
        this.search(values, method);
    }

    /**
     * @param {boolean} success
     */
    removeSearchIfDatatableHasNotRows(success) {
        if(success) {
            if(!this.actions.datatable.hasItems()) {
                this.#removeAllSearch();
            }
        }
    }

    /**
     * @param {boolean} success
     */
    buildSearchAgain(success) {
        if(success) {
            if(this.actions.datatable.hasItems()) {
                this.items.forEach((_item) => {_item.enable();});
                this.buildSearch();
            }
        }
    }

    /**
     * @param {({
     *     column: string,
     *     value: string[]
     * })[]} values
     * @param {Route|boolean} method
     */
    search(values, method) {
        let
            hasValue = (values.filter((_v) => {return _v.value.length > 0;}).length > 0)
        ;
        this.resultCount = 0;
        if(co.isBool(method)) {
            this.actions.datatable.run(
                this.actions.datatable.EVENT_ON_SEARCH,
                values,
                hasValue
            );
        } else {

        }
    }

    /**
     * @param {number} count
     */
    addResultCount(count) {
        this.resultCount += count;
        if(!this.resultAppended) {
            this.resultAppended = true;
            this.forceRemove = false;
            this.actions.datatable.dom.find("tbody").prepend(this.resultRow);
        }
        this.resultRow.find("td").text(this.getResultMatch());
    }

    /**
     * @param {({
     *     column: string,
     *     value: string[]
     * })[]} values
     * @param {boolean} _hasValue
     */
    removeResultCount(values, _hasValue) {
        if(!_hasValue && this.resultAppended) {
            this.#reset();
        }
    }

    /**
     * @return {string}
     */
    getResultMatch() {
        if(co.texts.has("datatable:search:count:item:title")) {
            return co.texts.get("datatable:search:count:item:title", this.resultCount).getValue();
        }
        return this.resultCount + " result"+ (this.resultCount > 1 ? "s" : "") +" matched";
    }

    initItems() {
        let
            this_o = this,
            searchCores = this.actions.datatable.dom.find(".datatable-search-core")
        ;
        searchCores.each((k, item) => {
            this_o.items.push(new DatatableActionSearchItem(this_o, item));
        });
    }

    #removeAllSearch() {
        this.items.forEach((_item) => {
            _item.empty();
        });
        this.#reset();
    }

    #reset() {
        this.resultAppended = false;
        this.#removeResultShow();
    }

    #removeResultShow() {
        this.resultRow.find("td").text("");
        this.resultRow.remove();
    }

    setEvents() {
        this.actions.datatable.on(
            this.actions.datatable.EVENT_ON_SEARCH_RESULT_COUNT,
            [this, "addResultCount"]
        );

        this.actions.datatable.onAfter(
            this.actions.datatable.EVENT_ON_SEARCH,
            [this, "removeResultCount"]
        );

        this.actions.datatable.onAfter(
            this.actions.datatable.EVENT_ON_AFTER_ADDING_ITEM,
            [this, "buildSearchAgain"]
        );

        this.actions.datatable.onAfter(
            this.actions.datatable.EVENT_ON_AFTER_REMOVING_ITEM,
            [this, "removeSearchIfDatatableHasNotRows"]
        );

        this.actions.datatable.onAfter(
            this.actions.datatable.EVENT_ON_TOGGLE_COLUMN_DISPLAY,
            [this, "buildSearch"]
        );

        this.actions.datatable.onAfter(
            this.actions.datatable.EVENT_ON_TOGGLE_ACTIVE_ALL_COLUMN,
            [this, "buildSearchAgain"]
        );
    }


}

module.exports = DatatableActionSearch;