/**
 * Load dependencies
 */
require("../js/dependencies/default-dependancies");

/**
 * Import Routing
 */
if(!window.Routing) {
    const Routing = window.Routing = require("@RoutingBundle/js/router").Routing;
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
require("@DatatablesBundle/js/datatables");



/**
 * Export CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE
 * @type {CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE}
 */
module.exports = require('../js/symfony/ckmk');