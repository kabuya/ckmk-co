const CHILDREN_CONTENT_CLOSE_HTML_CLASS = "menu-items-child-close";
const CHILDREN_CONTENT_OVERFLOW_INITIAL = "overflow-initial";
const FAVICON_PLUS_SQUARE = "fa-plus-square";
const FAVICON_MINUS_SQUARE = "fa-minus-square";
const ICON_NOTIFICATION_DISTINCT_HTML_CLASS = "icon-menu-notification";
const ICON_CHILD_ACTIVE_NOTIFICATION = "<i class='fa fa-circle "+ ICON_NOTIFICATION_DISTINCT_HTML_CLASS +"'></i>"

/**
 * @property {Admin} Admin
 * @property {Menu} Menu
 * @property {Li} parent
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} domChildren
 * @property {function} clickNavCb
 * @property {string} name
 * @property {Li[]} children
 * @property {Route} route
 */
class Li {

    /**
     * @param {Menu|UserMenu|object} Menu
     * @param {jQuery|HTMLElement} dom
     * @param {function|undefined} clickNavCb
     * @param {function|undefined} clickLiCb
     * @param {Li|undefined} parent
     */
    constructor(
        Menu,
        dom,
        clickNavCb = undefined,
        clickLiCb = undefined,
        parent = undefined
    ) {
        this.dom = $(dom);
        this.Admin = Menu.Admin;
        this.Menu = Menu;
        this.clickLiCb = clickLiCb;
        this.route = co.router.get(co.data(this.dom, "route"), co.ajax.METHOD_POST);
        this.name = co.data(this.dom, "name");
        this.Nav = Menu.Admin.initNav(this.dom.find("> a"), this, clickNavCb, this.route);
        this.parent = parent;
        this.children = [];
        this.setChildren();
        this.setEvents();
        //co.log(this);
    }

    /**
     * @return {Li}
     */
    getParent() {
        return this.parent;
    }

    /**
     * @return {boolean}
     */
    hasParent() {
        return co.isObject(this.parent);
    }

    setChildren() {
        let
            this_o = this,
            domChildren = this.dom.find("> ul.menu-item-items"),
            lis = domChildren.find("> li")
        ;
        lis.each((k, li) => {
            li = $(li);
            this_o.children.push(new Li(this_o.Menu, li, this_o.clickNavCb, this_o.clickLiCb, this_o));
        });
        if(this.children.length) {
            this.domChildren = domChildren;
            this.domChildren.css({
                height: (lis.length * $(lis[0]).outerHeight())
            });
        }
    }


    /**
     * @return {Li[]}
     */
    getChildren() {
        return this.children;
    }

    /**
     * @return {boolean}
     */
    hasChildren() {
        return this.children.length > 0;
    }

    /**
     * @return {boolean}
     */
    hasChildActive() {
        let
            childActive = false
        ;
        $.each(this.children, (k, li) => {
            if((li.isActive() || li.hasChildActive()) && !childActive) {
                childActive = true;
                return true;
            }
        });
        return childActive;
    }

    isChildrenDisplayed() {
        if(this.domChildren) {
            return !this.domChildren.hasClass(CHILDREN_CONTENT_CLOSE_HTML_CLASS);
        }
        return false;
    }

    toggleParentShowChildren() {
        if(this.parent) {
            this.parent.toggleShowChildren();
        }
    }

    toggleShowChildren() {
        if(this.domChildren) {
            let
                this_o = this,
                icon = this.dom.find("> .menu-title-content").find("> .menu-icon-sub-menu i")
            ;
            if(this.isChildrenDisplayed()) {
                this.toggleNotificationChildActive(true);
                this.domChildren.addClass(CHILDREN_CONTENT_CLOSE_HTML_CLASS);
                icon.removeClass(FAVICON_MINUS_SQUARE).addClass(FAVICON_PLUS_SQUARE);
                co.timeOutChain(300, () => {this_o.domChildren.removeClass(CHILDREN_CONTENT_OVERFLOW_INITIAL)});
            } else {
                this.toggleNotificationChildActive(false);
                this.domChildren.removeClass(CHILDREN_CONTENT_CLOSE_HTML_CLASS);
                icon.removeClass(FAVICON_PLUS_SQUARE).addClass(FAVICON_MINUS_SQUARE);
                this.toggleParentShowChildren();
                co.timeOutChain(300, () => {this_o.domChildren.addClass(CHILDREN_CONTENT_OVERFLOW_INITIAL)});
            }
        }
    }

    /**
     * @param {boolean} append
     */
    toggleNotificationChildActive(append) {
        if(this.hasChildren()) {
            let
                titleDom = this.dom.find("> .menu-title-content").find(".menu-title")
            ;
            if(append) {
                if(this.hasChildActive()) {
                    titleDom.after(ICON_CHILD_ACTIVE_NOTIFICATION);
                }
            } else {
                let
                    iconNotification = titleDom.next()
                ;
                if(iconNotification.hasClass(ICON_NOTIFICATION_DISTINCT_HTML_CLASS)) {
                    iconNotification.remove();
                }
            }
        }
    }

    /**
     * @param {string} link
     */
    active(link) {
        if(this.Nav && !this.isActive()) {
            if(this.Nav.link === link) {
                this.Admin.run(this.Admin.EVENT_MENU_ACTIVE, this, link);
                return true;
            }
        }
        if(this.route && this.route.isRoute("admin:dashboard")) {
            if((new RegExp("^" + link)).test(this.Nav.link)) {
                this.Admin.run(this.Admin.EVENT_MENU_ACTIVE, this, link);
                return true;
            }
        }
        this.dom.removeClass("menu-active");
        return false;
    }

    /**
     * @param {Li} li
     */
    setActive(li) {
        if(li !== this) {
            this.dom.removeClass("menu-active");
        } else {
            this.dom.addClass("menu-active");
            this.toggleParentShowChildren();
        }
    }

    /**
     * @return {boolean}
     */
    isActive() {
        return this.dom.hasClass("menu-active");
    }

    /**
     * @param {ViewContent} view
     */
    changeTitle(view) {
        if(!view.title || view.domTitle.text() === "...") {
            if(this.Nav && this.Nav.link === view.link) {
                let
                    text = this.dom.text().trim()
                ;
                view.title = text;
                view.domTitle.find("h1").attr("title", text);
                view.domTitle.find("h1").html(text);
            }
        }
    }

    setEvents() {
        this.Admin.on(this.Admin.EVENT_MENU_ACTIVE, [this, "setActive"]);
        this.Admin.on(this.Admin.EVENT_VIEW_CHANGE_START, [this, "active"]);
        this.Admin.on(this.Admin.EVENT_VIEW_LOAD_DISPLAY, [this, "changeTitle"]);
        if(!this.Nav && co.isFunction(this.clickLiCb)) {
            let this_o = this;
            this.dom.find("> .menu-title-content").on("click", function (e) {
                this_o.toggleShowChildren();
                return co.runCb(this_o.clickLiCb, e, this_o);
            });
        }
    }

    /**
     * @param {string} route
     * @return {boolean}
     */
    isRoute(route) {
        if(this.route) {
            return this.route.isRoute(route);
        }
        return false;
    }

}

module.exports = Li;