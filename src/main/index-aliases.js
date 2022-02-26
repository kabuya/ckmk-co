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
    CKMK: './vendor/@ckmk/CKMKBundle/Resources/public',

    /**
     * This is the base of CKMK Bundle script from local
     * @type {string}
     */
    CKMKLocal: './lib/CKMKBundle/Resources/public',

    /**
     * This is the base of Datatables Bundle script from vendor
     * @type {string}
     */
    Datatables: './vendor/omines/datatables-bundle/src/Resources/public',

    /**
     * This is the base of Routing Bundle script from vendor
     * @type {string}
     */
    Routing: './vendor/friendsofsymfony/jsrouting-bundle/Resources',


};