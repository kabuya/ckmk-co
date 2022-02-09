const Datatables = require('datatables.net');

/**
 * @property {string} queryString
 * @property {object} options
 * @property {object[]} columns
 * @property {string|object|Function} ajax
 * @property {Api<any> | Api | {readonly default: Api<any>}} datatables
 * @property request
 */
class DatatablesConstructor {

    /**
     * @param {string} queryString
     */
    constructor(queryString) {
        this.queryString = queryString;
        this.options = {};
        this.columns = [];
        this.ajax = this.datatables = undefined;
    }

    /**
     * @param {object} column
     * @return {DatatablesConstructor}
     */
    addColumn(column) {
        if(this.datatables) return this;
        if(co.isObject(column)) {
            this.columns.push(column);
        }
        return this;
    }

    /**
     * @param columns
     * @return {DatatablesConstructor}
     */
    addColumns(columns) {
        if(this.datatables) return this;
        if(co.isArray(columns)) {
            this.columns = columns;
        }
        return this;
    }

    /**
     * @param {string|object|Function} ajax
     * @return {DatatablesConstructor}
     */
    setAjax(ajax) {
        if(this.datatables) return this;
        this.ajax = ajax;
        return this;
    }

    /**
     * @param {object} options
     * @return {DatatablesConstructor}
     */
    addOptions(options) {
        if(this.datatables) return this;
        if(co.isObject(options)) {
            this.options = Object.assign(this.options, options);
        }
        return this;
    }

    draw() {
        return this.get().draw();
    }

    get() {
        if(!this.datatables) {
            this.#build();
        }
        return this.datatables;
    }

    /**
     * @param {string} url
     * @param {object} data
     * @param {function} successCB
     * @param {function} errorCB
     * @return {boolean}
     */
    loadData(url, data, successCB, errorCB) {
        if(!this.datatables) return false;
        if(this.request) {
            this.request.abort();
            this.request = undefined;
        }
        let dt = this.datatables;
        this.request = $.ajax({
            url: url,
            type: "POST",
            data: data,
            dataType: "JSON",
            cache: false,
            contentType: false,
            processData: false,
            success: (response, status, xhr) => {
                if(response.data) {
                    if(co.isArray(response.data)) {
                        dt.rows.add(response.data).draw(false);
                    } else if(co.isObject(response.data)) {
                        dt.row.add(response.data).draw(false);
                    }
                }
                if(successCB) successCB(response, status, xhr);
            },
            error: (response, status, error) => {
                if(errorCB) errorCB(response, status, error);
            },
        });
        return true;
    }

    #build() {
        this.options = Object.assign(this.options, {columns:this.columns});
        if(this.ajax) this.options = Object.assign(this.options, {ajax:this.ajax});
        this.datatables = new Datatables(this.queryString, this.options);
    }

}

module.exports = DatatablesConstructor;