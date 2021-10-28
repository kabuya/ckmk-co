/**
 * @property {string|title} title
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} domTitle
 * @property {string} link
 * @property {Route|undefined} route
 * @property {Form[]} forms
 * @property {Datatable[]} tables
 */
class ViewContent {


    /**
     * @param {string|title} title
     * @param {jQuery|HTMLElement} dom
     * @param {jQuery|HTMLElement} domTitle
     * @param {string} link
     * @param {Route|undefined} route
     */
    constructor(
        title,
        dom,
        domTitle,
        link,
        route = undefined
    ) {
        this.dom = $(dom);
        this.domTitle = domTitle;
        this.title = title;
        this.link = link;
        this.route = route;
        this.forms = co.form.getForms();
        this.tables = co.datatable.getDatatables();
    }


    reload() {
        co.admin.run(co.admin.EVENT_VIEW_RELOAD_REQUEST, this.link);
    }

}

module.exports = ViewContent;