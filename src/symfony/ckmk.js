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
        if(window.jsData) {
            if(window.jsData.currentRoute) {
                currentRoute = jsData.currentRoute;
                delete jsData.currentRoute;
            }
        }
        BaseCO.initialization(e);
        _thisCo.infos();
        return true;
    }

}

CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE.prototype.document = require("./document");

module.exports = _thisCo = new CO_SYMFONY_JAVASCRIPT_PROJECT_INSTANCE();