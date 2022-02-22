/**
 * @property {string} current
 */
class Routing {

    constructor() {
        this.current = "";
    }

    /**
     * @return {boolean}
     */
    isInitialized() {
        return !!window.Routing && !co.isEmpty(window.Routing.routes_) && this.getCurrent();
    }

    /**
     * @return {string}
     */
    getCurrent() {
        return this.current;
    }

    /**
     * @param {string} routes
     * @return {boolean}
     */
    isCurrentIn(...routes) {
        return (routes.indexOf(this.getCurrent()) > -1);
    }

    /**
     * @param {string} name
     * @param {{}} opt_params
     * @param {boolean} absolute
     * @return {null|string}
     */
    generate(name, opt_params, absolute) {
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
            this.current = window.jsData.currentRoute;
            delete window.jsData.currentRoute;
        }
    }

}

module.exports = new Routing();