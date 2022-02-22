const
    path = require('path'),
    dtBundlesJsPath = path.resolve("./vendor/omines/datatables-bundle/src/Resources/public/js/datatables.js"),
    routingPath = path.resolve('./vendor/friendsofsymfony/jsrouting-bundle/Resources/js/router')
;

/**
 * Load dependencies
 */
require("../js/dependencies/default-dependancies");

/**
 * Import Routing
 */
if(!window.Routing) {
    const Routing = window.Routing = require(routingPath).Routing;
}

/**
 * Import Datatables
 */
if(!window.Datatable) {
    const Datatable = window.Datatable = require('datatables.net');
}
require('datatables.net-buttons')();
require('datatables.net-buttons/js/buttons.colVis')();
/**
 * Add Datatables Bundle JS
 */
require(dtBundlesJsPath);


/**
 * Export CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE
 * @type {CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE}
 */
module.exports = require('../js/symfony/ckmk');