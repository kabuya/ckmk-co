const BaseCO = require("../base/co-object-base");

let
    /** @type {CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE} _thisCo */
    _thisCo,
    currentRoute
;

class CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE extends BaseCO {

    toString() {
        return "C.K.M.K Symfony Script";
    }

    /**
     * @return {boolean}
     */
    routingExist() {
        return !!window.Routing && !this.isEmpty(Routing.routes_) && this.getCurrentRoute();
    }

    getCurrentRoute() {
        return currentRoute;
    }

    static initialization(e) {
        if(BaseCO.isInitialized()) return false;
        BaseCO.initialization(e);
        _thisCo.routing.initJsData();
        _thisCo.translation.initJsData();
        _thisCo.infos();
        return true;
    }

}

CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE.prototype.document = require("./document");
CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE.prototype.translation = require("./translation");
CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE.prototype.routing = require("./routing");
CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE.prototype.datatables = require("./datatables");

document.addEventListener('DOMContentLoaded', CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE.initialization);

module.exports = _thisCo = new CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE();