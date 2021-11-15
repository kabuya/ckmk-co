const KEY_STORAGE_DATA = "__UNNOc2YfB1QWAw3XtsIpNrllbDzAcu0GokP7ISVf__";
const PREFIX_STORAGE_KEY = "kv86LbM1rgyhRxt1LntM.admin.view.storage.data.";

let
    __data__ = {}
;

/**
 * @property {View} view
 * @property {string|undefined} path
 * @property {object|undefined} data
 * @property {Route|undefined} route
 * @property {string|undefined} title
 */
class ViewStorage {

    /**
     * @param {View} view
     */
    constructor(view) {
        this.initData();
        this.view = view;
        /** @type {string|undefined} path */
        this.path = this.val("path");
        /** @type {object|undefined} data */
        this.data = this.val("data");
        /** @type {Route|undefined} route */
        this.route = this.val("route");
        /** @type {string|undefined} title */
        this.title = this.val("title");
        this.checkPath();
        //co.log(this);
    }

    /**
     * @param {string} key
     */
    key(key) {
        if(co.isString(key) && key) {
            return PREFIX_STORAGE_KEY + key;
        }
        return PREFIX_STORAGE_KEY;
    }

    /**
     * @param {string} key
     * @param {*} defaultValue
     */
    val(key, defaultValue = undefined) {
        let value = __data__[this.key(key)] || defaultValue;
        if(value) {
            if(key === "data") {
                value = co.jsonToObject(value);
            } else if (key === "route") {
                let routeData = value.split("||");
                value = co.router.getRoute(routeData[0], routeData[1]);
            }
        }
        return value;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @return {ViewStorage}
     */
    updateVal(key, value) {
        __data__[this.key(key)] = value;
        localStorage[KEY_STORAGE_DATA] = co.objectToJson(__data__);
        return this;
    }

    /**
     * @param {string|undefined} path
     * @param {object|undefined} data
     * @param {Route|undefined} route
     * @param {string|undefined} title
     * @return {ViewStorage}
     */
    update(
        path = undefined,
        data = undefined,
        route = undefined,
        title = undefined
    ) {
        return this
            .setPath(path)
            .setData(data)
            .setRoute(route)
            .setTitle(title)
        ;
    }

    /**
     * @return {boolean}
     */
    requireChange() {
        return (co.isString(this.path) && window.location.href !== this.path);
    }

    /**
     * @param {string|undefined} path
     * @return {ViewStorage}
     */
    setPath(path) {
        this.path = path || this.path;
        this.updateVal("path", this.path);
        return this;
    }

    /**
     * @param {object|undefined} data
     * @return {ViewStorage}
     */
    setData(data) {
        this.data = data || this.data;
        this.updateVal("data", this.data ? co.objectToJson(this.data) : undefined);
        return this;
    }

    /**
     * @param {Route|undefined} route
     * @return {ViewStorage}
     */
    setRoute(route) {
        this.route = route || this.route;
        this.updateVal("route", this.route ? this.route.name : undefined);
        return this;
    }

    /**
     * @param {string|undefined} title
     * @return {ViewStorage}
     */
    setTitle(title) {
        this.title = title || this.title;
        this.updateVal("title", this.title);
        return this;
    }

    checkPath() {
        if(this.route) {
            let routePath = this.route.getAbsolutePath();
            if(routePath !== this.path) this.path = routePath;
        }
    }


    initData() {
        __data__ = co.jsonToObject(localStorage[KEY_STORAGE_DATA] || "{}");
    }

}

module.exports = ViewStorage;