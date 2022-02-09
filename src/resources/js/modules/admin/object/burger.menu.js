const MENU_OPEN_HTML_CLASS = "menu-admin-left-is-open";
const MENU_HIDDEN_TEXT_HIDE_BY_OPACITY = "menu-hidden-text-hide";
const MENU_TEXT_CENTER_HTML_CLASS = "text-center";

/**
 * @property {Admin} Admin
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} menuContent
 * @property {jQuery|HTMLElement} hiddenItems
 * @property {jQuery|HTMLElement} menuTitleContent
 * @property {number} contentWidthFull
 * @property {number} contentWidthShort
 */
class BurgerMenu {


    /**
     * @param {Admin} Admin
     */
    constructor(Admin) {
        this.Admin = Admin;
        this.dom = $(".admin-burger-menu");
        this.menuContent = $(".admin-content-view-menu");
        this.hiddenItems = this.menuContent.find(".admin-project-logo > a, .menu-title, .menu-icon-sub-menu");
        this.menuTitleContent = this.menuContent.find(".menu-title-content");
        this.contentWidthFull = this.menuContent.outerWidth();
        this.contentWidthShort = 47;
        this.menuContent.width(this.contentWidthFull);
        this.setEvents();
        //co.log(this);
    }

    /**
     * @param {Event} e
     */
    toggleOpenMenu(e) {
        let
            this_o = this,
            isOpen = this.menuContent.hasClass(MENU_OPEN_HTML_CLASS)
        ;
        co.timeOutChain((isOpen ? 300 : 50),
            () => {
                if(isOpen) {
                    this_o.menuContent.removeClass(MENU_OPEN_HTML_CLASS);
                    this_o.menuTitleContent.addClass(MENU_TEXT_CENTER_HTML_CLASS);
                    this_o.hiddenItems.addClass(MENU_HIDDEN_TEXT_HIDE_BY_OPACITY);
                    this_o.menuContent.width(this_o.contentWidthShort);
                } else {
                    this_o.menuContent.addClass(MENU_OPEN_HTML_CLASS);
                    this_o.menuTitleContent.removeClass(MENU_TEXT_CENTER_HTML_CLASS);
                    this_o.hiddenItems.removeClass(MENU_HIDDEN_TEXT_HIDE_BY_OPACITY);
                    this_o.menuContent.width(this_o.contentWidthFull);
                }
            },
            () => {
                if(isOpen) {
                    this_o.hiddenItems.hide();
                } else {
                    this_o.hiddenItems.show();
                }
            }
        );
    }


    setEvents() {
        this.dom.on("click", this.toggleOpenMenu.bind(this));
    }

}

module.exports = BurgerMenu;