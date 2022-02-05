/**
 * Require jQuery
 *
 * @type {function(*=): jQuery.fn.init|jQuery}
 */
if(!window.$) {
    const $ = window.$ = window.jQuery = ((window.$) ? window.$ : require('jquery'));
}

/**
 * Require FroalaEditor
 *
 * @type {FroalaEditor|{}}
 */
if(!window.FroalaEditor) {
    const FroalaEditor = window.FroalaEditor = ((window.FroalaEditor) ? window.FroalaEditor : require('froala-editor/js/froala_editor.pkgd.min'));
}

/**
 * Types prototype method
 */
require('./src/js/types/js-types');

/**
 * Export CO_JAVASCRIPT_PROJECT_INSTANCE
 *
 * @type {CO_JAVASCRIPT_PROJECT_INSTANCE}
 */
module.exports = require('./src/js/ckmk');