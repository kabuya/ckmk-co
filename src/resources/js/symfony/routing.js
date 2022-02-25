let
    /** @type {string} */
    current
;
class Routing {

    constructor() {
    }

    /**
     * @return {boolean}
     */
    isInitialized() {
        return !!window.Routing && !co.isEmpty(window.Routing.routes_) && this.current();
    }

    /**
     * @return {string}
     */
    current() {
        return current;
    }

    /**
     * @param {string} routes
     * @return {boolean}
     */
    isCurrentIn(...routes) {
        return (routes.indexOf(this.current()) > -1);
    }

    /**
     * @param {string} name
     * @param {{}} opt_params
     * @param {boolean} absolute
     * @return {null|string}
     */
    generate(name, opt_params = {}, absolute = true) {
        if(!this.isInitialized()) return null;
        return window.Routing.generate(name, opt_params, absolute);
    }

    /**
     * @return {*}
     */
    getRouting() {
        return window.Routing;
    }

    initJsData() {
        if(window.jsData && window.jsData.currentRoute) {
            current = window.jsData.currentRoute;
            delete window.jsData.currentRoute;
        }
    }

}

module.exports = new Routing();