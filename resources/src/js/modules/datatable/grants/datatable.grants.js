/**
 * @property {Datatable} datatable
 * @property {boolean} read
 * @property {boolean} create
 * @property {boolean} update
 * @property {boolean} delete
 */
class DatatableGrants {


    /**
     * @param {Datatable} datatable
     * @param {{
     *     read : boolean,
     *     create : boolean,
     *     update : boolean,
     *     delete : boolean,
     * }} data
     */
    constructor(datatable, data) {
        this.datatable = datatable;
        this.read = !!data.read;
        this.create = !!data.create;
        this.update = !!data.update;
        this.delete = !!data.delete;
    }

    /**
     * @return {boolean}
     */
    isRead() {
        return this.read;
    }

    /**
     * @return {boolean}
     */
    isCreate() {
        return this.create;
    }

    /**
     * @return {boolean}
     */
    isUpdate() {
        return this.update;
    }

    /**
     * @return {boolean}
     */
    isDelete() {
        return this.delete;
    }

}

module.exports = DatatableGrants;