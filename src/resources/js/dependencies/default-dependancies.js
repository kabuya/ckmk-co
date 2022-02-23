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
 * Add font awesome JS
 */
require('@fortawesome/fontawesome-free/js/brands');
require('@fortawesome/fontawesome-free/js/solid');
require('@fortawesome/fontawesome-free/js/fontawesome');

/**
 * Types prototype method
 */
require('../types/js-types');
