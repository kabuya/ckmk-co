/**
 * @property {Admin} admin
 * @property {DefaultViewHandler[]} views
 * @property {jQuery|HTMLElement} dom
 */
class DefaultViewsHandler {

    /**
     * @param {Admin} admin
     * @param {View} view
     * @param {DefaultViewHandler[]} views
     */
    constructor(admin, view, views) {
        let this_o = this;
        this.admin = admin;
        this.dom = view.dom;
        this.views = views.filter((item) => {
            item.setParent(this_o);
            item.setEvents();
            item.handleView(view.currentView);
            return item;
        });
    }


}

module.exports = DefaultViewsHandler;