/**
 * Require jQuery
 *
 * @type {function(*=): jQuery.fn.init|jQuery}
 */
const $ = window.$ = window.jQuery = ((window.$) ? window.$ : require('jquery'));

/**
 * Require FroalaEditor
 *
 * @type {FroalaEditor|{}}
 */
const FroalaEditor = window.FroalaEditor = ((window.FroalaEditor) ? window.FroalaEditor : require('froala-editor/js/froala_editor.pkgd.min'));

/**
 * Types prototype method
 */
require('./src/js/types/js-types');

/**
 * Require CO
 *
 * @type {CO_JAVASCRIPT_PROJECT_INSTANCE}
 */
const co = window.co = require('./src/js/ckmk');

// Exports CO
module.exports = co;