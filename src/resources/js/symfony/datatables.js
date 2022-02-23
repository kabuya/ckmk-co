const DEFAULT_OPTIONS = {
    scrollX: false,
    scrollY: false,
};

class Datatables {

    constructor() {

    }

    /**
     * @param {string} selector
     * @param {{}} options
     * @return {Promise<any>}
     */
    build(selector, options) {
        const elem = $(selector);
        const settings = co.parseJSONFromPHPDataProperty(co.data(elem, "datatables-settings"));
        return elem.initDataTables(
            settings,
            Object.assign(DEFAULT_OPTIONS, (options || {}))
        );
    }

    /**
     * @param {string} text
     * @param {string|{name:string,opt_params:{},absolute:boolean}|Array} route
     * @param options
     * @return {*&{action: action, text}}
     */
    button(text, route, options) {
        if(co.isString(route)) {
            route = co.routing.generate(route);
        } else if(co.isArray(route)) {
            route = co.routing.generate(route[0], route[1], route[2]);
        } else if(co.isObject(route)) {
            route = co.routing.generate(route.name, route.opt_params, route.absolute);
        }
        const action = options.action;
        delete options.action;
        return {
            text: text,
            action: (e, dt, node, config) => {
                co.log(route);
                action(e, dt, node, config, route);
            },
            ...options
        };
    }

}

module.exports = new Datatables;