
/**
 * @property {DefaultViewsHandler} parent
 * @property {ViewContent} view
 */
class DefaultViewHandler {


    constructor() {

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

    /**
     * @return {jQuery|HTMLElement}
     */
    getCoreDom() {
        return this.view
            ? this.view.dom
            : this.parent.dom
        ;
    }

    setEvents() {
        if(this.parent) this.parent.admin.on(this.parent.admin.EVENT_VIEW_LOAD_DISPLAY, [this, "handleView"]);
    }

}

module.exports = DefaultViewHandler;