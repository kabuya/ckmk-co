MenuBase = require('./items/menu/menu.base');

/**
 * @property {Admin} Admin
 * @property {jQuery|HTMLElement} dom
 * @property {Li[]} items
 * @function initLiItem
 */
class Menu extends MenuBase {

    /**
     * @param {Admin} Admin
     */
    constructor(Admin) {
        super();
        this.Admin = Admin;
        this.dom = $(".admin-content-view-menu");
        this.items = [];
        this.initLiItem(this.dom.find("ul.menu-group-items > li"), undefined, [this, "toggleOpenChildrenContent"]);

        // co.log(this);
    }


    /**
     * @param {Event} e
     * @param {Li} li
     */
    toggleOpenChildrenContent(e, li) {

    }

}

module.exports = Menu;