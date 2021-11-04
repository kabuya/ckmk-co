const DatatableColumnType = require("./datatable.column.type");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} class
 * @property {string} property
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
    }


    /**
     * @param {number} value
     * @return {RegExp}
     */
    getSelectedRegexp(value) {
        return new RegExp("((data\-)|option[ ]+)value\=(\'|\")"+ value +"(\'|\")( data\-selected\=(\'|\")(false|true)(\'|\"))?", "gi");
    }

    /**
     * @param {{value:number, title:string}|string|undefined} value
     * @return {string}
     */
    checkValue(value) {
        if(co.isObject(value)) {
            return value.title;
        }
        return super.checkValue(value);
    }

    /**
     * @param {{value:number, title:string}|string|undefined} value
     * @return {number}
     */
    getRawValue(value) {
        if(co.isObject(value)) {
            return value.value;
        }
        return super.getRawValue(value);
    }

    /**
     * @param {{value:number, title:string}|string|undefined} value
     * @param {{value:number, title:string}|string|undefined} rawValue
     * @return {string|number}
     */
    getCompareValue(value, rawValue) {
        if(co.isObject(value) || co.isObject(rawValue)) {
            return (value?.title || rawValue?.title);
        }
        return super.getCompareValue(value, rawValue);
    }

}

module.exports = DatatableColumnEntityType;