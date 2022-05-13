/**
 * Require jQuery
 *
 * @type {function(*=): jQuery.fn.init|jQuery}
 */
if(!window.$) {
    const $ = window.$ = window.jQuery = ((window.$) ? window.$ : require('jquery'));
}


/**
 * @type {{readonly default: Cropper}}
 */
if(!window.Cropper) {
    const Cropper = window.Cropper = require("cropperjs");
}

/**
 * Popper JS est utilisé par Bootstrap JS
 *
 * Popper JS is used by Bootstrap JS
 */
require('popper.js');

/**
 * Bootstrap JS
 */
require('bootstrap');

/**
 * Types prototype method
 */
require('../types/js-types');
