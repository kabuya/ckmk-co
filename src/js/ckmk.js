const BaseCO = require("../base/co-object-base");

let
    /** @type {CO_JAVASCRIPT_PROJECT_INSTANCE} _thisCo */
    _thisCo
;

class CO_JAVASCRIPT_PROJECT_INSTANCE extends BaseCO {


    /**
     * @param {Event} e
     */
    static initialization(e) {
        if(BaseCO.isInitialized()) return false;
        BaseCO.initialization(e);
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.router = require("./modules/routing/router");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.ajax = require("./modules/request/ajax");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.event = require("./modules/events/event.handler");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.texts = require("./modules/translator/texts");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.popup = require("./modules/popup/popup");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.form = require("./modules/form/form");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.datatable = require("./modules/datatable/datatable");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.loader = require("./modules/loading/loader");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.admin = require("./modules/admin/admin");
        CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.lorem = require("./modules/lorem/lorem-ipsum");
        _thisCo.form.init($("form"));
        _thisCo.datatable.init($(".datatable-content"));
        _thisCo.infos();
        return true;
    }
}

CO_JAVASCRIPT_PROJECT_INSTANCE.prototype.document = require("./modules/documents/document-html");

document.addEventListener('DOMContentLoaded', CO_JAVASCRIPT_PROJECT_INSTANCE.initialization);


module.exports = _thisCo = new CO_JAVASCRIPT_PROJECT_INSTANCE();
