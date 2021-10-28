/**
 * @property {Admin} admin
 * @property {DefaultViewHandler[]} views
 */
class DefaultViewsHandler {

    /**
     * @param {Admin} admin
     * @param {DefaultViewHandler[]} views
     */
    constructor(admin, views) {
        let this_o = this;
        this.admin = admin;
        this.views = views.filter((item) => {
            item.setParent(this_o);
            item.setEvents();
            return item;
        });

        co.log(this);
    }


}

module.exports = DefaultViewsHandler;