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
        const colvis = {
            extend: 'colvis',
            text: co.translation.trans('columns:visibility'),
        };
        options = (options || {});
        if(options.buttons) {
            let
                colvisIndex = -1
            ;
            for(const _key in options.buttons) {
                const btn = options.buttons[_key];
                if(btn.extend === 'colvis') colvisIndex = _key;
                if(colvisIndex > -1) break;
            }
            if(colvisIndex > -1) {
                options.buttons[colvisIndex].text = colvis.text;
            } else {
                options.buttons.push(colvis);
            }
        } else {
            options.buttons = [colvis];
        }
        return elem.initDataTables(
            settings,
            Object.assign(DEFAULT_OPTIONS, options)
        );
    }

    /**
     * @param {string} text
     * @param {string|{name:string,opt_params:({}|undefined),absolute:(boolean|undefined)}|Array} route
     * @param options
     * @return {*&{action: action, text}}
     */
    button(text, route, options = {}) {
        if(co.isString(route)) {
            route = co.routing.generate(route, {}, true);
        } else if(co.isArray(route)) {
            route = co.routing.generate(route[0], (route[1] || {}), (route[2] || true));
        } else if(co.isObject(route)) {
            route = co.routing.generate(route.name, (route.opt_params || {}), (route.absolute || true));
        }
        const action = options.action;
        delete options.action;
        return {
            text: co.translation.trans(text),
            action: (e, dt, node, config) => {
                co.log(route);
                if(co.isCallable(action)) action(e, dt, node, config, route);
            },
            ...options
        };
    }

}

module.exports = new Datatables;