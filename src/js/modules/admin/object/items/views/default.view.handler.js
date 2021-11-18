
/**
 * @property {DefaultViewsHandler} parent
 * @property {ViewContent} view
 */
class DefaultViewHandler {


    constructor() {

    }

    /**
     * @param {View} view
     */
    setEvents(view) {
        this.parent.admin.on(this.parent.admin.EVENT_VIEW_LOAD_DISPLAY, [this, "handleView"]);
        this.setEventByMatchedRoute(view.storage.route);
    }


    /**
     * @param {ViewContent} view
     */
    handleView(view) {
        this.view = view;
        this.setEventByMatchedRoute(view.route);
    }

    /**
     * @param {DefaultViewsHandler} parent
     * @return {DefaultViewHandler}
     */
    setParent(parent) {
        if(parent !== this.parent) this.parent = parent;
        return this;
    }

    /**
     * @return {jQuery|HTMLElement}
     */
    getCoreDom() {
        return this.view
            ? this.view.dom
            : this.parent.dom
            ;
    }

    /**
     * @param {Route|undefined} route
     */
    setEventByMatchedRoute(route) {}

}

module.exports = DefaultViewHandler;