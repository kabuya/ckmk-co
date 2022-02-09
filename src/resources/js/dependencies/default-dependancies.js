/**
 * Require jQuery
 *
 * @type {function(*=): jQuery.fn.init|jQuery}
 */
if(!window.$) const $ = window.$ = window.jQuery = ((window.$) ? window.$ : require('jquery'));

/**
 * Require FroalaEditor
 *
 * @type {FroalaEditor|{}}
 */
if(!window.FroalaEditor) const FroalaEditor = window.FroalaEditor = ((window.FroalaEditor) ? window.FroalaEditor : require('froala-editor/js/froala_editor.pkgd.min'));

/**
 * Import Datatables
 */
if(!window.Datatable) const Datatable = window.Datatable = require('datatables.net');

/**
 * Types prototype method
 */
require('../types/js-types');