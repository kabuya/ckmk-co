MenuBase = require('./items/menu/menu.base');

const TRANSITION_TIMEOUT = 100;
const CLASS_ADMIN_USER_MENU_SHOW = "admin-user-menu-show";
const CLASS_ADMIN_USER_MENU_OPEN = "admin-user-menu-open";
const CLASS_ADMIN_USER_MENU_BLOCK = "admin-user-menu-block";

/**
 * @property {Admin} Admin
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} menu
 * @property {Li[]} items
 */
class UserMenu extends MenuBase {

    /**
     * @param {Admin} Admin
     */
    constructor(Admin) {
        super();
        this.Admin = Admin;
        this.dom = $(".admin-user");
        this.menu = $(".admin-user-menu-content");
        /** @type {Li[]} items */
        this.items = [];
        this.setEvents();
        this.initLiItem(this.menu.find("ul.menu-container > li"), [this,"clickLiNav"]);

        //co.log(this);
    }

    /**
     * @param {Event} e
     */
    open(e) {
        let
            this_o = this
        ;
        co.timeOutChain(TRANSITION_TIMEOUT,
            () => {this_o.menu.addClass(CLASS_ADMIN_USER_MENU_BLOCK)},
            () => {this_o.menu.addClass(CLASS_ADMIN_USER_MENU_SHOW)},
            () => {this_o.menu.addClass(CLASS_ADMIN_USER_MENU_OPEN)}
        );
    }

    /**
     * @param {Event} e
     */
    close(e = null) {
        let
            this_o = this
        ;
        co.timeOutChain(TRANSITION_TIMEOUT,
            () => {this_o.menu.removeClass(CLASS_ADMIN_USER_MENU_OPEN)},
            () => {this_o.menu.removeClass(CLASS_ADMIN_USER_MENU_SHOW)},
            () => {this_o.menu.removeClass(CLASS_ADMIN_USER_MENU_BLOCK)}
        );
    }

    /**
     * @param {Event} e
     * @param {Nav} nav
     * @param {Li} container
     */
    clickLiNav(e, nav, container) {
        if(container.isRoute("admin:logout")) {
            co.popup.confirm(
                    co.texts.get("admin:logout"),
                    co.texts.get("admin:logout:confirm").getValue(),
                    [this, "logoutUser"]
                )
                .open()
            ;
        } else {
            this.close(e);
            nav.runChangeViewRequest();
        }
        return true;
    }

    logoutUser(response) {
        if(response) {
            let form = $("<form></form>");
            form.attr("action", co.router.get("admin:logout", co.ajax.METHOD_POST).getAbsolutePath());
            form.attr("method", co.ajax.METHOD_POST);
            form.html("<input name='logout-confirm' value='1' />");
            $("body").prepend(form);
            form.submit();
        } else {
            this.close();
        }
    }

    setEvents() {
        this.dom.on("click", this.open.bind(this));
        this.menu.on("click", this.close.bind(this));
        this.menu.find("> ul.menu-container").on("click", (e) => {
            e.stopPropagation();
        });
    }

}

module.exports = UserMenu;