const Route = require("./routes/route");

let
    routes = [],
    routesNames = [],
    _routes_
;

class Router {

    constructor() {
        if(window.jsData) {
            _routes_ = window.jsData.routes || [];
            delete window.jsData.routes;
        } else {
            _routes_ = [];
        }
        let this_o = this;
        $.each(_routes_, function (i, route) {
            routes.push(new Route(this_o, route));
            routesNames.push(route.name);
        });
    }

    /**
     * @param {string} name
     * @param {string} values
     * @return {string|undefined}
     */
    path(name, ...values) {
        let _route = this.get(name);
        if(_route) {
            return _route.getPath(...values);
        }
    }

    /**
     * @param {string} name
     * @param {string} values
     * @return {string|undefined}
     */
    absolutePath(name, ...values) {
        let _route = this.get(name);
        if(_route) {
            return _route.getAbsolutePath(...values);
        }
    }

    /**
     * @param {string} name
     * @param {string} method
     * @return {Route|undefined}
     */
    get(name, method = co.ajax.METHOD_GET) {
        return this.getRoute(name, method);
    }

    /**
     * @param {string} name
     * @param {string} method
     * @return {Route|undefined}
     */
    getRoute(name, method = co.ajax.METHOD_GET) {
        let routeFound;
        $.each(routes, function (i, _routeO) {
            if(_routeO.name === name && !routeFound) {
                if(_routeO.method === method) {
                    routeFound = _routeO;
                    return false;
                }
            }
        });
        return routeFound;
    }

    /**
     * @return {Route|undefined}
     */
    getCurrentRoute() {
        let
            currentRoute
        ;
        $.each(this.getRoutes(), (k, route) => {
            if(route.isCurrent() && !currentRoute) {
                currentRoute = route;
                return false;
            }
        });
        return currentRoute;
    }

    /**
     * @return {Route[]}
     */
    getRoutes() {
        return routes;
    }

    /**
     * @return {string[]}
     */
    getRoutesNames() {
        return routesNames;
    }

    /**
     * @param {Route} route
     * @return {boolean}
     */
    isRouteInstance(route) {
        return co.instanceOf(route, Route);
    }

    /**
     * @param {string} link
     * @return {boolean}
     */
    hasLink(link) {
        let
            found = false
        ;
        $.each(routes, (i, route) => {
            if(!route.requireUserParams()) {
                if(route.getAbsolutePath() === link && !found) {
                    found = true;
                    return false;
                }
            }
        });
        return found;
    }

}

module.exports = new Router;