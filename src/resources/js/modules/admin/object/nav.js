/**
 * @property {Admin} Admin
 * @property {jQuery|HTMLElement} dom
 * @property {object} container
 * @property {string} title
 * @property {string} link
 * @property {string|undefined} popup
 * @property {function} clickCb
 * @property {Route|undefined} route
 */
class Nav {

    /**
     * @param {Admin} Admin
     * @param {jQuery|HTMLElement} dom
     * @param {object} container
     * @param {function} clickCb
     * @param {Route|undefined} route
     */
    constructor(
        Admin,
        dom,
        container = undefined,
        clickCb = undefined,
        route = undefined
    ) {
        this.container = container;
        this.Admin = Admin;
        this.dom = $(dom);
        this.title = co.attr(this.dom, "title", false) || co.data(this.dom, "title");
        this.link = this.dom.attr("href");
        this.popup = co.data(this.dom, "popup");
        this.clickCb = clickCb;
        this.route = route;
        this.setEvents();
        //co.log(this);
    }

    setEvents() {
        let
            this_o = this
        ;
        this.dom.on("click", (e) => {
            e.preventDefault();
            if(co.isFunction(this_o.clickCb)) {
                co.runCb(this_o.clickCb,e, this_o, this_o.container);
            } else {
                this_o.runChangeViewRequest();
            }
        });
    }

    /**
     *
     */
    runChangeViewRequest() {
        this.Admin.run(this.Admin.EVENT_VIEW_CHANGE_REQUEST, this.link, undefined, this.route, this.title);
    }

    /**
     * @param {string} link
     * @return {Nav}
     */
    setLink(link) {
        this.link = link;
        this.dom.attr("href", this.link);
        return this;
    }

    /**
     * @param {string|Route} route
     * @return {Nav}
     */
    setRoute(route) {
        this.route = co.router.isRouteInstance(route) ? route : co.router.getRoute(route);
        return this;
    }

    /**
     * @param {string} title
     * @param {boolean} resetAttr
     * @return {Nav}
     */
    setTitle(title, resetAttr = true) {
        this.title = title;
        if(resetAttr) {
            this.dom.attr("title", title);
        }
        return this;
    }

    /**
     * @param {Admin} Admin
     * @param {object} container
     * @param {jQuery|HTMLElement} dom
     * @param {function} clickCb
     * @param {Route|undefined} route
     * @return {Nav|undefined}
     */
    static init(Admin, dom, container = undefined, clickCb = undefined, route = undefined) {
        dom = $(dom);
        if(dom.length && dom.prop("localName") === "a") {
            return new Nav(Admin, dom, container, clickCb, route);
        }
    }

}

module.exports = Nav;