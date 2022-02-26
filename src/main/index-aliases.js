const {CKMKBundle, DatatablesBundle, CKMKBundleLocal, RoutingBundle} = require("../resources/js/symfony/aliasses");

/**
 * This is the aliasses for Webpack
 * @type {{
 *      CKMK: string,
 *      CKMKLocal: string,
 *      Datatables: string,
 *      Routing: string,
 * }}
 */
module.exports = {

    /**
     * This is the base of CKMK Bundle script from vendor
     * @type {string}
     */
    CKMK: CKMKBundle,

    /**
     * This is the base of CKMK Bundle script from local
     * @type {string}
     */
    CKMKLocal: CKMKBundleLocal,

    /**
     * This is the base of Datatables Bundle script from vendor
     * @type {string}
     */
    Datatables: DatatablesBundle,

    /**
     * This is the base of Routing Bundle script from vendor
     * @type {string}
     */
    Routing: RoutingBundle,

};