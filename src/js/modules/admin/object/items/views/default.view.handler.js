
/**
 * @property {DefaultViewsHandler} parent
 * @property {ViewContent} view
 */
class DefaultViewHandler {


    constructor() {

    }

    setEvents() {
        this.parent.admin.on(this.parent.admin.EVENT_VIEW_LOAD_DISPLAY, [this, "handleView"]);
    }

    /**
     * @param {ViewContent} view
     */
    handleView(view) {
        this.view = view;
    }

    /**
     * @param {DefaultViewsHandler} parent
     * @return {DefaultViewHandler}
     */
    setParent(parent) {
        if(parent !== this.parent) this.parent = parent;
        return this;
    }

}

module.exports = DefaultViewHandler;