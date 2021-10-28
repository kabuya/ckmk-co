const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} class
 * @property {string} property
 * @property {object[]} items
 */
class DatatableColumnEntityType extends DatatableColumnType {


    static NAME = DatatableColumnType.TYPE_ENTITY;
    

    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
        /** @type {string} class */
        this.class = data.class;
        /** @type {string} property */
        this.property = data.property;
        /** @type {object[]} items */
        this.items = data.items;
    }




}

module.exports = DatatableColumnEntityType;